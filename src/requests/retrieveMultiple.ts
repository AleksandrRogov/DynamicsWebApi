import type { IDataverseClient } from "../client/dataverse.js";
import type { RetrieveMultipleRequest, RetrieveMultipleResponse } from "../dynamics-web-api.js";
import { ErrorHelper } from "../helpers/ErrorHelper.js";
import type { InternalRequest } from "../types.js";
import { copyRequest } from "../utils/Utility.js";
import { LIBRARY_NAME } from "./constants.js";

const FUNCTION_NAME = "retrieveMultiple";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const retrieveMultiple = async <T = any>(
    request: RetrieveMultipleRequest,
    client: IDataverseClient,
    nextPageLink?: string,
): Promise<RetrieveMultipleResponse<T>> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    let internalRequest: InternalRequest;

    if (!(<InternalRequest>request).functionName) {
        internalRequest = copyRequest(request);
        internalRequest.functionName = FUNCTION_NAME;
    } else internalRequest = request;

    internalRequest.method = "GET";

    if (nextPageLink) {
        ErrorHelper.stringParameterCheck(nextPageLink, REQUEST_NAME, "nextPageLink");
        internalRequest.url = nextPageLink;
    }

    const response = await client.makeRequest(internalRequest);

    return response?.data;
};
