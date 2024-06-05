import { expect, test, vi, describe, beforeEach } from 'vitest';
import { auth as authMiddleware } from '~/middleware/auth.js';

describe('Auth middleware', async () => {
    beforeEach(() => {
        vi.stubEnv('CT_EXTENSION_AUTH_USER', 'test-ct-extension-auth-user');
        vi.stubEnv('CT_EXTENSION_AUTH_PASSWORD', 'test-ct-extension-auth-password');
    });

    test('Should respond with 401 when authorization is not provided', async () => {
        const requestMock: any = {
            request: {
                headers: {
                    authorization: undefined
                }
            }
        };

        const responseMock: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        const mockedNextFn = vi.fn();

        authMiddleware(requestMock, responseMock, mockedNextFn);

        expect(responseMock.status).toHaveBeenCalledWith(401);
        expect(responseMock.json).toHaveBeenCalled({ message: 'Unathorized' });
    });

    test('Should proceed (call next fn) when authorization passes', async () => {
        const requestMock: any = {
            headers: {
                authorization: 'Basic dGVzdC1jdC1leHRlbnNpb24tYXV0aC11c2VyOnRlc3QtY3QtZXh0ZW5zaW9uLWF1dGgtcGFzc3dvcmQ='
            }
        };

        const responseMock: any = {};
        const mockedNextFn = vi.fn();

        authMiddleware(requestMock, responseMock, mockedNextFn);

        expect(mockedNextFn).toHaveBeenCalled();
    });
});
