export default interface SettleTransactionType {
    clientUniqueId?: string; // The ID of the transaction in the merchant’s system.
    amount: number; // The transaction amount.
    currency: string; // The 3-letter ISO currency code.
    relatedTransactionId: string; // The ID of the original Auth transaction to be settled.
    timeStamp: string; // The local time when the method call is performed in the format: YYYYMMDDHHmmss.
    subMerchant?: {
        countryCode: string; // The payment facilitator’s sub-merchant’s 2-letter ISO country code.
        city: string; // The payment facilitator’s sub-merchant’s city name.
        id: string; // Represents the internal merchant’s ID, which is forwarded to Visa and Mastercard.
    };
    clientRequestId?: string; // Used to prevent idempotency. It uniquely identifies the API request.
    authCode?: string; // The authorization code of the original Auth transaction to be settled.
    descriptorMerchantName?: string; // Allows the merchant to define a dynamic descriptor for the name parameter.
    descriptorMerchantPhone?: string; // Allows the merchant to define a dynamic descriptor for the phone parameter.
    comment?: string; // Enables the addition of a free text comment to the request.
    notificationUrl?: string; // The URL to which DMNs are sent.
    addendums?: {
        airlines?: any; // Relevant for airlines.
        l23processingData?: any; // Relevant for l23 processing data.
    };
    customSiteName?: string; // The merchant’s site name.
    productId?: string; // A free text parameter used to identify the product/service sold.
    customData?: string; // Can be used to pass any type of information.
    webMasterId?: string; // An affiliate parameter that the merchant can send.
    totalSettleCount?: string; // The number of settlements the merchant wishes to perform.
}

export interface SettleTransactionResponseType {
    merchantId: string; // Merchant ID provided by Nuvei.
    merchantSiteId: string; // Merchant Site ID provided by Nuvei.
    internalRequestId: number; // The ID of the API request in the merchant’s system.
    transactionId: string; // The transaction ID of the settle transaction for future actions.
    externalTransactionId: string; // The transaction ID of the transaction in the event that an external service is used.
    status: 'SUCCESS' | 'ERROR'; // The status of merchant’s API request/call.
    transactionStatus: 'APPROVED' | 'DECLINED' | 'ERROR'; // The Gateway transaction status.
    authCode: string; // Authorization code of the transaction.
    errCode: number; // If an error occurred on the request side, an error code is returned in this parameter.
    reason: string; // If an error occurred on the request side, then an error reason is returned in this parameter.
    paymentMethodErrorCode: number; // If an error occurred on the APM side, an error code is returned in this parameter.
    paymentMethodErrorReason: string; // If an error occurred on the APM side, an error reason is returned in this parameter.
    gwErrorCode: number; // If an error occurred in the Gateway, then an error code is returned in this parameter.
    gwErrorReason: string; // If an error occurred in the Gateway, then an error reason is returned in this parameter.
    gwExtendedErrorCode: number; // Error code if an error occurred on the bank’s side.
    // When a transaction is successful, this parameter is 0.
    // When a transaction is not successful, the parameter is the code of the generic error.
    customData: string; // Can be used to pass any type of information.
    // If sent in the request, then it is passed on to the payment Gateway;
    // it is then visible in Nuvei’s back office tool for transaction reporting and is returned in the response.
    version: string; // The current version of the request. The current version is 1.
    clientRequestId: string; // The client’s Request ID as defined by the merchant for record-keeping.
    isAFT: boolean; // Indicates whether the transaction was processed as a Sale transaction or as an AFT.
}
