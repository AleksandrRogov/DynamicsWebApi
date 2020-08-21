"use strict";
//"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utility_1 = require("./utilities/Utility");
const ErrorHelper_1 = require("./helpers/ErrorHelper");
const RequestClient_1 = require("./requests/RequestClient");
/**
 * Microsoft Dynamics CRM Web API helper library written in JavaScript.
 * It is compatible with: Dynamics 365 (online), Dynamics 365 (on-premise), Dynamics CRM 2016, Dynamics CRM Online.
 * @module dynamics-web-api
 */
class DynamicsWebApi {
    constructor(config) {
        this._internalConfig = {
            webApiVersion: "9.1",
            webApiUrl: null,
            impersonate: null,
            onTokenRefresh: null,
            includeAnnotations: null,
            maxPageSize: null,
            returnRepresentation: null
        };
        this._isBatch = false;
        /**
         * Sets the configuration parameters for DynamicsWebApi helper.
         *
         * @param {DWAConfig} config - configuration object
         * @example
           dynamicsWebApi.setConfig({ webApiVersion: '9.0' });
         */
        this.setConfig = (config) => {
            var isVersionDiffer = (config.webApiVersion || this._internalConfig.webApiVersion) !== this._internalConfig.webApiVersion;
            if (config.webApiVersion) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(config.webApiVersion, "DynamicsWebApi.setConfig", "config.webApiVersion");
                this._internalConfig.webApiVersion = config.webApiVersion;
            }
            if (config.webApiUrl) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(config.webApiUrl, "DynamicsWebApi.setConfig", "config.webApiUrl");
                this._internalConfig.webApiUrl = config.webApiUrl;
            }
            else {
                if (!this._internalConfig.webApiUrl || isVersionDiffer) {
                    this._internalConfig.webApiUrl = Utility_1.Utility.initWebApiUrl(this._internalConfig.webApiVersion);
                }
            }
            if (config.impersonate) {
                this._internalConfig.impersonate = ErrorHelper_1.ErrorHelper.guidParameterCheck(config.impersonate, "DynamicsWebApi.setConfig", "config.impersonate");
            }
            if (config.onTokenRefresh) {
                ErrorHelper_1.ErrorHelper.callbackParameterCheck(config.onTokenRefresh, "DynamicsWebApi.setConfig", "config.onTokenRefresh");
                this._internalConfig.onTokenRefresh = config.onTokenRefresh;
            }
            if (config.includeAnnotations) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(config.includeAnnotations, "DynamicsWebApi.setConfig", "config.includeAnnotations");
                this._internalConfig.includeAnnotations = config.includeAnnotations;
            }
            if (config.timeout) {
                ErrorHelper_1.ErrorHelper.numberParameterCheck(config.timeout, "DynamicsWebApi.setConfig", "config.timeout");
                this._internalConfig.timeout = config.timeout;
            }
            if (config.maxPageSize) {
                ErrorHelper_1.ErrorHelper.numberParameterCheck(config.maxPageSize, "DynamicsWebApi.setConfig", "config.maxPageSize");
                this._internalConfig.maxPageSize = config.maxPageSize;
            }
            if (config.returnRepresentation) {
                ErrorHelper_1.ErrorHelper.boolParameterCheck(config.returnRepresentation, "DynamicsWebApi.setConfig", "config.returnRepresentation");
                this._internalConfig.returnRepresentation = config.returnRepresentation;
            }
            if (config.useEntityNames) {
                ErrorHelper_1.ErrorHelper.boolParameterCheck(config.useEntityNames, 'DynamicsWebApi.setConfig', 'config.useEntityNames');
                this._internalConfig.useEntityNames = config.useEntityNames;
            }
        };
        this._makeRequest = (request) => {
            request.isBatch = this._isBatch;
            return new Promise((resolve, reject) => {
                RequestClient_1.RequestClient.makeRequest(request, this._internalConfig, resolve, reject);
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
        this.createRequest = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.create", "request");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "POST";
            internalRequest.functionName = "create";
            return this._makeRequest(internalRequest)
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
        //create = (object, collection, prefer, select) => {
        //	ErrorHelper.parameterCheck(object, "DynamicsWebApi.create", "object");
        //	ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.create", "collection");
        //	if (prefer) {
        //		ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.create", "prefer");
        //	}
        //	if (select) {
        //		ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.create", "select");
        //	}
        //	var request = {
        //		collection: collection,
        //		select: select,
        //		prefer: prefer,
        //		entity: object
        //	};
        //	return this.createRequest(request);
        //};
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
        this.retrieveRequest = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, 'DynamicsWebApi.retrieve', 'request');
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "GET";
            internalRequest.functionName = "retrieve";
            internalRequest.responseParameters = {
                isRef: internalRequest.select != null && internalRequest.select.length === 1 && internalRequest.select[0].endsWith("/$ref")
            };
            return this._makeRequest(internalRequest).then(function (response) {
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
        //this.retrieve = function (key, collection, select, expand) {
        //	ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.retrieve", "key");
        //	key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.retrieve", "key");
        //	ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.retrieve", "collection");
        //	if (select && select.length) {
        //		ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.retrieve", "select");
        //	}
        //	if (expand && expand.length) {
        //		ErrorHelper.stringOrArrayParameterCheck(expand, "DynamicsWebApi.retrieve", "expand");
        //	}
        //	var request = {
        //		collection: collection,
        //		key: key,
        //		select: select,
        //		expand: expand
        //	};
        //	return this.retrieveRequest(request);
        //};
        /**
         * Sends an asynchronous request to update a record.
         *
         * @param {DWARequest} request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.updateRequest = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.update", "request");
            let internalRequest = Utility_1.Utility.copyObject(request);
            //Metadata definitions, cannot be updated using "PATCH" method
            internalRequest.method = /EntityDefinitions|RelationshipDefinitions|GlobalOptionSetDefinitions/.test(internalRequest.collection)
                ? "PUT" : "PATCH";
            internalRequest.functionName = "update";
            internalRequest.responseParameters = { valueIfEmpty: true };
            if (internalRequest.ifmatch == null) {
                internalRequest.ifmatch = '*'; //to prevent upsert
            }
            //copy locally
            var ifmatch = internalRequest.ifmatch;
            return this._makeRequest(internalRequest)
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
        //this.update = function (key, collection, object, prefer, select) {
        //	ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.update", "key");
        //	key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.update", "key");
        //	ErrorHelper.parameterCheck(object, "DynamicsWebApi.update", "object");
        //	ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.update", "collection");
        //	if (prefer) {
        //		ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.update", "prefer");
        //	}
        //	if (select) {
        //		ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.update", "select");
        //	}
        //	var request = {
        //		collection: collection,
        //		key: key,
        //		select: select,
        //		prefer: prefer,
        //		entity: object
        //	};
        //	return this.updateRequest(request);
        //};
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
        this.updateSingleProperty = (key, collection, keyValuePair, prefer, select) => {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.updateSingleProperty", "key");
            key = ErrorHelper_1.ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.updateSingleProperty", "key");
            ErrorHelper_1.ErrorHelper.parameterCheck(keyValuePair, "DynamicsWebApi.updateSingleProperty", "keyValuePair");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.updateSingleProperty", "collection");
            var field = Object.keys(keyValuePair)[0];
            var fieldValue = keyValuePair[field];
            if (prefer) {
                ErrorHelper_1.ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.updateSingleProperty", "prefer");
            }
            if (select) {
                ErrorHelper_1.ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.updateSingleProperty", "select");
            }
            var request = {
                collection: collection,
                key: key,
                select: select,
                prefer: prefer,
                navigationProperty: field,
                data: { value: fieldValue },
                method: "PUT",
                functionName: "updateSingleProperty"
            };
            return this._makeRequest(request)
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
        this.deleteRequest = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, 'DynamicsWebApi.delete', 'request');
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "DELETE";
            internalRequest.functionName = "delete";
            internalRequest.responseParameters = { valueIfEmpty: true };
            //copy locally
            var ifmatch = internalRequest.ifmatch;
            return this._makeRequest(internalRequest).then(function (response) {
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
        //this.deleteRecord = function (key, collection, propertyName) {
        //	ErrorHelper.stringParameterCheck(collection, 'DynamicsWebApi.deleteRecord', 'collection');
        //	if (propertyName != null)
        //		ErrorHelper.stringParameterCheck(propertyName, 'DynamicsWebApi.deleteRecord', 'propertyName');
        //	var request = {
        //		navigationProperty: propertyName,
        //		collection: collection,
        //		key: key
        //	};
        //	return _makeRequest('DELETE', request, 'deleteRecord').then(function () {
        //		return;
        //	});
        //};
        /**
         * Sends an asynchronous request to upsert a record.
         *
         * @param {DWARequest} request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.upsertRequest = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.upsert", "request");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "PATCH";
            internalRequest.functionName = "upsert";
            //copy locally
            var ifnonematch = internalRequest.ifnonematch;
            var ifmatch = internalRequest.ifmatch;
            return this._makeRequest(internalRequest)
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
        //this.upsert = function (key, collection, object, prefer, select) {
        //	ErrorHelper.stringParameterCheck(key, "DynamicsWebApi.upsert", "key");
        //	key = ErrorHelper.keyParameterCheck(key, "DynamicsWebApi.upsert", "key");
        //	ErrorHelper.parameterCheck(object, "DynamicsWebApi.upsert", "object");
        //	ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.upsert", "collection");
        //	if (prefer) {
        //		ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.upsert", "prefer");
        //	}
        //	if (select) {
        //		ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.upsert", "select");
        //	}
        //	var request = {
        //		collection: collection,
        //		key: key,
        //		select: select,
        //		prefer: prefer,
        //		entity: object
        //	};
        //	return this.upsertRequest(request);
        //};
        this.retrieveMultipleRequest = (request, nextPageLink) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveMultipleRequest", "request");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "GET";
            internalRequest.functionName = "retrieveMultiple";
            if (nextPageLink) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(nextPageLink, 'DynamicsWebApi.retrieveMultiple', 'nextPageLink');
                internalRequest.url = nextPageLink;
            }
            return this._makeRequest(internalRequest)
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
        //this.retrieveMultipleRequest = retrieveMultipleRequest;
        this._retrieveAllRequest = (request, nextPageLink, records = []) => {
            //records = records || [];
            return this.retrieveMultipleRequest(request, nextPageLink).then(response => {
                records = records.concat(response.value);
                let pageLink = response.oDataNextLink;
                if (pageLink) {
                    return this._retrieveAllRequest(request, pageLink, records);
                }
                let result = { value: records };
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
        this.retrieveAllRequest = (request) => {
            ErrorHelper_1.ErrorHelper.batchIncompatible('DynamicsWebApi.retrieveAllRequest', this._isBatch);
            return this._retrieveAllRequest(request);
        };
        /**
         * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.count = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.count", "request");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "GET";
            internalRequest.functionName = "count";
            if (internalRequest.filter == null || (internalRequest.filter != null && !internalRequest.filter.length)) {
                internalRequest.navigationProperty = '$count';
            }
            else {
                internalRequest.count = true;
            }
            internalRequest.responseParameters = { toCount: internalRequest.count };
            //if filter has not been specified then simplify the request
            return this._makeRequest(internalRequest)
                .then(function (response) {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to count records. Returns: Number
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.countAll = (request) => {
            ErrorHelper_1.ErrorHelper.batchIncompatible('DynamicsWebApi.countAll', this._isBatch);
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.countAll", "request");
            return this._retrieveAllRequest(request)
                .then(function (response) {
                return response
                    ? (response.value ? response.value.length : 0)
                    : 0;
            });
        };
        /**
         * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.fetch = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.fetch", "request");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "GET";
            internalRequest.functionName = "fetch";
            ErrorHelper_1.ErrorHelper.stringParameterCheck(internalRequest.fetchXml, "DynamicsWebApi.fetch", "request.fetchXml");
            internalRequest.pageNumber = internalRequest.pageNumber || 1;
            ErrorHelper_1.ErrorHelper.numberParameterCheck(internalRequest.pageNumber, "DynamicsWebApi.fetch", "request.pageNumber");
            let replacementString = `$1 page="${internalRequest.pageNumber}"`;
            if (internalRequest.pagingCookie != null) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(internalRequest.pagingCookie, "DynamicsWebApi.fetch", "request.pagingCookie");
                replacementString += ` paging-cookie="${internalRequest.pagingCookie}"`;
            }
            //add page number and paging cookie to fetch xml
            internalRequest.fetchXml = internalRequest.fetchXml.replace(/^(<fetch)/, replacementString);
            internalRequest.responseParameters = { pageNumber: internalRequest.pageNumber };
            return this._makeRequest(internalRequest)
                .then(function (response) {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to execute FetchXml to retrieve all records.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.fetchAll = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.fetchAll", "request");
            let _executeFetchXmlAll = (request, records) => {
                records = records || [];
                return this.fetch(request).then(function (response) {
                    records = records.concat(response.value);
                    if (response.PagingInfo) {
                        request.pageNumber = response.PagingInfo.nextPage;
                        request.pagingCookie = response.PagingInfo.cookie;
                        return _executeFetchXmlAll(request, records);
                    }
                    return { value: records };
                });
            };
            ErrorHelper_1.ErrorHelper.batchIncompatible('DynamicsWebApi.fetchAll', this._isBatch);
            return _executeFetchXmlAll(request);
        };
        /**
         * Associate for a collection-valued navigation property. (1:N or N:N)
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.associate = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.associate", "request");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "POST";
            internalRequest.functionName = "associate";
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.relatedCollection, "DynamicsWebApi.associate", "request.relatedcollection");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.relationshipName, "DynamicsWebApi.associate", "request.relationshipName");
            let primaryKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.associate", "request.primaryKey");
            let relatedKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.associate", "request.relatedKey");
            internalRequest.navigationProperty = request.relationshipName + '/$ref';
            internalRequest.key = primaryKey;
            internalRequest.data = { "@odata.id": `${request.relatedCollection}(${relatedKey})` };
            return this._makeRequest(internalRequest)
                .then(() => { return; });
        };
        /**
         * Disassociate for a collection-valued navigation property.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.disassociate = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.disassociate", "request");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "DELETE";
            internalRequest.functionName = "disassociate";
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.relationshipName, "DynamicsWebApi.disassociate", "request.relationshipName");
            let primaryKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.disassociate", "request.primaryKey");
            let relatedKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.disassociate", "request.relatedId");
            internalRequest.key = primaryKey;
            internalRequest.navigationProperty = `${request.relationshipName}(${relatedKey})/$ref`;
            return this._makeRequest(internalRequest)
                .then(() => { return; });
        };
        /**
         * Associate for a single-valued navigation property. (1:N)
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.associateSingleValued = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.associateSingleValued", "request");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "PUT";
            internalRequest.functionName = "associateSingleValued";
            let primaryKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.associateSingleValued", "request.primaryKey");
            let relatedKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.associateSingleValued", "request.relatedKey");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.navigationProperty, "DynamicsWebApi.associateSingleValued", "request.navigationProperty");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.relatedCollection, "DynamicsWebApi.associateSingleValued", "request.relatedcollection");
            internalRequest.navigationProperty += '/$ref';
            internalRequest.key = primaryKey;
            internalRequest.data = { "@odata.id": `${request.relatedCollection}(${relatedKey})` };
            return this._makeRequest(internalRequest)
                .then(() => { return; });
        };
        /**
         * Removes a reference to an entity for a single-valued navigation property. (1:N)
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.disassociateSingleValued = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.disassociateSingleValued", "request");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "DELETE";
            internalRequest.functionName = "disassociateSingleValued";
            let primaryKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.disassociateSingleValued", "request.primaryKey");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.navigationProperty, "DynamicsWebApi.disassociateSingleValued", "request.navigationProperty");
            internalRequest.navigationProperty += "/$ref";
            internalRequest.key = primaryKey;
            return this._makeRequest(internalRequest)
                .then(() => { return; });
        };
        /**
         * Executes an unbound function (not bound to a particular entity record)
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.executeUnboundFunction = (request) => {
            return this._executeFunction(request, true);
        };
        /**
         * Executes a bound function
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.executeBoundFunction = (request) => {
            return this._executeFunction(request);
        };
        this._executeFunction = (request, isUnbound = false) => {
            const functionName = !isUnbound ? "executeBoundFunction" : "executeUnboundFunction";
            ErrorHelper_1.ErrorHelper.parameterCheck(request, `DynamicsWebApi.${functionName}`, "request");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.functionName, `DynamicsWebApi.${functionName}`, "request.functionName");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "GET";
            internalRequest.functionName = functionName;
            internalRequest._additionalUrl = request.functionName + Utility_1.Utility.buildFunctionParameters(request.parameters);
            internalRequest._isUnboundRequest = isUnbound;
            internalRequest.key = request.id;
            return this._makeRequest(internalRequest).then(function (response) {
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
        this.executeUnboundAction = (request) => {
            return this._executeAction(request, true);
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
        this.executeBoundAction = (request) => {
            return this._executeAction(request);
        };
        this._executeAction = (request, isUnbound = false) => {
            const functionName = !isUnbound ? "executeBoundAction" : "executeUnboundAction";
            ErrorHelper_1.ErrorHelper.parameterCheck(request, `DynamicsWebApi.${functionName}`, "request");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.actionName, `DynamicsWebApi.${functionName}`, "request.actionName");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "POST";
            internalRequest.functionName = functionName;
            internalRequest._additionalUrl = request.actionName;
            internalRequest._isUnboundRequest = isUnbound;
            internalRequest.key = request.id;
            internalRequest.data = request.action;
            return this._makeRequest(internalRequest).then(response => {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to create an entity definition.
         *
         * @param {string} entityDefinition - Entity Definition.
         * @returns {Promise} D365 Web Api result
         */
        this.createEntity = (entityDefinition) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(entityDefinition, 'DynamicsWebApi.createEntity', 'entityDefinition');
            var request = {
                collection: 'EntityDefinitions',
                data: entityDefinition
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
        this.updateEntity = (entityDefinition, mergeLabels) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(entityDefinition, 'DynamicsWebApi.updateEntity', 'entityDefinition');
            ErrorHelper_1.ErrorHelper.guidParameterCheck(entityDefinition.MetadataId, 'DynamicsWebApi.updateEntity', 'entityDefinition.MetadataId');
            var request = {
                collection: 'EntityDefinitions',
                mergeLabels: mergeLabels,
                key: entityDefinition.MetadataId,
                data: entityDefinition
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
        this.retrieveEntity = (entityKey, select, expand) => {
            ErrorHelper_1.ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.retrieveEntity', 'entityKey');
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
        this.retrieveEntities = (select, filter) => {
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
        this.createAttribute = (entityKey, attributeDefinition) => {
            ErrorHelper_1.ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.createAttribute', 'entityKey');
            ErrorHelper_1.ErrorHelper.parameterCheck(attributeDefinition, 'DynamicsWebApi.createAttribute', 'attributeDefinition');
            var request = {
                collection: 'EntityDefinitions',
                key: entityKey,
                data: attributeDefinition,
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
        this.updateAttribute = (entityKey, attributeDefinition, attributeType, mergeLabels) => {
            ErrorHelper_1.ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.updateAttribute', 'entityKey');
            ErrorHelper_1.ErrorHelper.parameterCheck(attributeDefinition, 'DynamicsWebApi.updateAttribute', 'attributeDefinition');
            ErrorHelper_1.ErrorHelper.guidParameterCheck(attributeDefinition.MetadataId, 'DynamicsWebApi.updateAttribute', 'attributeDefinition.MetadataId');
            if (attributeType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(attributeType, 'DynamicsWebApi.updateAttribute', 'attributeType');
            }
            var request = {
                collection: 'EntityDefinitions',
                key: entityKey,
                data: attributeDefinition,
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
        this.retrieveAttributes = (entityKey, attributeType, select, filter, expand) => {
            ErrorHelper_1.ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.retrieveAttributes', 'entityKey');
            if (attributeType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(attributeType, 'DynamicsWebApi.retrieveAttributes', 'attributeType');
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
        this.retrieveAttribute = (entityKey, attributeKey, attributeType, select, expand) => {
            ErrorHelper_1.ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.retrieveAttribute', 'entityKey');
            ErrorHelper_1.ErrorHelper.keyParameterCheck(attributeKey, 'DynamicsWebApi.retrieveAttribute', 'attributeKey');
            if (attributeType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(attributeType, 'DynamicsWebApi.retrieveAttribute', 'attributeType');
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
        this.createRelationship = (relationshipDefinition) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(relationshipDefinition, 'DynamicsWebApi.createRelationship', 'relationshipDefinition');
            var request = {
                collection: 'RelationshipDefinitions',
                data: relationshipDefinition
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
        this.updateRelationship = (relationshipDefinition, relationshipType, mergeLabels) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(relationshipDefinition, 'DynamicsWebApi.updateRelationship', 'relationshipDefinition');
            ErrorHelper_1.ErrorHelper.guidParameterCheck(relationshipDefinition.MetadataId, 'DynamicsWebApi.updateRelationship', 'relationshipDefinition.MetadataId');
            var request = {
                collection: 'RelationshipDefinitions',
                mergeLabels: mergeLabels,
                key: relationshipDefinition.MetadataId,
                data: relationshipDefinition,
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
        this.deleteRelationship = (metadataId) => {
            ErrorHelper_1.ErrorHelper.keyParameterCheck(metadataId, 'DynamicsWebApi.deleteRelationship', 'metadataId');
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
        this.retrieveRelationships = (relationshipType, select, filter) => {
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
        this.retrieveRelationship = (metadataId, relationshipType, select) => {
            ErrorHelper_1.ErrorHelper.keyParameterCheck(metadataId, 'DynamicsWebApi.retrieveRelationship', 'metadataId');
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
        this.createGlobalOptionSet = (globalOptionSetDefinition) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(globalOptionSetDefinition, 'DynamicsWebApi.createGlobalOptionSet', 'globalOptionSetDefinition');
            var request = {
                collection: 'GlobalOptionSetDefinitions',
                data: globalOptionSetDefinition
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
        this.updateGlobalOptionSet = (globalOptionSetDefinition, mergeLabels) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(globalOptionSetDefinition, 'DynamicsWebApi.updateGlobalOptionSet', 'globalOptionSetDefinition');
            ErrorHelper_1.ErrorHelper.guidParameterCheck(globalOptionSetDefinition.MetadataId, 'DynamicsWebApi.updateGlobalOptionSet', 'globalOptionSetDefinition.MetadataId');
            var request = {
                collection: 'GlobalOptionSetDefinitions',
                mergeLabels: mergeLabels,
                key: globalOptionSetDefinition.MetadataId,
                data: globalOptionSetDefinition
            };
            return this.updateRequest(request);
        };
        /**
         * Sends an asynchronous request to delete a Global Option Set.
         *
         * @param {string} globalOptionSetKey - A String representing the GUID value or Alternate Key (such as Name).
         * @returns {Promise} D365 Web Api result
         */
        this.deleteGlobalOptionSet = (globalOptionSetKey) => {
            ErrorHelper_1.ErrorHelper.keyParameterCheck(globalOptionSetKey, 'DynamicsWebApi.deleteGlobalOptionSet', 'globalOptionSetKey');
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
        this.retrieveGlobalOptionSet = (globalOptionSetKey, castType, select) => {
            ErrorHelper_1.ErrorHelper.keyParameterCheck(globalOptionSetKey, 'DynamicsWebApi.retrieveGlobalOptionSet', 'globalOptionSetKey');
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
        this.retrieveGlobalOptionSets = (castType, select) => {
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
        this.startBatch = () => {
            this._isBatch = true;
        };
        /**
         * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
         * @returns {Promise} D365 Web Api result
         */
        this.executeBatch = () => {
            ErrorHelper_1.ErrorHelper.batchNotStarted(this._isBatch);
            let request = {
                collection: "$batch",
                method: "POST",
                functionName: "executeBatch"
            };
            this._isBatch = false;
            return this._makeRequest(request)
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
        this.initializeInstance = (config) => {
            if (!config) {
                config = this._internalConfig;
            }
            return new DynamicsWebApi(config);
        };
        this.utility = {
            /**
             * Searches for a collection name by provided entity name in a cached entity metadata.
             * The returned collection name can be null.
             *
             * @param {string} entityName - entity name
             * @returns {string} a collection name
             */
            getCollectionName: RequestClient_1.RequestClient.getCollectionName
        };
        if (!config) {
            config = this._internalConfig;
        }
        this.setConfig(config);
    }
}
exports.DynamicsWebApi = DynamicsWebApi;
