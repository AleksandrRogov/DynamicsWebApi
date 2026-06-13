import type { IDataverseClient } from "../../client/dataverse.js";
import type { CreateEntityRequest, CreateRequest } from "../../dynamics-web-api.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";
import { copyRequest } from "../../utils/Utility.js";
import { LIBRARY_NAME } from "../constants.js";
import { create } from "../create.js";

const FUNCTION_NAME = "createEntity";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const createEntity = async <T = any>(request: CreateEntityRequest, client: IDataverseClient): Promise<T> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.parameterCheck(request.data, REQUEST_NAME, "request.data");

    const internalRequest = copyRequest(request);
    internalRequest.collection = "EntityDefinitions";
    internalRequest.functionName = FUNCTION_NAME;

    return create(<CreateRequest>internalRequest, client);
};
