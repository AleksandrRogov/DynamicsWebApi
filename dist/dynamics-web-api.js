/*! dynamics-web-api v1.6.0 (c) 2019 Aleksandr Rogov */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("DynamicsWebApi", [], factory);
	else if(typeof exports === 'object')
		exports["DynamicsWebApi"] = factory();
	else
		root["DynamicsWebApi"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function throwParameterError(functionName, parameterName, type) {
    throw new Error(type
        ? functionName + " requires the " + parameterName + " parameter to be of type " + type
        : functionName + " requires the " + parameterName + " parameter.");
};

var ErrorHelper = {
    handleErrorResponse: function (req) {
        ///<summary>
        /// Private function return an Error object to the errorCallback
        ///</summary>
        ///<param name="req" type="XMLHttpRequest">
        /// The XMLHttpRequest response that returned an error.
        ///</param>
        ///<returns>Error</returns>
        throw new Error("Error: " +
            req.status + ": " +
            req.message);
    },

    parameterCheck: function (parameter, functionName, parameterName, type) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="Object">
        /// The parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if ((typeof parameter === "undefined") || parameter === null || parameter == "") {
            throwParameterError(functionName, parameterName, type);
        }
    },

    stringParameterCheck: function (parameter, functionName, parameterName) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="String">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof parameter != "string") {
            throwParameterError(functionName, parameterName, "String");
        }
    },

    arrayParameterCheck: function (parameter, functionName, parameterName) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="String">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (parameter.constructor !== Array) {
            throwParameterError(functionName, parameterName, "Array");
        }
    },

    stringOrArrayParameterCheck: function (parameter, functionName, parameterName) {
        if (parameter.constructor !== Array && typeof parameter != "string") {
            throwParameterError(functionName, parameterName, "String or Array");
        }
    },

    numberParameterCheck: function (parameter, functionName, parameterName) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="Number">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof parameter != "number") {
            if (typeof parameter === "string" && parameter) {
                if (!isNaN(parseInt(parameter))) {
                    return;
                }
            }
            throwParameterError(functionName, parameterName, "Number");
        }
    },

    boolParameterCheck: function (parameter, functionName, parameterName) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="Boolean">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof parameter != "boolean") {
            throwParameterError(functionName, parameterName, "Boolean");
        }
    },

    guidParameterCheck: function (parameter, functionName, parameterName) {
        ///<summary>
        /// Private function used to check whether required parameter is a valid GUID
        ///</summary>
        ///<param name="parameter" type="String">
        /// The GUID parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        /// <returns type="String" />

        try {
            var match = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter)[0];

            return match;
        }
        catch (error) {
            throwParameterError(functionName, parameterName, "GUID String");
        }
    },

    keyParameterCheck: function (parameter, functionName, parameterName) {

        try {
            ErrorHelper.stringParameterCheck(parameter, functionName, parameterName);

            //check if the param is a guid
            var match = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter);
            if (match) {
                return match[0];
            }

            //check the alternate key
            var alternateKeys = parameter.split(',');

            if (alternateKeys.length) {
                for (var i = 0; i < alternateKeys.length; i++) {
                    alternateKeys[i] = alternateKeys[i].trim().replace('"', "'");
                    /^[\w\d\_]+\=('[^\'\r\n]+'|\d+)$/i.exec(alternateKeys[i])[0];
                }
            }

            return alternateKeys.join(',');
        }
        catch (error) {
            throwParameterError(functionName, parameterName, "String representing GUID or Alternate Key");
        }
    },

    callbackParameterCheck: function (callbackParameter, functionName, parameterName) {
        ///<summary>
        /// Private function used to check whether required callback parameters are functions
        ///</summary>
        ///<param name="callbackParameter" type="Function">
        /// The callback parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof callbackParameter != "function") {
            throwParameterError(functionName, parameterName, "Function");
        }
    },

    batchIncompatible: function (functionName, isBatch) {
        if (isBatch) {
            isBatch = false;
            throw new Error(functionName + " cannot be used in a BATCH request.");
        }
    },

    batchNotStarted: function (isBatch) {
        if (!isBatch) {
            throw new Error("Batch operation has not been started. Please call a DynamicsWebApi.startBatch() function prior to calling DynamicsWebApi.executeBatch() to perform a batch request correctly.");
        }
    },

    handleHttpError: function (parsedError, parameters) {
        var error = new Error();

        Object.keys(parsedError).forEach(function(k) {
            error[k] = parsedError[k];
        });

        if (parameters) {
            Object.keys(parameters).forEach(function (k) {
                error[k] = parameters[k];
            });
        }

        return error;
    }
};

module.exports = ErrorHelper;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var DWA = {
    Types: {
        ResponseBase: function () {
            /// <field name='oDataContext' type='String'>The context URL (see [OData-Protocol]) for the payload.</field>  
            this.oDataContext = "";
        },
        Response: function () {
            /// <field name='value' type='Object'>Response value returned from the request.</field>  
            DWA.Types.ResponseBase.call(this);

            this.value = {};
        },
        ReferenceResponse: function () {
            /// <field name='id' type='String'>A String representing the GUID value of the record.</field>  
            /// <field name='collection' type='String'>The name of the Entity Collection that the record belongs to.</field>  
            DWA.Types.ResponseBase.call(this);

            this.id = "";
            this.collection = "";
        },
        MultipleResponse: function () {
            /// <field name='oDataNextLink' type='String'>The link to the next page.</field>  
            /// <field name='oDataCount' type='Number'>The count of the records.</field>  
            /// <field name='value' type='Array'>The array of the records returned from the request.</field>  
            DWA.Types.ResponseBase.call(this);

            this.oDataNextLink = "";
            this.oDataCount = 0;
            this.value = [];
        },
        FetchXmlResponse: function () {
            /// <field name='value' type='Array'>The array of the records returned from the request.</field>  
            /// <field name='pagingInfo' type='Object'>Paging Information</field>  
            DWA.Types.ResponseBase.call(this);

            this.value = [];
            this.PagingInfo = {
                /// <param name='cookie' type='String'>Paging Cookie</param>  
                /// <param name='number' type='Number'>Page Number</param>  
                cookie: "",
                page: 0,
                nextPage: 1
            }
        }
    },
    Prefer: {
        /// <field type="String">return=representation</field>
        ReturnRepresentation: "return=representation",
        Annotations: {
            /// <field type="String">Microsoft.Dynamics.CRM.associatednavigationproperty</field>
            AssociatedNavigationProperty: 'Microsoft.Dynamics.CRM.associatednavigationproperty',
            /// <field type="String">Microsoft.Dynamics.CRM.lookuplogicalname</field>
            LookupLogicalName: 'Microsoft.Dynamics.CRM.lookuplogicalname',
            /// <field type="String">*</field>
            All: '*',
            /// <field type="String">OData.Community.Display.V1.FormattedValue</field>
            FormattedValue: 'OData.Community.Display.V1.FormattedValue',
            /// <field type="String">Microsoft.Dynamics.CRM.fetchxmlpagingcookie</field>
            FetchXmlPagingCookie: 'Microsoft.Dynamics.CRM.fetchxmlpagingcookie'
        }
    }
}

module.exports = DWA;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

function isNull(value) {
    return typeof value === "undefined" || value == null;
}

//https://stackoverflow.com/a/8809472
function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function getXrmContext() {
    if (typeof GetGlobalContext !== 'undefined') {
        return GetGlobalContext();
    }
    else {
        if (typeof Xrm !== 'undefined') {
            //d365 v.9.0
            if (!isNull(Xrm.Utility) && !isNull(Xrm.Utility.getGlobalContext)) {
                return Xrm.Utility.getGlobalContext();
            }
            else if (!isNull(Xrm.Page) && !isNull(Xrm.Page.context)) {
                return Xrm.Page.context;
            }
        }
    }

    throw new Error('Xrm Context is not available. In most cases, it can be resolved by adding a reference to a ClientGlobalContext.js.aspx. Please refer to MSDN documentation for more details.');
}

function getClientUrl() {
    var context = getXrmContext();

    var clientUrl = context.getClientUrl();

    if (clientUrl.match(/\/$/)) {
        clientUrl = clientUrl.substring(0, clientUrl.length - 1);
    }
    return clientUrl;
}

function initWebApiUrl(version) {
    return getClientUrl() + '/api/data/v' + version + '/';
}

function getXrmInternal() {
    //todo: Xrm.Internal namespace is not supported
    return typeof Xrm !== "undefined" ? Xrm.Internal : null;
}

function getXrmUtility() {
    return typeof Xrm !== "undefined" ? Xrm.Utility : null;
}

var Utility = {
    /**
     * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
     *
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @returns {string}
     */
    buildFunctionParameters: __webpack_require__(13),

    /**
     * Parses a paging cookie returned in response
     *
     * @param {string} pageCookies - Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.
     * @param {number} currentPageNumber - A current page number. Fix empty paging-cookie for complex fetch xmls.
     * @returns {{cookie: "", number: 0, next: 1}}
     */
    getFetchXmlPagingCookie: __webpack_require__(16),

    /**
     * Converts a response to a reference object
     *
     * @param {Object} responseData - Response object
     * @returns {ReferenceObject}
     */
    convertToReferenceObject: __webpack_require__(15),

    /**
     * Checks whether the value is JS Null.
     * @param {Object} value
     * @returns {boolean}
     */
    isNull: isNull,

    generateUUID: generateUUID,

    getXrmContext: getXrmContext,

    getXrmInternal: getXrmInternal,

    getXrmUtility: getXrmUtility,

    getClientUrl: getClientUrl,

    initWebApiUrl: initWebApiUrl
};

module.exports = Utility;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

String.prototype.endsWith = function (searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.lastIndexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
};

