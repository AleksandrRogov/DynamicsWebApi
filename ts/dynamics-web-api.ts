//"use strict";

import { Utility } from "./utilities/Utility";
import { ErrorHelper } from "./helpers/ErrorHelper";
import { RequestClient } from "./requests/RequestClient";
import { Core } from "./types";

/**
 * Microsoft Dynamics CRM Web API helper library written in JavaScript.
 * It is compatible with: Dynamics 365 (online), Dynamics 365 (on-premise), Dynamics CRM 2016, Dynamics CRM Online.
 * @module dynamics-web-api
 */
export class DynamicsWebApi {
	private _internalConfig: DynamicsWebApi.Config = {
		webApiVersion: "9.1",
		webApiUrl: null,
		impersonate: null,
		onTokenRefresh: null,
		includeAnnotations: null,
		maxPageSize: null,
		returnRepresentation: null
	};

	private _isBatch = false;

	constructor(config?: DynamicsWebApi.Config) {
		if (!config) {
			config = this._internalConfig;
		}

		this.setConfig(config);
	}

	/**
	 * Sets the configuration parameters for DynamicsWebApi helper.
	 *
	 * @param {DWAConfig} config - configuration object
	 * @example
	   dynamicsWebApi.setConfig({ webApiVersion: '9.0' });
	 */
	setConfig = (config: DynamicsWebApi.Config): void => {

		var isVersionDiffer = (config.webApiVersion || this._internalConfig.webApiVersion) !== this._internalConfig.webApiVersion;

		if (config.webApiVersion) {
			ErrorHelper.stringParameterCheck(config.webApiVersion, "DynamicsWebApi.setConfig", "config.webApiVersion");
			this._internalConfig.webApiVersion = config.webApiVersion;
		}

		if (config.webApiUrl) {
			ErrorHelper.stringParameterCheck(config.webApiUrl, "DynamicsWebApi.setConfig", "config.webApiUrl");
			this._internalConfig.webApiUrl = config.webApiUrl;
		} else {
			if (!this._internalConfig.webApiUrl || isVersionDiffer) {
				this._internalConfig.webApiUrl = Utility.initWebApiUrl(this._internalConfig.webApiVersion);
			}
		}

		if (config.impersonate) {
			this._internalConfig.impersonate = ErrorHelper.guidParameterCheck(config.impersonate, "DynamicsWebApi.setConfig", "config.impersonate");
		}

		if (config.onTokenRefresh) {
			ErrorHelper.callbackParameterCheck(config.onTokenRefresh, "DynamicsWebApi.setConfig", "config.onTokenRefresh");
			this._internalConfig.onTokenRefresh = config.onTokenRefresh;
		}

		if (config.includeAnnotations) {
			ErrorHelper.stringParameterCheck(config.includeAnnotations, "DynamicsWebApi.setConfig", "config.includeAnnotations");
			this._internalConfig.includeAnnotations = config.includeAnnotations;
		}

		if (config.timeout) {
			ErrorHelper.numberParameterCheck(config.timeout, "DynamicsWebApi.setConfig", "config.timeout");
			this._internalConfig.timeout = config.timeout;
		}

		if (config.maxPageSize) {
			ErrorHelper.numberParameterCheck(config.maxPageSize, "DynamicsWebApi.setConfig", "config.maxPageSize");
			this._internalConfig.maxPageSize = config.maxPageSize;
		}

		if (config.returnRepresentation) {
			ErrorHelper.boolParameterCheck(config.returnRepresentation, "DynamicsWebApi.setConfig", "config.returnRepresentation");
			this._internalConfig.returnRepresentation = config.returnRepresentation;
		}

		if (config.useEntityNames) {
			ErrorHelper.boolParameterCheck(config.useEntityNames, 'DynamicsWebApi.setConfig', 'config.useEntityNames');
			this._internalConfig.useEntityNames = config.useEntityNames;
		}
	};

