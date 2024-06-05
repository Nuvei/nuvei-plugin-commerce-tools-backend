import { expect, test, vi, describe } from 'vitest';
import settleTransactioHandler from '~/paymentHandler/settle-transaction.handler.js';

vi.mock('@nuvei/sdk-client', () => ({
    default: {
        settleTransaction: vi.fn().mockImplementation(() => {
            return { status: 200, message: 'OK' };
        })
    }
}));

const { default: nuveiSdk } = await import('../../../../packages/nuvei-client/src/index.js');

describe('Settle transaction handler', () => {
    test('Should settle transaction', async () => {
        const requestBodyMock = {
            amount: '200',
            currency: 'EUR',
            relatedTransactionId: 'related-transaction-id'
        };

        const result = await settleTransactioHandler(requestBodyMock);

        expect(result).toEqual({ message: 'OK', status: 200 });
        expect(nuveiSdk.settleTransaction).toHaveBeenLastCalledWith(expect.objectContaining(requestBodyMock));
    });
});
