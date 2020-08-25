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
        this.create = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.create", "request");
            let internalRequest;
            if (!request.functionName) {
                internalRequest = Utility_1.Utility.copyObject(request);
                internalRequest.functionName = "create";
            }
            else
                internalRequest = request;
            internalRequest.method = "POST";
            return this._makeRequest(internalRequest)
                .then(function (response) {
                return response.data;
            });
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
        this.retrieve = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, 'DynamicsWebApi.retrieve', 'request');
            let internalRequest;
            if (!request.functionName) {
                internalRequest = Utility_1.Utility.copyObject(request);
                internalRequest.functionName = "retrieve";
            }
            else
                internalRequest = request;
            internalRequest.method = "GET";
            internalRequest.responseParameters = {
                isRef: internalRequest.select != null && internalRequest.select.length === 1 && internalRequest.select[0].endsWith("/$ref")
            };
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to update a record.
         *
         * @param {DWARequest} request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.update = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.update", "request");
            let internalRequest;
            if (!request.functionName) {
                internalRequest = Utility_1.Utility.copyObject(request);
                internalRequest.functionName = "update";
            }
            else
                internalRequest = request;
            //Metadata definitions, cannot be updated using "PATCH" method
            if (!internalRequest.method)
                internalRequest.method = /EntityDefinitions|RelationshipDefinitions|GlobalOptionSetDefinitions/.test(internalRequest.collection)
                    ? "PUT" : "PATCH";
            internalRequest.responseParameters = { valueIfEmpty: true };
            if (internalRequest.ifmatch == null) {
                internalRequest.ifmatch = "*"; //to prevent upsert
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
         * Sends an asynchronous request to update a single value in the record.
         *
         * @param {string} key - A String representing the GUID value or Alternate Key for the record to update.
         * @param {string} collection - The name of the Entity Collection or Entity Logical name.
         * @param {Object} keyValuePair - keyValuePair object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"}
         * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
         * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
         * @returns {Promise} D365 Web Api result
         */
        this.updateSingleProperty = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateSingleProperty", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.fieldValuePair, "DynamicsWebApi.updateSingleProperty", "request.fieldValuePair");
            var field = Object.keys(request.fieldValuePair)[0];
            var fieldValue = request.fieldValuePair[field];
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.navigationProperty = field;
            internalRequest.data = { value: fieldValue };
            internalRequest.functionName = "updateSingleProperty";
            internalRequest.method = "PUT";
            delete internalRequest["fieldValuePair"];
            return this._makeRequest(internalRequest)
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
        this.deleteRecord = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, 'DynamicsWebApi.deleteRecord', 'request');
            let internalRequest;
            if (!request.functionName) {
                internalRequest = Utility_1.Utility.copyObject(request);
                internalRequest.functionName = "deleteRecord";
            }
            else
                internalRequest = request;
            internalRequest.method = "DELETE";
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
         * Sends an asynchronous request to upsert a record.
         *
         * @param {DWARequest} request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.upsert = (request) => {
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
         * Sends an asynchronous request to retrieve records.
         *
         * @param request - An object that represents all possible options for a current request.
         * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
         * @returns {Promise} D365 Web Api result
         */
        this.retrieveMultiple = (request, nextPageLink) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveMultiple", "request");
            let internalRequest;
            if (!request.functionName) {
                internalRequest = Utility_1.Utility.copyObject(request);
                internalRequest.functionName = "retrieveMultiple";
            }
            else
                internalRequest = request;
            internalRequest.method = "GET";
            if (nextPageLink) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(nextPageLink, "DynamicsWebApi.retrieveMultiple", "nextPageLink");
                internalRequest.url = nextPageLink;
            }
            return this._makeRequest(internalRequest)
                .then(function (response) {
                return response.data;
            });
        };
        this._retrieveAllRequest = (request, nextPageLink, records = []) => {
            return this.retrieveMultiple(request, nextPageLink).then(response => {
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
        this.retrieveAll = (request) => {
            ErrorHelper_1.ErrorHelper.batchIncompatible('DynamicsWebApi.retrieveAll', this._isBatch);
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
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.executeUnboundAction = (request) => {
            return this._executeAction(request, true);
        };
        /**
         * Executes a bound Web API action (bound to a particular entity record)
         *
         * @param request - An object that represents all possible options for a current request.
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
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.createEntity = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, `DynamicsWebApi.createEntity`, "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, 'DynamicsWebApi.createEntity', "request.data");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.functionName = "createEntity";
            return this.create(internalRequest);
        };
        /**
         * Sends an asynchronous request to update an entity definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.updateEntity = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateEntity", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateEntity", "request.data");
            ErrorHelper_1.ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateEntity", "request.data.MetadataId");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.key = internalRequest.data.MetadataId;
            internalRequest.functionName = "updateEntity";
            internalRequest.method = "PUT";
            return this.update(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve a specific entity definition.
         *
         * @param request - An object that represents all possible options for a current request.
        * @returns {Promise} D365 Web Api result
         */
        this.retrieveEntity = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveEntity", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.retrieveEntity", "request.key");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.functionName = "retrieveEntity";
            return this.retrieve(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve entity definitions.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.retrieveEntities = (request) => {
            let internalRequest = !request
                ? {}
                : Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.functionName = "retrieveEntities";
            return this.retrieveMultiple(internalRequest);
        };
        /**
         * Sends an asynchronous request to create an attribute.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.createAttribute = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.createAttribute", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createAttribute", "request.data");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.createAttribute", "request.entityKey");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.functionName = "retrieveEntity";
            internalRequest.navigationProperty = "Attributes";
            internalRequest.key = request.entityKey;
            return this.create(internalRequest);
        };
        /**
         * Sends an asynchronous request to update an attribute.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.updateAttribute = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateAttribute", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateAttribute", "request.data");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.updateAttribute", "request.entityKey");
            ErrorHelper_1.ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateAttribute", "request.data.MetadataId");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateAttribute", "request.castType");
            }
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.navigationProperty = "Attributes";
            internalRequest.navigationPropertyKey = request.data.MetadataId;
            internalRequest.metadataAttributeType = request.castType;
            internalRequest.key = request.entityKey;
            internalRequest.functionName = "updateAttribute";
            internalRequest.method = "PUT";
            return this.update(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve attribute metadata for a specified entity definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.retrieveAttributes = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveAttributes", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.retrieveAttributes", "request.entityKey");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveAttributes", "request.castType");
            }
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.navigationProperty = "Attributes";
            internalRequest.metadataAttributeType = request.castType;
            internalRequest.key = request.entityKey;
            internalRequest.functionName = "retrieveAttributes";
            return this.retrieveMultiple(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve a specific attribute metadata for a specified entity definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.retrieveAttribute = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveAttributes", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.retrieveAttribute", "request.entityKey");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.attributeKey, "DynamicsWebApi.retrieveAttribute", "request.attributeKey");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveAttribute", "request.castType");
            }
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.navigationProperty = "Attributes";
            internalRequest.navigationPropertyKey = request.attributeKey;
            internalRequest.metadataAttributeType = request.castType;
            internalRequest.key = request.entityKey;
            internalRequest.functionName = "retrieveAttribute";
            return this.retrieve(internalRequest);
        };
        /**
         * Sends an asynchronous request to create a relationship definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.createRelationship = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.createRelationship", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createRelationship", "request.data");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "RelationshipDefinitions";
            internalRequest.functionName = "createRelationship";
            return this.create(internalRequest);
        };
        /**
         * Sends an asynchronous request to update a relationship definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.updateRelationship = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateRelationship", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateRelationship", "request.data");
            ErrorHelper_1.ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateRelationship", "request.data.MetadataId");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateRelationship", "request.castType");
            }
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "RelationshipDefinitions";
            internalRequest.key = request.data.MetadataId;
            internalRequest.navigationProperty = request.castType;
            internalRequest.functionName = "updateRelationship";
            internalRequest.method = "PUT";
            return this.update(internalRequest);
        };
        /**
         * Sends an asynchronous request to delete a relationship definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.deleteRelationship = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteRelationship", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.deleteRelationship", "request.key");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "RelationshipDefinitions";
            internalRequest.functionName = "deleteRelationship";
            return this.deleteRecord(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve relationship definitions.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.retrieveRelationships = (request) => {
            let internalRequest = !request
                ? {}
                : Utility_1.Utility.copyObject(request);
            internalRequest.collection = "RelationshipDefinitions";
            internalRequest.functionName = "retrieveRelationships";
            if (request) {
                if (request.castType) {
                    ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveRelationships", "request.castType");
                    internalRequest.navigationProperty = request.castType;
                }
            }
            return this.retrieveMultiple(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve a specific relationship definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.retrieveRelationship = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveRelationship", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.retrieveRelationship", "request.key");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveRelationship", "request.castType");
            }
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "RelationshipDefinitions";
            internalRequest.navigationProperty = request.castType;
            internalRequest.functionName = "retrieveRelationship";
            return this.retrieve(internalRequest);
        };
        /**
         * Sends an asynchronous request to create a Global Option Set definition
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.createGlobalOptionSet = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.createGlobalOptionSet", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createGlobalOptionSet", "request.data");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.functionName = "createGlobalOptionSet";
            return this.create(internalRequest);
        };
        /**
         * Sends an asynchronous request to update a Global Option Set.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.updateGlobalOptionSet = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateGlobalOptionSet", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateGlobalOptionSet", "request.data");
            ErrorHelper_1.ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateGlobalOptionSet", "request.data.MetadataId");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateGlobalOptionSet", "request.castType");
            }
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.key = request.data.MetadataId;
            internalRequest.functionName = "updateGlobalOptionSet";
            internalRequest.method = "PUT";
            return this.update(internalRequest);
        };
        /**
         * Sends an asynchronous request to delete a Global Option Set.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.deleteGlobalOptionSet = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteGlobalOptionSet", "request");
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.functionName = "deleteGlobalOptionSet";
            return this.deleteRecord(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve Global Option Set definitions.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.retrieveGlobalOptionSet = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveGlobalOptionSet", "request");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveGlobalOptionSet", "request.castType");
            }
            let internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.navigationProperty = request.castType;
            internalRequest.functionName = "retrieveGlobalOptionSet";
            return this.retrieve(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve Global Option Set definitions.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.retrieveGlobalOptionSets = (request) => {
            let internalRequest = !request
                ? {}
                : Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.functionName = "retrieveGlobalOptionSets";
            if (request && request.castType) {
                internalRequest.navigationProperty = request.castType;
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveGlobalOptionSets", "request.castType");
            }
            return this.retrieveMultiple(internalRequest);
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
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api result
         */
        this.executeBatch = (request) => {
            ErrorHelper_1.ErrorHelper.batchNotStarted(this._isBatch);
            let internalRequest = !request
                ? {}
                : Utility_1.Utility.copyObject(request);
            internalRequest.collection = "$batch";
            internalRequest.method = "POST";
            internalRequest.functionName = "executeBatch";
            this._isBatch = false;
            return this._makeRequest(internalRequest)
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
