import type { InternalRequest, InternalBatchRequest } from "../types";

import { Utility } from "./Utility";
import { Config, HeaderCollection } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { InternalConfig } from "./Config";
import {
    removeCurlyBracketsFromUuid,
    removeLeadingSlash,
    escapeUnicodeSymbols,
    safelyRemoveCurlyBracketsFromUrl,
    SEARCH_FOR_ENTITY_NAME_REGEX,
    removeDoubleQuotes,
} from "../helpers/Regex";

export let entityNames: Record<string, string | null> | null = null;

export const setEntityNames = (newEntityNames: Record<string, string | null> | null) => {
    entityNames = newEntityNames;
};

/**
 * Converts a request object to URL link
 * @param request Internal request object
 * @param config Internal configuration object
 * @returns Modified internal request object
 */
export const compose = (request: InternalRequest, config: Partial<InternalConfig>): InternalRequest => {
    request.path = request.path || "";
    request.functionName = request.functionName || "";
    if (!request.url) {
        if (!request._isUnboundRequest && !request.contentId && !request.collection) {
            ErrorHelper.parameterCheck(request.collection, `DynamicsWebApi.${request.functionName}`, "request.collection");
        }
        if (request.collection != null) {
            ErrorHelper.stringParameterCheck(request.collection, `DynamicsWebApi.${request.functionName}`, "request.collection");
            request.path = request.collection;

            //add alternate key feature
            if (request.key) {
                request.key = ErrorHelper.keyParameterCheck(request.key, `DynamicsWebApi.${request.functionName}`, "request.key");
                request.path += `(${request.key})`;
            }
        }

        if (request.contentId) {
            ErrorHelper.stringParameterCheck(request.contentId, `DynamicsWebApi.${request.functionName}`, "request.contentId");
            if (request.contentId.startsWith("$")) {
                request.path = request.path ? `${request.contentId}/${request.path}` : request.contentId;
            }
        }

        if (request.addPath) {
            if (request.path) {
                request.path += "/";
            }
            request.path += request.addPath;
        }

        request.path = composeUrl(request, config, request.path);

        if (request.fetchXml) {
            ErrorHelper.stringParameterCheck(request.fetchXml, `DynamicsWebApi.${request.functionName}`, "request.fetchXml");
            let join = request.path.indexOf("?") === -1 ? "?" : "&";
            request.path += `${join}fetchXml=${encodeURIComponent(request.fetchXml)}`;
        }
    } else {
        ErrorHelper.stringParameterCheck(request.url, `DynamicsWebApi.${request.functionName}`, "request.url");
        request.path = request.url.replace(config.dataApi!.url, "");
    }

    if (request.hasOwnProperty("async") && request.async != null) {
        ErrorHelper.boolParameterCheck(request.async, `DynamicsWebApi.${request.functionName}`, "request.async");
    } else {
        request.async = true;
    }

    request.headers = composeHeaders(request, config);

    return request;
};

/**
 * Converts optional parameters of the request to URL. If expand parameter exists this function is called recursively.
 * @param request Internal request object
 * @param config Internal configuration object
 * @param url Starting url
 * @param joinSymbol Join symbol. "&" by default and ";" inside an expand query parameter
 * @returns Request URL
 */
