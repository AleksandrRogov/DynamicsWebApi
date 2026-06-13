import type { IDataverseClient } from "../client/dataverse.js";
import type { DisassociateSingleValuedRequest } from "../dynamics-web-api.js";
import { ErrorHelper } from "../helpers/ErrorHelper.js";
import { copyRequest } from "../utils/Utility.js";
import { LIBRARY_NAME } from "./constants.js";

const FUNCTION_NAME = "disassociateSingleValued";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const disassociateSingleValued = async (request: DisassociateSingleValuedRequest, client: IDataverseClient): Promise<void> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    let internalRequest = copyRequest(request);
    internalRequest.method = "DELETE";
    internalRequest.functionName = FUNCTION_NAME;

    ErrorHelper.stringParameterCheck(request.navigationProperty, REQUEST_NAME, "request.navigationProperty");
    const primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, REQUEST_NAME, "request.primaryKey");

    internalRequest.navigationProperty += "/$ref";
    internalRequest.key = primaryKey;

    await client.makeRequest(internalRequest);
};
