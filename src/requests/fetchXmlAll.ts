import type { IDataverseClient } from "../client/dataverse";
import type { FetchAllRequest, FetchXmlRequest, FetchXmlResponse } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { LIBRARY_NAME } from "./constants";
import { fetchXml } from "./fetchXml";

const FUNCTION_NAME = "fetchAll";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

const executeFetchXmlAll = async <T = any>(request: FetchXmlRequest, client: IDataverseClient, records: any[] = []): Promise<FetchXmlResponse<T>> => {
    const response = await fetchXml(request, client);

    records = records.concat(response.value);

    if (response.PagingInfo) {
        request.pageNumber = response.PagingInfo.nextPage;
        request.pagingCookie = response.PagingInfo.cookie;

        return executeFetchXmlAll(request, client, records);
    }

    return { value: records };
};

export const fetchXmlAll = async <T = any>(request: FetchAllRequest, client: IDataverseClient): Promise<FetchXmlResponse<T>> => {
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
    ErrorHelper.throwBatchIncompatible(REQUEST_NAME, client.isBatch);

    return executeFetchXmlAll<T>(request, client);
};
