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
	static afterSendEvent: Function = null;
	static xhrRequest(options: Core.RequestOptions) {
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
					case 206: // Success with partial content.
					case 304: {// Success with Not Modified
						let responseHeaders = parseResponseHeaders(request.getAllResponseHeaders());
						let responseData = parseResponse(request.responseText, responseHeaders, responseParams[options.requestId]);

						var response = {
							data: responseData,
							headers: responseHeaders,
							status: request.status
						};

						delete responseParams[options.requestId];
						request = null;

						successCallback(response);
						break;
					}
					default: // All other statuses are error cases.
						var error;
						try {
							var headers = parseResponseHeaders(request.getAllResponseHeaders());
							let errorParsed = parseResponse(request.responseText, parseResponseHeaders(request.getAllResponseHeaders()), responseParams[options.requestId]);

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

						delete responseParams[options.requestId];
						request = null;

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
			delete responseParams[options.requestId];
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
			delete responseParams[options.requestId];
			request = null;
		};

		data
			? request.send(data)
			: request.send();

		//called for testing
		if (XhrWrapper.afterSendEvent)
			XhrWrapper.afterSendEvent();
	}
}