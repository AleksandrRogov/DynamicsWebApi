var DWA = require('../dwa');
var ErrorHelper = require('../helpers/ErrorHelper');
var buildPreferHeader = require('./buildPreferHeader');

/**
 * @typedef {Object} ConvertedRequestOptions
 * @property {string} url URL (without query)
 * @property {string} query Query String
 * @property {Object} headers Heades object (always an Object; can be empty: {})
 */

/**
 * @typedef {Object} ConvertedRequest
 * @property {string} url URL (including Query String)
 * @property {Object} headers Heades object (always an Object; can be empty: {})
 */

/**
 * Converts optional parameters of the request to URL. If expand parameter exists this function is called recursively.
 *
 * @param {Object} request - Request object
 * @param {string} functionName - Name of the function that converts a request (for Error Handling)
 * @param {string} url - URL beginning (with required parameters)
 * @param {string} [joinSymbol] - URL beginning (with required parameters)
 * @param {Object} [config] - DynamicsWebApi config
 * @returns {ConvertedRequestOptions}
 */
function convertRequestOptions (request, functionName, url, joinSymbol, config) {
    var headers = {};
    var requestArray = [];
    joinSymbol = joinSymbol != null ? joinSymbol : "&";

    if (request) {
        if (request.navigationProperty) {
            ErrorHelper.stringParameterCheck(request.navigationProperty, "DynamicsWebApi." + functionName, "request.navigationProperty");
            url += "/" + request.navigationProperty;
        }

        if (request.select != null && request.select.length) {
            ErrorHelper.arrayParameterCheck(request.select, "DynamicsWebApi." + functionName, "request.select");

            if (functionName == "retrieve" && request.select.length == 1 && request.select[0].endsWith("/$ref")) {
                url += "/" + request.select[0];
            }
            else {
                if (request.select[0].startsWith("/") && functionName == "retrieve") {
                    if (request.navigationProperty == null) {
                        url += request.select.shift();
                    }
                    else {
                        request.select.shift();
                    }
                }

                //check if anything left in the array
                if (request.select.length) {
                    requestArray.push("$select=" + request.select.join(','));
                }
            }
        }

        if (request.filter) {
            ErrorHelper.stringParameterCheck(request.filter, "DynamicsWebApi." + functionName, "request.filter");
            requestArray.push("$filter=" + request.filter);
        }

        if (request.savedQuery) {
            requestArray.push("savedQuery=" + ErrorHelper.guidParameterCheck(request.savedQuery, "DynamicsWebApi." + functionName, "request.savedQuery"));
        }

        if (request.userQuery) {
            requestArray.push("userQuery=" + ErrorHelper.guidParameterCheck(request.userQuery, "DynamicsWebApi." + functionName, "request.userQuery"));
        }

        if (request.count) {
            ErrorHelper.boolParameterCheck(request.count, "DynamicsWebApi." + functionName, "request.count");
            requestArray.push("$count=" + request.count);
        }

        if (request.top && request.top > 0) {
            ErrorHelper.numberParameterCheck(request.top, "DynamicsWebApi." + functionName, "request.top");
            requestArray.push("$top=" + request.top);
        }

        if (request.orderBy != null && request.orderBy.length) {
            ErrorHelper.arrayParameterCheck(request.orderBy, "DynamicsWebApi." + functionName, "request.orderBy");
            requestArray.push("$orderby=" + request.orderBy.join(','));
        }

        var prefer = buildPreferHeader(request, functionName, config);

        if (prefer.length) {
            headers['Prefer'] = prefer;
        }

        if (request.ifmatch != null && request.ifnonematch != null) {
            throw new Error("DynamicsWebApi." + functionName + ". Either one of request.ifmatch or request.ifnonematch parameters should be used in a call, not both.")
        }

        if (request.ifmatch) {
            ErrorHelper.stringParameterCheck(request.ifmatch, "DynamicsWebApi." + functionName, "request.ifmatch");
            headers['If-Match'] = request.ifmatch;
        }

        if (request.ifnonematch) {
            ErrorHelper.stringParameterCheck(request.ifnonematch, "DynamicsWebApi." + functionName, "request.ifnonematch");
            headers['If-None-Match'] = request.ifnonematch;
        }

        if (request.impersonate) {
            ErrorHelper.stringParameterCheck(request.impersonate, "DynamicsWebApi." + functionName, "request.impersonate");
            headers['MSCRMCallerID'] = ErrorHelper.guidParameterCheck(request.impersonate, "DynamicsWebApi." + functionName, "request.impersonate");
        }

        if (request.token) {
            ErrorHelper.stringParameterCheck(request.token, "DynamicsWebApi." + functionName, "request.token");
            headers["Authorization"] = "Bearer " + request.token;
        }

        if (request.expand && request.expand.length) {
            ErrorHelper.stringOrArrayParameterCheck(request.expand, "DynamicsWebApi." + functionName, "request.expand");
            if (typeof request.expand === "string") {
                requestArray.push("$expand=" + encodeURI(request.expand));
            }
            else {
                var expandRequestArray = [];
                for (var i = 0; i < request.expand.length; i++) {
                    if (request.expand[i].property) {
                        var expandConverted = convertRequestOptions(request.expand[i], functionName + " $expand", null, ";");
                        var expandQuery = expandConverted.query;
                        if (expandQuery && expandQuery.length) {
                            expandQuery = "(" + expandQuery + ")";
                        }
                        expandRequestArray.push(request.expand[i].property + expandQuery);
                    }
                }
                if (expandRequestArray.length) {
                    requestArray.push("$expand=" + encodeURI(expandRequestArray.join(",")));
                }
            }
        }
    }

    return { url: url, query: requestArray.join(joinSymbol), headers: headers };
}

/**
 * Converts a request object to URL link
 *
 * @param {Object} request - Request object
 * @param {string} [functionName] - Name of the function that converts a request (for Error Handling only)
 * @param {Object} [config] - DynamicsWebApi config
 * @returns {ConvertedRequest}
 */
function convertRequest(request, functionName, config) {

    if (!request.collection) {
        ErrorHelper.parameterCheck(request.collection, "DynamicsWebApi." + functionName, "request.collection");
    }
    else {
        ErrorHelper.stringParameterCheck(request.collection, "DynamicsWebApi." + functionName, "request.collection");
    }

    var url = request.collection.toLowerCase();

    if (request.id) {
        request.id = ErrorHelper.guidParameterCheck(request.id, "DynamicsWebApi." + functionName, "request.id");
        url += "(" + request.id + ")";
    }

    var result = convertRequestOptions(request, functionName, url, '&', config);

    if (result.query)
        result.url += "?" + encodeURI(result.query);

    return { url: result.url, headers: result.headers };
};

var RequestConverter = {
    convertRequestOptions: convertRequestOptions,
    convertRequest: convertRequest
};

module.exports = RequestConverter;