var parseResponse = require('./helpers/parseResponse');
var parseResponseHeaders = require('./helpers/parseResponseHeaders');

/**
 * Sends a request to given URL with given parameters
 *
 * @param {string} method - Method of the request.
 * @param {string} uri - Request URI.
 * @param {Function} successCallback - A callback called on success of the request.
 * @param {Function} errorCallback - A callback called when a request failed.
 * @param {string} [data] - Data to send in the request.
 * @param {Object} [additionalHeaders] - Object with headers. IMPORTANT! This object does not contain default headers needed for every request.
 */
var xhrRequest = function (method, uri, data, additionalHeaders, successCallback, errorCallback, async) {
    var request = new XMLHttpRequest();
    request.open(method, uri, async);
    //request.setRequestHeader("OData-MaxVersion", "4.0");
    //request.setRequestHeader("OData-Version", "4.0");
    //request.setRequestHeader("Accept", "application/json");
    //request.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    //set additional headers
    for (var key in additionalHeaders) {
        request.setRequestHeader(key, additionalHeaders[key]);
    }

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            switch (request.status) {
                case 200: // Success with content returned in response body.
                case 201: // Success with content returned in response body.
                case 204: // Success with no content returned in response body.
                case 304: {// Success with Not Modified
                    var responseData = parseResponse(request.responseText);

                    var response = {
                        data: responseData,
                        headers: parseResponseHeaders(request.getAllResponseHeaders()),
                        status: request.status
                    };

                    successCallback(response);
                    break;
                }
                default: // All other statuses are error cases.
                    var error;
                    try {
                        error = JSON.parse(request.response).error;
                    } catch (e) {
                        if (request.response.length > 0) {
                            error = { message: request.response };
                        }
                        else {
                            error = { message: "Unexpected Error" };
                        }
                    }
                    error.status = request.status;
                    error.statusText = request.statusText;
                    errorCallback(error);
                    break;
            }

            request = null;
        }
    };

    request.onerror = function () {
        errorCallback({ message: "Network Error" });
        request = null;
    };

    request.ontimeout = function (error) {
        errorCallback({ message: "Request Timed Out" });
        request = null;
    };

    data
        ? request.send(data)
        : request.send();
};

module.exports = xhrRequest;