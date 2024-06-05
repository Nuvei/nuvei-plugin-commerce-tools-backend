import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';
import CommercetoolsClient from '@nuvei/commercetools-client';
import { syncCustomTypes } from './sync-custom-types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadJsonFile(pathToJSON: string) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, pathToJSON), 'utf8'));
}

const customExtensions = loadJsonFile('./resources/custom-extensions.json');
const { env: ENV } = process;

const commercetoolsConfig = {
    clientId: ENV.CTP_CLIENT_ID ?? '',
    clientSecret: ENV.CTP_CLIENT_SECRET ?? '',
    projectKey: ENV.CTP_PROJECT_KEY ?? '',
    apiUrl: ENV.CTP_API_URL ?? 'https://api.europe-west1.gcp.commercetools.com',
    authUrl: ENV.CTP_AUTH_URL ?? 'https://auth.europe-west1.gcp.commercetools.com',
    extensionUrl: ENV.CT_EXTENSION_URL ?? '',
    extensionAuthUser: ENV.CT_EXTENSION_AUTH_USER ?? '',
    extensionAuthPassword: ENV.CT_EXTENSION_AUTH_PASSWORD ?? ''
};

const commerceToolsClient = CommercetoolsClient(commercetoolsConfig);

for (const extension of customExtensions) {
    try {
        const existingExtension = await commerceToolsClient.getExtensionByKey(extension.key);

        const extensionCredentials = `${commercetoolsConfig.extensionAuthUser}:${commercetoolsConfig.extensionAuthPassword}`;
        const header = `Basic ${Buffer.from(extensionCredentials).toString('base64')}`;

        const authentication = {
            type: 'AuthorizationHeader',
            headerValue: header
        };

        extension.destination.authentication = authentication;
        extension.destination.url = commercetoolsConfig.extensionUrl;

        if (!existingExtension) {
            try {
                console.log('> Adding extension');
                await commerceToolsClient.addExtension(extension);
                console.log('> Added extension');
            } catch (error) {
                console.error(error);
            }

            continue;
        }

        try {
            console.log('> Updating extension');
            await commerceToolsClient.updateExtension(existingExtension.body, extension);
            console.log('> Updated extension');
        } catch (error) {
            console.error(error);
        }
    } catch (error) {
        console.error(error);
    }
}

await syncCustomTypes();
