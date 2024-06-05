import crypto from 'node:crypto';
import moment from 'moment';
import nuveiSdk from '@nuvei/sdk-client';
import type { VoidTransactionResponse, RefundResponseType } from '@nuvei/sdk-client';
import { Logger } from '@nuvei/util';

export default async function execute(requestBody: any): Promise<VoidTransactionResponse | RefundResponseType> {
    const logger = Logger.get();

    const nuveiRequest = {
        amount: requestBody.amount,
        currency: requestBody.currency,
        relatedTransactionId: requestBody.relatedTransactionId,
        timeStamp: moment().format('YYYYMMDDHHmmss'),
        clientRequestId: crypto.randomUUID()
    };

    try {
        if (requestBody.forceRefund) {
            throw new Error('Force refund was requested!');
        }

        const voidResponse = await nuveiSdk.voidTransaction(nuveiRequest);
        return voidResponse;
    } catch (error) {
        logger.error('Error on voidTransaction:' + JSON.stringify(error));

        const refundResponse = await nuveiSdk.refundTransaction(nuveiRequest);
        return refundResponse;
    }
}
