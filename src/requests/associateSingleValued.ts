import type { IDataverseClient } from "../client/dataverse";
import type { AssociateSingleValuedRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { copyRequest } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "associateSingleValued";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const associateSingleValued = async (request: AssociateSingleValuedRequest, client: IDataverseClient): Promise<void> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    let internalRequest = copyRequest(request);
    internalRequest.method = "PUT";
    internalRequest.functionName = FUNCTION_NAME;

    const primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, REQUEST_NAME, "request.primaryKey");
    const relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, REQUEST_NAME, "request.relatedKey");
    ErrorHelper.stringParameterCheck(request.navigationProperty, REQUEST_NAME, "request.navigationProperty");
    ErrorHelper.stringParameterCheck(request.relatedCollection, REQUEST_NAME, "request.relatedcollection");

    internalRequest.navigationProperty += "/$ref";
    internalRequest.key = primaryKey;
    internalRequest.data = { "@odata.id": `${request.relatedCollection}(${relatedKey})` };

    await client.makeRequest(internalRequest);
};
