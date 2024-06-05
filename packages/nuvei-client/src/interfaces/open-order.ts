import { type BrandEnum } from './brand-enum.js';

type Item = {
    name: string;
    price: string;
    quantity: string;
};

export type OpenOrderType = {
    clientUniqueId: string; // The ID of the transaction in the merchant’s system.
    currency: string;
    amount: string;
    openAmount?: { min: string; max: string }; // Allows the merchant to set amount limits, which are validated. REQUIRED if min and max values are provided in checkout()).
    externalSchemeDetails?: { transactionId: string; brand: BrandEnum }; // Use this if you want to process an MIT/recurring transaction that was initiated with another processor. Press here for more information.
    authenticationOnlyType?: string;
    userTokenId?: string; // This ID uniquely identifies your consumer/user in your system. It is REQUIRED only if you wish to use the userPaymentOptionId parameter for future charging of this user without re-collecting the payment details.
    isRebilling?: string; // When sending an /openOrder before performing recurring/rebilling createpayment(), include these parameters: isRebilling=0. For a 3D-Secure transaction, you must specify rebillExpiry and rebillFrequency under the v2AdditionalParams block, under the threeD block.
    companyDetails?: {
        taxId: string;
    };
    subMerchant?: {
        countryCode: string;
        city: string;
        id: string;
    };
    transactionType?: string;
    deviceDetails?: {
        ipAddress: string;
        deviceType: string;
        deviceName: string;
        deviceOS: string;
        browser: string;
    };
    amountDetails?: {
        // The items and amountDetails prices should be summed up in the amount parameter and sent separately. All prices must be in the same currency.
        totalShipping: string;
        totalHandling: string;
        totalDiscount: string;
        totalTax: string;
    };
    items?: Item[]; // An array describing the items in the purchase.
    dynamicDescriptor?: {
        merchantName: string;
        merchantPhone: string;
    };
    isMoto?: string;
    merchantDetails?: {
        customField1: string;
        customField2: string;
        customField3: string;
        customField4: string;
        customField5: string;
        customField6: string;
        customField7: string;
        customField8: string;
        customField9: string;
        customField10: string;
        customField11: string;
        customField12: string;
        customField13: string;
        customField14: string;
        customField15: string;
    };
    urlDetails?: {
        successUrl: string;
        failureUrl: string;
        pendingUrl: string;
        notificationUrl: string;
    };
    addendums?: any;
    preventOverride?: string;
    currencyConversion?: {
        type: 'MCP' | 'DCC';
        originalAmount: string;
        originalCurrency: string;
    };
    isPartialApproval?: string;
    productId?: string;
    customData?: string;
    webMasterIdString?: string;
    sessionCardDeclineLimit?: string;
};

export type OpenOrderResultType = {
    internalRequestId: number;
    status: string;
    errCode: number;
    reason: string;
    merchantId: string;
    merchantSiteId: string;
    version: string;
    clientRequestId: string;
    sessionToken: string;
    clientUniqueId: string;
    orderId: number;
    userTokenId: string;
};
