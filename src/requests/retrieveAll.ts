import type { IDataverseClient } from "../client/dataverse";
import type { AllResponse, RetrieveMultipleRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { LIBRARY_NAME } from "./constants";
import { retrieveMultiple } from "./retrieveMultiple";

const FUNCTION_NAME = "retrieveAll";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const retrieveAllRequest = async <T = any>(
    request: RetrieveMultipleRequest,
    client: IDataverseClient,
    nextPageLink?: string,
    records: any[] = [],
): Promise<AllResponse<T>> => {
    const response = await retrieveMultiple(request, client, nextPageLink);
    records = records.concat(response.value);

    const pageLink = response.oDataNextLink;

    if (pageLink) {
        return retrieveAllRequest(request, client, pageLink, records);
    }

    const result: AllResponse<T> = { value: records };

    if (response.oDataDeltaLink) {
        result["@odata.deltaLink"] = response.oDataDeltaLink;
        result.oDataDeltaLink = response.oDataDeltaLink;
    }

    return result;
};

/**
 * Sends an asynchronous request to retrieve all records.
 *
 * @param {DWARequest} request - An object that represents all possible options for a current request.
 * @returns {Promise} D365 Web Api Response
 */
export const retrieveAll = <T = any>(request: RetrieveMultipleRequest, client: IDataverseClient): Promise<AllResponse<T>> => {
    ErrorHelper.throwBatchIncompatible(REQUEST_NAME, client.isBatch);
    return retrieveAllRequest(request, client);
};
