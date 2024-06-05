import nuveiSdk from '@nuvei/sdk-client';
import type { PaymentStatusResponse } from '@nuvei/sdk-client';

export default async function execute(requestBody: any): Promise<PaymentStatusResponse> {
    const response = await nuveiSdk.getPaymentStatus(requestBody.sessionToken);

    return response;
}
