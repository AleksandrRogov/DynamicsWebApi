import type { IDataverseClient } from "../client/dataverse";
import type { CountRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { copyRequest } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "count";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const count = async (request: CountRequest, client: IDataverseClient): Promise<number> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    const internalRequest = copyRequest(request);
    internalRequest.method = "GET";
    internalRequest.functionName = FUNCTION_NAME;

    if (internalRequest.filter?.length) {
        internalRequest.count = true;
    } else {
        internalRequest.navigationProperty = "$count";
    }

    internalRequest.responseParameters = { toCount: internalRequest.count };

    //if filter has not been specified then simplify the request
    const response = await client.makeRequest(internalRequest);
    return response?.data;
};
