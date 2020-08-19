"use strict";
const ErrorHelper_1 = require("./../helpers/ErrorHelper");
const parseResponse_1 = require("./helpers/parseResponse");
const parseResponseHeaders_1 = require("./helpers/parseResponseHeaders");
/**
 * Sends a request to given URL with given parameters
 *
 */
function xhrRequest(options) {
    const method = options.method;
    const uri = options.uri;
    const data = options.data;
    const additionalHeaders = options.additionalHeaders;
    const responseParams = options.responseParams;
    const successCallback = options.successCallback;
    const errorCallback = options.errorCallback;
    const isAsync = options.isAsync;
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
                case 304: { // Success with Not Modified
                    let responseHeaders = parseResponseHeaders_1.parseResponseHeaders(request.getAllResponseHeaders());
                    let responseData = parseResponse_1.parseResponse(request.responseText, responseHeaders, responseParams);
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
                        var headers = parseResponseHeaders_1.parseResponseHeaders(request.getAllResponseHeaders());
                        let errorParsed = parseResponse_1.parseResponse(request.responseText, parseResponseHeaders_1.parseResponseHeaders(request.getAllResponseHeaders()), responseParams);
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
                    errorCallback(ErrorHelper_1.ErrorHelper.handleHttpError(error, {
                        status: request.status,
                        statusText: request.statusText,
                        headers: headers
                    }));
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
        let headers = parseResponseHeaders_1.parseResponseHeaders(request.getAllResponseHeaders());
        errorCallback(ErrorHelper_1.ErrorHelper.handleHttpError({
            status: request.status,
            statusText: request.statusText,
            message: request.responseText || "Network Error",
            headers: headers
        }));
        responseParams.length = 0;
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
        responseParams.length = 0;
        request = null;
    };
    data
        ? request.send(data)
        : request.send();
}
;
module.exports = xhrRequest;
