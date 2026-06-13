import type { IDataverseClient } from "../../client/dataverse.js";
import type { UpdateEntityRequest, UpdateRequest } from "../../dynamics-web-api.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";
import { copyRequest } from "../../utils/Utility.js";
import { LIBRARY_NAME } from "../constants.js";
import { update } from "../update.js";

const FUNCTION_NAME = "updateEntity";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const updateEntity = async <T = any>(request: UpdateEntityRequest, client: IDataverseClient): Promise<T> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.parameterCheck(request.data, REQUEST_NAME, "request.data");

    const internalRequest = copyRequest(request);
    internalRequest.collection = "EntityDefinitions";
    internalRequest.functionName = FUNCTION_NAME;
    internalRequest.key = internalRequest.data.MetadataId;
    internalRequest.method = "PUT";

    return await update(<UpdateRequest>internalRequest, client);
};
