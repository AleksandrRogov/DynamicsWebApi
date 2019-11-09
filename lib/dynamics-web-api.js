"use strict";

var DWA = require("./dwa");
var Utility = require('./utilities/Utility');
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
        collection: "",
        id: "",
        key: "",
        duplicateDetection: true,
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
        mergeLabels: false
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
 * @property {boolean} mergeLabels - If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false'.
 * @property {boolean} isBatch - If set to 'true', DynamicsWebApi treats a request as a part of a batch request. Call ExecuteBatch to execute all requests in a batch. Default value is 'false'.
 * @property {string} contentId - BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set.
 * @property {boolean} trackChanges - Preference header 'odata.track-changes' is used to request that a delta link be returned which can subsequently be used to retrieve entity changes.
 * @property {string} deltaLink - Delta link can be used to retrieve entity changes. Important! Change Tracking must be enabled for the entity.
 */

/**
 * Constructor.
 * @constructor
 * @param {DWAConfig} [config] - configuration object
 * @example
   *var dynamicsWebApi = new DynamicsWebApi();
  * @example
   *var dynamicsWebApi = new DynamicsWebApi({ webApiVersion: '9.0' });
  * @example
   *var dynamicsWebApi = new DynamicsWebApi({
   *    webApiUrl: 'https:/myorg.api.crm.dynamics.com/api/data/v9.0/',
   *    includeAnnotations: 'OData.Community.Display.V1.FormattedValue'
   *});
 */
