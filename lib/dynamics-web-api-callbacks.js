var DWA = require("./dwa");
var Utility = require('./utilities/Utility');
var RequestConverter = require('./utilities/RequestConverter');
var ErrorHelper = require('./helpers/ErrorHelper');
var sendRequest = require('./requests/sendRequest');

//string es6 polyfill
if (!String.prototype.endsWith || !String.prototype.startsWith) {
    require("./polyfills/string-es6");
}

/* develblock:start */
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
/* develblock:end */

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