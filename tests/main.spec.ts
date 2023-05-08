import { expect } from "chai";
import nock from "nock";
import * as mocks from "./stubs";

import { DynamicsWebApi } from "../src/dynamics-web-api";

const dynamicsWebApiTest = new DynamicsWebApi({
    dataApi: {
        version: "8.2",
    },
});

describe("dynamicsWebApi.retrieveMultiple -", () => {
    before(() => {
        global.DWA_BROWSER = false;
    });
    describe("AbortSignal - multiple requests", () => {
        let scope: nock.Scope;
        let scope2: nock.Scope;
        let interceptor: nock.Interceptor;
        const controller = new AbortController();
        before(function () {
            const response = mocks.responses.multipleResponse;
            interceptor = nock(mocks.webApiUrl).get("/tests");
            scope = interceptor.reply(response.status, response.responseText, response.responseHeaders);

            scope2 = nock(mocks.webApiUrl).get("/tests").reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends multiple requests to the right end point and aborts one of them", function (done) {
            dynamicsWebApiTest
                .retrieveMultiple({ collection: "tests", signal: controller.signal })
                .then(function (object) {
                    expect(object).to.be.undefined;
                })
                .catch(function (object) {
                    expect(object.message).to.be.eq("The operation was aborted");
                    expect(object.code).to.be.eq("ABORT_ERR");
                });

            dynamicsWebApiTest
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });

            controller.signal.addEventListener("abort", () =>
                interceptor.replyWithError({
                    code: "ABORT_ERR",
                    name: "AbortError",
                    message: "The operation was aborted",
                })
            );

            setTimeout(() => controller.abort(), 1);
        });

        it("1 requests have been made and 1 cancelled", function () {
            expect(scope.isDone()).to.be.false;
            expect(scope2.isDone()).to.be.true;
        });
    });
});
