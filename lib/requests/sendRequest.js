var DWA = require('../dwa');
var Utility = require('../utilities/Utility');
var RequestConverter = require('../utilities/RequestConverter');

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
            if (key.endsWith("@odata.bind")) {
                if (typeof value === "string") {
                    //remove brackets in guid
                    if (/\(\{[\w\d-]+\}\)/g.test(value)) {
                        value = value.replace(/(.+)\(\{([\w\d-]+)\}\)/g, '$1($2)');
                    }
                    //add full web api url if it's not set
                    if (!value.startsWith(config.webApiUrl)) {
                        value = config.webApiUrl + value.replace(/^\\/, '');
                    }
                }
            }

            return value;
        });

        stringifiedData = stringifiedData.replace(/[\u007F-\uFFFF]/g, function (chr) {
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
        });
    }

    return stringifiedData;
}

/**
 * Sends a request to given URL with given parameters
 *
 * @param {string} method - Method of the request.
 * @param {string} path - Request path.
 * @param {Function} successCallback - A callback called on success of the request.
 * @param {Function} errorCallback - A callback called when a request failed.
 * @param {Object} config - DynamicsWebApi config.
 * @param {Object} [data] - Data to send in the request.
 * @param {Object} [additionalHeaders] - Object with additional headers. IMPORTANT! This object does not contain default headers needed for every request.
 * @param {boolean} [isAsync] - Indicates whether the request should be made synchronously or asynchronously.
 * @returns {Promise}
 */
function sendRequest(method, path, config, data, additionalHeaders, successCallback, errorCallback, isAsync) {

    if (!additionalHeaders) {
        additionalHeaders = {};
    }

    additionalHeaders = setStandardHeaders(additionalHeaders);

    //stringify passed data
    var stringifiedData = stringifyData(data, config);

    //if the URL contains more characters than max possible limit, convert the request to a batch request
    if (path.length > 2000) {
        var batchBoundary = 'dwa_batch_' + Utility.generateUUID();

        var batchBody = [];
        batchBody.push('--' + batchBoundary);
        batchBody.push('Content-Type: application/http');
        batchBody.push('Content-Transfer-Encoding: binary\n');
        batchBody.push(method + ' ' + config.webApiUrl + path + ' HTTP/1.1');

        for (var key in additionalHeaders) {
            batchBody.push(key + ': ' + additionalHeaders[key]);
            delete additionalHeaders[key];
        }

        batchBody.push('\n--' + batchBoundary + '--');

        stringifiedData = batchBody.join('\n');

        additionalHeaders = setStandardHeaders(additionalHeaders);
        additionalHeaders['Content-Type'] = 'multipart/mixed;boundary=' + batchBoundary;
        path = '$batch';
        method = 'POST';
    }

    if (config.impersonate && !additionalHeaders['MSCRMCallerID']) {
        additionalHeaders['MSCRMCallerID'] = config.impersonate;
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
            additionalHeaders['Authorization'] = 'Bearer ' + token.accessToken;
        }

        executeRequest(method, config.webApiUrl + path, stringifiedData, additionalHeaders, successCallback, errorCallback, isAsync);
    };

    //call a token refresh callback only if it is set and there is no "Authorization" header set yet
    if (config.onTokenRefresh && (!additionalHeaders || (additionalHeaders && !additionalHeaders['Authorization']))) {
        config.onTokenRefresh(sendInternalRequest);
    }
    else {
        sendInternalRequest();
    }
};

var _entityNames;

function _findCollectionName(entityName) {
    var collectionName = _entityNames[entityName];
    if (Utility.isNull(collectionName)) {
        for (var key in _entityNames) {
            if (_entityNames[key] == entityName) {
                return entityName;
            }
        }
    }
    return collectionName;
}

function _getEntityNames(entityName, config, successCallback, errorCallback) {

    var resolve = function (result) {
        _entityNames = {};
        for (var i = 0; i < result.data.value.length; i++) {
            _entityNames[result.data.value[i].LogicalName] = result.data.value[i].LogicalCollectionName;
        }

        successCallback(_findCollectionName(entityName));
    };

    var reject = function (error) {
        errorCallback({ message: 'Cannot fetch EntityDefinitions. Error: ' + error.message });
    };

    var request = RequestConverter.convertRequest({
        collection: 'EntityDefinitions',
        select: ['LogicalCollectionName', 'LogicalName']
    }, 'retrieveMultiple', config);

    sendRequest('GET', request.url, config, null, request.headers, resolve, reject, request.async);
}

function _isEntityNameException(entityName) {
    var exceptions = ['EntityDefinitions', '$metadata'];

    return exceptions.indexOf(entityName) > -1;
}

function _getCollectionName(entityName, config, successCallback, errorCallback) {

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
        var xrmInternal = Utility.getXrmInternal();
        if (!Utility.isNull(xrmInternal)) {
            successCallback(xrmInternal.getEntitySetName(entityName));
        }
        else {
            if (Utility.isNull(_entityNames)) {
                _getEntityNames(entityName, config, successCallback, errorCallback);
            }
            else {
                successCallback(_findCollectionName(entityName));
            }
        }
    }
    catch (error) {
        errorCallback({ message: 'Unable to fetch Collection Names. Error: ' + error.message });
    }
};

function makeRequest(method, request, functionName, config, resolve, reject) {
    var successCallback = function (collectionName) {
        request.collection = collectionName;
        var result = RequestConverter.convertRequest(request, functionName, config);
        sendRequest(method, result.url, config, request.data || request.entity, result.headers, resolve, reject, result.async);
    }
    _getCollectionName(request.collection, config, successCallback, reject);
};

module.exports = {
    sendRequest: sendRequest,
    makeRequest: makeRequest
}