function DynamicsWebApi(config) {

    var _internalConfig = {
        webApiVersion: "8.0",
        webApiUrl: null,
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

        if (config.timeout) {
            ErrorHelper.numberParameterCheck(config.timeout, "DynamicsWebApi.setConfig", "config.timeout");
            _internalConfig.timeout = config.timeout;
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

    var _makeRequest = function (method, request, functionName, responseParams) {
        request.isBatch = _isBatch;
        return new Promise(function (resolve, reject) {
            Request.makeRequest(method, request, functionName, _internalConfig, responseParams, resolve, reject);
        });
    };

    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
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
        *dynamicsWebApi.createRequest(request).then(function (response) {
        *}).catch(function (error) {
        *});
     */
    this.createRequest = function (request) {
        ErrorHelper.parameterCheck(request, 'DynamicsWebApi.create', 'request');

        return _makeRequest('POST', request, 'create')
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {Object} object - A JavaScript object valid for create operations.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string|Array} [prefer] - Sets a Prefer header value. For example: ['retrun=representation', 'odata.include-annotations="*"']
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     * @example
        *var lead = {
        *    subject: "Test WebAPI",
        *    firstname: "Test",
        *    lastname: "WebAPI",
        *    jobtitle: "Title"
        *};
        *
        *dynamicsWebApi.create(lead, "leads").then(function (id) {
        *}).catch(function (error) {
        *});
     */
    this.create = function (object, collection, prefer, select) {
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

        return this.createRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     * @example
        *var request = {
        *    key: '7d577253-3ef0-4a0a-bb7f-8335c2596e70',
        *    collection: "leads",
        *    select: ["fullname", "subject"],
        *    ifnonematch: 'W/"468026"',
        *    includeAnnotations: "OData.Community.Display.V1.FormattedValue"
        *};
        *
        *dynamicsWebApi.retrieveRequest(request).then(function (response) {
        *
        *}).catch(function (error) {
        *
        *});
     */
    this.retrieveRequest = function (request) {
        ErrorHelper.parameterCheck(request, 'DynamicsWebApi.retrieve', 'request');

        //copy locally
        var isRef = request.select != null && request.select.length === 1 && request.select[0].endsWith("/$ref");
        return _makeRequest('GET', request, 'retrieve', { isRef: isRef }).then(function (response) {
            return response.data;
        });
    };

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {string} key - A String representing the GUID value or Aternate Key for the record to retrieve.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieve = function (key, collection, select, expand) {

        ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.retrieve", "key");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.retrieve", "key");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.retrieve", "collection");

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

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    this.updateRequest = function (request) {

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.update", "request");

        if (request.ifmatch == null) {
            request.ifmatch = '*'; //to prevent upsert
        }

        //Metadata definitions, cannot be updated using "PATCH" method
        var method = /EntityDefinitions|RelationshipDefinitions|GlobalOptionSetDefinitions/.test(request.collection)
            ? 'PUT' : 'PATCH';

        //copy locally
        var ifmatch = request.ifmatch;
        return _makeRequest(method, request, 'update', { valueIfEmpty: true })
            .then(function (response) {
                return response.data;
            }).catch(function (error) {
                if (ifmatch && error.status === 412) {
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
     * @param {string} key - A String representing the GUID value or Alternate Key for the record to update.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {string} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.update = function (key, collection, object, prefer, select) {

        ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.update", "key");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.update", "key");
        ErrorHelper.parameterCheck(object, "DynamicsWebApi.update", "object");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.update", "collection");

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

        return this.updateRequest(request);
    };

    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key for the record to update.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Object} keyValuePair - keyValuePair object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"}
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.updateSingleProperty = function (key, collection, keyValuePair, prefer, select) {

        ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.updateSingleProperty", "key");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.updateSingleProperty", "key");
        ErrorHelper.parameterCheck(keyValuePair, "DynamicsWebApi.updateSingleProperty", "keyValuePair");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.updateSingleProperty", "collection");

        var field = Object.keys(keyValuePair)[0];
        var fieldValue = keyValuePair[field];

        if (prefer) {
            ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.updateSingleProperty", "prefer");
        }

        if (select) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.updateSingleProperty", "select");
        }

        var request = {
            collection: collection,
            key: key,
            select: select,
            prefer: prefer,
            navigationProperty: field,
            data: { value: fieldValue }
        };

        return _makeRequest('PUT', request, 'updateSingleProperty')
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    this.deleteRequest = function (request) {

        ErrorHelper.parameterCheck(request, 'DynamicsWebApi.delete', 'request');

        //copy locally
        var ifmatch = request.ifmatch;
        return _makeRequest('DELETE', request, 'delete', { valueIfEmpty: true }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            if (ifmatch && error.status === 412) {
                //precondition failed - not deleted
                return false;
            }
            else {
                //rethrow error otherwise
                throw error;
            }
        });
    };

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key for the record to delete.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} [propertyName] - The name of the property which needs to be emptied. Instead of removing a whole record only the specified property will be cleared.
     * @returns {Promise} D365 Web Api result
     */
    this.deleteRecord = function (key, collection, propertyName) {
        ErrorHelper.stringParameterCheck(collection, 'DynamicsWebApi.deleteRecord', 'collection');

        if (propertyName != null)
            ErrorHelper.stringParameterCheck(propertyName, 'DynamicsWebApi.deleteRecord', 'propertyName');

        var request = {
            navigationProperty: propertyName,
            collection: collection,
            key: key
        };

        return _makeRequest('DELETE', request, 'deleteRecord').then(function () {
            return;
        });
    };

    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    this.upsertRequest = function (request) {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.upsert", "request");

        //copy locally
        var ifnonematch = request.ifnonematch;
        var ifmatch = request.ifmatch;
        return _makeRequest("PATCH", request, 'upsert')
            .then(function (response) {
                return response.data;
            }).catch(function (error) {
                if (ifnonematch && error.status === 412) {
                    //if prevent update
                    return;
                }
                else if (ifmatch && error.status === 404) {
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
     * @param {string} key - A String representing the GUID value or Alternate Key for the record to upsert.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.upsert = function (key, collection, object, prefer, select) {

        ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.upsert", "key");
        key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.upsert", "key");

        ErrorHelper.parameterCheck(object, "DynamicsWebApi.upsert", "object");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.upsert", "collection");

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

        return this.upsertRequest(request);
    };

    var retrieveMultipleRequest = function (request, nextPageLink) {

        if (nextPageLink) {
            ErrorHelper.stringParameterCheck(nextPageLink, 'DynamicsWebApi.retrieveMultiple', 'nextPageLink');
            request.url = nextPageLink;
        }

        return _makeRequest("GET", request, 'retrieveMultiple')
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveMultipleRequest = retrieveMultipleRequest;

    var _retrieveAllRequest = function (request, nextPageLink, records) {
        records = records || [];

        return retrieveMultipleRequest(request, nextPageLink).then(function (response) {
            records = records.concat(response.value);

            var pageLink = response.oDataNextLink;

            if (pageLink) {
                return _retrieveAllRequest(request, pageLink, records);
            }

            var result = { value: records };

            if (response.oDataDeltaLink) {
                result["@odata.deltaLink"] = response.oDataDeltaLink;
                result.oDataDeltaLink = response.oDataDeltaLink;
            }

            return result;
        });
    };

    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveAllRequest = function (request) {
        ErrorHelper.batchIncompatible('DynamicsWebApi.retrieveAllRequest', _isBatch);
        return _retrieveAllRequest(request);
    };

    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.count = function (collection, filter) {
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

        //if filter has not been specified then simplify the request
        return _makeRequest('GET', request, 'count', { toCount: request.count })
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Sends an asynchronous request to count records. Returns: Number
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.countAll = function (collection, filter, select) {
        ErrorHelper.batchIncompatible('DynamicsWebApi.countAll', _isBatch);
        return _retrieveAllRequest({
            collection: collection,
            filter: filter,
            select: select
        })
            .then(function (response) {
                return response
                    ? (response.value ? response.value.length : 0)
                    : 0;
            });
    };

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveMultiple = function (collection, select, filter, nextPageLink) {
        return this.retrieveMultipleRequest({
            collection: collection,
            select: select,
            filter: filter
        }, nextPageLink);
    };

    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveAll = function (collection, select, filter) {
        ErrorHelper.batchIncompatible('DynamicsWebApi.retrieveAll', _isBatch);
        return _retrieveAllRequest({
            collection: collection,
            select: select,
            filter: filter
        });
    };

    var executeFetchXml = function (collection, fetchXml, includeAnnotations, pageNumber, pagingCookie, impersonateUserId) {

        ErrorHelper.stringParameterCheck(fetchXml, "DynamicsWebApi.executeFetchXml", "fetchXml");

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

        return _makeRequest("GET", request, 'executeFetchXml', { pageNumber: pageNumber })
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {number} [pageNumber] - Page number.
     * @param {string} [pagingCookie] - Paging cookie. For retrieving the first page, pagingCookie should be null.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.fetch = executeFetchXml;

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {number} [pageNumber] - Page number.
     * @param {string} [pagingCookie] - Paging cookie. For retrieving the first page, pagingCookie should be null.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.executeFetchXml = executeFetchXml;

    var _executeFetchXmlAll = function (collection, fetchXml, includeAnnotations, pageNumber, pagingCookie, impersonateUserId, records) {
        records = records || [];

        return executeFetchXml(collection, fetchXml, includeAnnotations, pageNumber, pagingCookie, impersonateUserId, records).then(function (response) {
            records = records.concat(response.value);

            if (response.PagingInfo) {
                return _executeFetchXmlAll(collection, fetchXml, includeAnnotations, response.PagingInfo.nextPage, response.PagingInfo.cookie, impersonateUserId, records);
            }

            return { value: records };
        });
    };

    var innerExecuteFetchXmlAll = function (collection, fetchXml, includeAnnotations, impersonateUserId) {
        ErrorHelper.batchIncompatible('DynamicsWebApi.executeFetchXmlAll', _isBatch);
        return _executeFetchXmlAll(collection, fetchXml, includeAnnotations, null, null, impersonateUserId);
    };

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.fetchAll = innerExecuteFetchXmlAll;

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.executeFetchXmlAll = innerExecuteFetchXmlAll;

    /**
     * Associate for a collection-valued navigation property. (1:N or N:N)
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} primaryKey - Primary entity record id.
     * @param {string} relationshipName - Relationship name.
     * @param {string} relatedCollection - Related name of the Entity Collection or Entity Logical name.
     * @param {string} relatedKey - Related entity record id.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.associate = function (collection, primaryKey, relationshipName, relatedCollection, relatedKey, impersonateUserId) {
        ErrorHelper.stringParameterCheck(relatedCollection, "DynamicsWebApi.associate", "relatedcollection");
        ErrorHelper.stringParameterCheck(relationshipName, "DynamicsWebApi.associate", "relationshipName");
        primaryKey = ErrorHelper.keyParameterCheck(primaryKey, "DynamicsWebApi.associate", "primaryKey");
        relatedKey = ErrorHelper.keyParameterCheck(relatedKey, "DynamicsWebApi.associate", "relatedKey");

        var request = {
            _additionalUrl: relationshipName + '/$ref',
            collection: collection,
            key: primaryKey,
            impersonate: impersonateUserId,
            data: { "@odata.id": relatedCollection + "(" + relatedKey + ")" }
        };

        return _makeRequest("POST", request, 'associate')
            .then(function () { });
    };

    /**
     * Disassociate for a collection-valued navigation property.
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} primaryKey - Primary entity record id.
     * @param {string} relationshipName - Relationship name.
     * @param {string} relatedKey - Related entity record id.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.disassociate = function (collection, primaryKey, relationshipName, relatedKey, impersonateUserId) {
        ErrorHelper.stringParameterCheck(relationshipName, "DynamicsWebApi.disassociate", "relationshipName");
        relatedKey = ErrorHelper.keyParameterCheck(relatedKey, "DynamicsWebApi.disassociate", "relatedId");

        var request = {
            _additionalUrl: relationshipName + '(' + relatedKey + ')/$ref',
            collection: collection,
            key: primaryKey,
            impersonate: impersonateUserId
        };

        return _makeRequest("DELETE", request, 'disassociate')
            .then(function () { });
    };

    /**
     * Associate for a single-valued navigation property. (1:N)
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} key - Entity record Id that contains an attribute.
     * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param {string} relatedCollection - Related collection name that the lookup (attribute) points to.
     * @param {string} relatedKey - Related entity record id that needs to be associated.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.associateSingleValued = function (collection, key, singleValuedNavigationPropertyName, relatedCollection, relatedKey, impersonateUserId) {

        relatedKey = ErrorHelper.keyParameterCheck(relatedKey, "DynamicsWebApi.associateSingleValued", "relatedKey");
        ErrorHelper.stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.associateSingleValued", "singleValuedNavigationPropertyName");
        ErrorHelper.stringParameterCheck(relatedCollection, "DynamicsWebApi.associateSingleValued", "relatedcollection");

        var request = {
            _additionalUrl: singleValuedNavigationPropertyName + '/$ref',
            collection: collection,
            key: key,
            impersonate: impersonateUserId,
            data: { "@odata.id": relatedCollection + "(" + relatedKey + ")" }
        };

        return _makeRequest("PUT", request, 'associateSingleValued')
            .then(function () { });
    };

    /**
     * Removes a reference to an entity for a single-valued navigation property. (1:N)
     *
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} key - Entity record Id that contains an attribute.
     * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.disassociateSingleValued = function (collection, key, singleValuedNavigationPropertyName, impersonateUserId) {

        ErrorHelper.stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.disassociateSingleValued", "singleValuedNavigationPropertyName");

        var request = {
            _additionalUrl: singleValuedNavigationPropertyName + "/$ref",
            key: key,
            collection: collection,
            impersonate: impersonateUserId
        };

        return _makeRequest("DELETE", request, 'disassociateSingleValued')
            .then(function () { });
    };

    /**
     * Executes an unbound function (not bound to a particular entity record)
     *
     * @param {string} functionName - The name of the function.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.executeUnboundFunction = function (functionName, parameters, impersonateUserId) {
        return _executeFunction(functionName, parameters, null, null, impersonateUserId, true);
    };

    /**
     * Executes a bound function
     *
     * @param {string} [id] - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} functionName - The name of the function.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.executeBoundFunction = function (id, collection, functionName, parameters, impersonateUserId) {
        return _executeFunction(functionName, parameters, collection, id, impersonateUserId);
    };

    var _executeFunction = function (functionName, parameters, collection, id, impersonateUserId, isUnbound) {

        ErrorHelper.stringParameterCheck(functionName, "DynamicsWebApi.executeFunction", "functionName");

        var request = {
            _additionalUrl: functionName + Utility.buildFunctionParameters(parameters),
            _unboundRequest: isUnbound,
            key: id,
            collection: collection,
            impersonate: impersonateUserId
        };

        return _makeRequest("GET", request, 'executeFunction').then(function (response) {
            return response.data;
        });
    };

    /**
     * Executes an unbound Web API action (not bound to a particular entity record)
     *
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} [requestObject] - Action request body object.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise} D365 Web Api result
     */
    this.executeUnboundAction = function (actionName, requestObject, impersonateUserId) {
        return _executeAction(actionName, requestObject, null, null, impersonateUserId, true);
    };

    /**
     * Executes a bound Web API action (bound to a particular entity record)
     *
     * @param {string} id - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} [requestObject] - Action request body object.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise | Function} D365 Web Api result
     */
    this.executeBoundAction = function (id, collection, actionName, requestObject, impersonateUserId) {
        return _executeAction(actionName, requestObject, collection, id, impersonateUserId);
    };

    var _executeAction = function (actionName, requestObject, collection, id, impersonateUserId, isUnbound) {

        ErrorHelper.stringParameterCheck(actionName, "DynamicsWebApi.executeAction", "actionName");

        var request = {
            _additionalUrl: actionName,
            _unboundRequest: isUnbound,
            collection: collection,
            key: id,
            impersonate: impersonateUserId,
            data: requestObject
        };

        var onSuccess = function (response) {
            return response.data;
        };


        return _makeRequest("POST", request, 'executeAction').then(onSuccess);
    };

    /**
     * Sends an asynchronous request to create an entity definition.
     *
     * @param {string} entityDefinition - Entity Definition.
     * @returns {Promise} D365 Web Api result
     */
    this.createEntity = function (entityDefinition) {

        ErrorHelper.parameterCheck(entityDefinition, 'DynamicsWebApi.createEntity', 'entityDefinition');

        var request = {
            collection: 'EntityDefinitions',
            entity: entityDefinition
        };
        return this.createRequest(request);
    };

    /**
     * Sends an asynchronous request to update an entity definition.
     *
     * @param {string} entityDefinition - Entity Definition.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     * @returns {Promise} D365 Web Api result
     */
    this.updateEntity = function (entityDefinition, mergeLabels) {

        ErrorHelper.parameterCheck(entityDefinition, 'DynamicsWebApi.updateEntity', 'entityDefinition');
        ErrorHelper.guidParameterCheck(entityDefinition.MetadataId, 'DynamicsWebApi.updateEntity', 'entityDefinition.MetadataId');

        var request = {
            collection: 'EntityDefinitions',
            mergeLabels: mergeLabels,
            key: entityDefinition.MetadataId,
            entity: entityDefinition
        };
        return this.updateRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve a specific entity definition.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
    * @returns {Promise} D365 Web Api result
     */
    this.retrieveEntity = function (entityKey, select, expand) {

        ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.retrieveEntity', 'entityKey');

        var request = {
            collection: 'EntityDefinitions',
            key: entityKey,
            select: select,
            expand: expand
        };

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve entity definitions.
     *
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entity definitions will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveEntities = function (select, filter) {
        var request = {
            collection: 'EntityDefinitions',
            select: select,
            filter: filter
        };

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to create an attribute.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {Object} attributeDefinition - Object that describes the attribute.
     * @returns {Promise} D365 Web Api result
     */
    this.createAttribute = function (entityKey, attributeDefinition) {
        ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.createAttribute', 'entityKey');
        ErrorHelper.parameterCheck(attributeDefinition, 'DynamicsWebApi.createAttribute', 'attributeDefinition');

        var request = {
            collection: 'EntityDefinitions',
            key: entityKey,
            entity: attributeDefinition,
            navigationProperty: 'Attributes'
        };

        return this.createRequest(request);
    };

    /**
     * Sends an asynchronous request to update an attribute.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {Object} attributeDefinition - Object that describes the attribute.
     * @param {string} [attributeType] - Use this parameter to cast the Attribute to a specific type.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     * @returns {Promise} D365 Web Api result
     */
    this.updateAttribute = function (entityKey, attributeDefinition, attributeType, mergeLabels) {
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

        return this.updateRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve attribute metadata for a specified entity definition.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {string} [attributeType] - Use this parameter to cast the Attributes to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which attribute definitions will be returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveAttributes = function (entityKey, attributeType, select, filter, expand) {

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

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve a specific attribute metadata for a specified entity definition.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {string} attributeKey - The Attribute Metadata id.
     * @param {string} [attributeType] - Use this parameter to cast the Attribute to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveAttribute = function (entityKey, attributeKey, attributeType, select, expand) {

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

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to create a relationship definition.
     *
     * @param {string} relationshipDefinition - Relationship Definition.
     * @returns {Promise} D365 Web Api result
     */
    this.createRelationship = function (relationshipDefinition) {

        ErrorHelper.parameterCheck(relationshipDefinition, 'DynamicsWebApi.createRelationship', 'relationshipDefinition');

        var request = {
            collection: 'RelationshipDefinitions',
            entity: relationshipDefinition
        };
        return this.createRequest(request);
    };

    /**
     * Sends an asynchronous request to update a relationship definition.
     *
     * @param {string} relationshipDefinition - Relationship Definition.
     * @param {string} [relationshipType] - Use this parameter to cast the Relationship to a specific type.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     * @returns {Promise} D365 Web Api result
     */
    this.updateRelationship = function (relationshipDefinition, relationshipType, mergeLabels) {

        ErrorHelper.parameterCheck(relationshipDefinition, 'DynamicsWebApi.updateRelationship', 'relationshipDefinition');
        ErrorHelper.guidParameterCheck(relationshipDefinition.MetadataId, 'DynamicsWebApi.updateRelationship', 'relationshipDefinition.MetadataId');

        var request = {
            collection: 'RelationshipDefinitions',
            mergeLabels: mergeLabels,
            key: relationshipDefinition.MetadataId,
            entity: relationshipDefinition,
            navigationProperty: relationshipType
        };

        return this.updateRequest(request);
    };

    /**
     * Sends an asynchronous request to delete a relationship definition.
     *
     * @param {string} metadataId - A String representing the GUID value.
     * @returns {Promise} D365 Web Api result
     */
    this.deleteRelationship = function (metadataId) {
        ErrorHelper.keyParameterCheck(metadataId, 'DynamicsWebApi.deleteRelationship', 'metadataId');

        var request = {
            collection: 'RelationshipDefinitions',
            key: metadataId
        };

        return this.deleteRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve relationship definitions.
     *
     * @param {string} [relationshipType] - Use this parameter to cast a Relationship to a specific type: 1:M or M:M.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which relationships will be returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveRelationships = function (relationshipType, select, filter) {

        var request = {
            collection: 'RelationshipDefinitions',
            navigationProperty: relationshipType,
            select: select,
            filter: filter
        };

        return this.retrieveMultipleRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve a specific relationship definition.
     *
     * @param {string} metadataId - String representing the Metadata Id GUID.
     * @param {string} [relationshipType] - Use this parameter to cast a Relationship to a specific type: 1:M or M:M.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveRelationship = function (metadataId, relationshipType, select) {

        ErrorHelper.keyParameterCheck(metadataId, 'DynamicsWebApi.retrieveRelationship', 'metadataId');

        var request = {
            collection: 'RelationshipDefinitions',
            navigationProperty: relationshipType,
            key: metadataId,
            select: select
        };

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to create a Global Option Set definition
     *
     * @param {string} globalOptionSetDefinition - Global Option Set Definition.
     * @returns {Promise} D365 Web Api result
     */
    this.createGlobalOptionSet = function (globalOptionSetDefinition) {

        ErrorHelper.parameterCheck(globalOptionSetDefinition, 'DynamicsWebApi.createGlobalOptionSet', 'globalOptionSetDefinition');

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            entity: globalOptionSetDefinition
        };

        return this.createRequest(request);
    };

    /**
     * Sends an asynchronous request to update a Global Option Set.
     *
     * @param {string} globalOptionSetDefinition - Global Option Set Definition.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     * @returns {Promise} D365 Web Api result
     */
    this.updateGlobalOptionSet = function (globalOptionSetDefinition, mergeLabels) {

        ErrorHelper.parameterCheck(globalOptionSetDefinition, 'DynamicsWebApi.updateGlobalOptionSet', 'globalOptionSetDefinition');
        ErrorHelper.guidParameterCheck(globalOptionSetDefinition.MetadataId, 'DynamicsWebApi.updateGlobalOptionSet', 'globalOptionSetDefinition.MetadataId');

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            mergeLabels: mergeLabels,
            key: globalOptionSetDefinition.MetadataId,
            entity: globalOptionSetDefinition
        };
        return this.updateRequest(request);
    };

    /**
     * Sends an asynchronous request to delete a Global Option Set.
     *
     * @param {string} globalOptionSetKey - A String representing the GUID value or Alternate Key (such as Name).
     * @returns {Promise} D365 Web Api result
     */
    this.deleteGlobalOptionSet = function (globalOptionSetKey) {
        ErrorHelper.keyParameterCheck(globalOptionSetKey, 'DynamicsWebApi.deleteGlobalOptionSet', 'globalOptionSetKey');

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            key: globalOptionSetKey
        };

        return this.deleteRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     * 
     * @param {string} globalOptionSetKey - The Global Option Set MetadataID or Alternate Key (such as Name).
     * @param {string} [castType] - Use this parameter to cast a Global Option Set to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveGlobalOptionSet = function (globalOptionSetKey, castType, select) {
        ErrorHelper.keyParameterCheck(globalOptionSetKey, 'DynamicsWebApi.retrieveGlobalOptionSet', 'globalOptionSetKey');

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            key: globalOptionSetKey,
            navigationProperty: castType,
            select: select
        };

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     * 
     * @param {string} [castType] - Use this parameter to cast a Global Option Set to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned
     * @returns {Promise} D365 Web Api result
     */
    this.retrieveGlobalOptionSets = function (castType, select) {

        var request = {
            collection: 'GlobalOptionSetDefinitions',
            navigationProperty: castType,
            select: select
        };

        return this.retrieveMultipleRequest(request);
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
     * @returns {Promise} D365 Web Api result
     */
    this.executeBatch = function () {
        ErrorHelper.batchNotStarted(_isBatch);

        _isBatch = false;
        return _makeRequest('POST', { collection: '$batch' }, 'executeBatch')
            .then(function (response) {
                return response.data;
            });
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