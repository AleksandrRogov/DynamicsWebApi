var http = require('http');
var https = require('https');
var url = require('url');
var parseResponse = require('./helpers/parseResponse');

/**
 * Sends a request to given URL with given parameters
 *
 * @param {string} method - Method of the request.
 * @param {string} uri - Request URI.
 * @param {Function} successCallback - A callback called on success of the request.
 * @param {Function} errorCallback - A callback called when a request failed.
 * @param {string} [data] - Data to send in the request.
 * @param {Object} [additionalHeaders] - Additional headers. IMPORTANT! This object does not contain default headers needed for every request.
 */
var httpRequest = function (method, uri, data, additionalHeaders, successCallback, errorCallback) {
    var headers = {};
    //    "Accept": "application/json",
    //    "OData-MaxVersion": "4.0",
    //    "OData-Version": "4.0"
    //};

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
    var isHttp = parsedUrl.protocol === 'http:';

    var options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.path,
        method: method,
        headers: headers,
        //agent: agent,
        //auth: auth
    };

    var interface = isHttp ? http : https;

    var request = interface.request(options, function (res) {
        var rawData = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            rawData += chunk;
        })
        res.on('end', function () {
            switch (res.statusCode) {
                case 200: // Success with content returned in response body.
                case 201: // Success with content returned in response body.
                case 204: // Success with no content returned in response body.
                case 304: {// Success with Not Modified
                    var responseData = parseResponse(rawData);

                    var response = {
                        data: responseData,
                        headers: res.headers,
                        status: res.statusCode
                    };

                    successCallback(response);
                    break;
                }
                default: // All other statuses are error cases.
                    var error;
                    try {
                        var errorParsed = JSON.parse(rawData);

                        error = errorParsed.hasOwnProperty('error') && errorParsed.error
                            ? errorParsed.error
                            : { message: errorParsed.Message };
                    } catch (e) {
                        if (rawData.length > 0) {
                            error = { message: rawData };
                        }
                        else {
                            error = { message: "Unexpected Error" };
                        }
                    }
                    error.status = res.statusCode;
                    error.statusText = request.statusText;
                    errorCallback(error);
                    break;
            }
        });
    });

    request.on('error', function (error) {
        errorCallback(error);
    });

    if (data) {
        request.write(data);
    }

    request.end();
};

module.exports = httpRequest;