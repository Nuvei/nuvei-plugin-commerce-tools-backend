import { expect, test, vi, describe, expectTypeOf } from 'vitest';
import type { InitOrderPaymentType, InitPaymentResponseType } from '~/interfaces/init-payment.js';
import type { OpenOrderResultType, OpenOrderType } from '~/interfaces/open-order.js';
import type { PaymentStatusResponse } from '~/interfaces/payment-status.js';
import type { TransactionResponse } from '~/interfaces/payment.js';
import type PaymentType from '~/interfaces/payment.js';
import type { RefundResponseType } from '~/interfaces/refund.js';
import type RefundType from '~/interfaces/refund.js';
import type { SettleTransactionResponseType } from '~/interfaces/settle-transaction.js';
import type SettleTransactionType from '~/interfaces/settle-transaction.js';
import type { VoidTransactionResponse } from '~/interfaces/void-transaction.js';
import type VoidTransactionType from '~/interfaces/void-transaction.js';

const orderMock: OpenOrderType = {
    amount: '100',
    currency: 'EUR',
    clientUniqueId: '1234-5678-9012',
    timeStamp: '2017-08-01'
};

const paymentMock: InitOrderPaymentType = {
    amount: '100',
    clientUniqueId: '1234-5678-9012',
    currency: 'EUR',
    merchantId: 'test-merchant-id',
    merchantSiteId: 'test-merchant-site-id',
    sessionToken: 'test-session-token',
    paymentOption: {
        card: {
            cardNumber: '1234-5678-9123-4567',
            cardHolderName: 'Tester',
            expirationMonth: 'Testing',
            expirationYear: '1990',
            CVV: '350',
            acquirerId: '1234'
        }
    }
};

const payMock: PaymentType = {
    amount: '300',
    currency: 'EUR',
    billingAddress: {
        country: 'Test country',
        email: 'test@test.com',
        firstName: 'Tester',
        lastName: 'Tested'
    },
    sessionToken: 'test-session-token',
    deviceDetails: {
        ipAddress: '192.123.0.0'
    },
    timeStamp: '2024-01-01',
    paymentOption: {
        type: 'card',
        cardNumber: '1234-5678-9123-4567',
        cardHolderName: 'Tester',
        expirationMonth: 'Testing',
        expirationYear: '1990',
        CVV: '350'
    }
};

const settleTransaction: SettleTransactionType = {
    amount: 200,
    currency: 'EUR',
    relatedTransactionId: 'test-related-transaction-id',
    timeStamp: '2024-01-01'
};

const voidTransaction: VoidTransactionType = {
    amount: 200,
    currency: 'EUR',
    relatedTransactionId: 'test-related-transaction-id',
    timeStamp: '2024-01-01'
};

const refundTransaction: RefundType = {
    amount: 600,
    currency: 'EUR',
    relatedTransactionId: 'test-related-transaction-id',
    timeStamp: '2024-01-01'
};

const safeChargeSuccessResponse = {
    status: 200,
    message: 'OK'
};

const safeChargeFailResponse = {
    status: 400,
    message: 'FAIL'
};

const openOrderMock = vi.fn().mockImplementation((data, cb) => {
    cb(null, safeChargeSuccessResponse);
});

const initPaymentMock = vi.fn().mockImplementation((data, cb) => {
    cb(null, safeChargeSuccessResponse);
});

const paymentCBMock = vi.fn().mockImplementation((data, cb) => {
    cb(null, safeChargeSuccessResponse);
});

const getPaymentStatusMock = vi.fn().mockImplementation((data, cb) => {
    cb(null, safeChargeSuccessResponse);
});

const settleTransactionMock = vi.fn().mockImplementation((data, cb) => {
    cb(null, safeChargeSuccessResponse);
});

const voidTransactionMock = vi.fn().mockImplementation((data, cb) => {
    cb(null, safeChargeSuccessResponse);
});

const refundTransactionMock = vi.fn().mockImplementation((data, cb) => {
    cb(null, safeChargeSuccessResponse);
});

vi.doMock('safecharge', () => ({
    default: {
        initiate: vi.fn().mockReturnValue({ success: true }),
        getPaymentStatus: getPaymentStatusMock,
        paymentService: {
            openOrder: openOrderMock,
            initPayment: initPaymentMock,
            createPayment: paymentCBMock,
            refundTransaction: refundTransactionMock,
            voidTransaction: voidTransactionMock,
            settleTransaction: settleTransactionMock
        }
    }
}));

// @ts-expect-error no types
await import('safecharge');
const { default: nuveiSDK } = await import('~/index.js');

