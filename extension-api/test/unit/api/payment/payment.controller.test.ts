import { expect, test, describe, vi } from 'vitest';
import paymentController from '~/api/payment/payment.controller.js';
import openOrderHandler from '~/paymentHandler/open-order.handler.js';
import paymentHandler from '~/paymentHandler/payment.handler.js';
import settleTransactionHandler from '~/paymentHandler/settle-transaction.handler.js';
import voidTransactionHandler from '~/paymentHandler/void-transaction.handler.js';
import refundTransactionHandler from '~/paymentHandler/refund-transaction.handler.js';
import getPaymentStatusHandler from '~/paymentHandler/get-payment-status.handler.js';

vi.mock('@nuvei/util', () => ({ Logger: { get: () => ({ error: vi.fn() }) } }));

vi.mock('~/paymentHandler/open-order.handler.js', () => ({
    default: vi.fn().mockImplementation(() => ({ sessionToken: 'test-session-token' }))
}));

vi.mock('~/paymentHandler/payment.handler.js', () => ({
    default: vi.fn().mockImplementation(() => ({ status: 200, message: 'OK' }))
}));

vi.mock('~/paymentHandler/settle-transaction.handler.js', () => ({
    default: vi.fn().mockImplementation(() => ({ status: 200, message: 'OK' }))
}));

vi.mock('~/paymentHandler/void-transaction.handler.js', () => ({
    default: vi.fn().mockImplementation(() => ({ status: 200, message: 'OK' }))
}));

vi.mock('~/paymentHandler/refund-transaction.handler.js', () => ({
    default: vi.fn().mockImplementation(() => ({ status: 200, message: 'OK' }))
}));

vi.mock('~/paymentHandler/get-payment-status.handler.js', () => ({
    default: vi.fn().mockImplementation(() => ({ status: 200, message: 'OK' }))
}));