export const composeUrl = (request: InternalRequest | null, config: Config | null, url: string = "", joinSymbol: "&" | ";" = "&"): string => {
    const queryArray: string[] = [];

    if (request) {
        if (request.navigationProperty) {
            ErrorHelper.stringParameterCheck(request.navigationProperty, `DynamicsWebApi.${request.functionName}`, "request.navigationProperty");
            url += "/" + request.navigationProperty;

            if (request.navigationPropertyKey) {
                let navigationKey = ErrorHelper.keyParameterCheck(
                    request.navigationPropertyKey,
                    `DynamicsWebApi.${request.functionName}`,
                    "request.navigationPropertyKey"
                );
                url += "(" + navigationKey + ")";
            }

            if (request.navigationProperty === "Attributes") {
                if (request.metadataAttributeType) {
                    ErrorHelper.stringParameterCheck(request.metadataAttributeType, `DynamicsWebApi.${request.functionName}`, "request.metadataAttributeType");
                    url += "/" + request.metadataAttributeType;
                }
            }
        }

        if (request.select?.length) {
            ErrorHelper.arrayParameterCheck(request.select, `DynamicsWebApi.${request.functionName}`, "request.select");

            if (request.functionName == "retrieve" && request.select.length == 1 && request.select[0].endsWith("/$ref")) {
                url += "/" + request.select[0];
            } else {
                if (request.select[0].startsWith("/") && request.functionName == "retrieve") {
                    if (request.navigationProperty == null) {
                        url += request.select.shift();
                    } else {
                        request.select.shift();
                    }
                }

                //check if anything left in the array
                if (request.select.length) {
                    queryArray.push("$select=" + request.select.join(","));
                }
            }
        }

        if (request.filter) {
            ErrorHelper.stringParameterCheck(request.filter, `DynamicsWebApi.${request.functionName}`, "request.filter");
            const filterResult = safelyRemoveCurlyBracketsFromUrl(request.filter);
            queryArray.push("$filter=" + encodeURIComponent(filterResult));
        }

        //todo: delete in v2.5
        if (request.fieldName) {
            ErrorHelper.stringParameterCheck(request.fieldName, `DynamicsWebApi.${request.functionName}`, "request.fieldName");
            if (!request.property) request.property = request.fieldName;
            delete request.fieldName;
        }

        if (request.property) {
            ErrorHelper.stringParameterCheck(request.property, `DynamicsWebApi.${request.functionName}`, "request.property");
            url += "/" + request.property;
        }

        if (request.savedQuery) {
            queryArray.push("savedQuery=" + ErrorHelper.guidParameterCheck(request.savedQuery, `DynamicsWebApi.${request.functionName}`, "request.savedQuery"));
        }

        if (request.userQuery) {
            queryArray.push("userQuery=" + ErrorHelper.guidParameterCheck(request.userQuery, `DynamicsWebApi.${request.functionName}`, "request.userQuery"));
        }

        if (request.apply) {
            ErrorHelper.stringParameterCheck(request.apply, `DynamicsWebApi.${request.functionName}`, "request.apply");
            queryArray.push("$apply=" + request.apply);
        }

        if (request.count) {
            ErrorHelper.boolParameterCheck(request.count, `DynamicsWebApi.${request.functionName}`, "request.count");
            queryArray.push("$count=" + request.count);
        }

        if (request.top && request.top > 0) {
            ErrorHelper.numberParameterCheck(request.top, `DynamicsWebApi.${request.functionName}`, "request.top");
            queryArray.push("$top=" + request.top);
        }

        if (request.orderBy != null && request.orderBy.length) {
            ErrorHelper.arrayParameterCheck(request.orderBy, `DynamicsWebApi.${request.functionName}`, "request.orderBy");
            queryArray.push("$orderby=" + request.orderBy.join(","));
        }

        if (request.partitionId) {
            ErrorHelper.stringParameterCheck(request.partitionId, `DynamicsWebApi.${request.functionName}`, "request.partitionId");
            queryArray.push("partitionid='" + request.partitionId + "'");
        }

        if (request.downloadSize) {
            ErrorHelper.stringParameterCheck(request.downloadSize, `DynamicsWebApi.${request.functionName}`, "request.downloadSize");
            queryArray.push("size=" + request.downloadSize);
        }

        if (request.queryParams?.length) {
            ErrorHelper.arrayParameterCheck(request.queryParams, `DynamicsWebApi.${request.functionName}`, "request.queryParams");
            queryArray.push(request.queryParams.join("&"));
        }

        if (request.fileName) {
            ErrorHelper.stringParameterCheck(request.fileName, `DynamicsWebApi.${request.functionName}`, "request.fileName");
            queryArray.push("x-ms-file-name=" + request.fileName);
        }

        if (request.data) {
            ErrorHelper.parameterCheck(request.data, `DynamicsWebApi.${request.functionName}`, "request.data");
        }

        if (request.isBatch) {
            ErrorHelper.boolParameterCheck(request.isBatch, `DynamicsWebApi.${request.functionName}`, "request.isBatch");
        }

        if (!Utility.isNull(request.inChangeSet)) {
            ErrorHelper.boolParameterCheck(request.inChangeSet, `DynamicsWebApi.${request.functionName}`, "request.inChangeSet");
        }

        if (request.isBatch && Utility.isNull(request.inChangeSet)) request.inChangeSet = true;

        if (request.timeout) {
            ErrorHelper.numberParameterCheck(request.timeout, `DynamicsWebApi.${request.functionName}`, "request.timeout");
        }

        if (request.expand?.length) {
            ErrorHelper.stringOrArrayParameterCheck(request.expand, `DynamicsWebApi.${request.functionName}`, "request.expand");
            if (typeof request.expand === "string") {
                queryArray.push("$expand=" + request.expand);
            } else {
                const expandQueryArray: string[] = [];
                for (const { property, ...expand } of request.expand) {
                    if (!property) continue;

                    const expandRequest: InternalRequest = {
                        functionName: `${request.functionName} $expand`,
                        ...expand,
                    };
                    let expandConverted = composeUrl(expandRequest, config, "", ";");
                    if (expandConverted) {
                        expandConverted = `(${expandConverted.slice(1)})`;
                    }
                    expandQueryArray.push(property + expandConverted);
                }
                if (expandQueryArray.length) {
                    queryArray.push("$expand=" + expandQueryArray.join(","));
                }
            }
        }
    }

    return !queryArray.length ? url : url + "?" + queryArray.join(joinSymbol);
};