describe('Nuvei SDK', () => {
    test('Open order should use safecharge api and open an order', async () => {
        const openOrderResult = await nuveiSDK.openOrder(orderMock);

        expectTypeOf(nuveiSDK.openOrder).toBeFunction();
        expectTypeOf(nuveiSDK.openOrder).toMatchTypeOf<(order: OpenOrderType) => Promise<OpenOrderResultType>>();
        expect(openOrderMock).nthCalledWith(1, orderMock, expect.any(Function));
        expect(openOrderResult).toEqual({ status: 200, message: 'OK' });
    });

    test('Open order should throw when safecharge request fails', async () => {
        openOrderMock.mockImplementationOnce((data, cb) => {
            cb(safeChargeFailResponse);
        });

        try {
            await nuveiSDK.openOrder(orderMock);
        } catch (error) {
            expect(error).toEqual({ status: 400, message: 'FAIL' });
        }
    });

    test('Init payment should use safecharge api and initialize payment', async () => {
        const initPaymentResult = await nuveiSDK.initPayment(paymentMock);

        expectTypeOf(nuveiSDK.initPayment).toBeFunction();
        expectTypeOf(nuveiSDK.initPayment).toMatchTypeOf<(order: InitOrderPaymentType) => Promise<InitPaymentResponseType>>();
        expect(initPaymentMock).nthCalledWith(1, paymentMock, expect.any(Function));
        expect(initPaymentResult).toEqual({ status: 200, message: 'OK' });
    });

    test('Init payment should throw when safecharge request fails', async () => {
        initPaymentMock.mockImplementationOnce((data, cb) => {
            cb(safeChargeFailResponse);
        });

        try {
            await nuveiSDK.initPayment(paymentMock);
        } catch (error) {
            expect(error).toEqual({ status: 400, message: 'FAIL' });
        }
    });

    test('Payment should use safecharge api and perform payment request', async () => {
        const paymentResult = await nuveiSDK.payment(payMock);

        expectTypeOf(nuveiSDK.payment).toBeFunction();
        expectTypeOf(nuveiSDK.payment).toMatchTypeOf<(payment: PaymentType) => Promise<TransactionResponse>>();
        expect(paymentCBMock).nthCalledWith(1, payMock, expect.any(Function));
        expect(paymentResult).toEqual({ status: 200, message: 'OK' });
    });

    test('Payment should throw when safecharge request fails', async () => {
        paymentCBMock.mockImplementationOnce((data, cb) => {
            cb(safeChargeFailResponse);
        });

        try {
            await nuveiSDK.payment(payMock);
        } catch (error) {
            expect(error).toEqual({ status: 400, message: 'FAIL' });
        }
    });

    test('Should calculate checksum', async () => {
        const checksumResult = nuveiSDK.calculateChecksum('test', 'sha256');
        expect(checksumResult).toEqual('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
    });

    test('Get payment status should use safecharge api and return payment status', async () => {
        const testSessionToken = 'test-session-token';
        const getPaymentStatusResult = await nuveiSDK.getPaymentStatus(testSessionToken);

        expectTypeOf(nuveiSDK.getPaymentStatus).toBeFunction();
        expectTypeOf(nuveiSDK.getPaymentStatus).toMatchTypeOf<(sessionToken: string) => Promise<PaymentStatusResponse>>();
        expect(getPaymentStatusMock).nthCalledWith(1, { sessionToken: testSessionToken }, expect.any(Function));
        expect(getPaymentStatusResult).toEqual({ status: 200, message: 'OK' });
    });

    test('Get payment status should throw when safecharge request fails', async () => {
        getPaymentStatusMock.mockImplementationOnce((data, cb) => {
            cb(safeChargeFailResponse);
        });

        try {
            await nuveiSDK.getPaymentStatus(orderMock);
        } catch (error) {
            expect(error).toEqual({ status: 400, message: 'FAIL' });
        }
    });

    test('Settle transaction should use safecharge api and return settle the transaction', async () => {
        const settleTransactionResult = await nuveiSDK.settleTransaction(settleTransaction);

        expectTypeOf(nuveiSDK.settleTransaction).toBeFunction();
        expectTypeOf(nuveiSDK.settleTransaction).toMatchTypeOf<
            (settleTransaction: SettleTransactionType) => Promise<SettleTransactionResponseType>
        >();
        expect(settleTransactionMock).nthCalledWith(1, settleTransaction, expect.any(Function));
        expect(settleTransactionResult).toEqual({ status: 200, message: 'OK' });
    });

    test('Settle transaction should throw when safecharge request fails', async () => {
        settleTransactionMock.mockImplementationOnce((data, cb) => {
            cb(safeChargeFailResponse);
        });

        try {
            await nuveiSDK.settleTransaction(settleTransaction);
        } catch (error) {
            expect(error).toEqual({ status: 400, message: 'FAIL' });
        }
    });

    test('Void transaction should use safecharge api and return void the transaction', async () => {
        const voindTransactionResult = await nuveiSDK.voidTransaction(voidTransaction);

        expectTypeOf(nuveiSDK.voidTransaction).toBeFunction();
        expectTypeOf(nuveiSDK.voidTransaction).toMatchTypeOf<(voidTransaction: VoidTransactionType) => Promise<VoidTransactionResponse>>();
        expect(voidTransactionMock).nthCalledWith(1, voidTransaction, expect.any(Function));
        expect(voindTransactionResult).toEqual({ status: 200, message: 'OK' });
    });

    test('Void transaction should throw when safecharge request fails', async () => {
        voidTransactionMock.mockImplementationOnce((data, cb) => {
            cb(safeChargeFailResponse);
        });

        try {
            await nuveiSDK.voidTransaction(settleTransaction);
        } catch (error) {
            expect(error).toEqual({ status: 400, message: 'FAIL' });
        }
    });

    test('Refund transaction should use safecharge api and return refund the transaction', async () => {
        const refundTransactionResult = await nuveiSDK.refundTransaction(refundTransaction);

        expectTypeOf(nuveiSDK.refundTransaction).toBeFunction();
        expectTypeOf(nuveiSDK.refundTransaction).toMatchTypeOf<(refund: RefundType) => Promise<RefundResponseType>>();
        expect(refundTransactionMock).nthCalledWith(1, refundTransaction, expect.any(Function));
        expect(refundTransactionResult).toEqual({ status: 200, message: 'OK' });
    });

    test('Refund transaction should throw when safecharge request fails', async () => {
        refundTransactionMock.mockImplementationOnce((data, cb) => {
            cb(safeChargeFailResponse);
        });

        try {
            await nuveiSDK.refundTransaction(refundTransaction);
        } catch (error) {
            expect(error).toEqual({ status: 400, message: 'FAIL' });
        }
    });
});
