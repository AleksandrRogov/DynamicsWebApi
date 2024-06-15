import type { RequestOptions, WebApiResponse } from "../../types";

export async function executeRequest(options: RequestOptions): Promise<WebApiResponse> {
    return global.DWA_BROWSER ? require("../xhr").executeRequest(options) : require("../http").executeRequest(options);
}
