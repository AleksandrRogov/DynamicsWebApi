"use strict";
const ErrorHelper_1 = require("./../helpers/ErrorHelper");
const parseResponse_1 = require("./helpers/parseResponse");
const parseResponseHeaders_1 = require("./helpers/parseResponseHeaders");
/**
 * Sends a request to given URL with given parameters
 *
 */
function xhrRequest(options) {
    const data = options.data;
    const additionalHeaders = options.additionalHeaders;
    const responseParams = options.responseParams;
    const successCallback = options.successCallback;
    const errorCallback = options.errorCallback;
    var request = new XMLHttpRequest();
    request.open(options.method, options.uri, options.isAsync);
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
                case 304: { // Success with Not Modified
                    let responseHeaders = parseResponseHeaders_1.parseResponseHeaders(request.getAllResponseHeaders());
                    let responseData = parseResponse_1.parseResponse(request.responseText, responseHeaders, responseParams[options.requestId]);
                    var response = {
                        data: responseData,
                        headers: responseHeaders,
                        status: request.status
                    };
                    request = null;
                    delete responseParams[options.requestId];
                    successCallback(response);
                    break;
                }
                default: // All other statuses are error cases.
                    var error;
                    try {
                        var headers = parseResponseHeaders_1.parseResponseHeaders(request.getAllResponseHeaders());
                        let errorParsed = parseResponse_1.parseResponse(request.responseText, parseResponseHeaders_1.parseResponseHeaders(request.getAllResponseHeaders()), responseParams[options.requestId]);
                        if (Array.isArray(errorParsed)) {
                            errorCallback(errorParsed);
                            break;
                        }
                        error = errorParsed.error;
                    }
                    catch (e) {
                        if (request.response.length > 0) {
                            error = { message: request.response };
                        }
                        else {
                            error = { message: "Unexpected Error" };
                        }
                    }
                    let errorParameters = {
                        status: request.status,
                        statusText: request.statusText,
                        headers: headers
                    };
                    request = null;
                    delete responseParams[options.requestId];
                    errorCallback(ErrorHelper_1.ErrorHelper.handleHttpError(error, errorParameters));
                    break;
            }
        }
    };
    if (options.timeout) {
        request.timeout = options.timeout;
    }
    request.onerror = function () {
        let headers = parseResponseHeaders_1.parseResponseHeaders(request.getAllResponseHeaders());
        errorCallback(ErrorHelper_1.ErrorHelper.handleHttpError({
            status: request.status,
            statusText: request.statusText,
            message: request.responseText || "Network Error",
            headers: headers
        }));
        delete responseParams[options.requestId];
        request = null;
    };
    request.ontimeout = function () {
        let headers = parseResponseHeaders_1.parseResponseHeaders(request.getAllResponseHeaders());
        errorCallback(ErrorHelper_1.ErrorHelper.handleHttpError({
            status: request.status,
            statusText: request.statusText,
            message: request.responseText || "Request Timed Out",
            headers: headers
        }));
        delete responseParams[options.requestId];
        request = null;
    };
    data
        ? request.send(data)
        : request.send();
}
;
module.exports = xhrRequest;
