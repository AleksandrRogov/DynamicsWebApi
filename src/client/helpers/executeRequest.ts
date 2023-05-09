import { Core } from "../../types";

export function executeRequest(options: Core.RequestOptions): void {
    return global.DWA_BROWSER ? require("../xhr").executeRequest(options) : require("../http").executeRequest(options);
}
