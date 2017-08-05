var DWA = require('../dwa');
//var RequestConverter = require('../utilities/RequestConverter');

//https://stackoverflow.com/a/8809472
function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function setStandardHeaders(additionalHeaders) {
    additionalHeaders["Accept"] = "application/json";
    additionalHeaders["OData-MaxVersion"] = "4.0";
    additionalHeaders["OData-Version"] = "4.0";
    additionalHeaders['Content-Type'] = 'application/json; charset=utf-8';

    return additionalHeaders;
}

/**
 * Sends a request to given URL with given parameters
 *
 * @param {string} method - Method of the request.
 * @param {string} uri - Request URI.
 * @param {Function} successCallback - A callback called on success of the request.
 * @param {Function} errorCallback - A callback called when a request failed.
 * @param {Object} config - DynamicsWebApi config.
 * @param {Object} [data] - Data to send in the request.
 * @param {Object} [additionalHeaders] - Object with additional headers. IMPORTANT! This object does not contain default headers needed for every request.
 * @returns {Promise}
 */
module.exports = function sendRequest(method, uri, config, data, additionalHeaders, successCallback, errorCallback) {

    if (!additionalHeaders) {
        additionalHeaders = {};
    }

    additionalHeaders = setStandardHeaders(additionalHeaders);

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
                        value = config.webApiUrl + value;
                    }
                }
            }

            return value;
        });
    }

    //if the URL contains more characters than max possible limit, convert the request to a batch request
    if (uri.length > 2000) {
        var batchBoundary = 'dwa_batch_' + generateUUID();

        var batchBody = [];
        batchBody.push('--' + batchBoundary);
        batchBody.push('Content-Type: application/http');
        batchBody.push('Content-Transfer-Encoding: binary\n');
        batchBody.push(method + ' ' + config.webApiUrl + uri + ' HTTP/1.1');

        for (var key in additionalHeaders) {
            batchBody.push(key + ': ' + additionalHeaders[key]);
            delete additionalHeaders[key];
        }

        batchBody.push('\n--' + batchBoundary + '--');

        stringifiedData = batchBody.join('\n');

        additionalHeaders = setStandardHeaders(additionalHeaders);
        additionalHeaders['Content-Type'] = 'multipart/mixed;boundary=' + batchBoundary;
        uri = '$batch';
        method = 'POST';
    }

    if (config.impersonate && !additionalHeaders['MSCRMCallerID']) {
        additionalHeaders['MSCRMCallerID'] = config.impersonate;
    }

    var executeRequest;
    if (typeof XMLHttpRequest !== 'undefined') {
        executeRequest = require('./xhr');
    }
    /* develblock:start */
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

        executeRequest(method, config.webApiUrl + uri, stringifiedData, additionalHeaders, successCallback, errorCallback);
    };

    //call a token refresh callback only if it is set and there is no "Authorization" header set yet
    if (config.onTokenRefresh && (!additionalHeaders || (additionalHeaders && !additionalHeaders['Authorization']))) {
        config.onTokenRefresh(sendInternalRequest);
    }
    else {
        sendInternalRequest();
    }
};