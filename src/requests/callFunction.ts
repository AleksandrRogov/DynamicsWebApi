import type { IDataverseClient } from "../client/dataverse";
import type { BoundFunctionRequest, UnboundFunctionRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import type { InternalRequest } from "../types";
import { buildFunctionParameters, copyObject } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "callFunction";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const callFunction = async <TData = any>(request: string | BoundFunctionRequest | UnboundFunctionRequest, client: IDataverseClient): Promise<TData> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    const getFunctionName = (request: BoundFunctionRequest | UnboundFunctionRequest) => request.name || request.functionName;

    const isObject = typeof request !== "string";
    const functionName = isObject ? getFunctionName(request) : request;
    const parameterName = isObject ? "request.name" : "name";
    const internalRequest: InternalRequest = isObject ? copyObject(request, ["name"]) : { functionName: functionName };

    ErrorHelper.stringParameterCheck(functionName, REQUEST_NAME, parameterName);

    const functionParameters = buildFunctionParameters(internalRequest.parameters);

    internalRequest.method = "GET";
    internalRequest.addPath = functionName + functionParameters.key;
    internalRequest.queryParams = functionParameters.queryParams;
    internalRequest._isUnboundRequest = !internalRequest.collection;
    internalRequest.functionName = FUNCTION_NAME;

    const response = await client.makeRequest(internalRequest);
    return response?.data;
};
