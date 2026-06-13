import { composeHeaders, composeUrl } from "./index.js";
import { ErrorHelper } from "../../../helpers/ErrorHelper.js";
import type { InternalRequest } from "../../../types.js";
import type { InternalConfig } from "../../../utils/Config.js";

/**
 * Converts a request object to URL link
 * @param request Internal request object
 * @param config Internal configuration object
 * @returns Modified internal request object
 */
export const composeRequest = (request: InternalRequest, config: Partial<InternalConfig>): InternalRequest => {
    request.path = ""; //path must always be reset
    request.functionName = request.functionName || "";
    if (!request.url) {
        if (!request._isUnboundRequest && !request.contentId && !request.collection) {
            ErrorHelper.parameterCheck(request.collection, `DynamicsWebApi.${request.functionName}`, "request.collection");
        }

        if (request.contentId) {
            ErrorHelper.stringParameterCheck(request.contentId, `DynamicsWebApi.${request.functionName}`, "request.contentId");
            if (request.contentId.startsWith("$")) {
                request.path = request.contentId;
            }
        }

        if (request.collection != null) {
            ErrorHelper.stringParameterCheck(request.collection, `DynamicsWebApi.${request.functionName}`, "request.collection");
            request.path += request.path ? `/${request.collection}` : request.collection;

            //add alternate key feature
            if (request.key) {
                request.key = ErrorHelper.keyParameterCheck(request.key, `DynamicsWebApi.${request.functionName}`, "request.key");
                request.path += `(${request.key})`;
            }
        }

        if (request.addPath) {
            if (request.path) {
                request.path += "/";
            }
            request.path += request.addPath;
        }

        request.path = composeUrl(request, config, request.path);
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