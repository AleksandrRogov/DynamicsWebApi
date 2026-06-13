import type { IDataverseClient } from "../client/dataverse.js";
import type { AssociateRequest } from "../dynamics-web-api.js";
import { ErrorHelper } from "../helpers/ErrorHelper.js";
import { copyRequest } from "../utils/Utility.js";
import { LIBRARY_NAME } from "./constants.js";

const FUNCTION_NAME = "associate";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const associate = async (request: AssociateRequest, client: IDataverseClient): Promise<void> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.parameterCheck(request.relatedKey, REQUEST_NAME, "request.relatedKey");
    ErrorHelper.stringParameterCheck(request.relationshipName, REQUEST_NAME, "request.relationshipName");

    let relatedKey = request.relatedKey;
    let odataId = request.relatedKey;

    // relatedKey can be a contentId that starts with "$" during batch requests.
    // In this case, we do not need to check it as a key parameter.
    if (!client.isBatch || (client.isBatch && !request.relatedKey.startsWith("$"))) {
        ErrorHelper.stringParameterCheck(request.relatedCollection, REQUEST_NAME, "request.relatedCollection");
        relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, REQUEST_NAME, "request.relatedKey");
        odataId = `${client.config.dataApi.url}${request.relatedCollection}(${relatedKey})`;
    }

    let internalRequest = copyRequest(request, ["primaryKey"]);
    internalRequest.method = "POST";
    internalRequest.functionName = FUNCTION_NAME;
    internalRequest.navigationProperty = request.relationshipName + "/$ref";
    internalRequest.key = request.primaryKey;
    internalRequest.data = { "@odata.id": odataId };

    await client.makeRequest(internalRequest);
};
