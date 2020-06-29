"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utility {
    /**
     * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
     *
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @returns {string}
     */
    static buildFunctionParameters(parameters) {
        if (parameters) {
            var parameterNames = Object.keys(parameters);
            var functionParameters = "";
            var urlQuery = "";
            for (var i = 1; i <= parameterNames.length; i++) {
                var parameterName = parameterNames[i - 1];
                var value = parameters[parameterName];
                if (value === null)
                    continue;
                if (typeof value === "string" && !value.startsWith("Microsoft.Dynamics.CRM")) {
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
    }
    /**
     * Parses a paging cookie returned in response
     *
     * @param {string} pageCookies - Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.
     * @param {number} currentPageNumber - A current page number. Fix empty paging-cookie for complex fetch xmls.
     * @returns {{cookie: "", number: 0, next: 1}}
     */
    static getFetchXmlPagingCookie(pageCookies = "", currentPageNumber = 1) {
        //get the page cokies
        pageCookies = unescape(unescape(pageCookies));
        var info = /pagingcookie="(<cookie page="(\d+)".+<\/cookie>)/.exec(pageCookies);
        if (info != null) {
            var page = parseInt(info[2]);
            return {
                cookie: info[1].replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '\'').replace(/\'/g, '&' + 'quot;'),
                page: page,
                nextPage: page + 1
            };
        }
        else {
            //http://stackoverflow.com/questions/41262772/execution-of-fetch-xml-using-web-api-dynamics-365 workaround
            return {
                cookie: "",
                page: currentPageNumber,
                nextPage: currentPageNumber + 1
            };
        }
    }
    /**
     * Converts a response to a reference object
     *
     * @param {Object} responseData - Response object
     * @returns {ReferenceObject}
     */
    static convertToReferenceObject(responseData) {
        var result = /\/(\w+)\(([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})/i.exec(responseData["@odata.id"]);
        return { id: result[2], collection: result[1], oDataContext: responseData["@odata.context"] };
    }
    /**
     * Checks whether the value is JS Null.
     * @param {Object} value
     * @returns {boolean}
     */
    static isNull(value) {
        return typeof value === "undefined" || value == null;
    }
    static generateUUID() {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    static getXrmContext() {
        if (typeof GetGlobalContext !== 'undefined') {
            return GetGlobalContext();
        }
        else {
            if (typeof Xrm !== 'undefined') {
                //d365 v.9.0
                if (!Utility.isNull(Xrm.Utility) && !Utility.isNull(Xrm.Utility.getGlobalContext)) {
                    return Xrm.Utility.getGlobalContext();
                }
                else if (!Utility.isNull(Xrm.Page) && !Utility.isNull(Xrm.Page.context)) {
                    return Xrm.Page.context;
                }
            }
        }
        throw new Error('Xrm Context is not available. In most cases, it can be resolved by adding a reference to a ClientGlobalContext.js.aspx. Please refer to MSDN documentation for more details.');
    }
    static getXrmUtility() {
        return typeof Xrm !== "undefined" ? Xrm.Utility : null;
    }
    static getClientUrl() {
        var context = Utility.getXrmContext();
        var clientUrl = context.getClientUrl();
        if (clientUrl.match(/\/$/)) {
            clientUrl = clientUrl.substring(0, clientUrl.length - 1);
        }
        return clientUrl;
    }
    static initWebApiUrl(version) {
        return `${Utility.getClientUrl()}/api/data/v${version}/`;
    }
}
exports.Utility = Utility;
