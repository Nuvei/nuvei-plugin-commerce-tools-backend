import { expect, test, vi, describe } from 'vitest';
import voidTransactionHandler from '~/paymentHandler/void-transaction.handler.js';

vi.mock('@nuvei/sdk-client', () => ({
    default: {
        voidTransaction: vi.fn().mockImplementation(() => {
            return { status: 200, message: 'OK' };
        })
    }
}));

const { default: nuveiSdk } = await import('../../../../packages/nuvei-client/src/index.js');

describe('Void transaction handler', () => {
    test('Should void transaction', async () => {
        const requestBodyMock = {
            amount: '200',
            currency: 'EUR',
            relatedTransactionId: 'related-transaction-id'
        };

        const result = await voidTransactionHandler(requestBodyMock);

        expect(result).toEqual({ message: 'OK', status: 200 });
        expect(nuveiSdk.voidTransaction).toHaveBeenLastCalledWith(expect.objectContaining(requestBodyMock));
    });
});
