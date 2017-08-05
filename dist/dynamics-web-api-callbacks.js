/*! dynamics-web-api-callbacks v1.2.9 (c) 2017 Aleksandr Rogov */
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
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
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

    stringOrArrayParameterCheck: function(parameter, functionName, parameterName) {
        if (parameter.constructor !== Array && typeof parameter != "string") {
            throwParameterError(functionName, parameterName, "String or Array");
        }
    },

    numberParameterCheck : function (parameter, functionName, parameterName) {
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
    }
};

module.exports = ErrorHelper;

/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var DWA = __webpack_require__(0);
//var RequestConverter = require('../utilities/RequestConverter');

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

function setStandardHeaders(additionalHeaders) {
    additionalHeaders["Accept"] = "application/json";
    additionalHeaders["OData-MaxVersion"] = "4.0";
    additionalHeaders["OData-Version"] = "4.0";
    additionalHeaders['Content-Type'] = 'application/json; charset=utf-8';

    return additionalHeaders;
}

/**
 * Sends a request to given URL with given parameters
 *
 * @param {string} method - Method of the request.
 * @param {string} uri - Request URI.
 * @param {Function} successCallback - A callback called on success of the request.
 * @param {Function} errorCallback - A callback called when a request failed.
 * @param {Object} config - DynamicsWebApi config.
 * @param {Object} [data] - Data to send in the request.
 * @param {Object} [additionalHeaders] - Object with additional headers. IMPORTANT! This object does not contain default headers needed for every request.
 * @returns {Promise}
 */
