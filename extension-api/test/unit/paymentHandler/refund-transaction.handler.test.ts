import { expect, test, vi, describe } from 'vitest';
import refundTransactioHandler from '~/paymentHandler/refund-transaction.handler.js';

vi.mock('@nuvei/util', () => ({ Logger: { get: () => ({ error: vi.fn() }) } }));

vi.mock('@nuvei/sdk-client', () => ({
    default: {
        refundTransaction: vi.fn().mockImplementation(() => {
            return { status: 200, message: 'OK' };
        }),
        voidTransaction: vi.fn().mockImplementation(() => {
            return { status: 200, message: 'OK' };
        })
    }
}));

const { default: nuveiSdk } = await import('../../../../packages/nuvei-client/src/index.js');

describe('Refund transaction handler', () => {
    test('Should refund when force refund is requested', async () => {
        const requestBodyMock = {
            amount: '200',
            currency: 'EUR',
            relatedTransactionId: 'related-transaction-id'
        };

        const result = await refundTransactioHandler({ ...requestBodyMock, forceRefund: true });

        expect(result).toEqual({ message: 'OK', status: 200 });
        expect(nuveiSdk.refundTransaction).toHaveBeenLastCalledWith(expect.objectContaining(requestBodyMock));
    });

    test('Should void transaction when force refund is NOT requested', async () => {
        const requestBodyMock = {
            amount: '200',
            currency: 'EUR',
            relatedTransactionId: 'related-transaction-id'
        };

        const result = await refundTransactioHandler({ ...requestBodyMock, forceRefund: false });

        expect(result).toEqual({ message: 'OK', status: 200 });
        expect(nuveiSdk.voidTransaction).toHaveBeenLastCalledWith(expect.objectContaining(requestBodyMock));
    });
});
