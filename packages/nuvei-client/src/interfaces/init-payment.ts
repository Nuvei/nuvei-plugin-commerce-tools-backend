export type CardPaymentOption = {
    cardNumber: string;
    cardHolderName: string;
    expirationMonth: string;
    expirationYear: string;
    CVV: string;
    acquirerId: string;
};

export type TemporaryGeneratedToken = {
    ccTempToken: string;
    cardHolderName: string;
};

export type UserPaymentOptionId = {
    expirationMonth: string;
    expirationYear: string;
    CVV: string;
};

export type PaymentOptionType = CardPaymentOption | TemporaryGeneratedToken;

export type InitOrderPaymentType = {
    sessionToken: string; // The session identifier returned by /getSessionToken.
    merchantId: string; // The merchant ID provided by Nuvei.
    merchantSiteId: string; // The merchant site ID provided by Nuvei.
    clientUniqueId: string; // The ID of the transaction in the merchant’s system.
    currency: string; // The 3-letter ISO currency code.
    amount: string; // The transaction amount.
    paymentOption: Record<string, PaymentOptionType | UserPaymentOptionId>; // Represents the details of the payment method. Set it with one of 2 options:
    deviceDetails?: {
        ipAddress: string;
        deviceType?: string;
        deviceName?: string;
        deviceOS?: string;
        browser?: string;
    };
    userTokenIdString?: string; // This ID uniquely identifies your consumer/user in your system.
    urlDetails?: {
        successUrl: string;
        failureUrl: string;
        pendingUrl: string;
        notificationUrl: string;
    };
    billingAddress?: {
        addressMatch: string;
        city: string;
        country: string;
        address: string;
        addressLine2: string;
        addressLine3: string;
        zip: string;
        state: string;
        email: string;
        phone: string;
        cell: string;
        firstName: string;
        lastName: string;
    };
    clientRequestIdString?: string; // Based on the merchant configuration, this parameter is used to prevent idempotency. It uniquely identifies the API request you are submitting. If our system receives two calls with the same clientRequestId, it refuses the second call as it assumes idempotency.
    customData?: string;
    webMasterId?: string; // An affiliate parameter that the merchant can send. This is used by Nuvei’s eCommerce plugins (Magento, Demandware) and by Nuvei REST API SDKs to send the plugin/SDK name and version so that Support is able to identify from where the transaction arrived at the REST API Gateway.
    orderIdString?: string; // The ID to be used as an input parameter in the update method and payment methods. The parameter is sent to define which merchant order to update.
};

interface ThreeD {
    methodPayload: string;
    methodUrl: string;
    v2supported: string;
    serverTransId: string;
    version: string;
    directoryServerId: string;
    directoryServerPublicKey: string;
}

interface Card {
    ccCardNumber: string;
    bin: string;
    threeD: ThreeD;
    ccExpMonth: string;
    ccExpYear: string;
    last4Digits: string;
}

interface PaymentOption {
    card: Card;
}

export interface InitPaymentResponseType {
    reason: string;
    orderId: string;
    transactionStatus: string;
    customData: string;
    internalRequestId: string;
    version: string;
    transactionId: string;
    merchantSiteId: string;
    transactionType: string;
    gwExtendedErrorCode: string;
    gwErrorCode: string;
    merchantId: string;
    clientUniqueId: string;
    errCode: string;
    paymentOption: PaymentOption;
    sessionToken: string;
    userTokenId: string;
    status: string;
}

export default InitOrderPaymentType;
