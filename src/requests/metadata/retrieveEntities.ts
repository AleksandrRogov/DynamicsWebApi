import type { IDataverseClient } from "../../client/dataverse.js";
import type { RetrieveEntitiesRequest, RetrieveMultipleResponse, RetrieveMultipleRequest } from "../../dynamics-web-api.js";
import type { InternalRequest } from "../../types.js";
import { copyRequest } from "../../utils/Utility.js";
import { retrieveMultiple } from "../retrieveMultiple.js";

const FUNCTION_NAME = "retrieveEntities";

export const retrieveEntities = <T = any>(client: IDataverseClient, request?: RetrieveEntitiesRequest): Promise<RetrieveMultipleResponse<T>> => {
    const internalRequest: InternalRequest = !request ? {} : copyRequest(request);

    internalRequest.collection = "EntityDefinitions";
    internalRequest.functionName = FUNCTION_NAME;

    return retrieveMultiple(<RetrieveMultipleRequest>internalRequest, client);
};
