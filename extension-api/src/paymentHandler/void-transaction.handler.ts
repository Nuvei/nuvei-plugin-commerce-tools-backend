import crypto from 'node:crypto';
import moment from 'moment';
import nuveiSdk from '@nuvei/sdk-client';
import type { VoidTransactionResponse } from '@nuvei/sdk-client';

export default async function execute(requestBody: any): Promise<VoidTransactionResponse> {
    const response = await nuveiSdk.voidTransaction({
        amount: requestBody.amount,
        currency: requestBody.currency,
        relatedTransactionId: requestBody.relatedTransactionId,
        timeStamp: moment().format('YYYYMMDDHHmmss'),
        clientRequestId: crypto.randomUUID()
    });

    return response;
}
