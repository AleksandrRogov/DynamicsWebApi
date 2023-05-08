import { Core } from "../../types";

const getExecuteRequest = () => {
    return global.DWA_BROWSER ? require("../xhr").executeRequest : require("../http").executeRequest;
};

let run = getExecuteRequest();

export function executeRequest(options: Core.RequestOptions): void {
    //for tests we must check DWA_BROWSER everytime and reload the modules
    if (global.DWA_TEST) run = getExecuteRequest();
    run(options);
}
