import type { IDataverseClient } from "../../client/dataverse";
import type { CreateAttributeRequest, CreateRequest } from "../../dynamics-web-api";
import { copyRequest } from "../../utils/Utility";
import { create } from "../create";
import { LIBRARY_NAME } from "../constants";
import { ErrorHelper } from "../../helpers/ErrorHelper";

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
