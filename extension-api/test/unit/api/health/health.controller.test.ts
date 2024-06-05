import { expect, test, vi, describe } from 'vitest';
import healthController from '~/api/health/health.controller.js';

describe('HealthController', () => {
    test('Should process the request', () => {
        const { processRequest } = healthController;
        const requestObject: any = {};
        const responseObject: any = {
            send: vi.fn().mockImplementationOnce(() => {
                return {
                    status: 'OK'
                };
            })
        };

        processRequest(requestObject, responseObject);

        expect(responseObject.send).toHaveBeenCalledWith(expect.objectContaining({ message: 'OK' }));
    });

    test('Should handle failure', () => {
        const { processRequest } = healthController;
        const sendMock = vi.fn();
        const requestObject: any = {};
        const responseObject: any = {
            send: vi.fn().mockImplementationOnce(() => {
                throw new Error('Failed');
            }),
            status: vi.fn().mockImplementationOnce(() => ({ send: sendMock }))
        };

        processRequest(requestObject, responseObject);

        expect(responseObject.status).toHaveBeenCalledWith(503);
        expect(sendMock).toHaveBeenCalled();
    });
});
