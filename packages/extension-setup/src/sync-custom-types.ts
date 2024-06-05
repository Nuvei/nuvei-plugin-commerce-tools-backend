import fs from 'node:fs';
import path, { dirname } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import CommercetoolsClient from '@nuvei/commercetools-client';
import type { CustomType } from '@nuvei/commercetools-client';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { env: ENV } = process;

function loadJsonFile(pathToJSON: string) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, pathToJSON), 'utf8'));
}

const customTypes = loadJsonFile('./resources/custom-types.json');

const commercetoolsConfig = {
    clientId: ENV.CTP_CLIENT_ID ?? '',
    clientSecret: ENV.CTP_CLIENT_SECRET ?? '',
    projectKey: ENV.CTP_PROJECT_KEY ?? '',
    apiUrl: ENV.CTP_API_URL ?? 'https://api.europe-west1.gcp.commercetools.com',
    authUrl: ENV.CTP_AUTH_URL ?? 'https://auth.europe-west1.gcp.commercetools.com',
    extensionAuthUser: ENV.CT_EXTENSION_AUTH_USER ?? '',
    extensionAuthPassword: ENV.CT_EXTENSION_AUTH_PASSWORD ?? ''
};

const syncCustomTypes = async () => {
    for (const type of customTypes) {
        await syncCustomType(type);
    }
};

const syncCustomType = async (type: unknown) => {
    const typeAsCustomType = type as CustomType;
    try {
        const commercetoolsClient = CommercetoolsClient(commercetoolsConfig);
        const existingType = await commercetoolsClient.getCustomTypeByKey(typeAsCustomType.key);

        if (existingType) {
            await commercetoolsClient.updateCustomType(existingType.body as unknown as CustomType, typeAsCustomType);
            return;
        }

        await commercetoolsClient.addCustomType(type as CustomType);
    } catch (error) {
        console.error(error);
    }
};

export { syncCustomTypes };
