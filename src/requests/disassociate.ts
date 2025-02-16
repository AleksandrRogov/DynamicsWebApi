import type { IDataverseClient } from "../client/dataverse";
import type { DisassociateRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { copyRequest } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "disassociate";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const disassociate = async (request: DisassociateRequest, client: IDataverseClient): Promise<void> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    let internalRequest = copyRequest(request);
    internalRequest.method = "DELETE";
    internalRequest.functionName = FUNCTION_NAME;

    ErrorHelper.stringParameterCheck(request.relationshipName, REQUEST_NAME, "request.relationshipName");
    const primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, REQUEST_NAME, "request.primaryKey");
    const relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, REQUEST_NAME, "request.relatedId");

    internalRequest.key = primaryKey;
    internalRequest.navigationProperty = `${request.relationshipName}(${relatedKey})/$ref`;

    await client.makeRequest(internalRequest);
};
