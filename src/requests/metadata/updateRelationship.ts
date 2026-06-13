import type { IDataverseClient } from "../../client/dataverse.js";
import type { UpdateRelationshipRequest, UpdateRequest } from "../../dynamics-web-api.js";
import { copyRequest } from "../../utils/Utility.js";
import { update } from "../update.js";
import { LIBRARY_NAME } from "../constants.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";

const FUNCTION_NAME = "updateRelationship";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;


export function updateRelationship<T = any>(request: UpdateRelationshipRequest, client: IDataverseClient): Promise<T> {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.parameterCheck(request.data, REQUEST_NAME, "request.data");
    ErrorHelper.guidParameterCheck(request.data.MetadataId, REQUEST_NAME, "request.data.MetadataId");

    if (request.castType) {
        ErrorHelper.stringParameterCheck(request.castType, REQUEST_NAME, "request.castType");
    }

    const internalRequest = copyRequest(request);
    internalRequest.collection = "RelationshipDefinitions";
    internalRequest.key = request.data.MetadataId;
    internalRequest.navigationProperty = request.castType;
    internalRequest.functionName = FUNCTION_NAME;
    internalRequest.method = "PUT";

    return update(internalRequest as UpdateRequest, client);
}