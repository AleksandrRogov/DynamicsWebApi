import { expect } from "chai";
import nock from "nock";
import * as mocks from "./stubs.js";

import { DynamicsWebApi } from "../src/dynamics-web-api.js";
import type { Autocomplete, Query, Suggest } from "../src/dynamics-web-api.js";

const dynamicsWebApiTest = new DynamicsWebApi({
    searchApi: {
        options: {
            enableResponseCompatibility: true,
        },
    },
});

const dynamicsWebApiSearchV2 = new DynamicsWebApi({
    searchApi: {
        version: "2.0",
        options: {
            enableResponseCompatibility: true,
        },
    },
});

const dynamicsWebApiSearchV1NoCompatibility = new DynamicsWebApi();

const dynamicsWebApiSearchV2NoCompatibility = new DynamicsWebApi({
    searchApi: {
        version: "2.0",
    },
});

describe("dynamicsWebApi.query -", () => {
    before(() => {
        //@ts-ignore
        global.DWA_BROWSER = false;
    });
    describe("basic", () => {
        let scope: nock.Scope;
        const searchQuery: Query = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.searchMultiple();
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.searchUrl, searchQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiTest.search({
                    query: searchQuery,
                });
                expect(object).to.deep.equal(mocks.data.searchMultiple);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("basic - term parameter", () => {
        let scope: nock.Scope;
        const searchQuery: Query = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.searchMultiple();
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.searchUrl, searchQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiTest.search(searchQuery.search);
                expect(object).to.deep.equal(mocks.data.searchMultiple);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("impersonate", () => {
        let scope: nock.Scope;
        const searchQuery: Query = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.searchMultiple();
            scope = nock(mocks.searchApiUrl, {
                reqheaders: {
                    CallerObjectId: mocks.data.testEntityId3,
                },
            })
                .post(mocks.responses.searchUrl, searchQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiTest.query({
                    query: searchQuery,
                    impersonateAAD: mocks.data.testEntityId3,
                });
                expect(object).to.deep.equal(mocks.data.searchMultiple);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("v2.0 - basic, count", () => {
        let scope: nock.Scope;
        const searchQuery: Query = {
            search: "test",
            count: true,
        };

        before(() => {
            const response = mocks.responses.searchMultipleV2();
            scope = nock(mocks.searchApiUrlV2)
                .post(mocks.responses.searchUrl, searchQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiSearchV2.query({
                    query: searchQuery,
                });
                expect(object).to.deep.equal(mocks.data.searchMultiple);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("v2.0 - enableResponseCompatibility = false", () => {
        let scope: nock.Scope;
        const searchQuery: Query = {
            search: "test",
            count: true,
        };

        before(() => {
            const response = mocks.responses.searchMultipleV2();
            scope = nock(mocks.searchApiUrlV2)
                .post(mocks.responses.searchUrl, searchQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiSearchV2NoCompatibility.query({
                    query: searchQuery,
                });
                expect(object).to.deep.equal(mocks.data.searchMultipleV2);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("v1.0 - enableResponseCompatibility = false", () => {
        let scope: nock.Scope;
        const searchQuery: Query = {
            search: "test",
            returnTotalRecordCount: true,
        };

        before(() => {
            const response = mocks.responses.searchMultipleV1();
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.searchUrl, searchQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiSearchV1NoCompatibility.query({
                    query: searchQuery,
                });
                expect(object).to.deep.equal(mocks.data.searchMultipleV1);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.suggest -", () => {
    describe("basic", () => {
        let scope: nock.Scope;
        const suggestQuery: Suggest = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.suggestMultiple();
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.suggestUrl, suggestQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiTest.suggest({
                    query: suggestQuery,
                });
                expect(object).to.deep.equal(mocks.data.suggestMultiple);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("basic - term parameter", () => {
        let scope: nock.Scope;
        const suggestQuery: Suggest = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.suggestMultiple();
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.suggestUrl, suggestQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiTest.suggest(suggestQuery.search);
                expect(object).to.deep.equal(mocks.data.suggestMultiple);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("additional header", () => {
        let scope: nock.Scope;
        const suggestQuery: Suggest = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.suggestMultiple();
            scope = nock(mocks.searchApiUrl, {
                reqheaders: {
                    CallerObjectId: mocks.data.testEntityId3,
                },
            })
                .post(mocks.responses.suggestUrl, suggestQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiTest.suggest({
                    query: suggestQuery,
                    impersonateAAD: mocks.data.testEntityId3,
                });
                expect(object).to.deep.equal(mocks.data.suggestMultiple);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("v1.0 - enableResponseCompatibility = false", () => {
        let scope: nock.Scope;
        const suggestQuery: Suggest = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.suggestMultipleV1();
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.suggestUrl, suggestQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiSearchV1NoCompatibility.suggest({
                    query: suggestQuery,
                });
                expect(object).to.deep.equal(mocks.data.suggestMultipleV1);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("v2.0 - enableResponseCompatibility = false", () => {
        let scope: nock.Scope;
        const suggestQuery: Suggest = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.suggestMultipleV2();
            scope = nock(mocks.searchApiUrlV2)
                .post(mocks.responses.suggestUrl, suggestQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiSearchV2NoCompatibility.suggest({
                    query: suggestQuery,
                });
                expect(object).to.deep.equal(mocks.data.suggestMultipleV2);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.autocomplete -", () => {
    describe("basic", () => {
        let scope: nock.Scope;
        const autocompleteQuery: Autocomplete = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.autocompleteResult();
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.autocompleteUrl, autocompleteQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiTest.autocomplete({
                    query: autocompleteQuery,
                });
                expect(object).to.deep.equal(mocks.data.autocompleteResult);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("additional header", () => {
        let scope: nock.Scope;
        const autocompleteQuery: Autocomplete = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.autocompleteResult();
            scope = nock(mocks.searchApiUrl, {
                reqheaders: {
                    CallerObjectId: mocks.data.testEntityId3,
                },
            })
                .post(mocks.responses.autocompleteUrl, autocompleteQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiTest.autocomplete({
                    query: autocompleteQuery,
                    impersonateAAD: mocks.data.testEntityId3,
                });
                expect(object).to.deep.equal(mocks.data.autocompleteResult);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("basic - term parameter", () => {
        let scope: nock.Scope;
        const autocompleteQuery: Autocomplete = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.autocompleteResult();
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.autocompleteUrl, autocompleteQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiTest.autocomplete(autocompleteQuery.search);
                expect(object).to.deep.equal(mocks.data.autocompleteResult);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("v1.0 - enableResponseCompatibility = false", () => {
        let scope: nock.Scope;
        const autocompleteQuery: Autocomplete = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.autocompleteResultV1();
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.autocompleteUrl, autocompleteQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiSearchV1NoCompatibility.autocomplete({
                    query: autocompleteQuery,
                });
                expect(object).to.deep.equal(mocks.data.autocompleteResultV1);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("v2.0 - enableResponseCompatibility = false", () => {
        let scope: nock.Scope;
        const autocompleteQuery: Autocomplete = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.autocompleteResultV2();
            scope = nock(mocks.searchApiUrlV2)
                .post(mocks.responses.autocompleteUrl, autocompleteQuery as any)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiSearchV2NoCompatibility.autocomplete({
                    query: autocompleteQuery,
                });
                expect(object).to.deep.equal(mocks.data.autocompleteResultV2);
            } catch (object) {
                console.error(object);
                throw object;
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});
