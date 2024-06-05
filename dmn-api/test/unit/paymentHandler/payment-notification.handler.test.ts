import { expect, test, describe, vi } from 'vitest';
import nuveiSDK from '@nuvei/sdk-client';
import paymentNotificationHandlerFactory from '~/paymentHandler/payment-notification.handler.js';

vi.mock('@nuvei/sdk-client', () => ({
    default: {
        calculateChecksum: vi.fn().mockImplementation(() => {
            return 'test-checksum';
        })
    }
}));

const mockedReturnValue = {
    status: 200,
    message: 'OK',
    body: {
        version: 1,
        amountPlanned: {
            centAmount: 100
        }
    }
};

const mockedCommercetoolsClient = {
    getPaymentById: vi.fn().mockImplementation(() => mockedReturnValue),
    addTransactionToPayment: vi.fn().mockImplementation(() => mockedReturnValue),
    setPaymentMethodInfoMethod: vi.fn().mockImplementation(() => mockedReturnValue),
    setPaymentMethodInfoName: vi.fn().mockImplementation(() => mockedReturnValue),
    setPaymentStatusInterfaceCode: vi.fn().mockImplementation(() => mockedReturnValue)
};

const paymentNotificationHandler = paymentNotificationHandlerFactory(mockedCommercetoolsClient);

