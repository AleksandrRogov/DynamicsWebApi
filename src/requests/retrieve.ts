import type { IDataverseClient } from "../client/dataverse";
import type { RetrieveRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import type { InternalRequest } from "../types";
import { copyRequest } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "retrieve";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const retrieve = async <T = any>(request: RetrieveRequest, client: IDataverseClient): Promise<T> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    let internalRequest: InternalRequest;

    if (!(<InternalRequest>request).functionName) {
        internalRequest = copyRequest(request);
        internalRequest.functionName = FUNCTION_NAME;
    } else internalRequest = request;

    internalRequest.method = "GET";
    internalRequest.responseParameters = {
        isRef: internalRequest.select?.length === 1 && internalRequest.select[0].endsWith("/$ref"),
    };

    const response = await client.makeRequest(internalRequest);
    return response?.data;
};