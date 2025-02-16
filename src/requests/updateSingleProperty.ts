import type { IDataverseClient } from "../client/dataverse";
import type { UpdateSinglePropertyRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { copyRequest } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "updateSingleProperty";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const updateSingleProperty = async <T = any>(request: UpdateSinglePropertyRequest, client: IDataverseClient): Promise<T> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.parameterCheck(request.fieldValuePair, REQUEST_NAME, "request.fieldValuePair");

    var field = Object.keys(request.fieldValuePair)[0];
    var fieldValue = request.fieldValuePair[field];

    const internalRequest = copyRequest(request);
    internalRequest.navigationProperty = field;
    internalRequest.data = { value: fieldValue };
    internalRequest.functionName = FUNCTION_NAME;
    internalRequest.method = "PUT";

    delete internalRequest["fieldValuePair"];

    const response = await client.makeRequest(internalRequest);
    return response?.data;
};
