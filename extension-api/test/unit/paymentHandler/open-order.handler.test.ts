import { expect, test, vi, describe } from 'vitest';
import openOrderHandler from '~/paymentHandler/open-order.handler.js';

vi.mock('@nuvei/sdk-client', () => ({
    default: {
        openOrder: vi.fn().mockImplementation(() => {
            return { sessionToken: 'test-session-token' };
        })
    }
}));

describe('Open order handler', () => {
    test('Should return session token', async () => {
        const requestBodyMock = {
            amount: '200',
            currency: 'EUR',
            userTokenId: 'test-user-token-id',
            clientUniqueId: 'test-client-unique-id'
        };

        const result = await openOrderHandler(requestBodyMock);
        expect(result).toEqual({ sessionToken: 'test-session-token' });
    });
});
