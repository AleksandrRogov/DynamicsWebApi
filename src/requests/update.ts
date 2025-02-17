import type { IDataverseClient } from "../client/dataverse";
import type { UpdateRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { getUpdateMethod } from "../helpers/Regex";
import type { InternalRequest } from "../types";
import { copyRequest } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "update";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const update = async <TData = any>(request: UpdateRequest<TData>, client: IDataverseClient): Promise<TData> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    let internalRequest: InternalRequest;

    if (!(<InternalRequest>request).functionName) {
        internalRequest = copyRequest(request);
        internalRequest.functionName = FUNCTION_NAME;
    } else internalRequest = request;

    internalRequest.method ??= getUpdateMethod(internalRequest.collection);
    internalRequest.responseParameters = { valueIfEmpty: true };
    internalRequest.ifmatch ??= "*"; //to prevent upsert

    //copy locally
    const ifmatch = internalRequest.ifmatch;

    try {
        const response = await client.makeRequest(internalRequest);
        return response?.data;
    } catch (error: any) {
        if (ifmatch && error.status === 412) {
            //precondition failed - not updated
            return false as any; //todo: check this
        }
        //rethrow error otherwise
        throw error;
    }
};
