import type { IDataverseClient } from "../../client/dataverse.js";
import type { RetrieveRelationshipRequest, RetrieveRequest } from "../../dynamics-web-api.js";
import { copyRequest } from "../../utils/Utility.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";
import { retrieve } from "../retrieve.js";

const FUNCTION_NAME = "retrieveRelationship";
const REQUEST_NAME = `DynamicsWebApi.${FUNCTION_NAME}`;

export async function retrieveRelationship<T = any>(request: RetrieveRelationshipRequest, client: IDataverseClient): Promise<T> {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.keyParameterCheck(request.key, REQUEST_NAME, "request.key");

    if (request.castType) {
        ErrorHelper.stringParameterCheck(request.castType, REQUEST_NAME, "request.castType");
    }

    const internalRequest = copyRequest(request);
    internalRequest.collection = "RelationshipDefinitions";
    internalRequest.navigationProperty = request.castType;
    internalRequest.functionName = FUNCTION_NAME;

    return retrieve(<RetrieveRequest>internalRequest, client);
}