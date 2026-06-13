import type { IDataverseClient } from "../client/dataverse.js";
import type { UpsertRequest } from "../dynamics-web-api.js";
import { ErrorHelper } from "../helpers/ErrorHelper.js";
import { copyRequest } from "../utils/Utility.js";
import { LIBRARY_NAME } from "./constants.js";

const FUNCTION_NAME = "upsert";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const upsert = async <TData = any, TResponse = TData>(request: UpsertRequest<TData>, client: IDataverseClient): Promise<TResponse> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    const internalRequest = copyRequest(request);
    internalRequest.method = "PATCH";
    internalRequest.functionName = FUNCTION_NAME;

    if (client.config.propagateErrors) {
        const response = await client.makeRequest(internalRequest);
        return response?.data;
    }

    //copy locally
    const ifnonematch = internalRequest.ifnonematch;
    const ifmatch = internalRequest.ifmatch;

    // todo: legacy error handling - to be removed in a future major release
    try {
        const response = await client.makeRequest(internalRequest);
        return response?.data;
    } catch (error: any) {
        if (ifnonematch && error.status === 412) {
            //if prevent update
            return null as any; //todo: check this
        } else if (ifmatch && error.status === 404) {
            //if prevent create
            return null as any; //todo: check this
        }
        //rethrow error otherwise
        throw error;
    }
};
