
---
title: Void a payment
layout: home
parent: Extension API module
---
- [parent: Extension API module](#parent-extension-api-module)
- [Void a payment](#void-a-payment)
  - [Make an API call to void a payment](#make-an-api-call-to-void-a-payment)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
      - [Parameters](#parameters)
      - [Responses](#responses)


**Please see [Integration Guide](IntegrationGuide.md) first before reading this document.**

## Void a payment

If you've authorized a payment but don't intend to capture it, you should submit a Void request to return the funds to the shopper. However, if the payment has already been authorized, you'll need to process a [refund](./Refund.md) instead.

### Make an API call to void a payment

#### Prerequisites

The payment must have one `Authorization` transaction with a state of `Success`. In this transaction, the `relatedTransactionId` field is utilized as the transaction ID for the Nuvei void request.

#### Steps

To void a payment, call the extension api module with the following parameters:

```bash
POST /voidTransaction
```

##### Parameters

| name                 | type     | data type | description                         |
| -------------------- | -------- | --------- | ----------------------------------- |
| amount               | required | string    | The transaction amount              |
| currency             | required | string    | The 3-letter ISO currency code.     |
| relatedTransactionId | required | string    | The ID of the original transaction. |

##### Responses

| http code | content-type       | response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `200`     | `application/json` | `{ "VoidTransactionResponse": { "merchantId": "string", "merchantSiteId": "string", "internalRequestId": "number", "transactionId": "string", "externalTransactionId": "string", "status": "string", "transactionStatus": "string", "authCode": "string", "errCode": "number", "reason": "string", "paymentMethodErrorCode": "number", "paymentMethodErrorReason": "string", "gwErrorCode": "number", "gwErrorReason": "string", "gwExtendedErrorCode": "number", "customData": "string", "version": "string" } }` |
| `400`     | `application/json` | `{ errors: [{ message: string, field: string }]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `401`     | `application/json` | `{ message: string, field: string }`                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |


