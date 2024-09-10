import { DynamicsWebApiError, ErrorHelper } from "../../helpers/ErrorHelper";
import {
    BATCH_RESPONSE_HEADERS_REGEX,
    LINE_ENDING_REGEX,
    HTTP_STATUS_REGEX,
    TEXT_REGEX,
    CONTENT_TYPE_PLAIN_REGEX,
    ODATA_ENTITYID_REGEX,
    extractUuidFromUrl,
} from "../../helpers/Regex";
import { handleJsonResponse, handlePlainResponse } from "./parseResponse";

//partially taken from http://olingo.apache.org/doc/javascript/apidoc/batch.js.html
function parseBatchHeaders(text: string): any {
    const ctx = { position: 0 };
    const headers: Record<string, string> = {};
    let parts: RegExpExecArray | null;
    let line: string | null;
    let pos: number;

    do {
        pos = ctx.position;
        line = readLine(text, ctx);
        if (!line) break; //if the line is empty, then it is the end of the headers
        parts = BATCH_RESPONSE_HEADERS_REGEX.exec(line);
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
    return readTo(text, ctx, LINE_ENDING_REGEX);
}

//partially taken from http://olingo.apache.org/doc/javascript/apidoc/batch.js.html
function readTo(text: string, ctx: { position: number }, searchRegTerm: RegExp): string | null {
    const start = ctx.position || 0;
    const slicedText = text.slice(start);
    const match = searchRegTerm.exec(slicedText);
    if (!match) {
        return null;
    }
    const end = start + match.index;
    ctx.position = end + match[0].length;
    return text.substring(start, end);
}

//partially taken from https://github.com/emiltholin/google-api-batch-utils
function getHttpStatus(response: string) {
    const parts = HTTP_STATUS_REGEX.exec(response);
    //todo: add error handler for httpStatus and httpStatusMessage; remove "!" operator
    return { httpStatusString: parts![0], httpStatus: parseInt(parts![1]), httpStatusMessage: parts![2].trim() };
}

function getPlainContent(response: string) {
    // Reset the lastIndex property to ensure correct matching
    HTTP_STATUS_REGEX.lastIndex = 0;

    const textReg = TEXT_REGEX.exec(response.trim());
    return textReg?.length ? textReg[0] : undefined;
}

function handlePlainContent(batchResponse: string, parseParams: any, requestNumber: number): any {
    const plainContent = getPlainContent(batchResponse);
    return handlePlainResponse(plainContent);
}

function handleEmptyContent(batchResponse: string, parseParams: any, requestNumber: number): any {
    if (parseParams?.[requestNumber]?.valueIfEmpty !== undefined) {
        return parseParams[requestNumber].valueIfEmpty;
    } else {
        const entityUrl = ODATA_ENTITYID_REGEX.exec(batchResponse);
        return extractUuidFromUrl(entityUrl?.[0]) ?? undefined;
    }
}

function processBatchPart(batchResponse: string, parseParams: any, requestNumber: number): any {
    const { httpStatusString, httpStatus, httpStatusMessage } = getHttpStatus(batchResponse);
    const responseData = batchResponse.substring(batchResponse.indexOf("{"), batchResponse.lastIndexOf("}") + 1);

    //if the batch part does not contain a json response, parse it as plain or empty content
    if (!responseData) {
        if (CONTENT_TYPE_PLAIN_REGEX.test(batchResponse)) {
            return handlePlainContent(batchResponse, parseParams, requestNumber);
        }

        return handleEmptyContent(batchResponse, parseParams, requestNumber);
    }

    //parse json data
    const parsedResponse = handleJsonResponse(responseData, parseParams, requestNumber);

    if (httpStatus < 400) {
        return parsedResponse;
    }

    //handle error
    const responseHeaders = parseBatchHeaders(
        batchResponse.substring(batchResponse.indexOf(httpStatusString) + httpStatusString.length + 1, batchResponse.indexOf("{"))
    );

    return ErrorHelper.handleHttpError(parsedResponse, {
        status: httpStatus,
        statusText: httpStatusMessage,
        statusMessage: httpStatusMessage,
        headers: responseHeaders,
    });
}

/**
 *
 * @param {string} response - response that needs to be parsed
 * @param {Array} parseParams - parameters for parsing the response
 * @param {Number} [requestNumber] - number of the request
 * @returns {any} parsed batch response
 */
export function parseBatchResponse(response: string, parseParams: any, requestNumber: number = 0): (string | undefined | DynamicsWebApiError | Number)[] {
    // Not the same delimiter in the response as we specify ourselves in the request,
    // so we have to extract it.
    const delimiter = response.substring(0, response.search(LINE_ENDING_REGEX));
    const batchResponseParts = response.split(delimiter);
    // The first part will always be an empty string. Just remove it.
    batchResponseParts.shift();
    // The last part will be the "--". Just remove it.
    batchResponseParts.pop();

    let result: (string | undefined | DynamicsWebApiError | Number)[] = [];
    for (let part of batchResponseParts) {
        if (part.indexOf("--changesetresponse_") === -1) {
            result.push(processBatchPart(part, parseParams, requestNumber++));
            continue;
        }

        part = part.trim();
        const batchToProcess = part.substring(part.search(LINE_ENDING_REGEX) + 1).trim();
        result = result.concat(parseBatchResponse(batchToProcess, parseParams, requestNumber++));
    }

    return result;
}
