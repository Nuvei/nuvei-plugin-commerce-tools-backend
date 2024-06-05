import type { OpenOrderType } from '@nuvei/sdk-client';
import nuveiSdk from '@nuvei/sdk-client';

export type OpenOrderResponse = {
    sessionToken: string;
};

export default async function execute(requestBody: OpenOrderType): Promise<OpenOrderResponse> {
    const nuveiResponse = await nuveiSdk.openOrder({
        ...requestBody,
        amount: requestBody.amount,
        currency: requestBody.currency,
        userTokenId: requestBody.userTokenId,
        clientUniqueId: requestBody.clientUniqueId
    });

    return { sessionToken: nuveiResponse.sessionToken };
}