	private _makeRequest = (request: Core.InternalRequest): Promise<any> => {
		request.isBatch = this._isBatch;
		return new Promise((resolve, reject) => {
			RequestClient.makeRequest(request, this._internalConfig, resolve, reject);
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
	create = <T = any>(request: DynamicsWebApi.CreateRequest): Promise<T> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.create", "request");

		let internalRequest: Core.InternalRequest;

		if (!(<Core.InternalRequest>request).functionName) {
			internalRequest = Utility.copyObject<Core.InternalRequest>(request);
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
	retrieve = <T = any>(request: DynamicsWebApi.RetrieveRequest): Promise<T> => {
		ErrorHelper.parameterCheck(request, 'DynamicsWebApi.retrieve', 'request');

		let internalRequest: Core.InternalRequest;

		if (!(<Core.InternalRequest>request).functionName) {
			internalRequest = Utility.copyObject<Core.InternalRequest>(request);
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
	update = <T = any>(request: DynamicsWebApi.UpdateRequest): Promise<T> => {

		ErrorHelper.parameterCheck(request, "DynamicsWebApi.update", "request");

		let internalRequest: Core.InternalRequest;

		if (!(<Core.InternalRequest>request).functionName) {
			internalRequest = Utility.copyObject<Core.InternalRequest>(request);
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
	updateSingleProperty = <T = any>(key: string, collection: string, keyValuePair: Object, prefer?: string | string[], select?: string[]): Promise<T> => {

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

		var request: Core.InternalRequest = {
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
	deleteRecord = (request: DynamicsWebApi.DeleteRequest): Promise<any> => {
		ErrorHelper.parameterCheck(request, 'DynamicsWebApi.deleteRecord', 'request');

		let internalRequest: Core.InternalRequest;

		if (!(<Core.InternalRequest>request).functionName) {
			internalRequest = Utility.copyObject<Core.InternalRequest>(request);
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
	upsert = <T = any>(request: DynamicsWebApi.UpsertRequest): Promise<T> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.upsert", "request");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
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
	retrieveMultiple = <T = any>(request: DynamicsWebApi.RetrieveMultipleRequest, nextPageLink?: string): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveMultiple", "request");

		let internalRequest: Core.InternalRequest;

		if (!(<Core.InternalRequest>request).functionName) {
			internalRequest = Utility.copyObject<Core.InternalRequest>(request);
			internalRequest.functionName = "retrieveMultiple";
		}
		else
			internalRequest = request;

		internalRequest.method = "GET";

		if (nextPageLink) {
			ErrorHelper.stringParameterCheck(nextPageLink, "DynamicsWebApi.retrieveMultiple", "nextPageLink");
			internalRequest.url = nextPageLink;
		}

		return this._makeRequest(internalRequest)
			.then(function (response) {
				return response.data;
			});
	};
	
	private _retrieveAllRequest = <T = any>(request: DynamicsWebApi.RetrieveMultipleRequest, nextPageLink?: string, records: any[] = []): Promise<DynamicsWebApi.AllResponse<T>> => {

		return this.retrieveMultiple(request, nextPageLink).then(response => {
			records = records.concat(response.value);

			let pageLink = response.oDataNextLink;

			if (pageLink) {
				return this._retrieveAllRequest(request, pageLink, records);
			}

			let result: DynamicsWebApi.AllResponse<T> = { value: records };

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
	retrieveAll = <T = any>(request: DynamicsWebApi.RetrieveMultipleRequest): Promise<DynamicsWebApi.AllResponse<T>> => {
		ErrorHelper.batchIncompatible('DynamicsWebApi.retrieveAll', this._isBatch);
		return this._retrieveAllRequest(request);
	};

	/**
	 * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	count = (request: DynamicsWebApi.CountRequest): Promise<number> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.count", "request");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
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
	countAll = (request: DynamicsWebApi.CountAllRequest): Promise<number> => {
		ErrorHelper.batchIncompatible('DynamicsWebApi.countAll', this._isBatch);
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.countAll", "request");

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
	fetch = <T = any>(request: DynamicsWebApi.FetchXmlRequest): Promise<DynamicsWebApi.FetchXmlResponse<T>> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.fetch", "request");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.method = "GET";
		internalRequest.functionName = "fetch";

		ErrorHelper.stringParameterCheck(internalRequest.fetchXml, "DynamicsWebApi.fetch", "request.fetchXml");

		internalRequest.pageNumber = internalRequest.pageNumber || 1;

		ErrorHelper.numberParameterCheck(internalRequest.pageNumber, "DynamicsWebApi.fetch", "request.pageNumber");
		let replacementString = `$1 page="${internalRequest.pageNumber}"`;

		if (internalRequest.pagingCookie != null) {
			ErrorHelper.stringParameterCheck(internalRequest.pagingCookie, "DynamicsWebApi.fetch", "request.pagingCookie");
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
	fetchAll = <T = any>(request: DynamicsWebApi.FetchAllRequest): Promise<DynamicsWebApi.FetchXmlResponse<T>> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.fetchAll", "request");

		let _executeFetchXmlAll = (request: DynamicsWebApi.FetchXmlRequest, records?: any[]): Promise<DynamicsWebApi.FetchXmlResponse<T>> => {
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
		}

		ErrorHelper.batchIncompatible('DynamicsWebApi.fetchAll', this._isBatch);
		return _executeFetchXmlAll(request);
	};

	/**
	 * Associate for a collection-valued navigation property. (1:N or N:N)
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	associate = (request: DynamicsWebApi.AssociateRequest): Promise<void> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.associate", "request");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.method = "POST";
		internalRequest.functionName = "associate";

		ErrorHelper.stringParameterCheck(request.relatedCollection, "DynamicsWebApi.associate", "request.relatedcollection");
		ErrorHelper.stringParameterCheck(request.relationshipName, "DynamicsWebApi.associate", "request.relationshipName");
		let primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.associate", "request.primaryKey");
		let relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.associate", "request.relatedKey");

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
	disassociate = (request: DynamicsWebApi.DisassociateRequest): Promise<void> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.disassociate", "request");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.method = "DELETE";
		internalRequest.functionName = "disassociate";

		ErrorHelper.stringParameterCheck(request.relationshipName, "DynamicsWebApi.disassociate", "request.relationshipName");
		let primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.disassociate", "request.primaryKey");
		let relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.disassociate", "request.relatedId");

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
	associateSingleValued = (request: DynamicsWebApi.AssociateSingleValuedRequest): Promise<void> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.associateSingleValued", "request");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.method = "PUT";
		internalRequest.functionName = "associateSingleValued";

		let primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.associateSingleValued", "request.primaryKey");
		let relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.associateSingleValued", "request.relatedKey");
		ErrorHelper.stringParameterCheck(request.navigationProperty, "DynamicsWebApi.associateSingleValued", "request.navigationProperty");
		ErrorHelper.stringParameterCheck(request.relatedCollection, "DynamicsWebApi.associateSingleValued", "request.relatedcollection");

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
	disassociateSingleValued = (request: DynamicsWebApi.DisassociateSingleValuedRequest): Promise<void> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.disassociateSingleValued", "request");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.method = "DELETE";
		internalRequest.functionName = "disassociateSingleValued";

		let primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.disassociateSingleValued", "request.primaryKey");
		ErrorHelper.stringParameterCheck(request.navigationProperty, "DynamicsWebApi.disassociateSingleValued", "request.navigationProperty");

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
	executeUnboundFunction = <T = any>(request: DynamicsWebApi.UnboundFunctionRequest): Promise<T> => {
		return this._executeFunction<T>(<DynamicsWebApi.BoundFunctionRequest>request, true);
	};

	/**
	 * Executes a bound function
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	executeBoundFunction = <T = any>(request: DynamicsWebApi.BoundFunctionRequest): Promise<T> => {
		return this._executeFunction<T>(request);
	};

	private _executeFunction = <T = any>(request: DynamicsWebApi.BoundFunctionRequest, isUnbound: boolean = false): Promise<T> => {
		const functionName = !isUnbound ? "executeBoundFunction" : "executeUnboundFunction";

		ErrorHelper.parameterCheck(request, `DynamicsWebApi.${functionName}`, "request");
		ErrorHelper.stringParameterCheck(request.functionName, `DynamicsWebApi.${functionName}`, "request.functionName");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.method = "GET";
		internalRequest.functionName = functionName;

		internalRequest._additionalUrl = request.functionName + Utility.buildFunctionParameters(request.parameters);
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
	executeUnboundAction = <T = any>(request: DynamicsWebApi.UnboundActionRequest): Promise<T> => {
		return this._executeAction<T>(<DynamicsWebApi.BoundActionRequest>request, true);
	};

	/**
	 * Executes a bound Web API action (bound to a particular entity record)
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise | Function} D365 Web Api result
	 */
	executeBoundAction = <T = any>(request: DynamicsWebApi.BoundActionRequest): Promise<T> => {
		return this._executeAction<T>(request);
	};

	private _executeAction = <T = any>(request: DynamicsWebApi.BoundActionRequest, isUnbound: boolean = false): Promise<T> => {
		const functionName = !isUnbound ? "executeBoundAction" : "executeUnboundAction";

		ErrorHelper.parameterCheck(request, `DynamicsWebApi.${functionName}`, "request");
		ErrorHelper.stringParameterCheck(request.actionName, `DynamicsWebApi.${functionName}`, "request.actionName");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
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
	createEntity = <T = any>(request: DynamicsWebApi.CreateEntityRequest): Promise<T> => {
		ErrorHelper.parameterCheck(request, `DynamicsWebApi.createEntity`, "request");
		ErrorHelper.parameterCheck(request.data, 'DynamicsWebApi.createEntity', "request.data");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "EntityDefinitions";
		internalRequest.functionName = "createEntity";

		return this.create(<DynamicsWebApi.CreateRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to update an entity definition.
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	updateEntity = <T = any>(request: DynamicsWebApi.UpdateEntityRequest): Promise<T> => {

		ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateEntity", "request");
		ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateEntity", "request.data");
		ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateEntity", "request.data.MetadataId");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "EntityDefinitions";
		internalRequest.key = internalRequest.data.MetadataId;
		internalRequest.functionName = "updateEntity";
		internalRequest.method = "PUT";

		return this.update(<DynamicsWebApi.UpdateRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to retrieve a specific entity definition.
	 *
	 * @param request - An object that represents all possible options for a current request.
	* @returns {Promise} D365 Web Api result
	 */
	retrieveEntity = <T = any>(request: DynamicsWebApi.RetrieveEntityRequest): Promise<T> => {

		ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveEntity", "request");
		ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.retrieveEntity", "request.key");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "EntityDefinitions";
		internalRequest.functionName = "retrieveEntity";

		return this.retrieve(<DynamicsWebApi.RetrieveRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to retrieve entity definitions.
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	retrieveEntities = <T = any>(request?: DynamicsWebApi.RetrieveEntitiesRequest): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>> => {
		let internalRequest: Core.InternalRequest = !request
			? {}
			: Utility.copyObject<Core.InternalRequest>(request);

		internalRequest.collection = "EntityDefinitions";
		internalRequest.functionName = "retrieveEntities";

		return this.retrieveMultiple(<DynamicsWebApi.RetrieveMultipleRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to create an attribute.
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	createAttribute = <T = any>(request: DynamicsWebApi.CreateAttributeRequest): Promise<T> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.createAttribute", "request");
		ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createAttribute", "request.data");
		ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.createAttribute", "request.entityKey");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "EntityDefinitions";
		internalRequest.functionName = "retrieveEntity";
		internalRequest.navigationProperty = "Attributes";
		internalRequest.key = request.entityKey;

		return this.create(<DynamicsWebApi.CreateRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to update an attribute.
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	updateAttribute = <T = any>(request: DynamicsWebApi.UpdateAttributeRequest): Promise<T> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateAttribute", "request");
		ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateAttribute", "request.data");
		ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.updateAttribute", "request.entityKey");
		ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateAttribute", "request.data.MetadataId");

		if (request.castType) {
			ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateAttribute", "request.castType");
		}

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "EntityDefinitions";
		internalRequest.navigationProperty = "Attributes";
		internalRequest.navigationPropertyKey = request.data.MetadataId;
		internalRequest.metadataAttributeType = request.castType;
		internalRequest.key = request.entityKey;
		internalRequest.functionName = "updateAttribute";
		internalRequest.method = "PUT";

		return this.update(<DynamicsWebApi.UpdateRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to retrieve attribute metadata for a specified entity definition.
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	retrieveAttributes = <T = any>(request: DynamicsWebApi.RetrieveAttributesRequest): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>> => {

		ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveAttributes", "request");
		ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.retrieveAttributes", "request.entityKey");

		if (request.castType) {
			ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveAttributes", "request.castType");
		}

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "EntityDefinitions";
		internalRequest.navigationProperty = "Attributes";
		internalRequest.metadataAttributeType = request.castType;
		internalRequest.key = request.entityKey;
		internalRequest.functionName = "retrieveAttributes";

		return this.retrieveMultiple(<DynamicsWebApi.RetrieveMultipleRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to retrieve a specific attribute metadata for a specified entity definition.
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	retrieveAttribute = <T = any>(request: DynamicsWebApi.RetrieveAttributeRequest): Promise<T> => {

		ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveAttributes", "request");
		ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.retrieveAttribute", "request.entityKey");
		ErrorHelper.keyParameterCheck(request.attributeKey, "DynamicsWebApi.retrieveAttribute", "request.attributeKey");

		if (request.castType) {
			ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveAttribute", "request.castType");
		}

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "EntityDefinitions";
		internalRequest.navigationProperty = "Attributes";
		internalRequest.navigationPropertyKey = request.attributeKey;
		internalRequest.metadataAttributeType = request.castType;
		internalRequest.key = request.entityKey;
		internalRequest.functionName = "retrieveAttribute";

		return this.retrieve(<DynamicsWebApi.RetrieveRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to create a relationship definition.
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	createRelationship = <T = any>(request: DynamicsWebApi.CreateRelationshipRequest): Promise<T> => {

		ErrorHelper.parameterCheck(request, "DynamicsWebApi.createRelationship", "request");
		ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createRelationship", "request.data");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "RelationshipDefinitions";
		internalRequest.functionName = "createRelationship";

		return this.create(<DynamicsWebApi.CreateRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to update a relationship definition.
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	updateRelationship = <T = any>(request: DynamicsWebApi.UpdateRelationshipRequest): Promise<T> => {

		ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateRelationship", "request");
		ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateRelationship", "request.data");
		ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateRelationship", "request.data.MetadataId");

		if (request.castType) {
			ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateRelationship", "request.castType");
		}

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "RelationshipDefinitions";
		internalRequest.key = request.data.MetadataId;
		internalRequest.navigationProperty = request.castType;
		internalRequest.functionName = "updateRelationship";
		internalRequest.method = "PUT";

		return this.update(<DynamicsWebApi.UpdateRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to delete a relationship definition.
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	deleteRelationship = (request: DynamicsWebApi.DeleteRelationshipRequest): Promise<any> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteRelationship", "request");
		ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.deleteRelationship", "request.key");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "RelationshipDefinitions";
		internalRequest.functionName = "deleteRelationship";

		return this.deleteRecord(<DynamicsWebApi.DeleteRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to retrieve relationship definitions.
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	retrieveRelationships = <T = any>(request?: DynamicsWebApi.RetrieveRelationshipsRequest): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>> => {
		let internalRequest: Core.InternalRequest = !request
			? {}
			: Utility.copyObject<Core.InternalRequest>(request);

		internalRequest.collection = "RelationshipDefinitions";
		internalRequest.functionName = "retrieveRelationships";

		if (request) {
			if (request.castType) {
				ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveRelationships", "request.castType");
				internalRequest.navigationProperty = request.castType;
			}
		}

		return this.retrieveMultiple(<DynamicsWebApi.RetrieveMultipleRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to retrieve a specific relationship definition.
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	retrieveRelationship = <T = any>(request: DynamicsWebApi.RetrieveRelationshipRequest): Promise<T> => {

		ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveRelationship", "request");
		ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.retrieveRelationship", "request.key");

		if (request.castType) {
			ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveRelationship", "request.castType");
		}

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "RelationshipDefinitions";
		internalRequest.navigationProperty = request.castType;
		internalRequest.functionName = "retrieveRelationship";

		return this.retrieve(<DynamicsWebApi.RetrieveRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to create a Global Option Set definition
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	createGlobalOptionSet = <T = any>(request: DynamicsWebApi.CreateGlobalOptionSetRequest): Promise<T> => {

		ErrorHelper.parameterCheck(request, "DynamicsWebApi.createGlobalOptionSet", "request");
		ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createGlobalOptionSet", "request.data");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "GlobalOptionSetDefinitions";
		internalRequest.functionName = "createGlobalOptionSet";

		return this.create(<DynamicsWebApi.CreateRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to update a Global Option Set.
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	updateGlobalOptionSet = <T = any>(request: DynamicsWebApi.UpdateGlobalOptionSetRequest): Promise<T> => {

		ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateGlobalOptionSet", "request");
		ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateGlobalOptionSet", "request.data");
		ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateGlobalOptionSet", "request.data.MetadataId");

		if (request.castType) {
			ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateGlobalOptionSet", "request.castType");
		}

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "GlobalOptionSetDefinitions";
		internalRequest.key = request.data.MetadataId;
		internalRequest.functionName = "updateGlobalOptionSet";
		internalRequest.method = "PUT";

		return this.update(<DynamicsWebApi.UpdateRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to delete a Global Option Set.
	 *
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	deleteGlobalOptionSet = (request: DynamicsWebApi.DeleteGlobalOptionSetRequest): Promise<any> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteGlobalOptionSet", "request");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "GlobalOptionSetDefinitions";
		internalRequest.functionName = "deleteGlobalOptionSet";

		return this.deleteRecord(<DynamicsWebApi.DeleteRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to retrieve Global Option Set definitions.
	 * 
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	retrieveGlobalOptionSet = <T = any>(request: DynamicsWebApi.RetrieveGlobalOptionSetRequest): Promise<T> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveGlobalOptionSet", "request");

		if (request.castType) {
			ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveGlobalOptionSet", "request.castType");
		}

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.collection = "GlobalOptionSetDefinitions";
		internalRequest.navigationProperty = request.castType;
		internalRequest.functionName = "retrieveGlobalOptionSet";

		return this.retrieve(<DynamicsWebApi.RetrieveRequest>internalRequest);
	};

	/**
	 * Sends an asynchronous request to retrieve Global Option Set definitions.
	 * 
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	retrieveGlobalOptionSets = <T = any>(request?: DynamicsWebApi.RetrieveGlobalOptionSetsRequest): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>> => {
		let internalRequest: Core.InternalRequest = !request
			? {}
			: Utility.copyObject<Core.InternalRequest>(request);

		internalRequest.collection = "GlobalOptionSetDefinitions";
		internalRequest.functionName = "retrieveGlobalOptionSets";

		if (request && request.castType) {
			internalRequest.navigationProperty = request.castType;
			ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveGlobalOptionSets", "request.castType");
		}

		return this.retrieveMultiple(<DynamicsWebApi.RetrieveMultipleRequest>internalRequest);
	};

	/**
	 * Starts a batch request.
	 * 
	 */
	startBatch = (): void => {
		this._isBatch = true;
	};

	/**
	 * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
	 * @param request - An object that represents all possible options for a current request.
	 * @returns {Promise} D365 Web Api result
	 */
	executeBatch = (request?: DynamicsWebApi.BaseRequest): Promise<any[]> => {
		ErrorHelper.batchNotStarted(this._isBatch);

		let internalRequest: Core.InternalRequest = !request
			? {}
			: Utility.copyObject<Core.InternalRequest>(request);

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
	initializeInstance = (config) => {
		if (!config) {
			config = this._internalConfig;
		}

		return new DynamicsWebApi(config);
	};

	utility = {
		/**
		 * Searches for a collection name by provided entity name in a cached entity metadata.
		 * The returned collection name can be null.
		 *
		 * @param {string} entityName - entity name
		 * @returns {string} a collection name
		 */
		getCollectionName: RequestClient.getCollectionName
	};
}

//declare module "dynamics-web-api" {
//	export DynamicsWebApi;
//}
/**
 * DynamicsWebApi Utility helper class
 * @typicalname dynamicsWebApi.utility
 */
//DynamicsWebApi.prototype.utility = {
//    /**
//     * Searches for a collection name by provided entity name in a cached entity metadata.
//     * The returned collection name can be null.
//     *
//     * @param {string} entityName - entity name
//     * @returns {string} a collection name
//     */
//	getCollectionName: RequestClient.getCollectionName
//};

/**
 * Microsoft Dynamics CRM Web API helper library written in JavaScript.
 * It is compatible with: Dynamics 365 (online), Dynamics 365 (on-premise), Dynamics CRM 2016, Dynamics CRM Online.
 * @module dynamics-web-api
 * @typicalname dynamicsWebApi
 */
//module.exports = DynamicsWebApi;

export declare namespace DynamicsWebApi {
	export interface Expand {
		/**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[]
		/**Use the $filter system query option to set criteria for which entities will be returned. */
		filter?: string
		/**Limit the number of results returned by using the $top system query option.Do not use $top with $count! */
		top?: number
		/**An Array(of Strings) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied. */
		orderBy?: string[]
		/**A name of a single-valued navigation property which needs to be expanded. */
		property?: string
		/**An Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned. */
		expand?: Expand[]
	}

	export interface BaseRequest {
		/**XHR requests only! Indicates whether the requests should be made synchronously or asynchronously.Default value is 'true'(asynchronously). */
		async?: boolean;
		/**Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id. */
		impersonate?: string;
		/** If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'. */
		noCache?: boolean;
		/** Authorization Token. If set, onTokenRefresh will not be called. */
		token?: string;
		/**Sets a number of milliseconds before a request times out. */
		timeout?: number;
	}

	export interface Request extends BaseRequest {
		/**The name of the Entity Collection or Entity Logical name. */
		collection: string;
	}

	export interface CRUDRequest extends Request {
		/**A String representing collection record's Primary Key (GUID) or Alternate Key(s). */
		key?: string;
	}

	export interface CountRequest extends Request {
		/**Use the $filter system query option to set criteria for which entities will be returned. */
		filter?: string;
	}

	export interface CountAllRequest extends CountRequest {
		/**An Array (of strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[];
	}

	export interface FetchAllRequest extends Request {
		/**FetchXML is a proprietary query language that provides capabilities to perform aggregation. */
		fetchXml: string;
		/**Sets Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie */
		includeAnnotations?: string;
	}

	export interface FetchXmlRequest extends FetchAllRequest {
		/**Page number. */
		pageNumber?: number;
		/**Paging cookie. To retrive the first page, pagingCookie must be null. */
		pagingCookie?: string
	}

	export interface CreateRequest extends CRUDRequest {
		/**v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection. */
		duplicateDetection?: boolean;
		/**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
		entity?: any;
		/**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
		expand?: Expand[];
		/**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
		includeAnnotations?: string;
		/**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
		navigationProperty?: string;
		/**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
		navigationPropertyKey?: string;
		/**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request. */
		returnRepresentation?: boolean;
		/**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
		contentId?: string;
	}

	export interface UpdateRequestBase extends CRUDRequest {
		/**v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection. */
		duplicateDetection?: boolean;
		/**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
		entity?: any;
		/**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
		expand?: Expand[];
		/**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
		ifmatch?: string;
		/**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
		includeAnnotations?: string;
		/**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request. */
		returnRepresentation?: boolean;
		/**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[];
		/**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
		contentId?: string;
		/**v.1.4.3 + Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata). */
		metadataAttributeType?: string;
		/**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
		navigationProperty?: string;
		/**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
		navigationPropertyKey?: string;
	}

	export interface UpdateRequest extends UpdateRequestBase {
		/**If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false' */
		mergeLabels?: boolean;
	}

	export interface UpsertRequest extends UpdateRequestBase {
		/**Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. */
		ifnonematch?: string;
	}

	export interface DeleteRequest extends CRUDRequest {
		/**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
		ifmatch?: string;
		/**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
		contentId?: string;
	}

	export interface RetrieveRequest extends CRUDRequest {
		/**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
		expand?: Expand[];
		/**Use the $filter system query option to set criteria for which entities will be returned. */
		filter?: string;
		/**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
		ifmatch?: string;
		/**Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. */
		ifnonematch?: string;
		/**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
		includeAnnotations?: string;
		/**v.1.4.3 + Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata). */
		metadataAttributeType?: string;
		/**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
		navigationProperty?: string;
		/**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
		navigationPropertyKey?: string;
		/**A String representing the GUID value of the saved query. */
		savedQuery?: string;
		/**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[];
		/**A String representing the GUID value of the user query. */
		userQuery?: string;
	}

	export interface RetrieveMultipleRequest extends Request {
		/**Use the $apply to aggregate and group your data dynamically */
		apply?: string
		/**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
		expand?: Expand[];
		/**Boolean that sets the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000(per page).Do not use $top with $count! */
		count?: boolean;
		/**Use the $filter system query option to set criteria for which entities will be returned. */
		filter?: string;
		/**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
		includeAnnotations?: string;
		/**Sets the odata.maxpagesize preference value to request the number of entities returned in the response. */
		maxPageSize?: number;
		/**An Array(of string) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied. */
		orderBy?: string[];
		/**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[];
		/**Limit the number of results returned by using the $top system query option.Do not use $top with $count! */
		top?: number;
		/**Sets Prefer header with value 'odata.track-changes' to request that a delta link be returned which can subsequently be used to retrieve entity changes. */
		trackChanges?: boolean;
	}

	export interface AssociateRequest extends Request {
		/**Primary entity record id/key. */
		primaryKey: string;
		/**Relationship name. */
		relationshipName: string;
		/**Related name of the Entity Collection or Entity Logical name. */
		relatedCollection: string;
		/**Related entity record id/key. */
		relatedKey: string
	}

	export interface AssociateSingleValuedRequest extends Request {
		/**Primary entity record id/key. */
		primaryKey: string;
		/**Navigation property name. */
		navigationProperty: string;
		/**Related name of the Entity Collection or Entity Logical name. */
		relatedCollection: string;
		/**Related entity record id/key. */
		relatedKey: string
	}

	export interface DisassociateRequest extends Request {
		/**Primary entity record id/key. */
		primaryKey: string;
		/**Relationship name. */
		relationshipName: string;
		/**Related entity record id/key. */
		relatedKey: string
	}

	export interface DisassociateSingleValuedRequest extends Request {
		/**Primary entity record id/key. */
		primaryKey: string;
		/**Navigation property name. */
		navigationProperty: string;
	}

	export interface UnboundFunctionRequest extends BaseRequest {
		/**The name of the function. */
		functionName: string;
		/**Function's input parameters. Example: { param1: "test", param2: 3 }. */
		parameters?: any;
	}

	export interface BoundFunctionRequest extends UnboundFunctionRequest, Request {
		/**A String representing the GUID value for the record. */
		id?: string;
	}

	export interface UnboundActionRequest extends BaseRequest {
		/**The name of the Web API action. */
		actionName: string;
		/**Action request body. */
		action?: any;
	}

	export interface BoundActionRequest extends UnboundActionRequest, Request {
		/**A String representing the GUID value for the record. */
		id?: string;
	}

	export interface CreateEntityRequest extends BaseRequest {
		/**An object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
		data: any;
	}

	export interface UpdateEntityRequest extends CRUDRequest {
		/**An object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
		data: any;
		/**Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false. */
		mergeLabels?: boolean;
	}

	export interface RetrieveEntityRequest extends BaseRequest {
		/**The Entity MetadataId or Alternate Key (such as LogicalName). */
		key: string,
		/**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[];
		/**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
		expand?: Expand[];
	}

	export interface RetrieveEntitiesRequest extends BaseRequest {
		/**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[];
		/**Use the $filter system query option to set criteria for which entities will be returned. */
		filter?: string;
		/**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
		expand?: Expand[];
	}

	export interface CreateAttributeRequest extends BaseRequest {
		/**The Entity MetadataId or Alternate Key (such as LogicalName). */
		entityKey: string;
		/**Attribute metadata object. */
		data: any;
	}

	export interface UpdateAttributeRequest extends CreateAttributeRequest {
		/**Use this parameter to cast the Attribute to a specific type. */
		castType?: string;
		/**Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false. */
		mergeLabels?: boolean;
	}

	export interface RetrieveAttributesRequest extends BaseRequest {
		/**The Entity MetadataId or Alternate Key (such as LogicalName). */
		entityKey: string;
		/**Use this parameter to cast the Attribute to a specific type. */
		castType?: string;
		/**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[];
		/**Use the $filter system query option to set criteria for which entities will be returned. */
		filter?: string;
		/**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
		expand?: Expand[];
	}

	export interface RetrieveAttributeRequest extends BaseRequest {
		/**The Attribute MetadataId or Alternate Key (such as LogicalName). */
		attributeKey: string;
		/**The Entity MetadataId or Alternate Key (such as LogicalName). */
		entityKey: string;
		/**Use this parameter to cast the Attribute to a specific type. */
		castType?: string;
		/**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[];
		/**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
		expand?: Expand[];
	}

	export interface CreateRelationshipRequest extends BaseRequest {
		/**Relationship Definition. */
		data: any;
	}

	export interface UpdateRelationshipRequest extends CreateRelationshipRequest {
		/**Use this parameter to cast the Relationship metadata to a specific type. */
		castType?: string;
		/**Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false. */
		mergeLabels?: boolean;
	}

	export interface DeleteRelationshipRequest extends BaseRequest {
		/**The Relationship MetadataId or Alternate Key (such as LogicalName). */
		key: string;
	}

	export interface RetrieveRelationshipsRequest extends BaseRequest {
		/**Use this parameter to cast the Relationship metadata to a specific type. */
		castType?: string;
		/**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[];
		/**Use the $filter system query option to set criteria for which entities will be returned. */
		filter?: string;
		/**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
		expand?: Expand[];
	}

	export interface RetrieveRelationshipRequest extends BaseRequest {
		/**The Relationship MetadataId or Alternate Key (such as LogicalName). */
		key: string;
		/**Use this parameter to cast the Relationship metadata to a specific type. */
		castType?: string;
		/**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[];
		/**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
		expand?: Expand[];
	}

	export interface CreateGlobalOptionSetRequest extends BaseRequest {
		/**Global Option Set Definition. */
		data: any;
	}

	export interface UpdateGlobalOptionSetRequest extends CreateRelationshipRequest {
		/**Use this parameter to cast the Global Option Set metadata to a specific type. */
		castType?: string;
		/**Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false. */
		mergeLabels?: boolean;
	}

	export interface DeleteGlobalOptionSetRequest extends BaseRequest {
		/**The Global Option Set MetadataId or Alternate Key (such as LogicalName). */
		key: string;
	}

	export interface RetrieveGlobalOptionSetsRequest extends BaseRequest {
		/**Use this parameter to cast the Global Option Set metadata to a specific type. */
		castType?: string;
		/**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[];
		/**Use the $filter system query option to set criteria for which entities will be returned. */
		filter?: string;
		/**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
		expand?: Expand[];
	}

	export interface RetrieveGlobalOptionSetRequest extends BaseRequest {
		/**The Global Option Set MetadataId or Alternate Key (such as LogicalName). */
		key: string;
		/**Use this parameter to cast the Global Option Set metadata to a specific type. */
		castType?: string;
		/**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[];
		/**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
		expand?: Expand[];
	}

	export interface Config {
		/**A String representing the GUID value for the Dynamics 365 system user id.Impersonates the user. */
		webApiUrl?: string;
		/**The version of Web API to use, for example: "8.1" */
		webApiVersion?: string;
		/**A String representing a URL to Web API(webApiVersion not required if webApiUrl specified)[not used inside of CRM] */
		impersonate?: string;
		/**A function that is called when a security token needs to be refreshed. */
		onTokenRefresh?: (callback: OnTokenAcquiredCallback) => void;
		/**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types.*/
		includeAnnotations?: string;
		/**Sets the odata.maxpagesize preference value to request the number of entities returned in the response. */
		maxPageSize?: number;
		/**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request.*/
		returnRepresentation?: boolean;
		/**Indicates whether to use Entity Logical Names instead of Collection Logical Names.*/
		useEntityNames?: boolean;
		/**Sets a number of milliseconds before a request times out */
		timeout?: number;
	}

	/** Callback with an acquired token called by DynamicsWebApi; "token" argument can be a string or an object with a property {accessToken: <token>}  */
	export interface OnTokenAcquiredCallback {
		(token: any): void;
	}

	export interface Utility {
		/**
		 * Searches for a collection name by provided entity name in a cached entity metadata.
		 * The returned collection name can be null.
		 * @param entityName - entity name
		 */
		getCollectionName(entityName: string): string;
	}

	export interface RequestError extends Error {
		/**This code is not related to the http status code and is frequently empty */
		code?: string;
		/**A message describing the error */
		message: string;
		/**HTTP status code */
		status?: number;
		/**HTTP status text. Frequently empty */
		statusText?: string;
		/**HTTP Response headers */
		headers?: any;
		/**Details about an error */
		innererror?: {
			/**A message describing the error, this is frequently the same as the outer message */
			message?: string;
			/**Microsoft.Crm.CrmHttpException */
			type?: string;
			/**Details from the server about where the error occurred */
			stacktrace?: string;
		}
	}

	export interface MultipleResponse<T = any> {
		/**Multiple respone entities */
		value?: T[]
	}

	export interface AllResponse<T> extends MultipleResponse<T> {
		/**@odata.deltaLink value */
		oDataDeltaLink?: string
	}

	export interface RetrieveMultipleResponse<T> extends MultipleResponse<T> {
		/**@odata.nextLink value */
		oDataNextLink?: string,
		/**@odata.deltaLink value */
		oDataDeltaLink?: string
	}

	export interface FetchXmlResponse<T> extends MultipleResponse<T> {
		/**Paging information */
		PagingInfo?: {
			/**Number of the next page */
			nextPage?: number,
			/**Next page cookie */
			cookie?: string
		}
	}
}