import type { IDataverseClient } from "../../client/dataverse";
import type { UpdateEntityRequest, UpdateRequest } from "../../dynamics-web-api";
import { ErrorHelper } from "../../helpers/ErrorHelper";
import { copyRequest } from "../../utils/Utility";
import { LIBRARY_NAME } from "../constants";
import { update } from "../update";

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
