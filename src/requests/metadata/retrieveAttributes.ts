import type { IDataverseClient } from "../../client/dataverse.js";
import type { RetrieveMultipleRequest, RetrieveAttributesRequest, RetrieveMultipleResponse } from "../../dynamics-web-api.js";
import { copyRequest } from "../../utils/Utility.js";
import { retrieveMultiple } from "../retrieveMultiple.js";
import { LIBRARY_NAME } from "../constants.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";

const FUNCTION_NAME = "retrieveAttributes";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const retrieveAttributes = <T = any>(request: RetrieveAttributesRequest, client: IDataverseClient): Promise<RetrieveMultipleResponse<T>> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.keyParameterCheck(request.entityKey, REQUEST_NAME, "request.entityKey");

    if (request.castType) {
        ErrorHelper.stringParameterCheck(request.castType, REQUEST_NAME, "request.castType");
    }

    const internalRequest = copyRequest(request);
    internalRequest.collection = "EntityDefinitions";
    internalRequest.functionName = FUNCTION_NAME;
    internalRequest.navigationProperty = "Attributes";
    internalRequest.key = request.entityKey;
    internalRequest.metadataAttributeType = request.castType;

    return retrieveMultiple(internalRequest as RetrieveMultipleRequest, client);
};
