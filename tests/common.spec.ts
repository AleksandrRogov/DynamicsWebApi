import { expect } from "chai";
import nock from "nock";
import * as mocks from "./stubs";

import { DynamicsWebApi, Search, Autocomplete, Suggest } from "../src/dynamics-web-api";
import { RequestClient } from "../src/client/RequestClient";
import { InternalConfig } from "../src/utils/Config";
import { Core } from "../src/types";

const dynamicsWebApiTest = new DynamicsWebApi({
    dataApi: {
        version: "8.2",
    },
});

describe("RequestClient.makeRequest", () => {
    describe("AbortSignal", () => {
        let scope: nock.Scope;
        let interceptor: nock.Interceptor;
        const url = "test";
        const controller = new AbortController();
        before(() => {
            const response = mocks.responses.basicEmptyResponseSuccess;
            interceptor = nock(mocks.webApiUrl)
                .post("/test", mocks.data.testEntity);

            scope = interceptor
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("cancels request", (done) => {
            const request: Core.InternalRequest = {
                method: "POST",
                functionName: "any",
                collection: url,
                data: mocks.data.testEntityAdditionalAttributes,
                signal: controller.signal
            };
            
            const config: InternalConfig = {
                searchApi: {url: ""},
                dataApi: { url: mocks.webApiUrl },
            };

            controller.signal.addEventListener("abort", () => interceptor.replyWithError({
                code: "ABORT_ERR",
                name: "AbortError",
                message: "The operation was aborted"
            }));

            setTimeout(() => controller.abort(), 10);

            RequestClient.makeRequest(
                request,
                config,
                function (object) {
                    expect(object).to.be.undefined;
                    done(object);
                },
                function (error) {
                    expect(error.message).to.be.eq("The operation was aborted");
                    expect(error.code).to.be.eq("ABORT_ERR");
                    done();
                }
            );
        });

        it("request was not completed", function () {
            expect(scope.isDone()).to.be.false;
        });
    })
});