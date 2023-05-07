import { Utility } from "../utils/Utility";
import { ConfigurationUtility, InternalConfig } from "../utils/Config";
import { RequestUtility } from "../utils/Request";
import { DynamicsWebApiError, ErrorHelper } from "../helpers/ErrorHelper";
import { Core } from "../types";

export class RequestClient {
    private static _batchRequestCollection: Core.BatchRequestCollection = {};
    private static _responseParseParams: { [key: string]: any[] } = {};

    private static addResponseParams(requestId, responseParams) {
        if (RequestClient._responseParseParams[requestId]) RequestClient._responseParseParams[requestId].push(responseParams);
        else RequestClient._responseParseParams[requestId] = [responseParams];
    }

    private static addRequestToBatchCollection(requestId, request) {
        if (RequestClient._batchRequestCollection[requestId]) RequestClient._batchRequestCollection[requestId].push(request);
        else RequestClient._batchRequestCollection[requestId] = [request];
    }

    /**
     * Sends a request to given URL with given parameters
     *
     * @param {string} method - Method of the request.
     * @param {string} path - Request path.
     * @param {Object} config - DynamicsWebApi config.
     * @param {Object} [data] - Data to send in the request.
     * @param {Object} [additionalHeaders] - Object with additional headers. IMPORTANT! This object does not contain default headers needed for every request.
     * @param {any} [responseParams] - parameters for parsing the response
     * @param {Function} successCallback - A callback called on success of the request.
     * @param {Function} errorCallback - A callback called when a request failed.
     * @param {boolean} [isBatch] - Indicates whether the request is a Batch request or not. Default: false
     * @param {boolean} [isAsync] - Indicates whether the request should be made synchronously or asynchronously.
     */
    static sendRequest(request: Core.InternalRequest, config: InternalConfig, successCallback: Function, errorCallback: Function): void {
        request.headers = request.headers || {};
        request.responseParameters = request.responseParameters || {};
        request.requestId = request.requestId || Utility.generateUUID();

        //add response parameters to parse
        RequestClient.addResponseParams(request.requestId, request.responseParameters);

        //stringify passed data
        let processedData = null;

        const isBatchConverted = request.responseParameters != null && request.responseParameters.convertedToBatch;

        if (request.path === "$batch" && !isBatchConverted) {
            const batchRequest = RequestClient._batchRequestCollection[request.requestId];

            if (!batchRequest) errorCallback(ErrorHelper.batchIsEmpty());

            const batchResult = RequestUtility.convertToBatch(batchRequest, config);

            processedData = batchResult.body;
            request.headers = { ...batchResult.headers, ...request.headers };

            //clear an array of requests
            delete RequestClient._batchRequestCollection[request.requestId];
        } else {
            processedData = !isBatchConverted ? RequestUtility.processData(request.data, config) : request.data;

            if (!isBatchConverted) request.headers = RequestUtility.setStandardHeaders(request.headers);
        }

        if (config.impersonate && !request.headers["MSCRMCallerID"]) {
            request.headers["MSCRMCallerID"] = config.impersonate;
        }

        if (config.impersonateAAD && !request.headers["CallerObjectId"]) {
            request.headers["CallerObjectId"] = config.impersonateAAD;
        }

        var executeRequest: (options: Core.RequestOptions) => void;
        /// #if node
        if (typeof XMLHttpRequest !== "undefined") {
            /// #endif
            executeRequest = require("./xhr").XhrWrapper.xhrRequest;
            /// #if node
        } else if (typeof process !== "undefined") {
            executeRequest = require("./http").httpRequest;
        }
        /// #endif

        var sendInternalRequest = function (token?: any): void {
            if (token) {
                if (!request.headers) {
                    request.headers = {};
                }
                request.headers["Authorization"] = "Bearer " + (token.hasOwnProperty("accessToken") ? token.accessToken : token);
            }

            const url = request.apiConfig ? request.apiConfig.url : config.dataApi.url;

            executeRequest({
                method: request.method!,
                uri: url + request.path,
                data: processedData,
                additionalHeaders: request.headers,
                responseParams: RequestClient._responseParseParams,
                successCallback: successCallback,
                errorCallback: errorCallback,
                isAsync: request.async,
                timeout: request.timeout || config.timeout,
                /// #if node
                proxy: config.proxy,
                /// #endif
                requestId: request.requestId!,
                abortSignal: request.signal,
            });
        };

        //call a token refresh callback only if it is set and there is no "Authorization" header set yet
        if (config.onTokenRefresh && (!request.headers || (request.headers && !request.headers["Authorization"]))) {
            config.onTokenRefresh(sendInternalRequest);
        } else {
            sendInternalRequest();
        }
    }

