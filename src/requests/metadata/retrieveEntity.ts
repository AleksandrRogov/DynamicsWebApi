import type { IDataverseClient } from "../../client/dataverse";
import type { RetrieveEntityRequest, RetrieveRequest } from "../../dynamics-web-api";
import { ErrorHelper } from "../../helpers/ErrorHelper";
import { copyRequest } from "../../utils/Utility";
import { LIBRARY_NAME } from "../constants";
import { retrieve } from "../retrieve";

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
