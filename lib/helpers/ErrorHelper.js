"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function throwParameterError(functionName, parameterName, type) {
    throw new Error(type
        ? `${functionName} requires the ${parameterName} parameter to be of type ${type}.`
        : `${functionName} requires the ${parameterName} parameter.`);
}
;
class ErrorHelper {
    static handleErrorResponse(req) {
        ///<summary>
        /// Private function return an Error object to the errorCallback
        ///</summary>
        ///<param name="req" type="XMLHttpRequest">
        /// The XMLHttpRequest response that returned an error.
        ///</param>
        ///<returns>Error</returns>
        throw new Error(`Error: ${req.status}: ${req.message}`);
    }
    static parameterCheck(parameter, functionName, parameterName, type) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="Object">
        /// The parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if ((typeof parameter === "undefined") || parameter === null || parameter === "") {
            throwParameterError(functionName, parameterName, type);
        }
    }
    static stringParameterCheck(parameter, functionName, parameterName) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="String">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof parameter !== "string") {
            throwParameterError(functionName, parameterName, "String");
        }
    }
    static arrayParameterCheck(parameter, functionName, parameterName) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="String">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (parameter.constructor !== Array) {
            throwParameterError(functionName, parameterName, "Array");
        }
    }
    static stringOrArrayParameterCheck(parameter, functionName, parameterName) {
        if (parameter.constructor !== Array && typeof parameter !== "string") {
            throwParameterError(functionName, parameterName, "String or Array");
        }
    }
    static numberParameterCheck(parameter, functionName, parameterName) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="Number">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof parameter != "number") {
            if (typeof parameter === "string" && parameter) {
                if (!isNaN(parseInt(parameter))) {
                    return;
                }
            }
            throwParameterError(functionName, parameterName, "Number");
        }
    }
    static handleHttpError(parsedError, parameters) {
        var error = new Error();
        Object.keys(parsedError).forEach(k => {
            error[k] = parsedError[k];
        });
        if (parameters) {
            Object.keys(parameters).forEach(k => {
                error[k] = parameters[k];
            });
        }
        return error;
    }
    static boolParameterCheck(parameter, functionName, parameterName) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="Boolean">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof parameter != "boolean") {
            throwParameterError(functionName, parameterName, "Boolean");
        }
    }
    static guidParameterCheck(parameter, functionName, parameterName) {
        ///<summary>
        /// Private function used to check whether required parameter is a valid GUID
        ///</summary>
        ///<param name="parameter" type="String">
        /// The GUID parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        /// <returns type="String" />
        try {
            var match = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter)[0];
            return match;
        }
        catch (error) {
            throwParameterError(functionName, parameterName, "GUID String");
        }
    }
    static keyParameterCheck(parameter, functionName, parameterName) {
        try {
            ErrorHelper.stringParameterCheck(parameter, functionName, parameterName);
            //check if the param is a guid
            var match = /^{?([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})}?$/i.exec(parameter);
            if (match) {
                return match[1];
            }
            //check the alternate key
            var alternateKeys = parameter.split(',');
            if (alternateKeys.length) {
                for (var i = 0; i < alternateKeys.length; i++) {
                    alternateKeys[i] = alternateKeys[i].trim().replace('"', "'");
                    /^[\w\d\_]+\=('[^\'\r\n]+'|\d+)$/i.exec(alternateKeys[i])[0];
                }
            }
            return alternateKeys.join(',');
        }
        catch (error) {
            throwParameterError(functionName, parameterName, "String representing GUID or Alternate Key");
        }
    }
    static callbackParameterCheck(callbackParameter, functionName, parameterName) {
        ///<summary>
        /// Private function used to check whether required callback parameters are functions
        ///</summary>
        ///<param name="callbackParameter" type="Function">
        /// The callback parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof callbackParameter != "function") {
            throwParameterError(functionName, parameterName, "Function");
        }
    }
    static batchIncompatible(functionName, isBatch) {
        if (isBatch) {
            isBatch = false;
            throw new Error(functionName + " cannot be used in a BATCH request.");
        }
    }
    static batchNotStarted(isBatch) {
        if (!isBatch) {
            throw new Error("Batch operation has not been started. Please call a DynamicsWebApi.startBatch() function prior to calling DynamicsWebApi.executeBatch() to perform a batch request correctly.");
        }
    }
}
exports.ErrorHelper = ErrorHelper;
;