describe('Payment controller', () => {
    const mockedOpenOrderRequest: any = {
        body: {
            resource: {
                obj: {
                    id: 'test-payment-id',
                    createdBy: {
                        customer: {
                            id: 'test-customer-id'
                        }
                    },
                    amountPlanned: {
                        fractionDigits: 2,
                        centAmount: 100,
                        currency: 'EUR'
                    }
                }
            }
        }
    };

    const mockedOpenOrderRequestWithClientId: any = {
        body: {
            resource: {
                obj: {
                    id: 'test-payment-id',
                    createdBy: {
                        clientId: 'test-client-id'
                    },
                    amountPlanned: {
                        fractionDigits: 2,
                        centAmount: 100,
                        currency: 'EUR'
                    }
                }
            }
        }
    };

    test('Should process commercetools open order request', async () => {
        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processCTOpenOrderRequest(mockedOpenOrderRequest, mockedResponse);

        expect(mockedResponse.status).toHaveBeenCalledWith(200);
        expect(mockedResponse.json).toHaveBeenCalledWith({
            actions: [{ action: 'setCustomField', name: 'sessionToken', value: 'test-session-token' }]
        });
    });

    test('Should process commercetools open order request with client id', async () => {
        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processCTOpenOrderRequest(mockedOpenOrderRequestWithClientId, mockedResponse);

        expect(mockedResponse.status).toHaveBeenCalledWith(200);
        expect(mockedResponse.json).toHaveBeenCalledWith({
            actions: [{ action: 'setCustomField', name: 'sessionToken', value: 'test-session-token' }]
        });
    });

    test('Should process open order request', async () => {
        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processOpenOrderRequest(mockedOpenOrderRequest, mockedResponse);

        expect(mockedResponse.status).toHaveBeenCalledWith(200);
        expect(mockedResponse.json).toHaveBeenCalledWith({
            sessionToken: 'test-session-token'
        });
    });

    test('Should send 500 when open order handler fails', async () => {
        vi.mocked(openOrderHandler).mockImplementationOnce(() => {
            throw new Error('test error');
        });

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processOpenOrderRequest(mockedOpenOrderRequest, mockedResponse);

        expect(mockedResponse.status).toHaveBeenCalledWith(500);
        expect(mockedResponse.json).toHaveBeenCalled({ message: 'Internal Server Error' });
    });

    test('Should send 500 when commercetools open order handler fails', async () => {
        vi.mocked(openOrderHandler).mockImplementationOnce(() => {
            throw new Error('test error');
        });

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processCTOpenOrderRequest(mockedOpenOrderRequest, mockedResponse);

        expect(mockedResponse.status).toHaveBeenCalledWith(500);
        expect(mockedResponse.json).toHaveBeenCalled({ message: 'Internal Server Error' });
    });

    test('Should process payment request', async () => {
        const mockedPaymentRequest: any = {
            body: {
                currency: 'USD',
                amount: 100
            },
            headers: {
                'x-forwarded-for': 'test-x-forwarded-for'
            }
        };

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processPaymentRequest(mockedPaymentRequest, mockedResponse);

        expect(mockedResponse.status).toHaveBeenCalledWith(200);
        expect(mockedResponse.json).toHaveBeenCalledWith({
            message: 'OK',
            status: 200
        });
    });

    test('Should process payment request and use socket for ip adress', async () => {
        const mockedPaymentRequest: any = {
            body: {
                currency: 'USD',
                amount: 100
            },
            headers: {},
            socket: {
                remoteAddress: '192.199.100.10'
            }
        };

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processPaymentRequest(mockedPaymentRequest, mockedResponse);

        expect(mockedResponse.status).toHaveBeenCalledWith(200);
        expect(mockedResponse.json).toHaveBeenCalledWith({
            message: 'OK',
            status: 200
        });
    });

    test('Should send 500 when payment handler fails', async () => {
        vi.mocked(paymentHandler).mockImplementationOnce(() => {
            throw new Error('test error');
        });

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processPaymentRequest(mockedOpenOrderRequest, mockedResponse);
        expect(mockedResponse.status).toHaveBeenCalledWith(500);
        expect(mockedResponse.json).toHaveBeenCalled({ message: 'Internal Server Error' });
    });

    test('Should process settle transaction request', async () => {
        const mockedSettleTransactionRequest: any = {
            body: {}
        };

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processSettleTransactionRequest(mockedSettleTransactionRequest, mockedResponse);

        expect(mockedResponse.status).toHaveBeenCalledWith(200);
        expect(mockedResponse.json).toHaveBeenCalledWith({
            message: 'OK',
            status: 200
        });
    });

    test('Should send 500 when settle transaction handler fails', async () => {
        vi.mocked(settleTransactionHandler).mockImplementation(() => {
            throw new Error('test error');
        });

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processSettleTransactionRequest(mockedOpenOrderRequest, mockedResponse);
        expect(mockedResponse.status).toHaveBeenCalledWith(500);
        expect(mockedResponse.json).toHaveBeenCalled({ message: 'Internal Server Error' });
    });

    test('Should process void transaction request', async () => {
        const mockedSettleTransactionRequest: any = {
            body: {}
        };

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processVoidTransactionRequest(mockedSettleTransactionRequest, mockedResponse);

        expect(mockedResponse.status).toHaveBeenCalledWith(200);
        expect(mockedResponse.json).toHaveBeenCalledWith({
            message: 'OK',
            status: 200
        });
    });

    test('Should send 500 when void transaction handler fails', async () => {
        vi.mocked(voidTransactionHandler).mockImplementationOnce(() => {
            throw new Error('test error');
        });

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processVoidTransactionRequest(mockedOpenOrderRequest, mockedResponse);
        expect(mockedResponse.status).toHaveBeenCalledWith(500);
        expect(mockedResponse.json).toHaveBeenCalled({ message: 'Internal Server Error' });
    });

    test('Should process refund transaction request', async () => {
        const mockedSettleTransactionRequest: any = {
            body: {}
        };

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processRefundTransactionRequest(mockedSettleTransactionRequest, mockedResponse);

        expect(mockedResponse.status).toHaveBeenCalledWith(200);
        expect(mockedResponse.json).toHaveBeenCalledWith({
            message: 'OK',
            status: 200
        });
    });

    test('Should send 500 when refund handler fails', async () => {
        vi.mocked(refundTransactionHandler).mockImplementationOnce(() => {
            throw new Error('test error');
        });

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processRefundTransactionRequest(mockedOpenOrderRequest, mockedResponse);
        expect(mockedResponse.status).toHaveBeenCalledWith(500);
        expect(mockedResponse.json).toHaveBeenCalled({ message: 'Internal Server Error' });
    });

    test('Should process get payment status request', async () => {
        const mockedSettleTransactionRequest: any = {
            body: {}
        };

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processGetPaymentStatusRequest(mockedSettleTransactionRequest, mockedResponse);

        expect(mockedResponse.status).toHaveBeenCalledWith(200);
        expect(mockedResponse.json).toHaveBeenCalledWith({
            message: 'OK',
            status: 200
        });
    });

    test('Should send 500 when get payment status handler fails', async () => {
        vi.mocked(getPaymentStatusHandler).mockImplementationOnce(() => {
            throw new Error('test error');
        });

        const mockedResponse: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await paymentController.processGetPaymentStatusRequest(mockedOpenOrderRequest, mockedResponse);
        expect(mockedResponse.status).toHaveBeenCalledWith(500);
        expect(mockedResponse.json).toHaveBeenCalled({ message: 'Internal Server Error' });
    });
});
