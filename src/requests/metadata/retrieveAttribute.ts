import type { IDataverseClient } from "../../client/dataverse.js";
import type { RetrieveRequest, RetrieveAttributeRequest } from "../../dynamics-web-api.js";
import { copyRequest } from "../../utils/Utility.js";
import { retrieve } from "../retrieve.js";
import { LIBRARY_NAME } from "../constants.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";

const FUNCTION_NAME = "retrieveAttributes";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const retrieveAttribute = <T = any>(request: RetrieveAttributeRequest, client: IDataverseClient): Promise<T> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.keyParameterCheck(request.entityKey, REQUEST_NAME, "request.entityKey");
    ErrorHelper.keyParameterCheck(request.attributeKey, REQUEST_NAME, "request.attributeKey");

    if (request.castType) {
        ErrorHelper.stringParameterCheck(request.castType, REQUEST_NAME, "request.castType");
    }

    const internalRequest = copyRequest(request);
    internalRequest.collection = "EntityDefinitions";
    internalRequest.navigationProperty = "Attributes";
    internalRequest.navigationPropertyKey = request.attributeKey;
    internalRequest.metadataAttributeType = request.castType;
    internalRequest.key = request.entityKey;
    internalRequest.functionName = FUNCTION_NAME;

    return retrieve(internalRequest as RetrieveRequest, client);
};