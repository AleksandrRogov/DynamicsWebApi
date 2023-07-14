import { expect } from "chai";
import nock from "nock";
import stubs, * as mocks from "./stubs";

import { RequestClient } from "../src/client/RequestClient";
import { InternalConfig } from "../src/utils/Config";
import { Core } from "../src/types";
import * as Regex from "../src/helpers/Regex";
import { RequestUtility } from "../src/utils/Request";

describe("Regex.", () => {
    describe("isUuid -", () => {
        it("uuid === true", () => {
            const result = Regex.isUuid("fb15ee32-524d-41be-b6a0-7d0f28055d52");
            expect(result).to.be.true;
            const result2 = Regex.isUuid("{fb15ee32-524d-41be-b6a0-7d0f28055d52}");
            expect(result2).to.be.true;
        });

        it("uuid === false", function () {
            const result = Regex.isUuid("something");
            expect(result).to.be.false;
            const result2 = Regex.isUuid(<any>null);
            expect(result2).to.be.false;
        });
    });

    describe("extractUuid -", function () {
        it("uuid", function () {
            const result = Regex.extractUuid("fb15ee32-524d-41be-b6a0-7d0f28055d52");
            expect(result).to.equal("fb15ee32-524d-41be-b6a0-7d0f28055d52");
            const result2 = Regex.extractUuid("{fb15ee32-524d-41be-b6a0-7d0f28055d52}");
            expect(result2).to.equal("fb15ee32-524d-41be-b6a0-7d0f28055d52");
        });
        it("not uuid - returns null", function () {
            const result = Regex.extractUuid("fb15ee32-524d-41be-b6a0");
            expect(result).to.be.null;
            const result2 = Regex.extractUuid("something");
            expect(result2).to.be.null;
            const result3 = Regex.extractUuid("test{fb15ee32-524d-41be-b6a0-7d0f28055d52}");
            expect(result3).to.be.null;
        });
    });
    describe("extractUuidFromUrl -", function () {
        it("uuid", function () {
            const result = Regex.extractUuidFromUrl(mocks.webApiUrl + "tests(fb15ee32-524d-41be-b6a0-7d0f28055d52)");
            expect(result).to.equal("fb15ee32-524d-41be-b6a0-7d0f28055d52");
        });
        it("not uuid - returns null", function () {
            const result = Regex.extractUuidFromUrl(mocks.webApiUrl + "fb15ee32-524d-41be-b6a0-7d0f28055d52/something-else");
            expect(result).to.be.null;
            const result2 = Regex.extractUuidFromUrl(mocks.webApiUrl + "fb15ee32-524d-41be-b6a0-7d0f28055d52");
            expect(result2).to.be.null;
        });
    });
});

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

describe("RequestUtility.", () => {
    describe("processData", () => {
        const config = {
            serverUrl: stubs.serverUrl,
            dataApi: {
                url: "data",
                version: "9.2"
            },
            searchApi: {
                url: "search",
                version: "9.2"
            }
        }

        it ("removes brackets from the guids & adds a slash in front", () => {
            const guid = "00000000-0000-0000-0000-000000000001";
            const data = {
                "ref1@odata.bind": `contacts({${guid}})`
            }

            const result = RequestUtility.processData(data, config);

            expect(result).to.be.eq('{"ref1@odata.bind":"/contacts(00000000-0000-0000-0000-000000000001)"}');
        })
    });
})
