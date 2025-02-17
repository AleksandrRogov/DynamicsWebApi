import type { IDataverseClient } from "../../client/dataverse";
import type { RetrieveEntitiesRequest, RetrieveMultipleResponse, RetrieveMultipleRequest } from "../../dynamics-web-api";
import type { InternalRequest } from "../../types";
import { copyRequest } from "../../utils/Utility";
import { retrieveMultiple } from "../retrieveMultiple";

const FUNCTION_NAME = "retrieveEntities";

export const retrieveEntities = <T = any>(client: IDataverseClient, request?: RetrieveEntitiesRequest): Promise<RetrieveMultipleResponse<T>> => {
    const internalRequest: InternalRequest = !request ? {} : copyRequest(request);

    internalRequest.collection = "EntityDefinitions";
    internalRequest.functionName = FUNCTION_NAME;

    return retrieveMultiple(<RetrieveMultipleRequest>internalRequest, client);
};
