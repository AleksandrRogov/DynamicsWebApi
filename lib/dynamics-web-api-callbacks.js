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
    };
};
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
    };
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
 * @property {boolean} mergeLabels - If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false'
 * @property {boolean} isBatch - If set to 'true', DynamicsWebApi treats a request as a part of a batch request. Call ExecuteBatch to execute all requests in a batch. Default value is 'false'.
 * @property {string} contentId - BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set.
 */

/**
 * Constructor.
 * @constructor
 * @param {DWAConfig} [config] - configuration object
 * @example
   *var dynamicsWebApi = new DynamicsWebApi();
  * @example
  * var dynamicsWebApi = new DynamicsWebApi({ webApiVersion: '9.0' });
  * @example
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

    var _isBatch = false;

    if (!config) {
        config = _internalConfig;
    }

    /**
     * Sets DynamicsWebApi configuration parameters.
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

    var _makeRequest = function (method, request, functionName, successCallback, errorCallback, responseParams) {
        request.isBatch = _isBatch;
        Request.makeRequest(method, request, functionName, _internalConfig, responseParams, successCallback, errorCallback);
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
        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.create", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.create", "errorCallback");
        }

        var onSuccess = function (response) {
            successCallback(response.data);
        };

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
        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, 'DynamicsWebApi.update', 'successCallback');
            ErrorHelper.callbackParameterCheck(errorCallback, 'DynamicsWebApi.update', 'errorCallback');
        }

        if (request.ifmatch == null) {
            request.ifmatch = '*'; //to prevent upsert
        }

        var onSuccess = function (response) {
            successCallback(response.data);
        };

        //copy locally
        var ifmatch = request.ifmatch;
        var onError = function (xhr) {
            if (ifmatch && xhr.status === 412) {
                //precondition failed - not deleted
                successCallback(false);
            }
            else {
                //rethrow error otherwise
                errorCallback(xhr);
            }
        };

        //Metadata definitions, cannot be updated using "PATCH" method
        var method = /EntityDefinitions|RelationshipDefinitions|GlobalOptionSetDefinitions/.test(request.collection)
            ? 'PUT' : 'PATCH';

        _makeRequest(method, request, 'update', onSuccess, onError, { valueIfEmpty: true });
    };

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
        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.update", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.update", "errorCallback");
        }

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
        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.updateSingleProperty", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.updateSingleProperty", "errorCallback");
        }

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
            successCallback(response.data)
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

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.delete", "request");
        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.delete", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.delete", "errorCallback");
        }

        var onSuccess = function (response) {
            successCallback(response.data);
        };

        //copy locally
        var ifmatch = request.ifmatch;
        var onError = function (xhr) {
            if (ifmatch && xhr.status === 412) {
                //precondition failed - not deleted
                successCallback(false);
            }
            else {
                //rethrow error otherwise
                errorCallback(xhr);
            }
        };

        _makeRequest('DELETE', request, 'delete', onSuccess, onError, { valueIfEmpty: true });
    };

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
        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.delete", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.delete", "errorCallback");
        }

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

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieve", "request");
        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.retrieve", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieve", "errorCallback");
        }

        var onSuccess = function (response) {
            successCallback(response.data);
        };

        var isRef = request.select != null && request.select.length === 1 && request.select[0].endsWith("/$ref");
        _makeRequest('GET', request, 'retrieve', onSuccess, errorCallback, { isRef: isRef });
    };

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
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.retrieve", "key");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.retrieve", "collection");
        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.retrieve", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieve", "errorCallback");
        }

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
        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.upsert", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.upsert", "errorCallback");
        }

        //copy locally
        var ifnonematch = request.ifnonematch;
        var ifmatch = request.ifmatch;
        var onSuccess = function (response) {
            successCallback(response.data);
        };

        var onError = function (xhr) {
            if (ifnonematch && xhr.status === 412) {
                //if prevent update
                successCallback();
            }
            else if (ifmatch && xhr.status === 404) {
                //if prevent create
                successCallback();
            }
            else {
                //rethrow error otherwise
                errorCallback(xhr);
            }
        };

        _makeRequest('PATCH', request, 'upsert', onSuccess, onError);
    };

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
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.upsert", "key");

        ErrorHelper.parameterCheck(object, "DynamicsWebApi.upsert", "object");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.upsert", "collection");

        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.upsert", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.upsert", "errorCallback");
        }

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
    };

    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     */
    this.count = function (collection, successCallback, errorCallback, filter) {
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.count", "collection");
        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.count", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.count", "errorCallback");
        }

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

        var onSuccess = function (response) {
            successCallback(response.data);
        };

        _makeRequest('GET', request, 'count', onSuccess, errorCallback, { toCount: request.count });
    };

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
        ErrorHelper.batchIncompatible('DynamicsWebApi.countAll', _isBatch);

        this.retrieveAllRequest({
            collection: collection,
            filter: filter,
            select: select
        }, function (response) {
            successCallback(response
                ? (response.value ? response.value.length : 0)
                : 0);
        }, errorCallback);
    };

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @param {string} [oDataLink] - Use this parameter to pass @odata.nextLink or @odata.deltaLink to return a necessary response. Pass null to retrieveMultipleOptions.
     */
    this.retrieveMultiple = function (collection, successCallback, errorCallback, select, filter, oDataLink) {

        this.retrieveMultipleRequest({
            collection: collection,
            select: select,
            filter: filter
        }, successCallback, errorCallback, oDataLink);
    };

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
        ErrorHelper.batchIncompatible('DynamicsWebApi.retrieveAll', _isBatch);

        _retrieveAllRequest({
            collection: collection,
            select: select,
            filter: filter
        }, successCallback, errorCallback);
    };

    var retrieveMultipleRequest = function (request, successCallback, errorCallback, oDataLink) {

        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.retrieveMultiple", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.retrieveMultiple", "errorCallback");
        }

        if (oDataLink) {
            ErrorHelper.stringParameterCheck(oDataLink, 'DynamicsWebApi.retrieveMultiple', 'oDataLink');
            request.url = oDataLink;
        }

        var onSuccess = function (response) {
            successCallback(response.data);
        };

        _makeRequest('GET', request, 'retrieveMultiple', onSuccess, errorCallback);
    };

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [oDataLink] - Use this parameter to pass @odata.nextLink or @odata.deltaLink to return a necessary response. Pass null to retrieveMultipleOptions.
     */
    this.retrieveMultipleRequest = retrieveMultipleRequest;

    var _retrieveAllRequest = function (request, successCallback, errorCallback, oDataLink, records) {

        records = records || [];

        var internalSuccessCallback = function (response) {
            records = records.concat(response.value);

            var pageLink = response.oDataNextLink;

            if (pageLink) {
                _retrieveAllRequest(request, successCallback, errorCallback, pageLink, records);
            }
            else {
                var result = { value: records };

                if (response.oDataDeltaLink) {
                    result["@odata.deltaLink"] = response.oDataDeltaLink;
                    result.oDataDeltaLink = response.oDataDeltaLink;
                }

                successCallback(result);
            }
        };

        retrieveMultipleRequest(request, internalSuccessCallback, errorCallback, oDataLink);
    };

    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.retrieveAllRequest = function (request, successCallback, errorCallback) {
        ErrorHelper.batchIncompatible('DynamicsWebApi.retrieveAllRequest', _isBatch);

        _retrieveAllRequest(request, successCallback, errorCallback);
    };

    var executeFetchXml = function (collection, fetchXml, successCallback, errorCallback, includeAnnotations, pageNumber, pagingCookie, impersonateUserId) {

        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.executeFetchXml", "collection");
        ErrorHelper.stringParameterCheck(fetchXml, "DynamicsWebApi.executeFetchXml", "fetchXml");

        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.executeFetchXml", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.executeFetchXml", "errorCallback");
        }

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

        var onSuccess = function (response) {
            successCallback(response.data);
        };

        _makeRequest('GET', request, 'executeFetchXml', onSuccess, errorCallback, { pageNumber: pageNumber });
    };

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
        records = records || [];

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
    };

    var innerExecuteFetchXmlAll = function (collection, fetchXml, successCallback, errorCallback, includeAnnotations, impersonateUserId) {
        ErrorHelper.batchIncompatible('DynamicsWebApi.executeFetchXmlAll', _isBatch);
        _executeFetchXmlAll(collection, fetchXml, successCallback, errorCallback, includeAnnotations, null, null, impersonateUserId);
    };

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

        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.associate", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.associate", "errorCallback");
        }

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
    };

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

        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.disassociate", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.disassociate", "errorCallback");
        }

        var onSuccess = function () {
            successCallback();
        };

        var request = {
            _additionalUrl: relationshipName + '(' + relatedKey + ')/$ref',
            collection: collection,
            key: primaryKey,
            impersonate: impersonateUserId
        };

        _makeRequest('DELETE', request, 'disassociate', onSuccess, errorCallback);
    };

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

        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.associateSingleValued", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.associateSingleValued", "errorCallback");
        }

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
    };

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

        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.disassociateSingleValued", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.disassociateSingleValued", "errorCallback");
        }

        var request = {
            _additionalUrl: singleValuedNavigationPropertyName + "/$ref",
            key: key,
            collection: collection,
            impersonate: impersonateUserId
        };

        var onSuccess = function () {
            successCallback();
        };

        _makeRequest('DELETE', request, 'disassociateSingleValued', onSuccess, errorCallback);
    };

    /**
     * Executes an unbound function (not bound to a particular entity record)
     *
     * @param {string} functionName - The name of the function.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.executeUnboundFunction = function (functionName, successCallback, errorCallback, parameters, impersonateUserId) {
        _executeFunction(functionName, parameters, null, null, successCallback, errorCallback, impersonateUserId, true);
    };

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
        _executeFunction(functionName, parameters, collection, id, successCallback, errorCallback, impersonateUserId);
    };

    var _executeFunction = function (functionName, parameters, collection, id, successCallback, errorCallback, impersonateUserId, isUnbound) {

        ErrorHelper.stringParameterCheck(functionName, "DynamicsWebApi.executeFunction", "functionName");

        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.executeFunction", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.executeFunction", "errorCallback");
        }

        var request = {
            _additionalUrl: functionName + Utility.buildFunctionParameters(parameters),
            _unboundRequest: isUnbound,
            key: id,
            collection: collection,
            impersonate: impersonateUserId
        };

        var onSuccess = function (response) {
            successCallback(response.data)
        };

        _makeRequest('GET', request, 'executeFunction', onSuccess, errorCallback);
    };

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
        _executeAction(actionName, requestObject, null, null, successCallback, errorCallback, impersonateUserId, true);
    };

    /**
     * Executes a bound Web API action (bound to a particular entity record)
     *
     * @param {string} [id] - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} [requestObject] - Action request body object.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    this.executeBoundAction = function (id, collection, actionName, requestObject, successCallback, errorCallback, impersonateUserId) {
        _executeAction(actionName, requestObject, collection, id, successCallback, errorCallback, impersonateUserId);
    };

    var _executeAction = function (actionName, requestObject, collection, id, successCallback, errorCallback, impersonateUserId, isUnbound) {

        ErrorHelper.stringParameterCheck(actionName, "DynamicsWebApi.executeAction", "actionName");

        if (!_isBatch) {
            ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.executeAction", "successCallback");
            ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.executeAction", "errorCallback");
        }

        var request = {
            _additionalUrl: actionName,
            _unboundRequest: isUnbound,
            collection: collection,
            key: id,
            impersonate: impersonateUserId,
            data: requestObject
        };

        var onSuccess = function (response) {
            successCallback(response.data)
        };

        _makeRequest('POST', request, 'executeAction', onSuccess, errorCallback);
    };

    /**
     * Sends an asynchronous request to create an entity definition.
     *
     * @param {string} entityDefinition - Entity Definition.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.createEntity = function (entityDefinition, successCallback, errorCallback) {

        ErrorHelper.parameterCheck(entityDefinition, 'DynamicsWebApi.createEntity', 'entityDefinition');

        var request = {
            collection: 'EntityDefinitions',
            entity: entityDefinition
        };
        this.createRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to update an entity definition.
     *
     * @param {string} entityDefinition - Entity Definition.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     */
    this.updateEntity = function (entityDefinition, successCallback, errorCallback, mergeLabels) {

        ErrorHelper.parameterCheck(entityDefinition, 'DynamicsWebApi.updateEntity', 'entityDefinition');
        ErrorHelper.guidParameterCheck(entityDefinition.MetadataId, 'DynamicsWebApi.updateEntity', 'entityDefinition.MetadataId');

        var request = {
            collection: 'EntityDefinitions',
            mergeLabels: mergeLabels,
            key: entityDefinition.MetadataId,
            entity: entityDefinition
        };
        this.updateRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to retrieve a specific entity definition.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     */
    this.retrieveEntity = function (entityKey, successCallback, errorCallback, select, expand) {

        ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.retrieveEntity', 'entityKey');

        var request = {
            collection: 'EntityDefinitions',
            key: entityKey,
            select: select,
            expand: expand
        };

        this.retrieveRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to retrieve entity definitions.
     *
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entity definitions will be returned.
     */
    this.retrieveEntities = function (successCallback, errorCallback, select, filter) {
        var request = {
            collection: 'EntityDefinitions',
            select: select,
            filter: filter
        };

        this.retrieveRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to create an attribute.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {Object} attributeDefinition - Object that describes the attribute.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.createAttribute = function (entityKey, attributeDefinition, successCallback, errorCallback) {
        ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.createAttribute', 'entityKey');
        ErrorHelper.parameterCheck(attributeDefinition, 'DynamicsWebApi.createAttribute', 'attributeDefinition');

        var request = {
            collection: 'EntityDefinitions',
            key: entityKey,
            entity: attributeDefinition,
            navigationProperty: 'Attributes'
        };

        this.createRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to update an attribute.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {Object} attributeDefinition - Object that describes the attribute.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [attributeType] - Use this parameter to cast the Attribute to a specific type.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     */
    this.updateAttribute = function (entityKey, attributeDefinition, successCallback, errorCallback, attributeType, mergeLabels) {
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

        this.updateRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to retrieve attribute metadata for a specified entity definition.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [attributeType] - Use this parameter to cast the Attributes to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which attribute definitions will be returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     */
    this.retrieveAttributes = function (entityKey, successCallback, errorCallback, attributeType, select, filter, expand) {

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

        this.retrieveRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to retrieve a specific attribute metadata for a specified entity definition.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {string} attributeKey - The Attribute Metadata id.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [attributeType] - Use this parameter to cast the Attribute to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     */
    this.retrieveAttribute = function (entityKey, attributeKey, successCallback, errorCallback, attributeType, select, expand) {

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

        this.retrieveRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to create a relationship definition.
     *
     * @param {string} relationshipDefinition - Relationship Definition.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.createRelationship = function (relationshipDefinition, successCallback, errorCallback) {

        ErrorHelper.parameterCheck(relationshipDefinition, 'DynamicsWebApi.createRelationship', 'relationshipDefinition');

        var request = {
            collection: 'RelationshipDefinitions',
            entity: relationshipDefinition
        };

        this.createRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to update a relationship definition.
     *
     * @param {string} relationshipDefinition - Relationship Definition.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [relationshipType] - Use this parameter to cast the Relationship to a specific type.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     */
    this.updateRelationship = function (relationshipDefinition, successCallback, errorCallback, relationshipType, mergeLabels) {

        ErrorHelper.parameterCheck(relationshipDefinition, 'DynamicsWebApi.updateRelationship', 'relationshipDefinition');
        ErrorHelper.guidParameterCheck(relationshipDefinition.MetadataId, 'DynamicsWebApi.updateRelationship', 'relationshipDefinition.MetadataId');

        var request = {
            collection: 'RelationshipDefinitions',
            mergeLabels: mergeLabels,
            key: relationshipDefinition.MetadataId,
            entity: relationshipDefinition,
            navigationProperty: relationshipType
        };

        this.updateRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to delete a relationship definition.
     *
     * @param {string} metadataId - A String representing the GUID value.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.deleteRelationship = function (metadataId, successCallback, errorCallback) {
        ErrorHelper.keyParameterCheck(metadataId, 'DynamicsWebApi.deleteRelationship', 'metadataId');

        var request = {
            collection: 'RelationshipDefinitions',
            key: metadataId
        };

        this.deleteRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to retrieve relationship definitions.
     *
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [relationshipType] - Use this parameter to cast a Relationship to a specific type: 1:M or M:M.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which relationships will be returned.
     */
    this.retrieveRelationships = function (successCallback, errorCallback, relationshipType, select, filter) {

        var request = {
            collection: 'RelationshipDefinitions',
            navigationProperty: relationshipType,
            select: select,
            filter: filter
        };

        this.retrieveMultipleRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to retrieve a specific relationship definition.
     *
     * @param {string} metadataId - String representing the Metadata Id GUID.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [relationshipType] - Use this parameter to cast a Relationship to a specific type: 1:M or M:M.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     */
    this.retrieveRelationship = function (metadataId, successCallback, errorCallback, relationshipType, select) {

        ErrorHelper.keyParameterCheck(metadataId, 'DynamicsWebApi.retrieveRelationship', 'metadataId');

        var request = {
            collection: 'RelationshipDefinitions',
            navigationProperty: relationshipType,
            key: metadataId,
            select: select
        };

        this.retrieveRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to create a Global Option Set definition
     *
     * @param {string} globalOptionSetDefinition - Global Option Set Definition.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.createGlobalOptionSet = function (globalOptionSetDefinition, successCallback, errorCallback) {

        ErrorHelper.parameterCheck(globalOptionSetDefinition, 'DynamicsWebApi.createGlobalOptionSet', 'globalOptionSetDefinition');

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            entity: globalOptionSetDefinition
        };

        this.createRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to update a Global Option Set.
     *
     * @param {string} globalOptionSetDefinition - Global Option Set Definition.
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     */
    this.updateGlobalOptionSet = function (globalOptionSetDefinition, successCallback, errorCallback, mergeLabels) {

        ErrorHelper.parameterCheck(globalOptionSetDefinition, 'DynamicsWebApi.updateGlobalOptionSet', 'globalOptionSetDefinition');
        ErrorHelper.guidParameterCheck(globalOptionSetDefinition.MetadataId, 'DynamicsWebApi.updateGlobalOptionSet', 'globalOptionSetDefinition.MetadataId');

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            mergeLabels: mergeLabels,
            key: globalOptionSetDefinition.MetadataId,
            entity: globalOptionSetDefinition
        };
        this.updateRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to delete a Global Option Set.
     *
     * @param {string} globalOptionSetKey - A String representing the GUID value or Alternate Key (such as Name).
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.deleteGlobalOptionSet = function (globalOptionSetKey, successCallback, errorCallback) {
        ErrorHelper.keyParameterCheck(globalOptionSetKey, 'DynamicsWebApi.deleteGlobalOptionSet', 'globalOptionSetKey');

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            key: globalOptionSetKey
        };

        this.deleteRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     * 
     * @param {string} globalOptionSetKey - The Global Option Set MetadataID or Alternate Key (such as Name).
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [castType] - Use this parameter to cast a Global Option Set to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned
     */
    this.retrieveGlobalOptionSet = function (globalOptionSetKey, successCallback, errorCallback, castType, select) {
        ErrorHelper.keyParameterCheck(globalOptionSetKey, 'DynamicsWebApi.retrieveGlobalOptionSet', 'globalOptionSetKey');

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            key: globalOptionSetKey,
            navigationProperty: castType,
            select: select
        };

        this.retrieveRequest(request, successCallback, errorCallback);
    };

    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     *
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     * @param {string} [castType] - Use this parameter to cast a Global Option Set to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned
     */
    this.retrieveGlobalOptionSets = function (successCallback, errorCallback, castType, select) {

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            navigationProperty: castType,
            select: select
        };

        this.retrieveMultipleRequest(request, successCallback, errorCallback);
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
     * @param {Function} successCallback - The function that will be passed through and be called by a successful response.
     * @param {Function} errorCallback - The function that will be passed through and be called by a failed response.
     */
    this.executeBatch = function (successCallback, errorCallback) {
        ErrorHelper.batchNotStarted(_isBatch);
        ErrorHelper.callbackParameterCheck(successCallback, "DynamicsWebApi.executeBatch", "successCallback");
        ErrorHelper.callbackParameterCheck(errorCallback, "DynamicsWebApi.executeBatch", "errorCallback");

        _isBatch = false;

        var onSuccess = function (response) {
            successCallback(response.data);
        };

        _makeRequest('POST', { collection: '$batch' }, 'executeBatch', onSuccess, errorCallback);
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