    private static _getCollectionNames(
        entityName: string,
        config: InternalConfig,
        successCallback: (collection: string) => void,
        errorCallback: Function
    ): void {
        if (!Utility.isNull(RequestUtility.entityNames)) {
            successCallback(RequestUtility.findCollectionName(entityName) || entityName);
        } else {
            const resolve = function (result) {
                RequestUtility.entityNames = {};
                for (var i = 0; i < result.data.value.length; i++) {
                    RequestUtility.entityNames[result.data.value[i].LogicalName] = result.data.value[i].EntitySetName;
                }

                successCallback(RequestUtility.findCollectionName(entityName) || entityName);
            };

            const reject = function (error) {
                errorCallback({ message: "Unable to fetch EntityDefinitions. Error: " + error.message });
            };

            const request = RequestUtility.compose(
                {
                    method: "GET",
                    collection: "EntityDefinitions",
                    select: ["EntitySetName", "LogicalName"],
                    noCache: true,
                    functionName: "retrieveMultiple",
                },
                config
            );

            RequestClient.sendRequest(request, config, resolve, reject);
        }
    }

    private static _isEntityNameException(entityName: string): boolean {
        const exceptions = [
            "$metadata",
            "EntityDefinitions",
            "RelationshipDefinitions",
            "GlobalOptionSetDefinitions",
            "ManagedPropertyDefinitions",
            "query",
            "suggest",
            "autocomplete",
        ];

        return exceptions.indexOf(entityName) > -1;
    }

    private static _checkCollectionName(
        entityName: string | null | undefined,
        config: InternalConfig,
        successCallback: (collection: string | null | undefined) => void,
        errorCallback: Function
    ): void {
        if (!entityName || RequestClient._isEntityNameException(entityName)) {
            successCallback(entityName);
            return;
        }

        entityName = entityName.toLowerCase();

        if (!config.useEntityNames) {
            successCallback(entityName);
            return;
        }

        try {
            RequestClient._getCollectionNames(entityName, config, successCallback, errorCallback);
        } catch (error) {
            errorCallback({ message: "Unable to fetch Collection Names. Error: " + (error as DynamicsWebApiError).message });
        }
    }

    static makeRequest(request: Core.InternalRequest, config: InternalConfig, resolve: Function, reject: Function): void {
        request.responseParameters = request.responseParameters || {};

        //no need to make a request to web api if it's a part of batch
        if (request.isBatch) {
            request = RequestUtility.compose(request, config);

            //add response parameters to parse
            RequestClient.addResponseParams(request.requestId, request.responseParameters);

            RequestClient.addRequestToBatchCollection(request.requestId, request);
        } else {
            RequestClient._checkCollectionName(
                request.collection,
                config,
                (collectionName) => {
                    request.collection = collectionName;

                    request = RequestUtility.compose(request, config);

                    request.responseParameters.convertedToBatch = false;

                    //the URL contains more characters than max possible limit, convert the request to a batch request
                    if (request.path!.length > 2000) {
                        const batchRequest = RequestUtility.convertToBatch([request], config);

                        request.method = "POST";
                        request.path = "$batch";
                        request.data = batchRequest.body;
                        request.headers = batchRequest.headers;
                        request.responseParameters.convertedToBatch = true;
                    }

                    RequestClient.sendRequest(request, config, resolve, reject);
                },
                reject
            );
        }
    }

    /// #if node
    static _clearEntityNames(): void {
        RequestUtility.entityNames = null;
    }
    /// #endif

    static getCollectionName(entityName: string): string | null {
        return RequestUtility.findCollectionName(entityName);
    }
}
