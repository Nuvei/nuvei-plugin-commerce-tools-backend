import { expect, test, vi, describe } from 'vitest';
import type PaymentType from '../../../../packages/nuvei-client/src/interfaces/payment.js';
import paymentHandler from '~/paymentHandler/payment.handler.js';

vi.mock('@nuvei/sdk-client', () => ({
    default: {
        payment: vi.fn().mockImplementation(() => {
            return { success: true, status: 200 };
        })
    }
}));

describe('Open order handler', () => {
    test('Should return session token', async () => {
        const requestBodyMock: PaymentType = {
            transactionType: 'test-transaction-type',
            sessionToken: 'test-session-token',
            amount: '200',
            currency: 'GBP',
            paymentOption: {
                type: 'card',
                cardNumber: '1234-5678-9123-4567',
                cardHolderName: 'Tester',
                expirationMonth: 'Testing',
                expirationYear: '1990',
                CVV: '350'
            },
            timeStamp: '20240101100123',
            billingAddress: {
                country: 'Test country',
                email: 'test@test.com',
                firstName: 'Tester',
                lastName: 'Tested'
            },
            deviceDetails: {
                ipAddress: '192.156.122.0'
            },
            clientRequestId: 'test-client-request-id'
        };

        const result = await paymentHandler(requestBodyMock, '192.123.0.0');
        expect(result).toEqual({ status: 200, success: true });
    });
});
