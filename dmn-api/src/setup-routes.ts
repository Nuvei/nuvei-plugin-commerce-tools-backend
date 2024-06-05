import healthController from './api/health/health.controller.js';
import paymentController from './api/payment/payment.controller.js';

export default function routes(commerceToolsClient: any) {
    return function (app: any) {
        app.get('/health', healthController.processRequest);

        app.post('/payment-dmn', paymentController(commerceToolsClient).processPaymentNotificationRequest);
    };
}
