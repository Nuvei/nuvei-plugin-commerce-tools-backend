import type * as winston from 'winston';
import type { LoggerInterface } from './logger-interface.js';

export type LoggerConfig = {
    console?: {
        level?: string;
    };
};

let createLogger: typeof import('winston').createLogger;
let winstonFormat: typeof import('winston').format;
let winstonTransports: typeof import('winston').transports;

export class WinstonLogger implements LoggerInterface {
    private static instance: LoggerInterface;

    /**
     * Initializes the logger
     *
     * @remarks This method must be called before using the logger - dynamically importing is needed in case of using OpenTelemetry's tracing instrumentation
     *
     * @param serviceNameConfig  The name of the service that will be used in the logs
     * @param config  The configuration for the logger
     * @returns  The logger instance
     */
    public static async init(serviceNameConfig: string, config?: LoggerConfig): Promise<LoggerInterface> {
        if (WinstonLogger.instance) {
            return WinstonLogger.instance;
        }

        const serviceName = serviceNameConfig ?? 'unknown-service';

        const winston = await import('winston');

        ({ createLogger } = winston);
        winstonFormat = winston.format;
        winstonTransports = winston.transports;

        WinstonLogger.instance = WinstonLogger.createLoggerInstance(serviceName, config, winston.config.npm.levels);

        return WinstonLogger.instance;
    }

    public static get(): LoggerInterface {
        if (!WinstonLogger.instance) {
            throw new Error('LoggerFactory not initialized');
        }

        return WinstonLogger.instance;
    }

    private static createLoggerInstance(serviceName: string, config?: LoggerConfig, logLevels?: Record<string, number>): LoggerInterface {
        if (config?.console?.level && !this.isValidLogLevel(config.console.level)) {
            throw new Error(`Invalid log level: ${config.console.level}`);
        }

        const mergedConfig = {
            console: {
                level: 'debug',
                ...config?.console
            }
        };

        const options = {
            levels: logLevels
        };

        const logger = createLogger(options);

        const loggerConsoleTransport = this.createConsoleLogger(serviceName, mergedConfig.console.level);

        logger.add(loggerConsoleTransport);

        // Disable if running in GCP Cloud Functions
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (!(process.env.K_SERVICE || process.env.K_REVISION || process.env.FUNCTION_TARGET)) {
            const errorLogDir = 'logs/';
            const serviceNameSanitized = serviceName.replaceAll(/[^\w-]/g, '_').toLowerCase();
            const currentDate = new Date().toISOString().split('T')[0]; // This will give you just the date in 'YYYY-MM-DD' format
            const errorLogFilename = `${errorLogDir}error-${serviceNameSanitized}-${currentDate}.log`;
            const combinedLogFilename = `${errorLogDir}combined-${serviceNameSanitized}-${currentDate}.log`;

            const loggerFileTransports = this.createFileLogger(serviceName, errorLogFilename, combinedLogFilename);

            logger.add(loggerFileTransports.error);
            logger.add(loggerFileTransports.combined);
        }

        logger.info('Winston successfully attached at %s with level: \n %s', new Date(), mergedConfig.console.level);
        return new WinstonLogger(logger);
    }

    private static createFileLogger(
        serviceName: string,
        errorLogFilename: string,
        combinedLogFilename: string
    ): {
        error: typeof winstonTransports.File;
        combined: typeof winstonTransports.File;
    } {
        const formatFileLogs = winstonFormat.combine(
            winstonFormat.errors({ stack: true }),
            winstonFormat.metadata(),
            winstonFormat.splat()
        );

        const loggerErrorFileTransport = new winstonTransports.File({
            filename: errorLogFilename,
            level: 'error',
            format: formatFileLogs
        });

        const loggerCombinedFileTransport = new winstonTransports.File({
            filename: combinedLogFilename,
            level: 'debug',
            format: formatFileLogs
        });

        return {
            combined: loggerCombinedFileTransport,
            error: loggerErrorFileTransport
        };
    }

    private static createConsoleLogger(serviceName: string, consoleLevel: string): typeof winstonTransports.Console {
        const formatFriendly = winstonFormat.combine(
            winstonFormat.colorize(),
            winstonFormat.timestamp(),
            winstonFormat.align(),
            winstonFormat.splat(),
            winstonFormat.errors({ stack: true }),
            winstonFormat.printf(info => {
                return `${info.timestamp} - ${info.level}: ${info.message} ${JSON.stringify({
                    service: serviceName,
                    ...info.metadata
                })}}`;
            })
        );

        return new winstonTransports.Console({
            level: consoleLevel,
            format: formatFriendly
        });
    }

    private static isValidLogLevel(level: string): boolean {
        return ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'].includes(level);
    }

    private constructor(protected readonly logger: winston.Logger) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public error(message: string, ...meta: any[]): void {
        this.logger.error(message, ...meta);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public warn(message: string, ...meta: any[]): void {
        this.logger.warn(message, ...meta);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public info(message: string, ...meta: any[]): void {
        this.logger.info(message, ...meta);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public http(message: string, ...meta: any[]): void {
        this.logger.http(message, ...meta);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public verbose(message: string, ...meta: any[]): void {
        this.logger.verbose(message, ...meta);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public debug(message: string, ...meta: any[]): void {
        this.logger.debug(message, ...meta);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public silly(message: string, ...meta: any[]): void {
        this.logger.silly(message, ...meta);
    }
}
