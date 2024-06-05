import crypto from 'node:crypto';
import moment from 'moment';
import nuveiSdk from '@nuvei/sdk-client';
import type { SettleTransactionResponseType } from '@nuvei/sdk-client';

export default async function execute(requestBody: any): Promise<SettleTransactionResponseType> {
    const response = await nuveiSdk.settleTransaction({
        amount: requestBody.amount,
        currency: requestBody.currency,
        relatedTransactionId: requestBody.relatedTransactionId,
        timeStamp: moment().format('YYYYMMDDHHmmss'),
        clientRequestId: crypto.randomUUID()
    });

    return response;
}
