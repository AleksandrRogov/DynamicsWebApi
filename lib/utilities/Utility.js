function isNull (value) {
    return typeof value === "undefined" || typeof value === "unknown" || value == null;
};

//https://stackoverflow.com/a/8809472
function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

function getXrmContext() {
    if (typeof GetGlobalContext != 'undefined') {
        return GetGlobalContext();
    }
    else {
        if (typeof Xrm != 'undefined') {
            //d365 v.9.0
            if ((!isNull(Xrm.Utility) && !isNull(Xrm.Utility.getGlobalContext))) {
                return Xrm.Utility.getGlobalContext();
            }
            else if (!isNull(Xrm.Page) && !isNull(Xrm.Page.context)) {
                return Xrm.Page.context;
            }
        }
    }

    throw new Error('Xrm Context is not available. In most cases, it can be resolved by adding a reference to a ClientGlobalContext.js.aspx. Please refer to MSDN documentation for more details.');
};

function getClientUrl() {
    var context = getXrmContext();

    if (context) {
        var clientUrl = context.getClientUrl();

        if (clientUrl.match(/\/$/)) {
            clientUrl = clientUrl.substring(0, clientUrl.length - 1);
        }
        return clientUrl;
    }

    return '';
};

function initWebApiUrl(version) {
    return getClientUrl() + '/api/data/v' + version + '/';
};

function getXrmInternal() {
    //todo: Xrm.Internal namespace is not supported
    if (typeof Xrm !== 'undefined') {
        return Xrm.Internal;
    }

    return null;
};

var Utility = {
    /**
     * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
     *
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @returns {string}
     */
    buildFunctionParameters: require('./buildFunctionParameters'),

    /**
     * Parses a paging cookie returned in response
     *
     * @param {string} pageCookies - Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.
     * @param {number} currentPageNumber - A current page number. Fix empty paging-cookie for complex fetch xmls.
     * @returns {{cookie: "", number: 0, next: 1}}
     */
    getFetchXmlPagingCookie: require('./getFetchXmlPagingCookie'),

    /**
     * Converts a response to a reference object
     *
     * @param {Object} responseData - Response object
     * @returns {ReferenceObject}
     */
    convertToReferenceObject: require('./convertToReferenceObject'),

    /**
     * Checks whether the value is JS Null.
     * @param {Object} value
     * @returns {boolean}
     */
    isNull: isNull,

    generateUUID: generateUUID,

    getXrmContext: getXrmContext,

    getXrmInternal: getXrmInternal,

    getClientUrl: getClientUrl,

    initWebApiUrl: initWebApiUrl
}

module.exports = Utility;