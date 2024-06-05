import fetch from 'node-fetch';
import { type Client, ClientBuilder } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type {
    Extension,
    ClientResponse,
    ExtensionUpdateAction,
    LocalizedString,
    FieldDefinition,
    Order,
    PaymentState,
    OrderChangePaymentStateAction,
    Payment,
    PaymentDraft,
    TransactionDraft
} from '@commercetools/platform-sdk';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder.js';
import lodash from 'lodash';
// @ts-ignore
import { createSyncTypes } from '@commercetools/sync-actions';

const { isEqual } = lodash;

export const updateExtension =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (existingExtension: Extension, newExtension: Extension): Promise<ClientResponse<Extension> | undefined> => {
        if (!existingExtension.key) {
            throw new Error('Existing extension does not have a key');
        }

        try {
            const actions: ExtensionUpdateAction[] = [];
            if (!isEqual(existingExtension.destination, newExtension.destination)) {
                actions.push({
                    action: 'changeDestination',
                    destination: newExtension.destination
                });
            }

            if (!isEqual(existingExtension.triggers, newExtension.triggers)) {
                actions.push({
                    action: 'changeTriggers',
                    triggers: newExtension.triggers
                });
            }

            if (actions.length > 0) {
                const body = {
                    version: existingExtension.version,
                    actions
                };

                return await apiRoot.extensions().withKey({ key: existingExtension.key }).post({ body }).execute();
            }
        } catch (requestError: unknown) {
            if (requestError instanceof Error) {
                const typedError = requestError as unknown as { message: string; body: { errors: unknown[] } };

                throw new Error(`${typedError.message} - ${JSON.stringify(typedError.body.errors)}`);
            }
        }

        return undefined;
    };

export const addExtension =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (extension: Extension): Promise<ClientResponse<Extension>> => {
        try {
            return await apiRoot
                .extensions()
                .post({
                    body: {
                        key: extension.key,
                        destination: extension.destination,
                        triggers: extension.triggers
                    }
                })
                .execute();
        } catch (error: unknown) {
            console.error(error);
            throw error;
        }
    };

export const getExtensionByKey =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (extensionKey: string): Promise<ClientResponse<Extension> | undefined> => {
        try {
            return await apiRoot.extensions().withKey({ key: extensionKey }).get().execute();
        } catch (error: unknown) {
            const typedError = error as { statusCode: number };
            if (typedError.statusCode === 404) {
                return;
            }

            throw error;
        }
    };

export type CustomType = {
    key: string;
    name: LocalizedString;
    resourceTypeIds: string[];
    version: number;
    fieldDefinitions?: FieldDefinition[];
};

export const addCustomType = (apiRoot: ByProjectKeyRequestBuilder) => async (customType: Partial<CustomType>) => {
    if (!customType.key || !customType.name || !customType.resourceTypeIds || !customType.fieldDefinitions) {
        throw new Error('Invalid customType');
    }

    try {
        return await apiRoot
            .types()
            .post({
                body: {
                    key: customType.key,
                    name: customType.name,
                    resourceTypeIds: customType.resourceTypeIds,
                    fieldDefinitions: customType.fieldDefinitions
                }
            })
            .execute();
    } catch (error: unknown) {
        console.error('addCustomType error' + JSON.stringify(error));
        throw error;
    }
};

export const updateCustomType =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (existingCustomType: CustomType, newCustomType: CustomType): Promise<ClientResponse> => {
        try {
            const syncTypes = createSyncTypes();
            const actions = syncTypes.buildActions(newCustomType, existingCustomType);

            const body = {
                version: existingCustomType.version,
                actions
            };

            return await apiRoot.types().withKey({ key: existingCustomType.key }).post({ body }).execute();
        } catch (error: unknown) {
            console.error('updateCustomType error' + JSON.stringify(error));
            throw error;
        }
    };

export const getClient = (config: Partial<CommerceToolsClientConfigType>): Client => {
    const { projectKey = '' } = config;
    const authMiddlewareOptions = {
        host: config.authUrl ?? '',
        projectKey,
        credentials: {
            clientId: config.clientId ?? '',
            clientSecret: config.clientSecret ?? ''
        },
        fetch
    };

    const httpMiddlewareOptions = {
        host: config.apiUrl ?? '',
        fetch
    };

    const client = new ClientBuilder()
        .withProjectKey(projectKey ?? '')
        .withClientCredentialsFlow(authMiddlewareOptions)
        .withHttpMiddleware(httpMiddlewareOptions)
        .withLoggerMiddleware()
        .build();

    return client;
};

export const updateOrderPaymentStatus =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (orderId: string, version: number, paymentState: PaymentState): Promise<ClientResponse<Order>> => {
        const changePaymentStateAction: OrderChangePaymentStateAction = {
            action: 'changePaymentState',
            paymentState
        };

        const body = {
            version,
            actions: [changePaymentStateAction]
        };

        return apiRoot.orders().withId({ ID: orderId }).post({ body }).execute();
    };

