var DWA = require('../../dwa');
var Utility = require('../../utilities/Utility');
var ErrorHelper = require('../../helpers/ErrorHelper');
var dateReviver = require('./dateReviver');

//string es6 polyfill
if (!String.prototype.endsWith || !String.prototype.startsWith) {
	require("../../polyfills/string-es6");
}

function getFormattedKeyValue(keyName, value) {
	var newKey = null;
	if (keyName.indexOf('@') !== -1) {
		var format = keyName.split('@');
		switch (format[1]) {
			case 'odata.context':
				newKey = 'oDataContext';
				break;
			case 'odata.count':
				newKey = 'oDataCount';
				value = value != null
					? parseInt(value)
					: 0;
				break;
			case 'odata.nextLink':
				newKey = 'oDataNextLink';
				break;
			case 'odata.deltaLink':
				newKey = 'oDataDeltaLink';
				break;
			case DWA.Prefer.Annotations.FormattedValue:
				newKey = format[0] + '_Formatted';
				break;
			case DWA.Prefer.Annotations.AssociatedNavigationProperty:
				newKey = format[0] + '_NavigationProperty';
				break;
			case DWA.Prefer.Annotations.LookupLogicalName:
				newKey = format[0] + '_LogicalName';
				break;
		}
	}

	return [newKey, value];
}

/**
 *
 * @param {any} object - parsed JSON object
 * @param {any} parseParams - parameters for parsing the response
 * @returns {any} parsed batch response
 */
function parseData(object, parseParams) {
	if (parseParams) {
		if (parseParams.isRef && object["@odata.id"] != null) {
			return Utility.convertToReferenceObject(object);
		}

		if (parseParams.toCount) {
			return getFormattedKeyValue('@odata.count', object['@odata.count'])[1] || 0;
		}
	}

	var keys = Object.keys(object);

	for (var i = 0; i < keys.length; i++) {
		var currentKey = keys[i];

		if (object[currentKey] != null) {
			if (object[currentKey].constructor === Array) {
				for (var j = 0; j < object[currentKey].length; j++) {
					object[currentKey][j] = parseData(object[currentKey][j]);
				}
			}
			else if (typeof (object[currentKey]) === "object") {
				parseData(object[currentKey]);
			}
		}

		//parse formatted values
		var formattedKeyValue = getFormattedKeyValue(currentKey, object[currentKey]);
		if (formattedKeyValue[0]) {
			object[formattedKeyValue[0]] = formattedKeyValue[1];
		}

		//parse aliased values
		if (currentKey.indexOf('_x002e_') !== -1) {
			var aliasKeys = currentKey.split('_x002e_');

			if (!object.hasOwnProperty(aliasKeys[0])) {
				object[aliasKeys[0]] = { _dwaType: 'alias' };
			}
			//throw an error if there is already a property which is not an 'alias'
			else if (
				typeof object[aliasKeys[0]] !== 'object' ||
				typeof object[aliasKeys[0]] === 'object' && !object[aliasKeys[0]].hasOwnProperty('_dwaType')) {
				throw new Error('The alias name of the linked entity must be unique!');
			}

			object[aliasKeys[0]][aliasKeys[1]] = object[currentKey];

			//aliases also contain formatted values
			formattedKeyValue = getFormattedKeyValue(aliasKeys[1], object[currentKey]);
			if (formattedKeyValue[0]) {
				object[aliasKeys[0]][formattedKeyValue[0]] = formattedKeyValue[1];
			}
		}
	}

	if (parseParams) {
		if (parseParams.hasOwnProperty('pageNumber') && object['@' + DWA.Prefer.Annotations.FetchXmlPagingCookie] != null) {
			object.PagingInfo = Utility.getFetchXmlPagingCookie(object['@' + DWA.Prefer.Annotations.FetchXmlPagingCookie], parseParams.pageNumber);
		}
	}

	return object;
}

