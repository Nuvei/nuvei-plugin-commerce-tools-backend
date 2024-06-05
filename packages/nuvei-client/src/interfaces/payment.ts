import type { AuthOnlyTypeEnum } from './authentication-only-type-enum.js';
import type { BrandEnum } from './brand-enum.js';

type PaymentOption =
    | {
          type: 'card';
          cardNumber: string;
          cardHolderName: string;
          expirationMonth: string;
          expirationYear: string;
          CVV: string;
          brand?: string; // Conditional, Relevant for Apple Pay or Google Pay only
          last4Digits?: string; // Conditional, Relevant for Apple Pay or Google Pay only
      }
    | {
          type: 'alternativePaymentMethod';
          ccTempToken: string;
          cardHolderName: string;
      }
    | {
          type: 'userPaymentOptionId';
          userPaymentOptionId: string;
          expirationMonth?: string; // Additional parameters if needed
          expirationYear?: string;
          CVV?: string;
      }
    | {
          type: 'savePm';
          savePm: boolean;
      };

export default interface PaymentType {
    sessionToken: string; // Session identifier returned by /getSessionToken.
    currency: string; // The 3-letter ISO currency code.
    amount: string; // The transaction amount.
    paymentOption: PaymentOption; // Required, see options below
    timeStamp: string;
    deviceDetails: {
        ipAddress: string;
        deviceManufacturerIdentifier?: string;
        deviceType?: string;
        deviceName?: string;
        deviceOS?: string;
        browser?: string;
    };

    billingAddress: {
        country: string;
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
        address?: string;
        zip?: string;
        city?: string;
        state?: string;
        addressLine2?: string;
        addressLine3?: string;
        county?: string;
    };
    relatedTransactionId?: string;
    externalSchemeDetails?: {
        transactionId: string;
        brand: BrandEnum;
    };
    authenticationOnlyType?: AuthOnlyTypeEnum;
    userTokenId?: string;
    userDetails?: {
        firstName: string;
        lastName: string;
        address: string;
        phone: string;
        zip: string;
        city: string;
        country: string;
        state: string;
        email: string;
        county: string;
        language: string;
        dateOfBirth: string;
        identification: string;
    };
    isRebilling?: string;
    companyDetails?: {
        taxId: string;
    };
    recipientDetails?: {
        firstName: string;
        lastName: string;
    };
    subMerchant?: {
        countryCode: string;
        city: string;
        id: string;
    };
    clientRequestId?: string;
    clientUniqueId?: string;
    amountDetails?: {
        totalShipping?: string;
        totalHandling?: string;
        totalDiscount?: string;
    };
    items?: Array<{
        name: string;
        price: string;
        quantity: string;
    }>;
    shippingAddress?: {
        firstName: string;
        lastName: string;
        address: string;
        cell?: string;
        phone?: string;
        zip: string;
        city: string;
        country: string;
        state: string;
        email: string;
        county?: string;
        addressLine2?: string;
        addressLine3?: string;
    };
    dynamicDescriptor?: {
        merchantName: string;
        merchantPhone: string;
    };
    isMoto?: string;
    merchantDetails?: {
        customField1?: string;
        customField2?: string;
        customField3?: string;
        customField4?: string;
        customField5?: string;
        customField6?: string;
        customField7?: string;
        customField8?: string;
        customField9?: string;
        customField10?: string;
        customField11?: string;
        customField12?: string;
        customField13?: string;
        customField14?: string;
        customField15?: string;
    };
    urlDetails?: {
        successUrl: string;
        failureUrl: string;
        pendingUrl: string;
        notificationUrl: string;
    };
    transactionType?: string;
    isPartialApproval?: boolean;
    customSiteName?: string;
    productId?: string;
    customData?: string;
    webMasterId?: string;
    orderId?: string;
    addendums?: Record<string, unknown>;
    currencyConversion?: {
        type: string;
        originalAmount: string;
        originalCurrency: string;
    };
    paymentFlow?: string;
    redirectFlowUITheme?: string;
}

interface Card {
    ccCardNumber: string;
    bin: string;
    last4Digits: string;
    ccExpMonth: string;
    ccExpYear: string;
    acquirerId: string;
    cvv2Reply: string;
    avsCode: string;
    cardType: string;
    cardBrand: string;
    threeD: Record<string, unknown>;
}

interface PaymentOptionResponse {
    userPaymentOptionId: string;
    card: Card;
}

interface FraudDetails {
    finalDecision: string;
}

export interface TransactionResponse {
    orderId: string;
    userTokenId: string;
    isAFT: string;
    paymentOption: PaymentOptionResponse;
    transactionStatus: string;
    gwErrorCode: string;
    gwExtendedErrorCode: string;
    transactionType: string;
    transactionId: string;
    externalTransactionId: string;
    authCode: string;
    customData: string;
    fraudDetails: FraudDetails;
    sessionToken: string;
    clientUniqueId: string;
    internalRequestId: string;
    status: string;
    errCode: string;
    reason: string;
    merchantId: string;
    merchantSiteId: string;
    version: string;
    clientRequestId: string;
    merchantAdviceCode: string;
}
