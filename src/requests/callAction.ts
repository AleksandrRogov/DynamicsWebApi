import type { IDataverseClient } from "../client/dataverse";
import type { BoundActionRequest, UnboundActionRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { copyRequest } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "callAction";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const callAction = async <TResponse = any, TAction = any>(
    request: BoundActionRequest<TAction> | UnboundActionRequest<TAction>,
    client: IDataverseClient,
): Promise<TResponse> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.stringParameterCheck(request.actionName, REQUEST_NAME, "request.actionName");

    const internalRequest = copyRequest(request, ["action"]);
    internalRequest.method = "POST";
    internalRequest.functionName = FUNCTION_NAME;

    internalRequest.addPath = request.actionName;
    internalRequest._isUnboundRequest = !internalRequest.collection;
    internalRequest.data = request.action;

    const response = await client.makeRequest(internalRequest);
    return response?.data;
};
