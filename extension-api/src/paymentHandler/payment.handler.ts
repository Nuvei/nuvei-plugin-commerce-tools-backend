import crypto from 'node:crypto';
import moment from 'moment';
import nuveiSdk from '@nuvei/sdk-client';
import type { TransactionResponse } from '@nuvei/sdk-client';

export default async function execute(requestBody: any, ipAddress: string): Promise<TransactionResponse> {
    const response = await nuveiSdk.payment({
        transactionType: requestBody.transactionType,
        sessionToken: requestBody.sessionToken,
        amount: requestBody.amount,
        currency: requestBody.currency,
        paymentOption: requestBody.paymentOption,
        timeStamp: moment().format('YYYYMMDDHHmmss'),
        billingAddress: requestBody.billingAddress,
        deviceDetails: {
            ipAddress
        },
        clientRequestId: crypto.randomUUID()
    });

    return response;
}
