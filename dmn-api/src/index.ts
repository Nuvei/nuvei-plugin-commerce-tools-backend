import process from 'node:process';
import dotenv from 'dotenv';
import express from 'express';
import CommercetoolsClient from '@nuvei/commercetools-client';
import helmet from 'helmet';
import { Logger } from '@nuvei/util';
import morgan from 'morgan';
import setupRoutes from './setup-routes.js';

const logger = await Logger.init('@nuvei/dmn-api');

dotenv.config();

const { env: ENV } = process;

const commercetoolsConfig = {
    clientId: ENV.CTP_CLIENT_ID ?? '',
    clientSecret: ENV.CTP_CLIENT_SECRET ?? '',
    projectKey: ENV.CTP_PROJECT_KEY ?? '',
    apiUrl: ENV.CTP_API_URL ?? 'https://api.europe-west1.gcp.commercetools.com',
    authUrl: ENV.CTP_AUTH_URL ?? 'https://auth.europe-west1.gcp.commercetools.com',
    extensionAuthUser: ENV.CT_EXTENSION_AUTH_USER ?? '',
    extensionAuthPassword: ENV.CT_EXTENSION_AUTH_PASSWORD ?? ''
};

const commerceToolsClient = CommercetoolsClient(commercetoolsConfig);

const port = ENV.DMN_API_PORT ?? 3001;
logger.debug(process.env.EXTENSION_API_PORT ? `Using port from environment: ${port}` : `Using default port: ${port}`);

const app = express();
app.disable('x-powered-by');

app.use(helmet());

const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
        // Configure Morgan to use our custom logger with the http severity
        write(message: string) {
            logger.http(message.trim());
        }
    }
});

app.use(morganMiddleware);

app.use(express.urlencoded({ extended: false }));

setupRoutes(commerceToolsClient)(app);

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});
// To use with GCF
export const dmnApi = app;
