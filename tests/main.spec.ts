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

describe("dynamicsWebApi.executeBatch -", () => {
    describe("non-atomic global - create / create (Content-ID in a header gets cleared)", function () {
        let scope;
        const rBody = mocks.data.batchCreateContentIDPayloadNonAtomic;
        const rBodys = rBody.split("\n");
        let checkBody = "";
        for (let i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            const response = mocks.responses.batchUpdateDelete;
            scope = nock(mocks.webApiUrl)
                .filteringRequestBody((body) => {
                    body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "dwa_batch_XXX");
                    body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "changeset_XXX");
                    const bodys = body.split("\n");

                    let resultBody = "";
                    for (let i = 0; i < bodys.length; i++) {
                        resultBody += bodys[i];
                    }

                    return resultBody;
                })
                .post("/$batch", checkBody)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.create({ collection: "records", data: { firstname: "Test", lastname: "Batch!" }, contentId: "1" });
            dynamicsWebApiTest.create({ collection: "tests", data: { firstname: "Test1", lastname: "Batch!", "prop@odata.bind": "$1" } });

            try {
                const object = await dynamicsWebApiTest.executeBatch({
                    inChangeSet: false,
                });

                expect(object.length).to.be.eq(2);

                expect(object[0]).to.be.eq(mocks.data.testEntityId);
                expect(object[1]).to.be.undefined;
            } catch (error) {
                console.error(error);
                throw error;
            }
        });

        it("all requests have been made", () => {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("non-atomic per request - create / create (Content-ID in a header gets cleared)", function () {
        let scope;
        const rBody = mocks.data.batchCreateContentIDPayloadNonAtomic;
        const rBodys = rBody.split("\n");
        let checkBody = "";
        for (let i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            const response = mocks.responses.batchUpdateDelete;
            scope = nock(mocks.webApiUrl)
                .filteringRequestBody((body) => {
                    body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "dwa_batch_XXX");
                    body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "changeset_XXX");
                    const bodys = body.split("\n");

                    let resultBody = "";
                    for (let i = 0; i < bodys.length; i++) {
                        resultBody += bodys[i];
                    }

                    return resultBody;
                })
                .post("/$batch", checkBody)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.create({ collection: "records", data: { firstname: "Test", lastname: "Batch!" }, contentId: "1", inChangeSet: false });
            dynamicsWebApiTest.create({ collection: "tests", data: { firstname: "Test1", lastname: "Batch!", "prop@odata.bind": "$1" }, inChangeSet: false });

            try {
                const object = await dynamicsWebApiTest.executeBatch();

                expect(object.length).to.be.eq(2);

                expect(object[0]).to.be.eq(mocks.data.testEntityId);
                expect(object[1]).to.be.undefined;
            } catch (error) {
                console.error(error);
                throw error;
            }
        });

        it("all requests have been made", () => {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("non-atomic & atomic mixed - create / create (Content-ID in a payload)", function () {
        let scope;
        const rBody = mocks.data.batchCreateContentIDPayloadNonAtomicMixed;
        const rBodys = rBody.split("\n");
        let checkBody = "";
        for (let i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            const response = mocks.responses.batchUpdateDelete;
            scope = nock(mocks.webApiUrl)
                .filteringRequestBody((body) => {
                    body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "dwa_batch_XXX");
                    body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "changeset_XXX");
                    const bodys = body.split("\n");

                    let resultBody = "";
                    for (let i = 0; i < bodys.length; i++) {
                        resultBody += bodys[i];
                    }

                    console.log(checkBody);
                    console.log(resultBody);
                    return resultBody;
                })
                .post("/$batch", checkBody)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.create({ collection: "records", data: { firstname: "Test", lastname: "Batch!" }, contentId: "1", inChangeSet: false });
            dynamicsWebApiTest.create({ collection: "tests", data: { firstname: "Test1", lastname: "Batch!", "prop@odata.bind": "$1" } });

            try {
                const object = await dynamicsWebApiTest.executeBatch();

                expect(object.length).to.be.eq(2);

                expect(object[0]).to.be.eq(mocks.data.testEntityId);
                expect(object[1]).to.be.undefined;
            } catch (error) {
                console.error(error);
                throw error;
            }
        });

        it("all requests have been made", () => {
            expect(scope.isDone()).to.be.true;
        });
    });
});