module.exports = function sendRequest(method, uri, config, data, additionalHeaders, successCallback, errorCallback) {

    if (!additionalHeaders) {
        additionalHeaders = {};
    }

    additionalHeaders = setStandardHeaders(additionalHeaders);

    var stringifiedData;
    if (data) {
        stringifiedData = JSON.stringify(data, function (key, value) {
            /// <param name="key" type="String">Description</param>
            if (key.endsWith("@odata.bind")) {
                if (typeof value === "string") {
                    //remove brackets in guid
                    if (/\(\{[\w\d-]+\}\)/g.test(value)) {
                        value = value.replace(/(.+)\(\{([\w\d-]+)\}\)/g, '$1($2)');
                    }
                    //add full web api url if it's not set
                    if (!value.startsWith(config.webApiUrl)) {
                        value = config.webApiUrl + value;
                    }
                }
            }

            return value;
        });
    }

    //if the URL contains more characters than max possible limit, convert the request to a batch request
    if (uri.length > 2000) {
        var batchBoundary = 'dwa_batch_' + generateUUID();

        var batchBody = [];
        batchBody.push('--' + batchBoundary);
        batchBody.push('Content-Type: application/http');
        batchBody.push('Content-Transfer-Encoding: binary\n');
        batchBody.push(method + ' ' + config.webApiUrl + uri + ' HTTP/1.1');

        for (var key in additionalHeaders) {
            batchBody.push(key + ': ' + additionalHeaders[key]);
            delete additionalHeaders[key];
        }

        batchBody.push('\n--' + batchBoundary + '--');

        stringifiedData = batchBody.join('\n');

        additionalHeaders = setStandardHeaders(additionalHeaders);
        additionalHeaders['Content-Type'] = 'multipart/mixed;boundary=' + batchBoundary;
        uri = '$batch';
        method = 'POST';
    }

    if (config.impersonate && !additionalHeaders['MSCRMCallerID']) {
        additionalHeaders['MSCRMCallerID'] = config.impersonate;
    }

    var executeRequest;
    if (typeof XMLHttpRequest !== 'undefined') {
        executeRequest = __webpack_require__(9);
    }


    var sendInternalRequest = function (token) {
        if (token) {
            if (!additionalHeaders) {
                additionalHeaders = {};
            }
            additionalHeaders['Authorization'] = 'Bearer ' + token.accessToken;
        }

        executeRequest(method, config.webApiUrl + uri, stringifiedData, additionalHeaders, successCallback, errorCallback);
    };

    //call a token refresh callback only if it is set and there is no "Authorization" header set yet
    if (config.onTokenRefresh && (!additionalHeaders || (additionalHeaders && !additionalHeaders['Authorization']))) {
        config.onTokenRefresh(sendInternalRequest);
    }
    else {
        sendInternalRequest();
    }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var DWA = __webpack_require__(0);
var ErrorHelper = __webpack_require__(1);
var buildPreferHeader = __webpack_require__(11);

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
 */

/**
 * Converts optional parameters of the request to URL. If expand parameter exists this function is called recursively.
 *
 * @param {Object} request - Request object
 * @param {string} functionName - Name of the function that converts a request (for Error Handling)
 * @param {string} url - URL beginning (with required parameters)
 * @param {string} [joinSymbol] - URL beginning (with required parameters)
 * @param {Object} [config] - DynamicsWebApi config
 * @returns {ConvertedRequestOptions}
 */
function convertRequestOptions (request, functionName, url, joinSymbol, config) {
    var headers = {};
    var requestArray = [];
    joinSymbol = joinSymbol != null ? joinSymbol : "&";

    if (request) {
        if (request.navigationProperty) {
            ErrorHelper.stringParameterCheck(request.navigationProperty, "DynamicsWebApi." + functionName, "request.navigationProperty");
            url += "/" + request.navigationProperty;
        }

        if (request.select != null && request.select.length) {
            ErrorHelper.arrayParameterCheck(request.select, "DynamicsWebApi." + functionName, "request.select");

            if (functionName == "retrieve" && request.select.length == 1 && request.select[0].endsWith("/$ref")) {
                url += "/" + request.select[0];
            }
            else {
                if (request.select[0].startsWith("/") && functionName == "retrieve") {
                    if (request.navigationProperty == null) {
                        url += request.select.shift();
                    }
                    else {
                        request.select.shift();
                    }
                }

                //check if anything left in the array
                if (request.select.length) {
                    requestArray.push("$select=" + request.select.join(','));
                }
            }
        }

        if (request.filter) {
            ErrorHelper.stringParameterCheck(request.filter, "DynamicsWebApi." + functionName, "request.filter");
            requestArray.push("$filter=" + request.filter);
        }

        if (request.savedQuery) {
            requestArray.push("savedQuery=" + ErrorHelper.guidParameterCheck(request.savedQuery, "DynamicsWebApi." + functionName, "request.savedQuery"));
        }

        if (request.userQuery) {
            requestArray.push("userQuery=" + ErrorHelper.guidParameterCheck(request.userQuery, "DynamicsWebApi." + functionName, "request.userQuery"));
        }

        if (request.count) {
            ErrorHelper.boolParameterCheck(request.count, "DynamicsWebApi." + functionName, "request.count");
            requestArray.push("$count=" + request.count);
        }

        if (request.top && request.top > 0) {
            ErrorHelper.numberParameterCheck(request.top, "DynamicsWebApi." + functionName, "request.top");
            requestArray.push("$top=" + request.top);
        }

        if (request.orderBy != null && request.orderBy.length) {
            ErrorHelper.arrayParameterCheck(request.orderBy, "DynamicsWebApi." + functionName, "request.orderBy");
            requestArray.push("$orderby=" + request.orderBy.join(','));
        }

        var prefer = buildPreferHeader(request, functionName, config);

        if (prefer.length) {
            headers['Prefer'] = prefer;
        }

        if (request.ifmatch != null && request.ifnonematch != null) {
            throw new Error("DynamicsWebApi." + functionName + ". Either one of request.ifmatch or request.ifnonematch parameters should be used in a call, not both.")
        }

        if (request.ifmatch) {
            ErrorHelper.stringParameterCheck(request.ifmatch, "DynamicsWebApi." + functionName, "request.ifmatch");
            headers['If-Match'] = request.ifmatch;
        }

        if (request.ifnonematch) {
            ErrorHelper.stringParameterCheck(request.ifnonematch, "DynamicsWebApi." + functionName, "request.ifnonematch");
            headers['If-None-Match'] = request.ifnonematch;
        }

        if (request.impersonate) {
            ErrorHelper.stringParameterCheck(request.impersonate, "DynamicsWebApi." + functionName, "request.impersonate");
            headers['MSCRMCallerID'] = ErrorHelper.guidParameterCheck(request.impersonate, "DynamicsWebApi." + functionName, "request.impersonate");
        }

        if (request.token) {
            ErrorHelper.stringParameterCheck(request.token, "DynamicsWebApi." + functionName, "request.token");
            headers["Authorization"] = "Bearer " + request.token;
        }

        if (request.expand && request.expand.length) {
            ErrorHelper.stringOrArrayParameterCheck(request.expand, "DynamicsWebApi." + functionName, "request.expand");
            if (typeof request.expand === "string") {
                requestArray.push("$expand=" + encodeURI(request.expand));
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
                    requestArray.push("$expand=" + encodeURI(expandRequestArray.join(",")));
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
 * @returns {ConvertedRequest}
 */
function convertRequest(request, functionName, config) {

    if (!request.collection) {
        ErrorHelper.parameterCheck(request.collection, "DynamicsWebApi." + functionName, "request.collection");
    }
    else {
        ErrorHelper.stringParameterCheck(request.collection, "DynamicsWebApi." + functionName, "request.collection");
    }

    var url = request.collection.toLowerCase();

    if (request.id) {
        request.id = ErrorHelper.guidParameterCheck(request.id, "DynamicsWebApi." + functionName, "request.id");
        url += "(" + request.id + ")";
    }

    var result = convertRequestOptions(request, functionName, url, '&', config);

    if (result.query)
        result.url += "?" + encodeURI(result.query);

    return { url: result.url, headers: result.headers };
};

var RequestConverter = {
    convertRequestOptions: convertRequestOptions,
    convertRequest: convertRequest
};

module.exports = RequestConverter;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var Utility = {
    /**
     * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
     *
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @returns {string}
     */
    buildFunctionParameters: __webpack_require__(10),

    /**
     * Parses a paging cookie returned in response
     *
     * @param {string} pageCookies - Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.
     * @param {number} currentPageNumber - A current page number. Fix empty paging-cookie for complex fetch xmls.
     * @returns {{cookie: "", number: 0, next: 1}}
     */
    getFetchXmlPagingCookie: __webpack_require__(13),

    /**
     * Converts a response to a reference object
     *
     * @param {Object} responseData - Response object
     * @returns {ReferenceObject}
     */
    convertToReferenceObject: __webpack_require__(12)
}

module.exports = Utility;

/***/ }),
/* 6 */
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
        a = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.exec(value);
        if (a) {
            return new Date(value);
        }
    }
    return value;
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var dateReviver = __webpack_require__(6);

//https://github.com/emiltholin/google-api-batch-utils
function parseBatchResponse(response) {
    // Not the same delimiter in the response as we specify ourselves in the request,
    // so we have to extract it.
    var delimiter = response.substr(0, response.indexOf('\r\n'));
    var parts = response.split(delimiter);
    // The first part will always be an empty string. Just remove it.
    parts.shift();
    // The last part will be the "--". Just remove it.
    parts.pop();

    var result = [];
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var p = part.substring(part.indexOf("{"), part.lastIndexOf("}") + 1);
        result.push(JSON.parse(p, dateReviver));
    }
    return result;
}

/**
 *
 * @param {string} response
 */
module.exports = function parseResponse(response) {
    var responseData = null;
    if (response.length) {
        responseData = response.indexOf('--batchresponse_') > -1 
            ? responseData = parseBatchResponse(response)[0]
            : responseData = JSON.parse(response, dateReviver);
    }

    return responseData;
}

/***/ }),
/* 8 */
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var parseResponse = __webpack_require__(7);
var parseResponseHeaders = __webpack_require__(8);

