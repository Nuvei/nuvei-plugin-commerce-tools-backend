import { expect, test, describe, vi } from 'vitest';
import nuveiSDK from '@nuvei/sdk-client';
import paymentControllerFactory from '~/api/payment/payment.controller.js';

vi.mock('@nuvei/util', () => ({ Logger: { get: () => ({ error: vi.fn() }) } }));

const mockedCommercetoolsClient = {
    getPaymentById: vi.fn().mockImplementation(() => ({
        status: 200,
        message: 'OK',
        body: {
            version: 1,
            amountPlanned: {
                centAmount: 100
            }
        }
    })),
    addTransactionToPayment: vi.fn().mockImplementation(() => ({
        status: 200,
        message: 'OK',
        body: {
            version: 1,
            amountPlanned: {
                centAmount: 100
            }
        }
    })),
    setPaymentMethodInfoMethod: vi.fn().mockImplementation(() => ({
        status: 200,
        message: 'OK',
        body: {
            version: 1,
            amountPlanned: {
                centAmount: 100
            }
        }
    })),
    setPaymentMethodInfoName: vi.fn().mockImplementation(() => ({
        status: 200,
        message: 'OK',
        body: {
            version: 1,
            amountPlanned: {
                centAmount: 100
            }
        }
    }))
};

const paymentController = paymentControllerFactory(mockedCommercetoolsClient);

vi.mock('@nuvei/sdk-client', () => ({
    default: {
        calculateChecksum: vi.fn().mockImplementation(() => {
            return 'test-checksum';
        })
    }
}));

describe('Payment controller', () => {
    const mockedDMNRequest: any = {
        body: {
            totalAmount: 100,
            currency: 'EUR',
            responseTimeStamp: '2024-02-05.15:56:12',
            PPP_TransactionID: '418831048',
            Status: 'APPROVED',
            productId: 'NA',
            merchant_unique_id: '725d1c68-3b31-4302-9acf-f5b492af661e',
            transactionType: 'Auth',
            TransactionID: '711000000031767117',
            ppp_status: 'OK',
            cardCompany: 'Visa',
            cardType: 'Credit',
            type: 'DEPOSIT',
            advanceResponseChecksum: 'checksum'
        }
    };

    test('Should respond with 200 when request type is card tokenization', async () => {
        const mockedCardTokenizationReq: any = {
            body: {
                type: 'CARD_TOKENIZATION'
            }
        };

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            end: vi.fn()
        };

        await paymentController.processPaymentNotificationRequest(mockedCardTokenizationReq, mockedResponse);

        expect(mockedResponse.status).toHaveBeenCalledWith(200);
        expect(mockedResponse.end).toHaveBeenCalled();
    });

    test('Should return 500 when checksum check fails', async () => {
        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            end: vi.fn()
        };

        await paymentController.processPaymentNotificationRequest(mockedDMNRequest, mockedResponse);

        expect(mockedResponse.status).toHaveBeenCalledWith(500);
        expect(mockedResponse.json).toHaveBeenCalled({ message: 'Internal Server Error' });
    });

    test('Should process the request', async () => {
        vi.mocked(nuveiSDK).calculateChecksum.mockImplementationOnce(() => 'checksum');

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            end: vi.fn()
        };

        await paymentController.processPaymentNotificationRequest(mockedDMNRequest, mockedResponse);

        expect(mockedCommercetoolsClient.getPaymentById).toHaveBeenCalledWith('725d1c68-3b31-4302-9acf-f5b492af661e');
        expect(mockedCommercetoolsClient.addTransactionToPayment).toHaveBeenCalledWith(
            '725d1c68-3b31-4302-9acf-f5b492af661e',
            1,
            expect.objectContaining({
                amount: { centAmount: 10_000, currencyCode: 'EUR', fractionDigits: 2, type: 'centPrecision' },
                interactionId: '711000000031767117',
                type: 'Authorization'
            })
        );
        expect(mockedCommercetoolsClient.setPaymentMethodInfoMethod).toHaveBeenCalledWith(
            '725d1c68-3b31-4302-9acf-f5b492af661e',
            1,
            'Visa'
        );

        expect(mockedCommercetoolsClient.setPaymentMethodInfoName).toHaveBeenCalledWith('725d1c68-3b31-4302-9acf-f5b492af661e', 1, {
            en: 'Credit'
        });
        expect(mockedResponse.status).toHaveBeenCalledWith(200);
        expect(mockedResponse.end).toHaveBeenCalled();
    });
});
