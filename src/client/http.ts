import http from "node:http";
import https from "node:https";
import { HttpProxyAgent } from "http-proxy-agent";
import { HttpsProxyAgent } from "https-proxy-agent";
import type * as Core from "../types.js";
import { ErrorHelper } from "./../helpers/ErrorHelper.js";
import { parseResponse } from "./helpers/parseResponse.js";

const agents: { [key: string]: http.Agent } = {};

const getAgent = (options: Core.RequestOptions, protocol: string): http.Agent => {
    const isHttp = protocol === "http";
    const proxy = options.proxy;
    const agentName = proxy ? proxy.url : protocol;

    if (!agents[agentName]) {
        if (proxy) {
            const proxyUrl = new URL(proxy.url);

            if (proxy.auth) {
                proxyUrl.username = proxy.auth.username;
                proxyUrl.password = proxy.auth.password;
            }

            const proxyAgent = isHttp ? HttpProxyAgent : HttpsProxyAgent;
            agents[agentName] = new proxyAgent(proxyUrl, {
                keepAlive: true,
                maxSockets: Infinity,
            });
        } else {
            const protocolInterface = isHttp ? http : https;

            agents[agentName] = new protocolInterface.Agent({
                keepAlive: true,
                maxSockets: Infinity,
            });
        }
    }

    return agents[agentName];
};

export function executeRequest(options: Core.RequestOptions): Promise<Core.WebApiResponse> {
    return new Promise((resolve, reject) => {
        _executeRequest(options, resolve, reject);
    });
}

/**
 * Sends a request to given URL with given parameters
 *
 */
function _executeRequest(
    options: Core.RequestOptions,
    successCallback: (response: Core.WebApiResponse) => void,
    errorCallback: (error: Core.WebApiErrorResponse | Core.WebApiErrorResponse[]) => void,
) {
    const data = options.data;
    const headers = options.headers;
    const responseParams = options.responseParams;
    const signal = options.abortSignal;

    const httpHeaders: http.OutgoingHttpHeaders = {};

    if (data) {
        httpHeaders["Content-Type"] = headers["Content-Type"];
        httpHeaders["Content-Length"] = data.length;

        delete headers["Content-Type"];
    }

    //set additional headers
    for (let key in headers) {
        httpHeaders[key] = headers[key];
    }
    const parsedUrl = new URL(options.uri);
    const protocol = parsedUrl.protocol?.slice(0, -1) || "https";
    const protocolInterface = protocol === "http" ? http : https;

    const internalOptions: http.RequestOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: options.method,
        timeout: options.timeout || 0,
        headers: httpHeaders,
        signal: signal,
    };

    //support environment variables
    if (!options.proxy && process.env[`${protocol}_proxy`]) {
        options.proxy = {
            url: process.env[`${protocol}_proxy`]!,
        };
    }

    internalOptions.agent = getAgent(options, protocol);

    if (options.proxy) {
        const hostHeader = new URL(options.proxy.url).host;
        if (hostHeader) httpHeaders.host = hostHeader;
    }

    const request = protocolInterface.request(internalOptions, function (res) {
        let rawData = "";
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
            rawData += chunk;
        });
        res.on("end", function () {
            if (res.statusCode && ((res.statusCode >= 200 && res.statusCode < 300) || res.statusCode === 304)) {
                // Success with Not Modified
                let responseData = parseResponse(rawData, res.headers as Record<string, string>, responseParams[options.requestId]);

                let response = {
                    data: responseData,
                    headers: res.headers as any,
                    status: res.statusCode,
                };

                successCallback(response);
            } else {
                // All other statuses are error cases.
                let dataverseError: Record<string, string>;
                try {
                    var errorParsed = parseResponse(rawData, res.headers as Record<string, string>, responseParams[options.requestId]);

                    if (Array.isArray(errorParsed)) {
                        errorCallback(errorParsed);
                        return;
                    }

                    dataverseError = errorParsed.hasOwnProperty("error") && errorParsed.error ? errorParsed.error : { message: errorParsed.Message };
                } catch (e) {
                    if (rawData.length > 0) {
                        dataverseError = { message: rawData };
                    } else {
                        dataverseError = { message: "Unexpected Error" };
                    }
                }

                errorCallback(
                    ErrorHelper.handleHttpError(dataverseError, {
                        status: res.statusCode,
                        statusText: "",
                        statusMessage: res.statusMessage,
                        headers: res.headers,
                    }),
                );
            }
        });
    });

    if (internalOptions.timeout) {
        request.setTimeout(internalOptions.timeout, function () {
            request.destroy();
        });
    }

    request.on("error", function (error) {
        errorCallback(error);
    });

    if (data) {
        request.write(data);
    }

    request.end();
}
