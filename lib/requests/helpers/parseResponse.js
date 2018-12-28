var DWA = require('../../dwa');
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

function parseData(object) {
    var keys = Object.keys(object);

    for (var i = 0; i < keys.length; i++) {
        var currentKey = keys[i];

        if (object[currentKey] != null && object[currentKey].constructor === Array) {
            for (var j = 0; j < object[currentKey].length; j++) {
                object[currentKey][j] = parseData(object[currentKey][j]);
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

    return object;
}

//partially taken from https://github.com/emiltholin/google-api-batch-utils
function parseBatchResponse(response) {
    // Not the same delimiter in the response as we specify ourselves in the request,
    // so we have to extract it.
    var delimiter = response.substr(0, response.indexOf('\r\n'));
    var batchResponseParts = response.split(delimiter);
    // The first part will always be an empty string. Just remove it.
    batchResponseParts.shift();
    // The last part will be the "--". Just remove it.
    batchResponseParts.pop();

    var result = [];
    for (var i = 0; i < batchResponseParts.length; i++) {
        var batchResponse = batchResponseParts[i];
        if (batchResponse.indexOf('--changesetresponse_') > -1) {
            batchResponse = batchResponse.trim();
            var batchToProcess = batchResponse
                .substring(batchResponse.indexOf('\r\n') + 1).trim();

            result = result.concat(parseBatchResponse(batchToProcess));
        }
        else {
            var responseData = batchResponse.substring(batchResponse.indexOf("{"), batchResponse.lastIndexOf("}") + 1);
            result.push(parseData(JSON.parse(responseData, dateReviver)));
        }
    }
    return result;
}

/**
 *
 * @param {string} response - response that needs to be parsed
 * @returns {any} parsed response
 */
module.exports = function parseResponse(response, convertedToBatch) {
    if (response.length) {
        if (response.indexOf('--batchresponse_') > -1) {
            var batch = parseBatchResponse(response);

            return convertedToBatch
                ? batch[0]
                : batch;
        }
        else {
            return parseData(JSON.parse(response, dateReviver));
        }
    }
};