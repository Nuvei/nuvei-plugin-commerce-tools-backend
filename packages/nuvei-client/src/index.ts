import process from 'node:process';
import crypto from 'node:crypto';
// @ts-expect-error module has no @types
import * as sf from 'safecharge';
import type InitOrderPaymentType from './interfaces/init-payment.js';
import { type OpenOrderType, type OpenOrderResultType } from './interfaces/open-order.js';
import type { TransactionResponse } from './interfaces/payment.js';
import type PaymentType from './interfaces/payment.js';
import type { InitPaymentResponseType } from './interfaces/init-payment.js';
import type RefundType from './interfaces/refund.js';
import type { RefundResponseType } from './interfaces/refund.js';
import type VoidTransactionType from './interfaces/void-transaction.js';
import type { VoidTransactionResponse } from './interfaces/void-transaction.js';
import type SettleTransactionType from './interfaces/settle-transaction.js';
import type { SettleTransactionResponseType } from './interfaces/settle-transaction.js';
import type { PaymentStatusResponse } from './interfaces/payment-status.js';

const { env: ENV } = process;

const safecharge = sf.default;

safecharge.initiate(ENV.NUVEI_MERCHANT_ID, ENV.NUVEI_MERCHANT_SITE_ID, ENV.NUVEI_SECRET_KEY, ENV.NUVEI_ENV);

async function openOrder(order: OpenOrderType): Promise<OpenOrderResultType> {
    return new Promise((resolve, reject) => {
        safecharge.paymentService.openOrder(order, function (error: unknown, result: OpenOrderResultType) {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    });
}

async function initPayment(payment: InitOrderPaymentType): Promise<InitPaymentResponseType> {
    return new Promise((resolve, reject) => {
        safecharge.paymentService.initPayment(payment, function (error: unknown, result: InitPaymentResponseType) {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    });
}

async function payment(payment: PaymentType): Promise<TransactionResponse> {
    return new Promise((resolve, reject) => {
        safecharge.paymentService.createPayment(payment, function (error: unknown, result: TransactionResponse) {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    });
}

async function refundTransaction(refund: RefundType): Promise<RefundResponseType> {
    return new Promise((resolve, reject) => {
        safecharge.paymentService.refundTransaction(refund, function (error: unknown, result: RefundResponseType) {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    });
}

async function voidTransaction(voidTransaction: VoidTransactionType): Promise<VoidTransactionResponse> {
    return new Promise((resolve, reject) => {
        safecharge.paymentService.voidTransaction(voidTransaction, function (error: unknown, result: VoidTransactionResponse) {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    });
}

async function settleTransaction(settleTransaction: SettleTransactionType): Promise<SettleTransactionResponseType> {
    return new Promise((resolve, reject) => {
        safecharge.paymentService.settleTransaction(settleTransaction, function (error: unknown, result: SettleTransactionResponseType) {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    });
}

async function getPaymentStatus(sessionToken: string): Promise<PaymentStatusResponse> {
    return new Promise((resolve, reject) => {
        safecharge.getPaymentStatus({ sessionToken }, function (error: unknown, result: PaymentStatusResponse) {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    });
}

function calculateChecksum(checkString: string, algorithm: string = 'sha256'): string {
    return crypto.createHash(algorithm).update(checkString).digest('hex');
}

const nuveiSDK = {
    payment,
    refundTransaction,
    voidTransaction,
    settleTransaction,
    openOrder,
    initPayment,
    getPaymentStatus,
    calculateChecksum
};

export default nuveiSDK;

export * from './interfaces/index.js';
