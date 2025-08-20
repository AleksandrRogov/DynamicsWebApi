import type { HeaderCollection } from "../../dynamics-web-api";

export const setStandardHeaders = (headers: HeaderCollection = {}, data?: any): HeaderCollection => {
    if (!headers["Accept"]) headers["Accept"] = "application/json";
    if (!headers["OData-MaxVersion"]) headers["OData-MaxVersion"] = "4.0";
    if (!headers["OData-Version"]) headers["OData-Version"] = "4.0";
    if (headers["Content-Range"]) headers["Content-Type"] = "application/octet-stream";
    else if (!headers["Content-Type"] && data) headers["Content-Type"] = "application/json; charset=utf-8";

    return headers;
};