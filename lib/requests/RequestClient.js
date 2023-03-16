"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestClient = void 0;
const Utility_1 = require("../utilities/Utility");
const RequestUtility_1 = require("../utilities/RequestUtility");
const ErrorHelper_1 = require("../helpers/ErrorHelper");
class RequestClient {
    static addResponseParams(requestId, responseParams) {
        if (RequestClient._responseParseParams[requestId])
            RequestClient._responseParseParams[requestId].push(responseParams);
        else
            RequestClient._responseParseParams[requestId] = [responseParams];
    }
    static addRequestToBatchCollection(requestId, request) {
        if (RequestClient._batchRequestCollection[requestId])
            RequestClient._batchRequestCollection[requestId].push(request);
        else
            RequestClient._batchRequestCollection[requestId] = [request];
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
    static sendRequest(request, config, successCallback, errorCallback) {
        request.headers = request.headers || {};
        request.responseParameters = request.responseParameters || {};
        request.requestId = request.requestId || Utility_1.Utility.generateUUID();
        //add response parameters to parse
        RequestClient.addResponseParams(request.requestId, request.responseParameters);
        //stringify passed data
        var processedData = null;
        let isBatchConverted = request.responseParameters != null && request.responseParameters.convertedToBatch;
        if (request.path === "$batch" && !isBatchConverted) {
            const batchRequest = RequestClient._batchRequestCollection[request.requestId];
            if (!batchRequest)
                errorCallback(ErrorHelper_1.ErrorHelper.batchIsEmpty());
            const batchResult = RequestUtility_1.RequestUtility.convertToBatch(batchRequest, config);
            processedData = batchResult.body;
            request.headers = Object.assign(Object.assign({}, batchResult.headers), request.headers);
            //clear an array of requests
            delete RequestClient._batchRequestCollection[request.requestId];
        }
        else {
            processedData = !isBatchConverted ? RequestUtility_1.RequestUtility.processData(request.data, config) : request.data;
            if (!isBatchConverted)
                request.headers = RequestUtility_1.RequestUtility.setStandardHeaders(request.headers);
        }
        if (config.impersonate && !request.headers["MSCRMCallerID"]) {
            request.headers["MSCRMCallerID"] = config.impersonate;
        }
        if (config.impersonateAAD && !request.headers["CallerObjectId"]) {
            request.headers["CallerObjectId"] = config.impersonateAAD;
        }
        var executeRequest;
        /* develblock:start */
        if (typeof XMLHttpRequest !== "undefined") {
            /* develblock:end */
            executeRequest = require("./xhr").XhrWrapper.xhrRequest;
            /* develblock:start */
        }
        else if (typeof process !== "undefined") {
            executeRequest = require("./http");
        }
        /* develblock:end */
        var sendInternalRequest = function (token) {
            if (token) {
                if (!request.headers) {
                    request.headers = {};
                }
                request.headers["Authorization"] = "Bearer " + (token.hasOwnProperty("accessToken") ? token.accessToken : token);
            }
            executeRequest({
                method: request.method,
                uri: config.webApiUrl + request.path,
                data: processedData,
                additionalHeaders: request.headers,
                responseParams: RequestClient._responseParseParams,
                successCallback: successCallback,
                errorCallback: errorCallback,
                isAsync: request.async,
                timeout: request.timeout || config.timeout,
                /* develblock:start */
                proxy: config.proxy,
                /* develblock:end */
                requestId: request.requestId,
            });
        };
        //call a token refresh callback only if it is set and there is no "Authorization" header set yet
        if (config.onTokenRefresh && (!request.headers || (request.headers && !request.headers["Authorization"]))) {
            config.onTokenRefresh(sendInternalRequest);
        }
        else {
            sendInternalRequest();
        }
    }
    static _getCollectionNames(entityName, config, successCallback, errorCallback) {
        if (!Utility_1.Utility.isNull(RequestUtility_1.RequestUtility.entityNames)) {
            successCallback(RequestUtility_1.RequestUtility.findCollectionName(entityName) || entityName);
        }
        else {
            var resolve = function (result) {
                RequestUtility_1.RequestUtility.entityNames = {};
                for (var i = 0; i < result.data.value.length; i++) {
                    RequestUtility_1.RequestUtility.entityNames[result.data.value[i].LogicalName] = result.data.value[i].EntitySetName;
                }
                successCallback(RequestUtility_1.RequestUtility.findCollectionName(entityName) || entityName);
            };
            var reject = function (error) {
                errorCallback({ message: "Unable to fetch EntityDefinitions. Error: " + error.message });
            };
            let request = RequestUtility_1.RequestUtility.compose({
                method: "GET",
                collection: "EntityDefinitions",
                select: ["EntitySetName", "LogicalName"],
                noCache: true,
                functionName: "retrieveMultiple",
            }, config);
            RequestClient.sendRequest(request, config, resolve, reject);
        }
    }
    static _isEntityNameException(entityName) {
        var exceptions = ["EntityDefinitions", "$metadata", "RelationshipDefinitions", "GlobalOptionSetDefinitions", "ManagedPropertyDefinitions"];
        return exceptions.indexOf(entityName) > -1;
    }
    static _checkCollectionName(entityName, config, successCallback, errorCallback) {
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
        }
        catch (error) {
            errorCallback({ message: "Unable to fetch Collection Names. Error: " + error.message });
        }
    }
    static makeRequest(request, config, resolve, reject) {
        request.responseParameters = request.responseParameters || {};
        //no need to make a request to web api if it's a part of batch
        if (request.isBatch) {
            request = RequestUtility_1.RequestUtility.compose(request, config);
            //add response parameters to parse
            RequestClient.addResponseParams(request.requestId, request.responseParameters);
            RequestClient.addRequestToBatchCollection(request.requestId, request);
        }
        else {
            RequestClient._checkCollectionName(request.collection, config, (collectionName) => {
                request.collection = collectionName;
                request = RequestUtility_1.RequestUtility.compose(request, config);
                request.responseParameters.convertedToBatch = false;
                //if the URL contains more characters than max possible limit, convert the request to a batch request
                if (request.path.length > 2000) {
                    let batchRequest = RequestUtility_1.RequestUtility.convertToBatch([request], config);
                    request.method = "POST";
                    request.path = "$batch";
                    request.data = batchRequest.body;
                    request.headers = batchRequest.headers;
                    request.responseParameters.convertedToBatch = true;
                }
                RequestClient.sendRequest(request, config, resolve, reject);
            }, reject);
        }
    }
    /* develblock:start */
    static _clearEntityNames() {
        RequestUtility_1.RequestUtility.entityNames = null;
    }
    /* develblock:end */
    static getCollectionName(entityName) {
        return RequestUtility_1.RequestUtility.findCollectionName(entityName);
    }
}
exports.RequestClient = RequestClient;
RequestClient._batchRequestCollection = {};
RequestClient._responseParseParams = {};
//# sourceMappingURL=RequestClient.js.map