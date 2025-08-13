import { HeaderCollection } from "../../dynamics-web-api";
import { InternalRequest } from "../../types";

export const setStandardHeaders = (request: InternalRequest = {}): HeaderCollection => {
    if(!request.headers) request.headers = {};
    if (!request.headers["Accept"]) request.headers["Accept"] = "application/json";
    if (!request.headers["OData-MaxVersion"]) request.headers["OData-MaxVersion"] = "4.0";
    if (!request.headers["OData-Version"]) request.headers["OData-Version"] = "4.0";
    if (request.headers["Content-Range"]) request.headers["Content-Type"] = "application/octet-stream";
    else if (!request.headers["Content-Type"] && request.data) request.headers["Content-Type"] = "application/json; charset=utf-8";

    return request.headers;
};