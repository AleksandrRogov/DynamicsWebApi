var DWA = require("./dwa");
var Utility = require('./utilities/Utility');
var RequestConverter = require('./utilities/RequestConverter');
var ErrorHelper = require('./helpers/ErrorHelper');
var Request = require('./requests/sendRequest');

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
        userQuery: "",
        async: true
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