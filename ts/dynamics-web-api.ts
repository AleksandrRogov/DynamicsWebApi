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
	createRequest = <T = any>(request: DynamicsWebApi.CreateRequest): Promise<T> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.create", "request");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
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
	retrieveRequest = <T = any>(request: DynamicsWebApi.RetrieveRequest): Promise<T> => {
		ErrorHelper.parameterCheck(request, 'DynamicsWebApi.retrieve', 'request');

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
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
	updateRequest = <T = any>(request: DynamicsWebApi.UpdateRequest): Promise<T> => {

		ErrorHelper.parameterCheck(request, "DynamicsWebApi.update", "request");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
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
	deleteRequest = (request: DynamicsWebApi.DeleteRequest): Promise<any> => {

		ErrorHelper.parameterCheck(request, 'DynamicsWebApi.delete', 'request');

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
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
	upsertRequest = <T = any>(request: DynamicsWebApi.UpsertRequest): Promise<T> => {
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

	retrieveMultipleRequest = <T = any>(request: DynamicsWebApi.RetrieveMultipleRequest, nextPageLink?: string): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>> => {
		ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveMultipleRequest", "request");

		let internalRequest = Utility.copyObject<Core.InternalRequest>(request);
		internalRequest.method = "GET";
		internalRequest.functionName = "retrieveMultiple";

		if (nextPageLink) {
			ErrorHelper.stringParameterCheck(nextPageLink, 'DynamicsWebApi.retrieveMultiple', 'nextPageLink');
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

	private _retrieveAllRequest = <T = any>(request: DynamicsWebApi.RetrieveMultipleRequest, nextPageLink?: string, records: any[] = []): Promise<DynamicsWebApi.AllResponse<T>> => {
		//records = records || [];

		return this.retrieveMultipleRequest(request, nextPageLink).then(response => {
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
	retrieveAllRequest = <T = any>(request: DynamicsWebApi.RetrieveMultipleRequest): Promise<DynamicsWebApi.AllResponse<T>> => {
		ErrorHelper.batchIncompatible('DynamicsWebApi.retrieveAllRequest', this._isBatch);
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
	 * @param {string} functionName - The name of the function.
	 * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
	 * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
	 * @returns {Promise} D365 Web Api result
	 */
	executeUnboundFunction = <T = any>(functionName: string, parameters?: any, impersonateUserId?: string): Promise<T> => {
		return this._executeFunction(functionName, parameters, null, null, impersonateUserId, true);
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
	executeBoundFunction = <T = any>(id: string, collection: string, functionName: string, parameters?: any, impersonateUserId?: string): Promise<T> => {
		return this._executeFunction(functionName, parameters, collection, id, impersonateUserId);
	};

	private _executeFunction = <T = any>(functionName: string, parameters: any, collection: string, id: string, impersonateUserId: string, isUnbound: boolean = false): Promise<T> => {

		ErrorHelper.stringParameterCheck(functionName, "DynamicsWebApi.executeFunction", "functionName");

		var request = {
			_additionalUrl: functionName + Utility.buildFunctionParameters(parameters),
			_isUnboundRequest: isUnbound,
			key: id,
			collection: collection,
			impersonate: impersonateUserId,
			method: "GET",
			functionName: !isUnbound ? "executeBoundFunction" : "executeUnboundFunction"
		};

		return this._makeRequest(request).then(function (response) {
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
	executeUnboundAction = <T = any>(actionName: string, requestObject?: any, impersonateUserId?: string): Promise<T> => {
		return this._executeAction(actionName, requestObject, null, null, impersonateUserId, true);
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
	executeBoundAction = <T = any>(id: string, collection: string, actionName: string, requestObject?: any, impersonateUserId?: string): Promise<T> => {
		return this._executeAction(actionName, requestObject, collection, id, impersonateUserId);
	};

	private _executeAction = <T = any>(actionName: string, requestObject: any, collection: string, id: string, impersonateUserId: string, isUnbound: boolean = false): Promise<T> => {
		ErrorHelper.stringParameterCheck(actionName, "DynamicsWebApi.executeAction", "actionName");

		var request = {
			_additionalUrl: actionName,
			_isUnboundRequest: isUnbound,
			collection: collection,
			key: id,
			impersonate: impersonateUserId,
			data: requestObject,
			method: "POST",
			functionName: !isUnbound ? "executeBoundAction" : "executeUnboundAction"
		};

		return this._makeRequest(request).then(response => {
			return response.data;
		});
	};

	/**
	 * Sends an asynchronous request to create an entity definition.
	 *
	 * @param {string} entityDefinition - Entity Definition.
	 * @returns {Promise} D365 Web Api result
	 */
	createEntity = <T = any>(entityDefinition: Object): Promise<T> => {

		ErrorHelper.parameterCheck(entityDefinition, 'DynamicsWebApi.createEntity', 'entityDefinition');

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
	updateEntity = <T>(entityDefinition: any, mergeLabels?: boolean): Promise<T> => {

		ErrorHelper.parameterCheck(entityDefinition, 'DynamicsWebApi.updateEntity', 'entityDefinition');
		ErrorHelper.guidParameterCheck(entityDefinition.MetadataId, 'DynamicsWebApi.updateEntity', 'entityDefinition.MetadataId');

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
	retrieveEntity = <T>(entityKey: string, select?: string[], expand?: DynamicsWebApi.Expand[]): Promise<T> => {

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
	retrieveEntities = <T>(select?: string[], filter?: string): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>> => {
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
	createAttribute = <T>(entityKey: string, attributeDefinition: Object): Promise<T> => {
		ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.createAttribute', 'entityKey');
		ErrorHelper.parameterCheck(attributeDefinition, 'DynamicsWebApi.createAttribute', 'attributeDefinition');

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
	updateAttribute = <T>(entityKey: string, attributeDefinition: any, attributeType?: string, mergeLabels?: boolean): Promise<T> => {
		ErrorHelper.keyParameterCheck(entityKey, 'DynamicsWebApi.updateAttribute', 'entityKey');
		ErrorHelper.parameterCheck(attributeDefinition, 'DynamicsWebApi.updateAttribute', 'attributeDefinition');
		ErrorHelper.guidParameterCheck(attributeDefinition.MetadataId, 'DynamicsWebApi.updateAttribute', 'attributeDefinition.MetadataId');

		if (attributeType) {
			ErrorHelper.stringParameterCheck(attributeType, 'DynamicsWebApi.updateAttribute', 'attributeType');
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
	retrieveAttributes = <T>(entityKey: string, attributeType?: string, select?: string[], filter?: string, expand?: DynamicsWebApi.Expand[]): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>> => {

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
	retrieveAttribute = <T>(entityKey: string, attributeKey: string, attributeType?: string, select?: string[], expand?: DynamicsWebApi.Expand[]): Promise<T> => {

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
	createRelationship = <T>(relationshipDefinition: Object): Promise<T> => {

		ErrorHelper.parameterCheck(relationshipDefinition, 'DynamicsWebApi.createRelationship', 'relationshipDefinition');

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
	updateRelationship = <T>(relationshipDefinition: any, relationshipType?: string, mergeLabels?: boolean): Promise<T> => {

		ErrorHelper.parameterCheck(relationshipDefinition, 'DynamicsWebApi.updateRelationship', 'relationshipDefinition');
		ErrorHelper.guidParameterCheck(relationshipDefinition.MetadataId, 'DynamicsWebApi.updateRelationship', 'relationshipDefinition.MetadataId');

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
	deleteRelationship = (metadataId: string): Promise<any> => {
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
	retrieveRelationships = <T>(relationshipType?: string, select?: string[], filter?: string): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>> => {

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
	retrieveRelationship = <T>(metadataId: string, relationshipType?: string, select?: string[]): Promise<T> => {

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
	createGlobalOptionSet = <T>(globalOptionSetDefinition: any): Promise<T> => {

		ErrorHelper.parameterCheck(globalOptionSetDefinition, 'DynamicsWebApi.createGlobalOptionSet', 'globalOptionSetDefinition');

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
	updateGlobalOptionSet = <T>(globalOptionSetDefinition: any, mergeLabels?: boolean): Promise<T> => {

		ErrorHelper.parameterCheck(globalOptionSetDefinition, 'DynamicsWebApi.updateGlobalOptionSet', 'globalOptionSetDefinition');
		ErrorHelper.guidParameterCheck(globalOptionSetDefinition.MetadataId, 'DynamicsWebApi.updateGlobalOptionSet', 'globalOptionSetDefinition.MetadataId');

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
	deleteGlobalOptionSet = (globalOptionSetKey: string): Promise<any> => {
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
	retrieveGlobalOptionSet = <T>(globalOptionSetKey: string, castType?: string, select?: string[]): Promise<T> => {
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
	retrieveGlobalOptionSets = <T>(castType?: string, select?: string[]): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>> => {

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
	startBatch = (): void => {
		this._isBatch = true;
	};

	/**
	 * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
	 * @returns {Promise} D365 Web Api result
	 */
	executeBatch = (): Promise<any[]> => {
		ErrorHelper.batchNotStarted(this._isBatch);

		let request: Core.InternalRequest = {
			collection: "$batch",
			method: "POST",
			functionName: "executeBatch"
		}

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