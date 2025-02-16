import type { IDataverseClient } from "../client/dataverse";
import type { FetchXmlRequest, FetchXmlResponse } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { FETCH_XML_PAGE_REGEX, FETCH_XML_REPLACE_REGEX, FETCH_XML_TOP_REGEX } from "../helpers/Regex";
import { copyRequest } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "fetch";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

export const fetchXml = async <T = any>(request: FetchXmlRequest, client: IDataverseClient): Promise<FetchXmlResponse<T>> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    const internalRequest = copyRequest(request);
    internalRequest.method = "GET";
    internalRequest.functionName = FUNCTION_NAME;

    ErrorHelper.stringParameterCheck(internalRequest.fetchXml, REQUEST_NAME, "request.fetchXml");

    //only add paging if there is no top
    if (internalRequest.fetchXml && !FETCH_XML_TOP_REGEX.test(internalRequest.fetchXml)) {
        let replacementString: string = "";

        if (!FETCH_XML_PAGE_REGEX.test(internalRequest.fetchXml)) {
            internalRequest.pageNumber = internalRequest.pageNumber || 1;

            ErrorHelper.numberParameterCheck(internalRequest.pageNumber, REQUEST_NAME, "request.pageNumber");
            replacementString = `$1 page="${internalRequest.pageNumber}"`;
        }

        if (internalRequest.pagingCookie != null) {
            ErrorHelper.stringParameterCheck(internalRequest.pagingCookie, REQUEST_NAME, "request.pagingCookie");
            replacementString += ` paging-cookie="${internalRequest.pagingCookie}"`;
        }

        //add page number and paging cookie to fetch xml
        if (replacementString) internalRequest.fetchXml = internalRequest.fetchXml.replace(FETCH_XML_REPLACE_REGEX, replacementString);
    }

    internalRequest.responseParameters = { pageNumber: internalRequest.pageNumber };

    const response = await client.makeRequest(internalRequest);

    return response?.data;
};
