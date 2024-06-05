import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { Logger } from '@nuvei/util';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import setupRoutes from './setup-routes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logger = await Logger.init('@nuvei/extension-api');

const app = express();

const port = process.env.EXTENSION_API_PORT ?? 3000;
logger.debug(process.env.EXTENSION_API_PORT ? `Using port from environment: ${port}` : `Using default port: ${port}`);

app.disable('x-powered-by');
app.use(express.json());

app.use(
    helmet({
        xPoweredBy: false,
        contentSecurityPolicy: false
    })
);

const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
        // Configure Morgan to use our custom logger with the http severity
        write(message: string) {
            logger.http(message.trim());
        }
    }
});

app.use(morganMiddleware);

app.use('/', express.static(path.join(__dirname, '../src/public')));

setupRoutes(app);

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});

// To use with GCF
export const extensionApi = app;
