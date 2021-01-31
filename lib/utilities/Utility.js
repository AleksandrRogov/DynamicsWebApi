"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utility = void 0;
function isNodeEnv() {
    // tslint:disable:strict-type-predicates
    return Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
}
function getGlobalObject() {
    return (isNodeEnv()
        ? global
        : typeof window !== "undefined"
            ? window
            : typeof self !== "undefined"
                ? self
                : {});
}
/* develblock:start */
const nCrypto = require("crypto");
/* develblock:end */
function getCrypto() {
    /* develblock:start */
    if (typeof window === "undefined") {
        return nCrypto;
    }
    else
        /* develblock:end */
        return window.crypto;
}
function generateRandomBytes() {
    var uCrypto = getCrypto();
    /* develblock:start */
    if (typeof uCrypto.getRandomValues !== "undefined") {
        /* develblock:end */
        return uCrypto.getRandomValues(new Uint8Array(1));
        /* develblock:start */
    }
    return uCrypto.randomBytes(1);
    /* develblock:end */
}
let downloadChunkSize = 4194304;
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
    /** Generates UUID */
    static generateUUID() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ generateRandomBytes()[0] & 15 >> c / 4).toString(16));
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
    static isObject(obj) {
        const type = typeof obj;
        return type === 'object' && !!obj;
    }
    static copyObject(src) {
        let target = {};
        for (var prop in src) {
            if (src.hasOwnProperty(prop)) {
                // if the value is a nested object, recursively copy all its properties
                if (Utility.isObject(src[prop]) && Object.prototype.toString.call(src[prop]) !== "[object Date]") {
                    if (!Array.isArray(src[prop])) {
                        target[prop] = Utility.copyObject(src[prop]);
                    }
                    else {
                        target[prop] = src[prop].slice();
                    }
                }
                else {
                    target[prop] = src[prop];
                }
            }
        }
        return target;
    }
    static setFileChunk(request, fileBuffer, chunkSize, offset) {
        offset = offset || 0;
        var count = (offset + chunkSize) > fileBuffer.length
            ? fileBuffer.length % chunkSize
            : chunkSize;
        var content;
        /* develblock:start */
        if (typeof window === "undefined") {
            content = fileBuffer.slice(offset, offset + count);
        }
        else {
            /* develblock:end */
            content = new Uint8Array(count);
            for (var i = 0; i < count; i++) {
                content[i] = fileBuffer[offset + i];
            }
            /* develblock:start */
        }
        /* develblock:end */
        request.data = content;
        request.contentRange = "bytes " + offset + "-" + (offset + count - 1) + "/" + fileBuffer.length;
    }
    static convertToFileBuffer(binaryString) {
        /* develblock:start */
        if (typeof window === "undefined") {
            return Buffer.from(binaryString, "binary");
        }
        else {
            /* develblock:end */
            var bytes = new Uint8Array(binaryString.length);
            for (var i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
            /* develblock:start */
        }
        /* develblock:end */
    }
}
exports.Utility = Utility;
Utility.isNodeEnv = isNodeEnv;
Utility.downloadChunkSize = downloadChunkSize;
