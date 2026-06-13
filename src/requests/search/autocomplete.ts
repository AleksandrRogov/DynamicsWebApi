import type { IDataverseClient } from "../../client/dataverse.js";
import type { AutocompleteRequest, AutocompleteResponse } from "../../dynamics-web-api.js";
import { copyObject } from "../../utils/Utility.js";
import { ErrorHelper } from "../../helpers/ErrorHelper.js";
import { InternalRequest } from "../../types.js";
import { LIBRARY_NAME } from "../constants.js";
import { convertSearchQuery } from "./convertSearchQuery.js";
import { parseAutocompleteResponse } from "./responseParsers/parseAutocompleteResponse.js";

const FUNCTION_NAME = "autocomplete";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export async function autocomplete(request: string | AutocompleteRequest, client: IDataverseClient): Promise<AutocompleteResponse> {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    const _isObject = typeof request !== "string";
    const parameterName = _isObject ? "request.query.search" : "term";
    const internalRequest: InternalRequest = _isObject ? copyObject(request) : { query: { search: request } };

    if (_isObject) ErrorHelper.parameterCheck(internalRequest.query, REQUEST_NAME, "request.query");
    ErrorHelper.stringParameterCheck(internalRequest.query.search, REQUEST_NAME, parameterName);
    ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, REQUEST_NAME, parameterName, 100);

    internalRequest.functionName = internalRequest.collection = FUNCTION_NAME;
    internalRequest.method = "POST";
    internalRequest.data = convertSearchQuery(internalRequest.query, FUNCTION_NAME, client.config.searchApi);
    internalRequest.apiConfig = client.config.searchApi;

    delete internalRequest.query;

    const response = await client.makeRequest(internalRequest);
    return parseAutocompleteResponse(response!.data, client.config.searchApi);
}
