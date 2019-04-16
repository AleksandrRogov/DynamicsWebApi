var parseResponse = require('./helpers/parseResponse');
var parseResponseHeaders = require('./helpers/parseResponseHeaders');

/**
 * Sends a request to given URL with given parameters
 *
 */
var xhrRequest = function (options) {
    var method = options.method;
    var uri = options.uri;
    var data = options.data;
    var additionalHeaders = options.additionalHeaders;
    var responseParams = options.responseParams;
    var successCallback = options.successCallback;
    var errorCallback = options.errorCallback;
    var isAsync = options.isAsync;

    var request = new XMLHttpRequest();
    request.open(method, uri, isAsync);

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
                    var responseHeaders = parseResponseHeaders(request.getAllResponseHeaders());
                    var responseData = parseResponse(request.responseText, responseHeaders, responseParams);

                    var response = {
                        data: responseData,
                        headers: responseHeaders,
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
            responseParams.length = 0;
        }
    };

    if (options.timeout) {
        request.timeout = options.timeout;
    }

    request.onerror = function () {
        errorCallback({
            status: request.status,
            statusText: request.statusText,
            message: request.responseText || "Network Error"
        });
        responseParams.length = 0;
        request = null;
    };

    request.ontimeout = function () {
        errorCallback({
            status: request.status,
            statusText: request.statusText,
            message: request.responseText || "Request Timed Out"
        });
        responseParams.length = 0;
        request = null;
    };

    data
        ? request.send(data)
        : request.send();
};

module.exports = xhrRequest;
