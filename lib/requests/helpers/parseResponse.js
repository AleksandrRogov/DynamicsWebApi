var dateReviver = require('./dateReviver');

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
    }

    return responseData;
}