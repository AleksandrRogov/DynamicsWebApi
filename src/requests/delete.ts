import type { IDataverseClient } from "../client/dataverse";
import type { DeleteRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import type { InternalRequest } from "../types";
import { copyRequest } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "deleteRecord";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const deleteRecord = async (request: DeleteRequest, client: IDataverseClient): Promise<any> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    let internalRequest: InternalRequest;

    if (!(<InternalRequest>request).functionName) {
        internalRequest = copyRequest(request);
        internalRequest.functionName = FUNCTION_NAME;
    } else internalRequest = request;

    internalRequest.method = "DELETE";
    internalRequest.responseParameters = { valueIfEmpty: true };

    //copy locally
    const ifmatch = internalRequest.ifmatch;

    try {
        const response = await client.makeRequest(internalRequest);
        return response?.data;
    } catch (error: any) {
        if (ifmatch && error.status === 412) {
            //precondition failed - not updated
            return false; //todo: check this
        }
        //rethrow error otherwise
        throw error;
    }
};