export const composeHeaders = (request: InternalRequest, config: Config): HeaderCollection => {
    const headers: HeaderCollection = { ...config.headers, ...request.userHeaders };

    const prefer = composePreferHeader(request, config);
    if (prefer.length) {
        headers["Prefer"] = prefer;
    }

    if (request.collection === "$metadata") {
        headers["Accept"] = "application/xml";
    }

    if (request.transferMode) {
        headers["x-ms-transfer-mode"] = request.transferMode;
    }

    if (request.ifmatch != null && request.ifnonematch != null) {
        throw new Error(
            `DynamicsWebApi.${request.functionName}. Either one of request.ifmatch or request.ifnonematch parameters should be used in a call, not both.`
        );
    }

    if (request.ifmatch) {
        ErrorHelper.stringParameterCheck(request.ifmatch, `DynamicsWebApi.${request.functionName}`, "request.ifmatch");
        headers["If-Match"] = request.ifmatch;
    }

    if (request.ifnonematch) {
        ErrorHelper.stringParameterCheck(request.ifnonematch, `DynamicsWebApi.${request.functionName}`, "request.ifnonematch");
        headers["If-None-Match"] = request.ifnonematch;
    }

    if (request.impersonate) {
        ErrorHelper.stringParameterCheck(request.impersonate, `DynamicsWebApi.${request.functionName}`, "request.impersonate");
        headers["MSCRMCallerID"] = ErrorHelper.guidParameterCheck(request.impersonate, `DynamicsWebApi.${request.functionName}`, "request.impersonate");
    }

    if (request.impersonateAAD) {
        ErrorHelper.stringParameterCheck(request.impersonateAAD, `DynamicsWebApi.${request.functionName}`, "request.impersonateAAD");
        headers["CallerObjectId"] = ErrorHelper.guidParameterCheck(request.impersonateAAD, `DynamicsWebApi.${request.functionName}`, "request.impersonateAAD");
    }

    if (request.token) {
        ErrorHelper.stringParameterCheck(request.token, `DynamicsWebApi.${request.functionName}`, "request.token");
        headers["Authorization"] = "Bearer " + request.token;
    }

    if (request.duplicateDetection) {
        ErrorHelper.boolParameterCheck(request.duplicateDetection, `DynamicsWebApi.${request.functionName}`, "request.duplicateDetection");
        headers["MSCRM.SuppressDuplicateDetection"] = "false";
    }

    if (request.bypassCustomPluginExecution) {
        ErrorHelper.boolParameterCheck(request.bypassCustomPluginExecution, `DynamicsWebApi.${request.functionName}`, "request.bypassCustomPluginExecution");
        headers["MSCRM.BypassCustomPluginExecution"] = "true";
    }

    if (request.noCache) {
        ErrorHelper.boolParameterCheck(request.noCache, `DynamicsWebApi.${request.functionName}`, "request.noCache");
        headers["Cache-Control"] = "no-cache";
    }

    if (request.mergeLabels) {
        ErrorHelper.boolParameterCheck(request.mergeLabels, `DynamicsWebApi.${request.functionName}`, "request.mergeLabels");
        headers["MSCRM.MergeLabels"] = "true";
    }

    if (request.contentId) {
        ErrorHelper.stringParameterCheck(request.contentId, `DynamicsWebApi.${request.functionName}`, "request.contentId");
        if (!request.contentId.startsWith("$")) {
            headers["Content-ID"] = request.contentId;
        }
    }

    if (request.contentRange) {
        ErrorHelper.stringParameterCheck(request.contentRange, `DynamicsWebApi.${request.functionName}`, "request.contentRange");
        headers["Content-Range"] = request.contentRange;
    }

    if (request.range) {
        ErrorHelper.stringParameterCheck(request.range, `DynamicsWebApi.${request.functionName}`, "request.range");
        headers["Range"] = request.range;
    }

    return headers;
};

