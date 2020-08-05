"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utility_1 = require("../utilities/Utility");
const RequestUtility_1 = require("../utilities/RequestUtility");
class RequestClient {
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
    static sendRequest(method, path, config, data, additionalHeaders, responseParams, isAsync, timeout, successCallback, errorCallback) {
        additionalHeaders = additionalHeaders || {};
        responseParams = responseParams || {};
        //add response parameters to parse
        RequestClient._responseParseParams.push(responseParams);
        //stringify passed data
        var stringifiedData = null;
        var batchResult;
        if (path === "$batch") {
            batchResult = RequestUtility_1.RequestUtility.convertToBatch(RequestClient._batchRequestCollection, config);
            stringifiedData = batchResult.body;
            additionalHeaders = batchResult.headers;
            //clear an array of requests
            RequestClient._batchRequestCollection.length = 0;
        }
        else {
            stringifiedData = RequestUtility_1.RequestUtility.stringifyData(data, config);
            additionalHeaders = RequestUtility_1.RequestUtility.setStandardHeaders(additionalHeaders);
        }
        if (config.impersonate && !additionalHeaders["MSCRMCallerID"]) {
            additionalHeaders["MSCRMCallerID"] = config.impersonate;
        }
        var executeRequest;
        /* develblock:start */
        if (typeof XMLHttpRequest !== "undefined") {
            /* develblock:end */
            executeRequest = require("./xhr");
            /* develblock:start */
        }
        else if (typeof process !== "undefined") {
            executeRequest = require("./http");
        }
        /* develblock:end */
        var sendInternalRequest = function (token) {
            if (token) {
                if (!additionalHeaders) {
                    additionalHeaders = {};
                }
                additionalHeaders["Authorization"] = "Bearer " + (token.hasOwnProperty("accessToken") ? token.accessToken : token);
            }
            executeRequest({
                method: method,
                uri: config.webApiUrl + path,
                data: stringifiedData,
                additionalHeaders: additionalHeaders,
                responseParams: RequestClient._responseParseParams,
                successCallback: successCallback,
                errorCallback: errorCallback,
                isAsync: isAsync,
                timeout: timeout
            });
        };
        //call a token refresh callback only if it is set and there is no "Authorization" header set yet
        if (config.onTokenRefresh && (!additionalHeaders || (additionalHeaders && !additionalHeaders["Authorization"]))) {
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
                errorCallback({ message: 'Unable to fetch EntityDefinitions. Error: ' + error.message });
            };
            var request = RequestUtility_1.RequestUtility.compose({
                collection: 'EntityDefinitions',
                select: ['EntitySetName', 'LogicalName'],
                noCache: true
            }, config, 'retrieveMultiple');
            RequestClient.sendRequest('GET', request.path, config, null, request.headers, null, request.async, config.timeout, resolve, reject);
        }
    }
    static _isEntityNameException(entityName) {
        var exceptions = [
            "EntityDefinitions", "$metadata", "RelationshipDefinitions",
            "GlobalOptionSetDefinitions", "ManagedPropertyDefinitions"
        ];
        return exceptions.indexOf(entityName) > -1;
    }
    static _checkCollectionName(entityName, config, successCallback, errorCallback) {
        if (RequestClient._isEntityNameException(entityName) || Utility_1.Utility.isNull(entityName)) {
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
    static makeRequest(method, request, functionName, config, responseParams, resolve, reject) {
        responseParams = responseParams || {};
        //no need to make a request to web api if it's a part of batch
        if (request.isBatch) {
            //add response parameters to parse
            RequestClient._responseParseParams.push(responseParams);
            RequestClient._batchRequestCollection.push({ method: method, request: Utility_1.Utility.copyObject(request) });
            //check for errors
            RequestUtility_1.RequestUtility.compose(request, config, functionName);
        }
        else {
            RequestClient._checkCollectionName(request.collection, config, function (collectionName) {
                request.collection = collectionName;
                var convertedRequest = RequestUtility_1.RequestUtility.compose(request, config, functionName);
                responseParams.convertedToBatch = false;
                if (convertedRequest.path.length > 2000) {
                    //if the URL contains more characters than max possible limit, convert the request to a batch request
                    RequestClient._batchRequestCollection.push({ method: method, request: Utility_1.Utility.copyObject(request) });
                    method = "POST";
                    convertedRequest.path = "$batch";
                    responseParams.convertedToBatch = true;
                }
                RequestClient.sendRequest(method, convertedRequest.path, config, request.data || request.entity, convertedRequest.headers, responseParams, request.async, request.timeout || config.timeout, resolve, reject);
            }, reject);
        }
    }
    /* develblock:start */
    static _clearEntityNames() { RequestUtility_1.RequestUtility.entityNames = null; }
    /* develblock:end */
    static getCollectionName(entityName) { return RequestUtility_1.RequestUtility.findCollectionName(entityName); }
}
exports.RequestClient = RequestClient;
RequestClient._batchRequestCollection = [];
RequestClient._responseParseParams = [];