var responseHeaderRegex = /^([^()<>@,;:\\"\/[\]?={} \t]+)\s?:\s?(.*)/;

//partially taken from http://olingo.apache.org/doc/javascript/apidoc/batch.js.html
function parseBatchHeaders(text) {
	var headers = {};
	var parts;
	var line;
	var ctx = { position: 0 };
	var pos;

	do {
		pos = ctx.position;
		line = readLine(text, ctx);
		parts = responseHeaderRegex.exec(line);
		if (parts !== null) {
			headers[parts[1].toLowerCase()] = parts[2];
		}
		else {
			// Whatever was found is not a header, so reset the context position.
			ctx.position = pos;
		}
	} while (line && parts);

	return headers;
}

//partially taken from http://olingo.apache.org/doc/javascript/apidoc/batch.js.html
function readLine(text, ctx) {
	return readTo(text, ctx, "\r\n");
}

//partially taken from http://olingo.apache.org/doc/javascript/apidoc/batch.js.html
function readTo(text, ctx, str) {
	var start = ctx.position || 0;
	var end = text.length;
	if (str) {
		end = text.indexOf(str, start);
		if (end === -1) {
			return null;
		}
		ctx.position = end + str.length;
	} else {
		ctx.position = end;
	}

	return text.substring(start, end);
}

//partially taken from https://github.com/emiltholin/google-api-batch-utils
/**
 *
 * @param {string} response - response that needs to be parsed
 * @param {Array} parseParams - parameters for parsing the response
 * @param {Number} [requestNumber] - number of the request
 * @returns {any} parsed batch response
 */
function parseBatchResponse(response, parseParams, requestNumber) {
	// Not the same delimiter in the response as we specify ourselves in the request,
	// so we have to extract it.
	var delimiter = response.substr(0, response.indexOf('\r\n'));
	var batchResponseParts = response.split(delimiter);
	// The first part will always be an empty string. Just remove it.
	batchResponseParts.shift();
	// The last part will be the "--". Just remove it.
	batchResponseParts.pop();

	requestNumber = requestNumber || 0;

	var result = [];
	for (var i = 0; i < batchResponseParts.length; i++) {
		var batchResponse = batchResponseParts[i];
		if (batchResponse.indexOf('--changesetresponse_') > -1) {
			batchResponse = batchResponse.trim();
			var batchToProcess = batchResponse
				.substring(batchResponse.indexOf('\r\n') + 1).trim();

			result = result.concat(parseBatchResponse(batchToProcess, parseParams, requestNumber));
		}
		else {
			//check http status
			var httpStatusReg = /HTTP\/?\s*[\d.]*\s+(\d{3})\s+([\w\s]*)$/gm.exec(batchResponse);
			var httpStatus = parseInt(httpStatusReg[1]);
			var httpStatusMessage = httpStatusReg[2].trim();

			var responseData = batchResponse.substring(batchResponse.indexOf("{"), batchResponse.lastIndexOf("}") + 1);

			if (!responseData) {
				if (/Content-Type: text\/plain/i.test(batchResponse)) {
					var plainContentReg = /\w+$/gi.exec(batchResponse.trim());
					var plainContent = plainContentReg && plainContentReg.length ? plainContentReg[0] : undefined;

					//check if a plain content is a number or not
					result.push(isNaN(plainContent) ? plainContent : parseInt(plainContent));
				}
				else
					if (parseParams.length && parseParams[requestNumber] && parseParams[requestNumber].hasOwnProperty('valueIfEmpty')) {
						result.push(parseParams[requestNumber].valueIfEmpty);
					}
					else {
						var entityUrl = /OData-EntityId.+/i.exec(batchResponse);

						if (entityUrl && entityUrl.length) {
							var guidResult = /([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})\)$/i.exec(entityUrl[0]);

							result.push(guidResult ? guidResult[1] : undefined);
						}
						else {
							result.push(undefined);
						}
					}
			}
			else {
				var parsedResponse = parseData(JSON.parse(responseData, dateReviver), parseParams[requestNumber]);

				if (httpStatus >= 400) {
					var responseHeaders = parseBatchHeaders(batchResponse.substring(batchResponse.indexOf(httpStatusReg[0]) + httpStatusReg[0].length + 1, batchResponse.indexOf("{")));

					result.push(ErrorHelper.handleHttpError(parsedResponse, {
						status: httpStatus,
						statusText: httpStatusMessage,
						statusMessage: httpStatusMessage,
						headers: responseHeaders
					}));
				}
				else {
					result.push(parsedResponse);
				}
			}
		}

		requestNumber++;
	}

	return result;
}

/**
 *
 * @param {string} response - response that needs to be parsed
 * @param {Array} responseHeaders - response headers
 * @param {Array} parseParams - parameters for parsing the response
 * @returns {any} parsed response
 */
module.exports = function parseResponse(response, responseHeaders, parseParams) {
	var parseResult = undefined;
	if (response.length) {
		if (response.indexOf('--batchresponse_') > -1) {
			var batch = parseBatchResponse(response, parseParams);

			parseResult = parseParams.length === 1 && parseParams[0].convertedToBatch
				? batch[0]
				: batch;
		}
		else {
			parseResult = parseData(JSON.parse(response, dateReviver), parseParams[0]);
		}
	}
	else {
		if (parseParams.length && parseParams[0].hasOwnProperty('valueIfEmpty')) {
			parseResult = parseParams[0].valueIfEmpty;
		}
		else
			if (responseHeaders['OData-EntityId'] || responseHeaders['odata-entityid']) {
				var entityUrl = responseHeaders['OData-EntityId']
					? responseHeaders['OData-EntityId']
					: responseHeaders['odata-entityid'];

				var guidResult = /([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})\)$/i.exec(entityUrl);

				if (guidResult) {
					parseResult = guidResult[1];
				}
			}
	}

	parseParams.length = 0;

	return parseResult;
}