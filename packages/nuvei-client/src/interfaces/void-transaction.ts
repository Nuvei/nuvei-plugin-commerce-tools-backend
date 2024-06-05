export default interface VoidTransactionType {
    clientUniqueId?: string; // The ID of the transaction in the merchant’s system.
    amount: number; // The transaction amount.
    currency: string; // The 3-letter ISO currency code.
    relatedTransactionId: string; // The ID of the original transaction.
    timeStamp: string; // The local time when the method call is performed in the format: YYYYMMDDHHmmss.
    subMerchant?: {
        countryCode: string; // The payment facilitator’s sub-merchant’s 2-letter ISO country code.
        city: string; // The payment facilitator’s sub-merchant’s city name.
        id: string; // Represents the internal merchant’s ID, forwarded to Visa and Mastercard.
    };
    clientRequestId?: string; // Used to prevent idempotency, uniquely identifies the API request.
    authCode?: string; // The authorization code of the related transaction, to be compared to the original one.
    comment?: string; // Enables the addition of a free text comment to the request.
    urlDetails?: {
        notificationUrl: string; // The URL to which DMNs are sent.
    };
    customSiteName?: string; // The merchant’s site name.
    productId?: string; // A free text parameter used to identify the product/service sold.
    customData?: string; // Can be used to pass any type of information.
    webMasterId?: string; // An affiliate parameter that the merchant can send.
}

export interface VoidTransactionResponse {
    merchantId: string; // The Merchant ID provided by Nuvei.
    merchantSiteId: string; // The Merchant Site ID provided by Nuvei.
    internalRequestId: number; // Nuvei’s internal unique Request ID (used for reconciliation purposes).
    transactionId: string; // The transaction ID of the void transaction for future actions.
    externalTransactionId: string; // The transaction ID of the transaction in the event that an external service is used.
    status: string; // The status of merchant’s API request/call. Possible values: SUCCESS, ERROR.
    transactionStatus: string; // The Gateway transaction status. Possible values: APPROVED, DECLINED, ERROR.
    authCode: string; // Authorization code of the transaction.
    errCode: number; // If an error occurred on the request side, an error code is returned in this parameter.
    reason: string; // If an error occurred on the request side, then an error reason is returned in this parameter.
    paymentMethodErrorCode: number; // If an error occurred on the APM side, an error code is returned in this parameter.
    paymentMethodErrorReason: string; // If an error occurred on the APM side, an error reason is returned in this parameter.
    gwErrorCode: number; // If an error occurred in the Gateway, then an error code is returned in this parameter.
    gwErrorReason: string; // If an error occurred in the Gateway, then an error reason is returned in this parameter.
    gwExtendedErrorCode: number; // Error code if an error occurred on the bank’s side.
    customData: string; // Can be used to pass any type of information.
    version: string; // The current version of the request. The current version is 1.
}
