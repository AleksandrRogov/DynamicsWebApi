import { Core } from "../types";
import { ErrorHelper } from "./../helpers/ErrorHelper";
import { parseResponse } from "./helpers/parseResponse";
import { parseResponseHeaders } from "./helpers/parseResponseHeaders";

/**
 * Sends a request to given URL with given parameters
 *
 */
function xhrRequest (options: Core.RequestOptions) {
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
                case 304: {// Success with Not Modified
					let responseHeaders = parseResponseHeaders(request.getAllResponseHeaders());
                    let responseData = parseResponse(request.responseText, responseHeaders, responseParams);

                    var response = {
                        data: responseData,
                        headers: responseHeaders,
                        status: request.status
					};

					request = null;
					responseParams.length = 0;

                    successCallback(response);
                    break;
                }
                default: // All other statuses are error cases.
                    var error;
					try {
						var headers = parseResponseHeaders(request.getAllResponseHeaders());
                        let errorParsed = parseResponse(request.responseText, parseResponseHeaders(request.getAllResponseHeaders()), responseParams);

                        if (Array.isArray(errorParsed)) {
                            errorCallback(errorParsed);
                            break;
                        }

                        error = errorParsed.error;
                    } catch (e) {
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
					}

					request = null;
					responseParams.length = 0;

					errorCallback(ErrorHelper.handleHttpError(error, errorParameters));

                    break;
            }
        }
    };

    if (options.timeout) {
        request.timeout = options.timeout;
    }

	request.onerror = function () {
		let headers = parseResponseHeaders(request.getAllResponseHeaders());
        errorCallback(ErrorHelper.handleHttpError({
            status: request.status,
            statusText: request.statusText,
			message: request.responseText || "Network Error",
			headers: headers
        }));
        responseParams.length = 0;
        request = null;
    };

    request.ontimeout = function () {
		let headers = parseResponseHeaders(request.getAllResponseHeaders());
		errorCallback(ErrorHelper.handleHttpError({
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
};

export = xhrRequest;