/**
 * Sends a request to given URL with given parameters
 *
 * @param {string} method - Method of the request.
 * @param {string} uri - Request URI.
 * @param {Function} successCallback - A callback called on success of the request.
 * @param {Function} errorCallback - A callback called when a request failed.
 * @param {string} [data] - Data to send in the request.
 * @param {Object} [additionalHeaders] - Object with headers. IMPORTANT! This object does not contain default headers needed for every request.
 */
var xhrRequest = function (method, uri, data, additionalHeaders, successCallback, errorCallback) {
    var request = new XMLHttpRequest();
    request.open(method, uri, true);
    //request.setRequestHeader("OData-MaxVersion", "4.0");
    //request.setRequestHeader("OData-Version", "4.0");
    //request.setRequestHeader("Accept", "application/json");
    //request.setRequestHeader("Content-Type", "application/json; charset=utf-8");

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
                    var responseData = parseResponse(request.responseText);

                    var response = {
                        data: responseData,
                        headers: parseResponseHeaders(request.getAllResponseHeaders()),
                        status: request.status
                    };

                    successCallback(response);
                    break;
                }
                default: // All other statuses are error cases.
                    var error;
                    try {
                        error = JSON.parse(request.response).error;
                    } catch (e) {
                        if (request.response.length > 0) {
                            error = { message: request.response };
                        }
                        else {
                            error = { message: "Unexpected Error" };
                        }
                    }
                    error.status = request.status;
                    errorCallback(error);
                    break;
            }

            request = null;
        }
    };

    request.onerror = function () {
        errorCallback({ message: "Network Error" });
        request = null;
    };

    request.ontimeout = function (error) {
        errorCallback({ message: "Request Timed Out" });
        request = null;
    };

    data
        ? request.send(data)
        : request.send();
};

module.exports = xhrRequest;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
 *
 * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
 * @returns {string}
 */
module.exports = function buildFunctionParameters(parameters) {
    if (parameters) {
        var parameterNames = Object.keys(parameters);
        var functionParameters = "";
        var urlQuery = "";

        for (var i = 1; i <= parameterNames.length; i++) {
            var parameterName = parameterNames[i - 1];
            var value = parameters[parameterName];

            if (i > 1) {
                functionParameters += ",";
                urlQuery += "&";
            }

            functionParameters += parameterName + "=@p" + i;
            urlQuery += "@p" + i + "=" + ((typeof value == "string") ? "'" + value + "'" : value);
        }

        return "(" + functionParameters + ")?" + urlQuery;
    }
    else {
        return "()";
    }
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var DWA = __webpack_require__(0);
var ErrorHelper = __webpack_require__(1);

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

    if (request.prefer && request.prefer.length) {
        ErrorHelper.stringOrArrayParameterCheck(request.prefer, "DynamicsWebApi." + functionName, "request.prefer");
        var prefer = request.prefer;
        if (typeof prefer === "string") {
            prefer = prefer.split(',');
        }
        for (var i in prefer) {
            var item = prefer[i].trim();
            if (item === DWA.Prefer.ReturnRepresentation) {
                returnRepresentation = true;
            }
            else if (item.startsWith("odata.include-annotations=")) {
                includeAnnotations = item.replace('odata.include-annotations=', '').replace(/"/g,'');
            }
            else if (item.startsWith("odata.maxpagesize=")) {
                maxPageSize = item.replace('odata.maxpagesize=', '').replace(/"/g, '');
            }
        }
    }

    if (config) {
        if (returnRepresentation == null) {
            returnRepresentation = config.returnRepresentation;
        }
        includeAnnotations = includeAnnotations ? includeAnnotations : config.includeAnnotations;
        maxPageSize = maxPageSize ? maxPageSize : config.maxPageSize;
    }

    var prefer = [];

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

    return prefer.join(',');
}

/***/ }),
/* 12 */
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
 * @returns {ReferenceObject}
 */
module.exports = function convertToReferenceObject(responseData) {
    var result = /\/(\w+)\(([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})/i.exec(responseData["@odata.id"]);
    return { id: result[2], collection: result[1], oDataContext: responseData["@odata.context"] };
}

/***/ }),
/* 13 */
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
        }
    }
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var DWA = __webpack_require__(0);
var Utility = __webpack_require__(5);
var RequestConverter = __webpack_require__(4);
var ErrorHelper = __webpack_require__(1);
var sendRequest = __webpack_require__(3);

