---
title: Integration Guide
layout: home
permalink: /docs/IntegrationGuide
---

# Integration Guide

1. [Running locally](#running-locally)
2. [API](#api)

## Running locally

To run locally, you must first install yarn and the project dependencies:

```console
$ nvm use # Get Node.js version from .nvmrc or install it manually
$ npm i -g yarn # Install yarn
$ yarn install # Install project dependencies
```

Next, you need to connect the extension to commercetools. To do that, you will need to run the extension-setup package with the proper configuration:

```console
$ cd packages/extension-setup
$ touch .env # Create .env file
```

```console
/*
To generate an API client, go to your commercetools merchant center,
then go to Settings > Developer Settings > Create new API client and
give it a name and admin rights (select admin client template)
*/

CTP_PROJECT_KEY=
CTP_CLIENT_SECRET=
CTP_CLIENT_ID=
CTP_AUTH_URL=
CTP_API_URL=

// This should be the public URL of the extension-api service, when running it locally you can expose your local ports via ngrok - https://ngrok.com/
// Don't forget to add the endpoint path to the URL: {extension_api_public_url}/ct-nuvei/open-order
CT_EXTENSION_URL=

// User credentials
CT_EXTENSION_AUTH_USER=
CT_EXTENSION_AUTH_PASSWORD=

```

After you have a valid `.env` file, you can start the package with yarn:

```console
$ cd packages/extension-setup
$ yarn start
```

Once it completes, you should see requests with status code 200 in the console. This indicates that the commercetools has successfully registered the extension. Then you can proceed with launching the `extension-api`, to do that edit the `.env`:

```console
// Extension API port
EXTENSION_API_PORT=

// From Nuvei
NUVEI_MERCHANT_ID=
NUVEI_MERCHANT_SITE_ID=
NUVEI_SECRET_KEY=
NUVEI_API_BASE_URL=
NUVEI_ENV=

CTP_PROJECT_KEY=
CTP_CLIENT_SECRET=
CTP_CLIENT_ID=
CTP_AUTH_URL=
CTP_API_URL=

CT_EXTENSION_AUTH_USER=
CT_EXTENSION_AUTH_PASSWORD=
```

And then to start the package:

```console
$ cd extension-api # Terminal 1
$ yarn start
```

Then edit the `dmn-api` environment variables:

```console
// Port of the DMN api
DMN_API_PORT=

CTP_PROJECT_KEY=
CTP_CLIENT_SECRET=
CTP_CLIENT_ID=
CTP_AUTH_URL=
CTP_API_URL=

// From Nuvei
NUVEI_SECRET_KEY=
```

> **_Additional setup for DMN:_** https://nuvei.com/settings/my_payment_settings The DMN URL needs to be exposed publicly in order for Nuvei to send notifications. You can expose your local dmn-api service instance via ngrok and you need to set the public DMN URL in the Nuvei
> system: Settings > My Integration Settings > DMN URL. Don't forget to add the endpoint path to the URL: {dmn_api_public_url}/dmn-api/payment-dmn

And start the `dmn-api`:

```console
$ cd dmn-api # Terminal 2
$ yarn start
```

## API

<details>
 <summary><code>POST</code> <code><b>/openOrder</b></code></summary>

##### Parameters

> | name           | type     | data type | description                                                                                                     |
> | -------------- | -------- | --------- | --------------------------------------------------------------------------------------------------------------- |
> | clientUniqueId | required | string    | Should be commercetools paymentId which will be later used by the DMN module to update the CT payment. |
> | currency       | required | string    | The currency of the payment                                                                                     |
> | amount         | required | string    | The planned amount                                                                                              |

##### Responses

> | http code | content-type       | response                                           |
> | --------- | ------------------ | -------------------------------------------------- |
> | `200`     | `application/json` | `{ sessionToken: string }`                         |
> | `400`     | `application/json` | `{ errors: [{ message: string, field: string }] }` |
> | `401`     | `application/json` | `{ message: string }`                              |

</details>

<details>
 <summary><code>POST</code> <code><b>/payments</b></code></summary>

##### Parameters

> | name           | type     | data type      | description                                                                                                                               |
> | -------------- | -------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
> | sessionToken   | required | string         | The session identifier to be used by the request that processed the newly opened order.                                                   |
> | currency       | required | string         | The currency of the payment                                                                                                               |
> | amount         | required | string         | The planned amount                                                                                                                        |
> | paymentOption  | required | PaymentOption  | `{ paymentOption: { card: { cardNumber: string, cardHolderName: string, expirationMonth: string, expirationYear: string, CVV: string }}}` |
> | deviceDetails  | required | DeviceDetails  | `{ deviceDetails: { ipAddress: string }}`                                                                                                 |
> | billingAddress | required | BillingAddress | `{ billingAddress: { firstName: string, lastName: string, email: string, country: string }}`                                              |

##### Responses

> | http code | content-type       | response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
> | --------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `200`     | `application/json` | `{ userTokenId: string, isAFT: string, paymentOption: { userPaymentOptionId: string, card: { cardNumber: string, cardHolderName: string, expirationMonth: string, expirationYear: string, CVV: string }}, transactionStatus: string, gwErrorCode: string, gwExtendedErrorCode: string, transactionType: string, transactionId: string, externalTransactionId: string, authCode: string, customData: string, fraudDetails: { finalDecision: string }, sessionToken: string, clientUniqueId: string, internalRequestId: string, status: string, errCode: string, reason: string, merchantId: string, merchantSiteId: string, version: string, clientRequestId: string, merchantAdviceCode: string }` |
> | `400`     | `application/json` | `{ errors: [{ message: string, field: string }] }`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
> | `401`     | `application/json` | `{ message: string, field: string }`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

</details>

<details>
 <summary><code>POST</code> <code><b>/voidTransaction</b></code></summary>

##### Parameters

> | name                 | type     | data type | description                         |
> | -------------------- | -------- | --------- | ----------------------------------- |
> | amount               | required | string    | The transaction amount              |
> | currency             | required | string    | The 3-letter ISO currency code.     |
> | relatedTransactionId | required | string    | The ID of the original transaction. |

##### Responses

> | http code | content-type       | response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
> | --------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
> | `200`     | `application/json` | `{ "VoidTransactionResponse": { "merchantId": "string", "merchantSiteId": "string", "internalRequestId": "number", "transactionId": "string", "externalTransactionId": "string", "status": "string", "transactionStatus": "string", "authCode": "string", "errCode": "number", "reason": "string", "paymentMethodErrorCode": "number", "paymentMethodErrorReason": "string", "gwErrorCode": "number", "gwErrorReason": "string", "gwExtendedErrorCode": "number", "customData": "string", "version": "string" } }` |
> | `400`     | `application/json` | `{ errors: [{ message: string, field: string }]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
> | `401`     | `application/json` | `{ message: string, field: string }`                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

</details>

<details>
 <summary><code>POST</code> <code><b>/settleTransaction</b></code></summary>

##### Parameters

> | name                 | type     | data type | description                         |
> | -------------------- | -------- | --------- | ----------------------------------- |
> | amount               | required | string    | The transaction amount              |
> | currency             | required | string    | The 3-letter ISO currency code.     |
> | relatedTransactionId | required | string    | The ID of the original transaction. |

##### Responses

> | http code | content-type       | response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
> | --------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `200`     | `application/json` | `{ "SettleTransactionResponse": { clientRequestId: "string", isAFT: "boolean", "merchantId": "string", "merchantSiteId": "string", "internalRequestId": "number", "transactionId": "string", "externalTransactionId": "string", "status": "string", "transactionStatus": "string", "authCode": "string", "errCode": "number", "reason": "string", "paymentMethodErrorCode": "number", "paymentMethodErrorReason": "string", "gwErrorCode": "number", "gwErrorReason": "string", "gwExtendedErrorCode": "number", "customData": "string", "version": "string" } }` |
> | `400`     | `application/json` | `{ errors: [{ message: string, field: string }]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
> | `401`     | `application/json` | `{ message: string, field: string }`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

</details>

<details>
 <summary><code>POST</code> <code><b>/refundTransaction</b></code></summary>

##### Parameters

> | name                 | type     | data type | description                                                                             |
> | -------------------- | -------- | --------- | --------------------------------------------------------------------------------------- |
> | amount               | required | string    | The transaction amount                                                                  |
> | currency             | required | string    | The 3-letter ISO currency code.                                                         |
> | relatedTransactionId | required | string    | The ID of the original transaction.                                                     |
> | forceRefund          | optional | boolean   | Enforce refund transaction, otherwise transaction would be attempted to be voided first |

##### Responses

> | http code | content-type       | response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
> | --------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
> | `200`     | `application/json` | `{ "VoidTransactionResponse": { "merchantId": "string", "merchantSiteId": "string", "internalRequestId": "number", "transactionId": "string", "externalTransactionId": "string", "status": "string", "transactionStatus": "string", "authCode": "string", "errCode": "number", "reason": "string", "paymentMethodErrorCode": "number", "paymentMethodErrorReason": "string", "gwErrorCode": "number", "gwErrorReason": "string", "gwExtendedErrorCode": "number", "customData": "string", "version": "string" } }` |
> | `400`     | `application/json` | `{ errors: [{ message: string, field: string }]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
> | `401`     | `application/json` | `{ message: string, field: string }`                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

</details>

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
