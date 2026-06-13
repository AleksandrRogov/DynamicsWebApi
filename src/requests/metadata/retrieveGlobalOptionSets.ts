import type { IDataverseClient } from "../../client/dataverse.js";
import type { RetrieveGlobalOptionSetsRequest, RetrieveMultipleRequest, RetrieveMultipleResponse } from "../../dynamics-web-api.js";
import { copyRequest } from "../../utils/Utility.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";
import { retrieveMultiple } from "../retrieveMultiple.js";
import { InternalRequest } from "../../types.js";

const FUNCTION_NAME = "retrieveGlobalOptionSets";
const REQUEST_NAME = `DynamicsWebApi.${FUNCTION_NAME}`;

export async function retrieveGlobalOptionSets<T = any>(
    request: RetrieveGlobalOptionSetsRequest | undefined,
    client: IDataverseClient,
): Promise<RetrieveMultipleResponse<T>> {
    const internalRequest: InternalRequest = !request ? {} : copyRequest(request);

    internalRequest.collection = "GlobalOptionSetDefinitions";
    internalRequest.functionName = FUNCTION_NAME;

    if (request?.castType) {
        ErrorHelper.stringParameterCheck(request.castType, REQUEST_NAME, "request.castType");
        internalRequest.navigationProperty = request.castType;
    }

    return retrieveMultiple(<RetrieveMultipleRequest>internalRequest, client);
}
