import type { IDataverseClient } from "../client/dataverse.js";
import type { CreateRequest } from "../dynamics-web-api.js";
import { ErrorHelper } from "../helpers/ErrorHelper.js";
import type { InternalRequest } from "../types.js";
import { copyRequest } from "../utils/Utility.js";
import { LIBRARY_NAME } from "./constants.js";

const FUNCTION_NAME = "create";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const create = async <TData = any, TResponse = TData>(request: CreateRequest<TData>, client: IDataverseClient): Promise<TResponse> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    let internalRequest: InternalRequest;

    if (!(<InternalRequest>request).functionName) {
        internalRequest = copyRequest(request);
        internalRequest.functionName = FUNCTION_NAME;
    } else internalRequest = <InternalRequest>request;

    internalRequest.method = "POST";

    const response = await client.makeRequest(internalRequest);

    return response?.data;
};
