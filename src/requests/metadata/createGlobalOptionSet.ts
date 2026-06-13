import type { IDataverseClient } from "../../client/dataverse.js";
import type { CreateGlobalOptionSetRequest, CreateRequest } from "../../dynamics-web-api.js";
import { copyRequest } from "../../utils/Utility.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";
import { create } from "../create.js";

const FUNCTION_NAME = "createGlobalOptionSet";
const REQUEST_NAME = `DynamicsWebApi.${FUNCTION_NAME}`;

export async function createGlobalOptionSet<T = any>(request: CreateGlobalOptionSetRequest, client: IDataverseClient): Promise<T> {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.parameterCheck(request.data, REQUEST_NAME, "request.data");

    const internalRequest = copyRequest(request);
    internalRequest.collection = "GlobalOptionSetDefinitions";
    internalRequest.functionName = FUNCTION_NAME;

    return create(<CreateRequest>internalRequest, client);
}
