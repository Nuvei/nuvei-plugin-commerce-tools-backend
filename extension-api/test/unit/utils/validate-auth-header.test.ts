import { expect, test, describe, beforeEach, vi } from 'vitest';
import validateAuthHeader from '~/utils/validate-auth-header.js';

describe('Validate auth header', () => {
    beforeEach(() => {
        vi.stubEnv('CT_EXTENSION_AUTH_USER', 'test-ct-extension-auth-user');
        vi.stubEnv('CT_EXTENSION_AUTH_PASSWORD', 'test-ct-extension-auth-password');
    });

    test('Should return true if user or password are not provided', async () => {
        const testAuthorizationHeader = 'Bearer qmnaydgflvp4827fjf023u4testest';

        vi.stubEnv('CT_EXTENSION_AUTH_USER', '');
        vi.stubEnv('CT_EXTENSION_AUTH_PASSWORD', '');

        const result = validateAuthHeader(testAuthorizationHeader);
        expect(result).toBe(true);
    });

    test('Should return false if authorization header does NOT contain spaces', async () => {
        const testAuthorizationHeader = 'test';
        const result = validateAuthHeader(testAuthorizationHeader);

        expect(result).toBe(false);
    });

    test('Should return false if decode auth header length is more than two', async () => {
        const testAuthorizationHeader = 'test test test test test';
        const result = validateAuthHeader(testAuthorizationHeader);

        expect(result).toBe(false);
    });

    test('Should return true if extension auth user matches request user and extension auth password matches request password', async () => {
        // Base 64 encoded test-ct-extension-auth-user/test-ct-extension-auth-password
        const testAuthorizationHeader = 'Basic dGVzdC1jdC1leHRlbnNpb24tYXV0aC11c2VyOnRlc3QtY3QtZXh0ZW5zaW9uLWF1dGgtcGFzc3dvcmQ=';
        const result = validateAuthHeader(testAuthorizationHeader);

        expect(result).toBe(true);
    });
});
