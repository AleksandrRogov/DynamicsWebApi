/*! dynamics-web-api v2.0.0-alpha.1 (c) 2023 Aleksandr Rogov */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("DynamicsWebApi", [], factory);
	else if(typeof exports === 'object')
		exports["DynamicsWebApi"] = factory();
	else
		root["DynamicsWebApi"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 94:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestClient = void 0;
const Utility_1 = __webpack_require__(811);
const Request_1 = __webpack_require__(497);
const ErrorHelper_1 = __webpack_require__(897);
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
        let processedData = null;
        const isBatchConverted = request.responseParameters != null && request.responseParameters.convertedToBatch;
        if (request.path === "$batch" && !isBatchConverted) {
            const batchRequest = RequestClient._batchRequestCollection[request.requestId];
            if (!batchRequest)
                errorCallback(ErrorHelper_1.ErrorHelper.batchIsEmpty());
            const batchResult = Request_1.RequestUtility.convertToBatch(batchRequest, config);
            processedData = batchResult.body;
            request.headers = Object.assign(Object.assign({}, batchResult.headers), request.headers);
            //clear an array of requests
            delete RequestClient._batchRequestCollection[request.requestId];
        }
        else {
            processedData = !isBatchConverted ? Request_1.RequestUtility.processData(request.data, config) : request.data;
            if (!isBatchConverted)
                request.headers = Request_1.RequestUtility.setStandardHeaders(request.headers);
        }
        if (config.impersonate && !request.headers["MSCRMCallerID"]) {
            request.headers["MSCRMCallerID"] = config.impersonate;
        }
        if (config.impersonateAAD && !request.headers["CallerObjectId"]) {
            request.headers["CallerObjectId"] = config.impersonateAAD;
        }
        var executeRequest;
////////////////////
////////////////////////////////////////////////////
//////////////////////
            executeRequest = (__webpack_require__(830)/* .XhrWrapper.xhrRequest */ .t.xhrRequest);
////////////////////////
/////////
//////////////////////////////////////////////////
///////////////////////////////////////////////
/////////
//////////////////
        var sendInternalRequest = function (token) {
            if (token) {
                if (!request.headers) {
                    request.headers = {};
                }
                request.headers["Authorization"] = "Bearer " + (token.hasOwnProperty("accessToken") ? token.accessToken : token);
            }
            const url = request.apiConfig ? request.apiConfig.url : config.dataApi.url;
            executeRequest({
                method: request.method,
                uri: url + request.path,
                data: processedData,
                additionalHeaders: request.headers,
                responseParams: RequestClient._responseParseParams,
                successCallback: successCallback,
                errorCallback: errorCallback,
                isAsync: request.async,
                timeout: request.timeout || config.timeout,
////////////////////////////
////////////////////////////////////
//////////////////////////
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
        if (!Utility_1.Utility.isNull(Request_1.RequestUtility.entityNames)) {
            successCallback(Request_1.RequestUtility.findCollectionName(entityName) || entityName);
        }
        else {
            const resolve = function (result) {
                Request_1.RequestUtility.entityNames = {};
                for (var i = 0; i < result.data.value.length; i++) {
                    Request_1.RequestUtility.entityNames[result.data.value[i].LogicalName] = result.data.value[i].EntitySetName;
                }
                successCallback(Request_1.RequestUtility.findCollectionName(entityName) || entityName);
            };
            const reject = function (error) {
                errorCallback({ message: "Unable to fetch EntityDefinitions. Error: " + error.message });
            };
            const request = Request_1.RequestUtility.compose({
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
            request = Request_1.RequestUtility.compose(request, config);
            //add response parameters to parse
            RequestClient.addResponseParams(request.requestId, request.responseParameters);
            RequestClient.addRequestToBatchCollection(request.requestId, request);
        }
        else {
            RequestClient._checkCollectionName(request.collection, config, (collectionName) => {
                request.collection = collectionName;
                request = Request_1.RequestUtility.compose(request, config);
                request.responseParameters.convertedToBatch = false;
                //the URL contains more characters than max possible limit, convert the request to a batch request
                if (request.path.length > 2000) {
                    const batchRequest = Request_1.RequestUtility.convertToBatch([request], config);
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
////////////////
////////////////////////////////
////////////////////////////////////////////////////
/////
//////////////
    static getCollectionName(entityName) {
        return Request_1.RequestUtility.findCollectionName(entityName);
    }
}
RequestClient._batchRequestCollection = {};
RequestClient._responseParseParams = {};
exports.RequestClient = RequestClient;
//# sourceMappingURL=RequestClient.js.map

/***/ }),

/***/ 526:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dateReviver = void 0;
function dateReviver(key, value) {
    if (typeof value === "string") {
        const a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:Z|[-+]\d{2}:\d{2})$/.exec(value);
        if (a) {
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
        }
    }
    return value;
}
exports.dateReviver = dateReviver;
//# sourceMappingURL=dateReviver.js.map

/***/ }),

/***/ 373:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseResponse = void 0;
const dwa_1 = __webpack_require__(553);
const Utility_1 = __webpack_require__(811);
const ErrorHelper_1 = __webpack_require__(897);
const dateReviver_1 = __webpack_require__(526);
function getFormattedKeyValue(keyName, value) {
    let newKey = null;
    if (keyName.indexOf("@") !== -1) {
        const format = keyName.split("@");
        switch (format[1]) {
            case "odata.context":
                newKey = "oDataContext";
                break;
            case "odata.count":
                newKey = "oDataCount";
                value = value != null ? parseInt(value) : 0;
                break;
            case "odata.nextLink":
                newKey = "oDataNextLink";
                break;
            case "odata.deltaLink":
                newKey = "oDataDeltaLink";
                break;
            case dwa_1.DWA.Prefer.Annotations.FormattedValue:
                newKey = format[0] + "_Formatted";
                break;
            case dwa_1.DWA.Prefer.Annotations.AssociatedNavigationProperty:
                newKey = format[0] + "_NavigationProperty";
                break;
            case dwa_1.DWA.Prefer.Annotations.LookupLogicalName:
                newKey = format[0] + "_LogicalName";
                break;
        }
    }
    return [newKey, value];
}
/**
 *
 * @param {any} object - parsed JSON object
 * @param {any} parseParams - parameters for parsing the response
 * @returns {any} parsed batch response
 */
function parseData(object, parseParams) {
    if (parseParams) {
        if (parseParams.isRef && object["@odata.id"] != null) {
            return Utility_1.Utility.convertToReferenceObject(object);
        }
        if (parseParams.toCount) {
            return getFormattedKeyValue("@odata.count", object["@odata.count"])[1] || 0;
        }
    }
    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++) {
        const currentKey = keys[i];
        if (object[currentKey] != null) {
            if (object[currentKey].constructor === Array) {
                for (var j = 0; j < object[currentKey].length; j++) {
                    object[currentKey][j] = parseData(object[currentKey][j]);
                }
            }
            else if (typeof object[currentKey] === "object") {
                parseData(object[currentKey]);
            }
        }
        //parse formatted values
        let formattedKeyValue = getFormattedKeyValue(currentKey, object[currentKey]);
        if (formattedKeyValue[0]) {
            object[formattedKeyValue[0]] = formattedKeyValue[1];
        }
        //parse aliased values
        if (currentKey.indexOf("_x002e_") !== -1) {
            const aliasKeys = currentKey.split("_x002e_");
            if (!object.hasOwnProperty(aliasKeys[0])) {
                object[aliasKeys[0]] = { _dwaType: "alias" };
            }
            //throw an error if there is already a property which is not an 'alias'
            else if (typeof object[aliasKeys[0]] !== "object" ||
                (typeof object[aliasKeys[0]] === "object" && !object[aliasKeys[0]].hasOwnProperty("_dwaType"))) {
                throw new Error("The alias name of the linked entity must be unique!");
            }
            object[aliasKeys[0]][aliasKeys[1]] = object[currentKey];
            //aliases also contain formatted values
            formattedKeyValue = getFormattedKeyValue(aliasKeys[1], object[currentKey]);
            if (formattedKeyValue[0]) {
                object[aliasKeys[0]][formattedKeyValue[0]] = formattedKeyValue[1];
            }
        }
    }
    if (parseParams) {
        if (parseParams.hasOwnProperty("pageNumber") && object["@" + dwa_1.DWA.Prefer.Annotations.FetchXmlPagingCookie] != null) {
            object.PagingInfo = Utility_1.Utility.getFetchXmlPagingCookie(object["@" + dwa_1.DWA.Prefer.Annotations.FetchXmlPagingCookie], parseParams.pageNumber);
        }
    }
    return object;
}
const responseHeaderRegex = /^([^()<>@,;:\\"\/[\]?={} \t]+)\s?:\s?(.*)/;
//partially taken from http://olingo.apache.org/doc/javascript/apidoc/batch.js.html
function parseBatchHeaders(text) {
    const ctx = { position: 0 };
    const headers = {};
    let parts;
    let line;
    let pos;
    do {
        pos = ctx.position;
        line = readLine(text, ctx);
        parts = responseHeaderRegex.exec(line);
        if (parts !== null) {
            headers[parts[1].toLowerCase()] = parts[2];
        }
        else {
            // Whatever was found is not a header, so reset the context position.
            ctx.position = pos;
        }
    } while (line && parts);
    return headers;
}
//partially taken from http://olingo.apache.org/doc/javascript/apidoc/batch.js.html
function readLine(text, ctx) {
    return readTo(text, ctx, "\r\n");
}
//partially taken from http://olingo.apache.org/doc/javascript/apidoc/batch.js.html
function readTo(text, ctx, str) {
    const start = ctx.position || 0;
    let end = text.length;
    if (str) {
        end = text.indexOf(str, start);
        if (end === -1) {
            return null;
        }
        ctx.position = end + str.length;
    }
    else {
        ctx.position = end;
    }
    return text.substring(start, end);
}
//partially taken from https://github.com/emiltholin/google-api-batch-utils
/**
 *
 * @param {string} response - response that needs to be parsed
 * @param {Array} parseParams - parameters for parsing the response
 * @param {Number} [requestNumber] - number of the request
 * @returns {any} parsed batch response
 */
function parseBatchResponse(response, parseParams, requestNumber = 0) {
    // Not the same delimiter in the response as we specify ourselves in the request,
    // so we have to extract it.
    const delimiter = response.substr(0, response.indexOf("\r\n"));
    const batchResponseParts = response.split(delimiter);
    // The first part will always be an empty string. Just remove it.
    batchResponseParts.shift();
    // The last part will be the "--". Just remove it.
    batchResponseParts.pop();
    let result = [];
    for (let i = 0; i < batchResponseParts.length; i++) {
        let batchResponse = batchResponseParts[i];
        if (batchResponse.indexOf("--changesetresponse_") > -1) {
            batchResponse = batchResponse.trim();
            const batchToProcess = batchResponse.substring(batchResponse.indexOf("\r\n") + 1).trim();
            result = result.concat(parseBatchResponse(batchToProcess, parseParams, requestNumber));
        }
        else {
            //check http status
            const httpStatusReg = /HTTP\/?\s*[\d.]*\s+(\d{3})\s+([\w\s]*)$/gm.exec(batchResponse);
            //todo: add error handler for httpStatus and httpStatusMessage; remove "!" operator
            const httpStatus = parseInt(httpStatusReg[1]);
            const httpStatusMessage = httpStatusReg[2].trim();
            const responseData = batchResponse.substring(batchResponse.indexOf("{"), batchResponse.lastIndexOf("}") + 1);
            if (!responseData) {
                if (/Content-Type: text\/plain/i.test(batchResponse)) {
                    const plainContentReg = /\w+$/gi.exec(batchResponse.trim());
                    const plainContent = plainContentReg && plainContentReg.length ? plainContentReg[0] : undefined;
                    //check if a plain content is a number or not
                    result.push(isNaN(Number(plainContent)) ? plainContent : Number(plainContent));
                }
                else {
                    if (parseParams.length && parseParams[requestNumber] && parseParams[requestNumber].hasOwnProperty("valueIfEmpty")) {
                        result.push(parseParams[requestNumber].valueIfEmpty);
                    }
                    else {
                        const entityUrl = /OData-EntityId.+/i.exec(batchResponse);
                        if (entityUrl && entityUrl.length) {
                            const guidResult = /([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})\)$/i.exec(entityUrl[0]);
                            result.push(guidResult ? guidResult[1] : undefined);
                        }
                        else {
                            result.push(undefined);
                        }
                    }
                }
            }
            else {
                const parsedResponse = parseData(JSON.parse(responseData, dateReviver_1.dateReviver), parseParams[requestNumber]);
                if (httpStatus >= 400) {
                    const responseHeaders = parseBatchHeaders(
                    //todo: add error handler for httpStatusReg; remove "!" operator
                    batchResponse.substring(batchResponse.indexOf(httpStatusReg[0]) + httpStatusReg[0].length + 1, batchResponse.indexOf("{")));
                    result.push(ErrorHelper_1.ErrorHelper.handleHttpError(parsedResponse, {
                        status: httpStatus,
                        statusText: httpStatusMessage,
                        statusMessage: httpStatusMessage,
                        headers: responseHeaders,
                    }));
                }
                else {
                    result.push(parsedResponse);
                }
            }
        }
        requestNumber++;
    }
    return result;
}
function base64ToString(base64) {
////////////////
/////////////////////////////////////////
////////////////////////////////////////////////////////////////
/////
///////////////////////////////////////////
//////////////////
        return window.atob(base64);
////////////////
////////
////////////////////
//////////////
}
function parseFileResponse(response, responseHeaders, parseParams) {
    let data = response;
    if (parseParams.hasOwnProperty("parse")) {
        data = JSON.parse(data).value;
        data = base64ToString(data);
    }
    var parseResult = {
        value: data,
    };
    if (responseHeaders["x-ms-file-name"])
        parseResult.fileName = responseHeaders["x-ms-file-name"];
    if (responseHeaders["x-ms-file-size"])
        parseResult.fileSize = parseInt(responseHeaders["x-ms-file-size"]);
    if (hasHeader(responseHeaders, "Location"))
        parseResult.location = getHeader(responseHeaders, "Location");
    return parseResult;
}
function hasHeader(headers, name) {
    return headers.hasOwnProperty(name) || headers.hasOwnProperty(name.toLowerCase());
}
function getHeader(headers, name) {
    if (headers[name])
        return headers[name];
    return headers[name.toLowerCase()];
}
/**
 *
 * @param {string} response - response that needs to be parsed
 * @param {Array} responseHeaders - response headers
 * @param {Array} parseParams - parameters for parsing the response
 * @returns {any} parsed response
 */
function parseResponse(response, responseHeaders, parseParams) {
    let parseResult = undefined;
    if (response.length) {
        if (response.indexOf("--batchresponse_") > -1) {
            const batch = parseBatchResponse(response, parseParams);
            parseResult = parseParams.length === 1 && parseParams[0].convertedToBatch ? batch[0] : batch;
        }
        else {
            if (hasHeader(responseHeaders, "Content-Disposition")) {
                parseResult = parseFileResponse(response, responseHeaders, parseParams[0]);
            }
            else {
                const contentType = getHeader(responseHeaders, "Content-Type");
                if (contentType.startsWith("application/json")) {
                    parseResult = parseData(JSON.parse(response, dateReviver_1.dateReviver), parseParams[0]);
                }
                else {
                    parseResult = isNaN(Number(response)) ? response : Number(response);
                }
            }
        }
    }
    else {
        if (parseParams.length && parseParams[0].hasOwnProperty("valueIfEmpty")) {
            parseResult = parseParams[0].valueIfEmpty;
        }
        else if (hasHeader(responseHeaders, "OData-EntityId")) {
            const entityUrl = getHeader(responseHeaders, "OData-EntityId");
            const guidResult = /([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})\)$/i.exec(entityUrl);
            if (guidResult) {
                parseResult = guidResult[1];
            }
        }
        else if (hasHeader(responseHeaders, "Location")) {
            parseResult = {
                location: getHeader(responseHeaders, "Location"),
            };
            if (responseHeaders["x-ms-chunk-size"])
                parseResult.chunkSize = parseInt(responseHeaders["x-ms-chunk-size"]);
        }
    }
    return parseResult;
}
exports.parseResponse = parseResponse;
//# sourceMappingURL=parseResponse.js.map

/***/ }),

/***/ 394:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseResponseHeaders = void 0;
function parseResponseHeaders(headerStr) {
    const headers = {};
    if (!headerStr) {
        return headers;
    }
    const headerPairs = headerStr.split("\u000d\u000a");
    for (let i = 0, ilen = headerPairs.length; i < ilen; i++) {
        const headerPair = headerPairs[i];
        const index = headerPair.indexOf("\u003a\u0020");
        if (index > 0) {
            headers[headerPair.substring(0, index)] = headerPair.substring(index + 2);
        }
    }
    return headers;
}
exports.parseResponseHeaders = parseResponseHeaders;
//# sourceMappingURL=parseResponseHeaders.js.map

/***/ }),

