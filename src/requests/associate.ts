import type { IDataverseClient } from "../client/dataverse";
import type { AssociateRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { copyRequest } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "associate";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const associate = async (request: AssociateRequest, client: IDataverseClient): Promise<void> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    let internalRequest = copyRequest(request);
    internalRequest.method = "POST";
    internalRequest.functionName = FUNCTION_NAME;

    ErrorHelper.stringParameterCheck(request.relatedCollection, REQUEST_NAME, "request.relatedcollection");
    ErrorHelper.stringParameterCheck(request.relationshipName, REQUEST_NAME, "request.relationshipName");
    const primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, REQUEST_NAME, "request.primaryKey");
    const relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, REQUEST_NAME, "request.relatedKey");

    internalRequest.navigationProperty = request.relationshipName + "/$ref";
    internalRequest.key = primaryKey;
    internalRequest.data = { "@odata.id": `${request.relatedCollection}(${relatedKey})` };

    await client.makeRequest(internalRequest);
};
