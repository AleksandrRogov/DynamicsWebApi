
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
    if (config.impersonate && (!additionalHeaders || (additionalHeaders && !additionalHeaders["MSCRMCallerID"]))) {
        if (!additionalHeaders) {
            additionalHeaders = {};
        }
        additionalHeaders['MSCRMCallerID'] = config.impersonate;
    }

    var stringifiedData;
    if (data) {
        stringifiedData = JSON.stringify(data, function (key, value) {
            /// <param name="key" type="String">Description</param>
            if (key.endsWith("@odata.bind") && typeof value === "string" && !value.startsWith(config.webApiUrl)) {
                value = config.webApiUrl + value;
            }

            return value;
        });
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
            additionalHeaders['Authorization'] = "Bearer: " + token;
        }

        executeRequest(method, config.webApiUrl + uri, stringifiedData, additionalHeaders, successCallback, errorCallback);
    };

    //call a token refresh callback only if it is set and there is no "Authorization" header set yet
    if (config.onTokenRefresh && (!additionalHeaders || (additionalHeaders && !additionalHeaders["Authorization"]))) {
        config.onTokenRefresh(sendInternalRequest);
    }
    else {
        sendInternalRequest();
    }
};