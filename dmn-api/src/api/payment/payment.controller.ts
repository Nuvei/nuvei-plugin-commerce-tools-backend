import { type Request, type Response } from 'express';
import { Logger } from '@nuvei/util';
import paymentNotificationHandler from '../../paymentHandler/payment-notification.handler.js';

const processPaymentNotificationRequest = (commerceToolsClient: any) => async (request: Request, res: Response) => {
    const logger = Logger.get();
    const { body: requestBody } = request;

    try {
        if (requestBody?.type === 'CARD_TOKENIZATION') {
            res.status(200);
            res.end();
        }

        await paymentNotificationHandler(commerceToolsClient)(requestBody);

        res.status(200);
        res.end();
    } catch (error: any) {
        logger.error(JSON.stringify(error));
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const paymentController = (commerceToolsClient: any) => ({
    processPaymentNotificationRequest: processPaymentNotificationRequest(commerceToolsClient)
});

export default paymentController;
