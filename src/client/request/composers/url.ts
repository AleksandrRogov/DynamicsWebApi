import { ErrorHelper } from "../../../helpers/ErrorHelper.js";
import { InternalRequest } from "../../../types.js";
import { safelyRemoveCurlyBracketsFromUrl } from "../../../helpers/Regex.js";
import { Config } from "../../../dynamics-web-api.js";
import { isNull } from "../../../utils/Utility.js";

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
                    "request.navigationPropertyKey",
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

        if (request.tag) {
            ErrorHelper.stringParameterCheck(request.tag, `DynamicsWebApi.${request.functionName}`, "request.tag");
            queryArray.push("tag=" + encodeURIComponent(request.tag));
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

        if (request.fetchXml) {
            ErrorHelper.stringParameterCheck(request.fetchXml, `DynamicsWebApi.${request.functionName}`, "request.fetchXml");
            queryArray.push("fetchXml=" + encodeURIComponent(request.fetchXml));
        }

        if (!isNull(request.inChangeSet)) {
            ErrorHelper.boolParameterCheck(request.inChangeSet, `DynamicsWebApi.${request.functionName}`, "request.inChangeSet");
        }

        if (request.isBatch && isNull(request.inChangeSet)) request.inChangeSet = true;

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
                        expandConverted = `(${expandConverted})`;
                    }
                    expandQueryArray.push(property + expandConverted);
                }
                if (expandQueryArray.length) {
                    queryArray.push("$expand=" + expandQueryArray.join(","));
                }
            }
        }
    }

    // nothing to add to the URL
    if (!queryArray.length) {
        return url;
    }

    // in any other cases the joinSymbol is ";" (during expand process)
    if (joinSymbol === "&") {
        url += "?";
    }

    return url + queryArray.join(joinSymbol);

    // return !queryArray.length ? url : url + "?" + queryArray.join(joinSymbol);
};
