var DWA = require('../dwa');
var ErrorHelper = require('../helpers/ErrorHelper');

/**
 * Builds a Prefer header value
 * @param {Object} request Request object
 * @param {string} functionName name of the current function
 * @param {Object} config DynamicsWebApi config
 * @returns {string}
 */
module.exports = function buildPreferHeader(request, functionName, config) {
    var returnRepresentation = request.returnRepresentation;
    var includeAnnotations = request.includeAnnotations;
    var maxPageSize = request.maxPageSize;

    if (request.prefer && request.prefer.length) {
        ErrorHelper.stringOrArrayParameterCheck(request.prefer, "DynamicsWebApi." + functionName, "request.prefer");
        var prefer = request.prefer;
        if (typeof prefer === "string") {
            prefer = prefer.split(',');
        }
        for (var i in prefer) {
            var item = prefer[i].trim();
            if (item === DWA.Prefer.ReturnRepresentation) {
                returnRepresentation = true;
            }
            else if (item.startsWith("odata.include-annotations=")) {
                includeAnnotations = item.replace('odata.include-annotations=', '').replace(/"/g,'');
            }
            else if (item.startsWith("odata.maxpagesize=")) {
                maxPageSize = item.replace('odata.maxpagesize=', '').replace(/"/g, '');
            }
        }
    }

    if (config) {
        if (returnRepresentation == null) {
            returnRepresentation = config.returnRepresentation;
        }
        includeAnnotations = includeAnnotations ? includeAnnotations : config.includeAnnotations;
        maxPageSize = maxPageSize ? maxPageSize : config.maxPageSize;
    }

    var prefer = [];

    if (returnRepresentation) {
        ErrorHelper.boolParameterCheck(returnRepresentation, "DynamicsWebApi." + functionName, "request.returnRepresentation");
        prefer.push(DWA.Prefer.ReturnRepresentation);
    }

    if (includeAnnotations) {
        ErrorHelper.stringParameterCheck(includeAnnotations, "DynamicsWebApi." + functionName, "request.includeAnnotations");
        prefer.push('odata.include-annotations="' + includeAnnotations + '"');
    }

    if (maxPageSize && maxPageSize > 0) {
        ErrorHelper.numberParameterCheck(maxPageSize, "DynamicsWebApi." + functionName, "request.maxPageSize");
        prefer.push('odata.maxpagesize=' + maxPageSize);
    }

    return prefer.join(',');
}