describe('Payment notifications handler', () => {
    test('Should throw when checksum check fails', async () => {
        try {
            await paymentNotificationHandler({});
        } catch (error: any) {
            expect(error.message).toBe('Invalid checksum!');
        }
    });

    test('Should fetch payment ID and add transaction to payment with Auth type', async () => {
        vi.mocked(nuveiSDK).calculateChecksum.mockReturnValueOnce('testchecksum');

        const mockedRequestBody = {
            advanceResponseChecksum: 'testchecksum',
            merchant_unique_id: 'test-merchant-unique-id',
            TransactionID: 'test-transaction-id',
            totalAmount: 100,
            currencyCode: 'EUR',
            transactionType: 'Auth',
            ppp_status: 'OK',
            responseTimeStamp: 'Tue Feb 06 2024 23:03:47 GMT+0200 (Eastern European Standard Time)',
            cardCompany: 'test-card-company',
            cardType: 'test-card-type',
            currency: 'EUR'
        };

        await paymentNotificationHandler(mockedRequestBody);

        expect(mockedCommercetoolsClient.getPaymentById).toHaveBeenCalledWith('test-merchant-unique-id');

        expect(mockedCommercetoolsClient.addTransactionToPayment).toHaveBeenCalledWith('test-merchant-unique-id', 1, {
            amount: {
                centAmount: 10_000,
                currencyCode: 'EUR',
                fractionDigits: 2,
                type: 'centPrecision'
            },
            interactionId: 'test-transaction-id',
            state: 'Success',
            timestamp: '2024-02-06T21:03:47.000Z',
            type: 'Authorization'
        });

        expect(mockedCommercetoolsClient.setPaymentMethodInfoMethod).toHaveBeenCalledWith(
            'test-merchant-unique-id',
            1,
            'test-card-company'
        );

        expect(mockedCommercetoolsClient.setPaymentMethodInfoName).toHaveBeenCalledWith('test-merchant-unique-id', 1, {
            en: 'test-card-type'
        });
    });

    test('Should fetch payment ID and add transaction to payment with Settle type', async () => {
        vi.mocked(nuveiSDK).calculateChecksum.mockReturnValueOnce('testchecksum');

        const mockedRequestBody = {
            advanceResponseChecksum: 'testchecksum',
            merchant_unique_id: 'test-merchant-unique-id',
            TransactionID: 'test-transaction-id',
            totalAmount: 100,
            currencyCode: 'EUR',
            transactionType: 'Settle',
            ppp_status: 'OK',
            responseTimeStamp: 'Tue Feb 06 2024 23:03:47 GMT+0200 (Eastern European Standard Time)',
            cardCompany: 'test-card-company',
            cardType: 'test-card-type',
            currency: 'EUR'
        };

        await paymentNotificationHandler(mockedRequestBody);

        expect(mockedCommercetoolsClient.addTransactionToPayment).toHaveBeenCalledWith('test-merchant-unique-id', 1, {
            amount: {
                centAmount: 10_000,
                currencyCode: 'EUR',
                fractionDigits: 2,
                type: 'centPrecision'
            },
            interactionId: 'test-transaction-id',
            state: 'Success',
            timestamp: '2024-02-06T21:03:47.000Z',
            type: 'Charge'
        });
    });

    test('Should fetch payment ID and add transaction to payment with Refund type', async () => {
        vi.mocked(nuveiSDK).calculateChecksum.mockReturnValueOnce('testchecksum');

        const mockedRequestBody = {
            advanceResponseChecksum: 'testchecksum',
            merchant_unique_id: 'test-merchant-unique-id',
            TransactionID: 'test-transaction-id',
            totalAmount: 100,
            currencyCode: 'EUR',
            transactionType: 'Credit',
            ppp_status: 'OK',
            responseTimeStamp: 'Tue Feb 06 2024 23:03:47 GMT+0200 (Eastern European Standard Time)',
            cardCompany: 'test-card-company',
            cardType: 'test-card-type',
            currency: 'EUR'
        };

        await paymentNotificationHandler(mockedRequestBody);

        expect(mockedCommercetoolsClient.addTransactionToPayment).toHaveBeenCalledWith('test-merchant-unique-id', 1, {
            amount: {
                centAmount: 10_000,
                currencyCode: 'EUR',
                fractionDigits: 2,
                type: 'centPrecision'
            },
            interactionId: 'test-transaction-id',
            state: 'Success',
            timestamp: '2024-02-06T21:03:47.000Z',
            type: 'Refund'
        });
    });

    test('Should fetch payment ID and add transaction to payment with Credit type', async () => {
        vi.mocked(nuveiSDK).calculateChecksum.mockReturnValueOnce('testchecksum');

        const mockedRequestBody = {
            advanceResponseChecksum: 'testchecksum',
            merchant_unique_id: 'test-merchant-unique-id',
            TransactionID: 'test-transaction-id',
            totalAmount: 100,
            currencyCode: 'EUR',
            transactionType: 'Credit',
            ppp_status: 'OK',
            responseTimeStamp: 'Tue Feb 06 2024 23:03:47 GMT+0200 (Eastern European Standard Time)',
            cardCompany: 'test-card-company',
            cardType: 'test-card-type',
            currency: 'EUR'
        };

        await paymentNotificationHandler(mockedRequestBody);

        expect(mockedCommercetoolsClient.addTransactionToPayment).toHaveBeenCalledWith('test-merchant-unique-id', 1, {
            amount: {
                centAmount: 10_000,
                currencyCode: 'EUR',
                fractionDigits: 2,
                type: 'centPrecision'
            },
            interactionId: 'test-transaction-id',
            state: 'Success',
            timestamp: '2024-02-06T21:03:47.000Z',
            type: 'Refund'
        });
    });

    test('Should fetch payment ID and add transaction to payment with Chargeback type', async () => {
        vi.mocked(nuveiSDK).calculateChecksum.mockReturnValueOnce('testchecksum');

        const mockedRequestBody = {
            advanceResponseChecksum: 'testchecksum',
            merchant_unique_id: 'test-merchant-unique-id',
            TransactionID: 'test-transaction-id',
            totalAmount: 100,
            currencyCode: 'EUR',
            transactionType: 'Chargeback',
            ppp_status: 'OK',
            responseTimeStamp: 'Tue Feb 06 2024 23:03:47 GMT+0200 (Eastern European Standard Time)',
            cardCompany: 'test-card-company',
            cardType: 'test-card-type',
            currency: 'EUR'
        };

        await paymentNotificationHandler(mockedRequestBody);

        expect(mockedCommercetoolsClient.addTransactionToPayment).toHaveBeenCalledWith('test-merchant-unique-id', 1, {
            amount: {
                centAmount: 10_000,
                currencyCode: 'EUR',
                fractionDigits: 2,
                type: 'centPrecision'
            },
            interactionId: 'test-transaction-id',
            state: 'Success',
            timestamp: '2024-02-06T21:03:47.000Z',
            type: 'Chargeback'
        });
    });

    test('Should fetch payment ID and add transaction to payment with Void type', async () => {
        vi.mocked(nuveiSDK).calculateChecksum.mockReturnValueOnce('testchecksum');

        const mockedRequestBody = {
            advanceResponseChecksum: 'testchecksum',
            merchant_unique_id: 'test-merchant-unique-id',
            TransactionID: 'test-transaction-id',
            totalAmount: 100,
            currencyCode: 'EUR',
            transactionType: 'Void',
            ppp_status: 'OK',
            responseTimeStamp: 'Tue Feb 06 2024 23:03:47 GMT+0200 (Eastern European Standard Time)',
            cardCompany: 'test-card-company',
            cardType: 'test-card-type',
            currency: 'EUR'
        };

        await paymentNotificationHandler(mockedRequestBody);

        expect(mockedCommercetoolsClient.addTransactionToPayment).toHaveBeenCalledWith('test-merchant-unique-id', 1, {
            amount: {
                centAmount: 10_000,
                currencyCode: 'EUR',
                fractionDigits: 2,
                type: 'centPrecision'
            },
            interactionId: 'test-transaction-id',
            state: 'Success',
            timestamp: '2024-02-06T21:03:47.000Z',
            type: 'Chargeback'
        });
    });

    test('Should fetch payment ID and add transaction to payment with default type', async () => {
        vi.mocked(nuveiSDK).calculateChecksum.mockReturnValueOnce('testchecksum');

        const mockedRequestBody = {
            advanceResponseChecksum: 'testchecksum',
            merchant_unique_id: 'test-merchant-unique-id',
            TransactionID: 'test-transaction-id',
            totalAmount: 100,
            currencyCode: 'EUR',
            transactionType: 'test-transaction-type',
            ppp_status: 'OK',
            responseTimeStamp: 'Tue Feb 06 2024 23:03:47 GMT+0200 (Eastern European Standard Time)',
            cardCompany: 'test-card-company',
            cardType: 'test-card-type',
            currency: 'EUR'
        };

        await paymentNotificationHandler(mockedRequestBody);

        expect(mockedCommercetoolsClient.addTransactionToPayment).toHaveBeenCalledWith('test-merchant-unique-id', 1, {
            amount: {
                centAmount: 10_000,
                currencyCode: 'EUR',
                fractionDigits: 2,
                type: 'centPrecision'
            },
            interactionId: 'test-transaction-id',
            state: 'Success',
            timestamp: '2024-02-06T21:03:47.000Z',
            type: 'test-transaction-type'
        });
    });

    test('Should fetch payment ID and add transaction to payment with failed status', async () => {
        vi.mocked(nuveiSDK).calculateChecksum.mockReturnValueOnce('testchecksum');

        const mockedRequestBody = {
            advanceResponseChecksum: 'testchecksum',
            merchant_unique_id: 'test-merchant-unique-id',
            TransactionID: 'test-transaction-id',
            totalAmount: 100,
            currencyCode: 'EUR',
            transactionType: 'test-transaction-type',
            ppp_status: 'FAIL',
            responseTimeStamp: 'Tue Feb 06 2024 23:03:47 GMT+0200 (Eastern European Standard Time)',
            cardCompany: 'test-card-company',
            cardType: 'test-card-type',
            currency: 'EUR'
        };

        await paymentNotificationHandler(mockedRequestBody);

        expect(mockedCommercetoolsClient.addTransactionToPayment).toHaveBeenCalledWith('test-merchant-unique-id', 1, {
            amount: {
                centAmount: 10_000,
                currencyCode: 'EUR',
                fractionDigits: 2,
                type: 'centPrecision'
            },
            interactionId: 'test-transaction-id',
            state: 'Success',
            timestamp: '2024-02-06T21:03:47.000Z',
            type: 'test-transaction-type'
        });
    });

    test('Should fetch payment ID and add transaction to payment with default status', async () => {
        vi.mocked(nuveiSDK).calculateChecksum.mockReturnValueOnce('testchecksum');

        const mockedRequestBody = {
            advanceResponseChecksum: 'testchecksum',
            merchant_unique_id: 'test-merchant-unique-id',
            TransactionID: 'test-transaction-id',
            totalAmount: 100,
            currencyCode: 'EUR',
            transactionType: 'test-transaction-type',
            ppp_status: 'pending',
            responseTimeStamp: 'Tue Feb 06 2024 23:03:47 GMT+0200 (Eastern European Standard Time)',
            cardCompany: 'test-card-company',
            cardType: 'test-card-type',
            currency: 'EUR'
        };

        await paymentNotificationHandler(mockedRequestBody);

        expect(mockedCommercetoolsClient.addTransactionToPayment).toHaveBeenCalledWith('test-merchant-unique-id', 1, {
            amount: {
                centAmount: 10_000,
                currencyCode: 'EUR',
                fractionDigits: 2,
                type: 'centPrecision'
            },
            interactionId: 'test-transaction-id',
            state: 'Pending',
            timestamp: '2024-02-06T21:03:47.000Z',
            type: 'test-transaction-type'
        });
    });

    test('Should set payment status interface code when total amount and cent amount match', async () => {
        vi.mocked(nuveiSDK).calculateChecksum.mockReturnValueOnce('testchecksum');

        const mockedRequestBody = {
            advanceResponseChecksum: 'testchecksum',
            merchant_unique_id: 'test-merchant-unique-id',
            TransactionID: 'test-transaction-id',
            totalAmount: 1,
            currencyCode: 'EUR',
            transactionType: 'test-transaction-type',
            ppp_status: 'OK',
            responseTimeStamp: 'Tue Feb 06 2024 23:03:47 GMT+0200 (Eastern European Standard Time)',
            cardCompany: 'test-card-company',
            cardType: 'test-card-type',
            currency: 'EUR'
        };

        await paymentNotificationHandler(mockedRequestBody);

        expect(mockedCommercetoolsClient.setPaymentStatusInterfaceCode).toHaveBeenCalled();
    });
});
