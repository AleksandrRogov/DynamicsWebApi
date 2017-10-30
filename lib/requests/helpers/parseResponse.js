var DWA = require('../../dwa');
var dateReviver = require('./dateReviver');

//string es6 polyfill
if (!String.prototype.endsWith || !String.prototype.startsWith) {
    require("../../polyfills/string-es6");
}

//https://github.com/emiltholin/google-api-batch-utils
function parseBatchResponse(response) {
    // Not the same delimiter in the response as we specify ourselves in the request,
    // so we have to extract it.
    var delimiter = response.substr(0, response.indexOf('\r\n'));
    var parts = response.split(delimiter);
    // The first part will always be an empty string. Just remove it.
    parts.shift();
    // The last part will be the "--". Just remove it.
    parts.pop();

    var result = [];
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var p = part.substring(part.indexOf("{"), part.lastIndexOf("}") + 1);
        result.push(JSON.parse(p, dateReviver));
    }
    return result;
}

function populateFormattedValues(object) {
    var keys = Object.keys(object);

    for (var i = 0; i < keys.length; i++) {
        if (object[keys[i]] != null && object[keys[i]].constructor === Array) {
            for (var j = 0; j < object[keys[i]].length; j++) {
                object[keys[i]][j] = populateFormattedValues(object[keys[i]][j]);
            }
        }

        if (keys[i].indexOf('@') == -1)
            continue;

        var format = keys[i].split('@');
        var newKey = null;
        switch (format[1]) {
            case 'odata.context':
                newKey = 'oDataContext';
                break;
            case 'odata.count':
                newKey = 'oDataCount';
                object[keys[i]] = object[keys[i]] != null
                    ? parseInt(object[keys[i]])
                    : 0;
                break;
            case 'odata.nextLink':
                newKey = 'oDataNextLink';
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

        if (newKey) {
            object[newKey] = object[keys[i]];
        }
    }

    return object;
}

/**
 *
 * @param {string} response
 */
module.exports = function parseResponse(response) {
    var responseData = null;
    if (response.length) {
        responseData = response.indexOf('--batchresponse_') > -1
            ? responseData = parseBatchResponse(response)[0]
            : responseData = JSON.parse(response, dateReviver);

        responseData = populateFormattedValues(responseData);
    }

    return responseData;
}