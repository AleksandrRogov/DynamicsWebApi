"use strict";
const http = require("http");
const https = require("https");
const url = require("url");
const http_proxy_agent_1 = require("http-proxy-agent");
const https_proxy_agent_1 = require("https-proxy-agent");
const ErrorHelper_1 = require("./../helpers/ErrorHelper");
const parseResponse_1 = require("./helpers/parseResponse");
const agents = {};
const getAgent = (options, protocol) => {
    const isHttp = protocol === "http";
    const proxy = options.proxy;
    const agentName = proxy ? proxy.url : protocol;
    if (!agents[agentName]) {
        if (proxy) {
            const parsedProxyUrl = url.parse(proxy.url);
            const proxyAgent = isHttp ? http_proxy_agent_1.HttpProxyAgent : https_proxy_agent_1.HttpsProxyAgent;
            const proxyOptions = {
                host: parsedProxyUrl.hostname,
                port: parsedProxyUrl.port,
                protocol: parsedProxyUrl.protocol,
            };
            if (proxy.auth)
                proxyOptions.auth = proxy.auth.username + ":" + proxy.auth.password;
            else if (parsedProxyUrl.auth)
                proxyOptions.auth = parsedProxyUrl.auth;
            agents[agentName] = new proxyAgent(proxyOptions);
        }
        else {
            const protocolInterface = isHttp ? http : https;
            agents[agentName] = new protocolInterface.Agent({
                keepAlive: true,
                maxSockets: Infinity,
            });
        }
    }
    return agents[agentName];
};
/**
 * Sends a request to given URL with given parameters
 *
 */
function httpRequest(options) {
    const data = options.data;
    const additionalHeaders = options.additionalHeaders;
    const responseParams = options.responseParams;
    const successCallback = options.successCallback;
    const errorCallback = options.errorCallback;
    const headers = {};
    if (data) {
        headers["Content-Type"] = additionalHeaders["Content-Type"];
        headers["Content-Length"] = data.length;
        delete additionalHeaders["Content-Type"];
    }
    //set additional headers
    for (let key in additionalHeaders) {
        headers[key] = additionalHeaders[key];
    }
    const parsedUrl = url.parse(options.uri);
    const protocol = parsedUrl.protocol.slice(0, -1);
    let protocolInterface = protocol === "http" ? http : https;
    let internalOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.path,
        method: options.method,
        timeout: options.timeout,
        headers: headers,
    };
    //support environment variables
    if (!options.proxy && process.env[`${protocol}_proxy`]) {
        options.proxy = {
            url: process.env[`${protocol}_proxy`],
        };
    }
    internalOptions.agent = getAgent(options, protocol);
    if (options.proxy) {
        headers.host = url.parse(options.proxy.url).host;
    }
    const request = protocolInterface.request(internalOptions, function (res) {
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
                case 206: //Success with partial content
                case 304: {
                    // Success with Not Modified
                    let responseData = parseResponse_1.parseResponse(rawData, res.headers, responseParams[options.requestId]);
                    let response = {
                        data: responseData,
                        headers: res.headers,
                        status: res.statusCode,
                    };
                    delete responseParams[options.requestId];
                    successCallback(response);
                    break;
                }
                default:
                    // All other statuses are error cases.
                    let crmError;
                    try {
                        var errorParsed = parseResponse_1.parseResponse(rawData, res.headers, responseParams[options.requestId]);
                        if (Array.isArray(errorParsed)) {
                            delete responseParams[options.requestId];
                            errorCallback(errorParsed);
                            break;
                        }
                        crmError = errorParsed.hasOwnProperty("error") && errorParsed.error ? errorParsed.error : { message: errorParsed.Message };
                    }
                    catch (e) {
                        if (rawData.length > 0) {
                            crmError = { message: rawData };
                        }
                        else {
                            crmError = { message: "Unexpected Error" };
                        }
                    }
                    delete responseParams[options.requestId];
                    errorCallback(ErrorHelper_1.ErrorHelper.handleHttpError(crmError, {
                        status: res.statusCode,
                        statusText: "",
                        statusMessage: res.statusMessage,
                        headers: res.headers,
                    }));
                    break;
            }
        });
    });
    if (internalOptions.timeout) {
        request.setTimeout(internalOptions.timeout, function () {
            delete responseParams[options.requestId];
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
module.exports = httpRequest;
