import { Core } from "../../types";

export async function executeRequest(options: Core.RequestOptions): Promise<Core.WebApiResponse> {
    return global.DWA_BROWSER ? require("../xhr").executeRequest(options) : require("../http").executeRequest(options);
}