/***/ 830:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
exports.t = void 0;
const ErrorHelper_1 = __webpack_require__(897);
const parseResponse_1 = __webpack_require__(373);
const parseResponseHeaders_1 = __webpack_require__(394);
/**
 * Sends a request to given URL with given parameters
 *
 */
class XhrWrapper {
    static xhrRequest(options) {
        const data = options.data;
        const additionalHeaders = options.additionalHeaders;
        const responseParams = options.responseParams;
        const successCallback = options.successCallback;
        const errorCallback = options.errorCallback;
        const request = new XMLHttpRequest();
        request.open(options.method, options.uri, options.isAsync || false);
        //set additional headers
        for (let key in additionalHeaders) {
            request.setRequestHeader(key, additionalHeaders[key]);
        }
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                switch (request.status) {
                    case 200: // Success with content returned in response body.
                    case 201: // Success with content returned in response body.
                    case 204: // Success with no content returned in response body.
                    case 206: // Success with partial content.
                    case 304: {
                        // Success with Not Modified
                        const responseHeaders = (0, parseResponseHeaders_1.parseResponseHeaders)(request.getAllResponseHeaders());
                        const responseData = (0, parseResponse_1.parseResponse)(request.responseText, responseHeaders, responseParams[options.requestId]);
                        const response = {
                            data: responseData,
                            headers: responseHeaders,
                            status: request.status,
                        };
                        delete responseParams[options.requestId];
                        // request = null;
                        successCallback(response);
                        break;
                    }
                    default:
                        // All other statuses are error cases.
                        let error;
                        let headers;
                        try {
                            headers = (0, parseResponseHeaders_1.parseResponseHeaders)(request.getAllResponseHeaders());
                            const errorParsed = (0, parseResponse_1.parseResponse)(request.responseText, (0, parseResponseHeaders_1.parseResponseHeaders)(request.getAllResponseHeaders()), responseParams[options.requestId]);
                            if (Array.isArray(errorParsed)) {
                                delete responseParams[options.requestId];
                                errorCallback(errorParsed);
                                break;
                            }
                            error = errorParsed.error;
                        }
                        catch (e) {
                            if (request.response.length > 0) {
                                error = { message: request.response };
                            }
                            else {
                                error = { message: "Unexpected Error" };
                            }
                        }
                        const errorParameters = {
                            status: request.status,
                            statusText: request.statusText,
                            headers: headers,
                        };
                        delete responseParams[options.requestId];
                        // request = null;
                        errorCallback(ErrorHelper_1.ErrorHelper.handleHttpError(error, errorParameters));
                        break;
                }
            }
        };
        if (options.timeout) {
            request.timeout = options.timeout;
        }
        request.onerror = function () {
            const headers = (0, parseResponseHeaders_1.parseResponseHeaders)(request.getAllResponseHeaders());
            errorCallback(ErrorHelper_1.ErrorHelper.handleHttpError({
                status: request.status,
                statusText: request.statusText,
                message: request.responseText || "Network Error",
                headers: headers,
            }));
            delete responseParams[options.requestId];
            // request = null;
        };
        request.ontimeout = function () {
            const headers = (0, parseResponseHeaders_1.parseResponseHeaders)(request.getAllResponseHeaders());
            errorCallback(ErrorHelper_1.ErrorHelper.handleHttpError({
                status: request.status,
                statusText: request.statusText,
                message: request.responseText || "Request Timed Out",
                headers: headers,
            }));
            delete responseParams[options.requestId];
            // request = null;
        };
        data ? request.send(data) : request.send();
        //called for testing
        if (XhrWrapper.afterSendEvent)
            XhrWrapper.afterSendEvent();
    }
}
exports.t = XhrWrapper;
//# sourceMappingURL=xhr.js.map

/***/ }),

/***/ 553:
/***/ (function(__unused_webpack_module, exports) {


var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DWA = void 0;
class DWA {
}
exports.DWA = DWA;
DWA.Prefer = (_a = class {
        static get(annotation) {
            return `${DWA.Prefer.IncludeAnnotations}="${annotation}"`;
        }
    },
    __setFunctionName(_a, "Prefer"),
    _a.ReturnRepresentation = "return=representation",
    _a.Annotations = (_b = class {
        },
        __setFunctionName(_b, "Annotations"),
        _b.AssociatedNavigationProperty = "Microsoft.Dynamics.CRM.associatednavigationproperty",
        _b.LookupLogicalName = "Microsoft.Dynamics.CRM.lookuplogicalname",
        _b.All = "*",
        _b.FormattedValue = "OData.Community.Display.V1.FormattedValue",
        _b.FetchXmlPagingCookie = "Microsoft.Dynamics.CRM.fetchxmlpagingcookie",
        _b),
    _a.IncludeAnnotations = "odata.include-annotations",
    _a);
//# sourceMappingURL=dwa.js.map

/***/ }),

