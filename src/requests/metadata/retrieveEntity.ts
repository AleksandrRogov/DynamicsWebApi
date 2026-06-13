import type { IDataverseClient } from "../../client/dataverse.js";
import type { RetrieveEntityRequest, RetrieveRequest } from "../../dynamics-web-api.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";
import { copyRequest } from "../../utils/Utility.js";
import { LIBRARY_NAME } from "../constants.js";
import { retrieve } from "../retrieve.js";

const FUNCTION_NAME = "retrieveEntity";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const retrieveEntity = async <T = any>(request: RetrieveEntityRequest, client: IDataverseClient): Promise<T> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.keyParameterCheck(request.key, REQUEST_NAME, "request.key");

    const internalRequest = copyRequest(request);
    internalRequest.collection = "EntityDefinitions";
    internalRequest.functionName = "retrieveEntity";

    return await retrieve<T>(<RetrieveRequest>internalRequest, client);
};
