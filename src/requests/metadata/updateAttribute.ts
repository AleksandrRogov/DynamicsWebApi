import type { IDataverseClient } from "../../client/dataverse.js";
import type { UpdateAttributeRequest, UpdateRequest } from "../../dynamics-web-api.js";
import { copyRequest } from "../../utils/Utility.js";
import { update } from "../update.js";
import { LIBRARY_NAME } from "../constants.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";

const FUNCTION_NAME = "updateAttribute";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const updateAttribute = <T = any>(request: UpdateAttributeRequest, client: IDataverseClient): Promise<T> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.parameterCheck(request.data, REQUEST_NAME, "request.data");
    ErrorHelper.keyParameterCheck(request.entityKey, REQUEST_NAME, "request.entityKey");
    ErrorHelper.guidParameterCheck(request.data.MetadataId, REQUEST_NAME, "request.data.MetadataId");

    const internalRequest = copyRequest(request);
    internalRequest.collection = "EntityDefinitions";
    internalRequest.functionName = FUNCTION_NAME;
    internalRequest.navigationProperty = "Attributes";
    internalRequest.navigationPropertyKey = request.data.MetadataId;
    internalRequest.metadataAttributeType = request.castType;
    internalRequest.key = request.entityKey;
    internalRequest.method = "PUT";

    return update(internalRequest as UpdateRequest, client);
};
