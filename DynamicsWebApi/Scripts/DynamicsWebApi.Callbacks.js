/// <reference path="..\Pages/TestPage.html" />
/// <reference path="jQuery.js" />
/*
 DynamicsWebApi.jQuery v0.9.0 (for Dynamics 365 (online), Dynamics 365 (on-premises), Dynamics CRM 2016, Dynamics CRM Online)
 
 Project references the following javascript libraries:
  > jQuery (jQuery.js) - https://github.com/jquery/jquery

 Copyright (c) 2017. 
 Author: Aleksandr Rogov (https://github.com/AleksandrRogov)
 MIT License

*/

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
            /// <field name='fetchXmlPagingCookie' type='Object'>Paging Cookie object</field>  
            DWA.Types.ResponseBase.call(this);

            this.value = [];
            this.fetchXmlPagingCookie = {
                pageCookies: "",
                pageNumber: 0
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
            FormattedValue: 'OData.Community.Display.V1.FormattedValue'
        }
    }
}

var _sendRequestDefault = function (method, url, successCallback, errorCallback, data, additionalHeaders) {
    /// <summary>Sends a request to given URL with given parameters</summary>
    /// <param name="method" type="String">Method of the request</param>
    /// <param name="url" type="String">The request URL</param>
    /// <param name="successCallback" type="Function">A callback called on success of the request</param>
    /// <param name="errorCallback" type="Function">A callback called when a request failed</param>
    /// <param name="data" type="Object" optional="true">Data to send in the request</param>
    /// <param name="additionalHeaders" type="Object" optional="true">Object with additional headers.<para>IMPORTANT! This object does not contain default headers needed for every request.</para></param>

    var request = {
        type: method,
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: url,
        beforeSend: function (xhr) {

            //Specifying this header ensures that the results will be returned as JSON.             
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("OData-Version", "4.0");
            xhr.setRequestHeader("OData-MaxVersion", "4.0");

            //set additional headers
            if (additionalHeaders != null) {
                var headerKeys = Object.keys(additionalHeaders);

                for (var i = 0; i < headerKeys.length; i++) {
                    xhr.setRequestHeader(headerKeys[i], additionalHeaders[headerKeys[i]]);
                }
            }
        },
        success: function (data, testStatus, xhr) {
            successCallback(xhr);
        },
        error: errorCallback
    };

    if (data != null) {
        request.data = data;
    }

    $.ajax(request);
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
        if ((typeof parameter === "undefined") || parameter === null) {
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

    var _sendRequest = function (method, url, successCallback, errorCallback, object, additionalHeaders) {
        /// <summary>Sends a request to given URL with given parameters</summary>
        /// <param name="method" type="String">Method of the request</param>
        /// <param name="url" type="String">The request URL</param>
        /// <param name="successCallback" type="Function">A callback called on success of the request</param>
        /// <param name="errorCallback" type="Function">A callback called when a request failed</param>
        /// <param name="object" type="Object" optional="true">Data to send in the request</param>
        /// <param name="additionalHeaders" type="Object" optional="true">Object with additional headers.<para>IMPORTANT! This object does not contain default headers needed for every request.</para></param>

        var data = null;
        if (object != null) {
            data = JSON.stringify(object, _propertyReplacer);
        }
        _sendRequestDefault(method, _webApiUrl + url, successCallback, errorCallback, data, additionalHeaders);
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
            navigationProperty: ""
        }
    };

    var setConfig = function (config) {
        ///<summary>Sets the configuration parameters for DynamicsWebApi helper.</summary>
        ///<param name="config" type="Object">
        /// DynamicsWebApi Configuration object
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

        if (config.sendRequest != null) {
            _sendRequest = config.sendRequest;
        }
    }

    if (config != null)
        setConfig(config);

    var _convertToReferenceObject = function (url) {
        var result = /\/(\w+)\(([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})/i.exec(url);
        return { id: result[2], collection: result[1] };
    }

    var convertOptions = function (options, functionName, url, joinSymbol) {
        /// <param name="options" type="dwaRequest">Options</param>

        joinSymbol = joinSymbol != null ? joinSymbol : "&";

        var optionsArray = [];

        if (options.navigationProperty != null) {
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

        if (options.filter != null && options.filter.length) {
            _stringParameterCheck(options.filter, "DynamicsWebApi." + functionName, "request.filter");
            optionsArray.push("$filter=" + options.filter);
        }

        var headers = {};

        if (options.maxPageSize != null) {
            _numberParameterCheck(options.maxPageSize, "DynamicsWebApi." + functionName, "request.maxPageSize");
            headers['Prefer'] = 'odata.maxpagesize=' + options.maxPageSize;
        }

        if (options.count != null) {
            _boolParameterCheck(options.count, "DynamicsWebApi." + functionName, "request.count");
            optionsArray.push("$count=" + options.count);
        }

        if (options.top != null) {
            _intParameterCheck(options.top, "DynamicsWebApi." + functionName, "request.top");
            optionsArray.push("$top=" + options.top);
        }

        if (options.orderBy != null && options.orderBy.length) {
            _arrayParameterCheck(options.orderBy, "DynamicsWebApi." + functionName, "request.orderBy");
            optionsArray.push("$orderBy=" + options.orderBy.join(','));
        }

        if (options.returnRepresentation != null) {
            _boolParameterCheck(options.returnRepresentation, "DynamicsWebApi." + functionName, "request.returnRepresentation");
            headers['Prefer'] = DWA.Prefer.ReturnRepresentation;
        }

        if (options.includeAnnotations != null) {
            _stringParameterCheck(options.includeAnnotations, "DynamicsWebApi." + functionName, "request.includeAnnotations");
            headers['Prefer'] = 'odata.include-annotations="' + options.includeAnnotations + '"';
        }

        if (options.ifmatch != null && options.ifnonematch != null) {
            throw Error("DynamicsWebApi." + functionName + ". Either one of request.ifmatch or request.ifnonematch parameters shoud be used in a call, not both.")
        }

        if (options.ifmatch != null) {
            _stringParameterCheck(options.ifmatch, "DynamicsWebApi." + functionName, "request.ifmatch");
            headers['If-Match'] = options.ifmatch;
        }

        if (options.ifnonematch != null) {
            _stringParameterCheck(options.ifnonematch, "DynamicsWebApi." + functionName, "request.ifnonematch");
            headers['If-None-Match'] = options.ifnonematch;
        }

        if (options.impersonate != null) {
            _stringParameterCheck(options.impersonate, "DynamicsWebApi." + functionName, "request.impersonate");
            headers['MSCRMCallerID'] = _guidParameterCheck(options.impersonate, "DynamicsWebApi." + functionName, "request.impersonate");
        }

        if (options.expand != null && options.expand.length) {
            _arrayParameterCheck(options.expand, "DynamicsWebApi." + functionName, "request.expand");
            var expandOptionsArray = [];
            for (var i = 0; i < options.expand.length; i++) {
                var expandOptions = convertOptions(options.expand[i], functionName + " $expand", null, ";").query;
                if (expandOptions.length) {
                    expandOptions = "(" + expandOptions + ")";
                }
                expandOptionsArray.push(options.expand[i].property + expandOptions);
            }
            optionsArray.push("$expand=" + encodeURI(expandOptionsArray.join(",")));
        }

        return { url: url, query: optionsArray.join(joinSymbol), headers: headers }
    }

    var convertRequestToLink = function (options, functionName) {
        /// <summary>Builds the Web Api query string based on a passed options object parameter.</summary>
        /// <param name="options" type="dwaRequest">Options</param>
        /// <returns type="String" />

        if (options.collection == null)
            _parameterCheck(options.collection, "DynamicsWebApi." + functionName, "request.collection");
        else
            _stringParameterCheck(options.collection, "DynamicsWebApi." + functionName, "request.collection");

        var url = options.collection.toLowerCase();

        if (options.id != null) {
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

        var onSuccess = function (xhr) {
            if (xhr.responseText) {
                successCallback(JSON.parse(xhr.responseText, _dateReviver));
            }
            else {
                var entityUrl = xhr.getResponseHeader('odata-entityid');
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

        var onSuccess = function (xhr) {
            xhr.responseText
                ? successCallback(JSON.parse(xhr.responseText, _dateReviver))
                : successCallback();
        };

        _sendRequest("PATCH", result.url, onSuccess, errorCallback, request.entity, result.headers);
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
                systemQueryOptions = "?" + select.join(",");
            }
        }

        var onSuccess = function (xhr) {
            xhr.responseText
                ? successCallback(JSON.parse(xhr.responseText, _dateReviver))
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

        var onSuccess = function (xhr) {
            if (xhr.responseText) {
                successCallback(JSON.parse(xhr.responseText, _dateReviver));
            }
            else {
                successCallback();
            }
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

        var onError = function (xhr) {
            if (request.ifmatch != null && xhr.status == 412) {
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

        var onSuccess = function (xhr) {
            var response = JSON.parse(xhr.responseText, _dateReviver);

            if (request.select != null && request.select.length == 1 && request.select[0].endsWith("/$ref") && response["@odata.id"] != null) {
                successCallback(_convertToReferenceObject(response["@odata.id"]));
            }
            else {
                successCallback(response);
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
        if (select != null)
            _arrayParameterCheck(select, "DynamicsWebApi.retrieve", "select");

        _callbackParameterCheck(successCallback, "DynamicsWebApi.retrieve", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieve", "errorCallback");

        var url = collection.toLowerCase() + "(" + id + ")";

        var queryOptions = [];

        if (select.length) {
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

        var onSuccess = function (xhr) {
            var response = JSON.parse(xhr.responseText, _dateReviver);

            if (select != null && select.length == 1 && select[0].endsWith("/$ref") && response["@odata.id"] != null) {
                successCallback(_convertToReferenceObject(response["@odata.id"]));
            }
            else {
                successCallback(response);
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

        var onSuccess = function (xhr) {
            if (xhr.status == 204) {
                var entityUrl = xhr.getResponseHeader('odata-entityid');
                var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                successCallback(id);
            }
            else if (xhr.responseText) {
                successCallback(JSON.parse(xhr.responseText, _dateReviver));
            }
            else
                successCallback();
        };

        var onError = function (xhr) {
            if (request.ifnonematch != null && xhr.status == 412) {
                //if prevent update
                successCallback();
            }
            else if (request.ifmatch != null && xhr.status == 404) {
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
                systemQueryOptions = "?" + select.join(",");
            }
        }

        var onSuccess = function (xhr) {
            if (xhr.status == 204) {
                var entityUrl = xhr.getResponseHeader('odata-entityid');
                var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                successCallback(id);
            }
            else if (xhr.responseText) {
                successCallback(JSON.parse(xhr.responseText, _dateReviver));
            }
            else
                successCallback();
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

            var onSuccess = function (xhr) {
                var response = JSON.parse(xhr.responseText);

                successCallback(response ? parseInt(response) : 0);
            };

            _sendRequest("GET", collection.toLowerCase() + "/$count", onSuccess, errorCallback)
        }
        else {
            return retrieveMultipleRecordsAdvanced({
                collection: collection,
                filter: filter,
                count: true
            }, null, function (response) {
                successCallback(response.oDataCount ? response.oDataCount : 0);
            }, errorCallback);
        }
    }

    var retrieveMultipleRecords = function (collection, select, filter, nextPageLink, successCallback, errorCallback) {
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
        }, nextPageLink, successCallback, errorCallback);
    }

    var retrieveMultipleRecordsAdvanced = function (request, nextPageLink, successCallback, errorCallback) {
        ///<summary>
        /// Sends an asynchronous request to retrieve records.
        ///</summary>
        ///<param name="request" type="Object">
        /// Retrieve multiple request options
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

        var result = convertRequestToLink(request, "retrieveMultiple");

        if (nextPageLink != null) {
            _stringParameterCheck(nextPageLink, "DynamicsWebApi.retrieveMultiple", "nextPageLink");
            result.url = nextPageLink;
        }

        var onSuccess = function (xhr) {

            var response = JSON.parse(xhr.responseText, _dateReviver);
            if (response['@odata.nextLink'] != null) {
                response.oDataNextLink = response['@odata.nextLink'];
            }
            if (response['@odata.count'] != null) {
                response.oDataCount = response['@odata.count'];
            }
            if (response['@odata.context'] != null) {
                response.oDataContext = response['@odata.context'];
            }

            successCallback(response);
        };

        _sendRequest("GET", result.url, onSuccess, errorCallback, null, result.headers);
    }

    var getPagingCookie = function (pageCookies) {
        var pagingInfo = {};
        var pageNumber = null;

        try {
            //get the page cokies
            pageCookies = unescape(unescape(pageCookies));

            //get the pageNumber
            pageNumber = parseInt(pageCookies.substring(pageCookies.indexOf("=") + 1, pageCookies.indexOf("pagingcookie")).replace(/\"/g, '').trim());

            // this line is used to get the cookie part
            pageCookies = pageCookies.substring(pageCookies.indexOf("pagingcookie"), (pageCookies.indexOf("/>") + 12));
            pageCookies = pageCookies.substring(pageCookies.indexOf("=") + 1, pageCookies.length);
            pageCookies = pageCookies.substring(1, pageCookies.length - 1);

            //replace special character 
            pageCookies = pageCookies.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '\'').replace(/\'/g, '&' + 'quot;');

            //append paging-cookie
            pageCookies = "paging-cookie ='" + pageCookies + "'";

            //set the parameter
            pagingInfo.pageCookies = pageCookies;
            pagingInfo.pageNumber = pageNumber;

        } catch (e) {
            throw new Error(e);
        }

        return pagingInfo;
    }

    var fetchXmlRequest = function (collection, fetchXml, successCallback, errorCallback, includeAnnotations) {
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

        _stringParameterCheck(collection, "DynamicsWebApi.executeFetchXml", "collection");
        _stringParameterCheck(fetchXml, "DynamicsWebApi.executeFetchXml", "fetchXml");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.executeFetchXml", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.executeFetchXml", "errorCallback");

        var headers = null;
        if (includeAnnotations != null) {
            _stringParameterCheck(includeAnnotations, "DynamicsWebApi.executeFetchXml", "includeAnnotations");
            headers = { 'Prefer': 'odata.include-annotations="' + includeAnnotations + '"' };
        }

        var encodedFetchXml = encodeURI(fetchXml);

        var onSuccess = function (xhr) {
            var response = JSON.parse(xhr.responseText, _dateReviver);

            if (response['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'] != null) {
                response.value.fetchXmlPagingCookie = getPagingCookie(response['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie']);
            }

            if (response['@odata.context'] != null) {
                response.oDataContext = response['@odata.context'];
            }

            successCallback(response);
        };

        _sendRequest("GET", collection.toLowerCase() + "?fetchXml=" + encodedFetchXml, onSuccess, errorCallback, null, headers);
    }

    var associateRecords = function (primarycollection, primaryId, relationshipName, relatedcollection, relatedId, successCallback, errorCallback) {
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
        _stringParameterCheck(primarycollection, "DynamicsWebApi.associate", "primarycollection");
        _stringParameterCheck(relatedcollection, "DynamicsWebApi.associate", "relatedcollection");
        _stringParameterCheck(relationshipName, "DynamicsWebApi.associate", "relationshipName");
        primaryId = _guidParameterCheck(primaryId, "DynamicsWebApi.associate", "primaryId");
        relatedId = _guidParameterCheck(relatedId, "DynamicsWebApi.associate", "relatedId");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.associate", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.associate", "errorCallback");

        var onSuccess = function (xhr) {
            successCallback();
        };

        var object = { "@odata.id": _webApiUrl + relatedcollection + "(" + relatedId + ")" };

        _sendRequest("POST",
            primarycollection + "(" + primaryId + ")/" + relationshipName + "/$ref",
            onSuccess, errorCallback, object);
    }

    var disassociateRecords = function (primarycollection, primaryId, relationshipName, relatedId, successCallback, errorCallback) {
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

        _stringParameterCheck(primarycollection, "DynamicsWebApi.disassociate", "primarycollection");
        _stringParameterCheck(relationshipName, "DynamicsWebApi.disassociate", "relationshipName");
        primaryId = _guidParameterCheck(primaryId, "DynamicsWebApi.disassociate", "primaryId");
        relatedId = _guidParameterCheck(relatedId, "DynamicsWebApi.disassociate", "relatedId");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.disassociate", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.disassociate", "errorCallback");

        var onSuccess = function (xhr) {
            successCallback();
        };

        _sendRequest("DELETE", primarycollection + "(" + primaryId + ")/" + relationshipName + "(" + relatedId + ")/$ref", onSuccess, errorCallback);
    }

    var associateRecordsSingleValued = function (collection, id, singleValuedNavigationPropertyName, relatedcollection, relatedId, successCallback, errorCallback) {
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

        _stringParameterCheck(collection, "DynamicsWebApi.associateSingleValued", "collection");
        id = _guidParameterCheck(id, "DynamicsWebApi.associateSingleValued", "id");
        relatedId = _guidParameterCheck(relatedId, "DynamicsWebApi.associateSingleValued", "relatedId");
        _stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.associateSingleValued", "singleValuedNavigationPropertyName");
        _stringParameterCheck(relatedcollection, "DynamicsWebApi.associateSingleValued", "relatedcollection");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.associateSingleValued", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.associateSingleValued", "errorCallback");

        var onSuccess = function (xhr) {
            successCallback();
        };

        var object = { "@odata.id": _webApiUrl + relatedcollection + "(" + relatedId + ")" };

        _sendRequest("PUT",
            collection + "(" + id + ")/" + singleValuedNavigationPropertyName + "/$ref",
            onSuccess, errorCallback, object);
    }

    var disassociateRecordsSingleValued = function (collection, id, singleValuedNavigationPropertyName, successCallback, errorCallback) {
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

        _stringParameterCheck(collection, "DynamicsWebApi.disassociateSingleValued", "collection");
        id = _guidParameterCheck(id, "DynamicsWebApi.disassociateSingleValued", "id");
        _stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.disassociateSingleValued", "singleValuedNavigationPropertyName");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.disassociateSingleValued", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.disassociateSingleValued", "errorCallback");

        var onSuccess = function (xhr) {
            successCallback();
        };

        _sendRequest("DELETE", collection + "(" + id + ")/" + singleValuedNavigationPropertyName + "/$ref", onSuccess, errorCallback);
    }

    var executeUnboundFunction = function (functionName, successCallback, errorCallback, parameters) {
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
        return _executeFunction(functionName, parameters, null, null, successCallback, errorCallback);
    }

    var executeBoundFunction = function (id, collection, functionName, successCallback, errorCallback, parameters) {
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
        return _executeFunction(functionName, parameters, collection, id, successCallback, errorCallback);
    }

    var _executeFunction = function (functionName, parameters, collection, id, successCallback, errorCallback) {
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

        _stringParameterCheck(functionName, "DynamicsWebApi.executeFunction", "functionName");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.executeFunction", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.executeFunction", "errorCallback");
        var url = functionName;

        if (parameters != null) {
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

            url += "(" + functionParameters + ")?" + urlQuery;
        }
        else {
            url += "()";
        }

        if (collection != null) {
            _stringParameterCheck(collection, "DynamicsWebApi.executeFunction", "collection");
            id = _guidParameterCheck(id, "DynamicsWebApi.executeFunction", "id");

            url = collection + "(" + id + ")/" + url;
        }

        var onSuccess = function (xhr) {
            if (xhr.responseText) {
                successCallback(JSON.parse(xhr.responseText, _dateReviver));
            }
            else {
                successCallback();
            }
        };

        _sendRequest("GET", url, onSuccess, errorCallback);
    }

    var executeUnboundAction = function (actionName, requestObject, successCallback, errorCallback) {
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
        return _executeAction(actionName, requestObject, null, null, successCallback, errorCallback);
    }

    var executeBoundAction = function (id, collection, actionName, requestObject, successCallback, errorCallback) {
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
        return _executeAction(actionName, requestObject, collection, id, successCallback, errorCallback);
    }

    var _executeAction = function (actionName, requestObject, collection, id, successCallback, errorCallback) {
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

        _stringParameterCheck(actionName, "DynamicsWebApi.executeAction", "actionName");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.executeAction", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.executeAction", "errorCallback");
        var url = actionName;

        if (collection != null) {
            _stringParameterCheck(collection, "DynamicsWebApi.executeAction", "collection");
            id = _guidParameterCheck(id, "DynamicsWebApi.executeAction", "id");

            url = collection + "(" + id + ")/" + url;
        }

        var onSuccess = function (xhr) {
            if (xhr.responseText) {
                successCallback(JSON.parse(xhr.responseText, _dateReviver));
            }
            else {
                successCallback();
            }
        };

        _sendRequest("POST", url, onSuccess, errorCallback, requestObject);
    }

    var createInstance = function (config) {
        ///<summary>Creates another instance of DynamicsWebApi helper.</summary>
        ///<param name="config" type="Object">
        /// DynamicsWebApi Configuration object
        ///<para>   config.webApiVersion (String).
        ///             The version of Web API to use, for example: "8.1"</para>
        ///<para>   config.webApiUrl (String).
        ///             A String representing a URL to Web API (webApiVersion not required if webApiUrl specified) [optional, if used inside of CRM]</para>
        ///<para>   config.sendRequest (Function).
        ///             A function that sends a request to Web API</para>
        ///</param>
        /// <returns type="DynamicsWebApi" />

        if (config == null)
            config = {};

        if (config.sendRequest == null) {
            config.sendRequest = _sendRequest;
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
        executeFetchXml: fetchXmlRequest,
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
        initializeInstance: createInstance
    }
};

var dynamicsWebApi = new DynamicsWebApi();