import { Core } from "../types";
import { ErrorHelper } from "./../helpers/ErrorHelper";
import { parseResponse } from "./helpers/parseResponse";
import { parseResponseHeaders } from "./helpers/parseResponseHeaders";

/**
 * Sends a request to given URL with given parameters
 *
 */
export class XhrWrapper {
    //for testing
    static afterSendEvent: () => void;
    static xhrRequest(options: Core.RequestOptions) {
        const data = options.data;
        const additionalHeaders = options.additionalHeaders;
        const responseParams = options.responseParams;
        const successCallback = options.successCallback;
        const errorCallback = options.errorCallback;
        const signal = options.abortSignal;

        if (signal?.aborted) {
            errorCallback(
                ErrorHelper.handleHttpError({
                    message: "Request cancelled",
                })
            );

            delete responseParams[options.requestId];
            return;
        }

        let request = new XMLHttpRequest();
        request.open(options.method, options.uri, options.isAsync || false);

        //set additional headers
        for (let key in additionalHeaders) {
            request.setRequestHeader(key, additionalHeaders[key]);
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

                        delete responseParams[options.requestId];
                        request = null as any;

                        successCallback(response);
                        break;
                    }
                    default:
                        if (!request) break; //response was handled somewhere else

                        // All other statuses are error cases.
                        let error;
                        let headers;
                        try {
                            headers = parseResponseHeaders(request.getAllResponseHeaders());
                            const errorParsed = parseResponse(
                                request.responseText,
                                parseResponseHeaders(request.getAllResponseHeaders()),
                                responseParams[options.requestId]
                            );

                            if (Array.isArray(errorParsed)) {
                                delete responseParams[options.requestId];
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

                        delete responseParams[options.requestId];
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
            delete responseParams[options.requestId];
            request = null as any;
        };

        request.ontimeout = function () {
            const headers = parseResponseHeaders(request.getAllResponseHeaders());
            errorCallback(
                ErrorHelper.handleHttpError({
                    status: request.status,
                    statusText: request.statusText,
                    message: request.responseText || "Request Timed Out",
                    headers: headers,
                })
            );
            delete responseParams[options.requestId];
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
            delete responseParams[options.requestId];
            request = null as any;
        };

        //manual abort/cancellation
        const abort = () => {
            if (!request) return;

            const headers = parseResponseHeaders(request.getAllResponseHeaders());

            errorCallback(
                ErrorHelper.handleHttpError({
                    status: request.status,
                    statusText: request.statusText,
                    message: "Request cancelled",
                    headers: headers,
                })
            );

            request.abort();

            delete responseParams[options.requestId];
            request = null as any;
        };

        if (signal) {
            signal.addEventListener("abort", abort);
        }

        data ? request.send(data) : request.send();

        //called for testing
        if (XhrWrapper.afterSendEvent) XhrWrapper.afterSendEvent();
    }
}
