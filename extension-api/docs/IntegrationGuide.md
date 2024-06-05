---
title: Integration Guide
layout: home
parent: Extension API module
permalink: /extension-api/IntegrationGuide
---

# Integration Guide

- [Integration Guide](#integration-guide)
  - [How it works](#how-it-works)
  - [Before you begin](#before-you-begin)
  - [Step 1: Creating a commercetools payment](#step-1-creating-a-commercetools-payment)
    - [Response](#response)
  - [Step 2: Set up the web component Simply Connect](#step-2-set-up-the-web-component-simply-connect)
  - [Step 3: Get payment result](#step-3-get-payment-result)
- [Open order](#open-order)
- [Make payment](#make-payment)
- [Settle Transaction](#settle-transaction)
- [Get Payment Status](#get-payment-status)
- [Void or refund](#void-or-refund)

## How it works

This page provides a description of the checkout integration steps between the extension api module and Nuvei.

- [Step 1](#step-1-creating-a-commercetools-payment) : Create the commercetools payment object.
- [Step 2](#step-2-set-up-the-web-component-simply-connect) : Set up the web component Simply Connect
- [Step 3](#step-3-get-payment-result) : Get payment result

## Before you begin

To get the extension api module up and running, please follow our [how to run guide](./HowToRun.md).

## Step 1: Creating a commercetools payment

Prior to initiating the payment procedure, the merchant server must create a payment resource within the commercetools platform.

Within the commercetools platform, a payment serves as a container for the current status of money receipt and/or refunding. The financial transaction itself occurs seamlessly through the extension module, which processes the payment payload provided by the merchant server and interacts with the Nuvei API.

By default, the commercetools [payment](https://docs.commercetools.com/api/projects/payments#payment) lacks certain Nuvei-specific fields. Therefore, these fields must be configured as custom fields through a payment method-specific payment type.

Specifying the **required** fields:

| Field name                              | Value                                                                                                                      |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `amountPlanned`                         | How much money this payment intends to receive from the customer. The value usually matches the cart or order gross total. |
| `paymentMethodInfo.paymentInterface`    | `nuvei`                                                                                                                    |

If the required fields mentioned above are absent, the nuvei payment creation will be **rejected**.

Below is an example demonstrating the creation of a commercetools payment from scratch:
```json
{
    "amountPlanned": {
        "currencyCode": "EUR",
        "centAmount": 4200
    },
    "paymentMethodInfo": {
        "paymentInterface": "nuvei"
    },
    "custom": {
        "type": {
            "typeId": "type",
            "key": "commercetools-nuvei-payment-type"
        }
    }
}
```

Utilize the commercetools API to create a [payment](https://docs.commercetools.com/api/projects/payments#create-payment). Upon successful payment creation, ensure to always [add](https://docs.commercetools.com/api/projects/orders#add-payment) it to the appropriate order.

### Response

The payment response provides instructions for the subsequent steps of the payment process. In the event of a successful payment response, the commercetools payment key is assigned by Nuvei to the `sessionToken` custom field.

## Step 2: Set up the web component Simply Connect

Afterwards, utilize the Nuvei Web Component called Simply Connect to display the payment methods and gather necessary payment details from the shopper.

If you haven't yet developed the Simply Connect on your frontend, refer to the official [Nuvei Simply Connect integration guide](https://docs.nuvei.com/documentation/accept-payment/simply-connect/quick-start-for-checkout/).

## Step 3: Get payment result

After payment is initialized on the front-end, you can subscribe for the result using the `onResult` callback function from Simply Connection. The DMN module would receive the result from Nuvei asynchronously and update the commercetools payment accordingly.

# Open order

The extension api service supports creating a Nuvei session token via direct API if a custom business logic requires this. Follow the [open order documentation](OpenOrder.md) for more details.

# Make payment

With the session token, the extension API module enables manual payment creation when necessary according to the business logic. Follow the [make payment documentation](MakePayment.md) for more details.

# Settle Transaction

You have the option to settle a transaction manually. Follow the [settle transaction documentation](SettleTransaction.md) for more details.

# Get Payment Status

Once a Nuvei payment is performed, you can get the status using the Nuvei session token. Follow the [get payment status](GetPaymentStatus.md) for more details.

# Void or refund

If you need to return the funds to your shopper, you can utilize either the Void or Refund functionalities.

This will either:

- [**Void**](VoidPayment.md) - void the payment.
- [**Refund**](Refund.md) - (partially) refund a payment back to the shopper.
