import type { IDataverseClient } from "../client/dataverse";
import type { UpsertRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { copyRequest } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "upsert";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const upsert = async <TData = any>(request: UpsertRequest<TData>, client: IDataverseClient): Promise<TData> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    const internalRequest = copyRequest(request);
    internalRequest.method = "PATCH";
    internalRequest.functionName = FUNCTION_NAME;

    //copy locally
    const ifnonematch = internalRequest.ifnonematch;
    const ifmatch = internalRequest.ifmatch;
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