export const composePreferHeader = (request: InternalRequest, config: Config): string => {
    let { returnRepresentation, includeAnnotations, maxPageSize, trackChanges, continueOnError } = request;

    if (request.prefer && request.prefer.length) {
        ErrorHelper.stringOrArrayParameterCheck(request.prefer, `DynamicsWebApi.${request.functionName}`, "request.prefer");
        const preferArray = typeof request.prefer === "string" ? request.prefer.split(",") : request.prefer;

        preferArray.forEach((item) => {
            const trimmedItem = item.trim();
            if (trimmedItem === "return=representation") {
                returnRepresentation = true;
            } else if (trimmedItem.includes("odata.include-annotations=")) {
                includeAnnotations = removeDoubleQuotes(trimmedItem.replace("odata.include-annotations=", ""));
            } else if (trimmedItem.startsWith("odata.maxpagesize=")) {
                maxPageSize = Number(removeDoubleQuotes(trimmedItem.replace("odata.maxpagesize=", ""))) || 0;
            } else if (trimmedItem.includes("odata.track-changes")) {
                trackChanges = true;
            } else if (trimmedItem.includes("odata.continue-on-error")) {
                continueOnError = true;
            }
        });
    }

    //clear array
    const prefer: string[] = [];

    if (config) {
        if (returnRepresentation == null) {
            returnRepresentation = config.returnRepresentation;
        }
        includeAnnotations = includeAnnotations ?? config.includeAnnotations;
        maxPageSize = maxPageSize ?? config.maxPageSize;
    }

    if (returnRepresentation) {
        ErrorHelper.boolParameterCheck(returnRepresentation, `DynamicsWebApi.${request.functionName}`, "request.returnRepresentation");
        prefer.push("return=representation");
    }

    if (includeAnnotations) {
        ErrorHelper.stringParameterCheck(includeAnnotations, `DynamicsWebApi.${request.functionName}`, "request.includeAnnotations");
        prefer.push(`odata.include-annotations="${includeAnnotations}"`);
    }

    if (maxPageSize && maxPageSize > 0) {
        ErrorHelper.numberParameterCheck(maxPageSize, `DynamicsWebApi.${request.functionName}`, "request.maxPageSize");
        prefer.push("odata.maxpagesize=" + maxPageSize);
    }

    if (trackChanges) {
        ErrorHelper.boolParameterCheck(trackChanges, `DynamicsWebApi.${request.functionName}`, "request.trackChanges");
        prefer.push("odata.track-changes");
    }

    if (continueOnError) {
        ErrorHelper.boolParameterCheck(continueOnError, `DynamicsWebApi.${request.functionName}`, "request.continueOnError");
        prefer.push("odata.continue-on-error");
    }

    return prefer.join(",");
};

