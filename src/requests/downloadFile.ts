import type { IDataverseClient } from "../client/dataverse";
import type { DownloadRequest, DownloadResponse } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import type { InternalRequest } from "../types";
import { convertToFileBuffer, copyRequest, downloadChunkSize } from "../utils/Utility";
import { LIBRARY_NAME } from "./constants";

const FUNCTION_NAME = "downloadFile";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

const downloadFileChunk = async (
    request: InternalRequest,
    client: IDataverseClient,
    bytesDownloaded: number = 0,
    data: string = "",
): Promise<DownloadResponse> => {
    request.range = "bytes=" + bytesDownloaded + "-" + (bytesDownloaded + downloadChunkSize - 1);
    request.downloadSize = "full";

    const response = await client.makeRequest(request);

    request.url = response?.data.location;
    data += response?.data.value;

    bytesDownloaded += downloadChunkSize;

    if (bytesDownloaded <= response?.data.fileSize) {
        return downloadFileChunk(request, client, bytesDownloaded, data);
    }

    return {
        fileName: response?.data.fileName,
        fileSize: response?.data.fileSize,
        data: convertToFileBuffer(data),
    };
};

/**
 * Download a file from a File Attribute
 * @param request - An object that represents all possible options for a current request.
 */
export const downloadFile = (request: DownloadRequest, client: IDataverseClient): Promise<DownloadResponse> => {
    ErrorHelper.throwBatchIncompatible(REQUEST_NAME, client.isBatch);
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    const internalRequest = copyRequest(request);
    internalRequest.method = "GET";
    internalRequest.functionName = FUNCTION_NAME;
    internalRequest.responseParameters = { parse: true };

    return downloadFileChunk(internalRequest, client);
};
