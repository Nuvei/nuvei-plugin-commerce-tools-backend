interface UrlDetailsClass {
    notificationUrl: string; // The URL to which DMNs are sent.
}

interface PaymentOptionCardClass {
    cardNumber: string; // The card number.
    cardHolderName: string; // The card holder name.
    expirationMonth: string; // The card expiration month.
    expirationYear: string; // The card expiration year.
    CVV: string; // The CVV/CVC security code.
}

interface PaymentOptionClass {
    card?: PaymentOptionCardClass; // Represents a credit/debit card.
    userPaymentOptionId?: string; // Identifies a payment option for re-use.
}

interface CompanyDetailsClass {
    taxId: string; // The Tax ID of the merchant’s company.
}

interface SubMerchantClass {
    countryCode: string; // The payment facilitator’s sub-merchant’s 2-letter ISO country code.
    city: string; // The payment facilitator’s sub-merchant’s city name.
    id: string; // Represents the internal merchant’s ID, forwarded to Visa and Mastercard.
}

export interface RefundResponseType {
    merchantId: string; // Merchant ID provided by Nuvei.
    merchantSiteId: string; // Merchant Site ID provided by Nuvei.
    internalRequestId: number; // Nuvei’s internal unique Request ID.
    transactionId: string; // The transaction ID of the refund transaction for future actions.
    externalTransactionId: string; // The transaction ID of the transaction in the event that an external service is used.
    status: 'SUCCESS' | 'ERROR' | 'PENDING'; // The status of merchant’s API request/call.
    transactionStatus: 'APPROVED' | 'DECLINED' | 'ERROR'; // The Gateway transaction status.
    authCode: string; // Authorization code of the transaction.
    errCode: number; // If an error occurred on the request side, an error code is returned in this parameter.
    reason: string; // If an error occurred on the request side, then an error reason is returned in this parameter.
    paymentMethodErrorCode: number; // If an error occurred on the APM side, an error code is returned in this parameter.
    paymentMethodErrorReason: string; // If an error occurred on the APM side, an error reason is returned in this parameter.
    gwErrorCode: number; // If an error occurred in the Gateway, then an error code is returned in this parameter.
    gwErrorReason: string; // If an error occurred in the Gateway, then an error reason is returned in this parameter.
    gwExtendedErrorCode: number; // Error code if an error occurred on the bank’s side.
    customData: string; // Can be used to pass any type of information.
    version: string; // The current version of the request.
    clientRequestId: string; // The client’s Request ID as defined by the merchant for record-keeping.
    userPaymentOptionId: string; // Is returned only for an unreferenced refund.
    isAFT: boolean; // Indicates whether the transaction was processed as a Sale transaction or as an AFT.
    merchantAdviceCode: string; // Guides Mastercard merchants on how to proceed after an authorization request is declined.
}

export default interface RefundType {
    clientUniqueId?: string; // The ID of the transaction in the merchant’s system.
    amount: number; // The transaction amount.
    currency: string; // The 3-letter ISO currency code.
    timeStamp: string; // The local time when the method call is performed.
    relatedTransactionId: string; // The ID of the Settle/Sale transaction.
    subMerchantClass?: SubMerchantClass; // Represents the internal merchant’s details.
    clientRequestId?: string; // Used to prevent idempotency.
    authCode?: string; // Authorization code of the related Settle/Sale transaction.
    comment?: string; // A free text comment to the request.
    urlDetailsClass?: UrlDetailsClass; // Details for the URL to which DMNs are sent.
    customSiteName?: string; // The merchant’s site name.
    productId?: string; // A free text parameter used to identify the product/service sold.
    customData?: string; // Can be used to pass any type of information.
    webMasterId?: string; // An affiliate parameter that the merchant can send.
    paymentOptionClass?: PaymentOptionClass; // Details on the payment method.
    userTokenId?: string; // ID uniquely identifying your consumer/user in your system.
    companyDetailsClass?: CompanyDetailsClass; // Additional data required by Mastercard for unreferenced refunds.
}
