import type { IDataverseClient } from "../../client/dataverse.js";
import type { CreateRequest, CreateRelationshipRequest } from "../../dynamics-web-api.js";
import { copyRequest } from "../../utils/Utility.js";
import { create } from "../create.js";
import { LIBRARY_NAME } from "../constants.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";

const FUNCTION_NAME = "createRelationship";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const createRelationship = <T = any>(request: CreateRelationshipRequest, client: IDataverseClient): Promise<T> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.parameterCheck(request.data, REQUEST_NAME, "request.data");

    const internalRequest = copyRequest(request);
    internalRequest.collection = "RelationshipDefinitions";
    internalRequest.functionName = FUNCTION_NAME;

    return create(internalRequest as CreateRequest, client);
};