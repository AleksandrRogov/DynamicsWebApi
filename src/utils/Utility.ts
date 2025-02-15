import type * as Core from "../types";
import { generateRandomBytes, getCrypto } from "../helpers/Crypto";
import { isUuid, extractUuid, parsePagingCookie } from "../helpers/Regex";

declare var GetGlobalContext: any;
declare var Xrm: any;

export let downloadChunkSize = 4194304;

export function setDownloadChunkSize(size: number): void {
    downloadChunkSize = size;
}

function formatParameterValue(value: any): string {
    if (value == null) return "";

    if (typeof value === "string" && !value.startsWith("Microsoft.Dynamics.CRM") && !isUuid(value)) {
        return `'${value}'`;
    } else if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return value.toString();
}

function processParameters(parameters: { [key: string]: any }): { key: string; queryParams: string[] } {
    const parameterNames = Object.keys(parameters);
    const functionParams: string[] = [];
    const urlQuery: string[] = [];

    parameterNames.forEach((parameterName, index) => {
        let value = parameters[parameterName];
        if (value == null) return;

        value = formatParameterValue(value);

        const paramIndex = index + 1;
        functionParams.push(`${parameterName}=@p${paramIndex}`);
        urlQuery.push(`@p${paramIndex}=${extractUuid(value) || value}`);
    });

    return {
        key: `(${functionParams.join(",")})`,
        queryParams: urlQuery,
    };
}

export function hasHeader(headers: Record<string, string>, name: string): boolean {
    return headers.hasOwnProperty(name) || headers.hasOwnProperty(name.toLowerCase());
}

export function getHeader(headers: Record<string, string>, name: string): string | undefined {
    if (headers[name]) return headers[name];

    return headers[name.toLowerCase()];
}

/**
 * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
 *
 * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
 * @returns {string}
 */
export function buildFunctionParameters(parameters?: any): Core.FunctionParameters {
    return parameters ? processParameters(parameters) : { key: "()" };
}

/**
 * Parses a paging cookie returned in response
 *
 * @param {string} pageCookies - Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.
 * @param {number} currentPageNumber - A current page number. Fix empty paging-cookie for complex fetch xmls.
 * @returns {{cookie: "", number: 0, next: 1}}
 */
export function getFetchXmlPagingCookie(pageCookies: string = "", currentPageNumber: number = 1): Core.FetchXmlCookie {
    //get the page cokies
    pageCookies = decodeURIComponent(decodeURIComponent(pageCookies));

    const result = parsePagingCookie(pageCookies);

    // http://stackoverflow.com/questions/41262772/execution-of-fetch-xml-using-web-api-dynamics-365 workaround
    return {
        cookie: result?.sanitizedCookie || "",
        page: result?.page || currentPageNumber,
        nextPage: result?.page ? result.page + 1 : currentPageNumber + 1,
    };
}

// static isNodeEnv = isNodeEnv;

/**
 * Checks whether the value is JS Null.
 * @param {Object} value
 * @returns {boolean}
 */
export function isNull(value: any): value is undefined | null {
    return typeof value === "undefined" || value == null;
}

/** Generates UUID */
export function generateUUID() {
    return getCrypto<Crypto>().randomUUID();
}

export function getXrmContext(): any {
    if (typeof GetGlobalContext !== "undefined") {
        return GetGlobalContext();
    } else {
        if (typeof Xrm !== "undefined") {
            //d365 v.9.0
            if (!isNull(Xrm.Utility) && !isNull(Xrm.Utility.getGlobalContext)) {
                return Xrm.Utility.getGlobalContext();
            } else if (!isNull(Xrm.Page) && !isNull(Xrm.Page.context)) {
                return Xrm.Page.context;
            }
        }
    }

    throw new Error(
        "Xrm Context is not available. In most cases, it can be resolved by adding a reference to a ClientGlobalContext.js.aspx. Please refer to MSDN documentation for more details.",
    );
}

// static getXrmUtility(): any {
//     return typeof Xrm !== "undefined" ? Xrm.Utility : null;
// }

export function getClientUrl(): string {
    const context = getXrmContext();

    let clientUrl = context.getClientUrl();

    if (clientUrl.match(/\/$/)) {
        clientUrl = clientUrl.substring(0, clientUrl.length - 1);
    }
    return clientUrl;
}

/**
 * Checks whether the app is currently running in a Dynamics Portals Environment.
 *
 * In that case we switch to the Web API for Dynamics Portals.
 * @returns {boolean}
 */
export function isRunningWithinPortals(): boolean {
    return global.DWA_BROWSER ? !!global.window.shell : false;
}

export function isObject(obj: any): boolean {
    return typeof obj === "object" && !!obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== "[object Date]";
}

export function copyObject<T = any>(src: any, excludeProps?: string[]): T {
    let target = {};
    for (let prop in src) {
        if (src.hasOwnProperty(prop) && !excludeProps?.includes(prop)) {
            // if the value is a nested object, recursively copy all its properties
            if (isObject(src[prop])) {
                target[prop] = copyObject(src[prop]);
            } else if (Array.isArray(src[prop])) {
                target[prop] = src[prop].slice();
            } else {
                target[prop] = src[prop];
            }
        }
    }
    return <T>target;
}

export function copyRequest(src: any, excludeProps: string[] = []): Core.InternalRequest {
    //todo: do we need to include "data" in here?
    if (!excludeProps.includes("signal")) excludeProps.push("signal");

    const result = copyObject<Core.InternalRequest>(src, excludeProps);
    result.signal = src.signal;

    return result;
}

export function setFileChunk(request: Core.InternalRequest, fileBuffer: Uint8Array | Buffer, chunkSize: number, offset: number): void {
    offset = offset || 0;

    const count = offset + chunkSize > fileBuffer.length ? fileBuffer.length % chunkSize : chunkSize;

    let content: any;

    if (global.DWA_BROWSER) {
        content = new Uint8Array(count);
        for (let i = 0; i < count; i++) {
            content[i] = fileBuffer[offset + i];
        }
    } else {
        content = fileBuffer.slice(offset, offset + count);
    }

    request.data = content;
    request.contentRange = "bytes " + offset + "-" + (offset + count - 1) + "/" + fileBuffer.length;
}

export function convertToFileBuffer(binaryString: string): Uint8Array | Buffer {
    if (!global.DWA_BROWSER) return Buffer.from(binaryString, "binary");

    const bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