/***/ 897:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorHelper = void 0;
function throwParameterError(functionName, parameterName, type) {
    throw new Error(type ? `${functionName} requires a ${parameterName} parameter to be of type ${type}.` : `${functionName} requires a ${parameterName} parameter.`);
}
class ErrorHelper {
    static handleErrorResponse(req) {
        throw new Error(`Error: ${req.status}: ${req.message}`);
    }
    static parameterCheck(parameter, functionName, parameterName, type) {
        if (typeof parameter === "undefined" || parameter === null || parameter === "") {
            throwParameterError(functionName, parameterName, type);
        }
    }
    static stringParameterCheck(parameter, functionName, parameterName) {
        if (typeof parameter !== "string") {
            throwParameterError(functionName, parameterName, "String");
        }
    }
    static maxLengthStringParameterCheck(parameter, functionName, parameterName, maxLength) {
        if (!parameter)
            return;
        if (parameter.length > maxLength) {
            throw new Error(`${parameterName} has a ${maxLength} character limit.`);
        }
    }
    static arrayParameterCheck(parameter, functionName, parameterName) {
        if (parameter.constructor !== Array) {
            throwParameterError(functionName, parameterName, "Array");
        }
    }
    static stringOrArrayParameterCheck(parameter, functionName, parameterName) {
        if (parameter.constructor !== Array && typeof parameter !== "string") {
            throwParameterError(functionName, parameterName, "String or Array");
        }
    }
    static numberParameterCheck(parameter, functionName, parameterName) {
        if (typeof parameter != "number") {
            if (typeof parameter === "string" && parameter) {
                if (!isNaN(parseInt(parameter))) {
                    return;
                }
            }
            throwParameterError(functionName, parameterName, "Number");
        }
    }
    static batchIsEmpty() {
        return [
            new Error("Payload of the batch operation is empty. Please make that you have other operations in between startBatch() and executeBatch() to successfuly build a batch payload."),
        ];
    }
    static handleHttpError(parsedError, parameters) {
        const error = new Error();
        Object.keys(parsedError).forEach((k) => {
            error[k] = parsedError[k];
        });
        if (parameters) {
            Object.keys(parameters).forEach((k) => {
                error[k] = parameters[k];
            });
        }
        return error;
    }
    static boolParameterCheck(parameter, functionName, parameterName) {
        if (typeof parameter != "boolean") {
            throwParameterError(functionName, parameterName, "Boolean");
        }
    }
    /**
     * Private function used to check whether required parameter is a valid GUID
     * @param parameter The GUID parameter to check
     * @param functionName
     * @param parameterName
     * @returns
     */
    static guidParameterCheck(parameter, functionName, parameterName) {
        try {
            const match = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter)[0];
            return match;
        }
        catch (error) {
            throwParameterError(functionName, parameterName, "GUID String");
        }
    }
    static keyParameterCheck(parameter, functionName, parameterName) {
        try {
            ErrorHelper.stringParameterCheck(parameter, functionName, parameterName);
            //check if the param is a guid
            const match = /^{?([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})}?$/i.exec(parameter);
            if (match) {
                return match[1];
            }
            //check the alternate key
            const alternateKeys = parameter.split(",");
            if (alternateKeys.length) {
                for (let i = 0; i < alternateKeys.length; i++) {
                    alternateKeys[i] = alternateKeys[i].trim().replace(/"/g, "'");
                    /^[\w\d\_]+\=(.+)$/i.exec(alternateKeys[i])[0];
                }
            }
            return alternateKeys.join(",");
        }
        catch (error) {
            throwParameterError(functionName, parameterName, "String representing GUID or Alternate Key");
        }
    }
    static callbackParameterCheck(callbackParameter, functionName, parameterName) {
        if (typeof callbackParameter != "function") {
            throwParameterError(functionName, parameterName, "Function");
        }
    }
    static throwBatchIncompatible(functionName, isBatch) {
        if (isBatch) {
            isBatch = false;
            throw new Error(functionName + " cannot be used in a BATCH request.");
        }
    }
    static throwBatchNotStarted(isBatch) {
        if (!isBatch) {
            throw new Error("Batch operation has not been started. Please call a DynamicsWebApi.startBatch() function prior to calling DynamicsWebApi.executeBatch() to perform a batch request correctly.");
        }
    }
}
exports.ErrorHelper = ErrorHelper;
//# sourceMappingURL=ErrorHelper.js.map

/***/ }),

/***/ 177:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigurationUtility = void 0;
const Utility_1 = __webpack_require__(811);
const ErrorHelper_1 = __webpack_require__(897);
const getApiUrl = (serverUrl, apiConfig) => {
    if (!serverUrl)
        serverUrl = Utility_1.Utility.getClientUrl();
    return `${serverUrl}/api/${apiConfig.path}/v${apiConfig.version}/`;
};
const mergeApiConfigs = (apiConfig, apiType, internalConfig) => {
    const internalApiConfig = internalConfig[apiType];
    if (apiConfig === null || apiConfig === void 0 ? void 0 : apiConfig.version) {
        ErrorHelper_1.ErrorHelper.stringParameterCheck(apiConfig.version, "DynamicsWebApi.setConfig", `config.${apiType}.version`);
        internalApiConfig.version = apiConfig.version;
    }
    if (apiConfig === null || apiConfig === void 0 ? void 0 : apiConfig.path) {
        ErrorHelper_1.ErrorHelper.stringParameterCheck(apiConfig.path, "DynamicsWebApi.setConfig", `config.${apiType}.path`);
        internalApiConfig.path = apiConfig.path;
    }
    internalApiConfig.url = getApiUrl(internalConfig.serverUrl, internalApiConfig);
};
class ConfigurationUtility {
    static merge(internalConfig, config) {
        if (config === null || config === void 0 ? void 0 : config.serverUrl) {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(config.serverUrl, "DynamicsWebApi.setConfig", "config.serverUrl");
            internalConfig.serverUrl = config.serverUrl;
        }
        mergeApiConfigs(config === null || config === void 0 ? void 0 : config.dataApi, "dataApi", internalConfig);
        mergeApiConfigs(config === null || config === void 0 ? void 0 : config.searchApi, "searchApi", internalConfig);
        if (config === null || config === void 0 ? void 0 : config.impersonate) {
            internalConfig.impersonate = ErrorHelper_1.ErrorHelper.guidParameterCheck(config.impersonate, "DynamicsWebApi.setConfig", "config.impersonate");
        }
        if (config === null || config === void 0 ? void 0 : config.impersonateAAD) {
            internalConfig.impersonateAAD = ErrorHelper_1.ErrorHelper.guidParameterCheck(config.impersonateAAD, "DynamicsWebApi.setConfig", "config.impersonateAAD");
        }
        if (config === null || config === void 0 ? void 0 : config.onTokenRefresh) {
            ErrorHelper_1.ErrorHelper.callbackParameterCheck(config.onTokenRefresh, "DynamicsWebApi.setConfig", "config.onTokenRefresh");
            internalConfig.onTokenRefresh = config.onTokenRefresh;
        }
        if (config === null || config === void 0 ? void 0 : config.includeAnnotations) {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(config.includeAnnotations, "DynamicsWebApi.setConfig", "config.includeAnnotations");
            internalConfig.includeAnnotations = config.includeAnnotations;
        }
        if (config === null || config === void 0 ? void 0 : config.timeout) {
            ErrorHelper_1.ErrorHelper.numberParameterCheck(config.timeout, "DynamicsWebApi.setConfig", "config.timeout");
            internalConfig.timeout = config.timeout;
        }
        if (config === null || config === void 0 ? void 0 : config.maxPageSize) {
            ErrorHelper_1.ErrorHelper.numberParameterCheck(config.maxPageSize, "DynamicsWebApi.setConfig", "config.maxPageSize");
            internalConfig.maxPageSize = config.maxPageSize;
        }
        if (config === null || config === void 0 ? void 0 : config.returnRepresentation) {
            ErrorHelper_1.ErrorHelper.boolParameterCheck(config.returnRepresentation, "DynamicsWebApi.setConfig", "config.returnRepresentation");
            internalConfig.returnRepresentation = config.returnRepresentation;
        }
        if (config === null || config === void 0 ? void 0 : config.useEntityNames) {
            ErrorHelper_1.ErrorHelper.boolParameterCheck(config.useEntityNames, "DynamicsWebApi.setConfig", "config.useEntityNames");
            internalConfig.useEntityNames = config.useEntityNames;
        }
////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////
////////////////////////////////////////////////
/////////
//////////////////
    }
    static default() {
        return {
            serverUrl: null,
            impersonate: null,
            impersonateAAD: null,
            onTokenRefresh: null,
            includeAnnotations: null,
            maxPageSize: null,
            returnRepresentation: null,
            proxy: null,
            dataApi: {
                path: "data",
                version: "9.2",
                url: "",
            },
            searchApi: {
                path: "search",
                version: "1.0",
                url: "",
            },
        };
    }
}
ConfigurationUtility.mergeApiConfigs = mergeApiConfigs;
exports.ConfigurationUtility = ConfigurationUtility;
//# sourceMappingURL=Config.js.map

/***/ }),

/***/ 497:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestUtility = void 0;
const Utility_1 = __webpack_require__(811);
const ErrorHelper_1 = __webpack_require__(897);
/**
 * @typedef {Object} ConvertedRequestOptions
 * @property {string} url URL (without query)
 * @property {string} query Query String
 * @property {Object} headers Heades object (always an Object; can be empty: {})
 */
/**
 * @typedef {Object} ConvertedRequest
 * @property {string} url URL (including Query String)
 * @property {Object} headers Heades object (always an Object; can be empty: {})
 * @property {boolean} async
 */