export const getOrderById =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (orderId: string): Promise<ClientResponse<Order>> => {
        return apiRoot.orders().withId({ ID: orderId }).get().execute();
    };

export const getCustomTypeByKey =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (typeKey: string): Promise<ClientResponse | undefined> => {
        try {
            const response = await apiRoot.types().withKey({ key: typeKey }).get().execute();
            return response;
        } catch (error: unknown) {
            const typedError = error as { message: string; body: { errors: unknown[] }; statusCode: number };
            if (typedError.statusCode === 404) {
                return;
            }

            console.error('getCustomTypeByKey error' + JSON.stringify(error));
            throw error;
        }
    };

export const createPayment =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (payment: PaymentDraft): Promise<ClientResponse<Payment>> => {
        return apiRoot.payments().post({ body: payment }).execute();
    };

export const addPaymentToOrder =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (orderId: string, paymentId: string, orderVersion: number): Promise<ClientResponse<Order>> => {
        return apiRoot
            .orders()
            .withId({ ID: orderId })
            .post({
                body: {
                    version: orderVersion,
                    actions: [
                        {
                            action: 'addPayment',
                            payment: {
                                typeId: 'payment',
                                id: paymentId
                            }
                        }
                    ]
                }
            })
            .execute();
    };

export const addTransactionToPayment =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (paymentId: string, paymentVersion: number, transaction: TransactionDraft): Promise<ClientResponse<Payment>> => {
        return apiRoot
            .payments()
            .withId({ ID: paymentId })
            .post({
                body: {
                    version: paymentVersion,
                    actions: [
                        {
                            action: 'addTransaction',
                            transaction
                        }
                    ]
                }
            })
            .execute();
    };

export const getPaymentById =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (paymentId: string): Promise<ClientResponse<Payment>> => {
        return apiRoot.payments().withId({ ID: paymentId }).get().execute();
    };

export const setPaymentMethodInfoMethod =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (paymentId: string, paymentVersion: number, method: string): Promise<ClientResponse<Payment>> => {
        return apiRoot
            .payments()
            .withId({ ID: paymentId })
            .post({
                body: {
                    version: paymentVersion,
                    actions: [
                        {
                            action: 'setMethodInfoMethod',
                            method
                        }
                    ]
                }
            })
            .execute();
    };

export const setPaymentMethodInfoName =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (paymentId: string, paymentVersion: number, name: LocalizedString): Promise<ClientResponse<Payment>> => {
        return apiRoot
            .payments()
            .withId({ ID: paymentId })
            .post({
                body: {
                    version: paymentVersion,
                    actions: [
                        {
                            action: 'setMethodInfoName',
                            name
                        }
                    ]
                }
            })
            .execute();
    };

export const setPaymentStatusInterfaceCode =
    (apiRoot: ByProjectKeyRequestBuilder) =>
    async (paymentId: string, paymentVersion: number, interfaceCode: string): Promise<ClientResponse<Payment>> => {
        return apiRoot
            .payments()
            .withId({ ID: paymentId })
            .post({
                body: {
                    version: paymentVersion,
                    actions: [
                        {
                            action: 'setStatusInterfaceCode',
                            interfaceCode
                        }
                    ]
                }
            })
            .execute();
    };

export type CommerceToolsClientConfigType = {
    authUrl: string;
    apiUrl: string;
    projectKey: string;
    clientId: string;
    clientSecret: string;
};

export default function CommercetoolsClient(config: CommerceToolsClientConfigType) {
    const client = getClient(config);
    const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
        projectKey: config.projectKey
    });

    return {
        // Create
        addExtension: addExtension(apiRoot),
        addCustomType: addCustomType(apiRoot),
        createPayment: createPayment(apiRoot),
        // Read
        getClient: () => client,
        getExtensionByKey: getExtensionByKey(apiRoot),
        getCustomTypeByKey: getCustomTypeByKey(apiRoot),
        getOrderById: getOrderById(apiRoot),
        getPaymentById: getPaymentById(apiRoot),
        // Update
        updateExtension: updateExtension(apiRoot),
        updateCustomType: updateCustomType(apiRoot),
        updateOrderPaymentStatus: updateOrderPaymentStatus(apiRoot),
        addPaymentToOrder: addPaymentToOrder(apiRoot),
        addTransactionToPayment: addTransactionToPayment(apiRoot),
        setPaymentMethodInfoMethod: setPaymentMethodInfoMethod(apiRoot),
        setPaymentMethodInfoName: setPaymentMethodInfoName(apiRoot),
        setPaymentStatusInterfaceCode: setPaymentStatusInterfaceCode(apiRoot)
    };
}
