import type { IDataverseClient } from "../../client/dataverse.js";
import type { BackgroundOperationStatusResponse } from "../../dynamics-web-api.js";

import { ErrorHelper } from "../../helpers/ErrorHelper.js";
import { InternalRequest } from "../../types.js";
import { LIBRARY_NAME } from "../constants.js";

const FUNCTION_NAME = "getBackgroundOperationStatus";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export async function getBackgroundOperationStatus(backgroundOperationId: string, client: IDataverseClient): Promise<BackgroundOperationStatusResponse> {
    ErrorHelper.throwBatchIncompatible(REQUEST_NAME, client.isBatch);
    ErrorHelper.keyParameterCheck(backgroundOperationId, REQUEST_NAME, "backgroundOperationId");

    const internalRequest: InternalRequest = {
        method: "GET",
        addPath: `backgroundoperation/${backgroundOperationId}`,
        functionName: FUNCTION_NAME,
        apiConfig: client.config.serviceApi,
        includeDefaultDataverseHeaders: false,
        headers: {
            "Content-Type": "application/json",
        },
        //todo: need to get rid of this parameter somehow
        _isUnboundRequest: true,
    };

    const response = await client.makeRequest(internalRequest);
    return response?.data;
}