//string es6 polyfill
if (!String.prototype.endsWith || !String.prototype.startsWith) {
    __webpack_require__(2);
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
 * @property {string} returnRepresentation - Sets Prefer header request with value "return=representation". Use this property to return just created or updated entity in a single request.
 */

/**
 * DynamicsWebApi - a Microsoft Dynamics CRM Web API helper library. Current version uses Promises instead of Callbacks.
 * 
 * @param {DWAConfig} [config] - configuration object
 */
function DynamicsWebApi(config) {

    var _internalConfig = {
        webApiVersion: "8.0",
        webApiUrl: "",
        impersonate: null,
        onTokenRefresh: null,
        includeAnnotations: null,
        maxPageSize: null,
        returnRepresentation: null
    };

    if (!config) {
        config = _internalConfig;
    }

    var _context = function () {

        if (typeof GetGlobalContext != "undefined") {
            return GetGlobalContext();
        }
        else {
            if (typeof Xrm != "undefined") {
                return Xrm.Page.context;
            }
            else {
                throw new Error("Xrm Context is not available.");
            }
        }
    };

    var _getClientUrl = function () {

        var context = _context();

        if (context) {
            var clientUrl = context.getClientUrl();

            if (clientUrl.match(/\/$/)) {
                clientUrl = clientUrl.substring(0, clientUrl.length - 1);
            }
            return clientUrl;
        }

        return "";
    };

    var _initUrl = function () {
        return _getClientUrl() + "/api/data/v" + _internalConfig.webApiVersion + "/";
    };

    /**
     * Sets the configuration parameters for DynamicsWebApi helper.
     *
     * @param {DWAConfig} config - configuration object
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
            _internalConfig.webApiUrl = _initUrl();
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

        if (config.maxPageSize) {
            ErrorHelper.numberParameterCheck(config.maxPageSize, "DynamicsWebApi.setConfig", "config.maxPageSize");
            _internalConfig.maxPageSize = config.maxPageSize;
        }

        if (config.returnRepresentation) {
            ErrorHelper.boolParameterCheck(config.returnRepresentation, "DynamicsWebApi.setConfig", "config.returnRepresentation");
            _internalConfig.returnRepresentation = config.returnRepresentation;
        }
    };

    this.setConfig(config);

    /**
     * Sends a request to given URL with given parameters
     *
     * @param {string} method - Method of the request.
     * @param {string} uri - Request URI.
     * @param {Function} successCallback - A callback called on success of the request.
     * @param {Function} errorCallback - A callback called when a request failed.
     * @param {Object} [data] - Data to send in the request.
     * @param {Object} [additionalHeaders] - Object with additional headers. IMPORTANT! This object does not contain default headers needed for every request.
     */
    var _sendRequest = function (method, uri, data, additionalHeaders, successCallback, errorCallback) {
        sendRequest(method, uri, _internalConfig, data, additionalHeaders, successCallback, errorCallback);
    }

    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {Object} object - A JavaScript object valid for create operations.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string|Array} [prefer] - Sets a Prefer header value. For example: ['retrun=representation', 'odata.include-annotations="*"'].
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     */
    this.create = function (object, collection, successCallback, errorCallback, prefer, select) {

        ErrorHelper.parameterCheck(object, "DynamicsWebApi.create", "object");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.create", "collection");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.create", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.create", "errorCallback");

        if (prefer) {
            ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.create", "prefer");
        }

        if (select) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.create", "select");
        }

        var request = {
            collection: collection,
            select: select,
            prefer: prefer
        };

        var result = RequestConverter.convertRequest(request, "create", _internalConfig);

        var onSuccess = function (response) {
            if (response.data) {
                successCallback(response.data);
            }
            else {
                var entityUrl = response.headers['OData-EntityId']
                    ? response.headers['OData-EntityId']
                    : response.headers['odata-entityid'];
                var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                successCallback(id);
            }
        }

        _sendRequest("POST", result.url, object, result.headers, onSuccess, errorCallback);
    };

    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.updateRequest = function (request, successCallback, errorCallback) {

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.update", "request");
        ErrorHelper.parameterCheck(request.entity, "DynamicsWebApi.update", "request.entity");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.update", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.update", "errorCallback");

        var result = RequestConverter.convertRequest(request, "update", _internalConfig);

        if (request.ifmatch == null) {
            result.headers['If-Match'] = '*'; //to prevent upsert
        }

        var onSuccess = function (response) {
            response.data
                ? successCallback(response.data)
                : successCallback(true);
        };

        //copy locally
        var ifmatch = request.ifmatch;
        var onError = function (xhr) {
            if (ifmatch && xhr.status == 412) {
                //precondition failed - not deleted
                successCallback(false);
            }
            else {
                //rethrow error otherwise
                errorCallback(xhr);
            }
        };

        _sendRequest("PATCH", result.url, request.entity, result.headers, onSuccess, onError);
    }

    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {string} id - A String representing the GUID value for the record to update.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     */
    this.update = function (id, collection, object, successCallback, errorCallback, prefer, select) {

        ErrorHelper.stringParameterCheck(id, "DynamicsWebApi.update", "id");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.update", "id")
        ErrorHelper.parameterCheck(object, "DynamicsWebApi.update", "object");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.update", "collection");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.update", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.update", "errorCallback");

        if (prefer) {
            ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.update", "prefer");
        }

        if (select) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.update", "select");
        }

        var request = {
            collection: collection,
            id: id,
            select: select,
            prefer: prefer,
            entity: object
        };

        this.updateRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param {string} id - A String representing the GUID value for the record to update.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Object} keyValuePair - keyValuePair object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"}
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     */
    this.updateSingleProperty = function (id, collection, keyValuePair, successCallback, errorCallback, prefer, select) {

        ErrorHelper.stringParameterCheck(id, "DynamicsWebApi.updateSingleProperty", "id");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.updateSingleProperty", "id");
        ErrorHelper.parameterCheck(keyValuePair, "DynamicsWebApi.updateSingleProperty", "keyValuePair");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.updateSingleProperty", "collection");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.updateSingleProperty", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.updateSingleProperty", "errorCallback");

        if (prefer) {
            ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.updateSingleProperty", "prefer");
        }

        if (select) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.updateSingleProperty", "select");
        }

        var key = Object.keys(keyValuePair)[0];
        var keyValue = keyValuePair[key];

        var request = {
            collection: collection,
            id: id,
            select: select,
            prefer: prefer,
            navigationProperty: key
        };

        var result = RequestConverter.convertRequest(request, "updateSingleProperty", _internalConfig);

        var onSuccess = function (response) {
            response.data
                ? successCallback(response.data)
                : successCallback();
        };

        _sendRequest("PUT", result.url, { value: keyValue }, result.headers, onSuccess, errorCallback);
    };

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.deleteRequest = function (request, successCallback, errorCallback) {

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.delete", "request")
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.delete", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.delete", "errorCallback");

        var result = RequestConverter.convertRequest(request, "delete", _internalConfig);

        var onSuccess = function () {
            successCallback(true);
        };

        //copy locally
        var ifmatch = request.ifmatch;
        var onError = function (xhr) {
            if (ifmatch && xhr.status == 412) {
                //precondition failed - not deleted
                successCallback(false);
            }
            else {
                //rethrow error otherwise
                errorCallback(xhr);
            }
        };

        _sendRequest("DELETE", result.url, null, result.headers, onSuccess, onError);
    }

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {string} id - A String representing the GUID value for the record to delete.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [propertyName] - The name of the property which needs to be emptied. Instead of removing a whole record only the specified property will be cleared.
     */
    this.deleteRecord = function (id, collection, successCallback, errorCallback, propertyName) {

        ErrorHelper.stringParameterCheck(id, "DynamicsWebApi.delete", "id");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.delete", "id");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.delete", "collection");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.delete", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.delete", "errorCallback");

        if (propertyName != null)
            ErrorHelper.stringParameterCheck(propertyName, "DynamicsWebApi.delete", "propertyName");

        var url = collection.toLowerCase() + "(" + id + ")";

        if (propertyName != null)
            url += "/" + propertyName;

        var onSuccess = function (xhr) {
            // Nothing is returned to the success function.
            successCallback();
        };

        _sendRequest("DELETE", url, null, null, onSuccess, errorCallback);
    };

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.retrieveRequest = function (request, successCallback, errorCallback) {

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieve", "request")
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.retrieve", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieve", "errorCallback");

        var result = RequestConverter.convertRequest(request, "retrieve", _internalConfig);

        //copy locally
        var select = request.select;
        var onSuccess = function (response) {
            if (select != null && select.length == 1 && select[0].endsWith("/$ref") && response.data["@odata.id"] != null) {
                successCallback(Utility.convertToReferenceObject(response.data));
            }
            else {
                successCallback(response.data);
            }
        };

        _sendRequest("GET", result.url, null, result.headers, onSuccess, errorCallback);
    }

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {string} id - A String representing the GUID value for the record to retrieve.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     */
    this.retrieve = function (id, collection, successCallback, errorCallback, select, expand) {

        ErrorHelper.stringParameterCheck(id, "DynamicsWebApi.retrieve", "id");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.retrieve", "id")
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.retrieve", "collection");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.retrieve", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieve", "errorCallback");

        if (select && select.length) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.retrieve", "select");
        }

        if (expand && expand.length) {
            ErrorHelper.stringOrArrayParameterCheck(expand, "DynamicsWebApi.retrieve", "expand");
        }

        var request = {
            collection: collection,
            id: id,
            select: select,
            expand: expand
        };

        this.retrieveRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.upsertRequest = function (request, successCallback, errorCallback) {

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.upsert", "request");
        ErrorHelper.parameterCheck(request.entity, "DynamicsWebApi.upsert", "request.entity");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.upsert", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.upsert", "errorCallback");

        var result = RequestConverter.convertRequest(request, "upsert", _internalConfig);

        //copy locally
        var ifnonematch = request.ifnonematch;
        var ifmatch = request.ifmatch;
        var onSuccess = function (response) {
            if (response.headers['OData-EntityId'] || response.headers['odata-entityid']) {
                var entityUrl = response.headers['OData-EntityId']
                    ? response.headers['OData-EntityId']
                    : response.headers['odata-entityid'];
                var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                successCallback(id);
            }
            else if (response.data) {
                successCallback(response.data);
            }
            else {
                successCallback();
            }
        };

        var onError = function (xhr) {
            if (ifnonematch && xhr.status == 412) {
                //if prevent update
                successCallback();
            }
            else if (ifmatch && xhr.status == 404) {
                //if prevent create
                successCallback();
            }
            else {
                //rethrow error otherwise
                errorCallback(xhr);
            }
        };

        _sendRequest("PATCH", result.url, request.entity, result.headers, onSuccess, onError);
    }

    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {string} id - A String representing the GUID value for the record to upsert.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     */
    this.upsert = function (id, collection, object, successCallback, errorCallback, prefer, select) {

        ErrorHelper.stringParameterCheck(id, "DynamicsWebApi.upsert", "id");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.upsert", "id")

        ErrorHelper.parameterCheck(object, "DynamicsWebApi.upsert", "object");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.upsert", "collection");

        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.upsert", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.upsert", "errorCallback");

        if (prefer) {
            ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.upsert", "prefer");
        }

        if (select) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.upsert", "select");
        }

        var request = {
            collection: collection,
            id: id,
            select: select,
            prefer: prefer,
            entity: object
        };

        this.upsertRequest(request, successCallback, errorCallback);
    }

    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
     *
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     */
    this.count = function (collection, successCallback, errorCallback, filter) {

        if (filter == null || (filter != null && !filter.length)) {
            ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.count", "collection");
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.count", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.count", "errorCallback");

            //if filter has not been specified then simplify the request

            var onSuccess = function (response) {
                successCallback(response.data ? parseInt(response.data) : 0);
            };

            _sendRequest("GET", collection.toLowerCase() + "/$count", null, null, onSuccess, errorCallback)
        }
        else {
            return this.retrieveMultipleRequest({
                collection: collection,
                filter: filter,
                count: true
            }, function (response) {
                successCallback(response.oDataCount ? response.oDataCount : 0);
            }, errorCallback);
        }
    }

    /**
     * Sends an asynchronous request to count records. Returns: Number
     *
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     */
    this.countAll = function (collection, successCallback, errorCallback, filter, select) {
        return this.retrieveAllRequest({
            collection: collection,
            filter: filter,
            select: select
        }, function (response) {
            successCallback(response
                ? (response.value ? response.value.length : 0)
                : 0);
        }, errorCallback);
    }

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     */
    this.retrieveMultiple = function (collection, successCallback, errorCallback, select, filter, nextPageLink) {

        return this.retrieveMultipleRequest({
            collection: collection,
            select: select,
            filter: filter
        }, successCallback, errorCallback, nextPageLink);
    }

    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     */
    this.retrieveAll = function (collection, successCallback, errorCallback, select, filter) {
        return _retrieveAllRequest({
            collection: collection,
            select: select,
            filter: filter
        }, successCallback, errorCallback);
    }

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     */
    var retrieveMultipleRequest = function (request, successCallback, errorCallback, nextPageLink) {

        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.retrieveMultiple", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieveMultiple", "errorCallback");

        if (nextPageLink && !request.collection) {
            request.collection = "any";
        }

        var result = RequestConverter.convertRequest(request, "retrieveMultiple", _internalConfig);

        if (nextPageLink) {
            ErrorHelper.stringParameterCheck(nextPageLink, "DynamicsWebApi.retrieveMultiple", "nextPageLink");
            result.url = nextPageLink.replace(_internalConfig.webApiUrl, "");
        }

        //copy locally
        var toCount = request.count;

        var onSuccess = function (response) {
            if (response.data['@odata.nextLink'] != null) {
                response.data.oDataNextLink = response.data['@odata.nextLink'];
            }
            if (toCount) {
                response.data.oDataCount = response.data['@odata.count'] != null
                    ? parseInt(response.data['@odata.count'])
                    : 0;
            }
            if (response.data['@odata.context'] != null) {
                response.data.oDataContext = response.data['@odata.context'];
            }

            successCallback(response.data);
        };

        _sendRequest("GET", result.url, null, result.headers, onSuccess, errorCallback);
    }

    this.retrieveMultipleRequest = retrieveMultipleRequest;

    var _retrieveAllRequest = function (request, successCallback, errorCallback, nextPageLink, records) {

        var records = records || [];

        var internalSuccessCallback = function (response) {
            records = records.concat(response.value);

            if (response.oDataNextLink) {
                _retrieveAllRequest(request, successCallback, errorCallback, response.oDataNextLink, records);
            }
            else {
                successCallback({ value: records });
            }
        };

        retrieveMultipleRequest(request, internalSuccessCallback, errorCallback, nextPageLink);
    };

    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.retrieveAllRequest = function (request, successCallback, errorCallback) {
        _retrieveAllRequest(request, successCallback, errorCallback);
    }

    /**
     * Sends an asynchronous request to count records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param {string} collection - An object that represents all possible options for a current request.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {number} [pageNumber] - Page number.
     * @param {string} [pagingCookie] - Paging cookie. For retrieving the first page, pagingCookie should be null.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    var executeFetchXml = function (collection, fetchXml, successCallback, errorCallback, includeAnnotations, pageNumber, pagingCookie, impersonateUserId) {

        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.executeFetchXml", "collection");
        ErrorHelper.stringParameterCheck(fetchXml, "DynamicsWebApi.executeFetchXml", "fetchXml");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.executeFetchXml", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.executeFetchXml", "errorCallback");

        if (pageNumber == null) {
            pageNumber = 1;
        }

        ErrorHelper.numberParameterCheck(pageNumber, "DynamicsWebApi.executeFetchXml", "pageNumber");
        var replacementString = '$1 page="' + pageNumber + '"';

        if (pagingCookie != null) {
            ErrorHelper.stringParameterCheck(pagingCookie, "DynamicsWebApi.executeFetchXml", "pagingCookie");
            replacementString += ' paging-cookie="' + pagingCookie + '"';
        }

        //add page number and paging cookie to fetch xml
        fetchXml = fetchXml.replace(/^(<fetch[\w\d\s'"=]+)/, replacementString);

        if (includeAnnotations) {
            ErrorHelper.stringParameterCheck(includeAnnotations, "DynamicsWebApi.executeFetchXml", "includeAnnotations");
        }

        if (impersonateUserId) {
            impersonateUserId = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.executeFetchXml", "impersonateUserId");
        }

        var request = {
            collection: collection,
            includeAnnotations: includeAnnotations,
            impersonate: impersonateUserId
        };

        var result = RequestConverter.convertRequest(request, "executeFetchXml", _internalConfig);

        var encodedFetchXml = encodeURIComponent(fetchXml);

        var onSuccess = function (response) {
            if (response.data['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'] != null) {
                response.data.PagingInfo = Utility.getFetchXmlPagingCookie(response.data['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'], pageNumber);
            }

            if (response.data['@odata.context'] != null) {
                response.data.oDataContext = response.data['@odata.context'];
            }

            successCallback(response.data);
        };

        _sendRequest("GET", result.url + "?fetchXml=" + encodedFetchXml, null, result.headers, onSuccess, errorCallback);
    }

    this.fetch = this.executeFetchXml = executeFetchXml;

    var _executeFetchXmlAll = function (collection, fetchXml, successCallback, errorCallback, includeAnnotations, pageNumber, pagingCookie, impersonateUserId, records) {
        var records = records || [];

        var internalSuccessCallback = function (response) {
            records = records.concat(response.value);

            if (response.PagingInfo) {
                _executeFetchXmlAll(collection, fetchXml, successCallback, errorCallback, includeAnnotations, response.PagingInfo.nextPage, response.PagingInfo.cookie, impersonateUserId, records);
            }
            else {
                successCallback({ value: records });
            }
        };

        executeFetchXml(collection, fetchXml, internalSuccessCallback, errorCallback, includeAnnotations, pageNumber, pagingCookie, impersonateUserId);
    }

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param {string} collection - An object that represents all possible options for a current request.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.fetchAll = this.executeFetchXmlAll = function (collection, fetchXml, successCallback, errorCallback, includeAnnotations, impersonateUserId) {
        return _executeFetchXmlAll(collection, fetchXml, successCallback, errorCallback, includeAnnotations, null, null, impersonateUserId);
    }

    /**
     * Associate for a collection-valued navigation property. (1:N or N:N)
     *
     * @param {string} primaryCollection - Primary entity collection name.
     * @param {string} primaryId - Primary entity record id.
     * @param {string} relationshipName - Relationship name.
     * @param {string} relatedCollection - Related colletion name.
     * @param {string} relatedId - Related entity record id.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.associate = function (primarycollection, primaryId, relationshipName, relatedcollection, relatedId, successCallback, errorCallback, impersonateUserId) {

        ErrorHelper.stringParameterCheck(primarycollection, "DynamicsWebApi.associate", "primarycollection");
        ErrorHelper.stringParameterCheck(relatedcollection, "DynamicsWebApi.associate", "relatedcollection");
        ErrorHelper.stringParameterCheck(relationshipName, "DynamicsWebApi.associate", "relationshipName");
        primaryId = ErrorHelper.guidParameterCheck(primaryId, "DynamicsWebApi.associate", "primaryId");
        relatedId = ErrorHelper.guidParameterCheck(relatedId, "DynamicsWebApi.associate", "relatedId");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.associate", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.associate", "errorCallback");

        var onSuccess = function () {
            successCallback();
        };

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        var object = { "@odata.id": _internalConfig.webApiUrl + relatedcollection + "(" + relatedId + ")" };

        _sendRequest("POST",
            primarycollection + "(" + primaryId + ")/" + relationshipName + "/$ref", object, header,
            onSuccess, errorCallback);
    }

    /**
     * Disassociate for a collection-valued navigation property.
     *
     * @param {string} primaryCollection - Primary entity collection name.
     * @param {string} primaryId - Primary entity record id.
     * @param {string} relationshipName - Relationship name.
     * @param {string} relatedId - Related entity record id.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.disassociate = function (primarycollection, primaryId, relationshipName, relatedId, successCallback, errorCallback, impersonateUserId) {

        ErrorHelper.stringParameterCheck(primarycollection, "DynamicsWebApi.disassociate", "primarycollection");
        ErrorHelper.stringParameterCheck(relationshipName, "DynamicsWebApi.disassociate", "relationshipName");
        primaryId = ErrorHelper.guidParameterCheck(primaryId, "DynamicsWebApi.disassociate", "primaryId");
        relatedId = ErrorHelper.guidParameterCheck(relatedId, "DynamicsWebApi.disassociate", "relatedId");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.disassociate", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.disassociate", "errorCallback");

        var onSuccess = function () {
            successCallback();
        };

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        _sendRequest("DELETE", primarycollection + "(" + primaryId + ")/" + relationshipName + "(" + relatedId + ")/$ref", null, header,
            onSuccess, errorCallback);
    }

    /**
     * Associate for a single-valued navigation property. (1:N)
     *
     * @param {string} collection - Entity collection name that contains an attribute.
     * @param {string} id - Entity record Id that contains an attribute.
     * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param {string} relatedCollection - Related collection name that the lookup (attribute) points to.
     * @param {string} relatedId - Related entity record id that needs to be associated.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.associateSingleValued = function (collection, id, singleValuedNavigationPropertyName, relatedcollection, relatedId, successCallback, errorCallback, impersonateUserId) {

        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.associateSingleValued", "collection");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.associateSingleValued", "id");
        relatedId = ErrorHelper.guidParameterCheck(relatedId, "DynamicsWebApi.associateSingleValued", "relatedId");
        ErrorHelper.stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.associateSingleValued", "singleValuedNavigationPropertyName");
        ErrorHelper.stringParameterCheck(relatedcollection, "DynamicsWebApi.associateSingleValued", "relatedcollection");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.associateSingleValued", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.associateSingleValued", "errorCallback");

        var onSuccess = function () {
            successCallback();
        };

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        var object = { "@odata.id": _internalConfig.webApiUrl + relatedcollection + "(" + relatedId + ")" };

        _sendRequest("PUT",
            collection + "(" + id + ")/" + singleValuedNavigationPropertyName + "/$ref", object, header,
            onSuccess, errorCallback);
    }

    /**
     * Removes a reference to an entity for a single-valued navigation property. (1:N)
     *
     * @param {string} collection - Entity collection name that contains an attribute.
     * @param {string} id - Entity record Id that contains an attribute.
     * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.disassociateSingleValued = function (collection, id, singleValuedNavigationPropertyName, successCallback, errorCallback, impersonateUserId) {

        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.disassociateSingleValued", "collection");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.disassociateSingleValued", "id");
        ErrorHelper.stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.disassociateSingleValued", "singleValuedNavigationPropertyName");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.disassociateSingleValued", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.disassociateSingleValued", "errorCallback");

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        var onSuccess = function () {
            successCallback();
        };

        _sendRequest("DELETE", collection + "(" + id + ")/" + singleValuedNavigationPropertyName + "/$ref", null, header,
            onSuccess, errorCallback);
    }

    /**
     * Executes an unbound function (not bound to a particular entity record)
     *
     * @param {string} functionName - The name of the function.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.executeUnboundFunction = function (functionName, successCallback, errorCallback, parameters, impersonateUserId) {
        return _executeFunction(functionName, parameters, null, null, successCallback, errorCallback, impersonateUserId);
    }

    /**
     * Executes a bound function
     *
     * @param {string} id - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
     * @param {string} functionName - The name of the function.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.executeBoundFunction = function (id, collection, functionName, successCallback, errorCallback, parameters, impersonateUserId) {
        return _executeFunction(functionName, parameters, collection, id, successCallback, errorCallback, impersonateUserId);
    }

    /**
     * Executes a function
     *
     * @param {string} id - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
     * @param {string} functionName - The name of the function.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    var _executeFunction = function (functionName, parameters, collection, id, successCallback, errorCallback, impersonateUserId) {

        ErrorHelper.stringParameterCheck(functionName, "DynamicsWebApi.executeFunction", "functionName");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.executeFunction", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.executeFunction", "errorCallback");
        var url = functionName + Utility.buildFunctionParameters(parameters);

        if (collection != null) {
            ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.executeFunction", "collection");
            id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.executeFunction", "id");

            url = collection + "(" + id + ")/" + url;
        }

        var header = {};

        if (impersonateUserId) {
            header["MSCRMCallerID"] = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.executionFunction", "impersonateUserId");
        }

        var onSuccess = function (response) {
            response.data
                ? successCallback(response.data)
                : successCallback();
        };

        _sendRequest("GET", url, null, header, onSuccess, errorCallback);
    }

    /**
     * Executes an unbound Web API action (not bound to a particular entity record)
     *
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} requestObject - Action request body object.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.executeUnboundAction = function (actionName, requestObject, successCallback, errorCallback, impersonateUserId) {

        return _executeAction(actionName, requestObject, null, null, successCallback, errorCallback, impersonateUserId);
    }

    /**
     * Executes a bound Web API action (bound to a particular entity record)
     *
     * @param {string} id - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} requestObject - Action request body object.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.executeBoundAction = function (id, collection, actionName, requestObject, successCallback, errorCallback, impersonateUserId) {
        return _executeAction(actionName, requestObject, collection, id, successCallback, errorCallback, impersonateUserId);
    }

    /**
     * Executes a Web API action
     *
     * @param {string} [id] - A String representing the GUID value for the record.
     * @param {string} [collection] - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} requestObject - Action request body object.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    var _executeAction = function (actionName, requestObject, collection, id, successCallback, errorCallback, impersonateUserId) {

        ErrorHelper.stringParameterCheck(actionName, "DynamicsWebApi.executeAction", "actionName");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.executeAction", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.executeAction", "errorCallback");
        var url = actionName;

        if (collection != null) {
            ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.executeAction", "collection");
            id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.executeAction", "id");

            url = collection + "(" + id + ")/" + url;
        }

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        var onSuccess = function (response) {
            response.data
                ? successCallback(response.data)
                : successCallback();
        };

        _sendRequest("POST", url, requestObject, header, onSuccess, errorCallback);
    }

    /**
     * Creates a new instance of DynamicsWebApi
     *
     * @param {DWAConfig} [config] - configuration object.
     * @returns {DynamicsWebApi}
     */
    this.initializeInstance = function (config) {

        if (!config) {
            config = _internalConfig;
        }

        return new DynamicsWebApi(config);
    }
};

module.exports = DynamicsWebApi;

/***/ })
/******/ ]);
});