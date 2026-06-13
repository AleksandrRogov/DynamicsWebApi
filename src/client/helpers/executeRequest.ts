import type { RequestOptions, WebApiResponse } from "../../types.js";
import * as XHR from "../xhr.js";
import * as HTTP from "../http.js";

export async function executeRequest(options: RequestOptions): Promise<WebApiResponse> {
    return global.DWA_BROWSER ? XHR.executeRequest(options) : HTTP.executeRequest(options);
}
