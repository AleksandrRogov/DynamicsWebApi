var parseResponse = require('./helpers/parseResponse');
var parseResponseHeaders = require('./helpers/parseResponseHeaders');
var ErrorHelper = require('../helpers/ErrorHelper');

if (!Array.isArray) {
	require("../polyfills/Array-es6");
}

/**
 * Sends a request to given URL with given parameters
 *
 */

let xhrWrapper = {
	//for testing
	afterSendEvent: null,
	xhrRequest: function (options) {
		var method = options.method;
		var uri = options.uri;
		var data = options.data;
		var additionalHeaders = options.additionalHeaders;
		var responseParams = options.responseParams;
		var successCallback = options.successCallback;
		var errorCallback = options.errorCallback;
		var isAsync = options.isAsync;
		var requestId = options.requestId;


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
					case 206: //Success with partial content
					case 304: {// Success with Not Modified
						var responseHeaders = parseResponseHeaders(request.getAllResponseHeaders());
						var responseData = parseResponse(request.responseText, responseHeaders, responseParams[requestId]);

						var response = {
							data: responseData,
							headers: responseHeaders,
							status: request.status
						};

						delete responseParams[requestId];
						request = null;

						successCallback(response);

						break;
					}
					default: // All other statuses are error cases.
						var error;
						try {
							var headers = parseResponseHeaders(request.getAllResponseHeaders());
							var errorParsed = parseResponse(request.responseText, headers, responseParams[requestId]);

							if (Array.isArray(errorParsed)) {
								delete responseParams[requestId];
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

						var errorResponse = {
							status: request.status,
							statusText: request.statusText,
							headers: headers
						}

						delete responseParams[requestId];
						request = null;

						errorCallback(ErrorHelper.handleHttpError(error, errorResponse));

						break;
				}
			}
		};

		if (options.timeout) {
			request.timeout = options.timeout;
		}

		request.onerror = function () {
			var headers = parseResponseHeaders(request.getAllResponseHeaders());
			errorCallback(ErrorHelper.handleHttpError({
				status: request.status,
				statusText: request.statusText,
				message: request.responseText || "Network Error",
				headers: headers
			}));
			delete responseParams[requestId];
			request = null;
		};

		request.ontimeout = function () {
			var headers = parseResponseHeaders(request.getAllResponseHeaders());
			errorCallback(ErrorHelper.handleHttpError({
				status: request.status,
				statusText: request.statusText,
				message: request.responseText || "Request Timed Out",
				headers: headers
			}));
			delete responseParams[requestId];
			request = null;
		};

		data
			? request.send(data)
			: request.send();

		//called for testing
		if (xhrWrapper.afterSendEvent)
			xhrWrapper.afterSendEvent();
	}
}

module.exports = xhrWrapper;
