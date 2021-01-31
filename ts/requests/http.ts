import * as http from "http";
import * as https from "https";
import * as url from "url";
import { Core } from "../types";
import { ErrorHelper } from "./../helpers/ErrorHelper";
import { parseResponse } from "./helpers/parseResponse";

/**
 * Sends a request to given URL with given parameters
 *
 */
function httpRequest(options: Core.RequestOptions) {
	const data = options.data;
	const additionalHeaders = options.additionalHeaders;
	const responseParams = options.responseParams;
	const successCallback = options.successCallback;
	const errorCallback = options.errorCallback;

	var headers: http.OutgoingHttpHeaders = {};

	if (data) {
		headers["Content-Type"] = additionalHeaders["Content-Type"];
		headers["Content-Length"] = data.length;

		delete additionalHeaders["Content-Type"];
	}

	//set additional headers
	for (var key in additionalHeaders) {
		headers[key] = additionalHeaders[key];
	}

	var parsedUrl = url.parse(options.uri);
	var protocol = parsedUrl.protocol.replace(":", "");
	var protocolInterface = protocol === "http" ? http : https;

	var internalOptions: http.RequestOptions = {
		hostname: parsedUrl.hostname,
		port: parsedUrl.port,
		path: parsedUrl.path,
		method: options.method,
		timeout: options.timeout,
		headers: headers
	};

	if (process.env[`${protocol}_proxy`]) {
        /*
         * Proxied requests don"t work with Node"s https module so use http to
         * talk to the proxy server regardless of the endpoint protocol. This
         * is unsuitable for environments where requests are expected to be
         * using end-to-end TLS.
         */
		protocolInterface = http;
		var proxyUrl = url.parse(process.env.http_proxy);
		headers.host = parsedUrl.host;
		internalOptions = {
			hostname: proxyUrl.hostname,
			port: proxyUrl.port,
			path: parsedUrl.href,
			method: options.method,
			timeout: options.timeout,
			headers: headers
		};
	}

	var request = protocolInterface.request(internalOptions, function (res) {
		let rawData = "";
		res.setEncoding("utf8");
		res.on("data", function (chunk) {
			rawData += chunk;
		});
		res.on("end", function () {
			switch (res.statusCode) {
				case 200: // Success with content returned in response body.
				case 201: // Success with content returned in response body.
				case 204: // Success with no content returned in response body.
				case 304: {// Success with Not Modified
					let responseData = parseResponse(rawData, res.headers, responseParams[options.requestId]);

					let response = {
						data: responseData,
						headers: res.headers,
						status: res.statusCode
					};

					delete responseParams[options.requestId];

					successCallback(response);
					break;
				}
				default: // All other statuses are error cases.
					let crmError;
					try {
						var errorParsed = parseResponse(rawData, res.headers, responseParams[options.requestId]);

						if (Array.isArray(errorParsed)) {
							errorCallback(errorParsed);
							break;
						}

						crmError = errorParsed.hasOwnProperty("error") && errorParsed.error
							? errorParsed.error
							: { message: errorParsed.Message };
					} catch (e) {
						if (rawData.length > 0) {
							crmError = { message: rawData };
						}
						else {
							crmError = { message: "Unexpected Error" };
						}
					}

					delete responseParams[options.requestId];

					errorCallback(ErrorHelper.handleHttpError(crmError, { status: res.statusCode, statusText: "", statusMessage: res.statusMessage, headers: res.headers }));
					break;
			}
		});
	});

	if (internalOptions.timeout) {
		request.setTimeout(internalOptions.timeout, function () {
			request.abort();
		});
	}

	request.on("error", function (error) {
		delete responseParams[options.requestId];
		errorCallback(error);
	});

	if (data) {
		request.write(data);
	}

	request.end();
}

export = httpRequest;