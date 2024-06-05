---
title: Settle Transaction
layout: home
parent: Extension API module
---
- [Settle transaction](#settle-transaction)
  - [Make an API call to settle transaction](#make-an-api-call-to-settle-transaction)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
      - [Parameters](#parameters)
      - [Responses](#responses)

**Please see [Integration Guide](IntegrationGuide.md) first before reading this document.**

## Settle transaction

By default, payments are automatically settled either immediately or after a specified delay following authorization. However, for payment methods that allow separate authorization and settlement, you also retain the flexibility to settle the payment at a later time, such as after the goods have been shipped.

### Make an API call to settle transaction

#### Prerequisites

You should already have a valid Nuvei session token created and an authorization transaction under this session token. Such a token could be created using the [open order api endpoint](OpenOrder.md).

#### Steps

To settle a transaction, call the extension api module with the following parameters:

```bash
POST /settleTransaction
```

##### Parameters

| name                 | type     | data type | description                         |
| -------------------- | -------- | --------- | ----------------------------------- |
| amount               | required | string    | The transaction amount              |
| currency             | required | string    | The 3-letter ISO currency code.     |
| relatedTransactionId | required | string    | The ID of the original transaction. |

##### Responses

| http code | content-type       | response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200`     | `application/json` | `{ "SettleTransactionResponse": { clientRequestId: "string", isAFT: "boolean", "merchantId": "string", "merchantSiteId": "string", "internalRequestId": "number", "transactionId": "string", "externalTransactionId": "string", "status": "string", "transactionStatus": "string", "authCode": "string", "errCode": "number", "reason": "string", "paymentMethodErrorCode": "number", "paymentMethodErrorReason": "string", "gwErrorCode": "number", "gwErrorReason": "string", "gwExtendedErrorCode": "number", "customData": "string", "version": "string" } }` |
| `400`     | `application/json` | `{ errors: [{ message: string, field: string }]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `401`     | `application/json` | `{ message: string, field: string }`

