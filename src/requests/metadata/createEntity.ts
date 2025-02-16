import type { IDataverseClient } from "../../client/dataverse";
import type { CreateEntityRequest, CreateRequest } from "../../dynamics-web-api";
import { ErrorHelper } from "../../helpers/ErrorHelper";
import { copyRequest } from "../../utils/Utility";
import { LIBRARY_NAME } from "../constants";
import { create } from "../create";

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
