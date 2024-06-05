/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * LoggerInterface
 *
 *  @remarks
 *  RFC5424: severity of all levels is assumed to be numerically ascending from most important to least important.
 *  RFC5424: https://tools.ietf.org/html/rfc5424
 *
 *  @example
 *  error: 0,
 *  warn: 1,
 *  info: 2,
 *  http: 3,
 *  verbose: 4,
 *  debug: 5,
 *  silly: 6
 */

export interface LoggerInterface {
    error(message: string, ...meta: any[]): void;
    warn(message: string, ...meta: any[]): void;
    info(message: string, ...meta: any[]): void;
    http(message: string, ...meta: any[]): void;
    verbose(message: string, ...meta: any[]): void;
    debug(message: string, ...meta: any[]): void;
    silly(message: string, ...meta: any[]): void;
}
