import { expect, test, vi, describe } from 'vitest';
import getPaymentStatusHandler from '~/paymentHandler/get-payment-status.handler.js';

vi.mock('@nuvei/sdk-client', () => ({
    default: {
        getPaymentStatus: vi.fn().mockImplementation(() => {
            return { paymentStatus: 'OK' };
        })
    }
}));

const { default: nuveiSDK } = await import('../../../../packages/nuvei-client/src/index.js');

describe('Get payment status handler', () => {
    test('Should return payment status', async () => {
        const requestBodyMock = {
            sessionToken: 'test-session-token'
        };

        const result = await getPaymentStatusHandler(requestBodyMock);

        expect(nuveiSDK.getPaymentStatus).toHaveBeenLastCalledWith('test-session-token');
        expect(result).toEqual({ paymentStatus: 'OK' });
    });
});
