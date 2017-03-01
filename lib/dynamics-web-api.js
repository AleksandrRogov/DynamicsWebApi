/*
 DynamicsWebApi v1.0.0 beta (for Dynamics 365 (online), Dynamics 365 (on-premises), Dynamics CRM 2016, Dynamics CRM Online)
 
 Copyright (c) 2016. 
 Author: Aleksandr Rogov (https://github.com/AleksandrRogov)
 MIT License

*/
var DWA = require("./dwa.js");

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

/**
 * Configuration object for DynamicsWebApi
 * @typedef {object} DWAConfig
 * @property {string} webApiUrl - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
 * @property {string} webApiVersion - The version of Web API to use, for example: "8.1"
 * @property {string} impersonate - A String representing a URL to Web API (webApiVersion not required if webApiUrl specified) [not used inside of CRM]
 */

/**
 * DynamicsWebApi - a Microsoft Dynamics CRM Web API helper library. Current version uses Promises instead of Callbacks.
 * 
 * @param {DWAConfig} [config] - configuration object
 */
function DynamicsWebApi(config) {

    var _context = function () {
        ///<summary>
        /// Private function to the context object.
        ///</summary>
        ///<returns>Context</returns>
        if (typeof GetGlobalContext != "undefined")
        { return GetGlobalContext(); }
        else {
            if (typeof Xrm != "undefined") {
                return Xrm.Page.context;
            }
            else { /*throw new Error("Context is not available.");*/ }
        }
    };

    var isCrm8 = function () {
        /// <summary>
        /// Indicates whether it's CRM 2016 (and later) or earlier. 
        /// Used to check if Web API is available.
        /// </summary>

        //isOutlookClient is removed in CRM 2016 
        return typeof DynamicsWebApi._context().isOutlookClient == 'undefined';
    };

    var _getClientUrl = function () {
        ///<summary>
        /// Private function to return the server URL from the context
        ///</summary>
        ///<returns>String</returns>
        if (typeof Xrm != "undefined") {

            var clientUrl = Xrm.Page.context.getClientUrl();

            if (clientUrl.match(/\/$/)) {
                clientUrl = clientUrl.substring(0, clientUrl.length - 1);
            }
            return clientUrl;
        }
        return "";
    };

    var _webApiVersion = "8.0";
    var _impersonateUserId = null;

    var _initUrl = function () {
        return _getClientUrl() + "/api/data/v" + _webApiVersion + "/";
    };

    var _webApiUrl = _initUrl();

    var _propertyReplacer = function (key, value) {
        /// <param name="key" type="String">Description</param>
        if (typeof key === "string" && key.endsWith("@odata.bind") && typeof value === "string" && !value.startsWith(_webApiUrl)) {
            value = _webApiUrl + value;
        }

        return value;
    };

    var _dateReviver = function (key, value) {
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

    var _parseResponseHeaders = function (headerStr) {
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
    }

    /**
     * Sends a request to given URL with given parameters
     *
     * @param {string} action - Method of the request.
     * @param {string} uri - Request URI.
     * @param {Object} [data] - Data to send in the request.
     * @param {Object} [additionalHeaders] - Object with additional headers. IMPORTANT! This object does not contain default headers needed for every request.
     * @returns {Promise}
     */
    var _sendRequest = 
        /**
         * @param {string} action - Method of the request.
         * @param {string} uri - Request URI.
         * @param {Object} [data] - Data to send in the request.
         * @param {Object} [additionalHeaders] - Object with additional headers. IMPORTANT! This object does not contain default headers needed for every request.
         * @returns {Promise}
         */
        function (action, uri, data, additionalHeaders) {
        /// <summary>Sends a request to given URL with given parameters</summary>
        /// <param name="method" type="String">Method of the request</param>
        /// <param name="url" type="String">The request URL</param>
        /// <param name="data" type="Object" optional="true">Data to send in the request</param>
        /// <param name="additionalHeaders" type="Object" optional="true">Object with additional headers.<para>IMPORTANT! This object does not contain default headers needed for every request.</para></param>
        /// <returns type="Promise" />

        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(action, encodeURI(_webApiUrl + uri), true);
            request.setRequestHeader("OData-MaxVersion", "4.0");
            request.setRequestHeader("OData-Version", "4.0");
            request.setRequestHeader("Accept", "application/json");
            request.setRequestHeader("Content-Type", "application/json; charset=utf-8");

            if (_impersonateUserId && (!additionalHeaders || (additionalHeaders && !additionalHeaders["MSCRMCallerID"]))) {
                request.setRequestHeader("MSCRMCallerID", _impersonateUserId);
            }

            //set additional headers
            if (additionalHeaders != null) {
                var headerKeys = Object.keys(additionalHeaders);
                for (var i = 0; i < headerKeys.length; i++) {
                    request.setRequestHeader(headerKeys[i], additionalHeaders[headerKeys[i]]);
                }
            }

            request.onreadystatechange = function () {
                if (this.readyState === 4) {
                    request.onreadystatechange = null;
                    switch (this.status) {
                        case 200: // Success with content returned in response body.
                        case 201: // Success with content returned in response body.
                        case 204: // Success with no content returned in response body.
                        case 304: {// Success with Not Modified
                            var responseData = null;
                            if (this.responseText) {
                                responseData = JSON.parse(this.responseText, _dateReviver);
                            }

                            var response = {
                                data: responseData,
                                headers: _parseResponseHeaders(this.getAllResponseHeaders()),
                                status: this.status
                            };

                            resolve(response);
                            break;
                        }
                        default: // All other statuses are error cases.
                            //var error;
                            //try {
                            //    error = JSON.parse(request.response).error;
                            //} catch (e) {
                            //    error = new Error("Unexpected Error");
                            //}
                            reject(this);
                            break;
                    }
                }
            };
            data
                ? request.send(JSON.stringify(data, _propertyReplacer))
                : request.send();
        });
    }

    var _errorHandler = function (req) {
        ///<summary>
        /// Private function return an Error object to the errorCallback
        ///</summary>
        ///<param name="req" type="XMLHttpRequest">
        /// The XMLHttpRequest response that returned an error.
        ///</param>
        ///<returns>Error</returns>
        return new Error("Error : " +
            req.status + ": " +
            req.statusText + ": " +
            JSON.parse(req.responseText).error.message);
    };

    var _parameterCheck = function (parameter, functionName, parameterName, type) {
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
            throw new Error(type
                ? functionName + " requires the " + parameterName + " parameter with type: " + type
                : functionName + " requires the " + parameterName + " parameter.");
        }
    };
    var _stringParameterCheck = function (parameter, functionName, parameterName) {
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
            throw new Error(functionName + " requires the " + parameterName + " parameter is a String.");
        }
    };
    var _arrayParameterCheck = function (parameter, functionName, parameterName) {
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
            throw new Error(functionName + " requires the " + parameterName + " parameter is an Array.");
        }
    };
    var _numberParameterCheck = function (parameter, functionName, parameterName) {
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
            throw new Error(functionName + " requires the " + parameterName + " parameter is a Number.");
        }
    };
    var _boolParameterCheck = function (parameter, functionName, parameterName) {
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
            throw new Error(functionName + " requires the " + parameterName + " parameter is a Boolean.");
        }
    };

    var _guidParameterCheck = function (parameter, functionName, parameterName) {
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
            throw new Error(functionName + " requires the " + parameterName + " parameter is a GUID String.");
        }
    }

    var dwaExpandRequest = function () {
        return {
            select: [],
            filter: "",
            top: 0,
            orderBy: [],
            property: ""
        }
    }

    var dwaRequest = function () {
        return {
            collection: "",
            id: "",
            select: [],
            expand: [],
            filter: "",
            maxPageSize: 1,
            count: true,
            top: 1,
            orderBy: [],
            includeAnnotations: "",
            ifmatch: "",
            ifnonematch: "",
            returnRepresentation: true,
            entity: {},
            impersonate: "",
            navigationProperty: "",
            savedQuery: "",
            userQuery: ""
        }
    };

    /**
     * Sets the configuration parameters for DynamicsWebApi helper.
     *
     * @param {DWAConfig} config - configuration object
     */
    this.setConfig =
        /**
         * @param {DWAConfig} config - configuration object
         */
        function (config) {

            if (config.webApiVersion) {
                _stringParameterCheck(config.webApiVersion, "DynamicsWebApi.setConfig", "config.webApiVersion");
                _webApiVersion = config.webApiVersion;
                _webApiUrl = _initUrl();
            }

            if (config.webApiUrl) {
                _stringParameterCheck(config.webApiUrl, "DynamicsWebApi.setConfig", "config.webApiUrl");
                _webApiUrl = config.webApiUrl;
            }

            if (config.impersonate) {
                _impersonateUserId = _guidParameterCheck(config.impersonate, "DynamicsWebApi.setConfig", "config.impersonate");
            }
        }

    if (config != null)
        setConfig(config);

    var _convertToReferenceObject = function (responseData) {
        var result = /\/(\w+)\(([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})/i.exec(responseData["@odata.id"]);
        return { id: result[2], collection: result[1], oDataContext: responseData["@odata.context"] };
    }

    var convertOptions = function (options, functionName, url, joinSymbol) {
        /// <param name="options" type="dwaRequest">Options</param>

        var headers = {};
        var optionsArray = [];
        joinSymbol = joinSymbol != null ? joinSymbol : "&";

        if (options) {
            if (options.navigationProperty) {
                _stringParameterCheck(options.navigationProperty, "DynamicsWebApi." + functionName, "request.navigationProperty");
                url += "/" + options.navigationProperty;
            }

            if (options.select != null && options.select.length) {
                _arrayParameterCheck(options.select, "DynamicsWebApi." + functionName, "request.select");

                if (functionName == "retrieve" && options.select.length == 1 && options.select[0].endsWith("/$ref")) {
                    url += "/" + options.select[0];
                }
                else {
                    if (options.select[0].startsWith("/") && functionName == "retrieve") {
                        if (options.navigationProperty == null) {
                            url += options.select.shift();
                        }
                        else {
                            options.select.shift();
                        }
                    }

                    //check if anything left in the array
                    if (options.select.length) {
                        optionsArray.push("$select=" + options.select.join(','));
                    }
                }
            }

            if (options.filter) {
                _stringParameterCheck(options.filter, "DynamicsWebApi." + functionName, "request.filter");
                optionsArray.push("$filter=" + options.filter);
            }

            if (options.savedQuery) {
                optionsArray.push("savedQuery=" + _guidParameterCheck(options.savedQuery, "DynamicsWebApi." + functionName, "request.savedQuery"));
            }

            if (options.userQuery) {
                optionsArray.push("userQuery=" + _guidParameterCheck(options.userQuery, "DynamicsWebApi." + functionName, "request.userQuery"));
            }

            if (options.maxPageSize && options.maxPageSize > 0) {
                _numberParameterCheck(options.maxPageSize, "DynamicsWebApi." + functionName, "request.maxPageSize");
                headers['Prefer'] = 'odata.maxpagesize=' + options.maxPageSize;
            }

            if (options.count) {
                _boolParameterCheck(options.count, "DynamicsWebApi." + functionName, "request.count");
                optionsArray.push("$count=" + options.count);
            }

            if (options.top && options.top > 0) {
                _numberParameterCheck(options.top, "DynamicsWebApi." + functionName, "request.top");
                optionsArray.push("$top=" + options.top);
            }

            if (options.orderBy != null && options.orderBy.length) {
                _arrayParameterCheck(options.orderBy, "DynamicsWebApi." + functionName, "request.orderBy");
                optionsArray.push("$orderBy=" + options.orderBy.join(','));
            }

            if (options.returnRepresentation) {
                _boolParameterCheck(options.returnRepresentation, "DynamicsWebApi." + functionName, "request.returnRepresentation");
                headers['Prefer'] = DWA.Prefer.ReturnRepresentation;
            }

            if (options.includeAnnotations) {
                _stringParameterCheck(options.includeAnnotations, "DynamicsWebApi." + functionName, "request.includeAnnotations");
                headers['Prefer'] = 'odata.include-annotations="' + options.includeAnnotations + '"';
            }

            if (options.ifmatch != null && options.ifnonematch != null) {
                throw Error("DynamicsWebApi." + functionName + ". Either one of request.ifmatch or request.ifnonematch parameters shoud be used in a call, not both.")
            }

            if (options.ifmatch) {
                _stringParameterCheck(options.ifmatch, "DynamicsWebApi." + functionName, "request.ifmatch");
                headers['If-Match'] = options.ifmatch;
            }

            if (options.ifnonematch) {
                _stringParameterCheck(options.ifnonematch, "DynamicsWebApi." + functionName, "request.ifnonematch");
                headers['If-None-Match'] = options.ifnonematch;
            }

            if (options.impersonate) {
                _stringParameterCheck(options.impersonate, "DynamicsWebApi." + functionName, "request.impersonate");
                headers['MSCRMCallerID'] = _guidParameterCheck(options.impersonate, "DynamicsWebApi." + functionName, "request.impersonate");
            }

            if (options.expand != null && options.expand.length) {
                _arrayParameterCheck(options.expand, "DynamicsWebApi." + functionName, "request.expand");
                var expandOptionsArray = [];
                for (var i = 0; i < options.expand.length; i++) {
                    if (options.expand[i].property) {
                        var expandOptions = convertOptions(options.expand[i], functionName + " $expand", null, ";").query;
                        if (expandOptions.length) {
                            expandOptions = "(" + expandOptions + ")";
                        }
                        expandOptionsArray.push(options.expand[i].property + expandOptions);
                    }
                }
                if (expandOptionsArray.length) {
                    optionsArray.push("$expand=" + encodeURI(expandOptionsArray.join(",")));
                }
            }
        }

        return { url: url, query: optionsArray.join(joinSymbol), headers: headers };
    }

    var convertRequestToLink = function (options, functionName) {
        /// <summary>Builds the Web Api query string based on a passed options object parameter.</summary>
        /// <param name="options" type="dwaRequest">Options</param>
        /// <returns type="String" />

        if (!options.collection) {
            _parameterCheck(options.collection, "DynamicsWebApi." + functionName, "request.collection");
        }
        else {
            _stringParameterCheck(options.collection, "DynamicsWebApi." + functionName, "request.collection");
        }

        var url = options.collection.toLowerCase();

        if (options.id) {
            _guidParameterCheck(options.id, "DynamicsWebApi." + functionName, "request.id");
            url += "(" + options.id + ")";
        }

        var result = convertOptions(options, functionName, url);

        if (result.query)
            result.url += "?" + result.query;

        return { url: result.url, headers: result.headers };
    };

    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {Object} object - A JavaScript object valid for create operations.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {string} [prefer] - (optional) If set to "return=representation" the function will return a newly created object
     * @returns {Promise}
     */
    this.create =
        /**
         * @param {Object} object - A JavaScript object valid for create operations.
         * @param {string} collection - The Name of the Entity Collection.
         * @param {string} [prefer] - (optional) If set to "return=representation" the function will return a newly created object
         * @returns {Promise}
         */
        function (object, collection, prefer) {
            _parameterCheck(object, "DynamicsWebApi.create", "object");
            _stringParameterCheck(collection, "DynamicsWebApi.create", "collection");

            var headers = {};

            if (prefer != null) {
                _stringParameterCheck(prefer, "DynamicsWebApi.create", "prefer");
                headers["Prefer"] = prefer;
            }

            return _sendRequest("POST", collection.toLowerCase(), object, headers)
                .then(function (response) {
                    if (response.data) {
                        return response.data;
                    }

                    var entityUrl = response.headers['OData-EntityId'];
                    var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                    return id;
                });
        };

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @returns {Promise}
     */
    this.retrieveRequest =
        /**
         * @param {Object} request - An object that represents all possible options for a current request.
         */
        function (request) {

            _parameterCheck(request, "DynamicsWebApi.retrieve", "request");

            var result = convertRequestToLink(request, "retrieve");

            //copy locally
            var select = request.select;
            return _sendRequest("GET", result.url, null, result.headers).then(function (response) {
                if (select != null && select.length == 1 && select[0].endsWith("/$ref") && response.data["@odata.id"] != null) {
                    return _convertToReferenceObject(response.data);
                }

                return response.data;
            });
        };

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {string} id - A String representing the GUID value for the record to retrieve.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @param {string} [expand] - A String representing the $expand Query Option value to control which related records need to be returned.
     * @returns {Promise}
     */
    this.retrieve =
        /**
         * @param {string} id - A String representing the GUID value for the record to retrieve.
         * @param {string} collection - The Name of the Entity Collection.
         * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
         * @param {string} [expand] - A String representing the $expand Query Option value to control which related records need to be returned.
         */
        function (id, collection, select, expand) {

            _stringParameterCheck(id, "DynamicsWebApi.retrieve", "id");
            id = _guidParameterCheck(id, "DynamicsWebApi.retrieve", "id")
            _stringParameterCheck(collection, "DynamicsWebApi.retrieve", "collection");

            var url = collection.toLowerCase() + "(" + id + ")";

            var queryOptions = [];

            if (select != null && select.length) {
                _arrayParameterCheck(select, "DynamicsWebApi.retrieve", "select");

                if (select.length == 1 && select[0].endsWith("/$ref") && select[0].endsWith("/$ref")) {
                    url += "/" + select[0];
                }
                else {
                    if (select[0].startsWith("/")) {
                        url += select.shift();
                    }

                    //check if anything left in the array
                    if (select.length) {
                        queryOptions.push("$select=" + select.join(','));
                    }
                }
            }

            if (expand != null) {
                _stringParameterCheck(expand, "DynamicsWebApi.retrieve", "expand");
                queryOptions.push("$expand=" + expand);
            }

            if (queryOptions.length)
                url += "?" + queryOptions.join("&");

            return _sendRequest("GET", url).then(function (response) {
                if (select != null && select.length == 1 && select[0].endsWith("/$ref") && response.data["@odata.id"] != null) {
                    return _convertToReferenceObject(response.data);
                }

                return response.data;
            });
        };

    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @returns {Promise}
     */
    this.updateRequest =
        /**
         * @param {Object} request - An object that represents all possible options for a current request.
         */
        function (request) {

            _parameterCheck(request, "DynamicsWebApi.update", "request");
            _parameterCheck(request.entity, "DynamicsWebApi.update", "request.entity");

            var result = convertRequestToLink(request, "update");

            if (request.ifmatch == null) {
                result.headers['If-Match'] = '*'; //to prevent upsert
            }

            //copy locally
            var ifmatch = request.ifmatch;
            return _sendRequest("PATCH", result.url, request.entity, result.headers)
                .then(function (response) {
                    if (response.data) {
                        return response.data;
                    }

                    return true; //updated

                }).catch(function (error) {
                    if (ifmatch && error.status == 412) {
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
     * @param {string} id - A String representing the GUID value for the record to update.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {string} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise}
     */
    this.update =
        /**
         * @param {string} id - A String representing the GUID value for the record to update.
         * @param {string} collection - The Name of the Entity Collection.
         * @param {Object} object - A JavaScript object valid for update operations.
         * @param {string} [prefer] - If set to "return=representation" the function will return an updated object
         * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
         */
        function (id, collection, object, prefer, select) {

            _stringParameterCheck(id, "DynamicsWebApi.update", "id");
            id = _guidParameterCheck(id, "DynamicsWebApi.update", "id")
            _parameterCheck(object, "DynamicsWebApi.update", "object");
            _stringParameterCheck(collection, "DynamicsWebApi.update", "collection");

            var headers = { "If-Match": "*" }; //to prevent upsert

            if (prefer != null) {
                _stringParameterCheck(prefer, "DynamicsWebApi.update", "prefer");
                headers["Prefer"] = prefer;
            }

            var systemQueryOptions = "";

            if (select != null) {
                _arrayParameterCheck(select, "DynamicsWebApi.update", "select");

                if (select.length > 0) {
                    systemQueryOptions = "?$select=" + select.join(",");
                }
            }

            return _sendRequest("PATCH", collection.toLowerCase() + "(" + id + ")" + systemQueryOptions, object, headers)
                .then(function (response) {
                    if (response.data) {
                        return response.data;
                    }
                });
        };

    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param {string} id - A String representing the GUID value for the record to update.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Object} keyValuePair - keyValuePair object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"}
     * @param {string} [prefer] - If set to "return=representation" the function will return an updated object
     * @returns {Promise}
     */
    this.updateSingleProperty =
        /**
         * @param {string} id - A String representing the GUID value for the record to update.
         * @param {string} collection - The Name of the Entity Collection.
         * @param {Object} keyValuePair - keyValuePair object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"}
         * @param {string} [prefer] - If set to "return=representation" the function will return an updated object
         */
        function (id, collection, keyValuePair, prefer) {

            _stringParameterCheck(id, "DynamicsWebApi.updateSingleProperty", "id");
            id = _guidParameterCheck(id, "DynamicsWebApi.updateSingleProperty", "id")
            _parameterCheck(keyValuePair, "DynamicsWebApi.updateSingleProperty", "keyValuePair");
            _stringParameterCheck(collection, "DynamicsWebApi.updateSingleProperty", "collection");

            var key = Object.keys(keyValuePair)[0];
            var keyValue = keyValuePair[key];

            var header = {};

            if (prefer != null) {
                _stringParameterCheck(prefer, "DynamicsWebApi.updateSingleProperty", "prefer");
                header["Prefer"] = prefer;
            }

            return _sendRequest("PUT", collection.toLowerCase() + "(" + id + ")/" + key, { value: keyValue }, header)
                .then(function (response) {
                    if (response.data) {
                        return response.data;
                    }
                });
        };

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @returns {Promise}
     */
    this.deleteRequest =
        /**
         * @param {Object} request - An object that represents all possible options for a current request.
         */
        function (request) {

            _parameterCheck(request, "DynamicsWebApi.delete", "request")

            var result = convertRequestToLink(request, "delete");

            //copy locally
            var ifmatch = request.ifmatch;
            return _sendRequest("DELETE", result.url, null, result.headers).then(function () {
                return true; //deleted
            }).catch(function (error) {
                if (ifmatch && error.status == 412) {
                    //precondition failed - not deleted
                    return false;
                }
                else {
                    //rethrow error otherwise
                    throw error;
                }
            });
        }

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {string} id - A String representing the GUID value for the record to delete.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {string} [propertyName] - The name of the property which needs to be emptied. Instead of removing a whole record only the specified property will be cleared.
     * @returns {Promise}
     */
    this.deleteRecord =
        /**
         * @param {string} id - A String representing the GUID value for the record to delete.
         * @param {string} collection - The Name of the Entity Collection.
         * @param {string} [propertyName] - The name of the property which needs to be emptied. Instead of removing a whole record only the specified property will be cleared.
         */
        function (id, collection, propertyName) {

            _stringParameterCheck(id, "DynamicsWebApi.deleteRequest", "id");
            id = _guidParameterCheck(id, "DynamicsWebApi.deleteRequest", "id")
            _stringParameterCheck(collection, "DynamicsWebApi.deleteRequest", "collection");

            if (propertyName != null)
                _stringParameterCheck(propertyName, "DynamicsWebApi.deleteRequest", "propertyName");

            var url = collection.toLowerCase() + "(" + id + ")";

            if (propertyName != null)
                url += "/" + propertyName;

            return _sendRequest("DELETE", url).then(function () {
                return;
            })
        };

    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @returns {Promise}
     */
    this.upsertRequest =
        /**
         * @param {Object} request - An object that represents all possible options for a current request.
         */
        function (request) {

            _parameterCheck(request, "DynamicsWebApi.upsert", "request")
            _parameterCheck(request.entity, "DynamicsWebApi.upsert", "request.entity")

            var result = convertRequestToLink(request, "upsert");

            //copy locally
            var ifnonematch = request.ifnonematch;
            var ifmatch = request.ifmatch;
            return _sendRequest("PATCH", result.url, request.entity, result.headers)
                .then(function (response) {
                    if (response.headers['OData-EntityId']) {
                        var entityUrl = response.headers['OData-EntityId'];
                        var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                        return id;
                    }
                    else if (response.data) {
                        return response.data;
                    }
                }).catch(function (error) {
                    /// <param name="error" type="XMLHttpRequest">Description</param>
                    if (ifnonematch && error.status == 412) {
                        //if prevent update
                        return;
                    }
                    else if (ifmatch && error.status == 404) {
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
     * @param {string} id - A String representing the GUID value for the record to upsert.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {string} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise}
     */
    this.upsert =
        /**
         * @param {string} id - A String representing the GUID value for the record to upsert.
         * @param {string} collection - The Name of the Entity Collection.
         * @param {Object} object - A JavaScript object valid for update operations.
         * @param {string} [prefer] - If set to "return=representation" the function will return an updated object
         * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
         */
        function (id, collection, object, prefer, select) {

            _stringParameterCheck(id, "DynamicsWebApi.upsert", "id");
            id = _guidParameterCheck(id, "DynamicsWebApi.upsert", "id")

            _parameterCheck(object, "DynamicsWebApi.upsert", "object");
            _stringParameterCheck(collection, "DynamicsWebApi.upsert", "collection");

            var headers = {};

            if (prefer != null) {
                _stringParameterCheck(prefer, "DynamicsWebApi.upsert", "prefer");
                headers["Prefer"] = prefer;
            }

            var systemQueryOptions = "";

            if (select != null) {
                _arrayParameterCheck(select, "DynamicsWebApi.upsert", "select");

                if (select.length > 0) {
                    systemQueryOptions = "?$select=" + select.join(",");
                }
            }

            return _sendRequest("PATCH", collection.toLowerCase() + "(" + id + ")" + systemQueryOptions, object, headers)
                .then(function (response) {
                    if (response.headers['OData-EntityId']) {
                        var entityUrl = response.headers['OData-EntityId'];
                        var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                        return id;
                    }
                    else if (response.data) {
                        return response.data;
                    }
                });
        }

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise}
     */
    var retrieveMultipleRequest =
        /**
         * @param {Object} request - An object that represents all possible options for a current request.
         * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
         * @returns {Promise}
         */
        function (request, nextPageLink) {

            if (nextPageLink && !request.collection) {
                request.collection = "any";
            }

            var result = convertRequestToLink(request, "retrieveMultiple");

            if (nextPageLink) {
                _stringParameterCheck(nextPageLink, "DynamicsWebApi.retrieveMultiple", "nextPageLink");
                result.url = unescape(nextPageLink).replace(_webApiUrl, "");
            }

            //copy locally
            var toCount = request.count;

            return _sendRequest("GET", result.url, null, result.headers)
                .then(function (response) {
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

                    return response.data;
                });
        };

    this.retrieveMultipleRequest = retrieveMultipleRequest;

    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
     *
     * @param {string} collection - The Name of the Entity Collection.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @returns {Promise}
     */
    this.count =
        /**
         * @param {string} collection - The Name of the Entity Collection.
         * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
         * @returns {Promise}
         */
        function (collection, filter) {

            if (filter == null || (filter != null && !filter.length)) {
                _stringParameterCheck(collection, "DynamicsWebApi.count", "collection");

                //if filter has not been specified then simplify the request
                return _sendRequest("GET", collection.toLowerCase() + "/$count")
                    .then(function (response) {
                        return response.data ? parseInt(response.data) : 0;
                    });
            }
            else {
                return retrieveMultipleRequest({
                    collection: collection,
                    filter: filter,
                    count: true
                }, null)
                    .then(function (response) {
                        /// <param name="response" type="DWA.Types.MultipleResponse">Request response</param>

                        return response.oDataCount ? response.oDataCount : 0;
                    });
            }
        }

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise}
     */
    this.retrieveMultiple =
        /**
         * @param {string} collection - The Name of the Entity Collection.
         * @param {Array} [select] - Use the $select system query option to limit the properties returned.
         * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
         * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
         * @returns {Promise}
         */
        function (collection, select, filter, nextPageLink) {

            return retrieveMultipleRecordsAdvanced({
                collection: collection,
                select: select,
                filter: filter
            }, nextPageLink);
        }

    

    var getPagingCookie = function (pageCookies, currentPageNumber) {
        /// <summary>Parses a paging cookie</summary>
        /// <param name="pageCookies" type="String">Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.</param>
        /// <param name="currentPageNumber" type="Number">A current page number. Fix empty paging-cookie for complex fetch xmls.</param>
        /// <returns type="{cookie: "", number: 0, next: 1}" />
        try {
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

        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     * Sends an asynchronous request to count records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param {string} collection - An object that represents all possible options for a current request.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {number} [pageNumber] - Page number.
     * @param {string} [pagingCookie] - Paging cookie. For retrieving the first page, pagingCookie should be null.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.executeFetchXml =
        /**
         * @param {string} collection - An object that represents all possible options for a current request.
         * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
         * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
         * @param {number} [pageNumber] - Page number.
         * @param {string} [pagingCookie] - Paging cookie. For retrieving the first page, pagingCookie should be null.
         * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        function (collection, fetchXml, includeAnnotations, pageNumber, pagingCookie, impersonateUserId) {

            _stringParameterCheck(collection, "DynamicsWebApi.executeFetchXml", "type");
            _stringParameterCheck(fetchXml, "DynamicsWebApi.executeFetchXml", "fetchXml");

            if (pageNumber == null) {
                pageNumber = 1;
            }

            _numberParameterCheck(pageNumber, "DynamicsWebApi.executeFetchXml", "pageNumber");
            var replacementString = "$1 page='" + pageNumber + "'";

            if (pagingCookie != null) {
                _stringParameterCheck(pagingCookie, "DynamicsWebApi.executeFetchXml", "pagingCookie");
                replacementString += " paging-cookie='" + pagingCookie + "'";
            }

            //add page number and paging cookie to fetch xml
            fetchXml = fetchXml.replace(/^(<fetch[\w\d\s'"=]+)/, replacementString);

            var headers = {};
            if (includeAnnotations != null) {
                _stringParameterCheck(includeAnnotations, "DynamicsWebApi.executeFetchXml", "includeAnnotations");
                headers['Prefer'] = 'odata.include-annotations="' + includeAnnotations + '"';
            }

            if (impersonateUserId != null) {
                impersonateUserId = _guidParameterCheck(impersonateUserId, "DynamicsWebApi.executeFetchXml", "impersonateUserId");
                header["MSCRMCallerID"] = impersonateUserId;
            }

            var encodedFetchXml = escape(fetchXml);

            return _sendRequest("GET", collection.toLowerCase() + "?fetchXml=" + encodedFetchXml, null, headers)
                .then(function (response) {

                    if (response.data['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'] != null) {
                        response.data.PagingInfo = getPagingCookie(response.data['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'], pageNumber);
                    }

                    if (response.data['@odata.context'] != null) {
                        response.data.oDataContext = response.data['@odata.context'];
                    }

                    return response.data;
                });
        }

    /**
     * Associate for a collection-valued navigation property. (1:N or N:N)
     *
     * @param {string} primaryCollection - Primary entity collection name.
     * @param {string} primaryId - Primary entity record id.
     * @param {string} relationshipName - Relationship name.
     * @param {string} relatedCollection - Related colletion name.
     * @param {string} relatedId - Related entity record id.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.associate =
        /**
         * @param {string} primaryCollection - Primary entity collection name.
         * @param {string} primaryId - Primary entity record id.
         * @param {string} relationshipName - Relationship name.
         * @param {string} relatedCollection - Related colletion name.
         * @param {string} relatedId - Related entity record id.
         * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        function (primaryCollection, primaryId, relationshipName, relatedCollection, relatedId, impersonateUserId) {
            _stringParameterCheck(primaryCollection, "DynamicsWebApi.associate", "primarycollection");
            _stringParameterCheck(relatedCollection, "DynamicsWebApi.associate", "relatedcollection");
            _stringParameterCheck(relationshipName, "DynamicsWebApi.associate", "relationshipName");
            primaryId = _guidParameterCheck(primaryId, "DynamicsWebApi.associate", "primaryId");
            relatedId = _guidParameterCheck(relatedId, "DynamicsWebApi.associate", "relatedId");

            var header = {};

            if (impersonateUserId != null) {
                impersonateUserId = _guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
                header["MSCRMCallerID"] = impersonateUserId;
            }

            return _sendRequest("POST", primaryCollection + "(" + primaryId + ")/" + relationshipName + "/$ref",
                { "@odata.id": _webApiUrl + relatedCollection + "(" + relatedId + ")" }, header)
                .then(function () { });
        }

    /**
     * Disassociate for a collection-valued navigation property.
     *
     * @param {string} primaryCollection - Primary entity collection name.
     * @param {string} primaryId - Primary entity record id.
     * @param {string} relationshipName - Relationship name.
     * @param {string} relatedId - Related entity record id.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.disassociate =
        /**
         * @param {string} primaryCollection - Primary entity collection name.
         * @param {string} primaryId - Primary entity record id.
         * @param {string} relationshipName - Relationship name.
         * @param {string} relatedId - Related entity record id.
         * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        function (primaryCollection, primaryId, relationshipName, relatedId, impersonateUserId) {
            _stringParameterCheck(primaryCollection, "DynamicsWebApi.disassociate", "primarycollection");
            _stringParameterCheck(relationshipName, "DynamicsWebApi.disassociate", "relationshipName");
            primaryId = _guidParameterCheck(primaryId, "DynamicsWebApi.disassociate", "primaryId");
            relatedId = _guidParameterCheck(relatedId, "DynamicsWebApi.disassociate", "relatedId");

            var header = {};

            if (impersonateUserId != null) {
                impersonateUserId = _guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
                header["MSCRMCallerID"] = impersonateUserId;
            }

            return _sendRequest("DELETE", primaryCollection + "(" + primaryId + ")/" + relationshipName + "(" + relatedId + ")/$ref", null, header)
                .then(function () { });
        }

    /**
     * Associate for a single-valued navigation property. (1:N)
     *
     * @param {string} collection - Entity collection name that contains an attribute.
     * @param {string} id - Entity record Id that contains an attribute.
     * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param {string} relatedCollection - Related collection name that the lookup (attribute) points to.
     * @param {string} relatedId - Related entity record id that needs to be associated.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    var associateRecordsSingleValued =
        /**
         * @param {string} collection - Entity collection name that contains an attribute.
         * @param {string} id - Entity record Id that contains an attribute.
         * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
         * @param {string} relatedCollection - Related collection name that the lookup (attribute) points to.
         * @param {string} relatedId - Related entity record id that needs to be associated.
         * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        function (collection, id, singleValuedNavigationPropertyName, relatedCollection, relatedId, impersonateUserId) {

            _stringParameterCheck(collection, "DynamicsWebApi.associateSingleValued", "collection");
            id = _guidParameterCheck(id, "DynamicsWebApi.associateSingleValued", "id");
            relatedId = _guidParameterCheck(relatedId, "DynamicsWebApi.associateSingleValued", "relatedId");
            _stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.associateSingleValued", "singleValuedNavigationPropertyName");
            _stringParameterCheck(relatedCollection, "DynamicsWebApi.associateSingleValued", "relatedcollection");

            var header = {};

            if (impersonateUserId != null) {
                impersonateUserId = _guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
                header["MSCRMCallerID"] = impersonateUserId;
            }

            return _sendRequest("PUT", collection + "(" + id + ")/" + singleValuedNavigationPropertyName + "/$ref",
                { "@odata.id": _webApiUrl + relatedCollection + "(" + relatedId + ")" }, header)
                .then(function () { });
        }

    /**
     * Removes a reference to an entity for a single-valued navigation property. (1:N)
     *
     * @param {string} collection - Entity collection name that contains an attribute.
     * @param {string} id - Entity record Id that contains an attribute.
     * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    var disassociateRecordsSingleValued =
        /**
         * @param {string} collection - Entity collection name that contains an attribute.
         * @param {string} id - Entity record Id that contains an attribute.
         * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
         * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        function (collection, id, singleValuedNavigationPropertyName, impersonateUserId) {

            _stringParameterCheck(collection, "DynamicsWebApi.disassociateSingleValued", "collection");
            id = _guidParameterCheck(id, "DynamicsWebApi.disassociateSingleValued", "id");
            _stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.disassociateSingleValued", "singleValuedNavigationPropertyName");

            var header = {};

            if (impersonateUserId != null) {
                impersonateUserId = _guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
                header["MSCRMCallerID"] = impersonateUserId;
            }

            return _sendRequest("DELETE", collection + "(" + id + ")/" + singleValuedNavigationPropertyName + "/$ref", null, header)
                .then(function () { });
        }

    /**
     * Executes an unbound function (not bound to a particular entity record)
     *
     * @param {string} functionName - The name of the function.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.executeUnboundFunction =
        /**
         * @param {string} functionName - The name of the function.
         * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
         * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        function (functionName, parameters, impersonateUserId) {
            return _executeFunction(functionName, parameters, null, null, impersonateUserId);
        }

    /**
     * Executes a bound function
     *
     * @param {string} id - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
     * @param {string} functionName - The name of the function.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.executeBoundFunction =
        /**
         * @param {string} id - A String representing the GUID value for the record.
         * @param {string} collection - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
         * @param {string} functionName - The name of the function.
         * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
         * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        function (id, collection, functionName, parameters, impersonateUserId) {
            return _executeFunction(functionName, parameters, collection, id, impersonateUserId);
        }

    var _buildFunctionParameters = function (parameters) {
        /// <summary>Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'</summary>
        /// <param name="parameters" type="Object" optional="true">Function Parameters</param>
        /// <returns type="String" />
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
    }

    /**
     * Executes a function
     *
     * @param {string} id - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
     * @param {string} functionName - The name of the function.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    var _executeFunction =
        /**
         * @param {string} [id] - A String representing the GUID value for the record.
         * @param {string} [collection] - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
         * @param {string} functionName - The name of the function.
         * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
         * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        function (functionName, parameters, collection, id, impersonateUserId) {

            _stringParameterCheck(functionName, "DynamicsWebApi.executeFunction", "functionName");
            var url = functionName + _buildFunctionParameters(parameters);

            if (collection != null) {
                _stringParameterCheck(collection, "DynamicsWebApi.executeFunction", "collection");
                id = _guidParameterCheck(id, "DynamicsWebApi.executeFunction", "id");

                url = collection + "(" + id + ")/" + url;
            }

            var header = {};

            if (impersonateUserId != null) {
                header["MSCRMCallerID"] = _guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            }

            return _sendRequest("GET", url, null, header).then(function (response) {
                if (response.data) {
                    return response.data;
                }
            });
        }

    /**
     * Executes an unbound Web API action (not bound to a particular entity record)
     *
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} requestObject - Action request body object.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.executeUnboundAction =
        /**
         * @param {string} actionName - The name of the Web API action.
         * @param {Object} requestObject - Action request body object.
         * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         */
        function (actionName, requestObject, impersonateUserId) {
            return _executeAction(actionName, requestObject, null, null, impersonateUserId);
        }

    /**
     * Executes a bound Web API action (bound to a particular entity record)
     *
     * @param {string} id - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} requestObject - Action request body object.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.executeBoundAction =
        /**
         * @param {string} id - A String representing the GUID value for the record.
         * @param {string} collection - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
         * @param {string} actionName - The name of the Web API action.
         * @param {Object} requestObject - Action request body object.
         * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         * @returns {Promise}
         */
        function (id, collection, actionName, requestObject, impersonateUserId) {
            return _executeAction(actionName, requestObject, collection, id, impersonateUserId);
        }

    /**
     * Executes a Web API action
     *
     * @param {string} [id] - A String representing the GUID value for the record.
     * @param {string} [collection] - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} requestObject - Action request body object.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    var _executeAction =
        /**
         * @param {string} [id] - A String representing the GUID value for the record.
         * @param {string} [collection] - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
         * @param {string} actionName - The name of the Web API action.
         * @param {Object} requestObject - Action request body object.
         * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
         * @returns {Promise}
         */
        function (actionName, requestObject, collection, id, impersonateUserId) {

            _stringParameterCheck(actionName, "DynamicsWebApi.executeAction", "actionName");
            var url = actionName;

            if (collection != null) {
                _stringParameterCheck(collection, "DynamicsWebApi.executeAction", "collection");
                id = _guidParameterCheck(id, "DynamicsWebApi.executeAction", "id");

                url = collection + "(" + id + ")/" + url;
            }

            var header = {};

            if (impersonateUserId != null) {
                impersonateUserId = _guidParameterCheck(impersonateUserId, "DynamicsWebApi.executeAction", "impersonateUserId");
                header["MSCRMCallerID"] = impersonateUserId;
            }

            return _sendRequest("POST", url, requestObject, header).then(function (response) {
                if (response.data) {
                    return response.data;
                }
            });
        }

    /**
     * Creates a new instance of DynamicsWebApi
     *
     * @param {string} [config] - configuration object.
     * @returns {DynamicsWebApi}
     */
    this.initializeInstance =
        /**
         * @param {string} [config] - configuration object.
         * @returns {DynamicsWebApi}
         */
        function (config) {

            if (!config) {
                config = {
                    impersonate: _impersonateUserId,
                    webApiUrl: _webApiUrl,
                    webApiVersion: _webApiVersion
                };
            }

            return new DynamicsWebApi(config);
        }

    //this.create = createRecord;
    //this.update = updateRecord;
    //this.updateRequest = updateRequest;
    //this.upsert = upsertRecord;
    //this.upsertRequest = upsertRequest;
    //this.deleteRecord = deleteRecord;
    //this.deleteRequest = deleteRequest;
    //this.executeFetchXml = executeFetchXml;
    //this.count = countRecords;
    //this.retrieve = retrieveRecord;
    //this.retrieveRequest = retrieveRequest;
    //this.retrieveMultiple = retrieveMultipleRecords;
    //this.retrieveMultipleRequest = retrieveMultipleRecordsAdvanced;
    //this.updateSingleProperty = updateSingleProperty;
    //this.associate = associateRecords;
    //this.disassociate = disassociateRecords;
    //this.associateSingleValued = associateRecordsSingleValued;
    //this.disassociateSingleValued = disassociateRecordsSingleValued;
    //this.executeBoundFunction = executeBoundFunction;
    //this.executeUnboundFunction = executeUnboundFunction;
    //this.executeBoundAction = executeBoundAction;
    //this.executeUnboundAction = executeUnboundAction;
    //this.setConfig = setConfig;
    //this.initializeInstance = createInstance;

    // return {
    //     create: createRecord,
    //     update: updateRecord,
    //     updateRequest: updateRequest,
    //     upsert: upsertRecord,
    //     upsertRequest: upsertRequest,
    //     deleteRecord: deleteRecord,
    //     deleteRequest: deleteRequest,
    //     executeFetchXml: executeFetchXml,
    //     count: countRecords,
    //     retrieve: retrieveRecord,
    //     retrieveRequest: retrieveRequest,
    //     retrieveMultiple: retrieveMultipleRecords,
    //     retrieveMultipleRequest: retrieveMultipleRecordsAdvanced,
    //     updateSingleProperty: updateSingleProperty,
    //     associate: associateRecords,
    //     disassociate: disassociateRecords,
    //     associateSingleValued: associateRecordsSingleValued,
    //     disassociateSingleValued: disassociateRecordsSingleValued,
    //     executeBoundFunction: executeBoundFunction,
    //     executeUnboundFunction: executeUnboundFunction,
    //     executeBoundAction: executeBoundAction,
    //     executeUnboundAction: executeUnboundAction,
    //     setConfig: setConfig,
    //     initializeInstance: createInstance,
    //     //**for tests only**
    //     __forTestsOnly__: {
    //         sendRequest: _sendRequest,
    //         getPagingCookie: getPagingCookie,
    //         convertOptions: convertOptions,
    //         convertRequestToLink: convertRequestToLink,
    //         convertToReferenceObject: _convertToReferenceObject,
    //         executeFunction: _executeFunction,
    //         executeAction: _executeAction,
    //         buildFunctionParameters: _buildFunctionParameters
    //     }
    //     //**for tests only end**
    // }
};

module.exports = new DynamicsWebApi(null);