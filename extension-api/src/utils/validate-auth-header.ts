import { Buffer } from 'node:buffer';
import process from 'node:process';
import 'dotenv/config';

const { env: ENV } = process;

export default function validateAuthorizationHeader(authorizationHeader: string): boolean {
    const { CT_EXTENSION_AUTH_USER: extensionAuthUser, CT_EXTENSION_AUTH_PASSWORD: extensionAuthPassword } = ENV;

    if (!extensionAuthUser || !extensionAuthPassword) {
        return true;
    }

    if (!authorizationHeader?.includes(' ')) return false;

    const encodedAuthHeader = authorizationHeader.split(' ');
    const decodedAuthHeader = Buffer.from(encodedAuthHeader[1]!, 'base64').toString();

    const credentials = decodedAuthHeader.split(':');

    if (credentials.length !== 2) {
        return false;
    }

    const requestUser = credentials[0];
    const requestPassword = credentials[1];

    return extensionAuthUser === requestUser && extensionAuthPassword === requestPassword;
}
