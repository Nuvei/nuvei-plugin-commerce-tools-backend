import type { Request, Response, NextFunction, Express } from 'express';
import { body, validationResult } from 'express-validator';
import healthController from './api/health/health.controller.js';
import paymentController from './api/payment/payment.controller.js';
import { auth } from './middleware/auth.js';

function handleValidationResult(req: Request, res: Response, next: NextFunction) {
    const result: any = validationResult(req);
    const { errors = [] } = result;

    if (errors?.length) {
        res.status(400).json({
            errors: errors.map((err: { msg: string; path: string }) => ({ message: err.msg, field: err.path }))
        });

        return;
    }

    next();
}

const supportedCurrencyCodes = [
    'AED',
    'ALL',
    'AMD',
    'ARS',
    'AUD',
    'AZN',
    'BAM',
    'BDT',
    'BGN',
    'BHD',
    'BMD',
    'BND',
    'BRL',
    'BYN',
    'CAD',
    'CHF',
    'CLP',
    'CNY',
    'COP',
    'CRC',
    'CZK',
    'DKK',
    'DOP',
    'DZD',
    'EGP',
    'EUR',
    'GBP',
    'GEL',
    'GHS',
    'GTQ',
    'HKD',
    'HUF',
    'IDR',
    'INR',
    'IQD',
    'ISK',
    'JOD',
    'JPY',
    'KES',
    'KGS',
    'KRW',
    'KWD',
    'KYD',
    'KZT',
    'LBP',
    'LKR',
    'MAD',
    'MDL',
    'MKD',
    'MMK',
    'MNT',
    'MUR',
    'MWK',
    'MXN',
    'MYR',
    'MZN',
    'NAD',
    'NGN',
    'NOK',
    'NZD',
    'OMR',
    'PEN',
    'PHP',
    'PKR',
    'PLN',
    'PYG',
    'QAR',
    'RON',
    'RSD',
    'RUB',
    'SAR',
    'SEK',
    'SGD',
    'SOS',
    'THB',
    'TND',
    'TOP',
    'TRY',
    'TTD',
    'TWD',
    'UAH',
    'UGX',
    'USD',
    'UYU',
    'UZS',
    'VND',
    'XAF',
    'XOF',
    'YER',
    'ZAR'
];

export default function routes(app: Express): void {
    app.get('/health', healthController.processRequest);

    app.post(
        '/ct-nuvei/open-order',
        auth,
        body('resource.obj.id').notEmpty(),
        body('resource.obj.amountPlanned.fractionDigits').notEmpty(),
        body('resource.obj.amountPlanned.centAmount').notEmpty(),
        body('resource.obj.amountPlanned.currencyCode').notEmpty(),
        paymentController.processCTOpenOrderRequest
    );
    app.post(
        '/openOrder',
        auth,
        body('clientUniqueId').notEmpty(),
        body('currency').notEmpty().isIn(supportedCurrencyCodes),
        body('amount').notEmpty(),
        handleValidationResult,
        paymentController.processOpenOrderRequest
    );

    app.post(
        '/payment',
        auth,
        body('sessionToken').notEmpty(),
        body('currency').notEmpty().isIn(supportedCurrencyCodes),
        body('amount').notEmpty(),
        body('paymentOption.card.cardNumber').notEmpty(),
        body('paymentOption.card.cardHolderName').notEmpty(),
        body('paymentOption.card.expirationMonth').notEmpty(),
        body('paymentOption.card.expirationYear').notEmpty(),
        body('paymentOption.card.CVV').notEmpty(),
        body('deviceDetails.ipAddress').notEmpty(),
        body('billingAddress.country').notEmpty(),
        body('billingAddress.email').notEmpty(),
        body('billingAddress.firstName').notEmpty(),
        body('billingAddress.lastName').notEmpty(),
        handleValidationResult,
        paymentController.processPaymentRequest
    );
    app.post(
        '/settleTransaction',
        auth,
        body('amount').notEmpty(),
        body('currency').notEmpty().isIn(supportedCurrencyCodes),
        body('relatedTransactionId').notEmpty(),
        handleValidationResult,
        paymentController.processSettleTransactionRequest
    );
    app.post(
        '/voidTransaction',
        auth,
        body('amount').notEmpty(),
        body('currency').notEmpty().isIn(supportedCurrencyCodes),
        body('relatedTransactionId').notEmpty(),
        handleValidationResult,
        paymentController.processVoidTransactionRequest
    );
    app.post(
        '/refundTransaction',
        auth,
        body('amount').notEmpty(),
        body('currency').notEmpty().isIn(supportedCurrencyCodes),
        body('relatedTransactionId').notEmpty(),
        handleValidationResult,
        paymentController.processRefundTransactionRequest
    );
    app.post(
        '/getPaymentStatus',
        auth,
        body('sessionToken').notEmpty(),
        handleValidationResult,
        paymentController.processGetPaymentStatusRequest
    );
}
