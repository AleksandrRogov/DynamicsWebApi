var Utility = require('../utilities/Utility');
var RequestConverter = require('../utilities/RequestConverter');

var _entityNames;

/**
 * Searches for a collection name by provided entity name in a cached entity metadata.
 * The returned collection name can be null.
 *
 * @param {string} entityName - entity name
 * @returns {string} - a collection name
 */
function findCollectionName(entityName) {
	var xrmInternal = Utility.getXrmInternal();

	if (!Utility.isNull(xrmInternal) && typeof xrmInternal.getEntitySetName === "function") {
		return xrmInternal.getEntitySetName(entityName) || entityName;
	}

	var collectionName = null;

	if (!Utility.isNull(_entityNames)) {
		collectionName = _entityNames[entityName];
		if (Utility.isNull(collectionName)) {
			for (var key in _entityNames) {
				if (_entityNames[key] === entityName) {
					return entityName;
				}
			}
		}
	}

	return collectionName;
}

function setStandardHeaders(additionalHeaders) {
	additionalHeaders["Accept"] = "application/json";
	additionalHeaders["OData-MaxVersion"] = "4.0";
	additionalHeaders["OData-Version"] = "4.0";
	additionalHeaders['Content-Type'] = 'application/json; charset=utf-8';

	return additionalHeaders;
}

