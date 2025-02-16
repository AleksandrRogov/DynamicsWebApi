import { LIBRARY_NAME } from "./constants";
import type { IDataverseClient } from "../client/dataverse";
import type { UploadRequest } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import type { InternalRequest } from "../types";
import { copyRequest, setFileChunk } from "../utils/Utility";

const FUNCTION_NAME = "uploadFile";
const REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;

const _uploadFileChunk = async (
    request: InternalRequest,
    client: IDataverseClient,
    fileBytes: Uint8Array | Buffer,
    chunkSize: number,
    offset: number = 0,
): Promise<void> => {
    // offset = offset || 0;
    setFileChunk(request, fileBytes, chunkSize, offset);

    await client.makeRequest(request);

    offset += chunkSize;
    if (offset <= fileBytes.length) {
        return _uploadFileChunk(request, client, fileBytes, chunkSize, offset);
    }
};

export const uploadFile = async (request: UploadRequest, client: IDataverseClient): Promise<void> => {
    ErrorHelper.throwBatchIncompatible(REQUEST_NAME, client.isBatch);
    ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");

    const internalRequest = copyRequest(request, ["data"]);
    internalRequest.method = "PATCH";
    internalRequest.functionName = FUNCTION_NAME;
    internalRequest.transferMode = "chunked";

    const response = await client.makeRequest(internalRequest);

    internalRequest.url = response?.data.location;
    delete internalRequest.transferMode;
    delete internalRequest.fieldName;
    delete internalRequest.property;
    delete internalRequest.fileName;
    return _uploadFileChunk(internalRequest, client, request.data, response?.data.chunkSize);
};
