import type * as Core from "../types";
import { generateUUID, isRunningWithinPortals, isNull } from "../utils/Utility";
import { InternalConfig } from "../utils/Config";
import * as RequestUtility from "../utils/Request";
import { DynamicsWebApiError, ErrorHelper } from "../helpers/ErrorHelper";
import { executeRequest } from "./helpers/executeRequest";
import { AccessToken } from "../dynamics-web-api";

const _addResponseParams = (requestId: string, responseParams: Record<string, any>) => {
    if (_responseParseParams[requestId]) _responseParseParams[requestId].push(responseParams);
    else _responseParseParams[requestId] = [responseParams];
};

const _addRequestToBatchCollection = (requestId: string, request: Core.InternalRequest) => {
    if (_batchRequestCollection[requestId]) _batchRequestCollection[requestId].push(request);
    else _batchRequestCollection[requestId] = [request];
};

const _clearRequestData = (requestId: string): void => {
    delete _responseParseParams[requestId];
    if (_batchRequestCollection.hasOwnProperty(requestId)) delete _batchRequestCollection[requestId];
};

const _runRequest = async (request: Core.InternalRequest, config: InternalConfig): Promise<Core.WebApiResponse> => {
    try {
        const result = await sendRequest(request, config);
        _clearRequestData(request.requestId!);

        return result;
    } catch (error) {
        _clearRequestData(request.requestId!);
        throw error;
    } finally {
        _clearRequestData(request.requestId!);
    }
};

let _batchRequestCollection: Core.BatchRequestCollection = {};
let _responseParseParams: { [key: string]: any[] } = {};

const _nameExceptions = [
    "$metadata",
    "EntityDefinitions",
    "RelationshipDefinitions",
    "GlobalOptionSetDefinitions",
    "ManagedPropertyDefinitions",
    "query",
    "suggest",
    "autocomplete",
];

const _isEntityNameException = (entityName: string): boolean => {
    return _nameExceptions.indexOf(entityName) > -1;
};

const _getCollectionNames = async (entityName: string, config: InternalConfig): Promise<string | null | undefined> => {
    if (!isNull(RequestUtility.entityNames)) {
        return RequestUtility.findCollectionName(entityName) || entityName;
    }

    const request = RequestUtility.compose(
        {
            method: "GET",
            collection: "EntityDefinitions",
            select: ["EntitySetName", "LogicalName"],
            noCache: true,
            functionName: "retrieveMultiple",
        },
        config,
    );

    const result = await _runRequest(request, config);
    RequestUtility.setEntityNames({});
    for (let i = 0; i < result.data.value.length; i++) {
        RequestUtility.entityNames![result.data.value[i].LogicalName] = result.data.value[i].EntitySetName;
    }

    return RequestUtility.findCollectionName(entityName) || entityName;
};

const _checkCollectionName = async (entityName: string | null | undefined, config: InternalConfig): Promise<string | null | undefined> => {
    if (!entityName || _isEntityNameException(entityName)) {
        return entityName;
    }

    entityName = entityName.toLowerCase();

    if (!config.useEntityNames) {
        return entityName;
    }

    try {
        return await _getCollectionNames(entityName, config);
    } catch (error: any) {
        throw new Error("Unable to fetch Collection Names. Error: " + (error as DynamicsWebApiError).message);
    }
};

/**
 * Sends a request to given URL with given parameters
 *
 * @param {InternalRequest} request - Composed request to D365 Web Api
 * @param {InternalConfig} config - DynamicsWebApi config.
 */
export const sendRequest = async (request: Core.InternalRequest, config: InternalConfig): Promise<Core.WebApiResponse> => {
    request.headers = request.headers || {};
    request.responseParameters = request.responseParameters || {};
    request.requestId = request.requestId || generateUUID();

    //add response parameters to parse
    _addResponseParams(request.requestId, request.responseParameters);

    //stringify passed data
    let processedData = null;

    const isBatchConverted = request.responseParameters?.convertedToBatch;

    if (request.path === "$batch" && !isBatchConverted) {
        const batchRequest = _batchRequestCollection[request.requestId];

        if (!batchRequest) throw ErrorHelper.batchIsEmpty();

        const batchResult = RequestUtility.convertToBatch(batchRequest, config, request);

        processedData = batchResult.body;
        request.headers = { ...batchResult.headers, ...request.headers };

        //clear an array of requests
        delete _batchRequestCollection[request.requestId];
    } else {
        processedData = !isBatchConverted ? RequestUtility.processData(request.data, config) : request.data;

        if (!isBatchConverted) request.headers = RequestUtility.setStandardHeaders(request.headers);
    }

    if (config.impersonate && !request.headers!["MSCRMCallerID"]) {
        request.headers!["MSCRMCallerID"] = config.impersonate;
    }

    if (config.impersonateAAD && !request.headers!["CallerObjectId"]) {
        request.headers!["CallerObjectId"] = config.impersonateAAD;
    }

    let token: AccessToken | string | null = null;

    //call a token refresh callback only if it is set and there is no "Authorization" header set yet
    if (config.onTokenRefresh && (!request.headers || (request.headers && !request.headers["Authorization"]))) {
        token = await config.onTokenRefresh();
        if (!token) throw new Error("Token is empty. Request is aborted.");
    }

    if (token) {
        request.headers!["Authorization"] = "Bearer " + (token.hasOwnProperty("accessToken") ? (token as AccessToken).accessToken : token);
    }

    if (isRunningWithinPortals()) {
        request.headers!["__RequestVerificationToken"] = await global.window.shell!.getTokenDeferred();
    }

    const url = request.apiConfig ? request.apiConfig.url : config.dataApi.url;

    return await executeRequest({
        method: request.method!,
        uri: url!.toString() + request.path,
        data: processedData,
        proxy: config.proxy,
        isAsync: request.async,
        headers: request.headers!,
        requestId: request.requestId!,
        abortSignal: request.signal,
        responseParams: _responseParseParams,
        timeout: request.timeout || config.timeout,
    });
};

export const makeRequest = async (request: Core.InternalRequest, config: InternalConfig): Promise<Core.WebApiResponse | undefined> => {
    request.responseParameters = request.responseParameters || {};
    //we don't want to mix headers set by the library and by the user
    request.userHeaders = request.headers;
    delete request.headers;

    if (!request.isBatch) {
        const collectionName = await _checkCollectionName(request.collection, config);

        request.collection = collectionName;
        RequestUtility.compose(request, config);
        request.responseParameters.convertedToBatch = false;

        //the URL contains more characters than max possible limit, convert the request to a batch request
        if (request.path!.length > 2000) {
            const batchRequest = RequestUtility.convertToBatch([request], config);

            //#175 authorization header must be copied as well.
            //todo: is it the only one that needs to be copied?
            if (request.headers!["Authorization"]) {
                batchRequest.headers["Authorization"] = request.headers!["Authorization"];
            }

            request.method = "POST";
            request.path = "$batch";
            request.data = batchRequest.body;
            request.headers = { ...batchRequest.headers, ...request.userHeaders };
            request.responseParameters.convertedToBatch = true;
        }

        return _runRequest(request, config);
    }

    //no need to make a request to web api if it's a part of batch
    RequestUtility.compose(request, config);
    //add response parameters to parse
    _addResponseParams(request.requestId!, request.responseParameters);
    _addRequestToBatchCollection(request.requestId!, request);
};

export const _clearTestData = (): void => {
    RequestUtility.setEntityNames(null);
    _responseParseParams = {};
    _batchRequestCollection = {};
};

export const getCollectionName = (entityName: string): string | null => {
    return RequestUtility.findCollectionName(entityName);
};
