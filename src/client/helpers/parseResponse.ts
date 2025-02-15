import { DWA } from "../../dwa";
import { getHeader, hasHeader, getFetchXmlPagingCookie } from "../../utils/Utility";
import { dateReviver } from "./dateReviver";
import type * as Core from "../../types";
import { convertToReferenceObject, extractUuidFromUrl } from "../../helpers/Regex";
import { parseBatchResponse } from "./parseBatchResponse";

function getFormattedKeyValue(keyName: string, value: any): any[] {
    let newKey: string | null = null;
    if (keyName.indexOf("@") !== -1) {
        const format = keyName.split("@");
        switch (format[1]) {
            case "odata.context":
                newKey = "oDataContext";
                break;
            case "odata.count":
                newKey = "oDataCount";
                value = value != null ? parseInt(value) : 0;
                break;
            case "odata.nextLink":
                newKey = "oDataNextLink";
                break;
            case "odata.deltaLink":
                newKey = "oDataDeltaLink";
                break;
            case DWA.Prefer.Annotations.FormattedValue:
                newKey = format[0] + "_Formatted";
                break;
            case DWA.Prefer.Annotations.AssociatedNavigationProperty:
                newKey = format[0] + "_NavigationProperty";
                break;
            case DWA.Prefer.Annotations.LookupLogicalName:
                newKey = format[0] + "_LogicalName";
                break;
        }
    }

    return [newKey, value];
}

/**
 *
 * @param object - parsed JSON object
 * @param parseParams - parameters for parsing the response
 * @returns parsed batch response
 */
export function parseData(object: Record<string, any>, parseParams?: any): any {
    if (parseParams) {
        if (parseParams.isRef && object["@odata.id"] != null) {
            return convertToReferenceObject(object);
        }

        if (parseParams.toCount) {
            return getFormattedKeyValue("@odata.count", object["@odata.count"])[1] || 0;
        }
    }

    for (const currentKey in object) {
        if (object[currentKey] != null) {
            if (Array.isArray(object[currentKey])) {
                for (var j = 0; j < object[currentKey].length; j++) {
                    object[currentKey][j] = parseData(object[currentKey][j]);
                }
            } else if (typeof object[currentKey] === "object") {
                parseData(object[currentKey]);
            }
        }

        //parse formatted values
        let formattedKeyValue = getFormattedKeyValue(currentKey, object[currentKey]);
        if (formattedKeyValue[0]) {
            object[formattedKeyValue[0]] = formattedKeyValue[1];
        }

        //parse aliased values
        if (currentKey.indexOf("_x002e_") !== -1) {
            const aliasKeys = currentKey.split("_x002e_");

            if (!object.hasOwnProperty(aliasKeys[0])) {
                object[aliasKeys[0]] = { _dwaType: "alias" };
            }
            //throw an error if there is already a property which is not an 'alias'
            else if (
                typeof object[aliasKeys[0]] !== "object" ||
                (typeof object[aliasKeys[0]] === "object" && !object[aliasKeys[0]].hasOwnProperty("_dwaType"))
            ) {
                throw new Error("The alias name of the linked entity must be unique!");
            }

            object[aliasKeys[0]][aliasKeys[1]] = object[currentKey];

            //aliases also contain formatted values
            formattedKeyValue = getFormattedKeyValue(aliasKeys[1], object[currentKey]);
            if (formattedKeyValue[0]) {
                object[aliasKeys[0]][formattedKeyValue[0]] = formattedKeyValue[1];
            }
        }
    }

    if (parseParams) {
        if (parseParams.hasOwnProperty("pageNumber") && object["@" + DWA.Prefer.Annotations.FetchXmlPagingCookie] != null) {
            object.PagingInfo = getFetchXmlPagingCookie(object["@" + DWA.Prefer.Annotations.FetchXmlPagingCookie], parseParams.pageNumber);
        }
    }

    return object;
}

function base64ToString(base64: string): string {
    return global.DWA_BROWSER ? global.window.atob(base64) : Buffer.from(base64, "base64").toString("binary");
}

function parseFileResponse(response: string, responseHeaders: any, parseParams: any): Core.FileParseResult {
    let data = response;

    if (parseParams?.hasOwnProperty("parse")) {
        data = JSON.parse(data).value;
        data = base64ToString(data);
    }

    const parseResult: Core.FileParseResult = {
        value: data,
    };

    if (responseHeaders["x-ms-file-name"]) parseResult.fileName = responseHeaders["x-ms-file-name"];
    if (responseHeaders["x-ms-file-size"]) parseResult.fileSize = parseInt(responseHeaders["x-ms-file-size"]);
    const location = getHeader(responseHeaders, "Location");
    if (location) parseResult.location = location;

    return parseResult;
}

function isBatchResponse(response: string): boolean {
    return response.indexOf("--batchresponse_") > -1;
}

function isFileResponse(responseHeaders: Record<string, string>): boolean {
    return hasHeader(responseHeaders, "Content-Disposition");
}
function isJsonResponse(responseHeaders: Record<string, string>): boolean {
    const contentType = getHeader(responseHeaders, "Content-Type");
    return contentType?.startsWith("application/json") == true;
}

function handleBatchResponse(response: string, parseParams: any) {
    const batch = parseBatchResponse(response, parseParams);
    return parseParams?.[0].convertedToBatch ? batch[0] : batch;
}

function handleFileResponse(response: string, responseHeaders: any, parseParams: any): any {
    return parseFileResponse(response, responseHeaders, parseParams[0]);
}

export function handleJsonResponse(response: string, parseParams: any, requestNumber: number = 0): any {
    return parseData(JSON.parse(response, dateReviver), parseParams[requestNumber]);
}

export function handlePlainResponse(response?: string): number | string | undefined {
    const numberResponse = Number(response);
    return isFinite(numberResponse) ? numberResponse : response;
}

function handleEmptyResponse(responseHeaders: Record<string, string>, parseParams: any): any {
    //checking if there is a valueIfEmpty parameter and return it if it is set
    if (parseParams?.[0]?.valueIfEmpty !== undefined) {
        return parseParams[0].valueIfEmpty;
    }
    //checking if the response contains an entity id, if it does - return it
    const entityUrl = getHeader(responseHeaders, "OData-EntityId");
    if (entityUrl) {
        return extractUuidFromUrl(entityUrl) ?? undefined;
    }
    //checking if the response is a chunk response
    const location = getHeader(responseHeaders, "Location");
    if (location) {
        const result: { location: string; chunkSize?: number } = { location: location };
        if (responseHeaders["x-ms-chunk-size"]) {
            result.chunkSize = parseInt(responseHeaders["x-ms-chunk-size"]);
        }
        return result;
    }
}

/**
 *
 * @param response - response that needs to be parsed
 * @param responseHeaders - response headers
 * @param parseParams - parameters for parsing the response
 * @returns parsed response
 */
export function parseResponse(response: string, responseHeaders: Record<string, string>, parseParams: any[]): any {
    if (!response.length) {
        return handleEmptyResponse(responseHeaders, parseParams);
    }
    if (isBatchResponse(response)) {
        return handleBatchResponse(response, parseParams);
    }
    if (isFileResponse(responseHeaders)) {
        return handleFileResponse(response, responseHeaders, parseParams);
    }
    if (isJsonResponse(responseHeaders)) {
        return handleJsonResponse(response, parseParams);
    }
    return handlePlainResponse(response);
}
