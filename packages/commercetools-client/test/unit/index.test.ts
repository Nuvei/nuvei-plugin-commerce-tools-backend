import type {
    Extension,
    ClientResponse,
    Order,
    LocalizedString,
    Payment,
    TransactionDraft,
    PaymentDraft,
    PaymentState
} from '@commercetools/platform-sdk';
import type { Client } from '@commercetools/sdk-client-v2';
import { expect, test, vi, describe, expectTypeOf, beforeEach } from 'vitest';
import { type ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder.js';
import {
    getCustomTypeByKey,
    updateCustomType,
    getExtensionByKey,
    addCustomType,
    addExtension,
    updateExtension,
    getOrderById,
    setPaymentMethodInfoName,
    setPaymentMethodInfoMethod,
    getPaymentById,
    addTransactionToPayment,
    addPaymentToOrder,
    createPayment,
    updateOrderPaymentStatus,
    setPaymentStatusInterfaceCode
} from '../../src/index.js';
import type { CustomType } from '../../src/index.js';

const ctConfig = {
    authUrl: 'Test auth url',
    apiUrl: 'Test api url',
    projectKey: 'Test project key',
    clientId: 'Test client id',
    clientSecret: 'Test client secret'
};

const fakeApiRootSuccessResponse = {
    body: { success: true },
    statusCode: 200,
    headers: {}
};

vi.mock('@commercetools/sdk-client-v2', () => ({
    ClientBuilder: vi.fn().mockImplementation(() => {
        return {
            withProjectKey: vi.fn().mockReturnThis(),
            withClientCredentialsFlow: vi.fn().mockReturnThis(),
            withHttpMiddleware: vi.fn().mockReturnThis(),
            withLoggerMiddleware: vi.fn().mockReturnThis(),
            build: vi.fn().mockReturnValue({ test: 'Mocked client build' })
        };
    })
}));

const { default: CommercetoolsClient } = await import('../../src/index.js');

describe('Commercetools client', () => {
    let fakeApiRoot: any;

    beforeEach(() => {
        fakeApiRoot = {
            payments: vi.fn().mockReturnThis(),
            types: vi.fn().mockReturnThis(),
            extensions: vi.fn().mockReturnThis(),
            orders: vi.fn().mockReturnThis(),
            withKey: vi.fn().mockReturnThis(),
            withId: vi.fn().mockReturnThis(),
            get: vi.fn().mockReturnThis(),
            post: vi.fn().mockReturnThis(),
            execute: vi.fn().mockResolvedValue(fakeApiRootSuccessResponse)
        };
    });

    test('CommercetoolsClient contains necessary methods when invoked', () => {
        const ctClient = CommercetoolsClient(ctConfig);

        expectTypeOf(ctClient.getClient).toBeFunction();
        expectTypeOf(ctClient.getClient).toMatchTypeOf<() => Client>();

        expectTypeOf(ctClient.getExtensionByKey).toBeFunction();
        expectTypeOf(ctClient.getExtensionByKey).toMatchTypeOf<(extensionKey: string) => Promise<ClientResponse<Extension> | undefined>>();

        expectTypeOf(ctClient.getCustomTypeByKey).toBeFunction();
        expectTypeOf(ctClient.getCustomTypeByKey).toMatchTypeOf<(typeKey: string) => Promise<ClientResponse | undefined>>();

        expectTypeOf(ctClient.addCustomType).toBeFunction();
        expectTypeOf(ctClient.addCustomType).toMatchTypeOf<(customType: CustomType) => Promise<ClientResponse>>();

        expectTypeOf(ctClient.addExtension).toBeFunction();
        expectTypeOf(ctClient.addExtension).toMatchTypeOf<(extension: Extension) => Promise<ClientResponse<Extension>>>();

        expectTypeOf(ctClient.updateCustomType).toBeFunction();
        expectTypeOf(ctClient.updateCustomType).toMatchTypeOf<
            (existingCustomType: CustomType, newCustomType: CustomType) => Promise<ClientResponse>
        >();

        expectTypeOf(ctClient.updateExtension).toBeFunction();
        expectTypeOf(ctClient.updateExtension).toMatchTypeOf<
            (existingExtension: Extension, newExtension: Extension) => Promise<ClientResponse<Extension> | undefined>
        >();

        expectTypeOf(ctClient.getOrderById).toBeFunction();
        expectTypeOf(ctClient.getOrderById).toMatchTypeOf<(orderId: string) => Promise<ClientResponse<Order>>>();

        expectTypeOf(ctClient.setPaymentMethodInfoName).toBeFunction();
        expectTypeOf(ctClient.setPaymentMethodInfoName).toMatchTypeOf<
            (paymentId: string, paymentVersion: number, name: LocalizedString) => Promise<ClientResponse<Payment>>
        >();

        expectTypeOf(ctClient.setPaymentMethodInfoMethod).toBeFunction();
        expectTypeOf(ctClient.setPaymentMethodInfoMethod).toMatchTypeOf<
            (paymentId: string, paymentVersion: number, method: string) => Promise<ClientResponse<Payment>>
        >();

        expectTypeOf(ctClient.getPaymentById).toBeFunction();
        expectTypeOf(ctClient.getPaymentById).toMatchTypeOf<(paymentId: string) => Promise<ClientResponse<Payment>>>();

        expectTypeOf(ctClient.addTransactionToPayment).toBeFunction();
        expectTypeOf(ctClient.addTransactionToPayment).toMatchTypeOf<
            (paymentId: string, paymentVersion: number, transaction: TransactionDraft) => Promise<ClientResponse<Payment>>
        >();

        expectTypeOf(ctClient.addPaymentToOrder).toBeFunction();
        expectTypeOf(ctClient.addPaymentToOrder).toMatchTypeOf<
            (orderId: string, paymentId: string, orderVersion: number) => Promise<ClientResponse<Order>>
        >();

        expectTypeOf(ctClient.createPayment).toBeFunction();
        expectTypeOf(ctClient.createPayment).toMatchTypeOf<(payment: PaymentDraft) => Promise<ClientResponse<Payment>>>();

        expectTypeOf(ctClient.updateOrderPaymentStatus).toBeFunction();
        expectTypeOf(ctClient.updateOrderPaymentStatus).toMatchTypeOf<
            (orderId: string, version: number, paymentState: PaymentState) => Promise<ClientResponse<Order>>
        >();

        expectTypeOf(ctClient.setPaymentStatusInterfaceCode).toBeFunction();
        expectTypeOf(ctClient.setPaymentStatusInterfaceCode).toMatchTypeOf<
            (paymentId: string, paymentVersion: number, interfaceCode: string) => Promise<ClientResponse<Payment>>
        >();
    });

    test('getClient > Builds commercetools client', () => {
        const ctClient = CommercetoolsClient(ctConfig);
        const getClientSpy = vi.spyOn(ctClient, 'getClient');
        const result = ctClient.getClient();

        expect(getClientSpy).toHaveBeenCalledOnce();
        expect(result).toStrictEqual({ test: 'Mocked client build' });
    });

    test('getCustomTypeByKey > Fetches custom type by key', async () => {
        const mockedGetCustomTypeByKey = getCustomTypeByKey(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const result = await mockedGetCustomTypeByKey('testKey');

        expect(fakeApiRoot.types).toBeCalled();
        expect(fakeApiRoot.get).toBeCalled();
        expect(fakeApiRoot.withKey).toBeCalledWith({ key: 'testKey' });
        expect(result).toStrictEqual({
            body: { success: true },
            statusCode: 200,
            headers: {}
        });
    });

    test('getCustomTypeByKey > Throws when there is an error', async () => {
        const mockedGetCustomTypeByKey = getCustomTypeByKey(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);
        fakeApiRoot.execute.mockImplementationOnce(() => {
            throw new Error('Something went wrong!');
        });

        try {
            await mockedGetCustomTypeByKey('testKey');
        } catch (error) {
            const typedError = error as { message: string };
            expect(typedError.message).toStrictEqual('Something went wrong!');
        }
    });

    test('getCustomTypeByKey > Handles 404 error', async () => {
        const mockedGetCustomTypeByKey = getCustomTypeByKey(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);
        fakeApiRoot.execute.mockImplementationOnce(() => {
            throw Object.assign(new Error('Test error'), { statusCode: 404 });
        });

        const result = await mockedGetCustomTypeByKey('testKey');
        expect(result).toBe(undefined);
    });

    test('updateCustomType > Updates custom type', async () => {
        const mockedUpdateCustomType = updateCustomType(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const existingCustomType = {
            key: 'testKey',
            name: { test: 'test' },
            resourceTypeIds: ['test'],
            version: 1
        };

        const newCustomType = {
            key: 'testKey2',
            name: { test2: 'test2' },
            resourceTypeIds: ['test2'],
            version: 2
        };

        const result = await mockedUpdateCustomType(existingCustomType, newCustomType);

        expect(fakeApiRoot.types).toBeCalled();
        expect(fakeApiRoot.withKey).toBeCalledWith({ key: 'testKey' });
        expect(fakeApiRoot.post).toHaveBeenCalledWith(
            expect.objectContaining({
                body: {
                    actions: [
                        { action: 'changeKey', key: 'testKey2' },
                        { action: 'changeName', name: { test2: 'test2' } }
                    ],
                    version: 1
                }
            })
        );

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);
    });

    test('updateCustomType > Throws when fails to update custom type', async () => {
        fakeApiRoot.execute.mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const mockedUpdateCustomType = updateCustomType(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const existingCustomType = {
            key: 'testKey',
            name: { test: 'test' },
            resourceTypeIds: ['test'],
            version: 1
        };

        const newCustomType = {
            key: 'testKey2',
            name: { test2: 'test2' },
            resourceTypeIds: ['test2'],
            version: 2
        };

        try {
            await mockedUpdateCustomType(existingCustomType, newCustomType);
        } catch (error) {
            const typedError = error as { message: string };
            expect(typedError.message).toBe('Test error');
        }
    });

    test('getExtensionByKey > Fetches extension by key', async () => {
        const mockedGetExtensionByKey = getExtensionByKey(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const result = await mockedGetExtensionByKey('test key');

        expect(fakeApiRoot.extensions).toHaveBeenCalledOnce();
        expect(fakeApiRoot.withKey).toHaveBeenCalledWith({ key: 'test key' });
        expect(fakeApiRoot.get).toHaveBeenCalled();

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);
    });

    test('getExtensionByKey > Handles 404 error', async () => {
        fakeApiRoot.execute.mockImplementationOnce(() => {
            throw Object.assign(new Error('Test error'), { statusCode: 404 });
        });
        const mockedGetExtensionByKey = getExtensionByKey(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        try {
            await mockedGetExtensionByKey('test key');
        } catch (error) {
            expect(error).toBe(undefined);
        }
    });

    test('getExtensionByKey > Throws when fetching fails', async () => {
        fakeApiRoot.execute.mockImplementationOnce(() => {
            throw Object.assign(new Error('Test error'), { statusCode: 400 });
        });
        const mockedGetExtensionByKey = getExtensionByKey(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        try {
            await mockedGetExtensionByKey('test key');
        } catch (error) {
            const typedError = error as { message: string };
            expect(typedError.message).toEqual('Test error');
        }
    });

    test('addCustomType > Creates new custom type', async () => {
        const mockedAddCustomType = addCustomType(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const customType: CustomType = {
            key: 'test key',
            name: { test: 'test' },
            version: 1,
            resourceTypeIds: ['1', '2', '3'],
            fieldDefinitions: [{ type: { name: 'Boolean' }, name: 'test', required: true, label: { test: 'test' } }]
        };

        const result = await mockedAddCustomType(customType);

        expect(fakeApiRoot.types).toHaveBeenCalled();
        expect(fakeApiRoot.post).toHaveBeenCalledWith(
            expect.objectContaining({
                body: {
                    fieldDefinitions: [{ label: { test: 'test' }, name: 'test', required: true, type: { name: 'Boolean' } }],
                    key: 'test key',
                    name: { test: 'test' },
                    resourceTypeIds: ['1', '2', '3']
                }
            })
        );

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);
    });

    test('addCustomType > Throws when request fails', async () => {
        fakeApiRoot.execute.mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const mockedAddCustomType = addCustomType(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);
        const customType: CustomType = {
            key: 'test key',
            name: { test: 'test' },
            version: 1,
            resourceTypeIds: ['1', '2', '3'],
            fieldDefinitions: [{ type: { name: 'Boolean' }, name: 'test', required: true, label: { test: 'test' } }]
        };
        try {
            await mockedAddCustomType(customType);
        } catch (error) {
            const typedError = error as { message: string };
            expect(typedError.message).toBe('Test error');
        }
    });

    test('addCustomType > Throws when validation of custom type fails', async () => {
        const mockedAddCustomType = addCustomType(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);
        try {
            await mockedAddCustomType({});
        } catch (error) {
            const typedError = error as { message: string };
            expect(typedError.message).toBe('Invalid customType');
        }
    });

    test('addExtension > Creates extension', async () => {
        const mockedAddExtension = addExtension(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const extensionToAdd: Extension = {
            id: '1234-5678-9999',
            createdAt: '10-10-2010',
            version: 1,
            lastModifiedAt: '10-11-2010',
            destination: { type: 'HTTP', url: 'https://localhost:test' },
            triggers: [],
            key: 'test'
        };

        const result = await mockedAddExtension(extensionToAdd);

        expect(fakeApiRoot.extensions).toHaveBeenCalled();
        expect(fakeApiRoot.post).toHaveBeenCalledWith(
            expect.objectContaining({
                body: {
                    destination: { type: 'HTTP', url: 'https://localhost:test' },
                    key: 'test',
                    triggers: []
                }
            })
        );

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);
    });

    test('addExtension > Throws when request fails', async () => {
        fakeApiRoot.execute.mockImplementationOnce(() => {
            throw new Error('Test error');
        });
        const mockedAddExtension = addExtension(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const extensionToAdd: Extension = {
            id: '1234-5678-9999',
            createdAt: '10-10-2010',
            version: 1,
            lastModifiedAt: '10-11-2010',
            destination: { type: 'HTTP', url: 'https://localhost:test' },
            triggers: [],
            key: 'test'
        };

        try {
            await mockedAddExtension(extensionToAdd);
        } catch (error) {
            const typedError = error as { message: string };
            expect(typedError.message).toBe('Test error');
        }
    });

    test('updateExtension > Updates the extension with the new version', async () => {
        const mockedUpdateExtension = updateExtension(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const existingExtension: Extension = {
            id: 'test-1234',
            createdAt: '10-11-2012',
            lastModifiedAt: '10-11-2013',
            version: 1,
            key: 'test-1234',
            destination: { type: 'HTTP', url: 'https://localhost:test-1234' },
            triggers: []
        };

        const extensionToUpdate: Extension = {
            id: 'test-9876',
            createdAt: '10-11-2012',
            lastModifiedAt: '10-11-2013',
            version: 2,
            key: 'test-9876',
            destination: { type: 'HTTP', url: 'https://localhost:test-9876' },
            triggers: []
        };

        const result = await mockedUpdateExtension(existingExtension, extensionToUpdate);

        expect(fakeApiRoot.extensions).toHaveBeenCalled();
        expect(fakeApiRoot.withKey).toHaveBeenCalledWith({ key: 'test-1234' });
        expect(fakeApiRoot.post).toHaveBeenCalledWith(
            expect.objectContaining({
                body: {
                    actions: [
                        {
                            action: 'changeDestination',
                            destination: {
                                type: 'HTTP',
                                url: 'https://localhost:test-9876'
                            }
                        }
                    ],
                    version: 1
                }
            })
        );

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);
    });

    test('updateExtension > Changes triggers', async () => {
        const mockedUpdateExtension = updateExtension(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const existingExtension: Extension = {
            id: 'test-1234',
            createdAt: '10-11-2012',
            lastModifiedAt: '10-11-2013',
            version: 1,
            key: 'test-1234',
            destination: { type: 'HTTP', url: 'https://localhost:test-1234' },
            triggers: [{ resourceTypeId: 'test-resource-type-id-1', actions: ['Create'] }]
        };

        const extensionToUpdate: Extension = {
            id: 'test-9876',
            createdAt: '10-11-2012',
            lastModifiedAt: '10-11-2013',
            version: 2,
            key: 'test-9876',
            destination: { type: 'HTTP', url: 'https://localhost:test-9876' },
            triggers: [{ resourceTypeId: 'test-resource-type-id-2', actions: ['Update'] }]
        };

        const result = await mockedUpdateExtension(existingExtension, extensionToUpdate);

        expect(fakeApiRoot.extensions).toHaveBeenCalled();
        expect(fakeApiRoot.withKey).toHaveBeenCalledWith({ key: 'test-1234' });
        expect(fakeApiRoot.post).toHaveBeenCalledWith(
            expect.objectContaining({
                body: {
                    actions: [
                        {
                            action: 'changeDestination',
                            destination: {
                                type: 'HTTP',
                                url: 'https://localhost:test-9876'
                            }
                        },
                        {
                            action: 'changeTriggers',
                            triggers: [
                                {
                                    actions: ['Update'],
                                    resourceTypeId: 'test-resource-type-id-2'
                                }
                            ]
                        }
                    ],
                    version: 1
                }
            })
        );

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);
    });

    test('updateExtension > Throws when existing extension has no key provided', async () => {
        const mockedUpdateExtension = updateExtension(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        try {
            await mockedUpdateExtension({} as Extension, {} as Extension);
        } catch (error) {
            const typedError = error as { message: string };
            expect(typedError.message).toBe('Existing extension does not have a key');
        }
    });

    test('updateExtension > Returns when no conditions are met', async () => {
        const mockedUpdateExtension = updateExtension(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const result = await mockedUpdateExtension({ key: 'foo' } as Extension, {} as Extension);

        expect(result).toBe(undefined);
    });

    test('updateExtension > Throws when request fails', async () => {
        fakeApiRoot.execute.mockImplementationOnce(() => {
            throw Object.assign(new Error('Test error'), { body: { errors: ['Test error'] } });
        });
        const mockedUpdateExtension = updateExtension(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        let message = '';

        try {
            await mockedUpdateExtension(
                {
                    key: 'test',
                    destination: {
                        type: 'HTTP',
                        url: 'https://localhost:test-1234'
                    }
                } as Extension,
                {
                    key: 'test2',
                    destination: {
                        type: 'HTTP',
                        url: 'https://localhost:test-9876'
                    }
                } as Extension
            );
        } catch (error) {
            const typedError = error as { message: string };
            message = typedError.message;
        }

        expect(message).toBe('Test error - ["Test error"]');
    });

    test('getOrderById > Fetches order by id', async () => {
        const mockedGetOrderById = getOrderById(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const result = await mockedGetOrderById('Order Id');

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);

        expect(fakeApiRoot.orders).toHaveBeenCalledOnce();
        expect(fakeApiRoot.withId).toHaveBeenCalledWith({ ID: 'Order Id' });
        expect(fakeApiRoot.get).toHaveBeenCalled();
    });

    test('setPaymentMethodInfoName > Sets payment method info name', async () => {
        const mockedSetPaymentMethodInfoName = setPaymentMethodInfoName(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const result = await mockedSetPaymentMethodInfoName('test-payment-id', 123, { test: 'test' });

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);

        expect(fakeApiRoot.payments).toHaveBeenCalledOnce();
        expect(fakeApiRoot.withId).toHaveBeenCalledWith({ ID: 'test-payment-id' });
        expect(fakeApiRoot.post).toHaveBeenCalledWith({
            body: {
                version: 123,
                actions: [
                    {
                        action: 'setMethodInfoName',
                        name: { test: 'test' }
                    }
                ]
            }
        });
    });

    test('setPaymentMethodInfoMethod > Sets payment method info method', async () => {
        const mockedSetPaymentMethodInfoMethod = setPaymentMethodInfoMethod(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const result = await mockedSetPaymentMethodInfoMethod('test-payment-id', 123, 'test method');

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);

        expect(fakeApiRoot.payments).toHaveBeenCalledOnce();
        expect(fakeApiRoot.withId).toHaveBeenCalledWith({ ID: 'test-payment-id' });
        expect(fakeApiRoot.post).toHaveBeenCalledWith({
            body: {
                version: 123,
                actions: [
                    {
                        action: 'setMethodInfoMethod',
                        method: 'test method'
                    }
                ]
            }
        });
    });

    test('getPaymentById > Fetches payment by ID', async () => {
        const mockedGetPaymentById = getPaymentById(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const result = await mockedGetPaymentById('test-payment-id');

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);

        expect(fakeApiRoot.payments).toHaveBeenCalledOnce();
        expect(fakeApiRoot.withId).toHaveBeenCalledWith({ ID: 'test-payment-id' });
        expect(fakeApiRoot.get).toHaveBeenCalled();
    });

    test('addTransactionToPayment > adds transaction to payment', async () => {
        const mockedAddTransactionToPayment = addTransactionToPayment(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const testTransaction: TransactionDraft = {
            type: 'addTransactionToPayment',
            amount: {
                currencyCode: 'EUR',
                preciseAmount: 123,
                type: 'highPrecision',
                fractionDigits: 2
            }
        };

        const result = await mockedAddTransactionToPayment('test-payment-id', 123, testTransaction);

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);

        expect(fakeApiRoot.payments).toHaveBeenCalledOnce();
        expect(fakeApiRoot.withId).toHaveBeenCalledWith({ ID: 'test-payment-id' });
        expect(fakeApiRoot.post).toHaveBeenCalledWith({
            body: {
                version: 123,
                actions: [
                    {
                        action: 'addTransaction',
                        transaction: testTransaction
                    }
                ]
            }
        });
    });

    test('addPaymentToOrder > adds payment to order', async () => {
        const mockedAddPaymentToOrder = addPaymentToOrder(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const result = await mockedAddPaymentToOrder('test-order-id', 'test-payment-id', 123);

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);

        expect(fakeApiRoot.orders).toHaveBeenCalledOnce();
        expect(fakeApiRoot.withId).toHaveBeenCalledWith({ ID: 'test-order-id' });
        expect(fakeApiRoot.post).toHaveBeenCalledWith({
            body: {
                version: 123,
                actions: [
                    {
                        action: 'addPayment',
                        payment: {
                            typeId: 'payment',
                            id: 'test-payment-id'
                        }
                    }
                ]
            }
        });
    });

    test('createPayment > creates payment', async () => {
        const mockedCreatePayment = createPayment(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const payment: PaymentDraft = {
            amountPlanned: {
                currencyCode: 'EUR',
                preciseAmount: 123,
                type: 'highPrecision',
                fractionDigits: 2
            }
        };

        const result = await mockedCreatePayment(payment);

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);

        expect(fakeApiRoot.payments).toHaveBeenCalled();
        expect(fakeApiRoot.post).toHaveBeenCalledWith({ body: payment });
    });

    test('updateOrderPaymentStatus > Uprades payment status on order', async () => {
        const mockedUpdateOrderPaymentStatus = updateOrderPaymentStatus(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const result = await mockedUpdateOrderPaymentStatus('test-order-id', 123, 'Paid');

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);

        expect(fakeApiRoot.orders).toHaveBeenCalled();
        expect(fakeApiRoot.withId).toHaveBeenCalledWith({ ID: 'test-order-id' });
        expect(fakeApiRoot.post).toHaveBeenCalledWith({
            body: {
                version: 123,
                actions: [
                    {
                        action: 'changePaymentState',
                        paymentState: 'Paid'
                    }
                ]
            }
        });
    });

    test('setPaymentStatusInterfaceCode > Updates payment with interface code', async () => {
        const mockedSetPaymentStatusInterfaceCode = setPaymentStatusInterfaceCode(fakeApiRoot as unknown as ByProjectKeyRequestBuilder);

        const result = await mockedSetPaymentStatusInterfaceCode('test-payment-id', 1, 'test-interface-code');

        expect(result).toStrictEqual(fakeApiRootSuccessResponse);

        expect(fakeApiRoot.payments).toHaveBeenCalled();
        expect(fakeApiRoot.withId).toHaveBeenCalledWith({ ID: 'test-payment-id' });
        expect(fakeApiRoot.post).toHaveBeenCalledWith({
            body: {
                version: 1,
                actions: [
                    {
                        action: 'setStatusInterfaceCode',
                        interfaceCode: 'test-interface-code'
                    }
                ]
            }
        });
    });
});
