import type { Config, HeaderCollection } from "../../../dynamics-web-api.js";
import { ErrorHelper } from "../../../helpers/ErrorHelper.js";
import type { InternalRequest } from "../../../types.js";
import { composePreferHeader } from "./preferHeader.js";

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
            `DynamicsWebApi.${request.functionName}. Either one of request.ifmatch or request.ifnonematch parameters should be used in a call, not both.`,
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