function stringifyData(data, config) {
	var stringifiedData;
	if (data) {
		stringifiedData = JSON.stringify(data, function (key, value) {
			/// <param name="key" type="String">Description</param>
			if (key.endsWith('@odata.bind') || key.endsWith('@odata.id')) {
				if (typeof value === 'string' && !value.startsWith('$')) {
					//remove brackets in guid
					if (/\(\{[\w\d-]+\}\)/g.test(value)) {
						value = value.replace(/(.+)\(\{([\w\d-]+)\}\)/g, '$1($2)');
					}

					if (config.useEntityNames) {
						//replace entity name with collection name
						var regularExpression = /([\w_]+)(\([\d\w-]+\))$/;
						var valueParts = regularExpression.exec(value);
						if (valueParts.length > 2) {
							var collectionName = findCollectionName(valueParts[1]);

							if (!Utility.isNull(collectionName)) {
								value = value.replace(regularExpression, collectionName + '$2');
							}
						}
					}

					if (!value.startsWith(config.webApiUrl)) {
						//add full web api url if it's not set
						if (key.endsWith('@odata.bind')) {
							if (!value.startsWith('/')) {
								value = '/' + value;
							}
						}
						else {
							value = config.webApiUrl + value.replace(/^\//, '');
						}
					}
				}
			}
			else
				if (key.startsWith('oData') ||
					key.endsWith('_Formatted') ||
					key.endsWith('_NavigationProperty') ||
					key.endsWith('_LogicalName')) {
					value = undefined;
				}

			return value;
		});

		stringifiedData = stringifiedData.replace(/[\u007F-\uFFFF]/g, function (chr) {
			return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
		});
	}

	return stringifiedData;
}

var _batchRequestCollection = [];
var _responseParseParams = [];

var _convertToBatch = function (requestCollection, config) {
	var batchBoundary = 'dwa_batch_' + Utility.generateUUID();

	var batchBody = [];
	var currentChangeSet = null;
	var contentId = 100000;

	for (var i = 0; i < requestCollection.length; i++) {
		var rawRequest = requestCollection[i].request;

		if (config.useEntityNames) {
			rawRequest.collection = findCollectionName(rawRequest.collection) || rawRequest.collection;
		}

		var request = RequestConverter.convertRequest(rawRequest, "executeBatch", config);
		var method = requestCollection[i].method;
		var isGet = method === 'GET';

		if (isGet && currentChangeSet) {
			//end current change set
			batchBody.push('\n--' + currentChangeSet + '--');

			currentChangeSet = null;
			contentId = 100000;
		}

		if (!currentChangeSet) {
			batchBody.push('\n--' + batchBoundary);

			if (!isGet) {
				currentChangeSet = 'changeset_' + Utility.generateUUID();
				batchBody.push('Content-Type: multipart/mixed;boundary=' + currentChangeSet);
			}
		}

		if (!isGet) {
			batchBody.push('\n--' + currentChangeSet);
		}

		batchBody.push('Content-Type: application/http');
		batchBody.push('Content-Transfer-Encoding: binary');

		if (!isGet) {
			var contentIdValue = request.headers.hasOwnProperty('Content-ID')
				? request.headers['Content-ID']
				: ++contentId;

			batchBody.push('Content-ID: ' + contentIdValue);
		}

		if (!request.url.startsWith("$")) {
			batchBody.push('\n' + method + ' ' + config.webApiUrl + request.url + ' HTTP/1.1');
		}
		else {
			batchBody.push('\n' + method + ' ' + request.url + ' HTTP/1.1');
		}

		if (isGet) {
			batchBody.push('Accept: application/json');
		}
		else {
			batchBody.push('Content-Type: application/json');
		}

		for (var key in request.headers) {
			if (key === 'Authorization' || key === 'Content-ID')
				continue;

			batchBody.push(key + ': ' + request.headers[key]);
		}

		var data = rawRequest.data || rawRequest.entity;

		if (!isGet && data) {
			batchBody.push('\n' + stringifyData(data, config));
		}
	}

	if (currentChangeSet) {
		batchBody.push('\n--' + currentChangeSet + '--');
	}

	batchBody.push('\n--' + batchBoundary + '--');

	return { boundary: batchBoundary, body: batchBody.join('\n') };
};

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
 * @param {number} [timeout] - Indicates timeout.
 */
function sendRequest(method, path, config, data, additionalHeaders, responseParams, successCallback, errorCallback, isBatch, isAsync, timeout) {

	additionalHeaders = additionalHeaders || {};
	responseParams = responseParams || {};

	//add response parameters to parse
	_responseParseParams.push(responseParams);

	//stringify passed data
	var stringifiedData = stringifyData(data, config);

	if (path === '$batch') {
		var batchResult = _convertToBatch(_batchRequestCollection, config);

		stringifiedData = batchResult.body;

		//clear an array of requests
		_batchRequestCollection.length = 0;

		additionalHeaders = setStandardHeaders(additionalHeaders);
		additionalHeaders['Content-Type'] = 'multipart/mixed;boundary=' + batchResult.boundary;
	}
	else {
		additionalHeaders = setStandardHeaders(additionalHeaders);
	}

	responseParams.convertedToBatch = false;

	//if the URL contains more characters than max possible limit, convert the request to a batch request
	if (path.length > 2000) {
		var batchBoundary = 'dwa_batch_' + Utility.generateUUID();

		var batchBody = [];
		batchBody.push('--' + batchBoundary);
		batchBody.push('Content-Type: application/http');
		batchBody.push('Content-Transfer-Encoding: binary\n');
		batchBody.push(method + ' ' + config.webApiUrl + path + ' HTTP/1.1');

		for (var key in additionalHeaders) {
			if (key === 'Authorization')
				continue;

			batchBody.push(key + ': ' + additionalHeaders[key]);

			//authorization header is an exception. bug #27
			delete additionalHeaders[key];
		}

		batchBody.push('\n--' + batchBoundary + '--');

		stringifiedData = batchBody.join('\n');

		additionalHeaders = setStandardHeaders(additionalHeaders);
		additionalHeaders['Content-Type'] = 'multipart/mixed;boundary=' + batchBoundary;
		path = '$batch';
		method = 'POST';

		responseParams.convertedToBatch = true;
	}

	if (config.impersonate && !additionalHeaders['MSCRMCallerID']) {
		additionalHeaders['MSCRMCallerID'] = config.impersonate;
	}
	
	if (config.impersonateAAD && !additionalHeaders['CallerObjectId']) {
		additionalHeaders['CallerObjectId'] = config.impersonateAAD;
	}

	var executeRequest;
	/* develblock:start */
	if (typeof XMLHttpRequest !== 'undefined') {
		/* develblock:end */
		executeRequest = require('./xhr');
		/* develblock:start */
	}
	else if (typeof process !== 'undefined') {
		executeRequest = require('./http');
	}
	/* develblock:end */

	var sendInternalRequest = function (token) {
		if (token) {
			if (!additionalHeaders) {
				additionalHeaders = {};
			}
			additionalHeaders['Authorization'] = 'Bearer ' +
				(token.hasOwnProperty('accessToken') ?
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
			timeout: timeout
		});
	};

	//call a token refresh callback only if it is set and there is no "Authorization" header set yet
	if (config.onTokenRefresh && (!additionalHeaders || (additionalHeaders && !additionalHeaders['Authorization']))) {
		config.onTokenRefresh(sendInternalRequest);
	}
	else {
		sendInternalRequest();
	}
}

function _getCollectionNames(entityName, config, successCallback, errorCallback) {

	//make a web api call for Node.js apps
	if (!Utility.isNull(_entityNames)) {
		successCallback(findCollectionName(entityName) || entityName);
	}
	else {
		var resolve = function (result) {
			_entityNames = {};
			for (var i = 0; i < result.data.value.length; i++) {
				_entityNames[result.data.value[i].LogicalName] = result.data.value[i].EntitySetName;
			}

			successCallback(findCollectionName(entityName) || entityName);
		};

		var reject = function (error) {
			errorCallback({ message: 'Unable to fetch EntityDefinitions. Error: ' + error.message });
		};

		var request = RequestConverter.convertRequest({
			collection: 'EntityDefinitions',
			select: ['EntitySetName', 'LogicalName'],
			noCache: true
		}, 'retrieveMultiple', config);

		sendRequest('GET', request.url, config, null, request.headers, null, resolve, reject, false, request.async, config.timeout);
	}
}

function _isEntityNameException(entityName) {
	var exceptions = [
		'EntityDefinitions', '$metadata', 'RelationshipDefinitions',
		'GlobalOptionSetDefinitions', 'ManagedPropertyDefinitions'];

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
		errorCallback({ message: 'Unable to fetch Collection Names. Error: ' + error.message });
	}
}

function makeRequest(method, request, functionName, config, responseParams, resolve, reject) {
	//no need to make a request to web api if it's a part of batch
	if (request.isBatch) {
		//add response parameters to parse
		_responseParseParams.push(responseParams || {});

		_batchRequestCollection.push({ method: method, request: Utility.copyObject(request) });

		//check for errors
		RequestConverter.convertRequest(request, functionName, config);
	}
	else {
		_checkCollectionName(request.collection, config, function (collectionName) {
			request.collection = collectionName;
			var result = RequestConverter.convertRequest(request, functionName, config);
			sendRequest(method, result.url, config, request.data || request.entity, result.headers, responseParams, resolve, reject, request.isBatch, result.async, request.timeout || config.timeout);
		}, reject);
	}
}

module.exports = {
	sendRequest: sendRequest,
	makeRequest: makeRequest,
	getCollectionName: findCollectionName,
	/* develblock:start */
	_clearEntityNames: function () { _entityNames = null; }
	/* develblock:end */
};
