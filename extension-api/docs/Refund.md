---
title: Refund
layout: home
parent: Extension API module
---
- [Refund a payment](#refund-a-payment)
  - [Make an API call to refund a payment](#make-an-api-call-to-refund-a-payment)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
      - [Parameters](#parameters)
      - [Responses](#responses)

**Please see [Integration Guide](IntegrationGuide.md) first before reading this document.**

## Refund a payment

In the event that you need to reimburse your shopper, such as when they return an item, you'll need to initiate a Refund request.


### Make an API call to refund a payment

#### Prerequisites

The payment must have one `Charge` transaction with a state of `Success`. In this transaction, the `relatedTransactionId` field is utilized as the transaction ID for the Nuvei refund request.

#### Steps

To refund a payment, call the extension api module with the following parameters:

```bash
POST /refundTransaction
```

##### Parameters

| name                 | type     | data type | description                                                                             |
| -------------------- | -------- | --------- | --------------------------------------------------------------------------------------- |
| amount               | required | string    | The transaction amount                                                                  |
| currency             | required | string    | The 3-letter ISO currency code.                                                         |
| relatedTransactionId | required | string    | The ID of the original transaction.                                                     |
| forceRefund          | optional | boolean   | Enforce refund transaction, otherwise transaction would be attempted to be voided first |

##### Responses

| http code | content-type       | response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `200`     | `application/json` | `{ "RefundTransactionResponse": { "merchantId": "string", "merchantSiteId": "string", "internalRequestId": "number", "transactionId": "string", "externalTransactionId": "string", "status": "string", "transactionStatus": "string", "authCode": "string", "errCode": "number", "reason": "string", "paymentMethodErrorCode": "number", "paymentMethodErrorReason": "string", "gwErrorCode": "number", "gwErrorReason": "string", "gwExtendedErrorCode": "number", "customData": "string", "version": "string" } }` |
| `400`     | `application/json` | `{ errors: [{ message: string, field: string }]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `401`     | `application/json` | `{ message: string, field: string }`

