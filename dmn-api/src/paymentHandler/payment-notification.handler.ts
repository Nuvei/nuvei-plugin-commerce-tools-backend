import nuveiSdk from '@nuvei/sdk-client';

const { env: ENV } = process;

const _mapStatus = (nuveiStatus: string): string => {
    switch (nuveiStatus) {
        case 'OK': {
            return 'Success';
        }

        case 'FAIL': {
            return 'Failure';
        }

        default: {
            return 'Pending';
        }
    }
};

const _mapTransactionType = (nuveiTransactionType: string): string => {
    switch (nuveiTransactionType) {
        case 'Auth':
        case 'PreAuth': {
            return 'Authorization';
        }

        case 'Settle':
        case 'Sale': {
            return 'Charge';
        }

        case 'Credit': {
            return 'Refund';
        }

        case 'Void': {
            return 'Chargeback';
        }

        case 'Chargeback': {
            return 'Chargeback';
        }

        default: {
            return nuveiTransactionType;
        }
    }
};

const execute = (commerceToolsClient: any) => async (requestBody: any) => {
    const concatenatedCheckSumParams = `${ENV.NUVEI_SECRET_KEY}${requestBody.totalAmount}${requestBody.currency}${requestBody.responseTimeStamp}${requestBody.PPP_TransactionID}${requestBody.Status}${requestBody.productId}`;
    const checkSum = nuveiSdk.calculateChecksum(concatenatedCheckSumParams);

    if (checkSum !== requestBody.advanceResponseChecksum) {
        throw new Error('Invalid checksum!');
    }

    const paymentId = requestBody.merchant_unique_id;
    if (paymentId) {
        let commercePayment = await commerceToolsClient.getPaymentById(paymentId);

        if (commercePayment.body) {
            commercePayment = await commerceToolsClient.addTransactionToPayment(paymentId, commercePayment.body.version, {
                type: _mapTransactionType(requestBody.transactionType),
                interactionId: requestBody.TransactionID,
                amount: {
                    fractionDigits: 2,
                    centAmount: Math.round(requestBody.totalAmount * 10 ** 2),
                    currencyCode: requestBody.currency,
                    type: 'centPrecision'
                },
                state: _mapStatus(requestBody.ppp_status),
                timestamp: new Date(requestBody.responseTimeStamp).toISOString()
            });

            if (
                requestBody.ppp_status === 'OK' &&
                Math.round(requestBody.totalAmount * 10 ** 2) === commercePayment.body.amountPlanned.centAmount
            ) {
                commercePayment = await commerceToolsClient.setPaymentStatusInterfaceCode(paymentId, commercePayment.body.version, 'paid');
            }

            if (requestBody.cardCompany) {
                commercePayment = await commerceToolsClient.setPaymentMethodInfoMethod(
                    paymentId,
                    commercePayment.body.version,
                    requestBody.cardCompany
                );
            }

            if (requestBody.cardType) {
                await commerceToolsClient.setPaymentMethodInfoName(paymentId, commercePayment.body.version, {
                    en: requestBody.cardType
                });
            }
        }
    }
};

export default execute;
