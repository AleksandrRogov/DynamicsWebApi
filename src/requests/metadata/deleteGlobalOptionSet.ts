import type { IDataverseClient } from "../../client/dataverse.js";
import type { DeleteGlobalOptionSetRequest, DeleteRequest } from "../../dynamics-web-api.js";
import { copyRequest } from "../../utils/Utility.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";
import { deleteRecord } from "../delete.js";

const FUNCTION_NAME = "deleteGlobalOptionSet";
const REQUEST_NAME = `DynamicsWebApi.${FUNCTION_NAME}`;

export async function deleteGlobalOptionSet(request: DeleteGlobalOptionSetRequest, client: IDataverseClient): Promise<any> {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    const internalRequest = copyRequest(request);
    internalRequest.collection = "GlobalOptionSetDefinitions";
    internalRequest.functionName = FUNCTION_NAME;

    return deleteRecord(<DeleteRequest>internalRequest, client);
}