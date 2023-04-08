"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicsWebApi = void 0;
const Config_1 = require("./utils/Config");
const Utility_1 = require("./utils/Utility");
const ErrorHelper_1 = require("./helpers/ErrorHelper");
const RequestClient_1 = require("./client/RequestClient");
/**
 * Microsoft Dynamics CRM Web API helper library written in JavaScript.
 * It is compatible with: Dynamics 365 (online), Dynamics 365 (on-premise), Dynamics CRM 2016, Dynamics CRM Online.
 * @module dynamics-web-api
 */
class DynamicsWebApi {
    /**
     * Initializes a new instance of DynamicsWebApi
     * @param config - Configuration object
     */
    constructor(config) {
        this._config = Config_1.ConfigurationUtility.default();
        this._isBatch = false;
        this._batchRequestId = null;
        /**
         * Merges provided configuration properties with an existing one.
         *
         * @param {DynamicsWebApi.Config} config - Configuration
         * @example
           dynamicsWebApi.setConfig({ serverUrl: 'https://contoso.api.crm.dynamics.com/' });
         */
        this.setConfig = (config) => Config_1.ConfigurationUtility.merge(this._config, config);
        this._makeRequest = (request) => {
            request.isBatch = this._isBatch;
            request.requestId = this._batchRequestId;
            return new Promise((resolve, reject) => {
                RequestClient_1.RequestClient.makeRequest(request, this._config, resolve, reject);
            });
        };
        /**
         * Sends an asynchronous request to create a new record.
         *
         * @param {DWARequest} request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         * @example
         *const lead = {
         *    subject: "Test WebAPI",
         *    firstname: "Test",
         *    lastname: "WebAPI",
         *    jobtitle: "Title"
         *};
         *
         *const request = {
         *    data: lead,
         *    collection: "leads",
         *    returnRepresentation: true
         *}
         *
         *const response = await dynamicsWebApi.create(request);
         *
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
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to retrieve a record.
         *
         * @param {DWARequest} request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         * @example
         *const request = {
         *    key: '7d577253-3ef0-4a0a-bb7f-8335c2596e70',
         *    collection: "leads",
         *    select: ["fullname", "subject"],
         *    ifnonematch: 'W/"468026"',
         *    includeAnnotations: "OData.Community.Display.V1.FormattedValue"
         *};
         *
         *const response = await dynamicsWebApi.retrieve(request);
         */
        this.retrieve = (request) => {
            var _a;
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieve", "request");
            let internalRequest;
            if (!request.functionName) {
                internalRequest = Utility_1.Utility.copyObject(request);
                internalRequest.functionName = "retrieve";
            }
            else
                internalRequest = request;
            internalRequest.method = "GET";
            internalRequest.responseParameters = {
                isRef: ((_a = internalRequest.select) === null || _a === void 0 ? void 0 : _a.length) === 1 && internalRequest.select[0].endsWith("/$ref"),
            };
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to update a record.
         *
         * @param {DWARequest} request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
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
                internalRequest.method = /EntityDefinitions|RelationshipDefinitions|GlobalOptionSetDefinitions/.test(internalRequest.collection || "")
                    ? "PUT"
                    : "PATCH";
            internalRequest.responseParameters = { valueIfEmpty: true };
            if (internalRequest.ifmatch == null) {
                internalRequest.ifmatch = "*"; //to prevent upsert
            }
            //copy locally
            const ifmatch = internalRequest.ifmatch;
            return this._makeRequest(internalRequest)
                .then(function (response) {
                return response.data;
            })
                .catch(function (error) {
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
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.updateSingleProperty = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateSingleProperty", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.fieldValuePair, "DynamicsWebApi.updateSingleProperty", "request.fieldValuePair");
            var field = Object.keys(request.fieldValuePair)[0];
            var fieldValue = request.fieldValuePair[field];
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.navigationProperty = field;
            internalRequest.data = { value: fieldValue };
            internalRequest.functionName = "updateSingleProperty";
            internalRequest.method = "PUT";
            delete internalRequest["fieldValuePair"];
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to delete a record.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.deleteRecord = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteRecord", "request");
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
            const ifmatch = internalRequest.ifmatch;
            return this._makeRequest(internalRequest)
                .then(function (response) {
                return response.data;
            })
                .catch(function (error) {
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
         * @returns {Promise} D365 Web Api Response
         */
        this.upsert = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.upsert", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "PATCH";
            internalRequest.functionName = "upsert";
            //copy locally
            const ifnonematch = internalRequest.ifnonematch;
            const ifmatch = internalRequest.ifmatch;
            return this._makeRequest(internalRequest)
                .then(function (response) {
                return response.data;
            })
                .catch(function (error) {
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
        this._uploadFileChunk = (request, fileBytes, chunkSize, offset = 0) => {
            // offset = offset || 0;
            Utility_1.Utility.setFileChunk(request, fileBytes, chunkSize, offset);
            return this._makeRequest(request).then(() => {
                offset += chunkSize;
                if (offset <= fileBytes.length) {
                    return this._uploadFileChunk(request, fileBytes, chunkSize, offset);
                }
                return;
            });
        };
        /**
         * Upload file to a File Attribute
         *
         * @param request - An object that represents all possible options for a current request.
         */
        this.uploadFile = (request) => {
            ErrorHelper_1.ErrorHelper.throwBatchIncompatible("DynamicsWebApi.uploadFile", this._isBatch);
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.uploadFile", "request");
            const internalRequest = Utility_1.Utility.copyObject(request, ["data"]);
            internalRequest.method = "PATCH";
            internalRequest.functionName = "uploadFile";
            internalRequest.transferMode = "chunked";
            return this._makeRequest(internalRequest).then((response) => {
                internalRequest.url = response.data.location;
                delete internalRequest.transferMode;
                delete internalRequest.fieldName;
                delete internalRequest.fileName;
                return this._uploadFileChunk(internalRequest, request.data, response.data.chunkSize);
            });
        };
        this._downloadFileChunk = (request, bytesDownloaded = 0, 
        // fileSize: number = 0,
        data = "") => {
            // bytesDownloaded = bytesDownloaded || 0;
            // fileSize = fileSize || 0;
            // data = data || "";
            request.range = "bytes=" + bytesDownloaded + "-" + (bytesDownloaded + Utility_1.Utility.downloadChunkSize - 1);
            request.downloadSize = "full";
            return this._makeRequest(request).then((response) => {
                request.url = response.data.location;
                data += response.data.value;
                bytesDownloaded += Utility_1.Utility.downloadChunkSize;
                if (bytesDownloaded <= response.data.fileSize) {
                    return this._downloadFileChunk(request, bytesDownloaded, data);
                }
                return {
                    fileName: response.data.fileName,
                    fileSize: response.data.fileSize,
                    data: Utility_1.Utility.convertToFileBuffer(data),
                };
            });
        };
        /**
         * Download a file from a File Attribute
         * @param request - An object that represents all possible options for a current request.
         */
        this.downloadFile = (request) => {
            ErrorHelper_1.ErrorHelper.throwBatchIncompatible("DynamicsWebApi.downloadFile", this._isBatch);
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.downloadFile", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "GET";
            internalRequest.functionName = "downloadFile";
            internalRequest.responseParameters = { parse: true };
            return this._downloadFileChunk(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve records.
         *
         * @param request - An object that represents all possible options for a current request.
         * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
         * @returns {Promise} D365 Web Api Response
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
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        this._retrieveAllRequest = (request, nextPageLink, records = []) => {
            return this.retrieveMultiple(request, nextPageLink).then((response) => {
                records = records.concat(response.value);
                const pageLink = response.oDataNextLink;
                if (pageLink) {
                    return this._retrieveAllRequest(request, pageLink, records);
                }
                const result = { value: records };
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
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveAll = (request) => {
            ErrorHelper_1.ErrorHelper.throwBatchIncompatible("DynamicsWebApi.retrieveAll", this._isBatch);
            return this._retrieveAllRequest(request);
        };
        /**
         * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.count = (request) => {
            var _a;
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.count", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "GET";
            internalRequest.functionName = "count";
            if ((_a = internalRequest.filter) === null || _a === void 0 ? void 0 : _a.length) {
                internalRequest.count = true;
            }
            else {
                internalRequest.navigationProperty = "$count";
            }
            internalRequest.responseParameters = { toCount: internalRequest.count };
            //if filter has not been specified then simplify the request
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to count records. Returns: Number
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.countAll = (request) => {
            ErrorHelper_1.ErrorHelper.throwBatchIncompatible("DynamicsWebApi.countAll", this._isBatch);
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.countAll", "request");
            return this._retrieveAllRequest(request).then(function (response) {
                return response ? (response.value ? response.value.length : 0) : 0;
            });
        };
        /**
         * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.fetch = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.fetch", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "GET";
            internalRequest.functionName = "fetch";
            ErrorHelper_1.ErrorHelper.stringParameterCheck(internalRequest.fetchXml, "DynamicsWebApi.fetch", "request.fetchXml");
            //only add paging if there is no top
            if (internalRequest.fetchXml && !/^<fetch.+top=/.test(internalRequest.fetchXml)) {
                let replacementString = "";
                if (!/^<fetch.+page=/.test(internalRequest.fetchXml)) {
                    internalRequest.pageNumber = internalRequest.pageNumber || 1;
                    ErrorHelper_1.ErrorHelper.numberParameterCheck(internalRequest.pageNumber, "DynamicsWebApi.fetch", "request.pageNumber");
                    replacementString = `$1 page="${internalRequest.pageNumber}"`;
                }
                if (internalRequest.pagingCookie != null) {
                    ErrorHelper_1.ErrorHelper.stringParameterCheck(internalRequest.pagingCookie, "DynamicsWebApi.fetch", "request.pagingCookie");
                    replacementString += ` paging-cookie="${internalRequest.pagingCookie}"`;
                }
                //add page number and paging cookie to fetch xml
                if (replacementString)
                    internalRequest.fetchXml = internalRequest.fetchXml.replace(/^(<fetch)/, replacementString);
            }
            internalRequest.responseParameters = { pageNumber: internalRequest.pageNumber };
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to execute FetchXml to retrieve all records.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.fetchAll = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.fetchAll", "request");
            const _executeFetchXmlAll = (request, records = []) => {
                // records = records || [];
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
            ErrorHelper_1.ErrorHelper.throwBatchIncompatible("DynamicsWebApi.fetchAll", this._isBatch);
            return _executeFetchXmlAll(request);
        };
        /**
         * Associate for a collection-valued navigation property. (1:N or N:N)
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.associate = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.associate", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "POST";
            internalRequest.functionName = "associate";
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.relatedCollection, "DynamicsWebApi.associate", "request.relatedcollection");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.relationshipName, "DynamicsWebApi.associate", "request.relationshipName");
            const primaryKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.associate", "request.primaryKey");
            const relatedKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.associate", "request.relatedKey");
            internalRequest.navigationProperty = request.relationshipName + "/$ref";
            internalRequest.key = primaryKey;
            internalRequest.data = { "@odata.id": `${request.relatedCollection}(${relatedKey})` };
            return this._makeRequest(internalRequest).then(() => {
                return;
            });
        };
        /**
         * Disassociate for a collection-valued navigation property.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.disassociate = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.disassociate", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "DELETE";
            internalRequest.functionName = "disassociate";
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.relationshipName, "DynamicsWebApi.disassociate", "request.relationshipName");
            const primaryKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.disassociate", "request.primaryKey");
            const relatedKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.disassociate", "request.relatedId");
            internalRequest.key = primaryKey;
            internalRequest.navigationProperty = `${request.relationshipName}(${relatedKey})/$ref`;
            return this._makeRequest(internalRequest).then(() => {
                return;
            });
        };
        /**
         * Associate for a single-valued navigation property. (1:N)
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.associateSingleValued = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.associateSingleValued", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "PUT";
            internalRequest.functionName = "associateSingleValued";
            const primaryKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.associateSingleValued", "request.primaryKey");
            const relatedKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.associateSingleValued", "request.relatedKey");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.navigationProperty, "DynamicsWebApi.associateSingleValued", "request.navigationProperty");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.relatedCollection, "DynamicsWebApi.associateSingleValued", "request.relatedcollection");
            internalRequest.navigationProperty += "/$ref";
            internalRequest.key = primaryKey;
            internalRequest.data = { "@odata.id": `${request.relatedCollection}(${relatedKey})` };
            return this._makeRequest(internalRequest).then(() => {
                return;
            });
        };
        /**
         * Removes a reference to an entity for a single-valued navigation property. (1:N)
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.disassociateSingleValued = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.disassociateSingleValued", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.method = "DELETE";
            internalRequest.functionName = "disassociateSingleValued";
            const primaryKey = ErrorHelper_1.ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.disassociateSingleValued", "request.primaryKey");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.navigationProperty, "DynamicsWebApi.disassociateSingleValued", "request.navigationProperty");
            internalRequest.navigationProperty += "/$ref";
            internalRequest.key = primaryKey;
            return this._makeRequest(internalRequest).then(() => {
                return;
            });
        };
        /**
         * Calls a Web API function
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.callFunction = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, `DynamicsWebApi.callFunction`, "request");
            const isObject = Utility_1.Utility.isObject(request);
            const parameterName = isObject ? "request.functionName" : "name";
            const internalRequest = isObject ? Utility_1.Utility.copyObject(request) : { functionName: request };
            ErrorHelper_1.ErrorHelper.stringParameterCheck(internalRequest.functionName, `DynamicsWebApi.callFunction`, parameterName);
            internalRequest.method = "GET";
            internalRequest._additionalUrl = internalRequest.functionName + Utility_1.Utility.buildFunctionParameters(internalRequest.parameters);
            internalRequest._isUnboundRequest = !internalRequest.collection;
            internalRequest.functionName = "callFunction";
            return this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
        };
        /**
         * Calls a Web API action
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.callAction = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, `DynamicsWebApi.callAction`, "request");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(request.actionName, `DynamicsWebApi.callAction`, "request.actionName");
            const internalRequest = Utility_1.Utility.copyObject(request, ["action"]);
            internalRequest.method = "POST";
            internalRequest.functionName = "callAction";
            internalRequest._additionalUrl = request.actionName;
            internalRequest._isUnboundRequest = !internalRequest.collection;
            internalRequest.data = request.action;
            return this._makeRequest(internalRequest).then((response) => {
                return response.data;
            });
        };
        /**
         * Sends an asynchronous request to create an entity definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.createEntity = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, `DynamicsWebApi.createEntity`, "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createEntity", "request.data");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.functionName = "createEntity";
            return this.create(internalRequest);
        };
        /**
         * Sends an asynchronous request to update an entity definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.updateEntity = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateEntity", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateEntity", "request.data");
            ErrorHelper_1.ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateEntity", "request.data.MetadataId");
            const internalRequest = Utility_1.Utility.copyObject(request);
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
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveEntity = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveEntity", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.retrieveEntity", "request.key");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.functionName = "retrieveEntity";
            return this.retrieve(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve entity definitions.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveEntities = (request) => {
            const internalRequest = !request ? {} : Utility_1.Utility.copyObject(request);
            internalRequest.collection = "EntityDefinitions";
            internalRequest.functionName = "retrieveEntities";
            return this.retrieveMultiple(internalRequest);
        };
        /**
         * Sends an asynchronous request to create an attribute.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.createAttribute = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.createAttribute", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createAttribute", "request.data");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.createAttribute", "request.entityKey");
            const internalRequest = Utility_1.Utility.copyObject(request);
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
         * @returns {Promise} D365 Web Api Response
         */
        this.updateAttribute = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateAttribute", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateAttribute", "request.data");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.updateAttribute", "request.entityKey");
            ErrorHelper_1.ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateAttribute", "request.data.MetadataId");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateAttribute", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
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
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveAttributes = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveAttributes", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.retrieveAttributes", "request.entityKey");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveAttributes", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
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
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveAttribute = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveAttributes", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.retrieveAttribute", "request.entityKey");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.attributeKey, "DynamicsWebApi.retrieveAttribute", "request.attributeKey");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveAttribute", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
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
         * @returns {Promise} D365 Web Api Response
         */
        this.createRelationship = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.createRelationship", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createRelationship", "request.data");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "RelationshipDefinitions";
            internalRequest.functionName = "createRelationship";
            return this.create(internalRequest);
        };
        /**
         * Sends an asynchronous request to update a relationship definition.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.updateRelationship = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateRelationship", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateRelationship", "request.data");
            ErrorHelper_1.ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateRelationship", "request.data.MetadataId");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateRelationship", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
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
         * @returns {Promise} D365 Web Api Response
         */
        this.deleteRelationship = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteRelationship", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.deleteRelationship", "request.key");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "RelationshipDefinitions";
            internalRequest.functionName = "deleteRelationship";
            return this.deleteRecord(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve relationship definitions.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveRelationships = (request) => {
            const internalRequest = !request ? {} : Utility_1.Utility.copyObject(request);
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
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveRelationship = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveRelationship", "request");
            ErrorHelper_1.ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.retrieveRelationship", "request.key");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveRelationship", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "RelationshipDefinitions";
            internalRequest.navigationProperty = request.castType;
            internalRequest.functionName = "retrieveRelationship";
            return this.retrieve(internalRequest);
        };
        /**
         * Sends an asynchronous request to create a Global Option Set definition
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.createGlobalOptionSet = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.createGlobalOptionSet", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createGlobalOptionSet", "request.data");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.functionName = "createGlobalOptionSet";
            return this.create(internalRequest);
        };
        /**
         * Sends an asynchronous request to update a Global Option Set.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.updateGlobalOptionSet = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateGlobalOptionSet", "request");
            ErrorHelper_1.ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateGlobalOptionSet", "request.data");
            ErrorHelper_1.ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateGlobalOptionSet", "request.data.MetadataId");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateGlobalOptionSet", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
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
         * @returns {Promise} D365 Web Api Response
         */
        this.deleteGlobalOptionSet = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteGlobalOptionSet", "request");
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.functionName = "deleteGlobalOptionSet";
            return this.deleteRecord(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve Global Option Set definitions.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveGlobalOptionSet = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveGlobalOptionSet", "request");
            if (request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveGlobalOptionSet", "request.castType");
            }
            const internalRequest = Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.navigationProperty = request.castType;
            internalRequest.functionName = "retrieveGlobalOptionSet";
            return this.retrieve(internalRequest);
        };
        /**
         * Sends an asynchronous request to retrieve Global Option Set definitions.
         *
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.retrieveGlobalOptionSets = (request) => {
            const internalRequest = !request ? {} : Utility_1.Utility.copyObject(request);
            internalRequest.collection = "GlobalOptionSetDefinitions";
            internalRequest.functionName = "retrieveGlobalOptionSets";
            if (request === null || request === void 0 ? void 0 : request.castType) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveGlobalOptionSets", "request.castType");
                internalRequest.navigationProperty = request.castType;
            }
            return this.retrieveMultiple(internalRequest);
        };
        /**
         * Retrieves CSDL Document Metadata
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise<string>} Unformatted and unparsed CSDL $metadata document.
         */
        this.retrieveCsdlMetadata = (request) => {
            const internalRequest = !request ? {} : Utility_1.Utility.copyObject(request);
            internalRequest.collection = "$metadata";
            internalRequest.functionName = "retrieveCsdlMetadata";
            if (request === null || request === void 0 ? void 0 : request.addAnnotations) {
                ErrorHelper_1.ErrorHelper.boolParameterCheck(request.addAnnotations, "DynamicsWebApi.retrieveCsdlMetadata", "request.addAnnotations");
                internalRequest.includeAnnotations = "*";
            }
            return this._makeRequest(internalRequest).then((response) => {
                return response.data;
            });
        };
        /**
         * Provides a search results page.
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise<SearchResponse<TValue>>} Search result
         */
        this.search = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.search", "request");
            const isObject = Utility_1.Utility.isObject(request);
            const parameterName = isObject ? "request.query.search" : "term";
            const internalRequest = isObject ? Utility_1.Utility.copyObject(request) : { query: { search: request } };
            ErrorHelper_1.ErrorHelper.parameterCheck(internalRequest.query, "DynamicsWebApi.search", "request.query");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(internalRequest.query.search, "DynamicsWebApi.search", parameterName);
            ErrorHelper_1.ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, "DynamicsWebApi.search", parameterName, 100);
            internalRequest.collection = "query";
            internalRequest.functionName = "search";
            internalRequest.method = "POST";
            internalRequest.data = internalRequest.query;
            internalRequest.apiConfig = this._config.searchApi;
            delete internalRequest.query;
            return this._makeRequest(internalRequest).then((response) => {
                return response.data;
            });
        };
        /**
         * Provides suggestions as the user enters text into a form field.
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise<SuggestResponse<TValueDocument>>} Suggestions result
         */
        this.suggest = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.suggest", "request");
            const isObject = Utility_1.Utility.isObject(request);
            const parameterName = isObject ? "request.query.search" : "term";
            const internalRequest = isObject ? Utility_1.Utility.copyObject(request) : { query: { search: request } };
            ErrorHelper_1.ErrorHelper.parameterCheck(internalRequest.query, "DynamicsWebApi.suggest", "request.query");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(internalRequest.query.search, "DynamicsWebApi.suggest", parameterName);
            ErrorHelper_1.ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, "DynamicsWebApi.suggest", parameterName, 100);
            internalRequest.functionName = internalRequest.collection = "suggest";
            internalRequest.method = "POST";
            internalRequest.data = internalRequest.query;
            internalRequest.apiConfig = this._config.searchApi;
            delete internalRequest.query;
            return this._makeRequest(internalRequest).then((response) => {
                return response.data;
            });
        };
        /**
         * Provides autocompletion of input as the user enters text into a form field.
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise<AutocompleteResponse>} Result of autocomplete
         */
        this.autocomplete = (request) => {
            ErrorHelper_1.ErrorHelper.parameterCheck(request, "DynamicsWebApi.autocomplete", "request");
            const isObject = Utility_1.Utility.isObject(request);
            const parameterName = isObject ? "request.query.search" : "term";
            const internalRequest = isObject ? Utility_1.Utility.copyObject(request) : { query: { search: request } };
            if (isObject)
                ErrorHelper_1.ErrorHelper.parameterCheck(internalRequest.query, "DynamicsWebApi.autocomplete", "request.query");
            ErrorHelper_1.ErrorHelper.stringParameterCheck(internalRequest.query.search, `DynamicsWebApi.autocomplete`, parameterName);
            ErrorHelper_1.ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, "DynamicsWebApi.autocomplete", parameterName, 100);
            internalRequest.functionName = internalRequest.collection = "autocomplete";
            internalRequest.method = "POST";
            internalRequest.data = internalRequest.query;
            internalRequest.apiConfig = this._config.searchApi;
            delete internalRequest.query;
            return this._makeRequest(internalRequest).then((response) => {
                return response.data;
            });
        };
        /**
         * Starts/executes a batch request.
         */
        this.startBatch = () => {
            this._isBatch = true;
            this._batchRequestId = Utility_1.Utility.generateUUID();
        };
        /**
         * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
         * @param request - An object that represents all possible options for a current request.
         * @returns {Promise} D365 Web Api Response
         */
        this.executeBatch = (request) => {
            ErrorHelper_1.ErrorHelper.throwBatchNotStarted(this._isBatch);
            const internalRequest = !request ? {} : Utility_1.Utility.copyObject(request);
            internalRequest.collection = "$batch";
            internalRequest.method = "POST";
            internalRequest.functionName = "executeBatch";
            this._isBatch = false;
            const promise = this._makeRequest(internalRequest).then(function (response) {
                return response.data;
            });
            this._batchRequestId = null;
            return promise;
        };
        /**
         * Creates a new instance of DynamicsWebApi. If the config is not provided, it is copied from the current instance.
         *
         * @param config - configuration object.
         * @returns {DynamicsWebApi} The new instance of a DynamicsWebApi
         */
        this.initializeInstance = (config) => new DynamicsWebApi(config || this._config);
        this.Utility = {
            /**
             * Searches for a collection name by provided entity name in a cached entity metadata.
             * The returned collection name can be null.
             *
             * @param {string} entityName - entity name
             * @returns {string} a collection name
             */
            getCollectionName: (entityName) => RequestClient_1.RequestClient.getCollectionName(entityName),
        };
        Config_1.ConfigurationUtility.merge(this._config, config);
    }
}
exports.DynamicsWebApi = DynamicsWebApi;
//# sourceMappingURL=dynamics-web-api.js.map