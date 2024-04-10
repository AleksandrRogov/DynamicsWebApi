﻿"use strict";
var DWA = require("../dwa");
var ErrorHelper = require("../helpers/ErrorHelper");
var buildPreferHeader = require("./buildPreferHeader");

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
 * @property {boolean} async
 */

/**
 * Converts optional parameters of the request to URL. If expand parameter exists this function is called recursively.
 *
 * @param {Object} request - Request object
 * @param {string} functionName - Name of the function that converts a request (for Error Handling)
 * @param {string} url - URL beginning (with required parameters)
 * @param {string} [joinSymbol] - URL beginning (with required parameters)
 * @param {Object} [config] - DynamicsWebApi config
 * @returns {ConvertedRequestOptions} Additional options in request
 */
function convertRequestOptions(request, functionName, url, joinSymbol, config) {
	var headers = {};
	var requestArray = [];
	joinSymbol = joinSymbol != null ? joinSymbol : "&";

	if (request) {
		if (request.navigationProperty) {
			ErrorHelper.stringParameterCheck(request.navigationProperty, "DynamicsWebApi." + functionName, "request.navigationProperty");
			url += "/" + request.navigationProperty;

			if (request.navigationPropertyKey) {
				var navigationKey = ErrorHelper.keyParameterCheck(
					request.navigationPropertyKey,
					"DynamicsWebApi." + functionName,
					"request.navigationPropertyKey"
				);
				url += "(" + navigationKey + ")";
			}

			if (request.navigationProperty === "Attributes") {
				if (request.metadataAttributeType) {
					ErrorHelper.stringParameterCheck(request.metadataAttributeType, "DynamicsWebApi." + functionName, "request.metadataAttributeType");
					url += "/" + request.metadataAttributeType;
				}
			}
		}

		if (request.select != null && request.select.length) {
			ErrorHelper.arrayParameterCheck(request.select, "DynamicsWebApi." + functionName, "request.select");

			if (functionName == "retrieve" && request.select.length == 1 && request.select[0].endsWith("/$ref")) {
				url += "/" + request.select[0];
			} else {
				if (request.select[0].startsWith("/") && functionName == "retrieve") {
					if (request.navigationProperty == null) {
						url += request.select.shift();
					} else {
						request.select.shift();
					}
				}

				//check if anything left in the array
				if (request.select.length) {
					requestArray.push("$select=" + request.select.join(","));
				}
			}
		}

		if (request.filter) {
			ErrorHelper.stringParameterCheck(request.filter, "DynamicsWebApi." + functionName, "request.filter");
			var removeBracketsFromGuidReg = /[^"']{([\w\d]{8}[-]?(?:[\w\d]{4}[-]?){3}[\w\d]{12})}(?:[^"']|$)/g;
			var filterResult = request.filter;

			//fix bug 2018-06-11
			var m;
			while ((m = removeBracketsFromGuidReg.exec(filterResult)) !== null) {
				var replacement = m[0].endsWith(")") ? ")" : " ";
				filterResult = filterResult.replace(m[0], " " + m[1] + replacement);
			}

			requestArray.push("$filter=" + encodeURIComponent(filterResult));
		}

		if (request.fieldName) {
			ErrorHelper.stringParameterCheck(request.fieldName, "DynamicsWebApi." + functionName, "request.fieldName");
			url += "/" + request.fieldName;
		}

		if (request.savedQuery) {
			requestArray.push("savedQuery=" + ErrorHelper.guidParameterCheck(request.savedQuery, "DynamicsWebApi." + functionName, "request.savedQuery"));
		}

		if (request.userQuery) {
			requestArray.push("userQuery=" + ErrorHelper.guidParameterCheck(request.userQuery, "DynamicsWebApi." + functionName, "request.userQuery"));
		}

		if (request.apply) {
			ErrorHelper.stringParameterCheck(request.apply, "DynamicsWebApi." + functionName, "request.apply");
			requestArray.push("$apply=" + request.apply);
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
			requestArray.push("$orderby=" + request.orderBy.join(","));
		}

		if (request.partitionId) {
			ErrorHelper.stringParameterCheck(request.partitionId, "DynamicsWebApi." + functionName, "request.partitionId");
			requestArray.push("partitionid='" + request.partitionId + "'");
		}

		if (request.downloadSize) {
			ErrorHelper.stringParameterCheck(request.downloadSize, "DynamicsWebApi." + functionName, "request.downloadSize");
			requestArray.push("size=" + request.downloadSize);
		}

		if (request.fileName) {
			ErrorHelper.stringParameterCheck(request.fileName, "DynamicsWebApi." + functionName, "request.fileName");
			requestArray.push("x-ms-file-name=" + request.fileName);
		}

		if (request.queryParams != null && request.queryParams.length) {
			ErrorHelper.arrayParameterCheck(request.queryParams, "DynamicsWebApi." + functionName, "request.queryParams");
			requestArray.push(request.queryParams.join("&"));
		}

		var prefer = buildPreferHeader(request, functionName, config);

		if (prefer.length) {
			headers["Prefer"] = prefer;
		}

		if (request.ifmatch != null && request.ifnonematch != null) {
			throw new Error(
				"DynamicsWebApi." + functionName + ". Either one of request.ifmatch or request.ifnonematch parameters should be used in a call, not both."
			);
		}

		if (request.transferMode) {
			headers["x-ms-transfer-mode"] = request.transferMode;
		}

		if (request.ifmatch) {
			ErrorHelper.stringParameterCheck(request.ifmatch, "DynamicsWebApi." + functionName, "request.ifmatch");
			headers["If-Match"] = request.ifmatch;
		}

		if (request.ifnonematch) {
			ErrorHelper.stringParameterCheck(request.ifnonematch, "DynamicsWebApi." + functionName, "request.ifnonematch");
			headers["If-None-Match"] = request.ifnonematch;
		}

		if (request.impersonate) {
			ErrorHelper.stringParameterCheck(request.impersonate, "DynamicsWebApi." + functionName, "request.impersonate");
			headers["MSCRMCallerID"] = ErrorHelper.guidParameterCheck(request.impersonate, "DynamicsWebApi." + functionName, "request.impersonate");
		}

		if (request.impersonateAAD) {
			ErrorHelper.stringParameterCheck(request.impersonateAAD, "DynamicsWebApi." + functionName, "request.impersonateAAD");
			headers["CallerObjectId"] = ErrorHelper.guidParameterCheck(request.impersonateAAD, "DynamicsWebApi." + functionName, "request.impersonateAAD");
		}

		if (request.token) {
			ErrorHelper.stringParameterCheck(request.token, "DynamicsWebApi." + functionName, "request.token");
			headers["Authorization"] = "Bearer " + request.token;
		}

		if (request.duplicateDetection) {
			ErrorHelper.boolParameterCheck(request.duplicateDetection, "DynamicsWebApi." + functionName, "request.duplicateDetection");
			headers["MSCRM.SuppressDuplicateDetection"] = "false";
		}

		if (request.bypassCustomPluginExecution) {
			ErrorHelper.boolParameterCheck(request.bypassCustomPluginExecution, "DynamicsWebApi." + functionName, "request.bypassCustomPluginExecution");
			headers["MSCRM.BypassCustomPluginExecution"] = "true";
		}

		if (request.entity) {
			ErrorHelper.parameterCheck(request.entity, "DynamicsWebApi." + functionName, "request.entity");
		}

		if (request.data) {
			ErrorHelper.parameterCheck(request.data, "DynamicsWebApi." + functionName, "request.data");
		}

		if (request.contentRange) {
			ErrorHelper.stringParameterCheck(request.contentRange, "DynamicsWebApi." + functionName, "request.contentRange");
			headers["Content-Range"] = request.contentRange;
		}

		if (request.range) {
			ErrorHelper.stringParameterCheck(request.range, "DynamicsWebApi." + functionName, "request.range");
			headers["Range"] = request.range;
		}

		if (request.noCache) {
			ErrorHelper.boolParameterCheck(request.noCache, "DynamicsWebApi." + functionName, "request.noCache");
			headers["Cache-Control"] = "no-cache";
		}

		if (request.mergeLabels) {
			ErrorHelper.boolParameterCheck(request.mergeLabels, "DynamicsWebApi." + functionName, "request.mergeLabels");
			headers["MSCRM.MergeLabels"] = "true";
		}

		if (request.contentId) {
			ErrorHelper.stringParameterCheck(request.contentId, "DynamicsWebApi." + functionName, "request.contentId");
			if (!request.contentId.startsWith("$")) {
				headers["Content-ID"] = request.contentId;
			}
		}

		if (request.isBatch) {
			ErrorHelper.boolParameterCheck(request.isBatch, "DynamicsWebApi." + functionName, "request.isBatch");
		}

		if (request.timeout) {
			ErrorHelper.numberParameterCheck(request.timeout, "DynamicsWebApi." + functionName, "request.timeout");
		}

		if (request.expand && request.expand.length) {
			ErrorHelper.stringOrArrayParameterCheck(request.expand, "DynamicsWebApi." + functionName, "request.expand");
			if (typeof request.expand === "string") {
				requestArray.push("$expand=" + request.expand);
			} else {
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
					requestArray.push("$expand=" + expandRequestArray.join(","));
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
 * @returns {ConvertedRequest} Converted request
 */
function convertRequest(request, functionName, config) {
	var url = "";
	var result;

	if (!request.url) {
		if (!request._unboundRequest && !request.collection) {
			ErrorHelper.parameterCheck(request.collection, "DynamicsWebApi." + functionName, "request.collection");
		}
		if (request.collection) {
			ErrorHelper.stringParameterCheck(request.collection, "DynamicsWebApi." + functionName, "request.collection");
			url = request.collection;

			if (request.contentId) {
				ErrorHelper.stringParameterCheck(request.contentId, "DynamicsWebApi." + functionName, "request.contentId");
				if (request.contentId.startsWith("$")) {
					url = request.contentId + "/" + url;
				}
			}

			//add alternate key feature
			if (request.key) {
				request.key = ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi." + functionName, "request.key");
			} else if (request.id) {
				request.key = ErrorHelper.guidParameterCheck(request.id, "DynamicsWebApi." + functionName, "request.id");
			}

			if (request.key) {
				url += "(" + request.key + ")";
			}
		}

		if (request._additionalUrl) {
			if (url) {
				url += "/";
			}
			url += request._additionalUrl;
		}

		result = convertRequestOptions(request, functionName, url, "&", config);
		if (request.fetchXml) {
			ErrorHelper.stringParameterCheck(request.fetchXml, "DynamicsWebApi." + functionName, "request.fetchXml");
			result.url += "?fetchXml=" + encodeURIComponent(request.fetchXml);
		} else if (result.query) {
			result.url += "?" + result.query;
		}
	} else {
		ErrorHelper.stringParameterCheck(request.url, "DynamicsWebApi." + functionName, "request.url");
		url = request.url.replace(config.webApiUrl, "");
		result = convertRequestOptions(request, functionName, url, "&", config);
	}

	if (request.hasOwnProperty("async") && request.async != null) {
		ErrorHelper.boolParameterCheck(request.async, "DynamicsWebApi." + functionName, "request.async");
		result.async = request.async;
	} else {
		result.async = true;
	}


	return { url: result.url, headers: result.headers, async: result.async };
}

var RequestConverter = {
	convertRequestOptions: convertRequestOptions,
	convertRequest: convertRequest,
};

module.exports = RequestConverter;
