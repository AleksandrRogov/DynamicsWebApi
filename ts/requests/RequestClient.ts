import { Utility } from "../utilities/Utility";
import { RequestUtility } from "../utilities/RequestUtility";
import { DynamicsWebApi } from "../../types/dynamics-web-api-types";

export class RequestClient {

	private static _batchRequestCollection = [];
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
	static sendRequest(method: string, path: string, config: DynamicsWebApi.Config, data, additionalHeaders, responseParams, isAsync: boolean, successCallback: Function, errorCallback: Function): void {

		additionalHeaders = additionalHeaders || {};
		responseParams = responseParams || {};

		//add response parameters to parse
		RequestClient._responseParseParams.push(responseParams);

		//stringify passed data
		var stringifiedData = null;

		var batchResult;

		if (path === "$batch") {
			batchResult = RequestUtility.convertToBatch(RequestClient._batchRequestCollection, config);

			stringifiedData = batchResult.body;
			additionalHeaders = batchResult.headers;

			//clear an array of requests
			RequestClient._batchRequestCollection.length = 0;

		}
		else {
			stringifiedData = RequestUtility.stringifyData(data, config);
			additionalHeaders = RequestUtility.setStandardHeaders(additionalHeaders);
		}

		if (config.impersonate && !additionalHeaders["MSCRMCallerID"]) {
			additionalHeaders["MSCRMCallerID"] = config.impersonate;
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
				if (!additionalHeaders) {
					additionalHeaders = {};
				}
				additionalHeaders["Authorization"] = "Bearer " + (token.hasOwnProperty("accessToken") ? token.accessToken : token);
			}

			executeRequest({
				method: method,
				uri: config.webApiUrl + path,
				data: stringifiedData,
				additionalHeaders: additionalHeaders,
				responseParams: RequestClient._responseParseParams,
				successCallback: successCallback,
				errorCallback: errorCallback,
				isAsync: isAsync,
				timeout: config.timeout
			});
		};

		//call a token refresh callback only if it is set and there is no "Authorization" header set yet
		if (config.onTokenRefresh && (!additionalHeaders || (additionalHeaders && !additionalHeaders["Authorization"]))) {
			config.onTokenRefresh(sendInternalRequest);
		}
		else {
			sendInternalRequest();
		}
	}

	private static _getCollectionNames(entityName: string, config: DynamicsWebApi.Config, successCallback: Function, errorCallback: Function): void {

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
				errorCallback({ message: 'Unable to fetch EntityDefinitions. Error: ' + error.message });
			};

			var request = RequestUtility.compose({
				collection: 'EntityDefinitions',
				select: ['EntitySetName', 'LogicalName'],
				noCache: true
			}, config, 'retrieveMultiple');

			RequestClient.sendRequest('GET', request.path, config, null, request.headers, null, request.async, resolve, reject);
		}
	}

	private static _isEntityNameException(entityName: string): boolean {
		var exceptions = [
			"EntityDefinitions", "$metadata", "RelationshipDefinitions",
			"GlobalOptionSetDefinitions", "ManagedPropertyDefinitions"];

		return exceptions.indexOf(entityName) > -1;
	}

	private static _checkCollectionName(entityName: string, config: DynamicsWebApi.Config, successCallback: Function, errorCallback: Function): void {

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

	static makeRequest(method: string, request: DynamicsWebApi.Core.InternalRequest, functionName: string, config: DynamicsWebApi.Config, responseParams: any, resolve: Function, reject: Function): void {
		responseParams = responseParams || {};

		//no need to make a request to web api if it's a part of batch
		if (request.isBatch) {
			//add response parameters to parse
			RequestClient._responseParseParams.push(responseParams);

			RequestClient._batchRequestCollection.push({ method: method, request: request });

			//check for errors
			RequestUtility.compose(request, config, functionName);
		}
		else {
			RequestClient._checkCollectionName(request.collection, config, function (collectionName) {
				request.collection = collectionName;
				var convertedRequest = RequestUtility.compose(request, config, functionName);

				responseParams.convertedToBatch = false;

				if (convertedRequest.path.length > 2000) {
					//if the URL contains more characters than max possible limit, convert the request to a batch request
					RequestClient._batchRequestCollection.push({ method: method, request: request });

					method = "POST";
					convertedRequest.path = "$batch";
					responseParams.convertedToBatch = true;
				}

				RequestClient.sendRequest(method, convertedRequest.path, config, request.data || request.entity, convertedRequest.headers, responseParams, request.async, resolve, reject);
			}, reject);
		}
	}

	/* develblock:start */
	static _clearEntityNames(): void { RequestUtility.entityNames = null; }
	/* develblock:end */

	static getCollectionName(entityName: string): string { return RequestUtility.findCollectionName(entityName); }
}