var { Utility } = require("../utilities/Utility");
var { RequestUtility } = require("../utilities/RequestUtility");

var _batchRequestCollection = [];
var _responseParseParams = [];

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
function sendRequest(method, path, config, data, additionalHeaders, responseParams, successCallback, errorCallback, isBatch, isAsync) {

	additionalHeaders = additionalHeaders || {};
	responseParams = responseParams || {};

	//add response parameters to parse
	_responseParseParams.push(responseParams);

	//stringify passed data
	var stringifiedData = null;

	var batchResult;

	if (path === "$batch") {
		batchResult = RequestUtility.convertToBatch(_batchRequestCollection, config);

		stringifiedData = batchResult.body;
		additionalHeaders = batchResult.headers;

		//clear an array of requests
		_batchRequestCollection.length = 0;

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

	var sendInternalRequest = function (token) {
		if (token) {
			if (!additionalHeaders) {
				additionalHeaders = {};
			}
			additionalHeaders["Authorization"] = "Bearer " +
				(token.hasOwnProperty("accessToken") ?
					token.accessToken :
					token);
		}

		executeRequest({
			method: method,
			uri: config.webApiUrl + path,
			data: stringifiedData,
			additionalHeaders: additionalHeaders,
			responseParams: _responseParseParams,
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

function _getCollectionNames(entityName, config, successCallback, errorCallback) {

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

		sendRequest('GET', request.path, config, null, request.headers, null, resolve, reject, false, request.async);
	}
}

function _isEntityNameException(entityName) {
	var exceptions = [
		"EntityDefinitions", "$metadata", "RelationshipDefinitions",
		"GlobalOptionSetDefinitions", "ManagedPropertyDefinitions"];

	return exceptions.indexOf(entityName) > -1;
}

function _checkCollectionName(entityName, config, successCallback, errorCallback) {

	if (_isEntityNameException(entityName) || Utility.isNull(entityName)) {
		successCallback(entityName);
		return;
	}

	entityName = entityName.toLowerCase();

	if (!config.useEntityNames) {
		successCallback(entityName);
		return;
	}

	try {
		_getCollectionNames(entityName, config, successCallback, errorCallback);
	}
	catch (error) {
		errorCallback({ message: "Unable to fetch Collection Names. Error: " + error.message });
	}
}

function makeRequest(method, request, functionName, config, responseParams, resolve, reject) {
	responseParams = responseParams || {};

	//no need to make a request to web api if it's a part of batch
	if (request.isBatch) {
		//add response parameters to parse
		_responseParseParams.push(responseParams);

		_batchRequestCollection.push({ method: method, request: request });

		//check for errors
		RequestUtility.compose(request, config, functionName);
	}
	else {
		_checkCollectionName(request.collection, config, function (collectionName) {
			request.collection = collectionName;
			var result = RequestUtility.compose(request, config, functionName);

			responseParams.convertedToBatch = false;

			if (result.path.length > 2000) {
				//if the URL contains more characters than max possible limit, convert the request to a batch request
				_batchRequestCollection.push({ method: method, request: request });

				method = "POST";
				result.path = "$batch";
				responseParams.convertedToBatch = true;
			}

			sendRequest(method, result.path, config, request.data || request.entity, result.headers, responseParams, resolve, reject, request.isBatch, result.async);
		}, reject);
	}
}

module.exports = {
	sendRequest: sendRequest,
	makeRequest: makeRequest,
	getCollectionName: RequestUtility.findCollectionName,
	/* develblock:start */
	_clearEntityNames: function () { RequestUtility.entityNames = null; }
	/* develblock:end */
};
