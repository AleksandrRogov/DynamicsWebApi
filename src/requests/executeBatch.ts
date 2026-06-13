import type { IDataverseClient } from "../client/dataverse.js";
import type { BatchRequest } from "../dynamics-web-api.js";
import { copyRequest, generateUUID } from "../utils/Utility.js";
import { ErrorHelper } from "../helpers/ErrorHelper.js";
import { InternalRequest } from "../types.js";
import { LIBRARY_NAME } from "./constants.js";

const FUNCTION_NAME = "executeBatch";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export async function executeBatch(request: BatchRequest | undefined, client: IDataverseClient): Promise<any[]> {
    ErrorHelper.throwBatchNotStarted(client.isBatch);

    const internalRequest: InternalRequest = !request ? {} : copyRequest(request);

    internalRequest.collection = "$batch";
    internalRequest.method = "POST";
    internalRequest.functionName = REQUEST_NAME;
    internalRequest.requestId = client.batchRequestId;

    client.batchRequestId = null;
    client.isBatch = false;

    const response = await client.makeRequest(internalRequest);
    return response?.data;
}

export function startBatch(client: IDataverseClient): void {
    client.isBatch = true;
    client.batchRequestId = generateUUID();
}
