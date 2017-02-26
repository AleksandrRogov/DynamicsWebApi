/*
 DynamicsWebApi.Callbacks v1.0.0 (for Dynamics 365 (online), Dynamics 365 (on-premises), Dynamics CRM 2016, Dynamics CRM Online)

 Copyright (c) 2016. 
 Author: Aleksandr Rogov (https://github.com/AleksandrRogov)
 MIT License

*/

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
                /// <param name='page' type='Number'>Page Number</param>  
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

var DynamicsWebApi = function (config) {
    /// <summary>DynamicsWebApi - a Microsoft Dynamics CRM Web API helper library. Current version uses Callbacks instead of Promises.</summary>
    ///<param name="config" type="Object">
    /// DynamicsWebApi Configuration object
    ///<para>   config.webApiVersion (String).
    ///             The version of Web API to use, for example: "8.1"</para>
    ///<para>   config.webApiUrl (String).
    ///             A String representing a URL to Web API (webApiVersion not required if webApiUrl specified) [optional, if used inside of CRM]</para>
    ///</param>

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
            else { throw new Error("Context is not available."); }
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

        var clientUrl = Xrm.Page.context.getClientUrl();

        if (clientUrl.match(/\/$/)) {
            clientUrl = clientUrl.substring(0, clientUrl.length - 1);
        }
        return clientUrl;
    };

    var _impersonateUserId = null;
    var _webApiVersion = "8.0";

    var _initUrl = function () {
        return _getClientUrl() + "/api/data/v" + _webApiVersion + "/";
    }

    var _webApiUrl = _initUrl();

    var _propertyReplacer = function (key, value) {
        /// <param name="key" type="String">Description</param>
        if (key.endsWith("@odata.bind") && typeof value === "string" && !value.startsWith(_webApiUrl)) {
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

    var _callbackParameterCheck = function (callbackParameter, functionName, parameterName) {
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
            throw new Error(functionName + " requires the " + parameterName + " parameter is a Function.");
        }
    }

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

    var _sendRequest = function (action, uri, successCallback, errorCallback, data, additionalHeaders) {
        /// <summary>Sends a request to given URL with given parameters</summary>
        /// <param name="method" type="String">Method of the request</param>
        /// <param name="url" type="String">The request URL</param>
        /// <param name="data" type="Object" optional="true">Data to send in the request</param>
        /// <param name="additionalHeaders" type="Object" optional="true">Object with additional headers.<para>IMPORTANT! This object does not contain default headers needed for every request.</para></param>
        /// <param name="successCallback" type="Function">A callback called on success of the request</param>
        /// <param name="errorCallback" type="Function">A callback called when a request failed</param>

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

                        successCallback(response);
                        break;
                    }
                    default: // All other statuses are error cases.
                        //var error;
                        //try {
                        //    error = JSON.parse(request.response).error;
                        //} catch (e) {
                        //    error = new Error("Unexpected Error");
                        //}
                        errorCallback(this);
                        break;
                }
            }
        };
        data
            ? request.send(JSON.stringify(data, _propertyReplacer))
            : request.send();
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
            type: "",
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

    var setConfig = function (config) {
        ///<summary>Sets the configuration parameters for DynamicsWebApi helper.</summary>
        ///<param name="config" type="Object">
        /// Retrieve multiple request options
        ///<para>   config.impersonate (String)
        ///             A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.</para>
        ///<para>   config.webApiVersion (String). 
        ///             The version of Web API to use, for example: "8.1"</para>
        ///<para>   config.webApiUrl (String).
        ///             A String representing a URL to Web API (webApiVersion not required if webApiUrl specified) [optional, if used inside of CRM]</para>
        ///</param>

        if (config.webApiVersion != null) {
            _stringParameterCheck(config.webApiVersion, "DynamicsWebApi.setConfig", "config.webApiVersion");
            _webApiVersion = config.webApiVersion;
            _webApiUrl = _initUrl();
        }

        if (config.webApiUrl != null) {
            _stringParameterCheck(config.webApiUrl, "DynamicsWebApi.setConfig", "config.webApiUrl");
            _webApiUrl = config.webApiUrl;
        }

        if (config.impersonate != null) {
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

    var createRecord = function (object, collection, successCallback, errorCallback, prefer) {
        ///<summary>
        /// Sends an asynchronous request to create a new record.
        ///</summary>
        ///<param name="object" type="Object">
        /// A JavaScript object with properties corresponding to the Schema name of
        /// entity attributes that are valid for create operations.
        ///</param>
        ///<param name="collection" type="String">
        /// The Logical Name of the Entity Collection name to create.
        /// For an Account record, use "accounts"
        ///</param>
        ///<param name="prefer" type="String" optional="true">
        /// If set to "return=representation" the function will return a newly created object.
        ///</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function can accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>

        _parameterCheck(object, "DynamicsWebApi.create", "object");
        _stringParameterCheck(collection, "DynamicsWebApi.create", "collection");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.create", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.create", "errorCallback");

        var headers = null;

        if (prefer != null) {
            _stringParameterCheck(prefer, "DynamicsWebApi.create", "prefer");
            headers = { "Prefer": prefer };
        }

        var onSuccess = function (response) {
            if (response.data) {
                successCallback(response.data);
            }
            else {
                var entityUrl = response.headers['OData-EntityId'];
                var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                successCallback(id);
            }
        }

        _sendRequest("POST", collection.toLowerCase(), onSuccess, errorCallback, object, headers);
    };

    var updateRequest = function (request, successCallback, errorCallback) {
        ///<summary>
        /// Sends an asynchronous request to update a record.
        ///</summary>
        ///<param name="request" type="dwaRequest">
        /// An object that represents all possible options for a current request.
        ///</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>

        _parameterCheck(request, "DynamicsWebApi.update", "request");
        _parameterCheck(request.entity, "DynamicsWebApi.update", "request.entity");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.update", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.update", "errorCallback");

        var result = convertRequestToLink(request, "update");

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

        _sendRequest("PATCH", result.url, onSuccess, onError, request.entity, result.headers);
    }

    var updateRecord = function (id, collection, object, successCallback, errorCallback, prefer, select) {
        ///<summary>
        /// Sends an asynchronous request to update a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        ///<param name="object" type="Object">
        /// A JavaScript object with properties corresponding to the logical names for
        /// entity attributes that are valid for update operations.
        ///</param>
        ///<param name="collection" type="String">
        /// The Logical Name of the Entity Collection name to retrieve.
        /// For an Account record, use "accounts"
        ///</param>
        ///<param name="prefer" type="String" optional="true">
        /// If set to "return=representation" the function will return a newly created object.
        ///</param>
        ///<param name="select" type="Array" optional="true">
        /// Limits returned properties with update when prefer equals "return=representation" 
        ///</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>

        _stringParameterCheck(id, "DynamicsWebApi.update", "id");
        id = _guidParameterCheck(id, "DynamicsWebApi.update", "id")
        _parameterCheck(object, "DynamicsWebApi.update", "object");
        _stringParameterCheck(collection, "DynamicsWebApi.update", "collection");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.update", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.update", "errorCallback");

        var headers = { "If-Match": "*" }; //to prevent upsert

        if (prefer != null) {
            _stringParameterCheck(prefer, "DynamicsWebApi.update", "prefer");
            headers["Prefer"] = prefer;
        }

        var systemQueryOptions = "";

        if (select != null) {
            _arrayParameterCheck(select, "DynamicsWebApi.update", "select");

            if (select != null && select.length > 0) {
                systemQueryOptions = "?$select=" + select.join(",");
            }
        }

        var onSuccess = function (response) {
            response.data
                ? successCallback(response.data)
                : successCallback();
        };

        _sendRequest("PATCH", collection.toLowerCase() + "(" + id + ")" + systemQueryOptions, onSuccess, errorCallback, object, headers);
    };

    var updateSingleProperty = function (id, collection, keyValuePair, successCallback, errorCallback, prefer) {
        ///<summary>
        /// Sends an asynchronous request to update a single value in the record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        ///<param name="keyValuePair" type="Object">
        /// keyValuePair object with a logical name of the field as a key and a value. Example:
        /// <para>{subject: "Update Record"}</para>
        ///</param>
        ///<param name="collection" type="String">
        /// The Logical Name of the Entity Collection name to retrieve.
        /// For an Account record, use "accounts"
        ///</param>
        ///<param name="prefer" type="String" optional="true">
        /// If set to "return=representation" the function will return a newly created object.
        ///</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>

        _stringParameterCheck(id, "DynamicsWebApi.updateSingleProperty", "id");
        id = _guidParameterCheck(id, "DynamicsWebApi.updateSingleProperty", "id");
        _parameterCheck(keyValuePair, "DynamicsWebApi.updateSingleProperty", "keyValuePair");
        _stringParameterCheck(collection, "DynamicsWebApi.updateSingleProperty", "collection");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.updateSingleProperty", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.updateSingleProperty", "errorCallback");

        var headers = null;

        if (prefer != null) {
            _stringParameterCheck(prefer, "DynamicsWebApi.updateSingleProperty", "prefer");
            headers = { "Prefer": prefer };
        }

        var onSuccess = function (response) {
            response.data
                ? successCallback(response.data)
                : successCallback();
        };

        var key = Object.keys(keyValuePair)[0];
        var keyValue = keyValuePair[key];

        _sendRequest("PUT", collection.toLowerCase() + "(" + id + ")/" + key, onSuccess, errorCallback, { value: keyValue }, headers);
    };

    var deleteRequest = function (request, successCallback, errorCallback) {
        ///<summary>
        /// Sends an asynchronous request to delete a record.
        ///</summary>
        ///<param name="request" type="dwaRequest">
        /// An object that represents all possible options for a current request.
        ///</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>

        _parameterCheck(request, "DynamicsWebApi.delete", "request")
        _callbackParameterCheck(successCallback, "DynamicsWebApi.delete", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.delete", "errorCallback");

        var result = convertRequestToLink(request, "delete");

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

        _sendRequest("DELETE", result.url, onSuccess, onError, null, result.headers);
    }

    var deleteRecord = function (id, collection, successCallback, errorCallback, propertyName) {
        ///<summary>
        /// Sends an asynchronous request to delete a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to delete.
        ///</param>
        ///<param name="collection" type="String">
        /// The Logical Name of the Entity Collection name to delete.
        /// For an Account record, use "accounts"
        ///</param>
        ///<param name="propertyName" type="String" optional="true">
        /// The name of the property which needs to be emptied. Instead of removing a whole record
        /// only the specified property will be cleared.
        ///</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>

        _stringParameterCheck(id, "DynamicsWebApi.delete", "id");
        id = _guidParameterCheck(id, "DynamicsWebApi.delete", "id");
        _stringParameterCheck(collection, "DynamicsWebApi.delete", "collection");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.delete", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.delete", "errorCallback");

        if (propertyName != null)
            _stringParameterCheck(propertyName, "DynamicsWebApi.delete", "propertyName");

        var url = collection.toLowerCase() + "(" + id + ")";

        if (propertyName != null)
            url += "/" + propertyName;

        var onSuccess = function (xhr) {
            // Nothing is returned to the success function.
            successCallback();
        };

        _sendRequest("DELETE", url, onSuccess, errorCallback);
    };

    var retrieveRequest = function (request, successCallback, errorCallback) {
        ///<summary>
        /// Sends an asynchronous request to retrieve a record.
        ///</summary>
        ///<param name="request" type="dwaRequest">
        /// An object that represents all possible options for a current request.
        ///</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>

        _parameterCheck(request, "DynamicsWebApi.retrieve", "request")
        _callbackParameterCheck(successCallback, "DynamicsWebApi.retrieve", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieve", "errorCallback");

        var result = convertRequestToLink(request, "retrieve");

        //copy locally
        var select = request.select;
        var onSuccess = function (response) {
            if (select != null && select.length == 1 && select[0].endsWith("/$ref") && response.data["@odata.id"] != null) {
                successCallback(_convertToReferenceObject(response.data));
            }
            else {
                successCallback(response.data);
            }
        };

        _sendRequest("GET", result.url, onSuccess, errorCallback, null, result.headers);
    }

    var retrieveRecord = function (id, collection, successCallback, errorCallback, select, expand) {
        ///<summary>
        /// Sends an asynchronous request to retrieve a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        ///<param name="collection" type="String">
        /// The Logical Name of the Entity Collection name to retrieve.
        /// For an Account record, use "accounts"
        ///</param>
        ///<param name="select" type="Array">
        /// An Array representing the $select OData System Query Option to control which
        /// attributes will be returned. This is a list of Attribute names that are valid for retrieve.
        /// If null all properties for the record will be returned
        ///</param>
        ///<param name="expand" type="String">
        /// A String representing the $expand OData System Query Option value to control which
        /// related records are also returned. This is a comma separated list of of up to 6 entity relationship names
        /// If null no expanded related records will be returned.
        ///</param>
        ///<param name="prefer" type="String">
        /// A String representing the 'Prefer: odata.include-annotations' header value. 
        /// It can be used to include annotations that will provide additional information about the data in selected properties.
        /// <para>Example values: "*"; "OData.Community.Display.V1.FormattedValue" and etc.</para>
        ///</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>

        _stringParameterCheck(id, "DynamicsWebApi.retrieve", "id");
        id = _guidParameterCheck(id, "DynamicsWebApi.retrieve", "id")
        _stringParameterCheck(collection, "DynamicsWebApi.retrieve", "collection");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.retrieve", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieve", "errorCallback");

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

        var onSuccess = function (response) {
            if (select != null && select.length == 1 && select[0].endsWith("/$ref") && response.data["@odata.id"] != null) {
                successCallback(_convertToReferenceObject(response.data));
            }
            else {
                successCallback(response.data);
            }
        };

        _sendRequest("GET", url, onSuccess, errorCallback);
    };

    var upsertRequest = function (request, successCallback, errorCallback) {
        ///<summary>
        /// Sends an asynchronous request to upsert a record.
        ///</summary>
        ///<param name="request" type="dwaRequest">
        /// An object that represents all possible options for a current request.
        ///</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>

        _parameterCheck(request, "DynamicsWebApi.upsert", "request");
        _parameterCheck(request.entity, "DynamicsWebApi.upsert", "request.entity");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.upsert", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.upsert", "errorCallback");

        var result = convertRequestToLink(request, "upsert");

        //copy locally
        var ifnonematch = request.ifnonematch;
        var ifmatch = request.ifmatch;
        var onSuccess = function (response) {
            if (response.headers['OData-EntityId']) {
                var entityUrl = response.headers['OData-EntityId'];
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

        _sendRequest("PATCH", result.url, onSuccess, onError, request.entity, result.headers);
    }

    var upsertRecord = function (id, collection, object, successCallback, errorCallback, prefer, select) {
        ///<summary>
        /// Sends an asynchronous request to Upsert a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        ///<param name="object" type="Object">
        /// A JavaScript object with properties corresponding to the logical names for
        /// entity attributes that are valid for upsert operations.
        ///</param>
        ///<param name="collection" type="String">
        /// The Logical Name of the Entity Collection name record to Upsert.
        /// For an Account record, use "accounts".
        ///</param>
        ///<param name="prefer" type="String" optional="true">
        /// If set to "return=representation" the function will return a newly created object
        ///</param>
        ///<param name="select" type="Array" optional="true">
        /// Limits returned properties with upsert when prefer equals "return=representation". 
        ///</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>

        _stringParameterCheck(id, "DynamicsWebApi.upsert", "id");
        id = _guidParameterCheck(id, "DynamicsWebApi.upsert", "id")

        _parameterCheck(object, "DynamicsWebApi.upsert", "object");
        _stringParameterCheck(collection, "DynamicsWebApi.upsert", "collection");

        _callbackParameterCheck(successCallback, "DynamicsWebApi.upsert", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.upsert", "errorCallback");

        var headers = {};

        if (prefer != null) {
            _stringParameterCheck(prefer, "DynamicsWebApi.upsert", "prefer");
            headers["Prefer"] = prefer;
        }

        var systemQueryOptions = "";

        if (select != null) {
            _arrayParameterCheck(select, "DynamicsWebApi.upsert", "select");

            if (select != null && select.length > 0) {
                systemQueryOptions = "?$select=" + select.join(",");
            }
        }

        var onSuccess = function (response) {
            if (response.headers['OData-EntityId']) {
                var entityUrl = response.headers['OData-EntityId'];
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

        _sendRequest("PATCH", collection.toLowerCase() + "(" + id + ")" + systemQueryOptions, onSuccess, errorCallback, object, headers);
    }

    var countRecords = function (collection, successCallback, errorCallback, filter) {
        ///<summary>
        /// Sends an asynchronous request to count records.
        ///</summary>
        /// <param name="collection" type="String">The Logical Name of the Entity Collection to retrieve. For an Account record, use "accounts".</param>
        /// <param name="filter" type="String" optional="true">Use the $filter system query option to set criteria for which entities will be returned.</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>

        if (filter == null || (filter != null && !filter.length)) {
            _stringParameterCheck(collection, "DynamicsWebApi.count", "collection");
            _callbackParameterCheck(successCallback, "DynamicsWebApi.count", "successCallback");
            _callbackParameterCheck(errorCallback, "DynamicsWebApi.count", "errorCallback");

            //if filter has not been specified then simplify the request

            var onSuccess = function (response) {
                successCallback(response.data ? parseInt(response.data) : 0);
            };

            _sendRequest("GET", collection.toLowerCase() + "/$count", onSuccess, errorCallback)
        }
        else {
            return retrieveMultipleRecordsAdvanced({
                collection: collection,
                filter: filter,
                count: true
            }, function (response) {
                successCallback(response.oDataCount ? response.oDataCount : 0);
            }, errorCallback);
        }
    }

    var retrieveMultipleRecords = function (collection, successCallback, errorCallback, select, filter, nextPageLink) {
        ///<summary>
        /// Sends an asynchronous request to retrieve records.
        ///</summary>
        /// <param name="collection" type="String">The Logical Name of the Entity Collection to retrieve. For an Account record, use "accounts".</param>
        /// <param name="select" type="Array" optional="true">Use the $select system query option to limit the properties returned as shown in the following example.</param>
        /// <param name="filter" type="String" optional="true">Use the $filter system query option to set criteria for which entities will be returned.</param>
        /// <param name="nextPageLink" type="String" optional="true">Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>

        return retrieveMultipleRecordsAdvanced({
            collection: collection,
            select: select,
            filter: filter
        }, successCallback, errorCallback, nextPageLink);
    }

    var retrieveMultipleRecordsAdvanced = function (request, successCallback, errorCallback, nextPageLink) {
        ///<summary>
        /// Sends an asynchronous request to retrieve records.
        ///</summary>
        ///<param name="request" type="dwaRequest">
        /// Retrieve multiple request options
        ///</param>
        ///<para>   object.collection (String). 
        ///             The Logical Name of the Entity Collection to retrieve. For an Account record, use "accounts".</para>
        ///<para>   object.id (String).
        ///             A String representing the GUID value for the record to retrieve.
        ///<para>   object.select (Array). 
        ///             Use the $select system query option to limit the properties returned as shown in the following example.</para>
        ///<para>   object.filter (String). 
        ///             Use the $filter system query option to set criteria for which entities will be returned.</para>
        ///<para>   object.maxPageSize (Number). 
        ///             Use the odata.maxpagesize preference value to request the number of entities returned in the response.</para>
        ///<para>   object.count (Boolean). 
        ///             Use the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000. Do not use $top with $count!</para>
        ///<para>   object.top (Number). 
        ///             Limit the number of results returned by using the $top system query option. Do not use $top with $count!</para>
        ///<para>   object.orderBy (Array). 
        ///             Use the order in which items are returned using the $orderby system query option. Use the asc or desc suffix to specify ascending or descending order respectively. The default is ascending if the suffix isn't applied.</para>
        ///<para>   object.includeAnnotations (String). 
        ///             Values can be "OData.Community.Display.V1.FormattedValue"; "*" and other - for lookups.</para>
        ///</param>
        ///<param name="select" type="nextPageLink" optional="true">
        /// Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to request.
        ///</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>

        _callbackParameterCheck(successCallback, "DynamicsWebApi.retrieveMultiple", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieveMultiple", "errorCallback");

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

        _sendRequest("GET", result.url, onSuccess, errorCallback, null, result.headers);
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
        return null;
    }

    var executeFetchXml = function (collection, fetchXml, successCallback, errorCallback, includeAnnotations, pageNumber, pagingCookie, impersonateUserId) {
        ///<summary>
        /// Sends an asynchronous request to count records.
        ///</summary>
        /// <param name="collection" type="String">The Logical Name of the Entity Collection to retrieve. For an Account record, use "account".</param>
        /// <param name="fetchXml" type="String">FetchXML is a proprietary query language that provides capabilities to perform aggregation.</param>
        /// <param name="includeAnnotations" type="String" optional="true">Use this parameter to include annotations to a result.<para>For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie</para></param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        /// <param name="pageNumber" type="Number" optional="true">Page number.</param>
        /// <param name="pagingCookie" type="String" optional="true">Paging cookie. For retrieving the first page, pagingCookie should be null. param>
        /// <param name="impersonateUserId" type="String" optional="true">A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.</param>

        _stringParameterCheck(collection, "DynamicsWebApi.executeFetchXml", "collection");
        _stringParameterCheck(fetchXml, "DynamicsWebApi.executeFetchXml", "fetchXml");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.executeFetchXml", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.executeFetchXml", "errorCallback");

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

        var onSuccess = function (response) {
            if (response.data['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'] != null) {
                response.data.PagingInfo = getPagingCookie(response.data['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'], pageNumber);
            }

            if (response.data['@odata.context'] != null) {
                response.data.oDataContext = response.data['@odata.context'];
            }

            successCallback(response.data);
        };

        _sendRequest("GET", collection.toLowerCase() + "?fetchXml=" + encodedFetchXml, onSuccess, errorCallback, null, headers);
    }

    var associateRecords = function (primarycollection, primaryId, relationshipName, relatedcollection, relatedId, successCallback, errorCallback, impersonateUserId) {
        /// <summary>Associate for a collection-valued navigation property. (1:N or N:N)</summary>
        /// <param name="primarycollection" type="String">Primary entity collection name.</param>
        /// <param name="primaryId" type="String">Primary entity record id.</param>
        /// <param name="relationshipName" type="String">Relationship name.</param>
        /// <param name="relatedcollection" type="String">Related colletion name.</param>
        /// <param name="relatedId" type="String">Related entity record id.</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        /// <param name="impersonateUserId" type="String" optional="true">A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.</param>
        _stringParameterCheck(primarycollection, "DynamicsWebApi.associate", "primarycollection");
        _stringParameterCheck(relatedcollection, "DynamicsWebApi.associate", "relatedcollection");
        _stringParameterCheck(relationshipName, "DynamicsWebApi.associate", "relationshipName");
        primaryId = _guidParameterCheck(primaryId, "DynamicsWebApi.associate", "primaryId");
        relatedId = _guidParameterCheck(relatedId, "DynamicsWebApi.associate", "relatedId");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.associate", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.associate", "errorCallback");

        var onSuccess = function () {
            successCallback();
        };

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = _guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        var object = { "@odata.id": _webApiUrl + relatedcollection + "(" + relatedId + ")" };

        _sendRequest("POST",
            primarycollection + "(" + primaryId + ")/" + relationshipName + "/$ref",
            onSuccess, errorCallback, object, header);
    }

    var disassociateRecords = function (primarycollection, primaryId, relationshipName, relatedId, successCallback, errorCallback, impersonateUserId) {
        /// <summary>Disassociate for a collection-valued navigation property.</summary>
        /// <param name="primarycollection" type="String">Primary entity collection name</param>
        /// <param name="primaryId" type="String">Primary entity record id</param>
        /// <param name="relationshipName" type="String">Relationship name</param>
        /// <param name="relatedId" type="String">Related entity record id</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        /// <param name="impersonateUserId" type="String" optional="true">A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.</param>

        _stringParameterCheck(primarycollection, "DynamicsWebApi.disassociate", "primarycollection");
        _stringParameterCheck(relationshipName, "DynamicsWebApi.disassociate", "relationshipName");
        primaryId = _guidParameterCheck(primaryId, "DynamicsWebApi.disassociate", "primaryId");
        relatedId = _guidParameterCheck(relatedId, "DynamicsWebApi.disassociate", "relatedId");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.disassociate", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.disassociate", "errorCallback");

        var onSuccess = function () {
            successCallback();
        };

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = _guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        _sendRequest("DELETE", primarycollection + "(" + primaryId + ")/" + relationshipName + "(" + relatedId + ")/$ref", onSuccess, errorCallback, null, header);
    }

    var associateRecordsSingleValued = function (collection, id, singleValuedNavigationPropertyName, relatedcollection, relatedId, successCallback, errorCallback, impersonateUserId) {
        /// <summary>Associate for a single-valued navigation property. (1:N)</summary>
        /// <param name="collection" type="String">Entity collection name that contains an attribute.</param>
        /// <param name="id" type="String">Entity record id that contains a attribute.</param>
        /// <param name="singleValuedNavigationPropertyName" type="String">Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).</param>
        /// <param name="relatedcollection" type="String">Related collection name that the lookup (attribute) points to.</param>
        /// <param name="relatedId" type="String">Related entity record id that needs to be associated.</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        /// <param name="impersonateUserId" type="String" optional="true">A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.</param>

        _stringParameterCheck(collection, "DynamicsWebApi.associateSingleValued", "collection");
        id = _guidParameterCheck(id, "DynamicsWebApi.associateSingleValued", "id");
        relatedId = _guidParameterCheck(relatedId, "DynamicsWebApi.associateSingleValued", "relatedId");
        _stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.associateSingleValued", "singleValuedNavigationPropertyName");
        _stringParameterCheck(relatedcollection, "DynamicsWebApi.associateSingleValued", "relatedcollection");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.associateSingleValued", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.associateSingleValued", "errorCallback");

        var onSuccess = function () {
            successCallback();
        };

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = _guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        var object = { "@odata.id": _webApiUrl + relatedcollection + "(" + relatedId + ")" };

        _sendRequest("PUT",
            collection + "(" + id + ")/" + singleValuedNavigationPropertyName + "/$ref",
            onSuccess, errorCallback, object, header);
    }

    var disassociateRecordsSingleValued = function (collection, id, singleValuedNavigationPropertyName, successCallback, errorCallback, impersonateUserId) {
        /// <summary>Removes a reference to an entity for a single-valued navigation property. (1:N)</summary>
        /// <param name="collection" type="String">Entity collection name that contains an attribute.</param>
        /// <param name="id" type="String">Entity record id that contains a attribute.</param>
        /// <param name="singleValuedNavigationPropertyName" type="String">Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        /// <param name="impersonateUserId" type="String" optional="true">A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.</param>

        _stringParameterCheck(collection, "DynamicsWebApi.disassociateSingleValued", "collection");
        id = _guidParameterCheck(id, "DynamicsWebApi.disassociateSingleValued", "id");
        _stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.disassociateSingleValued", "singleValuedNavigationPropertyName");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.disassociateSingleValued", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.disassociateSingleValued", "errorCallback");

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = _guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        var onSuccess = function () {
            successCallback();
        };

        _sendRequest("DELETE", collection + "(" + id + ")/" + singleValuedNavigationPropertyName + "/$ref", onSuccess, errorCallback, null, header);
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

    var executeUnboundFunction = function (functionName, successCallback, errorCallback, parameters, impersonateUserId) {
        /// <summary>Executes an unbound function (not bound to a particular entity record)</summary>
        /// <param name="functionName" type="String">The name of the function</param>
        /// <param name="parameters" type="Object" optional="true">Function's input parameters. Example: { param1: "test", param2: 3 }</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        /// <param name="impersonateUserId" type="String" optional="true">A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.</param>
        return _executeFunction(functionName, parameters, null, null, successCallback, errorCallback, impersonateUserId);
    }

    var executeBoundFunction = function (id, collection, functionName, successCallback, errorCallback, parameters, impersonateUserId) {
        /// <summary>Executes a bound function</summary>
        /// <param name="id" type="String">A String representing the GUID value for the record.</param>
        /// <param name="collection" type="String">The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.</param>
        /// <param name="functionName" type="String">The name of the function</param>
        /// <param name="parameters" type="Object" optional="true">Function's input parameters. Example: { param1: "test", param2: 3 }</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        /// <param name="impersonateUserId" type="String" optional="true">A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.</param>
        return _executeFunction(functionName, parameters, collection, id, successCallback, errorCallback, impersonateUserId);
    }

    var _executeFunction = function (functionName, parameters, collection, id, successCallback, errorCallback, impersonateUserId) {
        /// <summary>Executes a bound function</summary>
        /// <param name="id" type="String" optional="true">A String representing the GUID value for the record.</param>
        /// <param name="collection" type="String" optional="true">The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.</param>
        /// <param name="functionName" type="String">The name of the function</param>
        /// <param name="parameters" type="Object" optional="true">Function's input parameters. Example: { param1: "test", param2: 3 }</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        /// <param name="impersonateUserId" type="String" optional="true">A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.</param>

        _stringParameterCheck(functionName, "DynamicsWebApi.executeFunction", "functionName");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.executeFunction", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.executeFunction", "errorCallback");
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

        var onSuccess = function (response) {
            response.data
                ? successCallback(response.data)
                : successCallback();
        };

        _sendRequest("GET", url, onSuccess, errorCallback, null, header);
    }

    var executeUnboundAction = function (actionName, requestObject, successCallback, errorCallback, impersonateUserId) {
        /// <summary>Executes an unbound Web API action</summary>
        /// <param name="actionName" type="String">The name of the Web API action.</param>
        /// <param name="requestObject" type="object">Action request body object.</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        /// <param name="impersonateUserId" type="String" optional="true">A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.</param>
        return _executeAction(actionName, requestObject, null, null, successCallback, errorCallback, impersonateUserId);
    }

    var executeBoundAction = function (id, collection, actionName, requestObject, successCallback, errorCallback, impersonateUserId) {
        /// <summary>Executes a bound Web API action</summary>
        /// <param name="actionName" type="String">The name of the Web API action.</param>
        /// <param name="requestObject" type="object">Action request body object.</param>
        /// <param name="id" type="String">A String representing the GUID value for the record.</param>
        /// <param name="collection" type="String">The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        /// <param name="impersonateUserId" type="String" optional="true">A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.</param>
        return _executeAction(actionName, requestObject, collection, id, successCallback, errorCallback, impersonateUserId);
    }

    var _executeAction = function (actionName, requestObject, collection, id, successCallback, errorCallback, impersonateUserId) {
        /// <summary>Executes a Web API action</summary>
        /// <param name="actionName" type="String">The name of the Web API action.</param>
        /// <param name="requestObject" type="object">Action request body object.</param>
        /// <param name="id" type="String" optional="true">A String representing the GUID value for the record.</param>
        /// <param name="collection" type="String" optional="true">The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.</param>
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        /// <param name="impersonateUserId" type="String" optional="true">A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.</param>

        _stringParameterCheck(actionName, "DynamicsWebApi.executeAction", "actionName");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.executeAction", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.executeAction", "errorCallback");
        var url = actionName;

        if (collection != null) {
            _stringParameterCheck(collection, "DynamicsWebApi.executeAction", "collection");
            id = _guidParameterCheck(id, "DynamicsWebApi.executeAction", "id");

            url = collection + "(" + id + ")/" + url;
        }

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = _guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        var onSuccess = function (response) {
            response.data
                ? successCallback(response.data)
                : successCallback();
        };

        _sendRequest("POST", url, onSuccess, errorCallback, requestObject, header);
    }

    var createInstance = function (config) {
        ///<summary>Sets the configuration parameters for DynamicsWebApi helper.</summary>
        ///<param name="config" type="Object" optional="true">
        /// Retrieve multiple request options. If it's not passed then the current instance config copied.
        ///<para>   config.impersonate (String)
        ///             A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.</para>
        ///<para>   config.webApiVersion (String). 
        ///             The version of Web API to use, for example: "8.1"</para>
        ///<para>   config.webApiUrl (String).
        ///             A String representing a URL to Web API (webApiVersion not required if webApiUrl specified) [optional, if used inside of CRM]</para>
        ///</param>

        if (!config) {
            config = {
                impersonate: _impersonateUserId,
                webApiUrl: _webApiUrl,
                webApiVersion: _webApiVersion
            };
        }

        return new DynamicsWebApi(config);
    }

    return {
        create: createRecord,
        update: updateRecord,
        updateRequest: updateRequest,
        upsert: upsertRecord,
        upsertRequest: upsertRequest,
        deleteRecord: deleteRecord,
        deleteRequest: deleteRequest,
        executeFetchXml: executeFetchXml,
        count: countRecords,
        retrieve: retrieveRecord,
        retrieveRequest: retrieveRequest,
        retrieveMultiple: retrieveMultipleRecords,
        retrieveMultipleRequest: retrieveMultipleRecordsAdvanced,
        updateSingleProperty: updateSingleProperty,
        associate: associateRecords,
        disassociate: disassociateRecords,
        associateSingleValued: associateRecordsSingleValued,
        disassociateSingleValued: disassociateRecordsSingleValued,
        executeBoundFunction: executeBoundFunction,
        executeUnboundFunction: executeUnboundFunction,
        executeBoundAction: executeBoundAction,
        executeUnboundAction: executeUnboundAction,
        setConfig: setConfig,
        initializeInstance: createInstance,
        //**for tests only**
        __forTestsOnly__: {
            sendRequest: _sendRequest,
            getPagingCookie: getPagingCookie,
            convertOptions: convertOptions,
            convertRequestToLink: convertRequestToLink,
            convertToReferenceObject: _convertToReferenceObject,
            executeFunction: _executeFunction,
            executeAction: _executeAction,
            buildFunctionParameters: _buildFunctionParameters
        }
        //**for tests only end**
    }
};