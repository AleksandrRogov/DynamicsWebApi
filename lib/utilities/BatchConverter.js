var Utility = require('../utilities/Utility');

/**
 * 
 * @param {Array} requests - array of requests
 * @returns {any} batch request
 */
var convertToBatch = function (requests) {
    var batchBoundary = 'dwa_batch_' + Utility.generateUUID();

    var batchBody = [];
    var currentChangeSet = null;
    var contentId = 100000;

    for (var i = 0; i < requests.length; i++) {
        var request = requests[i];
        var isGet = request.method === 'GET';

        if (isGet && currentChangeSet) {
            //end current change set
            batchBody.push('\n--' + currentChangeSet + '--');

            currentChangeSet = null;
            contentId = 100000;
        }

        if (!currentChangeSet) {
            batchBody.push('\n--' + batchBoundary);

            if (!isGet) {
                currentChangeSet = 'changeset_' + Utility.generateUUID();
                batchBody.push('Content-Type: multipart/mixed;boundary=' + currentChangeSet);
            }
        }

        if (!isGet) {
            batchBody.push('\n--' + currentChangeSet);
        }

        batchBody.push('Content-Type: application/http');
        batchBody.push('Content-Transfer-Encoding: binary');

        if (!isGet) {
            var contentIdValue = request.headers.hasOwnProperty('Content-ID')
                ? request.headers['Content-ID']
                : ++contentId;

            batchBody.push('Content-ID: ' + contentIdValue);
        }

        if (!request.path.startsWith("$")) {
            batchBody.push('\n' + request.method + ' ' + request.config.webApiUrl + request.path + ' HTTP/1.1');
        }
        else {
            batchBody.push('\n' + request.method + ' ' + request.path + ' HTTP/1.1');
        }

        if (isGet) {
            batchBody.push('Accept: application/json');
        }
        else {
            batchBody.push('Content-Type: application/json');
        }

        for (var key in request.headers) {
            if (key === 'Authorization' || key === 'Content-ID')
                continue;

            batchBody.push(key + ': ' + request.headers[key]);
        }

        if (!isGet && request.data && request.data.length) {
            batchBody.push('\n' + request.data);
        }
    }

    if (currentChangeSet) {
        batchBody.push('\n--' + currentChangeSet + '--');
    }

    batchBody.push('\n--' + batchBoundary + '--');

    return { boundary: batchBoundary, body: batchBody.join('\n') };
};

var BatchConverter = {
    convertToBatch: convertToBatch
};

module.exports = BatchConverter;