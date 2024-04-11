import { expect } from "chai";
import nock from "nock";
import * as mocks from "./stubs";

import { DynamicsWebApi, type RetrieveMultipleRequest } from "../src/dynamics-web-api";

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
    describe("when goes by next page link with count", () => {
        let scope: nock.Scope;
        before(function () {
            const response = mocks.responses.multipleWithLinkAndCountResponse;
            const url = new URL(mocks.responses.multipleWithLinkAndCount().oDataNextLink);
            scope = nock(url.origin, {
                reqheaders: {
                    prefer: "odata.maxpagesize=10",
                },
            })
                .get(url.pathname + url.search)
                .reply((uri, body) => {
                    const checkUrl = new URL(uri, url.origin);
                    if (checkUrl.pathname + checkUrl.search !== url.pathname + url.search) return;
                    [mocks.responses.errorResponse.status, mocks.responses.errorResponse.responseText, mocks.responses.errorResponse.responseHeaders];

                    return [response.status, response.responseText, response.responseHeaders];
                });
        });

        after(function () {
            nock.cleanAll();
        });

        it("should not have duplicated url params", async () => {
            const dwaRequest: RetrieveMultipleRequest = {
                collection: "tests",
                select: ["name"],
                count: true,
                maxPageSize: 10,
            };

            try {
                const object = await dynamicsWebApiTest.retrieveMultiple(dwaRequest, mocks.responses.multipleWithLinkAndCount().oDataNextLink);

                expect(object).to.deep.equal(mocks.responses.multipleWithLinkAndCount());
            } catch (error) {
                console.error(error);
                throw error;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("when goes by next page link, with a dash in serverUrl", () => {
        let scope: nock.Scope;
        before(function () {
            const response = mocks.responses.multipleWithLinkAndCountResponse;
            const url = new URL(mocks.responses.multipleWithLinkAndCount().oDataNextLink);
            scope = nock(url.origin, {
                reqheaders: {
                    prefer: "odata.maxpagesize=10",
                },
            })
                .get(url.pathname + url.search)
                .reply((uri, body) => {
                    const checkUrl = new URL(uri, url.origin);
                    if (checkUrl.pathname + checkUrl.search !== url.pathname + url.search) return;
                    [mocks.responses.errorResponse.status, mocks.responses.errorResponse.responseText, mocks.responses.errorResponse.responseHeaders];

                    return [response.status, response.responseText, response.responseHeaders];
                });
        });

        after(function () {
            nock.cleanAll();
        });

        it("should not duplicate serverUrl", async () => {
            const dwaRequest: RetrieveMultipleRequest = {
                collection: "tests",
                select: ["name"],
                count: true,
                maxPageSize: 10,
            };

            try {
                const dynamicsWebApiSlash = dynamicsWebApiTest.initializeInstance();
                dynamicsWebApiSlash.setConfig({
                    serverUrl: mocks.serverUrl + "/",
                });
                const object = await dynamicsWebApiSlash.retrieveMultiple(dwaRequest, mocks.responses.multipleWithLinkAndCount().oDataNextLink);

                expect(object).to.deep.equal(mocks.responses.multipleWithLinkAndCount());
            } catch (error) {
                console.error(error);
                throw error;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
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

    describe("create / create with Content-ID / No Collection", function () {
        let scope;
        const rBody = mocks.data.batchCreateContentIDNoCollection;
        const rBodys = rBody.split("\n");
        let checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            const response = mocks.responses.batchUpdateDelete;
            scope = nock(mocks.webApiUrl)
                .filteringRequestBody(function (body) {
                    body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "dwa_batch_XXX");
                    body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "changeset_XXX");
                    var bodys = body.split("\n");

                    var resultBody = "";
                    for (var i = 0; i < bodys.length; i++) {
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
            dynamicsWebApiTest.create({ data: { firstname: "Test1", lastname: "Batch!" }, contentId: "$1" });

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

describe("dynamicsWebApi: custom headers - ", () => {
    describe("in a request", () => {
        let scope: nock.Scope;
        before(function () {
            const response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "my-header": "success!",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends a request to the right end point and adds a custom header to it", function (done) {
            dynamicsWebApiTest
                .retrieveMultiple({ collection: "tests", headers: { "my-header": "success!" } })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been done", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("in a config - with multiple requests", () => {
        let scope: nock.Scope;
        const dynamicsWebApiTestWithHeaders = dynamicsWebApiTest.initializeInstance({
            dataApi: {
                version: "8.2",
            },
            headers: { "my-header": "success!", "another-header": "success 2!" },
        });
        before(function () {
            const response = mocks.responses.multipleResponse;
            const response2 = mocks.responses.response200;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "my-header": "success!",
                    "another-header": "success 2!",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.testEntityUrl)
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends all requests to the right end point and adds custom headers to them", async () => {
            try {
                const object = await dynamicsWebApiTestWithHeaders.retrieveMultiple({ collection: "tests" });
                const object2 = await dynamicsWebApiTestWithHeaders.retrieve({ key: mocks.data.testEntityId, collection: "tests" });

                expect(object).to.deep.equal(mocks.responses.multiple());
                expect(object2).to.deep.equal(mocks.data.testEntity);
            } catch (error) {
                console.error(error);
                throw error;
            }
        });

        it("all requests have been done", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("request headers merge with config headers", () => {
        let scope: nock.Scope;
        const dynamicsWebApiTestWithHeaders = dynamicsWebApiTest.initializeInstance({
            dataApi: {
                version: "8.2",
            },
            headers: { "my-header": "success!", "another-header": "success 2!" },
        });
        before(function () {
            const response = mocks.responses.multipleResponse;
            const response2 = mocks.responses.response200;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "my-header": "bla",
                    "another-header": "success 2!",
                    something: "else",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.testEntityUrl)
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends all requests to the right end point and adds custom headers to them", async () => {
            try {
                const object = await dynamicsWebApiTestWithHeaders.retrieveMultiple({
                    collection: "tests",
                    headers: { "my-header": "bla", something: "else" },
                });
                const object2 = await dynamicsWebApiTestWithHeaders.retrieve({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    headers: { "my-header": "bla", something: "else" },
                });

                expect(object).to.deep.equal(mocks.responses.multiple());
                expect(object2).to.deep.equal(mocks.data.testEntity);
            } catch (error) {
                console.error(error);
                throw error;
            }
        });

        it("all requests have been done", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("in a batch request", function () {
        const dynamicsWebApiTestWithHeaders = dynamicsWebApiTest.initializeInstance({
            dataApi: {
                version: "8.2",
            },
            headers: { "my-header": "success!" },
        });
        let scope;
        const rBody = mocks.data.batchCreateContentIDPayloadNonAtomicCustomHeaders;
        const rBodys = rBody.split("\n");
        let checkBody = "";
        for (let i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            const response = mocks.responses.batchUpdateDelete;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "my-header": "success!",
                },
            })
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
            dynamicsWebApiTestWithHeaders.startBatch();

            dynamicsWebApiTestWithHeaders.create({
                collection: "records",
                data: { firstname: "Test", lastname: "Batch!" },
                contentId: "1",
                inChangeSet: false,
                headers: {
                    custom: "header",
                },
            });
            dynamicsWebApiTestWithHeaders.create({
                collection: "tests",
                data: { firstname: "Test1", lastname: "Batch!", "prop@odata.bind": "$1" },
                inChangeSet: false,
            });

            try {
                const object = await dynamicsWebApiTestWithHeaders.executeBatch();

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

describe("dynamicsWebApi.callFunction -", () => {
    describe("unbound", function () {
        let scope: nock.Scope;
        before(function () {
            const response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get("/FUN(param1=@p1,param2=@p2)?$select=field1,field2&$filter=field1 eq 1&@p1=%27value1%27&@p2=2")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("(composite, with parameters) returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiTest.callFunction({
                    functionName: "FUN",
                    parameters: { param1: "value1", param2: 2 },
                    select: ["field1", "field2"],
                    filter: "field1 eq 1"
                });

                expect(object).to.deep.equal(mocks.data.testEntity);
            } catch (error) {
                throw error;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});
