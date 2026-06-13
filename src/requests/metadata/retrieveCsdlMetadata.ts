import type { IDataverseClient } from "../../client/dataverse.js";
import type { CsdlMetadataRequest } from "../../dynamics-web-api.js";
import { copyRequest } from "../../utils/Utility.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";
import { InternalRequest } from "../../types.js";

const FUNCTION_NAME = "retrieveCsdlMetadata";
const REQUEST_NAME = `DynamicsWebApi.${FUNCTION_NAME}`;

export async function retrieveCsdlMetadata(request: CsdlMetadataRequest | undefined, client: IDataverseClient): Promise<string> {
    const internalRequest: InternalRequest = !request ? {} : copyRequest(request);

    internalRequest.collection = "$metadata";
    internalRequest.functionName = FUNCTION_NAME;

    if (request?.addAnnotations) {
        ErrorHelper.boolParameterCheck(request.addAnnotations, REQUEST_NAME, "request.addAnnotations");
        internalRequest.includeAnnotations = "*";
    }

    const response = await client.makeRequest(internalRequest);
    return response?.data;
}
