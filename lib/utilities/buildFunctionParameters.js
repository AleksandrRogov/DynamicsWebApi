/**
 * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
 *
 * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
 * @returns {string} - Function parameter result
 */
module.exports = function buildFunctionParameters(parameters) {
    if (parameters) {
        var parameterNames = Object.keys(parameters);
        var functionParameters = "";
        var urlQuery = "";

        for (var i = 1; i <= parameterNames.length; i++) {
            var parameterName = parameterNames[i - 1];
            var value = parameters[parameterName];

            if (value === null)
                continue;

            if (typeof value === "string") {
                value = "'" + value + "'";
            }
            //fix #45
            else if (typeof value === "object") {
                value = JSON.stringify(value);
            }

            if (i > 1) {
                functionParameters += ",";
                urlQuery += "&";
            }

            functionParameters += parameterName + "=@p" + i;
            urlQuery += "@p" + i + "=" + value;
        }

        return "(" + functionParameters + ")?" + urlQuery;
    }
    else {
        return "()";
    }
};