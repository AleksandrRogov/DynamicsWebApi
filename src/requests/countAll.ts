import type { IDataverseClient } from "../client/dataverse.js";
import type { CountAllRequest } from "../dynamics-web-api.js";
import { ErrorHelper } from "../helpers/ErrorHelper.js";
import { LIBRARY_NAME } from "./constants.js";
import { retrieveAllRequest } from "./retrieveAll.js";

const FUNCTION_NAME = "countAll";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const countAll = async (request: CountAllRequest, client: IDataverseClient): Promise<number> => {
    ErrorHelper.throwBatchIncompatible(REQUEST_NAME, client.isBatch);
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    const response = await retrieveAllRequest(request, client);

    return response.value.length;
};
