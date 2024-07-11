import type * as Core from "../types";
import { ErrorHelper } from "./../helpers/ErrorHelper";
import { parseResponse } from "./helpers/parseResponse";
import { parseResponseHeaders } from "./helpers/parseResponseHeaders";

export function executeRequest(options: Core.RequestOptions): Promise<Core.WebApiResponse> {
    return new Promise((resolve, reject) => {
        _executeRequest(options, resolve, reject);
    });
}

function _executeRequest(
    options: Core.RequestOptions,
    successCallback: (response: Core.WebApiResponse) => void,
    errorCallback: (error: Core.WebApiErrorResponse | Core.WebApiErrorResponse[]) => void
) {
    const data = options.data;
    const headers = options.headers;
    const responseParams = options.responseParams;
    const signal = options.abortSignal;

    if (signal?.aborted) {
        errorCallback(
            ErrorHelper.handleHttpError({
                name: "AbortError",
                code: 20,
                message: "The user aborted a request.",
            })
        );

        return;
    }

    let request = new XMLHttpRequest();
    request.open(options.method, options.uri, options.isAsync || false);

    //set additional headers
    for (let key in headers) {
        request.setRequestHeader(key, headers[key]);
    }

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (signal) signal.removeEventListener("abort", abort);

            switch (request.status) {
                case 200: // Success with content returned in response body.
                case 201: // Success with content returned in response body.
                case 204: // Success with no content returned in response body.
                case 206: // Success with partial content.
                case 304: {
                    // Success with Not Modified
                    const responseHeaders = parseResponseHeaders(request.getAllResponseHeaders());
                    const responseData = parseResponse(request.responseText, responseHeaders, responseParams[options.requestId]);

                    const response = {
                        data: responseData,
                        headers: responseHeaders,
                        status: request.status,
                    };

                    request = null as any;

                    successCallback(response);
                    break;
                }
                case 0:
                    break; //response will be handled by onerror
                default:
                    if (!request) break; //response was handled somewhere else

                    // All other statuses are error cases.
                    let error;
                    let headers;
                    try {
                        headers = parseResponseHeaders(request.getAllResponseHeaders());
                        const errorParsed = parseResponse(request.responseText, headers, responseParams[options.requestId]);

                        if (Array.isArray(errorParsed)) {
                            errorCallback(errorParsed);
                            break;
                        }

                        error = errorParsed.error;
                    } catch (e) {
                        if (request.response.length > 0) {
                            error = { message: request.response };
                        } else {
                            error = { message: "Unexpected Error" };
                        }
                    }

                    const errorParameters = {
                        status: request.status,
                        statusText: request.statusText,
                        headers: headers,
                    };

                    request = null as any;

                    errorCallback(ErrorHelper.handleHttpError(error, errorParameters));

                    break;
            }
        }
    };

    if (options.timeout) {
        request.timeout = options.timeout;
    }

    request.onerror = function () {
        const headers = parseResponseHeaders(request.getAllResponseHeaders());
        errorCallback(
            ErrorHelper.handleHttpError({
                status: request.status,
                statusText: request.statusText,
                message: request.responseText || "Network Error",
                headers: headers,
            })
        );
        request = null as any;
    };

    request.ontimeout = function () {
        const headers = parseResponseHeaders(request.getAllResponseHeaders());
        errorCallback(
            ErrorHelper.handleHttpError({
                name: "TimeoutError",
                status: request.status,
                statusText: request.statusText,
                message: request.responseText || "Request Timed Out",
                headers: headers,
            })
        );
        request = null as any;
    };

    //browser abort
    request.onabort = function () {
        if (!request) return;

        const headers = parseResponseHeaders(request.getAllResponseHeaders());
        errorCallback(
            ErrorHelper.handleHttpError({
                status: request.status,
                statusText: request.statusText,
                message: "Request aborted",
                headers: headers,
            })
        );
        request = null as any;
    };

    //manual abort/cancellation
    const abort = () => {
        if (!request) return;

        const headers = parseResponseHeaders(request.getAllResponseHeaders());

        errorCallback(
            ErrorHelper.handleHttpError({
                name: "AbortError",
                code: 20,
                status: request.status,
                statusText: request.statusText,
                message: "The user aborted a request.",
                headers: headers,
            })
        );

        request.abort();

        request = null as any;
    };

    if (signal) {
        signal.addEventListener("abort", abort);
    }

    data ? request.send(data) : request.send();

    //called for testing
    if (XhrWrapper.afterSendEvent) XhrWrapper.afterSendEvent();
}

/**
 * Sends a request to given URL with given parameters
 */
export class XhrWrapper {
    //for testing
    static afterSendEvent: () => void;
}
