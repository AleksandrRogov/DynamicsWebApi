import { expect } from "chai";
import nock from "nock";
import * as mocks from "./stubs";

import { RequestClient } from "../src/client/RequestClient";
import { InternalConfig } from "../src/utils/Config";
import { Core } from "../src/types";

describe("RequestClient.makeRequest", () => {
    before(() => {
        global.DWA_BROWSER = false;
    });
    describe("AbortSignal", () => {
        let scope: nock.Scope;
        let interceptor: nock.Interceptor;
        const url = "test";
        const controller = new AbortController();
        before(() => {
            const response = mocks.responses.basicEmptyResponseSuccess;
            interceptor = nock(mocks.webApiUrl).post("/test", mocks.data.testEntity);

            scope = interceptor.reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("cancels request", async () => {
            const request: Core.InternalRequest = {
                method: "POST",
                functionName: "any",
                collection: url,
                data: mocks.data.testEntityAdditionalAttributes,
                signal: controller.signal,
            };

            const config: InternalConfig = {
                searchApi: { url: "" },
                dataApi: { url: mocks.webApiUrl },
            };

            controller.signal.addEventListener("abort", () =>
                interceptor.replyWithError({
                    code: "ABORT_ERR",
                    name: "AbortError",
                    message: "The operation was aborted",
                })
            );

            setTimeout(() => controller.abort(), 0);

            try {
                const object = await RequestClient.makeRequest(request, config);
                expect(object).to.be.undefined;
            } catch (error: any) {
                expect(error.message).to.be.eq("The operation was aborted");
                expect(error.code).to.be.eq("ABORT_ERR");
            }
        });

        it("request was not completed", function () {
            expect(scope.isDone()).to.be.false;
        });
    });
});
