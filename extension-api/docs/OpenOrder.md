---
title: Open Order
layout: home
parent: Extension API module
---
- [Open order](#open-order)
  - [Make an API call to open order](#make-an-api-call-to-open-order)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
      - [Parameters](#parameters)
      - [Responses](#responses)

**Please see [Integration Guide](IntegrationGuide.md) first before reading this document.**

## Open order

If there's a custom business logic in the application and the creation of the Nuvei session token needs to be created separately from payment, you can still achieve this by using the open order API.

### Make an API call to open order

#### Prerequisites

There should be at least one commercetools payment created, before using this API. The reason behind this is that when calling this API, the payment ID is expected so that the session token will be related to the commerce tools payment later in the flow.

#### Steps

To open order, call the extension api module with the following parameters:

```bash
POST /openOrder
```

##### Parameters

| name           | type     | data type | description                                                                                                     |
| -------------- | -------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| clientUniqueId | required | string    | Should be commercetools paymentId which will be later used by the DMN module to update the CT payment. |
| currency       | required | string    | The currency of the payment                                                                                     |
| amount         | required | string    | The planned amount                                                                                              |

##### Responses

| http code | content-type       | response                                           |
| --------- | ------------------ | -------------------------------------------------- |
| `200`     | `application/json` | `{ sessionToken: string }`                         |
| `400`     | `application/json` | `{ errors: [{ message: string, field: string }] }` |
| `401`     | `application/json` | `{ message: string }`                              |
