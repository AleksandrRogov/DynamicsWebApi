// =====================================================================
//  This file is part of the Microsoft Dynamics CRM SDK code samples.
//
//  Copyright (C) Microsoft Corporation.  All rights reserved.
//
//  This source code is intended only as a supplement to Microsoft
//  Development Tools and/or on-line documentation.  See these other
//  materials for detailed information regarding Microsoft code samples.
//
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//  PARTICULAR PURPOSE.
// =====================================================================
// <snippetJQueryRESTDataOperations.SDK.JQuery.js>
/// <reference path="jquery1.4.1vsdoc.js" />

if (typeof (SDK) == "undefined")
{ SDK = { __namespace: true }; }
SDK.JQuery = {
    _context: function () {
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
    },
    _getClientUrl: function () {
        ///<summary>
        /// Private function to return the server URL from the context
        ///</summary>
        ///<returns>String</returns>
        var serverUrl = this._context().getClientUrl()

        return serverUrl;
    },
    _ODataPath: function () {
        ///<summary>
        /// Private function to return the path to the REST endpoint.
        ///</summary>
        ///<returns>String</returns>
        return this._getClientUrl() + "/XRMServices/2011/OrganizationData.svc/";
    },
    _errorHandler: function (req) {
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
              JSON.parse(req.responseText).error.message.value);
    },
    _dateReviver: function (key, value) {
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
            a = /Date\(([-+]?\d+)\)/.exec(value);
            if (a) {
                return new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
            }
        }
        return value;
    },
    _parameterCheck: function (parameter, message) {
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
            throw new Error(message);
        }
    },
    _stringParameterCheck: function (parameter, message) {
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
            throw new Error(message);
        }
    },
    _callbackParameterCheck: function (callbackParameter, message) {
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
            throw new Error(message);
        }
    },
    createRecord: function (object, type, successCallback, errorCallback) {
        ///<summary>
        /// Sends an asynchronous request to create a new record.
        ///</summary>
        ///<param name="object" type="Object">
        /// A JavaScript object with properties corresponding to the Schema name of
        /// entity attributes that are valid for create operations.
        ///</param>
        this._parameterCheck(object, "SDK.JQuery.createRecord requires the object parameter.");
        ///<param name="type" type="String">
        /// The Schema Name of the Entity type record to create.
        /// For an Account record, use "Account"
        ///</param>
        this._stringParameterCheck(type, "SDK.JQuery.createRecord requires the type parameter is a string.");
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function can accept the returned record as a parameter.
        /// </param>
        this._callbackParameterCheck(successCallback, "SDK.JQuery.createRecord requires the successCallback is a function.");
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        this._callbackParameterCheck(errorCallback, "SDK.JQuery.createRecord requires the errorCallback is a function.");

        var jsonEntity = window.JSON.stringify(object);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: this._ODataPath() + type + "Set",
            data: jsonEntity,
            beforeSend: function (xhr) {
                //Specifying this header ensures that the results will be returned as JSON.             
                xhr.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, xhr) {
                successCallback(data.d);
            },
            error: function (xhr, textStatus, errorThrown) {
                errorCallback(SDK.JQuery._errorHandler(xhr));
            }
        });
    },
    retrieveRecord: function (id, type, select, expand, successCallback, errorCallback) {
        ///<summary>
        /// Sends an asynchronous request to retrieve a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        this._stringParameterCheck(id, "SDK.JQuery.retrieveRecord requires the id parameter is a string.");
        ///<param name="type" type="String">
        /// The Schema Name of the Entity type record to retrieve.
        /// For an Account record, use "Account"
        ///</param>
        this._stringParameterCheck(type, "SDK.JQuery.retrieveRecord requires the type parameter is a string.");
        ///<param name="select" type="String">
        /// A String representing the $select OData System Query Option to control which
        /// attributes will be returned. This is a comma separated list of Attribute names that are valid for retrieve.
        /// If null all properties for the record will be returned
        ///</param>
        if (select != null)
            this._stringParameterCheck(select, "SDK.JQuery.retrieveRecord requires the select parameter is a string.");
        ///<param name="expand" type="String">
        /// A String representing the $expand OData System Query Option value to control which
        /// related records are also returned. This is a comma separated list of of up to 6 entity relationship names
        /// If null no expanded related records will be returned.
        ///</param>
        if (expand != null)
            this._stringParameterCheck(expand, "SDK.JQuery.retrieveRecord requires the expand parameter is a string.");
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// This function must accept the returned record as a parameter.
        /// </param>
        this._callbackParameterCheck(successCallback, "SDK.JQuery.retrieveRecord requires the successCallback parameter is a function.");
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        this._callbackParameterCheck(errorCallback, "SDK.JQuery.retrieveRecord requires the errorCallback parameter is a function.");

        var systemQueryOptions = "";

        if (select != null || expand != null) {
            systemQueryOptions = "?";
            if (select != null) {
                var selectString = "$select=" + select;
                if (expand != null) {
                    selectString = selectString + "," + expand;
                }
                systemQueryOptions = systemQueryOptions + selectString;
            }
            if (expand != null) {
                systemQueryOptions = systemQueryOptions + "&$expand=" + expand;
            }
        }

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: this._ODataPath() + type + "Set" + "(guid'" + id + "')" + systemQueryOptions,
            beforeSend: function (xhr) {
                //Specifying this header ensures that the results will be returned as JSON.             
                xhr.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, xhr) {
                //JQuery does not provide an opportunity to specify a date reviver so this code
                // parses the xhr.responseText rather than use the data parameter passed by JQuery.
                successCallback(JSON.parse(xhr.responseText, SDK.JQuery._dateReviver).d);
            },
            error: function (xhr, textStatus, errorThrown) {
                errorCallback(SDK.JQuery._errorHandler(xhr));
            }
        });
    },
    updateRecord: function (id, object, type, successCallback, errorCallback) {
        ///<summary>
        /// Sends an asynchronous request to update a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        this._stringParameterCheck(id, "SDK.JQuery.updateRecord requires the id parameter.");
        ///<param name="object" type="Object">
        /// A JavaScript object with properties corresponding to the Schema Names for
        /// entity attributes that are valid for update operations.
        ///</param>
        this._parameterCheck(object, "SDK.JQuery.updateRecord requires the object parameter.");
        ///<param name="type" type="String">
        /// The Schema Name of the Entity type record to retrieve.
        /// For an Account record, use "Account"
        ///</param>
        this._stringParameterCheck(type, "SDK.JQuery.updateRecord requires the type parameter.");
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// Nothing will be returned to this function.
        /// </param>
        this._callbackParameterCheck(successCallback, "SDK.JQuery.updateRecord requires the successCallback is a function.");
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        this._callbackParameterCheck(errorCallback, "SDK.JQuery.updateRecord requires the errorCallback is a function.");

        var jsonEntity = window.JSON.stringify(object);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: jsonEntity,
            url: this._ODataPath() + type + "Set" + "(guid'" + id + "')",
            beforeSend: function (xhr) {
                //Specifying this header ensures that the results will be returned as JSON.             
                xhr.setRequestHeader("Accept", "application/json");
                //Specify the HTTP method MERGE to update just the changes you are submitting.             
                xhr.setRequestHeader("X-HTTP-Method", "MERGE");
            },
            success: function (data, textStatus, xhr) {
                //Nothing is returned to the success function
                successCallback();
            },
            error: function (xhr, textStatus, errorThrown) {
                errorCallback(SDK.JQuery._errorHandler(xhr));
            }
        });
    },
    deleteRecord: function (id, type, successCallback, errorCallback) {
        ///<summary>
        /// Sends an asynchronous request to delete a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to delete.
        ///</param>
        this._stringParameterCheck(id, "SDK.JQuery.deleteRecord requires the id parameter.");
        ///<param name="type" type="String">
        /// The Schema Name of the Entity type record to delete.
        /// For an Account record, use "Account"
        ///</param>
        this._stringParameterCheck(type, "SDK.JQuery.deleteRecord requires the type parameter.");
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response. 
        /// Nothing will be returned to this function.
        /// </param>
        this._callbackParameterCheck(successCallback, "SDK.JQuery.deleteRecord requires the successCallback is a function.");
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        this._callbackParameterCheck(errorCallback, "SDK.JQuery.deleteRecord requires the errorCallback is a function.");

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: this._ODataPath() + type + "Set(guid'" + id + "')",
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.                 
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                //Specify the HTTP method DELETE to perform a delete operation.                 
                XMLHttpRequest.setRequestHeader("X-HTTP-Method", "DELETE");
            },
            success: function (data, textStatus, xhr) {
                // Nothing is returned to the success function.
                successCallback();
            },
            error: function (xhr, textStatus, errorThrown) {
                errorCallback(SDK.JQuery._errorHandler(xhr));
            }
        });
    },
    retrieveMultipleRecords: function (type, options, successCallback, errorCallback, OnComplete) {
        ///<summary>
        /// Sends an asynchronous request to retrieve records.
        ///</summary>
        ///<param name="type" type="String">
        /// The Schema Name of the Entity type records to retrieve
        /// For an Account record, use "Account"
        ///</param>
        this._stringParameterCheck(type, "SDK.JQuery.retrieveMultipleRecords requires the type parameter is a string.");
        ///<param name="options" type="String">
        /// A String representing the OData System Query Options to control the data returned
        /// Do not include the $top option, use the top parameters to set the maximum number of records to return.
        ///</param>
        if (options != null)
            this._stringParameterCheck(options, "SDK.JQuery.retrieveMultipleRecords requires the options parameter is a string.");
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called for each page of records returned.
        /// This function should loop through the results and push the records into an array.
        /// </param>
        this._callbackParameterCheck(successCallback, "SDK.JQuery.retrieveMultipleRecords requires the successCallback parameter is a function.");
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response. 
        /// This function must accept an Error object as a parameter.
        /// </param>
        this._callbackParameterCheck(errorCallback, "SDK.JQuery.retrieveMultipleRecords requires the errorCallback parameter is a function.");
        ///<param name="OnComplete" type="Function">
        /// The function that will be called when all the requested records have been returned.
        /// No parameters are passed to this function.
        /// </param>
        this._callbackParameterCheck(OnComplete, "SDK.JQuery.retrieveMultipleRecords requires the OnComplete parameter is a function.");

        var optionsString;
        if (options != null) {
            if (options.charAt(0) != "?") {
                optionsString = "?" + options;
            }
            else { optionsString = options; }
        }

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: this._ODataPath() + type + "Set" + optionsString,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.             
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, xhr) {
                if (data && data.d && data.d.results) {
                    successCallback(JSON.parse(xhr.responseText, SDK.JQuery._dateReviver).d.results);
                    if (data.d.__next != null) {
                        var queryOptions = data.d.__next.substring((SDK.JQuery._ODataPath() + type + "Set").length);
                        SDK.JQuery.retrieveMultipleRecords(type, queryOptions, successCallback, errorCallback, OnComplete);
                    }
                    else { OnComplete(); }
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                errorCallback(SDK.JQuery._errorHandler(xhr));
            }
        });
    },
    __namespace: true
};
// </snippetJQueryRESTDataOperations.SDK.JQuery.js>