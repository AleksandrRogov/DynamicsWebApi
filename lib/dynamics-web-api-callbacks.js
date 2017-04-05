var DWA = require("./dwa");
var Utility = require('./utilities/Utility');
var RequestConverter = require('./utilities/RequestConverter');
var ErrorHelper = require('./helpers/ErrorHelper');

//string es6 polyfill
if (!String.prototype.endsWith || !String.prototype.startsWith) {
    require("./polyfills/string-es6");
}

/* develblock:start */
var dwaExpandRequest = function() {
    return {
        select: [],
        filter: "",
        top: 0,
        orderBy: [],
        property: ""
    }
}

var dwaRequest = function() {
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
/* develblock:end */

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
            else { throw new Error("Xrm Context is not available."); }
        }
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

    /**
     * Sends a request to given URL with given parameters
     *
     * @param {string} method - Method of the request.
     * @param {string} uri - Request URI.
     * @param {Function} successCallback - A callback called on success of the request.
     * @param {Function} errorCallback - A callback called when a request failed.
     * @param {Object} [data] - Data to send in the request.
     * @param {Object} [additionalHeaders] - Object with additional headers. IMPORTANT! This object does not contain default headers needed for every request.
     * @returns {Promise}
     */
    var _sendRequest = function(method, uri, data, additionalHeaders, successCallback, errorCallback) {
        if (_impersonateUserId && (!additionalHeaders || (additionalHeaders && !additionalHeaders["MSCRMCallerID"]))) {
            if (!additionalHeaders) {
                additionalHeaders = {};
            }
            additionalHeaders['MSCRMCallerID'] = _impersonateUserId;
        }

        var stringifiedData;
        if (data) {
            stringifiedData = JSON.stringify(data, _propertyReplacer);
        }

        var executeRequest;
        if (typeof XMLHttpRequest !== 'undefined') {
            executeRequest = require('./requests/xhr');
        }
        /* develblock:start */
        else if (typeof process !== 'undefined') {
            executeRequest = require('./requests/http');
        }
        /* develblock:end */
        executeRequest(method, _webApiUrl + uri, stringifiedData, additionalHeaders, successCallback, errorCallback);
    }
    
    /**
     * Sets the configuration parameters for DynamicsWebApi helper.
     *
     * @param {DWAConfig} config - configuration object
     */
    this.setConfig = function (config) {
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
        this.setConfig(config);

    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {Object} object - A JavaScript object valid for create operations.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [prefer] - (optional) If set to "return=representation" the function will return a newly created object
     */
    this.create = function (object, collection, successCallback, errorCallback, prefer) {

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
                var entityUrl = response.headers['OData-EntityId']
                    ? response.headers['OData-EntityId']
                    : response.headers['odata-entityid'];
                var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                successCallback(id);
            }
        }

        _sendRequest("POST", collection.toLowerCase(), object, headers, onSuccess, errorCallback);
    };

    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.updateRequest = function (request, successCallback, errorCallback) {

        _parameterCheck(request, "DynamicsWebApi.update", "request");
        _parameterCheck(request.entity, "DynamicsWebApi.update", "request.entity");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.update", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.update", "errorCallback");

        var result = RequestConverter.convertRequest(request, "update");

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
     * @param {string} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     */
    this.update = function (id, collection, object, successCallback, errorCallback, prefer, select) {

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

        _sendRequest("PATCH", collection.toLowerCase() + "(" + id + ")" + systemQueryOptions, object, headers, onSuccess, errorCallback);
    };

    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param {string} id - A String representing the GUID value for the record to update.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Object} keyValuePair - keyValuePair object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"}
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [prefer] - If set to "return=representation" the function will return an updated object
     */
    this.updateSingleProperty = function (id, collection, keyValuePair, successCallback, errorCallback, prefer) {

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

        _sendRequest("PUT", collection.toLowerCase() + "(" + id + ")/" + key, { value: keyValue }, headers, onSuccess, errorCallback);
    };

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.deleteRequest = function (request, successCallback, errorCallback) {

        _parameterCheck(request, "DynamicsWebApi.delete", "request")
        _callbackParameterCheck(successCallback, "DynamicsWebApi.delete", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.delete", "errorCallback");

        var result = RequestConverter.convertRequest(request, "delete");

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

        _parameterCheck(request, "DynamicsWebApi.retrieve", "request")
        _callbackParameterCheck(successCallback, "DynamicsWebApi.retrieve", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieve", "errorCallback");

        var result = RequestConverter.convertRequest(request, "retrieve");

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
     * @param {string} [expand] - A String representing the $expand Query Option value to control which related records need to be returned.
     */
    this.retrieve = function (id, collection, successCallback, errorCallback, select, expand) {

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
                successCallback(Utility.convertToReferenceObject(response.data));
            }
            else {
                successCallback(response.data);
            }
        };

        _sendRequest("GET", url, null, null, onSuccess, errorCallback);
    };

    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.upsertRequest = function (request, successCallback, errorCallback) {

        _parameterCheck(request, "DynamicsWebApi.upsert", "request");
        _parameterCheck(request.entity, "DynamicsWebApi.upsert", "request.entity");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.upsert", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.upsert", "errorCallback");

        var result = RequestConverter.convertRequest(request, "upsert");

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
     * @param {string} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     */
    this.upsert = function (id, collection, object, successCallback, errorCallback, prefer, select) {

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

        _sendRequest("PATCH", collection.toLowerCase() + "(" + id + ")" + systemQueryOptions, object, headers, onSuccess, errorCallback);
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
            _stringParameterCheck(collection, "DynamicsWebApi.count", "collection");
            _callbackParameterCheck(successCallback, "DynamicsWebApi.count", "successCallback");
            _callbackParameterCheck(errorCallback, "DynamicsWebApi.count", "errorCallback");

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
     * Sends an asynchronous request to retrieve records.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     */
    this.retrieveMultipleRequest = function (request, successCallback, errorCallback, nextPageLink) {

        _callbackParameterCheck(successCallback, "DynamicsWebApi.retrieveMultiple", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieveMultiple", "errorCallback");

        if (nextPageLink && !request.collection) {
            request.collection = "any";
        }

        var result = RequestConverter.convertRequest(request, "retrieveMultiple");

        if (nextPageLink) {
            _stringParameterCheck(nextPageLink, "DynamicsWebApi.retrieveMultiple", "nextPageLink");
            result.url = nextPageLink.replace(_webApiUrl, "");
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
    this.executeFetchXml = function (collection, fetchXml, successCallback, errorCallback, includeAnnotations, pageNumber, pagingCookie, impersonateUserId) {

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
                response.data.PagingInfo = Utility.getFetchXmlPagingCookie(response.data['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'], pageNumber);
            }

            if (response.data['@odata.context'] != null) {
                response.data.oDataContext = response.data['@odata.context'];
            }

            successCallback(response.data);
        };

        _sendRequest("GET", collection.toLowerCase() + "?fetchXml=" + encodedFetchXml, null, headers, onSuccess, errorCallback);
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

        _stringParameterCheck(functionName, "DynamicsWebApi.executeFunction", "functionName");
        _callbackParameterCheck(successCallback, "DynamicsWebApi.executeFunction", "successCallback");
        _callbackParameterCheck(errorCallback, "DynamicsWebApi.executeFunction", "errorCallback");
        var url = functionName + Utility.buildFunctionParameters(parameters);

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
            config = {
                impersonate: _impersonateUserId,
                webApiUrl: _webApiUrl,
                webApiVersion: _webApiVersion
            };
        }

        return new DynamicsWebApi(config);
    }
};

module.exports = DynamicsWebApi;