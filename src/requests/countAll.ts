import type { IDataverseClient } from "../client/dataverse";
import type { CountAllRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { LIBRARY_NAME } from "./constants";
import { retrieveAllRequest } from "./retrieveAll";

const FUNCTION_NAME = "countAll";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const countAll = async (request: CountAllRequest, client: IDataverseClient): Promise<number> => {
    ErrorHelper.throwBatchIncompatible(REQUEST_NAME, client.isBatch);
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    const response = await retrieveAllRequest(request, client);

    return response ? (response.value ? response.value.length : 0) : 0;
};
