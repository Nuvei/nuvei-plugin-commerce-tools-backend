---
title: Make Payment
layout: home
parent: Extension API module
---
- [Make payment](#make-payment)
  - [Make an API call to make payment](#make-an-api-call-to-make-payment)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
      - [Parameters](#parameters)
      - [Responses](#responses)

**Please see [Integration Guide](IntegrationGuide.md) first before reading this document.**

## Make payment

When you're working with the session token, the extension API module steps in, providing the capability to create payments manually as needed, aligning perfectly with the business logic at play.

### Make an API call to make payment

#### Prerequisites

You should already have a valid Nuvei session token created. Such a token could be created using the [open order api endpoint](OpenOrder.md).

#### Steps

To make a payment, call the extension api module with the following parameters:

```bash
POST /makePayment
```

##### Parameters

| name           | type     | data type      | description                                                                                                                               |
| -------------- | -------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| transactionType| required | string         | Sale, Auth, or PreAuth.                                                                                                                   |
| sessionToken   | required | string         | The session identifier to be used by the request that processed the newly opened order.                                                   |
| currency       | required | string         | The currency of the payment                                                                                                               |
| amount         | required | string         | The planned amount                                                                                                                        |
| paymentOption  | required | PaymentOption  | `{ paymentOption: { card: { cardNumber: string, cardHolderName: string, expirationMonth: string, expirationYear: string, CVV: string }}}` |
| deviceDetails  | required | DeviceDetails  | `{ deviceDetails: { ipAddress: string }}`                                                                                                 |
| billingAddress | required | BillingAddress | `{ billingAddress: { firstName: string, lastName: string, email: string, country: string }}`                                              |

##### Responses

| http code | content-type       | response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`     | `application/json` | `{ userTokenId: string, isAFT: string, paymentOption: { userPaymentOptionId: string, card: { cardNumber: string, cardHolderName: string, expirationMonth: string, expirationYear: string, CVV: string }}, transactionStatus: string, gwErrorCode: string, gwExtendedErrorCode: string, transactionType: string, transactionId: string, externalTransactionId: string, authCode: string, customData: string, fraudDetails: { finalDecision: string }, sessionToken: string, clientUniqueId: string, internalRequestId: string, status: string, errCode: string, reason: string, merchantId: string, merchantSiteId: string, version: string, clientRequestId: string, merchantAdviceCode: string }` |
| `400`     | `application/json` | `{ errors: [{ message: string, field: string }] }`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `401`     | `application/json` | `{ message: string, field: string }`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

