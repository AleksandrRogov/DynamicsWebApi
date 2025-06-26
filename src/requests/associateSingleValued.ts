import type { IDataverseClient } from "../client/dataverse";
import type { AssociateSingleValuedRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { copyRequest } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "associateSingleValued";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const associateSingleValued = async (request: AssociateSingleValuedRequest, client: IDataverseClient): Promise<void> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.parameterCheck(request.relatedKey, REQUEST_NAME, "request.relatedKey");
    ErrorHelper.stringParameterCheck(request.navigationProperty, REQUEST_NAME, "request.navigationProperty");

    let relatedKey = request.relatedKey;
    let odataId = request.relatedKey;

    // relatedKey can be a contentId that starts with "$" during batch requests.
    // In this case, we do not need to check it as a key parameter.
    if (!client.isBatch || (client.isBatch && !request.relatedKey.startsWith("$"))) {
        ErrorHelper.stringParameterCheck(request.relatedCollection, REQUEST_NAME, "request.relatedCollection");
        relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, REQUEST_NAME, "request.relatedKey");
        odataId = `${request.relatedCollection}(${relatedKey})`;
    }

    let internalRequest = copyRequest(request, ["primaryKey"]);
    internalRequest.method = "PUT";
    internalRequest.functionName = FUNCTION_NAME;
    internalRequest.navigationProperty += "/$ref";
    internalRequest.key = request.primaryKey;
    internalRequest.data = { "@odata.id": odataId };

    await client.makeRequest(internalRequest);
};
