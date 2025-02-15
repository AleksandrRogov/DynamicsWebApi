import type { IDataverseClient } from "../client/dataverse";
import type { CreateRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import type { InternalRequest } from "../types";
import { copyRequest } from "../utils/Utility";

const REQUEST_NAME = "DynamicsWebApi.create";

export const create = async <TData = any>(request: CreateRequest<TData>, client: IDataverseClient): Promise<TData> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    let internalRequest: InternalRequest;

    if (!(<InternalRequest>request).functionName) {
        internalRequest = copyRequest(request);
        internalRequest.functionName = "create";
    } else internalRequest = <InternalRequest>request;

    internalRequest.method = "POST";

    const response = await client.makeRequest(internalRequest);

    return response?.data;
};