String.prototype.startsWith = function (searchString, position) {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var Utility = __webpack_require__(2);
var RequestConverter = __webpack_require__(12);
var BatchConverter = __webpack_require__(11);

var _entityNames;

/**
 * Searches for a collection name by provided entity name in a cached entity metadata.
 * The returned collection name can be null.
 *
 * @param {string} entityName - entity name
 * @returns {string} - a collection name
 */
function findCollectionName(entityName) {
    var xrmInternal = Utility.getXrmInternal();

    if (!Utility.isNull(xrmInternal) && typeof xrmInternal.getEntitySetName === "function") {
        return xrmInternal.getEntitySetName(entityName) || entityName;
    }

    var collectionName = null;

    if (!Utility.isNull(_entityNames)) {
        collectionName = _entityNames[entityName];
        if (Utility.isNull(collectionName)) {
            for (var key in _entityNames) {
                if (_entityNames[key] === entityName) {
                    return entityName;
                }
            }
        }
    }

    return collectionName;
}

function setStandardHeaders(additionalHeaders) {
    additionalHeaders["Accept"] = "application/json";
    additionalHeaders["OData-MaxVersion"] = "4.0";
    additionalHeaders["OData-Version"] = "4.0";
    additionalHeaders['Content-Type'] = 'application/json; charset=utf-8';

    return additionalHeaders;
}

function stringifyData(data, config) {
    var stringifiedData;
    if (data) {
        stringifiedData = JSON.stringify(data, function (key, value) {
            /// <param name="key" type="String">Description</param>
            if (key.endsWith('@odata.bind') || key.endsWith('@odata.id')) {
                if (typeof value === 'string' && !value.startsWith('$')) {
                    //remove brackets in guid
                    if (/\(\{[\w\d-]+\}\)/g.test(value)) {
                        value = value.replace(/(.+)\(\{([\w\d-]+)\}\)/g, '$1($2)');
                    }

                    if (config.useEntityNames) {
                        //replace entity name with collection name
                        var regularExpression = /([\w_]+)(\([\d\w-]+\))$/;
                        var valueParts = regularExpression.exec(value);
                        if (valueParts.length > 2) {
                            var collectionName = findCollectionName(valueParts[1]);

                            if (!Utility.isNull(collectionName)) {
                                value = value.replace(regularExpression, collectionName + '$2');
                            }
                        }
                    }

                    if (!value.startsWith(config.webApiUrl)) {
                        //add full web api url if it's not set
                        if (key.endsWith('@odata.bind')) {
                            if (!value.startsWith('/')) {
                                value = '/' + value;
                            }
                        }
                        else {
                            value = config.webApiUrl + value.replace(/^\//, '');
                        }
                    }
                }
            }
            else
                if (key.startsWith('oData') ||
                    key.endsWith('_Formatted') ||
                    key.endsWith('_NavigationProperty') ||
                    key.endsWith('_LogicalName')) {
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

var batchRequestCollection = [];
var responseParseParams = [];

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
function sendRequest(method, path, config, data, additionalHeaders, responseParams, successCallback, errorCallback, isBatch, isAsync) {

    additionalHeaders = additionalHeaders || {};
    responseParams = responseParams || {};

    //add response parameters to parse
    responseParseParams.push(responseParams);

    //stringify passed data
    var stringifiedData = stringifyData(data, config);

    if (isBatch) {
        batchRequestCollection.push({
            method: method, path: path, config: config, data: stringifiedData, headers: additionalHeaders
        });
        return;
    }

    if (path === '$batch') {
        var batchResult = BatchConverter.convertToBatch(batchRequestCollection);

        stringifiedData = batchResult.body;

        //clear an array of requests
        batchRequestCollection.length = 0;

        additionalHeaders = setStandardHeaders(additionalHeaders);
        additionalHeaders['Content-Type'] = 'multipart/mixed;boundary=' + batchResult.boundary;
    }
    else {
        additionalHeaders = setStandardHeaders(additionalHeaders);
    }

    responseParams.convertedToBatch = false;

    //if the URL contains more characters than max possible limit, convert the request to a batch request
    if (path.length > 2000) {
        var batchBoundary = 'dwa_batch_' + Utility.generateUUID();

        var batchBody = [];
        batchBody.push('--' + batchBoundary);
        batchBody.push('Content-Type: application/http');
        batchBody.push('Content-Transfer-Encoding: binary\n');
        batchBody.push(method + ' ' + config.webApiUrl + path + ' HTTP/1.1');

        for (var key in additionalHeaders) {
            if (key === 'Authorization')
                continue;

            batchBody.push(key + ': ' + additionalHeaders[key]);

            //authorization header is an exception. bug #27
            delete additionalHeaders[key];
        }

        batchBody.push('\n--' + batchBoundary + '--');

        stringifiedData = batchBody.join('\n');

        additionalHeaders = setStandardHeaders(additionalHeaders);
        additionalHeaders['Content-Type'] = 'multipart/mixed;boundary=' + batchBoundary;
        path = '$batch';
        method = 'POST';

        responseParams.convertedToBatch = true;
    }

    if (config.impersonate && !additionalHeaders['MSCRMCallerID']) {
        additionalHeaders['MSCRMCallerID'] = config.impersonate;
    }

    var executeRequest;

        executeRequest = __webpack_require__(10);


    var sendInternalRequest = function (token) {
        if (token) {
            if (!additionalHeaders) {
                additionalHeaders = {};
            }
            additionalHeaders['Authorization'] = 'Bearer ' +
                (token.hasOwnProperty('accessToken') ?
                    token.accessToken :
                    token);
        }

        executeRequest({
            method: method,
            uri: config.webApiUrl + path,
            data: stringifiedData,
            additionalHeaders: additionalHeaders,
            responseParams: responseParseParams,
            successCallback: successCallback,
            errorCallback: errorCallback,
            isAsync: isAsync,
            timeout: config.timeout
        });
    };

    //call a token refresh callback only if it is set and there is no "Authorization" header set yet
    if (config.onTokenRefresh && (!additionalHeaders || (additionalHeaders && !additionalHeaders['Authorization']))) {
        config.onTokenRefresh(sendInternalRequest);
    }
    else {
        sendInternalRequest();
    }
}

function _getEntityNames(entityName, config, successCallback, errorCallback) {

    var xrmUtility = Utility.getXrmUtility();

    //try using Xrm.Utility.getEntityMetadata first (because D365 caches metadata)
    if (!Utility.isNull(xrmUtility) && typeof xrmUtility.getEntityMetadata === "function") {
        xrmUtility.getEntityMetadata(entityName).then(function (response) {
            successCallback(response.EntitySetName);
        }, errorCallback);
    }
    else {
        //make a web api call for Node.js apps
        var resolve = function (result) {
            _entityNames = {};
            for (var i = 0; i < result.data.value.length; i++) {
                _entityNames[result.data.value[i].LogicalName] = result.data.value[i].EntitySetName;
            }

            successCallback(findCollectionName(entityName));
        };

        var reject = function (error) {
            errorCallback({ message: 'Unable to fetch EntityDefinitions. Error: ' + error.message });
        };

        var request = RequestConverter.convertRequest({
            collection: 'EntityDefinitions',
            select: ['EntitySetName', 'LogicalName'],
            noCache: true
        }, 'retrieveMultiple', config);

        sendRequest('GET', request.url, config, null, request.headers, null, resolve, reject, false, request.async);
    }
}

function _isEntityNameException(entityName) {
    var exceptions = [
        'EntityDefinitions', '$metadata', 'RelationshipDefinitions',
        'GlobalOptionSetDefinitions', 'ManagedPropertyDefinitions'];

    return exceptions.indexOf(entityName) > -1;
}

function _getCollectionName(entityName, config, successCallback, errorCallback) {

    if (_isEntityNameException(entityName) || Utility.isNull(entityName)) {
        successCallback(entityName);
        return;
    }

    entityName = entityName.toLowerCase();

    if (!config.useEntityNames) {
        successCallback(entityName);
        return;
    }

    try {
        var collectionName = findCollectionName(entityName);

        if (Utility.isNull(collectionName)) {
            _getEntityNames(entityName, config, successCallback, errorCallback);
        }
        else {
            successCallback(collectionName);
        }
    }
    catch (error) {
        errorCallback({ message: 'Unable to fetch Collection Names. Error: ' + error.message });
    }
}

function makeRequest(method, request, functionName, config, responseParams, resolve, reject) {
    var successCallback = function (collectionName) {
        request.collection = collectionName;
        var result = RequestConverter.convertRequest(request, functionName, config);
        sendRequest(method, result.url, config, request.data || request.entity, result.headers, responseParams, resolve, reject, request.isBatch, result.async);
    };
    _getCollectionName(request.collection, config, successCallback, reject);
}

module.exports = {
    sendRequest: sendRequest,
    makeRequest: makeRequest,
    getCollectionName: findCollectionName,

};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DWA = __webpack_require__(1);
var Utility = __webpack_require__(2);
var ErrorHelper = __webpack_require__(0);
var Request = __webpack_require__(4);

//string es6 polyfill
if (!String.prototype.endsWith || !String.prototype.startsWith) {
    __webpack_require__(3);
}



/**
 * Configuration object for DynamicsWebApi
 * @typedef {object} DWAConfig
 * @property {string} webApiUrl - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
 * @property {string} webApiVersion - The version of Web API to use, for example: "8.1"
 * @property {string} impersonate - A String representing a URL to Web API (webApiVersion not required if webApiUrl specified) [not used inside of CRM]
 * @property {Function} onTokenRefresh - A function that is called when a security token needs to be refreshed.
 * @property {string} includeAnnotations - Sets Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types.
 * @property {string} maxPageSize - Sets the odata.maxpagesize preference value to request the number of entities returned in the response.
 * @property {boolean} returnRepresentation - Sets Prefer header request with value "return=representation". Use this property to return just created or updated entity in a single request.
 * @property {boolean} useEntityNames - Indicates whether to use Entity Logical Names instead of Collection Logical Names.
*/

/**
 * Dynamics Web Api Request
 * @typedef {Object} DWARequest
 * @property {boolean} async - XHR requests only! Indicates whether the requests should be made synchronously or asynchronously. Default value is 'true' (asynchronously).
 * @property {string} collection - The name of the Entity Collection or Entity Logical name.
 * @property {string} id - A String representing the Primary Key (GUID) of the record.
 * @property {Array} select - An Array (of Strings) representing the $select OData System Query Option to control which attributes will be returned.
 * @property {Array} expand - An array of Expand Objects (described below the table) representing the $expand OData System Query Option value to control which related records are also returned.
 * @property {string} key - A String representing collection record's Primary Key (GUID) or Alternate Key(s).
 * @property {string} filter - Use the $filter system query option to set criteria for which entities will be returned.
 * @property {number} maxPageSize - Sets the odata.maxpagesize preference value to request the number of entities returned in the response.
 * @property {boolean} count - Boolean that sets the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000 (per page). Do not use $top with $count!
 * @property {number} top - Limit the number of results returned by using the $top system query option. Do not use $top with $count!
 * @property {Array} orderBy - An Array (of Strings) representing the order in which items are returned using the $orderby system query option. Use the asc or desc suffix to specify ascending or descending order respectively. The default is ascending if the suffix isn't applied.
 * @property {string} includeAnnotations - Sets Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types.
 * @property {string} ifmatch - Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.
 * @property {string} ifnonematch - Sets If-None-Match header value that enables to use conditional retrieval in applicable requests.
 * @property {boolean} returnRepresentation - Sets Prefer header request with value "return=representation". Use this property to return just created or updated entity in a single request.
 * @property {Object} entity - A JavaScript object with properties corresponding to the logical name of entity attributes (exceptions are lookups and single-valued navigation properties).
 * @property {string} impersonate - Impersonates the user. A String representing the GUID value for the Dynamics 365 system user id.
 * @property {string} navigationProperty - A String representing the name of a single-valued navigation property. Useful when needed to retrieve information about a related record in a single request.
 * @property {string} navigationPropertyKey - v.1.4.3+ A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata).
 * @property {string} metadataAttributeType - v.1.4.3+ Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata).
 * @property {boolean} noCache - If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'. Default value is 'false'.
 * @property {string} savedQuery - A String representing the GUID value of the saved query.
 * @property {string} userQuery - A String representing the GUID value of the user query.
 * @property {boolean} mergeLabels - If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false'.
 * @property {boolean} isBatch - If set to 'true', DynamicsWebApi treats a request as a part of a batch request. Call ExecuteBatch to execute all requests in a batch. Default value is 'false'.
 * @property {string} contentId - BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set.
 * @property {boolean} trackChanges - Preference header 'odata.track-changes' is used to request that a delta link be returned which can subsequently be used to retrieve entity changes.
 * @property {string} deltaLink - Delta link can be used to retrieve entity changes. Important! Change Tracking must be enabled for the entity.
 */

/**
 * Constructor.
 * @constructor
 * @param {DWAConfig} [config] - configuration object
 * @example
   *var dynamicsWebApi = new DynamicsWebApi();
  * @example
   *var dynamicsWebApi = new DynamicsWebApi({ webApiVersion: '9.0' });
  * @example
   *var dynamicsWebApi = new DynamicsWebApi({
   *    webApiUrl: 'https:/myorg.api.crm.dynamics.com/api/data/v9.0/',
   *    includeAnnotations: 'OData.Community.Display.V1.FormattedValue'
   *});
 */
function DynamicsWebApi(config) {

    var _internalConfig = {
        webApiVersion: "8.0",
        webApiUrl: null,
        impersonate: null,
        onTokenRefresh: null,
        includeAnnotations: null,
        maxPageSize: null,
        returnRepresentation: null
    };

    var _isBatch = false;

    if (!config) {
        config = _internalConfig;
    }

    /**
     * Sets the configuration parameters for DynamicsWebApi helper.
     *
     * @param {DWAConfig} config - configuration object
     * @example
       dynamicsWebApi.setConfig({ webApiVersion: '9.0' });
     */
    this.setConfig = function (config) {

        if (config.webApiVersion) {
            ErrorHelper.stringParameterCheck(config.webApiVersion, "DynamicsWebApi.setConfig", "config.webApiVersion");
            _internalConfig.webApiVersion = config.webApiVersion;
        }

        if (config.webApiUrl) {
            ErrorHelper.stringParameterCheck(config.webApiUrl, "DynamicsWebApi.setConfig", "config.webApiUrl");
            _internalConfig.webApiUrl = config.webApiUrl;
        } else {
            _internalConfig.webApiUrl = Utility.initWebApiUrl(_internalConfig.webApiVersion);
        }

        if (config.impersonate) {
            _internalConfig.impersonate = ErrorHelper.guidParameterCheck(config.impersonate, "DynamicsWebApi.setConfig", "config.impersonate");
        }

        if (config.onTokenRefresh) {
            ErrorHelper.callbackParameterCheck(config.onTokenRefresh, "DynamicsWebApi.setConfig", "config.onTokenRefresh");
            _internalConfig.onTokenRefresh = config.onTokenRefresh;
        }

        if (config.includeAnnotations) {
            ErrorHelper.stringParameterCheck(config.includeAnnotations, "DynamicsWebApi.setConfig", "config.includeAnnotations");
            _internalConfig.includeAnnotations = config.includeAnnotations;
        }

        if (config.timeout) {
            ErrorHelper.numberParameterCheck(config.timeout, "DynamicsWebApi.setConfig", "config.timeout");
            _internalConfig.timeout = config.timeout;
        }

        if (config.maxPageSize) {
            ErrorHelper.numberParameterCheck(config.maxPageSize, "DynamicsWebApi.setConfig", "config.maxPageSize");
            _internalConfig.maxPageSize = config.maxPageSize;
        }

        if (config.returnRepresentation) {
            ErrorHelper.boolParameterCheck(config.returnRepresentation, "DynamicsWebApi.setConfig", "config.returnRepresentation");
            _internalConfig.returnRepresentation = config.returnRepresentation;
        }

        if (config.useEntityNames) {
            ErrorHelper.boolParameterCheck(config.useEntityNames, 'DynamicsWebApi.setConfig', 'config.useEntityNames');
            _internalConfig.useEntityNames = config.useEntityNames;
        }
    };

    this.setConfig(config);

    var _makeRequest = function (method, request, functionName, responseParams) {
        request.isBatch = _isBatch;
        return new Promise(function (resolve, reject) {
            Request.makeRequest(method, request, functionName, _internalConfig, responseParams, resolve, reject);
        });
    };

    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     * @example
        *var lead = {
        *    subject: "Test WebAPI",
        *    firstname: "Test",
        *    lastname: "WebAPI",
        *    jobtitle: "Title"
        *};
        *
        *var request = {
        *    entity: lead,
        *    collection: "leads",
        *    returnRepresentation: true
        *}
        *
        *dynamicsWebApi.createRequest(request).then(function (response) {
        *}).catch(function (error) {
        *});
     */
    this.createRequest = function (request) {
        ErrorHelper.parameterCheck(request, 'DynamicsWebApi.create', 'request');

        return _makeRequest('POST', request, 'create')
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {Object} object - A JavaScript object valid for create operations.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string|Array} [prefer] - Sets a Prefer header value. For example: ['retrun=representation', 'odata.include-annotations="*"']
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     * @example
        *var lead = {
        *    subject: "Test WebAPI",
        *    firstname: "Test",
        *    lastname: "WebAPI",
        *    jobtitle: "Title"
        *};
        *
        *dynamicsWebApi.create(lead, "leads").then(function (id) {
        *}).catch(function (error) {
        *});
     */
    this.create = function (object, collection, prefer, select) {
        ErrorHelper.parameterCheck(object, "DynamicsWebApi.create", "object");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.create", "collection");

        if (prefer) {
            ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.create", "prefer");
        }

        if (select) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.create", "select");
        }

        var request = {
            collection: collection,
            select: select,
            prefer: prefer,
            entity: object
        };

        return this.createRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     * @example
        *var request = {
        *    key: '7d577253-3ef0-4a0a-bb7f-8335c2596e70',
        *    collection: "leads",
        *    select: ["fullname", "subject"],
        *    ifnonematch: 'W/"468026"',
        *    includeAnnotations: "OData.Community.Display.V1.FormattedValue"
        *};
        *
        *dynamicsWebApi.retrieveRequest(request).then(function (response) {
        *
        *}).catch(function (error) {
        *
        *});
     */
    this.retrieveRequest = function (request) {
        ErrorHelper.parameterCheck(request, 'DynamicsWebApi.retrieve', 'request');

        //copy locally
        var isRef = request.select != null && request.select.length === 1 && request.select[0].endsWith("/$ref");
        return _makeRequest('GET', request, 'retrieve', { isRef: isRef }).then(function (response) {
            return response.data;
        });
    };

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {string} key - A String representing the GUID value or Aternate Key for the record to retrieve.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieve = function (key, collection, select, expand) {

        ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.retrieve", "key");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.retrieve", "key");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.retrieve", "collection");

        if (select && select.length) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.retrieve", "select");
        }

        if (expand && expand.length) {
            ErrorHelper.stringOrArrayParameterCheck(expand, "DynamicsWebApi.retrieve", "expand");
        }

        var request = {
            collection: collection,
            key: key,
            select: select,
            expand: expand
        };

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    this.updateRequest = function (request) {

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.update", "request");

        if (request.ifmatch == null) {
            request.ifmatch = '*'; //to prevent upsert
        }

        //Metadata definitions, cannot be updated using "PATCH" method
        var method = /EntityDefinitions|RelationshipDefinitions|GlobalOptionSetDefinitions/.test(request.collection)
            ? 'PUT' : 'PATCH';

        //copy locally
        var ifmatch = request.ifmatch;
        return _makeRequest(method, request, 'update', { valueIfEmpty: true })
            .then(function (response) {
                return response.data;
            }).catch(function (error) {
                if (ifmatch && error.status === 412) {
                    //precondition failed - not updated
                    return false;
                }
                //rethrow error otherwise
                throw error;
            });
    };

    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key for the record to update.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {string} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.update = function (key, collection, object, prefer, select) {

        ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.update", "key");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.update", "key");
        ErrorHelper.parameterCheck(object, "DynamicsWebApi.update", "object");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.update", "collection");

        if (prefer) {
            ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.update", "prefer");
        }

        if (select) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.update", "select");
        }

        var request = {
            collection: collection,
            key: key,
            select: select,
            prefer: prefer,
            entity: object
        };

        return this.updateRequest(request);
    };

    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key for the record to update.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Object} keyValuePair - keyValuePair object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"}
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.updateSingleProperty = function (key, collection, keyValuePair, prefer, select) {

        ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.updateSingleProperty", "key");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.updateSingleProperty", "key");
        ErrorHelper.parameterCheck(keyValuePair, "DynamicsWebApi.updateSingleProperty", "keyValuePair");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.updateSingleProperty", "collection");

        var field = Object.keys(keyValuePair)[0];
        var fieldValue = keyValuePair[field];

        if (prefer) {
            ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.updateSingleProperty", "prefer");
        }

        if (select) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.updateSingleProperty", "select");
        }

        var request = {
            collection: collection,
            key: key,
            select: select,
            prefer: prefer,
            navigationProperty: field,
            data: { value: fieldValue }
        };

        return _makeRequest('PUT', request, 'updateSingleProperty')
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    this.deleteRequest = function (request) {

        ErrorHelper.parameterCheck(request, 'DynamicsWebApi.delete', 'request');

        //copy locally
        var ifmatch = request.ifmatch;
        return _makeRequest('DELETE', request, 'delete', { valueIfEmpty: true }).then(function (response) {
            return response.data;
        }).catch(function (error) {
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
     * Sends an asynchronous request to delete a record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key for the record to delete.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} [propertyName] - The name of the property which needs to be emptied. Instead of removing a whole record only the specified property will be cleared.
     * @returns {Promise} D365 Web Api result
     */
    this.deleteRecord = function (key, collection, propertyName) {
        ErrorHelper.stringParameterCheck(collection, 'DynamicsWebApi.deleteRecord', 'collection');

        if (propertyName != null)
            ErrorHelper.stringParameterCheck(propertyName, 'DynamicsWebApi.deleteRecord', 'propertyName');

        var request = {
            navigationProperty: propertyName,
            collection: collection,
            key: key
        };

        return _makeRequest('DELETE', request, 'deleteRecord').then(function () {
            return;
        });
    };

    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    this.upsertRequest = function (request) {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.upsert", "request");

        //copy locally
        var ifnonematch = request.ifnonematch;
        var ifmatch = request.ifmatch;
        return _makeRequest("PATCH", request, 'upsert')
            .then(function (response) {
                return response.data;
            }).catch(function (error) {
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

    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key for the record to upsert.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.upsert = function (key, collection, object, prefer, select) {

        ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.upsert", "key");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.upsert", "key");

        ErrorHelper.parameterCheck(object, "DynamicsWebApi.upsert", "object");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.upsert", "collection");

        if (prefer) {
            ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.upsert", "prefer");
        }

        if (select) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.upsert", "select");
        }

        var request = {
            collection: collection,
            key: key,
            select: select,
            prefer: prefer,
            entity: object
        };

        return this.upsertRequest(request);
    };

    var retrieveMultipleRequest = function (request, nextPageLink) {

        if (nextPageLink) {
            ErrorHelper.stringParameterCheck(nextPageLink, 'DynamicsWebApi.retrieveMultiple', 'nextPageLink');
            request.url = nextPageLink;
        }

        return _makeRequest("GET", request, 'retrieveMultiple')
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveMultipleRequest = retrieveMultipleRequest;

    var _retrieveAllRequest = function (request, nextPageLink, records) {
        records = records || [];

        return retrieveMultipleRequest(request, nextPageLink).then(function (response) {
            records = records.concat(response.value);

            var pageLink = response.oDataNextLink;

            if (pageLink) {
                return _retrieveAllRequest(request, pageLink, records);
            }

            var result = { value: records };

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
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveAllRequest = function (request) {
        ErrorHelper.batchIncompatible('DynamicsWebApi.retrieveAllRequest', _isBatch);
        return _retrieveAllRequest(request);
    };

    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.count = function (collection, filter) {
        var request = {
            collection: collection
        };

        if (filter == null || (filter != null && !filter.length)) {
            request.navigationProperty = '$count';
        }
        else {
            request.filter = filter;
            request.count = true;
        }

        //if filter has not been specified then simplify the request
        return _makeRequest('GET', request, 'count', { toCount: request.count })
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Sends an asynchronous request to count records. Returns: Number
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.countAll = function (collection, filter, select) {
        ErrorHelper.batchIncompatible('DynamicsWebApi.countAll', _isBatch);
        return _retrieveAllRequest({
            collection: collection,
            filter: filter,
            select: select
        })
            .then(function (response) {
                return response
                    ? (response.value ? response.value.length : 0)
                    : 0;
            });
    };

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveMultiple = function (collection, select, filter, nextPageLink) {
        return this.retrieveMultipleRequest({
            collection: collection,
            select: select,
            filter: filter
        }, nextPageLink);
    };

    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveAll = function (collection, select, filter) {
        ErrorHelper.batchIncompatible('DynamicsWebApi.retrieveAll', _isBatch);
        return _retrieveAllRequest({
            collection: collection,
            select: select,
            filter: filter
        });
    };

    var executeFetchXml = function (collection, fetchXml, includeAnnotations, pageNumber, pagingCookie, impersonateUserId) {

        ErrorHelper.stringParameterCheck(fetchXml, "DynamicsWebApi.executeFetchXml", "fetchXml");

        pageNumber = pageNumber || 1;

        ErrorHelper.numberParameterCheck(pageNumber, "DynamicsWebApi.executeFetchXml", "pageNumber");
        var replacementString = '$1 page="' + pageNumber + '"';

        if (pagingCookie != null) {
            ErrorHelper.stringParameterCheck(pagingCookie, "DynamicsWebApi.executeFetchXml", "pagingCookie");
            replacementString += ' paging-cookie="' + pagingCookie + '"';
        }

        //add page number and paging cookie to fetch xml
        fetchXml = fetchXml.replace(/^(<fetch)/, replacementString);

        var request = {
            collection: collection,
            includeAnnotations: includeAnnotations,
            impersonate: impersonateUserId,
            fetchXml: fetchXml
        };

        return _makeRequest("GET", request, 'executeFetchXml', { pageNumber: pageNumber })
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {number} [pageNumber] - Page number.
     * @param {string} [pagingCookie] - Paging cookie. For retrieving the first page, pagingCookie should be null.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.fetch = executeFetchXml;

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {number} [pageNumber] - Page number.
     * @param {string} [pagingCookie] - Paging cookie. For retrieving the first page, pagingCookie should be null.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.executeFetchXml = executeFetchXml;

    var _executeFetchXmlAll = function (collection, fetchXml, includeAnnotations, pageNumber, pagingCookie, impersonateUserId, records) {
        records = records || [];

        return executeFetchXml(collection, fetchXml, includeAnnotations, pageNumber, pagingCookie, impersonateUserId, records).then(function (response) {
            records = records.concat(response.value);

            if (response.PagingInfo) {
                return _executeFetchXmlAll(collection, fetchXml, includeAnnotations, response.PagingInfo.nextPage, response.PagingInfo.cookie, impersonateUserId, records);
            }

            return { value: records };
        });
    };

    var innerExecuteFetchXmlAll = function (collection, fetchXml, includeAnnotations, impersonateUserId) {
        ErrorHelper.batchIncompatible('DynamicsWebApi.executeFetchXmlAll', _isBatch);
        return _executeFetchXmlAll(collection, fetchXml, includeAnnotations, null, null, impersonateUserId);
    };

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.fetchAll = innerExecuteFetchXmlAll;

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.executeFetchXmlAll = innerExecuteFetchXmlAll;

    /**
     * Associate for a collection-valued navigation property. (1:N or N:N)
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} primaryKey - Primary entity record id.
     * @param {string} relationshipName - Relationship name.
     * @param {string} relatedCollection - Related name of the Entity Collection or Entity Logical name.
     * @param {string} relatedKey - Related entity record id.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.associate = function (collection, primaryKey, relationshipName, relatedCollection, relatedKey, impersonateUserId) {
        ErrorHelper.stringParameterCheck(relatedCollection, "DynamicsWebApi.associate", "relatedcollection");
        ErrorHelper.stringParameterCheck(relationshipName, "DynamicsWebApi.associate", "relationshipName");
        primaryKey = ErrorHelper.keyParameterCheck(primaryKey, "DynamicsWebApi.associate", "primaryKey");
        relatedKey = ErrorHelper.keyParameterCheck(relatedKey, "DynamicsWebApi.associate", "relatedKey");

        var request = {
            _additionalUrl: relationshipName + '/$ref',
            collection: collection,
            key: primaryKey,
            impersonate: impersonateUserId,
            data: { "@odata.id": relatedCollection + "(" + relatedKey + ")" }
        };

        return _makeRequest("POST", request, 'associate')
            .then(function () { });
    };

    /**
     * Disassociate for a collection-valued navigation property.
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} primaryKey - Primary entity record id.
     * @param {string} relationshipName - Relationship name.
     * @param {string} relatedKey - Related entity record id.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.disassociate = function (collection, primaryKey, relationshipName, relatedKey, impersonateUserId) {
        ErrorHelper.stringParameterCheck(relationshipName, "DynamicsWebApi.disassociate", "relationshipName");
        relatedKey = ErrorHelper.keyParameterCheck(relatedKey, "DynamicsWebApi.disassociate", "relatedId");

        var request = {
            _additionalUrl: relationshipName + '(' + relatedKey + ')/$ref',
            collection: collection,
            key: primaryKey,
            impersonate: impersonateUserId
        };

        return _makeRequest("DELETE", request, 'disassociate')
            .then(function () { });
    };

    /**
     * Associate for a single-valued navigation property. (1:N)
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} key - Entity record Id that contains an attribute.
     * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param {string} relatedCollection - Related collection name that the lookup (attribute) points to.
     * @param {string} relatedKey - Related entity record id that needs to be associated.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.associateSingleValued = function (collection, key, singleValuedNavigationPropertyName, relatedCollection, relatedKey, impersonateUserId) {

        relatedKey = ErrorHelper.keyParameterCheck(relatedKey, "DynamicsWebApi.associateSingleValued", "relatedKey");
        ErrorHelper.stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.associateSingleValued", "singleValuedNavigationPropertyName");
        ErrorHelper.stringParameterCheck(relatedCollection, "DynamicsWebApi.associateSingleValued", "relatedcollection");

        var request = {
            _additionalUrl: singleValuedNavigationPropertyName + '/$ref',
            collection: collection,
            key: key,
            impersonate: impersonateUserId,
            data: { "@odata.id": relatedCollection + "(" + relatedKey + ")" }
        };

        return _makeRequest("PUT", request, 'associateSingleValued')
            .then(function () { });
    };

    /**
     * Removes a reference to an entity for a single-valued navigation property. (1:N)
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} key - Entity record Id that contains an attribute.
     * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.disassociateSingleValued = function (collection, key, singleValuedNavigationPropertyName, impersonateUserId) {

        ErrorHelper.stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.disassociateSingleValued", "singleValuedNavigationPropertyName");

        var request = {
            _additionalUrl: singleValuedNavigationPropertyName + "/$ref",
            key: key,
            collection: collection,
            impersonate: impersonateUserId
        };

        return _makeRequest("DELETE", request, 'disassociateSingleValued')
            .then(function () { });
    };

    /**
     * Executes an unbound function (not bound to a particular entity record)
     *
     * @param {string} functionName - The name of the function.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.executeUnboundFunction = function (functionName, parameters, impersonateUserId) {
        return _executeFunction(functionName, parameters, null, null, impersonateUserId, true);
    };

    /**
     * Executes a bound function
     *
     * @param {string} [id] - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} functionName - The name of the function.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.executeBoundFunction = function (id, collection, functionName, parameters, impersonateUserId) {
        return _executeFunction(functionName, parameters, collection, id, impersonateUserId);
    };

    var _executeFunction = function (functionName, parameters, collection, id, impersonateUserId, isUnbound) {

        ErrorHelper.stringParameterCheck(functionName, "DynamicsWebApi.executeFunction", "functionName");

        var request = {
            _additionalUrl: functionName + Utility.buildFunctionParameters(parameters),
            _unboundRequest: isUnbound,
            key: id,
            collection: collection,
            impersonate: impersonateUserId
        };

        return _makeRequest("GET", request, 'executeFunction').then(function (response) {
            return response.data;
        });
    };

    /**
     * Executes an unbound Web API action (not bound to a particular entity record)
     *
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} [requestObject] - Action request body object.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.executeUnboundAction = function (actionName, requestObject, impersonateUserId) {
        return _executeAction(actionName, requestObject, null, null, impersonateUserId, true);
    };

    /**
     * Executes a bound Web API action (bound to a particular entity record)
     *
     * @param {string} id - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} [requestObject] - Action request body object.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise | Function} D365 Web Api result
     */
    this.executeBoundAction = function (id, collection, actionName, requestObject, impersonateUserId) {
        return _executeAction(actionName, requestObject, collection, id, impersonateUserId);
    };

    var _executeAction = function (actionName, requestObject, collection, id, impersonateUserId, isUnbound) {

        ErrorHelper.stringParameterCheck(actionName, "DynamicsWebApi.executeAction", "actionName");

        var request = {
            _additionalUrl: actionName,
            _unboundRequest: isUnbound,
            collection: collection,
            key: id,
            impersonate: impersonateUserId,
            data: requestObject
        };

        var onSuccess = function (response) {
            return response.data;
        };


        return _makeRequest("POST", request, 'executeAction').then(onSuccess);
    };

    /**
     * Sends an asynchronous request to create an entity definition.
     *
     * @param {string} entityDefinition - Entity Definition.
     * @returns {Promise} D365 Web Api result
     */
    this.createEntity = function (entityDefinition) {

        ErrorHelper.parameterCheck(entityDefinition, 'DynamicsWebApi.createEntity', 'entityDefinition');

        var request = {
            collection: 'EntityDefinitions',
            entity: entityDefinition
        };
        return this.createRequest(request);
    };

    /**
     * Sends an asynchronous request to update an entity definition.
     *
     * @param {string} entityDefinition - Entity Definition.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     * @returns {Promise} D365 Web Api result
     */
    this.updateEntity = function (entityDefinition, mergeLabels) {

        ErrorHelper.parameterCheck(entityDefinition, 'DynamicsWebApi.updateEntity', 'entityDefinition');
        ErrorHelper.guidParameterCheck(entityDefinition.MetadataId, 'DynamicsWebApi.updateEntity', 'entityDefinition.MetadataId');

        var request = {
            collection: 'EntityDefinitions',
            mergeLabels: mergeLabels,
            key: entityDefinition.MetadataId,
            entity: entityDefinition
        };
        return this.updateRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve a specific entity definition.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
    * @returns {Promise} D365 Web Api result
     */
    this.retrieveEntity = function (entityKey, select, expand) {

        ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.retrieveEntity', 'entityKey');

        var request = {
            collection: 'EntityDefinitions',
            key: entityKey,
            select: select,
            expand: expand
        };

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve entity definitions.
     *
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entity definitions will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveEntities = function (select, filter) {
        var request = {
            collection: 'EntityDefinitions',
            select: select,
            filter: filter
        };

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to create an attribute.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {Object} attributeDefinition - Object that describes the attribute.
     * @returns {Promise} D365 Web Api result
     */
    this.createAttribute = function (entityKey, attributeDefinition) {
        ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.createAttribute', 'entityKey');
        ErrorHelper.parameterCheck(attributeDefinition, 'DynamicsWebApi.createAttribute', 'attributeDefinition');

        var request = {
            collection: 'EntityDefinitions',
            key: entityKey,
            entity: attributeDefinition,
            navigationProperty: 'Attributes'
        };

        return this.createRequest(request);
    };

    /**
     * Sends an asynchronous request to update an attribute.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {Object} attributeDefinition - Object that describes the attribute.
     * @param {string} [attributeType] - Use this parameter to cast the Attribute to a specific type.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     * @returns {Promise} D365 Web Api result
     */
    this.updateAttribute = function (entityKey, attributeDefinition, attributeType, mergeLabels) {
        ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.updateAttribute', 'entityKey');
        ErrorHelper.parameterCheck(attributeDefinition, 'DynamicsWebApi.updateAttribute', 'attributeDefinition');
        ErrorHelper.guidParameterCheck(attributeDefinition.MetadataId, 'DynamicsWebApi.updateAttribute', 'attributeDefinition.MetadataId');

        if (attributeType) {
            ErrorHelper.stringParameterCheck(attributeType, 'DynamicsWebApi.updateAttribute', 'attributeType');
        }

        var request = {
            collection: 'EntityDefinitions',
            key: entityKey,
            entity: attributeDefinition,
            navigationProperty: 'Attributes',
            navigationPropertyKey: attributeDefinition.MetadataId,
            mergeLabels: mergeLabels,
            metadataAttributeType: attributeType
        };

        return this.updateRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve attribute metadata for a specified entity definition.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {string} [attributeType] - Use this parameter to cast the Attributes to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which attribute definitions will be returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveAttributes = function (entityKey, attributeType, select, filter, expand) {

        ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.retrieveAttributes', 'entityKey');

        if (attributeType) {
            ErrorHelper.stringParameterCheck(attributeType, 'DynamicsWebApi.retrieveAttributes', 'attributeType');
        }

        var request = {
            collection: 'EntityDefinitions',
            key: entityKey,
            navigationProperty: 'Attributes',
            select: select,
            filter: filter,
            expand: expand,
            metadataAttributeType: attributeType
        };

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve a specific attribute metadata for a specified entity definition.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {string} attributeKey - The Attribute Metadata id.
     * @param {string} [attributeType] - Use this parameter to cast the Attribute to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveAttribute = function (entityKey, attributeKey, attributeType, select, expand) {

        ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.retrieveAttribute', 'entityKey');
        ErrorHelper.keyParameterCheck(attributeKey, 'DynamicsWebApi.retrieveAttribute', 'attributeKey');

        if (attributeType) {
            ErrorHelper.stringParameterCheck(attributeType, 'DynamicsWebApi.retrieveAttribute', 'attributeType');
        }

        var request = {
            collection: 'EntityDefinitions',
            key: entityKey,
            navigationProperty: 'Attributes',
            select: select,
            expand: expand,
            metadataAttributeType: attributeType,
            navigationPropertyKey: attributeKey
        };

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to create a relationship definition.
     *
     * @param {string} relationshipDefinition - Relationship Definition.
     * @returns {Promise} D365 Web Api result
     */
    this.createRelationship = function (relationshipDefinition) {

        ErrorHelper.parameterCheck(relationshipDefinition, 'DynamicsWebApi.createRelationship', 'relationshipDefinition');

        var request = {
            collection: 'RelationshipDefinitions',
            entity: relationshipDefinition
        };
        return this.createRequest(request);
    };

    /**
     * Sends an asynchronous request to update a relationship definition.
     *
     * @param {string} relationshipDefinition - Relationship Definition.
     * @param {string} [relationshipType] - Use this parameter to cast the Relationship to a specific type.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     * @returns {Promise} D365 Web Api result
     */
    this.updateRelationship = function (relationshipDefinition, relationshipType, mergeLabels) {

        ErrorHelper.parameterCheck(relationshipDefinition, 'DynamicsWebApi.updateRelationship', 'relationshipDefinition');
        ErrorHelper.guidParameterCheck(relationshipDefinition.MetadataId, 'DynamicsWebApi.updateRelationship', 'relationshipDefinition.MetadataId');

        var request = {
            collection: 'RelationshipDefinitions',
            mergeLabels: mergeLabels,
            key: relationshipDefinition.MetadataId,
            entity: relationshipDefinition,
            navigationProperty: relationshipType
        };

        return this.updateRequest(request);
    };

    /**
     * Sends an asynchronous request to delete a relationship definition.
     *
     * @param {string} metadataId - A String representing the GUID value.
     * @returns {Promise} D365 Web Api result
     */
    this.deleteRelationship = function (metadataId) {
        ErrorHelper.keyParameterCheck(metadataId, 'DynamicsWebApi.deleteRelationship', 'metadataId');

        var request = {
            collection: 'RelationshipDefinitions',
            key: metadataId
        };

        return this.deleteRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve relationship definitions.
     *
     * @param {string} [relationshipType] - Use this parameter to cast a Relationship to a specific type: 1:M or M:M.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which relationships will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveRelationships = function (relationshipType, select, filter) {

        var request = {
            collection: 'RelationshipDefinitions',
            navigationProperty: relationshipType,
            select: select,
            filter: filter
        };

        return this.retrieveMultipleRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve a specific relationship definition.
     *
     * @param {string} metadataId - String representing the Metadata Id GUID.
     * @param {string} [relationshipType] - Use this parameter to cast a Relationship to a specific type: 1:M or M:M.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveRelationship = function (metadataId, relationshipType, select) {

        ErrorHelper.keyParameterCheck(metadataId, 'DynamicsWebApi.retrieveRelationship', 'metadataId');

        var request = {
            collection: 'RelationshipDefinitions',
            navigationProperty: relationshipType,
            key: metadataId,
            select: select
        };

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to create a Global Option Set definition
     *
     * @param {string} globalOptionSetDefinition - Global Option Set Definition.
     * @returns {Promise} D365 Web Api result
     */
    this.createGlobalOptionSet = function (globalOptionSetDefinition) {

        ErrorHelper.parameterCheck(globalOptionSetDefinition, 'DynamicsWebApi.createGlobalOptionSet', 'globalOptionSetDefinition');

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            entity: globalOptionSetDefinition
        };

        return this.createRequest(request);
    };

    /**
     * Sends an asynchronous request to update a Global Option Set.
     *
     * @param {string} globalOptionSetDefinition - Global Option Set Definition.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     * @returns {Promise} D365 Web Api result
     */
    this.updateGlobalOptionSet = function (globalOptionSetDefinition, mergeLabels) {

        ErrorHelper.parameterCheck(globalOptionSetDefinition, 'DynamicsWebApi.updateGlobalOptionSet', 'globalOptionSetDefinition');
        ErrorHelper.guidParameterCheck(globalOptionSetDefinition.MetadataId, 'DynamicsWebApi.updateGlobalOptionSet', 'globalOptionSetDefinition.MetadataId');

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            mergeLabels: mergeLabels,
            key: globalOptionSetDefinition.MetadataId,
            entity: globalOptionSetDefinition
        };
        return this.updateRequest(request);
    };

    /**
     * Sends an asynchronous request to delete a Global Option Set.
     *
     * @param {string} globalOptionSetKey - A String representing the GUID value or Alternate Key (such as Name).
     * @returns {Promise} D365 Web Api result
     */
    this.deleteGlobalOptionSet = function (globalOptionSetKey) {
        ErrorHelper.keyParameterCheck(globalOptionSetKey, 'DynamicsWebApi.deleteGlobalOptionSet', 'globalOptionSetKey');

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            key: globalOptionSetKey
        };

        return this.deleteRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     * 
     * @param {string} globalOptionSetKey - The Global Option Set MetadataID or Alternate Key (such as Name).
     * @param {string} [castType] - Use this parameter to cast a Global Option Set to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveGlobalOptionSet = function (globalOptionSetKey, castType, select) {
        ErrorHelper.keyParameterCheck(globalOptionSetKey, 'DynamicsWebApi.retrieveGlobalOptionSet', 'globalOptionSetKey');

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            key: globalOptionSetKey,
            navigationProperty: castType,
            select: select
        };

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     * 
     * @param {string} [castType] - Use this parameter to cast a Global Option Set to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveGlobalOptionSets = function (castType, select) {

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            navigationProperty: castType,
            select: select
        };

        return this.retrieveMultipleRequest(request);
    };

    /**
     * Starts a batch request.
     * 
     */
    this.startBatch = function () {
        _isBatch = true;
    };

    /**
     * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
     * @returns {Promise} D365 Web Api result
     */
    this.executeBatch = function () {
        ErrorHelper.batchNotStarted(_isBatch);

        _isBatch = false;
        return _makeRequest('POST', { collection: '$batch' }, 'executeBatch')
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Creates a new instance of DynamicsWebApi
     *
     * @param {DWAConfig} [config] - configuration object.
     * @returns {DynamicsWebApi} The new instance of a DynamicsWebApi
     */
    this.initializeInstance = function (config) {
        if (!config) {
            config = _internalConfig;
        }

        return new DynamicsWebApi(config);
    };
}

/**
 * DynamicsWebApi Utility helper class
 * @typicalname dynamicsWebApi.utility
 */
DynamicsWebApi.prototype.utility = {
    /**
     * Searches for a collection name by provided entity name in a cached entity metadata.
     * The returned collection name can be null.
     *
     * @param {string} entityName - entity name
     * @returns {string} a collection name
     */
    getCollectionName: Request.getCollectionName
};

/**
 * Microsoft Dynamics CRM Web API helper library written in JavaScript.
 * It is compatible with: Dynamics 365 (online), Dynamics 365 (on-premise), Dynamics CRM 2016, Dynamics CRM Online.
 * @module dynamics-web-api
 * @typicalname dynamicsWebApi
 */
module.exports = DynamicsWebApi;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function dateReviver(key, value) {
    ///<summary>
    /// Private function to convert matching string values to Date objects.
    ///</summary>
    ///<param name="key" type="String">
    /// The key used to identify the object property
    ///</param>
    ///<param name="value" type="String">
    /// The string value representing a date
    ///</param>
    var a;
    if (typeof value === 'string') {
        a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:Z|[-+]\d{2}:\d{2})$/.exec(value);
        if (a) {
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
        }
    }
    return value;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var DWA = __webpack_require__(1);
var Utility = __webpack_require__(2);
var ErrorHelper = __webpack_require__(0);
var dateReviver = __webpack_require__(7);

//string es6 polyfill
if (!String.prototype.endsWith || !String.prototype.startsWith) {
    __webpack_require__(3);
}

function getFormattedKeyValue(keyName, value) {
    var newKey = null;
    if (keyName.indexOf('@') !== -1) {
        var format = keyName.split('@');
        switch (format[1]) {
            case 'odata.context':
                newKey = 'oDataContext';
                break;
            case 'odata.count':
                newKey = 'oDataCount';
                value = value != null
                    ? parseInt(value)
                    : 0;
                break;
            case 'odata.nextLink':
                newKey = 'oDataNextLink';
                break;
            case 'odata.deltaLink':
                newKey = 'oDataDeltaLink';
                break;
            case DWA.Prefer.Annotations.FormattedValue:
                newKey = format[0] + '_Formatted';
                break;
            case DWA.Prefer.Annotations.AssociatedNavigationProperty:
                newKey = format[0] + '_NavigationProperty';
                break;
            case DWA.Prefer.Annotations.LookupLogicalName:
                newKey = format[0] + '_LogicalName';
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
            return Utility.convertToReferenceObject(object);
        }

        if (parseParams.toCount) {
            return getFormattedKeyValue('@odata.count', object['@odata.count'])[1] || 0;
        }
    }

    var keys = Object.keys(object);

    for (var i = 0; i < keys.length; i++) {
        var currentKey = keys[i];

        if (object[currentKey] != null && object[currentKey].constructor === Array) {
            for (var j = 0; j < object[currentKey].length; j++) {
                object[currentKey][j] = parseData(object[currentKey][j]);
            }
        }

        //parse formatted values
        var formattedKeyValue = getFormattedKeyValue(currentKey, object[currentKey]);
        if (formattedKeyValue[0]) {
            object[formattedKeyValue[0]] = formattedKeyValue[1];
        }

        //parse aliased values
        if (currentKey.indexOf('_x002e_') !== -1) {
            var aliasKeys = currentKey.split('_x002e_');

            if (!object.hasOwnProperty(aliasKeys[0])) {
                object[aliasKeys[0]] = { _dwaType: 'alias' };
            }
            //throw an error if there is already a property which is not an 'alias'
            else if (
                typeof object[aliasKeys[0]] !== 'object' ||
                typeof object[aliasKeys[0]] === 'object' && !object[aliasKeys[0]].hasOwnProperty('_dwaType')) {
                throw new Error('The alias name of the linked entity must be unique!');
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
        if (parseParams.hasOwnProperty('pageNumber') && object['@' + DWA.Prefer.Annotations.FetchXmlPagingCookie] != null) {
            object.PagingInfo = Utility.getFetchXmlPagingCookie(object['@' + DWA.Prefer.Annotations.FetchXmlPagingCookie], parseParams.pageNumber);
        }
    }

    return object;
}

//partially taken from https://github.com/emiltholin/google-api-batch-utils
/**
 *
 * @param {string} response - response that needs to be parsed
 * @param {Array} parseParams - parameters for parsing the response
 * @param {Number} [requestNumber] - number of the request
 * @returns {any} parsed batch response
 */
function parseBatchResponse(response, parseParams, requestNumber) {
    // Not the same delimiter in the response as we specify ourselves in the request,
    // so we have to extract it.
    var delimiter = response.substr(0, response.indexOf('\r\n'));
    var batchResponseParts = response.split(delimiter);
    // The first part will always be an empty string. Just remove it.
    batchResponseParts.shift();
    // The last part will be the "--". Just remove it.
    batchResponseParts.pop();

    requestNumber = requestNumber || 0;

    var result = [];
    for (var i = 0; i < batchResponseParts.length; i++) {
        var batchResponse = batchResponseParts[i];
        if (batchResponse.indexOf('--changesetresponse_') > -1) {
            batchResponse = batchResponse.trim();
            var batchToProcess = batchResponse
                .substring(batchResponse.indexOf('\r\n') + 1).trim();

            result = result.concat(parseBatchResponse(batchToProcess, parseParams, requestNumber));
        }
        else {
            //check http status
            var httpStatusReg = /HTTP\/?\s*[\d.]*\s+(\d{3})\s+([\w\s]*)$/gm.exec(batchResponse);
            var httpStatus = parseInt(httpStatusReg[1]);
            var httpStatusMessage = httpStatusReg[2].trim();

            var responseData = batchResponse.substring(batchResponse.indexOf("{"), batchResponse.lastIndexOf("}") + 1);

            if (!responseData) {
                if (/Content-Type: text\/plain/i.test(batchResponse)) {
                    var plainContentReg = /\w+$/gi.exec(batchResponse.trim());
                    var plainContent = plainContentReg && plainContentReg.length ? plainContentReg[0] : undefined;

                    //check if a plain content is a number or not
                    result.push(isNaN(plainContent) ? plainContent : parseInt(plainContent));
                }
                else
                    if (parseParams.length && parseParams[requestNumber] && parseParams[requestNumber].hasOwnProperty('valueIfEmpty')) {
                        result.push(parseParams[requestNumber].valueIfEmpty);
                    }
                    else {
                        var entityUrl = /OData-EntityId.+/i.exec(batchResponse);

                        if (entityUrl && entityUrl.length) {
                            var guidResult = /([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})\)$/i.exec(entityUrl[0]);

                            result.push(guidResult ? guidResult[1] : undefined);
                        }
                        else {
                            result.push(undefined);
                        }
                    }
            }
            else {
                var parsedResponse = parseData(JSON.parse(responseData, dateReviver), parseParams[requestNumber]);

                if (httpStatus >= 400) {
                    result.push(ErrorHelper.handleHttpError(parsedResponse, {
                        status: httpStatus,
                        statusText: httpStatusMessage,
                        statusMessage: httpStatusMessage
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

/**
 *
 * @param {string} response - response that needs to be parsed
 * @param {Array} responseHeaders - response headers
 * @param {Array} parseParams - parameters for parsing the response
 * @returns {any} parsed response
 */
module.exports = function parseResponse(response, responseHeaders, parseParams) {
    var parseResult = undefined;
    if (response.length) {
        if (response.indexOf('--batchresponse_') > -1) {
            var batch = parseBatchResponse(response, parseParams);

            parseResult = parseParams.length === 1 && parseParams[0].convertedToBatch
                ? batch[0]
                : batch;
        }
        else {
            parseResult = parseData(JSON.parse(response, dateReviver), parseParams[0]);
        }
    }
    else {
        if (parseParams.length && parseParams[0].hasOwnProperty('valueIfEmpty')) {
            parseResult = parseParams[0].valueIfEmpty;
        }
        else
            if (responseHeaders['OData-EntityId'] || responseHeaders['odata-entityid']) {
                var entityUrl = responseHeaders['OData-EntityId']
                    ? responseHeaders['OData-EntityId']
                    : responseHeaders['odata-entityid'];

                var guidResult = /([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})\)$/i.exec(entityUrl);

                if (guidResult) {
                    parseResult = guidResult[1];
                }
            }
    }

    parseParams.length = 0;

    return parseResult;
}

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = function parseResponseHeaders(headerStr) {
    var headers = {};
    if (!headerStr) {
        return headers;
    }
    var headerPairs = headerStr.split('\u000d\u000a');
    for (var i = 0, ilen = headerPairs.length; i < ilen; i++) {
        var headerPair = headerPairs[i];
        var index = headerPair.indexOf('\u003a\u0020');
        if (index > 0) {
            headers[headerPair.substring(0, index)] = headerPair.substring(index + 2);
        }
    }
    return headers;
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var parseResponse = __webpack_require__(8);
var parseResponseHeaders = __webpack_require__(9);
var ErrorHelper = __webpack_require__(0);

if (!Array.isArray) {
    __webpack_require__(6);
}

/**
 * Sends a request to given URL with given parameters
 *
 */
var xhrRequest = function (options) {
    var method = options.method;
    var uri = options.uri;
    var data = options.data;
    var additionalHeaders = options.additionalHeaders;
    var responseParams = options.responseParams;
    var successCallback = options.successCallback;
    var errorCallback = options.errorCallback;
    var isAsync = options.isAsync;

    var request = new XMLHttpRequest();
    request.open(method, uri, isAsync);

    //set additional headers
    for (var key in additionalHeaders) {
        request.setRequestHeader(key, additionalHeaders[key]);
    }

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            switch (request.status) {
                case 200: // Success with content returned in response body.
                case 201: // Success with content returned in response body.
                case 204: // Success with no content returned in response body.
                case 304: {// Success with Not Modified
                    var responseHeaders = parseResponseHeaders(request.getAllResponseHeaders());
                    var responseData = parseResponse(request.responseText, responseHeaders, responseParams);

                    var response = {
                        data: responseData,
                        headers: responseHeaders,
                        status: request.status
                    };

                    successCallback(response);
                    break;
                }
                default: // All other statuses are error cases.
                    var error;
                    try {
                        var errorParsed = parseResponse(request.responseText, parseResponseHeaders(request.getAllResponseHeaders()), responseParams);

                        if (Array.isArray(errorParsed)) {
                            errorCallback(errorParsed);
                            break;
                        }

                        error = errorParsed.error;
                    } catch (e) {
                        if (request.response.length > 0) {
                            error = { message: request.response };
                        }
                        else {
                            error = { message: "Unexpected Error" };
                        }
                    }

                    errorCallback(ErrorHelper.handleHttpError(error, {
                        status: request.status,
                        statusText: request.statusText
                    }));

                    break;
            }

            request = null;
            responseParams.length = 0;
        }
    };

    if (options.timeout) {
        request.timeout = options.timeout;
    }

    request.onerror = function () {
        errorCallback(ErrorHelper.handleHttpError({
            status: request.status,
            statusText: request.statusText,
            message: request.responseText || "Network Error"
        }));
        responseParams.length = 0;
        request = null;
    };

    request.ontimeout = function () {
        errorCallback(ErrorHelper.handleHttpError({
            status: request.status,
            statusText: request.statusText,
            message: request.responseText || "Request Timed Out"
        }));
        responseParams.length = 0;
        request = null;
    };

    data
        ? request.send(data)
        : request.send();
};

module.exports = xhrRequest;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var Utility = __webpack_require__(2);

/**
 * 
 * @param {Array} requests - array of requests
 * @returns {any} batch request
 */
var convertToBatch = function (requests) {
    var batchBoundary = 'dwa_batch_' + Utility.generateUUID();

    var batchBody = [];
    var currentChangeSet = null;
    var contentId = 100000;

    for (var i = 0; i < requests.length; i++) {
        var request = requests[i];
        var isGet = request.method === 'GET';

        if (isGet && currentChangeSet) {
            //end current change set
            batchBody.push('\n--' + currentChangeSet + '--');

            currentChangeSet = null;
            contentId = 100000;
        }

        if (!currentChangeSet) {
            batchBody.push('\n--' + batchBoundary);

            if (!isGet) {
                currentChangeSet = 'changeset_' + Utility.generateUUID();
                batchBody.push('Content-Type: multipart/mixed;boundary=' + currentChangeSet);
            }
        }

        if (!isGet) {
            batchBody.push('\n--' + currentChangeSet);
        }

        batchBody.push('Content-Type: application/http');
        batchBody.push('Content-Transfer-Encoding: binary');

        if (!isGet) {
            var contentIdValue = request.headers.hasOwnProperty('Content-ID')
                ? request.headers['Content-ID']
                : ++contentId;

            batchBody.push('Content-ID: ' + contentIdValue);
        }

        if (!request.path.startsWith("$")) {
            batchBody.push('\n' + request.method + ' ' + request.config.webApiUrl + request.path + ' HTTP/1.1');
        }
        else {
            batchBody.push('\n' + request.method + ' ' + request.path + ' HTTP/1.1');
        }

        if (isGet) {
            batchBody.push('Accept: application/json');
        }
        else {
            batchBody.push('Content-Type: application/json');
        }

        for (var key in request.headers) {
            if (key === 'Authorization' || key === 'Content-ID')
                continue;

            batchBody.push(key + ': ' + request.headers[key]);
        }

        if (!isGet && request.data && request.data.length) {
            batchBody.push('\n' + request.data);
        }
    }

    if (currentChangeSet) {
        batchBody.push('\n--' + currentChangeSet + '--');
    }

    batchBody.push('\n--' + batchBoundary + '--');

    return { boundary: batchBoundary, body: batchBody.join('\n') };
};

var BatchConverter = {
    convertToBatch: convertToBatch
};

module.exports = BatchConverter;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var DWA = __webpack_require__(1);
var ErrorHelper = __webpack_require__(0);
var buildPreferHeader = __webpack_require__(14);

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

/**
 * Converts optional parameters of the request to URL. If expand parameter exists this function is called recursively.
 *
 * @param {Object} request - Request object
 * @param {string} functionName - Name of the function that converts a request (for Error Handling)
 * @param {string} url - URL beginning (with required parameters)
 * @param {string} [joinSymbol] - URL beginning (with required parameters)
 * @param {Object} [config] - DynamicsWebApi config
 * @returns {ConvertedRequestOptions} Additional options in request
 */
function convertRequestOptions(request, functionName, url, joinSymbol, config) {
    var headers = {};
    var requestArray = [];
    joinSymbol = joinSymbol != null ? joinSymbol : '&';

    if (request) {
        if (request.navigationProperty) {
            ErrorHelper.stringParameterCheck(request.navigationProperty, 'DynamicsWebApi.' + functionName, 'request.navigationProperty');
            url += '/' + request.navigationProperty;

            if (request.navigationPropertyKey) {
                var navigationKey = ErrorHelper.keyParameterCheck(request.navigationPropertyKey, 'DynamicsWebApi.' + functionName, 'request.navigationPropertyKey');
                url += '(' + navigationKey + ')';
            }

            if (request.navigationProperty === 'Attributes') {
                if (request.metadataAttributeType) {
                    ErrorHelper.stringParameterCheck(request.metadataAttributeType, 'DynamicsWebApi.' + functionName, 'request.metadataAttributeType');
                    url += '/' + request.metadataAttributeType;
                }
            }
        }

        if (request.select != null && request.select.length) {
            ErrorHelper.arrayParameterCheck(request.select, 'DynamicsWebApi.' + functionName, 'request.select');

            if (functionName == 'retrieve' && request.select.length == 1 && request.select[0].endsWith('/$ref')) {
                url += '/' + request.select[0];
            }
            else {
                if (request.select[0].startsWith('/') && functionName == 'retrieve') {
                    if (request.navigationProperty == null) {
                        url += request.select.shift();
                    }
                    else {
                        request.select.shift();
                    }
                }

                //check if anything left in the array
                if (request.select.length) {
                    requestArray.push('$select=' + request.select.join(','));
                }
            }
        }

        if (request.filter) {
            ErrorHelper.stringParameterCheck(request.filter, 'DynamicsWebApi.' + functionName, "request.filter");
            var removeBracketsFromGuidReg = /[^"']{([\w\d]{8}[-]?(?:[\w\d]{4}[-]?){3}[\w\d]{12})}(?:[^"']|$)/g;
            var filterResult = request.filter;

            //fix bug 2018-06-11
            while ((m = removeBracketsFromGuidReg.exec(filterResult)) !== null) {
                if (m.index === removeBracketsFromGuidReg.lastIndex) {
                    regex.lastIndex++;
                }

                var replacement = m[0].endsWith(')') ? ')' : ' ';
                filterResult = filterResult.replace(m[0], ' ' + m[1] + replacement);
            }

            requestArray.push("$filter=" + encodeURIComponent(filterResult));
        }

        if (request.savedQuery) {
            requestArray.push("savedQuery=" + ErrorHelper.guidParameterCheck(request.savedQuery, 'DynamicsWebApi.' + functionName, "request.savedQuery"));
        }

        if (request.userQuery) {
            requestArray.push("userQuery=" + ErrorHelper.guidParameterCheck(request.userQuery, 'DynamicsWebApi.' + functionName, "request.userQuery"));
        }

        if (request.count) {
            ErrorHelper.boolParameterCheck(request.count, 'DynamicsWebApi.' + functionName, "request.count");
            requestArray.push("$count=" + request.count);
        }

        if (request.top && request.top > 0) {
            ErrorHelper.numberParameterCheck(request.top, 'DynamicsWebApi.' + functionName, "request.top");
            requestArray.push("$top=" + request.top);
        }

        if (request.orderBy != null && request.orderBy.length) {
            ErrorHelper.arrayParameterCheck(request.orderBy, 'DynamicsWebApi.' + functionName, "request.orderBy");
            requestArray.push("$orderby=" + request.orderBy.join(','));
        }

        var prefer = buildPreferHeader(request, functionName, config);

        if (prefer.length) {
            headers['Prefer'] = prefer;
        }

        if (request.ifmatch != null && request.ifnonematch != null) {
            throw new Error('DynamicsWebApi.' + functionName + ". Either one of request.ifmatch or request.ifnonematch parameters should be used in a call, not both.");
        }

        if (request.ifmatch) {
            ErrorHelper.stringParameterCheck(request.ifmatch, 'DynamicsWebApi.' + functionName, "request.ifmatch");
            headers['If-Match'] = request.ifmatch;
        }

        if (request.ifnonematch) {
            ErrorHelper.stringParameterCheck(request.ifnonematch, 'DynamicsWebApi.' + functionName, "request.ifnonematch");
            headers['If-None-Match'] = request.ifnonematch;
        }

        if (request.impersonate) {
            ErrorHelper.stringParameterCheck(request.impersonate, 'DynamicsWebApi.' + functionName, "request.impersonate");
            headers['MSCRMCallerID'] = ErrorHelper.guidParameterCheck(request.impersonate, 'DynamicsWebApi.' + functionName, "request.impersonate");
        }

        if (request.token) {
            ErrorHelper.stringParameterCheck(request.token, 'DynamicsWebApi.' + functionName, "request.token");
            headers['Authorization'] = 'Bearer ' + request.token;
        }

        if (request.duplicateDetection) {
            ErrorHelper.boolParameterCheck(request.duplicateDetection, 'DynamicsWebApi.' + functionName, 'request.duplicateDetection');
            headers['MSCRM.SuppressDuplicateDetection'] = 'false';
        }

        if (request.entity) {
            ErrorHelper.parameterCheck(request.entity, 'DynamicsWebApi.' + functionName, 'request.entity');
        }

        if (request.data) {
            ErrorHelper.parameterCheck(request.data, 'DynamicsWebApi.' + functionName, 'request.data');
        }

        if (request.noCache) {
            ErrorHelper.boolParameterCheck(request.noCache, 'DynamicsWebApi.' + functionName, 'request.noCache');
            headers['Cache-Control'] = 'no-cache';
        }

        if (request.mergeLabels) {
            ErrorHelper.boolParameterCheck(request.mergeLabels, 'DynamicsWebApi.' + functionName, 'request.mergeLabels');
            headers['MSCRM.MergeLabels'] = 'true';
        }

        if (request.contentId) {
            ErrorHelper.stringParameterCheck(request.contentId, 'DynamicsWebApi.' + functionName, 'request.contentId');
            if (!request.contentId.startsWith('$')) {
                headers['Content-ID'] = request.contentId;
            }
        }

        if (request.isBatch) {
            ErrorHelper.boolParameterCheck(request.isBatch, 'DynamicsWebApi.' + functionName, 'request.isBatch');
        }

        if (request.expand && request.expand.length) {
            ErrorHelper.stringOrArrayParameterCheck(request.expand, 'DynamicsWebApi.' + functionName, "request.expand");
            if (typeof request.expand === 'string') {
                requestArray.push('$expand=' + request.expand);
            }
            else {
                var expandRequestArray = [];
                for (var i = 0; i < request.expand.length; i++) {
                    if (request.expand[i].property) {
                        var expandConverted = convertRequestOptions(request.expand[i], functionName + " $expand", null, ";");
                        var expandQuery = expandConverted.query;
                        if (expandQuery && expandQuery.length) {
                            expandQuery = "(" + expandQuery + ")";
                        }
                        expandRequestArray.push(request.expand[i].property + expandQuery);
                    }
                }
                if (expandRequestArray.length) {
                    requestArray.push("$expand=" + expandRequestArray.join(","));
                }
            }
        }
    }

    return { url: url, query: requestArray.join(joinSymbol), headers: headers };
}

/**
 * Converts a request object to URL link
 *
 * @param {Object} request - Request object
 * @param {string} [functionName] - Name of the function that converts a request (for Error Handling only)
 * @param {Object} [config] - DynamicsWebApi config
 * @returns {ConvertedRequest} Converted request
 */
function convertRequest(request, functionName, config) {
    var url = '';
    var result;
    if (!request.url) {
        if (!request._unboundRequest && !request.collection) {
            ErrorHelper.parameterCheck(request.collection, 'DynamicsWebApi.' + functionName, "request.collection");
        }
        if (request.collection) {
            ErrorHelper.stringParameterCheck(request.collection, 'DynamicsWebApi.' + functionName, "request.collection");
            url = request.collection;

            if (request.contentId) {
                ErrorHelper.stringParameterCheck(request.contentId, 'DynamicsWebApi.' + functionName, 'request.contentId');
                if (request.contentId.startsWith('$')) {
                    url = request.contentId + '/' + url;
                }
            }

            //add alternate key feature
            if (request.key) {
                request.key = ErrorHelper.keyParameterCheck(request.key, 'DynamicsWebApi.' + functionName, "request.key");
            }
            else if (request.id) {
                request.key = ErrorHelper.guidParameterCheck(request.id, 'DynamicsWebApi.' + functionName, "request.id");
            }

            if (request.key) {
                url += "(" + request.key + ")";
            }
        }

        if (request._additionalUrl) {
            if (url) {
                url += '/';
            }
            url += request._additionalUrl;
        }

        result = convertRequestOptions(request, functionName, url, '&', config);
        if (request.fetchXml) {
            ErrorHelper.stringParameterCheck(request.fetchXml, 'DynamicsWebApi.' + functionName, "request.fetchXml");
            result.url += "?fetchXml=" + encodeURIComponent(request.fetchXml);
        }
        else
            if (result.query) {
                result.url += "?" + result.query;
            }
    }
    else {
        ErrorHelper.stringParameterCheck(request.url, 'DynamicsWebApi.' + functionName, "request.url");
        url = request.url.replace(config.webApiUrl, '');
        result = convertRequestOptions(request, functionName, url, '&', config);
    }

    if (request.hasOwnProperty('async') && request.async != null) {
        ErrorHelper.boolParameterCheck(request.async, 'DynamicsWebApi.' + functionName, "request.async");
        result.async = request.async;
    }
    else {
        result.async = true;
    }

    return { url: result.url, headers: result.headers, async: result.async };
}

var RequestConverter = {
    convertRequestOptions: convertRequestOptions,
    convertRequest: convertRequest
};

module.exports = RequestConverter;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

/**
 * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
 *
 * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
 * @returns {string} - Function parameter result
 */
module.exports = function buildFunctionParameters(parameters) {
    if (parameters) {
        var parameterNames = Object.keys(parameters);
        var functionParameters = "";
        var urlQuery = "";

        for (var i = 1; i <= parameterNames.length; i++) {
            var parameterName = parameterNames[i - 1];
            var value = parameters[parameterName];

            if (value === null)
                continue;

            if (typeof value === "string") {
                value = "'" + value + "'";
            }
            //fix #45
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
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var DWA = __webpack_require__(1);
var ErrorHelper = __webpack_require__(0);

/**
 * Builds a Prefer header value
 * @param {Object} request Request object
 * @param {string} functionName name of the current function
 * @param {Object} config DynamicsWebApi config
 * @returns {string}
 */
module.exports = function buildPreferHeader(request, functionName, config) {
    var returnRepresentation = request.returnRepresentation;
    var includeAnnotations = request.includeAnnotations;
    var maxPageSize = request.maxPageSize;
    var trackChanges = request.trackChanges;

    var prefer;

    if (request.prefer && request.prefer.length) {
        ErrorHelper.stringOrArrayParameterCheck(request.prefer, "DynamicsWebApi." + functionName, "request.prefer");
        prefer = request.prefer;
        if (typeof prefer === "string") {
            prefer = prefer.split(',');
        }
        for (var i in prefer) {
            var item = prefer[i].trim();
            if (item === DWA.Prefer.ReturnRepresentation) {
                returnRepresentation = true;
            }
            else if (item.indexOf("odata.include-annotations=") > -1) {
                includeAnnotations = item.replace('odata.include-annotations=', '').replace(/"/g, '');
            }
            else if (item.startsWith("odata.maxpagesize=")) {
                maxPageSize = item.replace('odata.maxpagesize=', '').replace(/"/g, '');
            }
            else if (item.indexOf("odata.track-changes") > -1) {
                trackChanges = true;
            }
        }
    }

    prefer = [];

    if (config) {
        if (returnRepresentation == null) {
            returnRepresentation = config.returnRepresentation;
        }
        includeAnnotations = includeAnnotations ? includeAnnotations : config.includeAnnotations;
        maxPageSize = maxPageSize ? maxPageSize : config.maxPageSize;
    }

    if (returnRepresentation) {
        ErrorHelper.boolParameterCheck(returnRepresentation, "DynamicsWebApi." + functionName, "request.returnRepresentation");
        prefer.push(DWA.Prefer.ReturnRepresentation);
    }

    if (includeAnnotations) {
        ErrorHelper.stringParameterCheck(includeAnnotations, "DynamicsWebApi." + functionName, "request.includeAnnotations");
        prefer.push('odata.include-annotations="' + includeAnnotations + '"');
    }

    if (maxPageSize && maxPageSize > 0) {
        ErrorHelper.numberParameterCheck(maxPageSize, "DynamicsWebApi." + functionName, "request.maxPageSize");
        prefer.push('odata.maxpagesize=' + maxPageSize);
    }

    if (trackChanges) {
        ErrorHelper.boolParameterCheck(trackChanges, "DynamicsWebApi." + functionName, "request.trackChanges");
        prefer.push('odata.track-changes');
    }

    return prefer.join(',');
}

/***/ }),
/* 15 */
/***/ (function(module, exports) {

/**
 * @typedef {Object} ReferenceObject
 * @property {string} id Id of the Entity record
 * @property {string} collection Collection name that the record belongs to
 * @property {string} oDataContext OData context returned in the response
 */

/**
 * Converts a response to a reference object
 *
 * @param {Object} responseData - Response object
 * @returns {ReferenceObject} reference object
 */
module.exports = function convertToReferenceObject(responseData) {
    var result = /\/(\w+)\(([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})/i.exec(responseData["@odata.id"]);
    return { id: result[2], collection: result[1], oDataContext: responseData["@odata.context"] };
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

/**
 * Parses a paging cookie returned in response
 *
 * @param {string} pageCookies - Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.
 * @param {number} currentPageNumber - A current page number. Fix empty paging-cookie for complex fetch xmls.
 * @returns {{cookie: "", number: 0, next: 1}}
 */
module.exports = function getFetchXmlPagingCookie(pageCookies, currentPageNumber) {
    pageCookies = pageCookies ? pageCookies : "";
    currentPageNumber = currentPageNumber ? currentPageNumber : 1;

    //get the page cokies
    pageCookies = unescape(unescape(pageCookies));

    var info = /pagingcookie="(<cookie page="(\d+)".+<\/cookie>)/.exec(pageCookies);

    if (info != null) {
        var page = parseInt(info[2]);
        return {
            cookie: info[1].replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '\'').replace(/\'/g, '&' + 'quot;'),
            page: page,
            nextPage: page + 1
        };
    } else {
        //http://stackoverflow.com/questions/41262772/execution-of-fetch-xml-using-web-api-dynamics-365 workaround
        return {
            cookie: "",
            page: currentPageNumber,
            nextPage: currentPageNumber + 1
        };
    }
};

/***/ })
/******/ ]);
});