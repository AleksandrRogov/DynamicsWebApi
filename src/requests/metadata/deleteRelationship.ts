import type { IDataverseClient } from "../../client/dataverse.js";
import type { DeleteRelationshipRequest, DeleteRequest } from "../../dynamics-web-api.js";
import { copyRequest } from "../../utils/Utility.js";
import { LIBRARY_NAME } from "../constants.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";
import { deleteRecord } from "../delete.js";

const FUNCTION_NAME = "deleteRelationship";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export async function deleteRelationship(request: DeleteRelationshipRequest, client: IDataverseClient): Promise<any> {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.keyParameterCheck(request.key, REQUEST_NAME, "request.key");

    const internalRequest = copyRequest(request);
    internalRequest.collection = "RelationshipDefinitions";
    internalRequest.functionName = FUNCTION_NAME;

    return deleteRecord(internalRequest as DeleteRequest, client);
}