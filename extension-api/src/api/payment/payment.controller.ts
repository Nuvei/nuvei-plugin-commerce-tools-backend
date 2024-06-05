import { type Request, type Response } from 'express';
import { Logger } from '@nuvei/util';
import openOrderHandler from '../../paymentHandler/open-order.handler.js';
import paymentHandler from '../../paymentHandler/payment.handler.js';
import settleTransactionHandler from '../../paymentHandler/settle-transaction.handler.js';
import voidTransactionHandler from '../../paymentHandler/void-transaction.handler.js';
import refundTransactionHandler from '../../paymentHandler/refund-transaction.handler.js';
import getPaymentStatusHandler from '../../paymentHandler/get-payment-status.handler.js';

const processCTOpenOrderRequest = async (request: Request, res: Response) => {
    const logger = Logger.get();
    const { obj: requestObject } = request.body.resource;

    const paymentId = requestObject.id;
    const userId = requestObject.anonymousId || requestObject?.customer?.id;
    const { fractionDigits } = requestObject.amountPlanned;
    const { centAmount } = requestObject.amountPlanned;
    const amount = centAmount / 10 ** fractionDigits;
    const currency = requestObject.amountPlanned.currencyCode;

    try {
        const nuveiResponse = await openOrderHandler({
            amount: `${amount}`,
            currency,
            userTokenId: userId,
            clientUniqueId: paymentId
        });

        const actions = [
            {
                action: 'setCustomField',
                name: 'sessionToken',
                value: nuveiResponse.sessionToken
            }
        ];

        res.status(200).json({ actions });
    } catch (error) {
        logger.error('Error on CT openOrder:' + JSON.stringify(error));
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const processOpenOrderRequest = async (request: Request, res: Response) => {
    const logger = Logger.get();
    const { body: requestBody } = request;

    try {
        const openOrderResponse = await openOrderHandler(requestBody);

        res.status(200).json(openOrderResponse);
    } catch (error) {
        logger.error('Error on openOrder:' + JSON.stringify(error));
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const processPaymentRequest = async (request: Request, res: Response) => {
    const logger = Logger.get();
    const { body: requestBody } = request;

    try {
        const ipAddress = (request.headers['x-forwarded-for'] ?? request.socket.remoteAddress) as string;

        const paymentResponse = await paymentHandler(requestBody, ipAddress);

        res.status(200).json(paymentResponse);
    } catch (error) {
        logger.error('Error on paymentHandler:' + JSON.stringify(error));
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const processSettleTransactionRequest = async (request: Request, res: Response) => {
    const logger = Logger.get();
    const { body: requestBody } = request;

    try {
        const settleTransactionResponse = await settleTransactionHandler(requestBody);

        res.status(200).json(settleTransactionResponse);
    } catch (error) {
        logger.error('Error on settleTransaction' + JSON.stringify(error));
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const processVoidTransactionRequest = async (request: Request, res: Response) => {
    const logger = Logger.get();
    const { body: requestBody } = request;

    try {
        const voidTransactionResponse = await voidTransactionHandler(requestBody);

        res.status(200).json(voidTransactionResponse);
    } catch (error) {
        logger.error('Error on voidTransaction:' + JSON.stringify(error));
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const processRefundTransactionRequest = async (request: Request, res: Response) => {
    const logger = Logger.get();
    const { body: requestBody } = request;

    try {
        const refundTransactionResponse = await refundTransactionHandler(requestBody);

        res.status(200).json(refundTransactionResponse);
    } catch (error) {
        logger.error('Error on refundTransaction' + JSON.stringify(error));
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const processGetPaymentStatusRequest = async (request: Request, res: Response) => {
    const logger = Logger.get();
    const { body: requestBody } = request;

    try {
        const paymentStatusResponse = await getPaymentStatusHandler(requestBody);

        res.status(200).json(paymentStatusResponse);
    } catch (error) {
        logger.error('Error on getPaymentStatus:' + JSON.stringify(error));
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const paymentController = {
    processCTOpenOrderRequest,
    processOpenOrderRequest,
    processPaymentRequest,
    processSettleTransactionRequest,
    processVoidTransactionRequest,
    processRefundTransactionRequest,
    processGetPaymentStatusRequest
};

export default paymentController;