export const convertToBatch = (requests: InternalRequest[], config: InternalConfig, batchRequest?: InternalRequest): InternalBatchRequest => {
    const batchBoundary = `dwa_batch_${Utility.generateUUID()}`;

    const batchBody: string[] = [];
    let currentChangeSet: string | null = null;
    let contentId = 100000;

    const addHeaders = (headers: Record<string, string>, batchBody: string[]) => {
        for (const key in headers) {
            if (key === "Authorization" || key === "Content-ID") continue;
            batchBody.push(`${key}: ${headers[key]}`);
        }
    };

    requests.forEach((internalRequest) => {
        internalRequest.functionName = "executeBatch";
        if (batchRequest?.inChangeSet === false) internalRequest.inChangeSet = false;
        const inChangeSet = internalRequest.method === "GET" ? false : !!internalRequest.inChangeSet;

        if (!inChangeSet && currentChangeSet) {
            //end current change set
            batchBody.push(`\n--${currentChangeSet}--`);

            currentChangeSet = null;
            contentId = 100000;
        }

        if (!currentChangeSet) {
            batchBody.push(`\n--${batchBoundary}`);

            if (inChangeSet) {
                currentChangeSet = `changeset_${Utility.generateUUID()}`;
                batchBody.push("Content-Type: multipart/mixed;boundary=" + currentChangeSet);
            }
        }

        if (inChangeSet) {
            batchBody.push(`\n--${currentChangeSet}`);
        }

        batchBody.push("Content-Type: application/http");
        batchBody.push("Content-Transfer-Encoding: binary");

        if (inChangeSet) {
            const contentIdValue = internalRequest.headers!.hasOwnProperty("Content-ID") ? internalRequest.headers!["Content-ID"] : ++contentId;

            batchBody.push(`Content-ID: ${contentIdValue}`);
        }

        if (!internalRequest.path?.startsWith("$")) {
            batchBody.push(`\n${internalRequest.method} ${config.dataApi.url}${internalRequest.path} HTTP/1.1`);
        } else {
            batchBody.push(`\n${internalRequest.method} ${internalRequest.path} HTTP/1.1`);
        }

        if (internalRequest.method === "GET") {
            batchBody.push("Accept: application/json");
        } else {
            batchBody.push("Content-Type: application/json");
        }

        if (internalRequest.headers) {
            addHeaders(internalRequest.headers, batchBody);
        }

        if (internalRequest.data) {
            batchBody.push(`\n${processData(internalRequest.data, config)}`);
        }
    });

    if (currentChangeSet) {
        batchBody.push(`\n--${currentChangeSet}--`);
    }

    batchBody.push(`\n--${batchBoundary}--`);

    const headers = setStandardHeaders(batchRequest?.userHeaders);
    headers["Content-Type"] = `multipart/mixed;boundary=${batchBoundary}`;

    return { headers: headers, body: batchBody.join("\n") };
};

export const findCollectionName = (entityName: string): string | null => {
    if (Utility.isNull(entityNames)) return null;

    const collectionName = entityNames[entityName];
    if (!collectionName) {
        for (const key in entityNames) {
            if (entityNames[key] === entityName) {
                return entityName;
            }
        }
    }

    return collectionName;
};

export const processData = (data: any, config: InternalConfig): string | Uint8Array | Uint16Array | Uint32Array | null => {
    if (!data) return null;

    if (data instanceof Uint8Array || data instanceof Uint16Array || data instanceof Uint32Array) return data;

    const replaceEntityNameWithCollectionName = (value: string): string => {
        const valueParts = SEARCH_FOR_ENTITY_NAME_REGEX.exec(value);
        if (valueParts && valueParts.length > 2) {
            const collectionName = findCollectionName(valueParts[1]);
            if (!Utility.isNull(collectionName)) {
                return value.replace(SEARCH_FOR_ENTITY_NAME_REGEX, `${collectionName}$2`);
            }
        }
        return value;
    };

    const addFullWebApiUrl = (key: string, value: string): string => {
        if (!value.startsWith(config.dataApi.url)) {
            if (key.endsWith("@odata.bind")) {
                if (!value.startsWith("/")) {
                    value = `/${value}`;
                }
            } else {
                value = `${config.dataApi.url}${removeLeadingSlash(value)}`;
            }
        }
        return value;
    };

    const stringifiedData = JSON.stringify(data, (key, value) => {
        if (key.endsWith("@odata.bind") || key.endsWith("@odata.id")) {
            if (typeof value === "string" && !value.startsWith("$")) {
                value = removeCurlyBracketsFromUuid(value);
                if (config.useEntityNames) {
                    value = replaceEntityNameWithCollectionName(value);
                }
                value = addFullWebApiUrl(key, value);
            }
        } else if (key.startsWith("oData") || key.endsWith("_Formatted") || key.endsWith("_NavigationProperty") || key.endsWith("_LogicalName")) {
            return undefined;
        }
        return value;
    });

    return escapeUnicodeSymbols(stringifiedData);
};

export const setStandardHeaders = (headers: HeaderCollection = {}): HeaderCollection => {
    if (!headers["Accept"]) headers["Accept"] = "application/json";
    if (!headers["OData-MaxVersion"]) headers["OData-MaxVersion"] = "4.0";
    if (!headers["OData-Version"]) headers["OData-Version"] = "4.0";
    if (headers["Content-Range"]) headers["Content-Type"] = "application/octet-stream";
    else if (!headers["Content-Type"]) headers["Content-Type"] = "application/json; charset=utf-8";

    return headers;
};
