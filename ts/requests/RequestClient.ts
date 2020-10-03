import { Utility } from "../utilities/Utility";
import { RequestUtility } from "../utilities/RequestUtility";
import { DynamicsWebApi } from "../../ts/dynamics-web-api";
import { Core } from "../../ts/types";

export class RequestClient {

	private static _batchRequestCollection: Core.InternalRequest[] = [];
	private static _responseParseParams = [];

	/**
	 * Sends a request to given URL with given parameters
	 *
	 * @param {string} method - Method of the request.
	 * @param {string} path - Request path.
	 * @param {Object} config - DynamicsWebApi config.
	 * @param {Object} [data] - Data to send in the request.
	 * @param {Object} [additionalHeaders] - Object with additional headers. IMPORTANT! This object does not contain default headers needed for every request.
	 * @param {any} [responseParams] - parameters for parsing the response
	 * @param {Function} successCallback - A callback called on success of the request.
	 * @param {Function} errorCallback - A callback called when a request failed.
	 * @param {boolean} [isBatch] - Indicates whether the request is a Batch request or not. Default: false
	 * @param {boolean} [isAsync] - Indicates whether the request should be made synchronously or asynchronously.
	 */
	static sendRequest(request: Core.InternalRequest, config: DynamicsWebApi.Config, successCallback: Function, errorCallback: Function): void {

		request.headers = request.headers || {};
		request.responseParameters = request.responseParameters || {};

		//add response parameters to parse
		RequestClient._responseParseParams.push(request.responseParameters);

		//stringify passed data
		var stringifiedData = null;

		var batchResult;
		let isBatchConverted = request.responseParameters != null && request.responseParameters.convertedToBatch;

		if (request.path === "$batch" && !isBatchConverted) {
			batchResult = RequestUtility.convertToBatch(RequestClient._batchRequestCollection, config);

			stringifiedData = batchResult.body;
			request.headers = { ...batchResult.headers, ...request.headers };

			//clear an array of requests
			RequestClient._batchRequestCollection.length = 0;
		}
		else {
			stringifiedData = !isBatchConverted ? RequestUtility.stringifyData(request.data, config) : request.data;

			if (!isBatchConverted)
				request.headers = RequestUtility.setStandardHeaders(request.headers);
		}

		if (config.impersonate && !request.headers["MSCRMCallerID"]) {
			request.headers["MSCRMCallerID"] = config.impersonate;
		}

		if (config.impersonateAAD && !request.headers['CallerObjectId']) {
			request.headers['CallerObjectId'] = config.impersonateAAD;
		}

		var executeRequest;
		/* develblock:start */
		if (typeof XMLHttpRequest !== "undefined") {
			/* develblock:end */
			executeRequest = require("./xhr");
			/* develblock:start */
		}
		else if (typeof process !== "undefined") {
			executeRequest = require("./http");
		}
		/* develblock:end */

		var sendInternalRequest = function (token?: any): void {
			if (token) {
				if (!request.headers) {
					request.headers = {};
				}
				request.headers["Authorization"] = "Bearer " + (token.hasOwnProperty("accessToken") ? token.accessToken : token);
			}

			executeRequest({
				method: request.method,
				uri: config.webApiUrl + request.path,
				data: stringifiedData,
				additionalHeaders: request.headers,
				responseParams: RequestClient._responseParseParams,
				successCallback: successCallback,
				errorCallback: errorCallback,
				isAsync: request.async,
				timeout: request.timeout || config.timeout
			});
		};

		//call a token refresh callback only if it is set and there is no "Authorization" header set yet
		if (config.onTokenRefresh && (!request.headers || (request.headers && !request.headers["Authorization"]))) {
			config.onTokenRefresh(sendInternalRequest);
		}
		else {
			sendInternalRequest();
		}
	}

	private static _getCollectionNames(entityName: string, config: DynamicsWebApi.Config, successCallback: (collection: string) => void, errorCallback: Function): void {

		if (!Utility.isNull(RequestUtility.entityNames)) {
			successCallback(RequestUtility.findCollectionName(entityName) || entityName);
		}
		else {
			var resolve = function (result) {
				RequestUtility.entityNames = {};
				for (var i = 0; i < result.data.value.length; i++) {
					RequestUtility.entityNames[result.data.value[i].LogicalName] = result.data.value[i].EntitySetName;
				}

				successCallback(RequestUtility.findCollectionName(entityName) || entityName);
			};

			var reject = function (error) {
				errorCallback({ message: "Unable to fetch EntityDefinitions. Error: " + error.message });
			};

			let request = RequestUtility.compose({
				method: "GET",
				collection: "EntityDefinitions",
				select: ["EntitySetName", "LogicalName"],
				noCache: true,
				functionName: "retrieveMultiple"
			}, config);

			RequestClient.sendRequest(request, config, resolve, reject);
		}
	}

	private static _isEntityNameException(entityName: string): boolean {
		var exceptions = [
			"EntityDefinitions", "$metadata", "RelationshipDefinitions",
			"GlobalOptionSetDefinitions", "ManagedPropertyDefinitions"];

		return exceptions.indexOf(entityName) > -1;
	}

	private static _checkCollectionName(entityName: string, config: DynamicsWebApi.Config, successCallback: (collection: string) => void, errorCallback: Function): void {

		if (RequestClient._isEntityNameException(entityName) || Utility.isNull(entityName)) {
			successCallback(entityName);
			return;
		}

		entityName = entityName.toLowerCase();

		if (!config.useEntityNames) {
			successCallback(entityName);
			return;
		}

		try {
			RequestClient._getCollectionNames(entityName, config, successCallback, errorCallback);
		}
		catch (error) {
			errorCallback({ message: "Unable to fetch Collection Names. Error: " + error.message });
		}
	}

	static makeRequest(request: Core.InternalRequest, config: DynamicsWebApi.Config, resolve: Function, reject: Function): void {
		request.responseParameters = request.responseParameters || {};

		//no need to make a request to web api if it's a part of batch
		if (request.isBatch) {
			request = RequestUtility.compose(request, config);

			//add response parameters to parse
			RequestClient._responseParseParams.push(request.responseParameters);

			RequestClient._batchRequestCollection.push(request);
		}
		else {
			RequestClient._checkCollectionName(request.collection, config, collectionName => {
				request.collection = collectionName;

				request = RequestUtility.compose(request, config);

				request.responseParameters.convertedToBatch = false;

				//if the URL contains more characters than max possible limit, convert the request to a batch request
				if (request.path.length > 2000) {
					let batchRequest = RequestUtility.convertToBatch([request], config);

					request.method = "POST";
					request.path = "$batch";
					request.data = batchRequest.body;
					request.headers = batchRequest.headers;
					request.responseParameters.convertedToBatch = true;
				}

				RequestClient.sendRequest(request, config, resolve, reject);
			}, reject);
		}
	}

	/* develblock:start */
	static _clearEntityNames(): void { RequestUtility.entityNames = null; }
	/* develblock:end */

	static getCollectionName(entityName: string): string { return RequestUtility.findCollectionName(entityName); }
}