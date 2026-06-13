import type { IDataverseClient } from "../../client/dataverse.js";
import type { CreateAttributeRequest, CreateRequest } from "../../dynamics-web-api.js";
import { copyRequest } from "../../utils/Utility.js";
import { create } from "../create.js";
import { LIBRARY_NAME } from "../constants.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";

const FUNCTION_NAME = "createAttribute";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const createAttribute = <T = any>(request: CreateAttributeRequest, client: IDataverseClient): Promise<T> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.parameterCheck(request.data, REQUEST_NAME, "request.data");
    ErrorHelper.keyParameterCheck(request.entityKey, REQUEST_NAME, "request.entityKey");

    const internalRequest = copyRequest(request);
    internalRequest.collection = "EntityDefinitions";
    internalRequest.functionName = FUNCTION_NAME;
    internalRequest.navigationProperty = "Attributes";
    internalRequest.key = request.entityKey;

    return create(internalRequest as CreateRequest, client);
};
