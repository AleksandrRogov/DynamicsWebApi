var http = require('http');
var https = require('https');
var url = require('url');
var HttpProxyAgent = require('http-proxy-agent');
var HttpsProxyAgent = require('https-proxy-agent');
var parseResponse = require('./helpers/parseResponse');
var ErrorHelper = require('../helpers/ErrorHelper');

var agents = {};

function getAgent(options, protocol) {
	var isHttp = protocol === 'http';

	var proxy = options.proxy;
	var agentName = proxy ? proxy.url : protocol;

	if (!agents[agentName]) {
		if (proxy) {
			var parsedProxyUrl = url.parse(proxy.url);
			var proxyAgent = isHttp ? HttpProxyAgent : HttpsProxyAgent;

			var proxyOptions = {
				host: parsedProxyUrl.hostname,
				port: parsedProxyUrl.port,
				protocol: parsedProxyUrl.protocol
			}

			if (proxy.auth)
				proxyOptions.auth = proxy.auth.username + ':' + proxy.auth.password;
			else if (parsedProxyUrl.auth)
				proxyOptions.auth = parsedProxyUrl.auth;

			agents[agentName] = new proxyAgent(proxyOptions);
		}
		else {
			var protocolInterface = isHttp ? http : https;

			agents[agentName] = new protocolInterface.Agent({
				keepAlive: true,
				maxSockets: Infinity
			});
		}
	}

	return agents[agentName];
}

/**
 * Sends a request to given URL with given parameters
 *
 */
var httpRequest = function (options) {
	var method = options.method;
	var uri = options.uri;
	var data = options.data;
	var additionalHeaders = options.additionalHeaders;
	var responseParams = options.responseParams;
	var successCallback = options.successCallback;
	var errorCallback = options.errorCallback;
	var timeout = options.timeout;
	var requestId = options.requestId;
	var proxy = options.proxy;

	var headers = {};

	if (data) {
		headers["Content-Type"] = additionalHeaders['Content-Type'];
		headers["Content-Length"] = data.length;

		delete additionalHeaders['Content-Type'];
	}

	//set additional headers
	for (var key in additionalHeaders) {
		headers[key] = additionalHeaders[key];
	}

	var parsedUrl = url.parse(uri);
	var protocol = parsedUrl.protocol.slice(0, -1);
	var protocolInterface = protocol === 'http' ? http : https;

	var internalOptions = {
		hostname: parsedUrl.hostname,
		port: parsedUrl.port,
		path: parsedUrl.path,
		method: method,
		timeout: timeout,
		headers: headers
	};

	//support environment variables
	if (!proxy && process.env[`${protocol}_proxy`]) {
		options.proxy = {
			url: process.env[`${protocol}_proxy`]
		}
	}

	internalOptions.agent = getAgent(options, protocol);

	if (proxy) {
		headers.host = url.parse(proxy.url).host;
	}

	var request = protocolInterface.request(internalOptions, function (res) {
		var rawData = '';
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			rawData += chunk;
		});
		res.on('end', function () {
			switch (res.statusCode) {
				case 200: // Success with content returned in response body.
				case 201: // Success with content returned in response body.
				case 204: // Success with no content returned in response body.
				case 206: //Success with partial content
				case 304: {// Success with Not Modified
					var responseData = parseResponse(rawData, res.headers, responseParams[requestId]);

					var response = {
						data: responseData,
						headers: res.headers,
						status: res.statusCode
					};

					delete responseParams[requestId];

					successCallback(response);
					break;
				}
				default: // All other statuses are error cases.
					var crmError;
					try {
						var errorParsed = parseResponse(rawData, res.headers, responseParams[requestId]);

						if (Array.isArray(errorParsed)) {
							delete responseParams[requestId];
							errorCallback(errorParsed);
							break;
						}

						crmError = errorParsed.hasOwnProperty('error') && errorParsed.error
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

					delete responseParams[requestId];

					errorCallback(ErrorHelper.handleHttpError(crmError, {
						status: res.statusCode, statusText: request.statusText, statusMessage: res.statusMessage, headers: res.headers
					}));

					break;
			}
		});
	});

	if (internalOptions.timeout) {
		request.setTimeout(internalOptions.timeout, function () {
			request.abort();
		});
	}

	request.on('error', function (error) {
		delete responseParams[requestId];
		errorCallback(error);
	});

	if (data) {
		request.write(data);
	}

	request.end();
};

module.exports = httpRequest;