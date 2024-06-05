---
title: Get Payment Status
layout: home
parent: Extension API module
---
- [Get payment status](#get-payment-status)
  - [Make an API call to get payment status](#make-an-api-call-to-get-payment-status)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
      - [Parameters](#parameters)
      - [Responses](#responses)

**Please see [Integration Guide](IntegrationGuide.md) first before reading this document.**

## Get payment status

This method retrieves the status of a payment recently performed. It receives the nuvei session token and queries if a payment was performed. If a payment was performed, the method returns the status of this payment.

### Make an API call to get payment status

#### Prerequisites

There must be one performed nuvei payment and the session token that was used for that payment.

#### Steps

To get Nuvei payment status, call the extension api module with the following parameters:


<details>
 <summary><code>POST</code> <code><b>/getPaymentStatus</b></code></summary>

##### Parameters

> | name         | type     | data type | description                                                                             |
> | ------------ | -------- | --------- | --------------------------------------------------------------------------------------- |
> | sessionToken | required | string    | The session identifier to be used by the request that processed the newly opened order. |

##### Responses

> | http code | content-type       | response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
> | --------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `200`     | `application/json` | `{"PaymentStatusResponse": {"sessionToken?": "string", "version?": "string", "status?": "string", "transactionStatus?": "string", "amount?": "string", "currency?": "string", "userPaymentOption?": {"userPaymentOptionId?": "string"}, "customData?": "string", "clientUniqueId?": "string", "gwExtendedErrorCode?": "number", "gwErrorCode?": "number", "gwErrorReason?": "string", "paymentMethodErrorCode?": "number", "paymentMethodErrorReason?": "string", "authCode?": "string", "merchantSiteId?": "string", "transactionType?": "string", "userTokenId?": "string", "transactionId?": "string", "errCode?": "number", "reason?": "string", "paymentOption": {"type": "'card'", "uniqueCC": "string", "threeD": {}}, "clientRequestId?": "string"}}` |
> | `400`     | `application/json` | `{ errors: [{ message: string, field: string }]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

</details>
