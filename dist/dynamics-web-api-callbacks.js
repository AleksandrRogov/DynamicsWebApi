/*! dynamics-web-api-callbacks v1.4.2 (c) 2018 Aleksandr Rogov */
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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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

    /**
     * @param parameter {string} - parameter
     *
     */
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
                for (var i = 0; i < alternateKeys.length; i++){
                    alternateKeys[i] = alternateKeys[i].trim();
                    /^[\w\d\_]+\='[^\'\r\n]+'$/i.exec(alternateKeys[i])[0];
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
var ErrorHelper = __webpack_require__(1);
var buildPreferHeader = __webpack_require__(12);

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
 * @returns {ConvertedRequestOptions}
 */
function convertRequestOptions(request, functionName, url, joinSymbol, config) {
    var headers = {};
    var requestArray = [];
    joinSymbol = joinSymbol != null ? joinSymbol : "&";

    if (request) {
        if (request.navigationProperty) {
            ErrorHelper.stringParameterCheck(request.navigationProperty, 'DynamicsWebApi.' + functionName, "request.navigationProperty");
            url += "/" + request.navigationProperty;
        }

        if (request.select != null && request.select.length) {
            ErrorHelper.arrayParameterCheck(request.select, 'DynamicsWebApi.' + functionName, "request.select");

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
            ErrorHelper.stringParameterCheck(request.filter, 'DynamicsWebApi.' + functionName, "request.filter");
            var removeBracketsFromGuidReg = /[^"']{([\w\d]{8}[-]?(?:[\w\d]{4}[-]?){3}[\w\d]{12})}(?:[^"']|$)/g;
            var filterResult = request.filter.replace(removeBracketsFromGuidReg, ' $1 ').trim();
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
            throw new Error('DynamicsWebApi.' + functionName + ". Either one of request.ifmatch or request.ifnonematch parameters should be used in a call, not both.")
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
 * @returns {ConvertedRequest}
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
};

var RequestConverter = {
    convertRequestOptions: convertRequestOptions,
    convertRequest: convertRequest
};

module.exports = RequestConverter;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

function isNull (value) {
    return typeof value === "undefined" || typeof value === "unknown" || value == null;
};

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
};

function getXrmContext() {
    if (typeof GetGlobalContext != 'undefined') {
        return GetGlobalContext();
    }
    else {
        if (typeof Xrm != 'undefined') {
            //d365 v.9.0
            if ((!isNull(Xrm.Utility) && !isNull(Xrm.Utility.getGlobalContext))) {
                return Xrm.Utility.getGlobalContext();
            }
            else if (!isNull(Xrm.Page) && !isNull(Xrm.Page.context)) {
                return Xrm.Page.context;
            }
        }
    }

    throw new Error('Xrm Context is not available. In most cases, it can be resolved by adding a reference to a ClientGlobalContext.js.aspx. Please refer to MSDN documentation for more details.');
};

function getClientUrl() {
    var context = getXrmContext();

    if (context) {
        var clientUrl = context.getClientUrl();

        if (clientUrl.match(/\/$/)) {
            clientUrl = clientUrl.substring(0, clientUrl.length - 1);
        }
        return clientUrl;
    }

    return '';
};

function initWebApiUrl(version) {
    return getClientUrl() + '/api/data/v' + version + '/';
};

function getXrmInternal() {
    //todo: Xrm.Internal namespace is not supported
    if (typeof Xrm !== 'undefined') {
        return Xrm.Internal;
    }

    return null;
};

var Utility = {
    /**
     * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
     *
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @returns {string}
     */
    buildFunctionParameters: __webpack_require__(11),

    /**
     * Parses a paging cookie returned in response
     *
     * @param {string} pageCookies - Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.
     * @param {number} currentPageNumber - A current page number. Fix empty paging-cookie for complex fetch xmls.
     * @returns {{cookie: "", number: 0, next: 1}}
     */
    getFetchXmlPagingCookie: __webpack_require__(14),

    /**
     * Converts a response to a reference object
     *
     * @param {Object} responseData - Response object
     * @returns {ReferenceObject}
     */
    convertToReferenceObject: __webpack_require__(13),

    /**
     * Checks whether the value is JS Null.
     * @param {Object} value
     * @returns {boolean}
     */
    isNull: isNull,

    generateUUID: generateUUID,

    getXrmContext: getXrmContext,

    getXrmInternal: getXrmInternal,

    getClientUrl: getClientUrl,

    initWebApiUrl: initWebApiUrl
}

module.exports = Utility;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var DWA = __webpack_require__(0);
var Utility = __webpack_require__(4);
var RequestConverter = __webpack_require__(3);

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
    if (!Utility.isNull(xrmInternal)) {
        var collectionName = xrmInternal.getEntitySetName(entityName);
        return collectionName || entityName;
    }

    var collectionName = null;

    if (!Utility.isNull(_entityNames)) {
        collectionName = _entityNames[entityName];
        if (Utility.isNull(collectionName)) {
            for (var key in _entityNames) {
                if (_entityNames[key] == entityName) {
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
                if (typeof value === 'string') {
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

                    //add full web api url if it's not set
                    if (!value.startsWith(config.webApiUrl)) {
                        value = config.webApiUrl + value.replace(/^\\/, '');
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
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
        });
    }

    return stringifiedData;
}

/**
 * Sends a request to given URL with given parameters
 *
 * @param {string} method - Method of the request.
 * @param {string} path - Request path.
 * @param {Function} successCallback - A callback called on success of the request.
 * @param {Function} errorCallback - A callback called when a request failed.
 * @param {Object} config - DynamicsWebApi config.
 * @param {Object} [data] - Data to send in the request.
 * @param {Object} [additionalHeaders] - Object with additional headers. IMPORTANT! This object does not contain default headers needed for every request.
 * @param {boolean} [isAsync] - Indicates whether the request should be made synchronously or asynchronously.
 * @returns {Promise}
 */
function sendRequest(method, path, config, data, additionalHeaders, successCallback, errorCallback, isAsync) {

    if (!additionalHeaders) {
        additionalHeaders = {};
    }

    additionalHeaders = setStandardHeaders(additionalHeaders);

    //stringify passed data
    var stringifiedData = stringifyData(data, config);

    //if the URL contains more characters than max possible limit, convert the request to a batch request
    if (path.length > 2000) {
        var batchBoundary = 'dwa_batch_' + Utility.generateUUID();

        var batchBody = [];
        batchBody.push('--' + batchBoundary);
        batchBody.push('Content-Type: application/http');
        batchBody.push('Content-Transfer-Encoding: binary\n');
        batchBody.push(method + ' ' + config.webApiUrl + path + ' HTTP/1.1');

        for (var key in additionalHeaders) {
            batchBody.push(key + ': ' + additionalHeaders[key]);
            delete additionalHeaders[key];
        }

        batchBody.push('\n--' + batchBoundary + '--');

        stringifiedData = batchBody.join('\n');

        additionalHeaders = setStandardHeaders(additionalHeaders);
        additionalHeaders['Content-Type'] = 'multipart/mixed;boundary=' + batchBoundary;
        path = '$batch';
        method = 'POST';
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
            additionalHeaders['Authorization'] = 'Bearer ' + token.accessToken;
        }

        executeRequest(method, config.webApiUrl + path, stringifiedData, additionalHeaders, successCallback, errorCallback, isAsync);
    };

    //call a token refresh callback only if it is set and there is no "Authorization" header set yet
    if (config.onTokenRefresh && (!additionalHeaders || (additionalHeaders && !additionalHeaders['Authorization']))) {
        config.onTokenRefresh(sendInternalRequest);
    }
    else {
        sendInternalRequest();
    }
};

function _getEntityNames(entityName, config, successCallback, errorCallback) {

    var resolve = function (result) {
        _entityNames = {};
        for (var i = 0; i < result.data.value.length; i++) {
            _entityNames[result.data.value[i].LogicalName] = result.data.value[i].LogicalCollectionName;
        }

        successCallback(findCollectionName(entityName));
    };

    var reject = function (error) {
        errorCallback({ message: 'Unable to fetch EntityDefinitions. Error: ' + error.message });
    };

    var request = RequestConverter.convertRequest({
        collection: 'EntityDefinitions',
        select: ['LogicalCollectionName', 'LogicalName'],
        noCache: true
    }, 'retrieveMultiple', config);

    sendRequest('GET', request.url, config, null, request.headers, resolve, reject, request.async);
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
};

function makeRequest(method, request, functionName, config, resolve, reject) {
    var successCallback = function (collectionName) {
        request.collection = collectionName;
        var result = RequestConverter.convertRequest(request, functionName, config);
        sendRequest(method, result.url, config, request.data || request.entity, result.headers, resolve, reject, result.async);
    }
    _getCollectionName(request.collection, config, successCallback, reject);
};

module.exports = {
    sendRequest: sendRequest,
    makeRequest: makeRequest,
    getCollectionName: findCollectionName,

}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var DWA = __webpack_require__(0);
var Utility = __webpack_require__(4);
var RequestConverter = __webpack_require__(3);
var ErrorHelper = __webpack_require__(1);
var Request = __webpack_require__(5);

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
 * @property {boolean} returnRepresentation - Sets Prefer header request with value "return=representation". Use this property to return just created or updated entity in a single request.
 * @property {boolean} useEntityNames - Indicates whether to use Entity Logical Names instead of Collection Logical Names.
*/

/**
 * Dynamics Web Api Request
 * @typedef {Object} DWARequest
 * @property {boolean} async - XHR requests only! Indicates whether the requests should be made synchronously or asynchronously. Default value is true (asynchronously).
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
 * @property {boolean} noCache - If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'. Default value is 'false'.
 * @property {string} savedQuery - A String representing the GUID value of the saved query.
 * @property {string} userQuery - A String representing the GUID value of the user query.
 * @property {boolean} mergeLabels - If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false'
 */

/**
 * Constructor.
 * @constructor
 * @param {DWAConfig} [config] - configuration object
 * @example
   //Empty constructor (will work only inside CRM/D365)
   *var dynamicsWebApi = new DynamicsWebApi();
  * @example
   //Constructor with a configuration parameter (only for CRM/D365)
   *var dynamicsWebApi = new DynamicsWebApi({ webApiVersion: '9.0' });
  * @example
   //Constructor with a configuration parameter for CRM/D365 and Node.js
   *var dynamicsWebApi = new DynamicsWebApi({
   *    webApiUrl: 'https:/myorg.api.crm.dynamics.com/api/data/v9.0/',
   *    includeAnnotations: 'OData.Community.Display.V1.FormattedValue'
   *});
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

    var _makeRequest = function (method, request, functionName, successCallback, errorCallback) {
        Request.makeRequest(method, request, functionName, _internalConfig, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
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
        *dynamicsWebApi.createRequest(request, function (response) {
        *}, function (error) {
        *});
     */
    this.createRequest = function (request, successCallback, errorCallback) {
        ErrorHelper.parameterCheck(request, 'DynamicsWebApi.create', 'request');
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.create", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.create", "errorCallback");

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

        _makeRequest("POST", request, 'create', onSuccess, errorCallback);
    };

    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {Object} object - A JavaScript object valid for create operations.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string|Array} [prefer] - Sets a Prefer header value. For example: ['retrun=representation', 'odata.include-annotations="*"'].
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @example
        *var lead = {
        *    subject: "Test WebAPI",
        *    firstname: "Test",
        *    lastname: "WebAPI",
        *    jobtitle: "Title"
        *};
        *
        *dynamicsWebApi.create(lead, "leads", function (id) {
        *}, function (error) {
        *});
     */
    this.create = function (object, collection, successCallback, errorCallback, prefer, select) {

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

        this.createRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.updateRequest = function (request, successCallback, errorCallback) {

        ErrorHelper.parameterCheck(request, 'DynamicsWebApi.update', 'request');
        ErrorHelper.callbackParameterCheck(successCallback, 'DynamicsWebApi.update', 'successCallback');
        ErrorHelper.callbackParameterCheck(errorCallback, 'DynamicsWebApi.update', 'errorCallback');

        if (request.ifmatch == null) {
            request.ifmatch = '*'; //to prevent upsert
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

        //EntityDefinitions cannot be updated using "PATCH" method
        var method = request.collection.indexOf('EntityDefinitions') > -1 ? 'PUT' : 'PATCH';

        _makeRequest(method, request, 'update', onSuccess, onError);
    }

    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key(s) for the record to update.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     */
    this.update = function (key, collection, object, successCallback, errorCallback, prefer, select) {

        ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.update", "key");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.update", "key");
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
            key: key,
            select: select,
            prefer: prefer,
            entity: object
        };

        this.updateRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key(s) for the record to update.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Object} keyValuePair - keyValuePair object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"}
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     */
    this.updateSingleProperty = function (key, collection, keyValuePair, successCallback, errorCallback, prefer, select) {

        ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.updateSingleProperty", "key");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.updateSingleProperty", "key");
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

        var field = Object.keys(keyValuePair)[0];
        var fieldValue = keyValuePair[field];

        var request = {
            collection: collection,
            key: key,
            select: select,
            prefer: prefer,
            navigationProperty: field,
            data: { value: fieldValue }
        };

        var onSuccess = function (response) {
            response.data
                ? successCallback(response.data)
                : successCallback();
        };

        _makeRequest('PUT', request, 'updateSingleProperty', onSuccess, errorCallback);
    };

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.deleteRequest = function (request, successCallback, errorCallback) {

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.delete", "request")
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.delete", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.delete", "errorCallback");

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

        _makeRequest('DELETE', request, 'delete', onSuccess, onError);
    }

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key(s) for the record to delete.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [propertyName] - The name of the property which needs to be emptied. Instead of removing a whole record only the specified property will be cleared.
     */
    this.deleteRecord = function (key, collection, successCallback, errorCallback, propertyName) {

        ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.delete", "key");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.delete", "key");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.delete", "collection");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.delete", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.delete", "errorCallback");

        if (propertyName != null)
            ErrorHelper.stringParameterCheck(propertyName, "DynamicsWebApi.delete", "propertyName");

        var onSuccess = function (xhr) {
            // Nothing is returned to the success function.
            successCallback();
        };

        var request = {
            key: key,
            collection: collection,
            navigationProperty: propertyName
        };

        _makeRequest('DELETE', request, 'delete', onSuccess, errorCallback);
    };

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.retrieveRequest = function (request, successCallback, errorCallback) {

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieve", "request")
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.retrieve", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieve", "errorCallback");

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

        _makeRequest('GET', request, 'retrieve', onSuccess, errorCallback);
    }

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key(s) for the record to retrieve.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     */
    this.retrieve = function (key, collection, successCallback, errorCallback, select, expand) {

        ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.retrieve", "key");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.retrieve", "key")
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
            key: key,
            select: select,
            expand: expand
        };

        this.retrieveRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.upsertRequest = function (request, successCallback, errorCallback) {

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.upsert", "request");
        ErrorHelper.parameterCheck(request.entity, "DynamicsWebApi.upsert", "request.entity");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.upsert", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.upsert", "errorCallback");

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

        _makeRequest('PATCH', request, 'upsert', onSuccess, onError);
    }

    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key(s) for the record to upsert.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     */
    this.upsert = function (key, collection, object, successCallback, errorCallback, prefer, select) {

        ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.upsert", "key");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.upsert", "key")

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
            key: key,
            select: select,
            prefer: prefer,
            entity: object
        };

        this.upsertRequest(request, successCallback, errorCallback);
    }

    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
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

            var request = {
                collection: collection,
                navigationProperty: '$count'
            };

            _makeRequest('GET', request, 'count', onSuccess, errorCallback)
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
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
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
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
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
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
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

    var retrieveMultipleRequest = function (request, successCallback, errorCallback, nextPageLink) {

        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.retrieveMultiple", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieveMultiple", "errorCallback");

        if (nextPageLink) {
            ErrorHelper.stringParameterCheck(nextPageLink, 'DynamicsWebApi.retrieveMultiple', 'nextPageLink');
            request.url = nextPageLink;
        }

        //copy locally
        var toCount = request.count;

        var onSuccess = function (response) {
            if (toCount) {
                response.data.oDataCount = response.data.oDataCount || 0;
            }

            successCallback(response.data);
        };

        _makeRequest('GET', request, 'retrieveMultiple', onSuccess, errorCallback);
    }

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     */
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
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.retrieveAllRequest = function (request, successCallback, errorCallback) {
        _retrieveAllRequest(request, successCallback, errorCallback);
    }

    var executeFetchXml = function (collection, fetchXml, successCallback, errorCallback, includeAnnotations, pageNumber, pagingCookie, impersonateUserId) {

        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.executeFetchXml", "collection");
        ErrorHelper.stringParameterCheck(fetchXml, "DynamicsWebApi.executeFetchXml", "fetchXml");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.executeFetchXml", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.executeFetchXml", "errorCallback");

        pageNumber = pageNumber || 1;

        ErrorHelper.numberParameterCheck(pageNumber, "DynamicsWebApi.executeFetchXml", "pageNumber");
        var replacementString = '$1 page="' + pageNumber + '"';

        if (pagingCookie != null) {
            ErrorHelper.stringParameterCheck(pagingCookie, "DynamicsWebApi.executeFetchXml", "pagingCookie");
            replacementString += ' paging-cookie="' + pagingCookie + '"';
        }

        //add page number and paging cookie to fetch xml
        fetchXml = fetchXml.replace(/^(<fetch[\w\d\s'"=]+)/, replacementString);

        var request = {
            collection: collection,
            includeAnnotations: includeAnnotations,
            impersonate: impersonateUserId,
            fetchXml: fetchXml,
            impersonate: impersonateUserId,
            includeAnnotations: includeAnnotations
        };

        var onSuccess = function (response) {
            if (response.data['@' + DWA.Prefer.Annotations.FetchXmlPagingCookie] != null) {
                response.data.PagingInfo = Utility.getFetchXmlPagingCookie(response.data['@' + DWA.Prefer.Annotations.FetchXmlPagingCookie], pageNumber);
            }

            successCallback(response.data);
        };

        _makeRequest('GET', request, 'executeFetchXml', onSuccess, errorCallback);
    }

    /**
     * Sends an asynchronous request to count records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {number} [pageNumber] - Page number.
     * @param {string} [pagingCookie] - Paging cookie. For retrieving the first page, pagingCookie should be null.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.fetch = executeFetchXml;

    /**
     * Sends an asynchronous request to count records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {number} [pageNumber] - Page number.
     * @param {string} [pagingCookie] - Paging cookie. For retrieving the first page, pagingCookie should be null.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.executeFetchXml = executeFetchXml;

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

    var innerExecuteFetchXmlAll = function (collection, fetchXml, successCallback, errorCallback, includeAnnotations, impersonateUserId) {
        return _executeFetchXmlAll(collection, fetchXml, successCallback, errorCallback, includeAnnotations, null, null, impersonateUserId);
    }

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.fetchAll = innerExecuteFetchXmlAll;

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.executeFetchXmlAll = innerExecuteFetchXmlAll;

    /**
     * Associate for a collection-valued navigation property. (1:N or N:N)
     *
     * @param {string} collection - Primary Entity Collection name or Entity Name.
     * @param {string} primaryKey - Primary entity record id.
     * @param {string} relationshipName - Relationship name.
     * @param {string} relatedCollection - Related Entity Collection name or Entity Name.
     * @param {string} relatedKey - Related entity record id.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.associate = function (collection, primaryKey, relationshipName, relatedCollection, relatedKey, successCallback, errorCallback, impersonateUserId) {

        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.associate", "collection");
        ErrorHelper.stringParameterCheck(relatedCollection, "DynamicsWebApi.associate", "relatedCollection");
        ErrorHelper.stringParameterCheck(relationshipName, "DynamicsWebApi.associate", "relationshipName");
        primaryKey = ErrorHelper.keyParameterCheck(primaryKey, "DynamicsWebApi.associate", "primaryKey");
        relatedKey = ErrorHelper.keyParameterCheck(relatedKey, "DynamicsWebApi.associate", "relatedKey");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.associate", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.associate", "errorCallback");

        var onSuccess = function () {
            successCallback();
        };

        var request = {
            _additionalUrl: relationshipName + '/$ref',
            collection: collection,
            key: primaryKey,
            impersonate: impersonateUserId,
            data: { "@odata.id": relatedCollection + "(" + relatedKey + ")" }
        };

        _makeRequest('POST', request, 'associate', onSuccess, errorCallback);
    }

    /**
     * Disassociate for a collection-valued navigation property.
     *
     * @param {string} collection - Primary Entity Collection name or Entity Name.
     * @param {string} primaryKey - Primary entity record id.
     * @param {string} relationshipName - Relationship name.
     * @param {string} relatedKey - Related entity record id.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.disassociate = function (collection, primaryKey, relationshipName, relatedKey, successCallback, errorCallback, impersonateUserId) {

        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.disassociate", "collection");
        ErrorHelper.stringParameterCheck(relationshipName, "DynamicsWebApi.disassociate", "relationshipName");
        primaryKey = ErrorHelper.keyParameterCheck(primaryKey, "DynamicsWebApi.disassociate", "primaryKey");
        relatedKey = ErrorHelper.keyParameterCheck(relatedKey, "DynamicsWebApi.disassociate", "relatedKey");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.disassociate", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.disassociate", "errorCallback");

        var onSuccess = function () {
            successCallback();
        };

        var request = {
            _additionalUrl: relationshipName + '(' + relatedKey + ')/$ref',
            collection: collection,
            key: primaryKey,
            impersonate: impersonateUserId,
        };

        _makeRequest('DELETE', request, 'disassociate', onSuccess, errorCallback);
    }

    /**
     * Associate for a single-valued navigation property. (1:N)
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} key - Entity record Id that contains an attribute.
     * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param {string} relatedCollection - Related collection name that the lookup (attribute) points to.
     * @param {string} relatedKey - Related entity record id that needs to be associated.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.associateSingleValued = function (collection, key, singleValuedNavigationPropertyName, relatedCollection, relatedKey, successCallback, errorCallback, impersonateUserId) {

        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.associateSingleValued", "collection");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.associateSingleValued", "key");
        relatedKey = ErrorHelper.keyParameterCheck(relatedKey, "DynamicsWebApi.associateSingleValued", "relatedKey");
        ErrorHelper.stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.associateSingleValued", "singleValuedNavigationPropertyName");
        ErrorHelper.stringParameterCheck(relatedCollection, "DynamicsWebApi.associateSingleValued", "relatedCollection");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.associateSingleValued", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.associateSingleValued", "errorCallback");

        var onSuccess = function () {
            successCallback();
        };

        var request = {
            _additionalUrl: singleValuedNavigationPropertyName + '/$ref',
            collection: collection,
            key: key,
            impersonate: impersonateUserId,
            data: { "@odata.id": relatedCollection + "(" + relatedKey + ")" }
        };

        _makeRequest('PUT', request, 'associateSingleValued', onSuccess, errorCallback);
    }

    /**
     * Removes a reference to an entity for a single-valued navigation property. (1:N)
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} key - Entity record Id that contains an attribute.
     * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.disassociateSingleValued = function (collection, key, singleValuedNavigationPropertyName, successCallback, errorCallback, impersonateUserId) {

        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.disassociateSingleValued", "collection");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.disassociateSingleValued", "key");
        ErrorHelper.stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.disassociateSingleValued", "singleValuedNavigationPropertyName");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.disassociateSingleValued", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.disassociateSingleValued", "errorCallback");

        var request = {
            _additionalUrl: singleValuedNavigationPropertyName + "/$ref",
            key: key,
            collection: collection,
            impersonate: impersonateUserId,
        };

        var onSuccess = function () {
            successCallback();
        };

        _makeRequest('DELETE', request, 'disassociateSingleValued', onSuccess, errorCallback);
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
        return _executeFunction(functionName, parameters, null, null, successCallback, errorCallback, impersonateUserId, true);
    }

    /**
     * Executes a bound function
     *
     * @param {string} id - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} functionName - The name of the function.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.executeBoundFunction = function (id, collection, functionName, successCallback, errorCallback, parameters, impersonateUserId) {
        return _executeFunction(functionName, parameters, collection, id, successCallback, errorCallback, impersonateUserId);
    }

    var _executeFunction = function (functionName, parameters, collection, id, successCallback, errorCallback, impersonateUserId, isUnbound) {

        ErrorHelper.stringParameterCheck(functionName, "DynamicsWebApi.executeFunction", "functionName");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.executeFunction", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.executeFunction", "errorCallback");

        var request = {
            _additionalUrl: functionName + Utility.buildFunctionParameters(parameters),
            _unboundRequest: isUnbound,
            key: id,
            collection: collection,
            impersonate: impersonateUserId,
        };

        var onSuccess = function (response) {
            response.data
                ? successCallback(response.data)
                : successCallback();
        };

        _makeRequest('GET', request, 'executeFunction', onSuccess, errorCallback);
    }

    /**
     * Executes an unbound Web API action (not bound to a particular entity record)
     *
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} [requestObject] - Action request body object.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.executeUnboundAction = function (actionName, requestObject, successCallback, errorCallback, impersonateUserId) {
        return _executeAction(actionName, requestObject, null, null, successCallback, errorCallback, impersonateUserId, true);
    }

    /**
     * Executes a bound Web API action (bound to a particular entity record)
     *
     * @param {string} id - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} [requestObject] - Action request body object.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.executeBoundAction = function (id, collection, actionName, requestObject, successCallback, errorCallback, impersonateUserId) {
        return _executeAction(actionName, requestObject, collection, id, successCallback, errorCallback, impersonateUserId);
    }

    var _executeAction = function (actionName, requestObject, collection, id, successCallback, errorCallback, impersonateUserId, isUnbound) {

        ErrorHelper.stringParameterCheck(actionName, "DynamicsWebApi.executeAction", "actionName");
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.executeAction", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.executeAction", "errorCallback");

        var request = {
            _additionalUrl: actionName,
            _unboundRequest: isUnbound,
            collection: collection,
            key: id,
            impersonate: impersonateUserId,
            data: requestObject
        };

        var onSuccess = function (response) {
            response.data
                ? successCallback(response.data)
                : successCallback();
        };

        _makeRequest('POST', request, 'executeAction', onSuccess, errorCallback);
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

var DWA = __webpack_require__(0);
var dateReviver = __webpack_require__(7);

//string es6 polyfill
if (!String.prototype.endsWith || !String.prototype.startsWith) {
    __webpack_require__(2);
}

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

function parseData(object) {
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
                typeof (object[aliasKeys[0]]) !== 'object' ||
                typeof (object[aliasKeys[0]]) === 'object' && !object[aliasKeys[0]].hasOwnProperty('_dwaType')) {
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

    return object;
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

        responseData = parseData(responseData);
    }

    return responseData;
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
var xhrRequest = function (method, uri, data, additionalHeaders, successCallback, errorCallback, async) {
    var request = new XMLHttpRequest();
    request.open(method, uri, async);
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
                    error.statusText = request.statusText;
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
/* 11 */
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
/* 12 */
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
/* 13 */
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
/* 14 */
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

/***/ })
/******/ ]);
});