class RequestUtility {
    /**
     * Converts a request object to URL link
     *
     * @param {Object} request - Request object
     * @param {Object} [config] - DynamicsWebApi config
     * @returns {ConvertedRequest} Converted request
     */
    static compose(request, config) {
        request.path = request.path || "";
        request.functionName = request.functionName || "";
        if (!request.url) {
            if (!request._isUnboundRequest && !request.collection) {
                ErrorHelper_1.ErrorHelper.parameterCheck(request.collection, `DynamicsWebApi.${request.functionName}`, "request.collection");
            }
            if (request.collection != null) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.collection, `DynamicsWebApi.${request.functionName}`, "request.collection");
                request.path = request.collection;
                if (request.contentId) {
                    ErrorHelper_1.ErrorHelper.stringParameterCheck(request.contentId, `DynamicsWebApi.${request.functionName}`, "request.contentId");
                    if (request.contentId.startsWith("$")) {
                        request.path = `${request.contentId}/${request.path}`;
                    }
                }
                //add alternate key feature
                if (request.key) {
                    request.key = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.key, `DynamicsWebApi.${request.functionName}`, "request.key");
                }
                else if (request.id) {
                    request.key = ErrorHelper_1.ErrorHelper.guidParameterCheck(request.id, `DynamicsWebApi.${request.functionName}`, "request.id");
                }
                if (request.key) {
                    request.path += `(${request.key})`;
                }
            }
            if (request._additionalUrl) {
                if (request.path) {
                    request.path += "/";
                }
                request.path += request._additionalUrl;
            }
            request.path = RequestUtility.composeUrl(request, config, request.path);
            if (request.fetchXml) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.fetchXml, `DynamicsWebApi.${request.functionName}`, "request.fetchXml");
                let join = request.path.indexOf("?") === -1 ? "?" : "&";
                request.path += `${join}fetchXml=${encodeURIComponent(request.fetchXml)}`;
            }
        }
        else {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.url, `DynamicsWebApi.${request.functionName}`, "request.url");
            request.path = request.url.replace(config.dataApi.url, "");
            request.path = RequestUtility.composeUrl(request, config, request.path);
        }
        if (request.hasOwnProperty("async") && request.async != null) {
            ErrorHelper_1.ErrorHelper.boolParameterCheck(request.async, `DynamicsWebApi.${request.functionName}`, "request.async");
        }
        else {
            request.async = true;
        }
        request.headers = RequestUtility.composeHeaders(request, config);
        return request;
    }
    /**
     * Converts optional parameters of the request to URL. If expand parameter exists this function is called recursively.
     *
     * @param {Object} request - Request object
     * @param {string} request.functionName - Name of the function that converts a request (for Error Handling)
     * @param {string} url - URL beginning (with required parameters)
     * @param {string} [joinSymbol] - URL beginning (with required parameters)
     * @param {Object} [config] - DynamicsWebApi config
     * @returns {ConvertedRequestOptions} Additional options in request
     */
    static composeUrl(request, config, url = "", joinSymbol = "&") {
        var _a, _b, _c;
        const queryArray = [];
        if (request) {
            if (request.navigationProperty) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.navigationProperty, `DynamicsWebApi.${request.functionName}`, "request.navigationProperty");
                url += "/" + request.navigationProperty;
                if (request.navigationPropertyKey) {
                    let navigationKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.navigationPropertyKey, `DynamicsWebApi.${request.functionName}`, "request.navigationPropertyKey");
                    url += "(" + navigationKey + ")";
                }
                if (request.navigationProperty === "Attributes") {
                    if (request.metadataAttributeType) {
                        ErrorHelper_1.ErrorHelper.stringParameterCheck(request.metadataAttributeType, `DynamicsWebApi.${request.functionName}`, "request.metadataAttributeType");
                        url += "/" + request.metadataAttributeType;
                    }
                }
            }
            if ((_a = request.select) === null || _a === void 0 ? void 0 : _a.length) {
                ErrorHelper_1.ErrorHelper.arrayParameterCheck(request.select, `DynamicsWebApi.${request.functionName}`, "request.select");
                if (request.functionName == "retrieve" && request.select.length == 1 && request.select[0].endsWith("/$ref")) {
                    url += "/" + request.select[0];
                }
                else {
                    if (request.select[0].startsWith("/") && request.functionName == "retrieve") {
                        if (request.navigationProperty == null) {
                            url += request.select.shift();
                        }
                        else {
                            request.select.shift();
                        }
                    }
                    //check if anything left in the array
                    if (request.select.length) {
                        queryArray.push("$select=" + request.select.join(","));
                    }
                }
            }
            if (request.filter) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.filter, `DynamicsWebApi.${request.functionName}`, "request.filter");
                const removeBracketsFromGuidReg = /[^"']{([\w\d]{8}[-]?(?:[\w\d]{4}[-]?){3}[\w\d]{12})}(?:[^"']|$)/g;
                let filterResult = request.filter;
                //fix bug 2018-06-11
                let m = null;
                while ((m = removeBracketsFromGuidReg.exec(filterResult)) !== null) {
                    if (m.index === removeBracketsFromGuidReg.lastIndex) {
                        removeBracketsFromGuidReg.lastIndex++;
                    }
                    let replacement = m[0].endsWith(")") ? ")" : " ";
                    filterResult = filterResult.replace(m[0], " " + m[1] + replacement);
                }
                queryArray.push("$filter=" + encodeURIComponent(filterResult));
            }
            if (request.fieldName) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.fieldName, `DynamicsWebApi.${request.functionName}`, "request.fieldName");
                url += "/" + request.fieldName;
            }
            if (request.savedQuery) {
                queryArray.push("savedQuery=" + ErrorHelper_1.ErrorHelper.guidParameterCheck(request.savedQuery, `DynamicsWebApi.${request.functionName}`, "request.savedQuery"));
            }
            if (request.userQuery) {
                queryArray.push("userQuery=" + ErrorHelper_1.ErrorHelper.guidParameterCheck(request.userQuery, `DynamicsWebApi.${request.functionName}`, "request.userQuery"));
            }
            if (request.apply) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.apply, `DynamicsWebApi.${request.functionName}`, "request.apply");
                queryArray.push("$apply=" + request.apply);
            }
            if (request.count) {
                ErrorHelper_1.ErrorHelper.boolParameterCheck(request.count, `DynamicsWebApi.${request.functionName}`, "request.count");
                queryArray.push("$count=" + request.count);
            }
            if (request.top && request.top > 0) {
                ErrorHelper_1.ErrorHelper.numberParameterCheck(request.top, `DynamicsWebApi.${request.functionName}`, "request.top");
                queryArray.push("$top=" + request.top);
            }
            if (request.orderBy != null && request.orderBy.length) {
                ErrorHelper_1.ErrorHelper.arrayParameterCheck(request.orderBy, `DynamicsWebApi.${request.functionName}`, "request.orderBy");
                queryArray.push("$orderby=" + request.orderBy.join(","));
            }
            if (request.partitionId) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.partitionId, `DynamicsWebApi.${request.functionName}`, "request.partitionId");
                queryArray.push("partitionid='" + request.partitionId + "'");
            }
            if (request.downloadSize) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.downloadSize, `DynamicsWebApi.${request.functionName}`, "request.downloadSize");
                queryArray.push("size=" + request.downloadSize);
            }
            if ((_b = request.queryParams) === null || _b === void 0 ? void 0 : _b.length) {
                ErrorHelper_1.ErrorHelper.arrayParameterCheck(request.queryParams, `DynamicsWebApi.${request.functionName}`, "request.queryParams");
                queryArray.push(request.queryParams.join("&"));
            }
            if (request.fileName) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.fileName, `DynamicsWebApi.${request.functionName}`, "request.fileName");
                queryArray.push("x-ms-file-name=" + request.fileName);
            }
            if (request.entity) {
                ErrorHelper_1.ErrorHelper.parameterCheck(request.entity, `DynamicsWebApi.${request.functionName}`, "request.entity");
            }
            if (request.data) {
                ErrorHelper_1.ErrorHelper.parameterCheck(request.data, `DynamicsWebApi.${request.functionName}`, "request.data");
            }
            if (request.isBatch) {
                ErrorHelper_1.ErrorHelper.boolParameterCheck(request.isBatch, `DynamicsWebApi.${request.functionName}`, "request.isBatch");
            }
            if (request.timeout) {
                ErrorHelper_1.ErrorHelper.numberParameterCheck(request.timeout, `DynamicsWebApi.${request.functionName}`, "request.timeout");
            }
            if ((_c = request.expand) === null || _c === void 0 ? void 0 : _c.length) {
                ErrorHelper_1.ErrorHelper.stringOrArrayParameterCheck(request.expand, `DynamicsWebApi.${request.functionName}`, "request.expand");
                if (typeof request.expand === "string") {
                    queryArray.push("$expand=" + request.expand);
                }
                else {
                    const expandQueryArray = [];
                    for (let i = 0; i < request.expand.length; i++) {
                        if (request.expand[i].property) {
                            const expand = request.expand[i];
                            expand.functionName = `${request.functionName} $expand`;
                            let expandConverted = RequestUtility.composeUrl(expand, config, "", ";");
                            if (expandConverted) {
                                expandConverted = `(${expandConverted.substr(1)})`;
                            }
                            expandQueryArray.push(request.expand[i].property + expandConverted);
                        }
                    }
                    if (expandQueryArray.length) {
                        queryArray.push("$expand=" + expandQueryArray.join(","));
                    }
                }
            }
        }
        return !queryArray.length ? url : url + "?" + queryArray.join(joinSymbol);
    }
    static composeHeaders(request, config) {
        const headers = {};
        const prefer = RequestUtility.composePreferHeader(request, config);
        if (prefer.length) {
            headers["Prefer"] = prefer;
        }
        if (request.collection === "$metadata") {
            headers["Accept"] = "application/xml";
        }
        if (request.transferMode) {
            headers["x-ms-transfer-mode"] = request.transferMode;
        }
        if (request.ifmatch != null && request.ifnonematch != null) {
            throw new Error(`DynamicsWebApi.${request.functionName}. Either one of request.ifmatch or request.ifnonematch parameters should be used in a call, not both.`);
        }
        if (request.ifmatch) {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.ifmatch, `DynamicsWebApi.${request.functionName}`, "request.ifmatch");
            headers["If-Match"] = request.ifmatch;
        }
        if (request.ifnonematch) {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.ifnonematch, `DynamicsWebApi.${request.functionName}`, "request.ifnonematch");
            headers["If-None-Match"] = request.ifnonematch;
        }
        if (request.impersonate) {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.impersonate, `DynamicsWebApi.${request.functionName}`, "request.impersonate");
            headers["MSCRMCallerID"] = ErrorHelper_1.ErrorHelper.guidParameterCheck(request.impersonate, `DynamicsWebApi.${request.functionName}`, "request.impersonate");
        }
        if (request.impersonateAAD) {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.impersonateAAD, `DynamicsWebApi.${request.functionName}`, "request.impersonateAAD");
            headers["CallerObjectId"] = ErrorHelper_1.ErrorHelper.guidParameterCheck(request.impersonateAAD, `DynamicsWebApi.${request.functionName}`, "request.impersonateAAD");
        }
        if (request.token) {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.token, `DynamicsWebApi.${request.functionName}`, "request.token");
            headers["Authorization"] = "Bearer " + request.token;
        }
        if (request.duplicateDetection) {
            ErrorHelper_1.ErrorHelper.boolParameterCheck(request.duplicateDetection, `DynamicsWebApi.${request.functionName}`, "request.duplicateDetection");
            headers["MSCRM.SuppressDuplicateDetection"] = "false";
        }
        if (request.bypassCustomPluginExecution) {
            ErrorHelper_1.ErrorHelper.boolParameterCheck(request.bypassCustomPluginExecution, `DynamicsWebApi.${request.functionName}`, "request.bypassCustomPluginExecution");
            headers["MSCRM.BypassCustomPluginExecution"] = "true";
        }
        if (request.noCache) {
            ErrorHelper_1.ErrorHelper.boolParameterCheck(request.noCache, `DynamicsWebApi.${request.functionName}`, "request.noCache");
            headers["Cache-Control"] = "no-cache";
        }
        if (request.mergeLabels) {
            ErrorHelper_1.ErrorHelper.boolParameterCheck(request.mergeLabels, `DynamicsWebApi.${request.functionName}`, "request.mergeLabels");
            headers["MSCRM.MergeLabels"] = "true";
        }
        if (request.contentId) {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.contentId, `DynamicsWebApi.${request.functionName}`, "request.contentId");
            if (!request.contentId.startsWith("$")) {
                headers["Content-ID"] = request.contentId;
            }
        }
        if (request.contentRange) {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.contentRange, `DynamicsWebApi.${request.functionName}`, "request.contentRange");
            headers["Content-Range"] = request.contentRange;
        }
        if (request.range) {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.range, `DynamicsWebApi.${request.functionName}`, "request.range");
            headers["Range"] = request.range;
        }
        return headers;
    }
    static composePreferHeader(request, config) {
        let returnRepresentation = request.returnRepresentation;
        let includeAnnotations = request.includeAnnotations;
        let maxPageSize = request.maxPageSize;
        let trackChanges = request.trackChanges;
        let prefer = [];
        if (request.prefer && request.prefer.length) {
            ErrorHelper_1.ErrorHelper.stringOrArrayParameterCheck(request.prefer, `DynamicsWebApi.${request.functionName}`, "request.prefer");
            if (typeof request.prefer === "string") {
                prefer = request.prefer.split(",");
            }
            for (let i in prefer) {
                let item = prefer[i].trim();
                if (item === "return=representation") {
                    returnRepresentation = true;
                }
                else if (item.indexOf("odata.include-annotations=") > -1) {
                    includeAnnotations = item.replace("odata.include-annotations=", "").replace(/"/g, "");
                }
                else if (item.startsWith("odata.maxpagesize=")) {
                    maxPageSize = Number(item.replace("odata.maxpagesize=", "").replace(/"/g, "")) || 0;
                }
                else if (item.indexOf("odata.track-changes") > -1) {
                    trackChanges = true;
                }
            }
        }
        //clear array
        prefer = [];
        if (config) {
            if (returnRepresentation == null) {
                returnRepresentation = config.returnRepresentation;
            }
            includeAnnotations = includeAnnotations ? includeAnnotations : config.includeAnnotations;
            maxPageSize = maxPageSize ? maxPageSize : config.maxPageSize;
        }
        if (returnRepresentation) {
            ErrorHelper_1.ErrorHelper.boolParameterCheck(returnRepresentation, `DynamicsWebApi.${request.functionName}`, "request.returnRepresentation");
            prefer.push("return=representation");
        }
        if (includeAnnotations) {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(includeAnnotations, `DynamicsWebApi.${request.functionName}`, "request.includeAnnotations");
            prefer.push(`odata.include-annotations="${includeAnnotations}"`);
        }
        if (maxPageSize && maxPageSize > 0) {
            ErrorHelper_1.ErrorHelper.numberParameterCheck(maxPageSize, `DynamicsWebApi.${request.functionName}`, "request.maxPageSize");
            prefer.push("odata.maxpagesize=" + maxPageSize);
        }
        if (trackChanges) {
            ErrorHelper_1.ErrorHelper.boolParameterCheck(trackChanges, `DynamicsWebApi.${request.functionName}`, "request.trackChanges");
            prefer.push("odata.track-changes");
        }
        return prefer.join(",");
    }
    static convertToBatch(requests, config) {
        const batchBoundary = `dwa_batch_${Utility_1.Utility.generateUUID()}`;
        const batchBody = [];
        let currentChangeSet = null;
        let contentId = 100000;
        requests.forEach((internalRequest) => {
            var _a;
            internalRequest.functionName = "executeBatch";
            const isGet = internalRequest.method === "GET";
            if (isGet && currentChangeSet) {
                //end current change set
                batchBody.push(`\n--${currentChangeSet}--`);
                currentChangeSet = null;
                contentId = 100000;
            }
            if (!currentChangeSet) {
                batchBody.push(`\n--${batchBoundary}`);
                if (!isGet) {
                    currentChangeSet = `changeset_${Utility_1.Utility.generateUUID()}`;
                    batchBody.push("Content-Type: multipart/mixed;boundary=" + currentChangeSet);
                }
            }
            if (!isGet) {
                batchBody.push(`\n--${currentChangeSet}`);
            }
            batchBody.push("Content-Type: application/http");
            batchBody.push("Content-Transfer-Encoding: binary");
            if (!isGet) {
                const contentIdValue = internalRequest.headers.hasOwnProperty("Content-ID") ? internalRequest.headers["Content-ID"] : ++contentId;
                batchBody.push(`Content-ID: ${contentIdValue}`);
            }
            if (!((_a = internalRequest.path) === null || _a === void 0 ? void 0 : _a.startsWith("$"))) {
                batchBody.push(`\n${internalRequest.method} ${config.dataApi.url}${internalRequest.path} HTTP/1.1`);
            }
            else {
                batchBody.push(`\n${internalRequest.method} ${internalRequest.path} HTTP/1.1`);
            }
            if (isGet) {
                batchBody.push("Accept: application/json");
            }
            else {
                batchBody.push("Content-Type: application/json");
            }
            for (let key in internalRequest.headers) {
                if (key === "Authorization" || key === "Content-ID")
                    continue;
                batchBody.push(`${key}: ${internalRequest.headers[key]}`);
            }
            const data = internalRequest.data || internalRequest.entity;
            if (!isGet && data) {
                batchBody.push(`\n${RequestUtility.processData(data, config)}`);
            }
        });
        if (currentChangeSet) {
            batchBody.push(`\n--${currentChangeSet}--`);
        }
        batchBody.push(`\n--${batchBoundary}--`);
        const headers = RequestUtility.setStandardHeaders();
        headers["Content-Type"] = `multipart/mixed;boundary=${batchBoundary}`;
        return { headers: headers, body: batchBody.join("\n") };
    }
    static findCollectionName(entityName) {
        let collectionName = null;
        if (!Utility_1.Utility.isNull(RequestUtility.entityNames)) {
            collectionName = RequestUtility.entityNames[entityName];
            if (Utility_1.Utility.isNull(collectionName)) {
                for (let key in RequestUtility.entityNames) {
                    if (RequestUtility.entityNames[key] === entityName) {
                        return entityName;
                    }
                }
            }
        }
        return collectionName;
    }
    static processData(data, config) {
        let stringifiedData;
        if (data) {
            if (data instanceof Uint8Array || data instanceof Uint16Array || data instanceof Uint32Array)
                return data;
            stringifiedData = JSON.stringify(data, (key, value) => {
                if (key.endsWith("@odata.bind") || key.endsWith("@odata.id")) {
                    if (typeof value === "string" && !value.startsWith("$")) {
                        //remove brackets in guid
                        if (/\(\{[\w\d-]+\}\)/g.test(value)) {
                            value = value.replace(/(.+)\(\{([\w\d-]+)\}\)/g, "$1($2)");
                        }
                        if (config.useEntityNames) {
                            //replace entity name with collection name
                            const regularExpression = /([\w_]+)(\([\d\w-]+\))$/;
                            const valueParts = regularExpression.exec(value);
                            if (valueParts && valueParts.length > 2) {
                                const collectionName = RequestUtility.findCollectionName(valueParts[1]);
                                if (!Utility_1.Utility.isNull(collectionName)) {
                                    value = value.replace(regularExpression, collectionName + "$2");
                                }
                            }
                        }
                        if (!value.startsWith(config.dataApi.url)) {
                            //add full web api url if it's not set
                            if (key.endsWith("@odata.bind")) {
                                if (!value.startsWith("/")) {
                                    value = "/" + value;
                                }
                            }
                            else {
                                value = config.dataApi.url + value.replace(/^\//, "");
                            }
                        }
                    }
                }
                else if (key.startsWith("oData") || key.endsWith("_Formatted") || key.endsWith("_NavigationProperty") || key.endsWith("_LogicalName")) {
                    value = undefined;
                }
                return value;
            });
            stringifiedData = stringifiedData.replace(/[\u007F-\uFFFF]/g, function (chr) {
                return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
            });
        }
        return stringifiedData;
    }
    static setStandardHeaders(headers = {}) {
        if (!headers["Accept"])
            headers["Accept"] = "application/json";
        headers["OData-MaxVersion"] = "4.0";
        headers["OData-Version"] = "4.0";
        headers["Content-Type"] = headers["Content-Range"] ? "application/octet-stream" : "application/json; charset=utf-8";
        return headers;
    }
}
RequestUtility.entityNames = null;
exports.RequestUtility = RequestUtility;
//# sourceMappingURL=Request.js.map

/***/ }),

/***/ 811:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Utility = void 0;
function isNodeEnv() {
    // tslint:disable:strict-type-predicates
    return Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
}
function getGlobalObject() {
    return (isNodeEnv() ? __webpack_require__.g : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {});
}
////////////
//////////////////////////////////
//////////
function getCrypto() {
////////////////
////////////////////////////////////////
///////////////////////
/////
//////////
//////////////////
        return window.crypto;
////////////////////
/////
//////////////
}
function generateRandomBytes() {
    const uCrypto = getCrypto();
////////////////
/////////////////////////////////////////////////////////
//////////////////
        return uCrypto.getRandomValues(new Uint8Array(1));
////////////////////
/////
//////////////////////////////////
//////////////
}
const downloadChunkSize = 4194304;
class Utility {
    /**
     * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
     *
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @returns {string}
     */
    static buildFunctionParameters(parameters) {
        if (parameters) {
            const parameterNames = Object.keys(parameters);
            let functionParameters = "";
            let urlQuery = "";
            for (var i = 1; i <= parameterNames.length; i++) {
                const parameterName = parameterNames[i - 1];
                let value = parameters[parameterName];
                if (value === null)
                    continue;
                if (typeof value === "string" && !value.startsWith("Microsoft.Dynamics.CRM")) {
                    value = "'" + value + "'";
                }
                else if (typeof value === "object") {
                    value = JSON.stringify(value);
                }
                if (i > 1) {
                    functionParameters += ",";
                    urlQuery += "&";
                }
                functionParameters += parameterName + "=@p" + i;
                urlQuery += "@p" + i + "=" + value;
            }
            return "(" + functionParameters + ")?" + urlQuery;
        }
        else {
            return "()";
        }
    }
    /**
     * Parses a paging cookie returned in response
     *
     * @param {string} pageCookies - Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.
     * @param {number} currentPageNumber - A current page number. Fix empty paging-cookie for complex fetch xmls.
     * @returns {{cookie: "", number: 0, next: 1}}
     */
    static getFetchXmlPagingCookie(pageCookies = "", currentPageNumber = 1) {
        //get the page cokies
        pageCookies = decodeURIComponent(decodeURIComponent(pageCookies));
        const info = /pagingcookie="(<cookie page="(\d+)".+<\/cookie>)/.exec(pageCookies);
        if (info != null) {
            let page = parseInt(info[2]);
            return {
                cookie: info[1]
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/\"/g, "'")
                    .replace(/\'/g, "&" + "quot;"),
                page: page,
                nextPage: page + 1,
            };
        }
        else {
            //http://stackoverflow.com/questions/41262772/execution-of-fetch-xml-using-web-api-dynamics-365 workaround
            return {
                cookie: "",
                page: currentPageNumber,
                nextPage: currentPageNumber + 1,
            };
        }
    }
    /**
     * Converts a response to a reference object
     *
     * @param {Object} responseData - Response object
     * @returns {ReferenceObject}
     */
    static convertToReferenceObject(responseData) {
        const result = /\/(\w+)\(([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})/i.exec(responseData["@odata.id"]);
        return { id: result[2], collection: result[1], oDataContext: responseData["@odata.context"] };
    }
    /**
     * Checks whether the value is JS Null.
     * @param {Object} value
     * @returns {boolean}
     */
    static isNull(value) {
        return typeof value === "undefined" || value == null;
    }
    /** Generates UUID */
    static generateUUID() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (generateRandomBytes()[0] & (15 >> (c / 4)))).toString(16));
    }
    static getXrmContext() {
        if (typeof GetGlobalContext !== "undefined") {
            return GetGlobalContext();
        }
        else {
            if (typeof Xrm !== "undefined") {
                //d365 v.9.0
                if (!Utility.isNull(Xrm.Utility) && !Utility.isNull(Xrm.Utility.getGlobalContext)) {
                    return Xrm.Utility.getGlobalContext();
                }
                else if (!Utility.isNull(Xrm.Page) && !Utility.isNull(Xrm.Page.context)) {
                    return Xrm.Page.context;
                }
            }
        }
        throw new Error("Xrm Context is not available. In most cases, it can be resolved by adding a reference to a ClientGlobalContext.js.aspx. Please refer to MSDN documentation for more details.");
    }
    static getXrmUtility() {
        return typeof Xrm !== "undefined" ? Xrm.Utility : null;
    }
    static getClientUrl() {
        const context = Utility.getXrmContext();
        let clientUrl = context.getClientUrl();
        if (clientUrl.match(/\/$/)) {
            clientUrl = clientUrl.substring(0, clientUrl.length - 1);
        }
        return clientUrl;
    }
    static isObject(obj) {
        const type = typeof obj;
        return type === "object" && !!obj;
    }
    static copyObject(src, excludeProps = []) {
        let target = {};
        for (let prop in src) {
            if (src.hasOwnProperty(prop) && !excludeProps.includes(prop)) {
                // if the value is a nested object, recursively copy all its properties
                if (Utility.isObject(src[prop]) && Object.prototype.toString.call(src[prop]) !== "[object Date]") {
                    if (!Array.isArray(src[prop])) {
                        target[prop] = Utility.copyObject(src[prop]);
                    }
                    else {
                        target[prop] = src[prop].slice();
                    }
                }
                else {
                    target[prop] = src[prop];
                }
            }
        }
        return target;
    }
    static setFileChunk(request, fileBuffer, chunkSize, offset) {
        offset = offset || 0;
        const count = offset + chunkSize > fileBuffer.length ? fileBuffer.length % chunkSize : chunkSize;
        let content;
////////////////////
////////////////////////////////////////////
///////////////////////////////////////////////////////////////
/////////
//////////////
//////////////////////
            content = new Uint8Array(count);
            for (let i = 0; i < count; i++) {
                content[i] = fileBuffer[offset + i];
            }
////////////////////////
/////////
//////////////////
        request.data = content;
        request.contentRange = "bytes " + offset + "-" + (offset + count - 1) + "/" + fileBuffer.length;
    }
    static convertToFileBuffer(binaryString) {
////////////////////
////////////////////////////////////////////
///////////////////////////////////////////////////////
/////////
//////////////
//////////////////////
            const bytes = new Uint8Array(binaryString.length);
            for (var i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
////////////////////////
/////////
//////////////////
    }
}
Utility.isNodeEnv = isNodeEnv;
Utility.downloadChunkSize = downloadChunkSize;
exports.Utility = Utility;
//# sourceMappingURL=Utility.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DynamicsWebApi = void 0;
const Config_1 = __webpack_require__(177);
const Utility_1 = __webpack_require__(811);
const ErrorHelper_1 = __webpack_require__(897);
const RequestClient_1 = __webpack_require__(94);
/**
 * Microsoft Dynamics CRM Web API helper library written in JavaScript.
 * It is compatible with: Dynamics 365 (online), Dynamics 365 (on-premise), Dynamics CRM 2016, Dynamics CRM Online.
 * @module dynamics-web-api
 */
class DynamicsWebApi {
    constructor(config) {
        this._config = Config_1.ConfigurationUtility.default();
        this._isBatch = false;
        this._batchRequestId = null;
        /**
         * Sets the configuration parameters for DynamicsWebApi helper.
         *
         * @param {DynamicsWebApi.Config} config - Configuration
         * @example
           dynamicsWebApi.setConfig({ serverUrl: 'https://contoso.api.crm.dynamics.com/' });
         */
        this.setConfig = (config) => Config_1.ConfigurationUtility.merge(this._config, config);
        this._makeRequest = (request) => {
            request.isBatch = this._isBatch;
            request.requestId = this._batchRequestId;
            return new Promise((resolve, reject) => {
                RequestClient_1.RequestClient.makeRequest(request, this._config, resolve, reject);
            });
        };
        /**
         * Sends an asynchronous request to create a new record.
         *
         * @param {DWARequest} request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         * @example
         *const lead = {
         *    subject: "Test WebAPI",
         *    firstname: "Test",
         *    lastname: "WebAPI",
         *    jobtitle: "Title"
         *};
         *
         *const request = {
         *    data: lead,
         *    collection: "leads",
         *    returnRepresentation: true
         *}
         *
         *const response = await dynamicsWebApi.create(request);
         *
         */
        this.create = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.create", "request");
            let internalRequest;
            if (!request.functionName) {
                internalRequest = Utility_1.Utility.copyObject(request);
                internalRequest.functionName = "create";
            }
            else
                internalRequest = request;
            internalRequest.method = "POST";
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to retrieve a record.
         *
         * @param {DWARequest} request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         * @example
         *const request = {
         *    key: '7d577253-3ef0-4a0a-bb7f-8335c2596e70',
         *    collection: "leads",
         *    select: ["fullname", "subject"],
         *    ifnonematch: 'W/"468026"',
         *    includeAnnotations: "OData.Community.Display.V1.FormattedValue"
         *};
         *
         *const response = await dynamicsWebApi.retrieve(request);
         */
        this.retrieve = (request) => {
            var _a;
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieve", "request");
            let internalRequest;
            if (!request.functionName) {
                internalRequest = Utility_1.Utility.copyObject(request);
                internalRequest.functionName = "retrieve";
            }
            else
                internalRequest = request;
            internalRequest.method = "GET";
            internalRequest.responseParameters = {
                isRef: ((_a = internalRequest.select) === null || _a === void 0 ? void 0 : _a.length) === 1 && internalRequest.select[0].endsWith("/$ref"),
            };
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to update a record.
         *
         * @param {DWARequest} request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.update = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.update", "request");
            let internalRequest;
            if (!request.functionName) {
                internalRequest = Utility_1.Utility.copyObject(request);
                internalRequest.functionName = "update";
            }
            else
                internalRequest = request;
            //Metadata definitions, cannot be updated using "PATCH" method
            if (!internalRequest.method)
                internalRequest.method = /EntityDefinitions|RelationshipDefinitions|GlobalOptionSetDefinitions/.test(internalRequest.collection || "")
                    ? "PUT"
                    : "PATCH";
            internalRequest.responseParameters = { valueIfEmpty: true };
            if (internalRequest.ifmatch == null) {
                internalRequest.ifmatch = "*"; //to prevent upsert
            }
            //copy locally
            var ifmatch = internalRequest.ifmatch;
            return this._makeRequest(internalRequest)
                .then(function (response) {
                return response.data;
            })
                .catch(function (error) {
                if (ifmatch && error.status === 412) {
                    //precondition failed - not updated
                    return false;
                }
                //rethrow error otherwise
                throw error;
            });
        };
        /**
         * Sends an asynchronous request to update a single value in the record.
         *
         * @param {string} key - A String representing the GUID value or Alternate Key for the record to update.
         * @param {string} collection - The name of the Entity Collection or Entity Logical name.
         * @param {Object} keyValuePair - keyValuePair object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"}
         * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
         * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
         * @returns {Promise} D365 Web Api Response
         */
        this.updateSingleProperty = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateSingleProperty", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.fieldValuePair, "DynamicsWebApi.updateSingleProperty", "request.fieldValuePair");
            var field = Object.keys(request.fieldValuePair)[0];
            var fieldValue = request.fieldValuePair[field];
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.navigationProperty = field;
            internalRequest.data = { value: fieldValue };
            internalRequest.functionName = "updateSingleProperty";
            internalRequest.method = "PUT";
            delete internalRequest["fieldValuePair"];
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to delete a record.
         *
         * @param {DWARequest} request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.deleteRecord = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteRecord", "request");
            let internalRequest;
            if (!request.functionName) {
                internalRequest = Utility_1.Utility.copyObject(request);
                internalRequest.functionName = "deleteRecord";
            }
            else
                internalRequest = request;
            internalRequest.method = "DELETE";
            internalRequest.responseParameters = { valueIfEmpty: true };
            //copy locally
            const ifmatch = internalRequest.ifmatch;
            return this._makeRequest(internalRequest)
                .then(function (response) {
                return response.data;
            })
                .catch(function (error) {
                if (ifmatch && error.status === 412) {
                    //precondition failed - not deleted
                    return false;
                }
                else {
                    //rethrow error otherwise
                    throw error;
                }
            });
        };
        /**
         * Sends an asynchronous request to upsert a record.
         *
         * @param {DWARequest} request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.upsert = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.upsert", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "PATCH";
            internalRequest.functionName = "upsert";
            //copy locally
            const ifnonematch = internalRequest.ifnonematch;
            const ifmatch = internalRequest.ifmatch;
            return this._makeRequest(internalRequest)
                .then(function (response) {
                return response.data;
            })
                .catch(function (error) {
                if (ifnonematch && error.status === 412) {
                    //if prevent update
                    return;
                }
                else if (ifmatch && error.status === 404) {
                    //if prevent create
                    return;
                }
                //rethrow error otherwise
                throw error;
            });
        };
        this._uploadFileChunk = (request, fileBytes, chunkSize, offset = 0) => {
            // offset = offset || 0;
            Utility_1.Utility.setFileChunk(request, fileBytes, chunkSize, offset);
            return this._makeRequest(request).then(() => {
                offset += chunkSize;
                if (offset <= fileBytes.length) {
                    return this._uploadFileChunk(request, fileBytes, chunkSize, offset);
                }
                return;
            });
        };
        /**
         * Upload file to a File Attribute
         *
         * @param {any} request - An object that represents all possible options for a current request.
         */
        this.uploadFile = (request) => {
            ErrorHelper_1.ErrorHelper.throwBatchIncompatible("DynamicsWebApi.uploadFile", this._isBatch);
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.uploadFile", "request");
            const internalRequest = Utility_1.Utility.copyObject(request, ["data"]);
            internalRequest.method = "PATCH";
            internalRequest.functionName = "uploadFile";
            internalRequest.transferMode = "chunked";
            return this._makeRequest(internalRequest).then((response) => {
                internalRequest.url = response.data.location;
                delete internalRequest.transferMode;
                delete internalRequest.fieldName;
                delete internalRequest.fileName;
                return this._uploadFileChunk(internalRequest, request.data, response.data.chunkSize);
            });
        };
        this._downloadFileChunk = (request, bytesDownloaded = 0, 
        // fileSize: number = 0,
        data = "") => {
            // bytesDownloaded = bytesDownloaded || 0;
            // fileSize = fileSize || 0;
            // data = data || "";
            request.range = "bytes=" + bytesDownloaded + "-" + (bytesDownloaded + Utility_1.Utility.downloadChunkSize - 1);
            request.downloadSize = "full";
            return this._makeRequest(request).then((response) => {
                request.url = response.data.location;
                data += response.data.value;
                bytesDownloaded += Utility_1.Utility.downloadChunkSize;
                if (bytesDownloaded <= response.data.fileSize) {
                    return this._downloadFileChunk(request, bytesDownloaded, data);
                }
                return {
                    fileName: response.data.fileName,
                    fileSize: response.data.fileSize,
                    data: Utility_1.Utility.convertToFileBuffer(data),
                };
            });
        };
        /**
         * Download a file from a File Attribute
         * @param {any} request - An object that represents all possible options for a current request.
         */
        this.downloadFile = (request) => {
            ErrorHelper_1.ErrorHelper.throwBatchIncompatible("DynamicsWebApi.downloadFile", this._isBatch);
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.downloadFile", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "GET";
            internalRequest.functionName = "downloadFile";
            internalRequest.responseParameters = { parse: true };
            return this._downloadFileChunk(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve records.
         *
         * @param request - An object that represents all possible options for a current request.
         * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveMultiple = (request, nextPageLink) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveMultiple", "request");
            let internalRequest;
            if (!request.functionName) {
                internalRequest = Utility_1.Utility.copyObject(request);
                internalRequest.functionName = "retrieveMultiple";
            }
            else
                internalRequest = request;
            internalRequest.method = "GET";
            if (nextPageLink) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(nextPageLink, "DynamicsWebApi.retrieveMultiple", "nextPageLink");
                internalRequest.url = nextPageLink;
            }
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        this._retrieveAllRequest = (request, nextPageLink, records = []) => {
            return this.retrieveMultiple(request, nextPageLink).then((response) => {
                records = records.concat(response.value);
                const pageLink = response.oDataNextLink;
                if (pageLink) {
                    return this._retrieveAllRequest(request, pageLink, records);
                }
                const result = { value: records };
                if (response.oDataDeltaLink) {
                    result["@odata.deltaLink"] = response.oDataDeltaLink;
                    result.oDataDeltaLink = response.oDataDeltaLink;
                }
                return result;
            });
        };
        /**
         * Sends an asynchronous request to retrieve all records.
         *
         * @param {DWARequest} request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveAll = (request) => {
            ErrorHelper_1.ErrorHelper.throwBatchIncompatible("DynamicsWebApi.retrieveAll", this._isBatch);
            return this._retrieveAllRequest(request);
        };
        /**
         * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.count = (request) => {
            var _a;
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.count", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "GET";
            internalRequest.functionName = "count";
            if ((_a = internalRequest.filter) === null || _a === void 0 ? void 0 : _a.length) {
                internalRequest.count = true;
            }
            else {
                internalRequest.navigationProperty = "$count";
            }
            internalRequest.responseParameters = { toCount: internalRequest.count };
            //if filter has not been specified then simplify the request
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to count records. Returns: Number
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.countAll = (request) => {
            ErrorHelper_1.ErrorHelper.throwBatchIncompatible("DynamicsWebApi.countAll", this._isBatch);
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.countAll", "request");
            return this._retrieveAllRequest(request).then(function (response) {
                return response ? (response.value ? response.value.length : 0) : 0;
            });
        };
        /**
         * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.fetch = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.fetch", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "GET";
            internalRequest.functionName = "fetch";
            ErrorHelper_1.ErrorHelper.stringParameterCheck(internalRequest.fetchXml, "DynamicsWebApi.fetch", "request.fetchXml");
            //only add paging if there is no top
            if (internalRequest.fetchXml && !/^<fetch.+top=/.test(internalRequest.fetchXml)) {
                let replacementString = "";
                if (!/^<fetch.+page=/.test(internalRequest.fetchXml)) {
                    internalRequest.pageNumber = internalRequest.pageNumber || 1;
                    ErrorHelper_1.ErrorHelper.numberParameterCheck(internalRequest.pageNumber, "DynamicsWebApi.fetch", "request.pageNumber");
                    replacementString = `$1 page="${internalRequest.pageNumber}"`;
                }
                if (internalRequest.pagingCookie != null) {
                    ErrorHelper_1.ErrorHelper.stringParameterCheck(internalRequest.pagingCookie, "DynamicsWebApi.fetch", "request.pagingCookie");
                    replacementString += ` paging-cookie="${internalRequest.pagingCookie}"`;
                }
                //add page number and paging cookie to fetch xml
                if (replacementString)
                    internalRequest.fetchXml = internalRequest.fetchXml.replace(/^(<fetch)/, replacementString);
            }
            internalRequest.responseParameters = { pageNumber: internalRequest.pageNumber };
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to execute FetchXml to retrieve all records.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.fetchAll = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.fetchAll", "request");
            const _executeFetchXmlAll = (request, records = []) => {
                // records = records || [];
                return this.fetch(request).then(function (response) {
                    records = records.concat(response.value);
                    if (response.PagingInfo) {
                        request.pageNumber = response.PagingInfo.nextPage;
                        request.pagingCookie = response.PagingInfo.cookie;
                        return _executeFetchXmlAll(request, records);
                    }
                    return { value: records };
                });
            };
            ErrorHelper_1.ErrorHelper.throwBatchIncompatible("DynamicsWebApi.fetchAll", this._isBatch);
            return _executeFetchXmlAll(request);
        };
        /**
         * Associate for a collection-valued navigation property. (1:N or N:N)
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.associate = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.associate", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "POST";
            internalRequest.functionName = "associate";
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.relatedCollection, "DynamicsWebApi.associate", "request.relatedcollection");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.relationshipName, "DynamicsWebApi.associate", "request.relationshipName");
            const primaryKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.associate", "request.primaryKey");
            const relatedKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.associate", "request.relatedKey");
            internalRequest.navigationProperty = request.relationshipName + "/$ref";
            internalRequest.key = primaryKey;
            internalRequest.data = { "@odata.id": `${request.relatedCollection}(${relatedKey})` };
            return this._makeRequest(internalRequest).then(() => {
                return;
            });
        };
        /**
         * Disassociate for a collection-valued navigation property.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.disassociate = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.disassociate", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "DELETE";
            internalRequest.functionName = "disassociate";
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.relationshipName, "DynamicsWebApi.disassociate", "request.relationshipName");
            const primaryKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.disassociate", "request.primaryKey");
            const relatedKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.disassociate", "request.relatedId");
            internalRequest.key = primaryKey;
            internalRequest.navigationProperty = `${request.relationshipName}(${relatedKey})/$ref`;
            return this._makeRequest(internalRequest).then(() => {
                return;
            });
        };
        /**
         * Associate for a single-valued navigation property. (1:N)
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.associateSingleValued = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.associateSingleValued", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "PUT";
            internalRequest.functionName = "associateSingleValued";
            const primaryKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.associateSingleValued", "request.primaryKey");
            const relatedKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.associateSingleValued", "request.relatedKey");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.navigationProperty, "DynamicsWebApi.associateSingleValued", "request.navigationProperty");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.relatedCollection, "DynamicsWebApi.associateSingleValued", "request.relatedcollection");
            internalRequest.navigationProperty += "/$ref";
            internalRequest.key = primaryKey;
            internalRequest.data = { "@odata.id": `${request.relatedCollection}(${relatedKey})` };
            return this._makeRequest(internalRequest).then(() => {
                return;
            });
        };
        /**
         * Removes a reference to an entity for a single-valued navigation property. (1:N)
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.disassociateSingleValued = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.disassociateSingleValued", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "DELETE";
            internalRequest.functionName = "disassociateSingleValued";
            const primaryKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.disassociateSingleValued", "request.primaryKey");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.navigationProperty, "DynamicsWebApi.disassociateSingleValued", "request.navigationProperty");
            internalRequest.navigationProperty += "/$ref";
            internalRequest.key = primaryKey;
            return this._makeRequest(internalRequest).then(() => {
                return;
            });
        };
        /**
         * Calls a Web API function
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.callFunction = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, `DynamicsWebApi.callFunction`, "request");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.functionName, `DynamicsWebApi.callFunction`, "request.functionName");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "GET";
            internalRequest.functionName = "callFunction";
            internalRequest._additionalUrl = request.functionName + Utility_1.Utility.buildFunctionParameters(request.parameters);
            internalRequest._isUnboundRequest = !internalRequest.collection;
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        /**
         * Calls a Web API action
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.callAction = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, `DynamicsWebApi.callAction`, "request");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.actionName, `DynamicsWebApi.callAction`, "request.actionName");
            const internalRequest = Utility_1.Utility.copyObject(request, ["action"]);
            internalRequest.method = "POST";
            internalRequest.functionName = "callAction";
            internalRequest._additionalUrl = request.actionName;
            internalRequest._isUnboundRequest = !internalRequest.collection;
            internalRequest.data = request.action;
            return this._makeRequest(internalRequest).then((response) => {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to create an entity definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.createEntity = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, `DynamicsWebApi.createEntity`, "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createEntity", "request.data");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.functionName = "createEntity";
            return this.create(internalRequest);
        };
        /**
         * Sends an asynchronous request to update an entity definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.updateEntity = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateEntity", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateEntity", "request.data");
            ErrorHelper_1.ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateEntity", "request.data.MetadataId");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.key = internalRequest.data.MetadataId;
            internalRequest.functionName = "updateEntity";
            internalRequest.method = "PUT";
            return this.update(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve a specific entity definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveEntity = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveEntity", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.retrieveEntity", "request.key");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.functionName = "retrieveEntity";
            return this.retrieve(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve entity definitions.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveEntities = (request) => {
            const internalRequest = !request ? {} : Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.functionName = "retrieveEntities";
            return this.retrieveMultiple(internalRequest);
        };
        /**
         * Sends an asynchronous request to create an attribute.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.createAttribute = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.createAttribute", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createAttribute", "request.data");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.createAttribute", "request.entityKey");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.functionName = "retrieveEntity";
            internalRequest.navigationProperty = "Attributes";
            internalRequest.key = request.entityKey;
            return this.create(internalRequest);
        };
        /**
         * Sends an asynchronous request to update an attribute.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.updateAttribute = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateAttribute", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateAttribute", "request.data");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.updateAttribute", "request.entityKey");
            ErrorHelper_1.ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateAttribute", "request.data.MetadataId");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateAttribute", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.navigationProperty = "Attributes";
            internalRequest.navigationPropertyKey = request.data.MetadataId;
            internalRequest.metadataAttributeType = request.castType;
            internalRequest.key = request.entityKey;
            internalRequest.functionName = "updateAttribute";
            internalRequest.method = "PUT";
            return this.update(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve attribute metadata for a specified entity definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveAttributes = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveAttributes", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.retrieveAttributes", "request.entityKey");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveAttributes", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.navigationProperty = "Attributes";
            internalRequest.metadataAttributeType = request.castType;
            internalRequest.key = request.entityKey;
            internalRequest.functionName = "retrieveAttributes";
            return this.retrieveMultiple(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve a specific attribute metadata for a specified entity definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveAttribute = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveAttributes", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.retrieveAttribute", "request.entityKey");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.attributeKey, "DynamicsWebApi.retrieveAttribute", "request.attributeKey");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveAttribute", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.navigationProperty = "Attributes";
            internalRequest.navigationPropertyKey = request.attributeKey;
            internalRequest.metadataAttributeType = request.castType;
            internalRequest.key = request.entityKey;
            internalRequest.functionName = "retrieveAttribute";
            return this.retrieve(internalRequest);
        };
        /**
         * Sends an asynchronous request to create a relationship definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.createRelationship = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.createRelationship", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createRelationship", "request.data");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "RelationshipDefinitions";
            internalRequest.functionName = "createRelationship";
            return this.create(internalRequest);
        };
        /**
         * Sends an asynchronous request to update a relationship definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.updateRelationship = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateRelationship", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateRelationship", "request.data");
            ErrorHelper_1.ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateRelationship", "request.data.MetadataId");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateRelationship", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "RelationshipDefinitions";
            internalRequest.key = request.data.MetadataId;
            internalRequest.navigationProperty = request.castType;
            internalRequest.functionName = "updateRelationship";
            internalRequest.method = "PUT";
            return this.update(internalRequest);
        };
        /**
         * Sends an asynchronous request to delete a relationship definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.deleteRelationship = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteRelationship", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.deleteRelationship", "request.key");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "RelationshipDefinitions";
            internalRequest.functionName = "deleteRelationship";
            return this.deleteRecord(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve relationship definitions.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveRelationships = (request) => {
            const internalRequest = !request ? {} : Utility_1.Utility.copyObject(request);
            internalRequest.collection = "RelationshipDefinitions";
            internalRequest.functionName = "retrieveRelationships";
            if (request) {
                if (request.castType) {
                    ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveRelationships", "request.castType");
                    internalRequest.navigationProperty = request.castType;
                }
            }
            return this.retrieveMultiple(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve a specific relationship definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveRelationship = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveRelationship", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.retrieveRelationship", "request.key");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveRelationship", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "RelationshipDefinitions";
            internalRequest.navigationProperty = request.castType;
            internalRequest.functionName = "retrieveRelationship";
            return this.retrieve(internalRequest);
        };
        /**
         * Sends an asynchronous request to create a Global Option Set definition
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.createGlobalOptionSet = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.createGlobalOptionSet", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createGlobalOptionSet", "request.data");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.functionName = "createGlobalOptionSet";
            return this.create(internalRequest);
        };
        /**
         * Sends an asynchronous request to update a Global Option Set.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.updateGlobalOptionSet = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateGlobalOptionSet", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateGlobalOptionSet", "request.data");
            ErrorHelper_1.ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateGlobalOptionSet", "request.data.MetadataId");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateGlobalOptionSet", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.key = request.data.MetadataId;
            internalRequest.functionName = "updateGlobalOptionSet";
            internalRequest.method = "PUT";
            return this.update(internalRequest);
        };
        /**
         * Sends an asynchronous request to delete a Global Option Set.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.deleteGlobalOptionSet = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteGlobalOptionSet", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.functionName = "deleteGlobalOptionSet";
            return this.deleteRecord(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve Global Option Set definitions.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveGlobalOptionSet = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveGlobalOptionSet", "request");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveGlobalOptionSet", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.navigationProperty = request.castType;
            internalRequest.functionName = "retrieveGlobalOptionSet";
            return this.retrieve(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve Global Option Set definitions.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveGlobalOptionSets = (request) => {
            const internalRequest = !request ? {} : Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.functionName = "retrieveGlobalOptionSets";
            if (request === null || request === void 0 ? void 0 : request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveGlobalOptionSets", "request.castType");
                internalRequest.navigationProperty = request.castType;
            }
            return this.retrieveMultiple(internalRequest);
        };
        /**
         * Retrieves CSDL Document Metadata
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise<string>} Unformatted and unparsed CSDL $metadata document.
         */
        this.retrieveCsdlMetadata = (request) => {
            const internalRequest = !request ? {} : Utility_1.Utility.copyObject(request);
            internalRequest.collection = "$metadata";
            internalRequest.functionName = "retrieveCsdlMetadata";
            if (request === null || request === void 0 ? void 0 : request.addAnnotations) {
                ErrorHelper_1.ErrorHelper.boolParameterCheck(request.addAnnotations, "DynamicsWebApi.retrieveCsdlMetadata", "request.addAnnotations");
                internalRequest.includeAnnotations = "*";
            }
            return this._makeRequest(internalRequest).then((response) => {
                return response.data;
            });
        };
        /**
         * Provides a search results page.
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise<SearchResponse<TValue>>} Search result
         */
        this.search = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.search", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.query, "DynamicsWebApi.search", "request.query");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.query.search, "DynamicsWebApi.search", "request.query.search");
            ErrorHelper_1.ErrorHelper.maxLengthStringParameterCheck(request.query.search, "DynamicsWebApi.search", "request.query.search", 100);
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "query";
            internalRequest.functionName = "search";
            internalRequest.method = "POST";
            internalRequest.data = internalRequest.query;
            internalRequest.apiConfig = this._config.searchApi;
            delete internalRequest.query;
            return this._makeRequest(internalRequest).then((response) => {
                return response.data;
            });
        };
        /**
         * Provides suggestions as the user enters text into a form field.
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise<SuggestResponse<TValueDocument>>} Suggestions result
         */
        this.suggest = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.suggest", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.query, "DynamicsWebApi.suggest", "request.query");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.query.search, "DynamicsWebApi.suggest", "request.query.search");
            ErrorHelper_1.ErrorHelper.maxLengthStringParameterCheck(request.query.search, "DynamicsWebApi.suggest", "request.query.search", 100);
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.functionName = internalRequest.collection = "suggest";
            internalRequest.method = "POST";
            internalRequest.data = internalRequest.query;
            internalRequest.apiConfig = this._config.searchApi;
            delete internalRequest.query;
            return this._makeRequest(internalRequest).then((response) => {
                return response.data;
            });
        };
        /**
         * Provides autocompletion of input as the user enters text into a form field.
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise<AutocompleteResponse>} Result of autocomplete
         */
        this.autocomplete = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.autocomplete", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.query, "DynamicsWebApi.autocomplete", "request.query");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.query.search, "DynamicsWebApi.autocomplete", "request.query.search");
            ErrorHelper_1.ErrorHelper.maxLengthStringParameterCheck(request.query.search, "DynamicsWebApi.autocomplete", "request.query.search", 100);
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.functionName = internalRequest.collection = "autocomplete";
            internalRequest.method = "POST";
            internalRequest.data = internalRequest.query;
            internalRequest.apiConfig = this._config.searchApi;
            delete internalRequest.query;
            return this._makeRequest(internalRequest).then((response) => {
                return response.data;
            });
        };
        /**
         * Starts a batch request.
         */
        this.startBatch = () => {
            this._isBatch = true;
            this._batchRequestId = Utility_1.Utility.generateUUID();
        };
        /**
         * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.executeBatch = (request) => {
            ErrorHelper_1.ErrorHelper.throwBatchNotStarted(this._isBatch);
            const internalRequest = !request ? {} : Utility_1.Utility.copyObject(request);
            internalRequest.collection = "$batch";
            internalRequest.method = "POST";
            internalRequest.functionName = "executeBatch";
            this._isBatch = false;
            const promise = this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
            this._batchRequestId = null;
            return promise;
        };
        /**
         * Creates a new instance of DynamicsWebApi
         *
         * @param {DWAConfig} [config] - configuration object.
         * @returns {DynamicsWebApi} The new instance of a DynamicsWebApi
         */
        this.initializeInstance = (config) => new DynamicsWebApi(config || this._config);
        this.Utility = {
            /**
             * Searches for a collection name by provided entity name in a cached entity metadata.
             * The returned collection name can be null.
             *
             * @param {string} entityName - entity name
             * @returns {string} a collection name
             */
            getCollectionName: (entityName) => RequestClient_1.RequestClient.getCollectionName(entityName),
        };
        Config_1.ConfigurationUtility.merge(this._config, config);
    }
}
exports.DynamicsWebApi = DynamicsWebApi;
//# sourceMappingURL=dynamics-web-api.js.map
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});