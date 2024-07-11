﻿import { DWA } from "../../dwa";
import { Utility } from "../../utils/Utility";
import { ErrorHelper, DynamicsWebApiError } from "../../helpers/ErrorHelper";
import { dateReviver } from "./dateReviver";
import type * as Core from "../../types";
import { extractUuidFromUrl } from "../../helpers/Regex";

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
 * @param {any} object - parsed JSON object
 * @param {any} parseParams - parameters for parsing the response
 * @returns {any} parsed batch response
 */
function parseData(object: any, parseParams?: any): any {
    if (parseParams) {
        if (parseParams.isRef && object["@odata.id"] != null) {
            return Utility.convertToReferenceObject(object);
        }

        if (parseParams.toCount) {
            return getFormattedKeyValue("@odata.count", object["@odata.count"])[1] || 0;
        }
    }

    const keys = Object.keys(object);

    for (let i = 0; i < keys.length; i++) {
        const currentKey = keys[i];

        if (object[currentKey] != null) {
            if (object[currentKey].constructor === Array) {
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
            object.PagingInfo = Utility.getFetchXmlPagingCookie(object["@" + DWA.Prefer.Annotations.FetchXmlPagingCookie], parseParams.pageNumber);
        }
    }

    return object;
}

const responseHeaderRegex = /^([^()<>@,;:\\"\/[\]?={} \t]+)\s?:\s?(.*)/;

//partially taken from http://olingo.apache.org/doc/javascript/apidoc/batch.js.html
function parseBatchHeaders(text: string): any {
    const ctx = { position: 0 };
    const headers = {};
    let parts;
    let line;
    let pos;

    do {
        pos = ctx.position;
        line = readLine(text, ctx);
        parts = responseHeaderRegex.exec(line);
        if (parts !== null) {
            headers[parts[1].toLowerCase()] = parts[2];
        } else {
            // Whatever was found is not a header, so reset the context position.
            ctx.position = pos;
        }
    } while (line && parts);

    return headers;
}

//partially taken from http://olingo.apache.org/doc/javascript/apidoc/batch.js.html
function readLine(text: string, ctx: { position: number }): string | null {
    return readTo(text, ctx, "\r\n");
}

//partially taken from http://olingo.apache.org/doc/javascript/apidoc/batch.js.html
function readTo(text: string, ctx: { position: number }, str: string): string | null {
    const start = ctx.position || 0;
    let end = text.length;
    if (str) {
        end = text.indexOf(str, start);
        if (end === -1) {
            return null;
        }
        ctx.position = end + str.length;
    } else {
        ctx.position = end;
    }

    return text.substring(start, end);
}

//partially taken from https://github.com/emiltholin/google-api-batch-utils
/**
 *
 * @param {string} response - response that needs to be parsed
 * @param {Array} parseParams - parameters for parsing the response
 * @param {Number} [requestNumber] - number of the request
 * @returns {any} parsed batch response
 */
function parseBatchResponse(response: string, parseParams: any, requestNumber: number = 0): (string | undefined | DynamicsWebApiError | Number)[] {
    // Not the same delimiter in the response as we specify ourselves in the request,
    // so we have to extract it.
    const delimiter = response.substr(0, response.indexOf("\r\n"));
    const batchResponseParts = response.split(delimiter);
    // The first part will always be an empty string. Just remove it.
    batchResponseParts.shift();
    // The last part will be the "--". Just remove it.
    batchResponseParts.pop();

    let result: (string | undefined | DynamicsWebApiError | Number)[] = [];
    for (let i = 0; i < batchResponseParts.length; i++) {
        let batchResponse = batchResponseParts[i];
        if (batchResponse.indexOf("--changesetresponse_") > -1) {
            batchResponse = batchResponse.trim();
            const batchToProcess = batchResponse.substring(batchResponse.indexOf("\r\n") + 1).trim();

            result = result.concat(parseBatchResponse(batchToProcess, parseParams, requestNumber));
        } else {
            //check http status
            const httpStatusReg = /HTTP\/?\s*[\d.]*\s+(\d{3})\s+([\w\s]*)$/gm.exec(batchResponse);
            //todo: add error handler for httpStatus and httpStatusMessage; remove "!" operator
            const httpStatus = parseInt(httpStatusReg![1]);
            const httpStatusMessage = httpStatusReg![2].trim();

            const responseData = batchResponse.substring(batchResponse.indexOf("{"), batchResponse.lastIndexOf("}") + 1);

            if (!responseData) {
                if (/Content-Type: text\/plain/i.test(batchResponse)) {
                    const plainContentReg = /\w+$/gi.exec(batchResponse.trim());
                    const plainContent = plainContentReg && plainContentReg.length ? plainContentReg[0] : undefined;

                    //check if a plain content is a number or not
                    result.push(isNaN(Number(plainContent)) ? plainContent : Number(plainContent));
                } else {
                    if (parseParams.length && parseParams[requestNumber] && parseParams[requestNumber].hasOwnProperty("valueIfEmpty")) {
                        result.push(parseParams[requestNumber].valueIfEmpty);
                    } else {
                        const entityUrl = /OData-EntityId.+/i.exec(batchResponse);

                        if (entityUrl && entityUrl.length) {
                            const guidResult = extractUuidFromUrl(entityUrl[0]);
                            result.push(guidResult ? guidResult : undefined);
                        } else {
                            result.push(undefined);
                        }
                    }
                }
            } else {
                const parsedResponse = parseData(JSON.parse(responseData, dateReviver), parseParams[requestNumber]);

                if (httpStatus >= 400) {
                    const responseHeaders = parseBatchHeaders(
                        //todo: add error handler for httpStatusReg; remove "!" operator
                        batchResponse.substring(batchResponse.indexOf(httpStatusReg![0]) + httpStatusReg![0].length + 1, batchResponse.indexOf("{"))
                    );

                    result.push(
                        ErrorHelper.handleHttpError(parsedResponse, {
                            status: httpStatus,
                            statusText: httpStatusMessage,
                            statusMessage: httpStatusMessage,
                            headers: responseHeaders,
                        })
                    );
                } else {
                    result.push(parsedResponse);
                }
            }
        }

        requestNumber++;
    }

    return result;
}

function base64ToString(base64: string): string {
    return global.DWA_BROWSER ? global.window.atob(base64) : Buffer.from(base64, "base64").toString("binary");
}

function parseFileResponse(response: any, responseHeaders: any, parseParams: any): Core.FileParseResult {
    let data = response;

    if (parseParams.hasOwnProperty("parse")) {
        data = JSON.parse(data).value;
        data = base64ToString(data);
    }

    var parseResult: Core.FileParseResult = {
        value: data,
    };

    if (responseHeaders["x-ms-file-name"]) parseResult.fileName = responseHeaders["x-ms-file-name"];

    if (responseHeaders["x-ms-file-size"]) parseResult.fileSize = parseInt(responseHeaders["x-ms-file-size"]);

    if (hasHeader(responseHeaders, "Location")) parseResult.location = getHeader(responseHeaders, "Location");

    return parseResult;
}

function hasHeader(headers: any, name: string): boolean {
    return headers.hasOwnProperty(name) || headers.hasOwnProperty(name.toLowerCase());
}

function getHeader(headers: any, name: string): string {
    if (headers[name]) return headers[name];

    return headers[name.toLowerCase()];
}

/**
 *
 * @param {string} response - response that needs to be parsed
 * @param {Array} responseHeaders - response headers
 * @param {Array} parseParams - parameters for parsing the response
 * @returns {any} parsed response
 */
export function parseResponse(response: string, responseHeaders: any, parseParams: any[]): any {
    let parseResult: any = undefined;
    if (response.length) {
        if (response.indexOf("--batchresponse_") > -1) {
            const batch = parseBatchResponse(response, parseParams);

            parseResult = parseParams.length === 1 && parseParams[0].convertedToBatch ? batch[0] : batch;
        } else {
            if (hasHeader(responseHeaders, "Content-Disposition")) {
                parseResult = parseFileResponse(response, responseHeaders, parseParams[0]);
            } else {
                const contentType = getHeader(responseHeaders, "Content-Type");
                if (contentType.startsWith("application/json")) {
                    parseResult = parseData(JSON.parse(response, dateReviver), parseParams[0]);
                } else {
                    parseResult = isNaN(Number(response)) ? response : Number(response);
                }
            }
        }
    } else {
        if (parseParams.length && parseParams[0].hasOwnProperty("valueIfEmpty")) {
            parseResult = parseParams[0].valueIfEmpty;
        } else if (hasHeader(responseHeaders, "OData-EntityId")) {
            const entityUrl = getHeader(responseHeaders, "OData-EntityId");

            const guidResult = extractUuidFromUrl(entityUrl);

            if (guidResult) {
                parseResult = guidResult;
            }
        } else if (hasHeader(responseHeaders, "Location")) {
            parseResult = {
                location: getHeader(responseHeaders, "Location"),
            };

            if (responseHeaders["x-ms-chunk-size"]) parseResult.chunkSize = parseInt(responseHeaders["x-ms-chunk-size"]);
        }
    }

    return parseResult;
}
