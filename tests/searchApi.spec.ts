import { expect } from "chai";
import nock from "nock";
import * as mocks from "./stubs";

import { DynamicsWebApi, Search, Autocomplete, Suggest } from "../src/dynamics-web-api";

const dynamicsWebApiTest = new DynamicsWebApi({
    dataApi: {
        version: "8.2",
    },
});

describe("dynamicsWebApi.search -", () => {
    describe("basic", () => {
        let scope;
        const searchQuery: Search = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.searchMultiple;
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.searchUrl, <any>searchQuery)
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
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("basic - term parameter", () => {
        let scope;
        const searchQuery: Search = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.searchMultiple;
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.searchUrl, <any>searchQuery)
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
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("impersonate", () => {
        let scope;
        const searchQuery: Search = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.searchMultiple;
            scope = nock(mocks.searchApiUrl, {
                reqheaders: {
                    CallerObjectId: mocks.data.testEntityId3,
                },
            })
                .post(mocks.responses.searchUrl, <any>searchQuery)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(() => {
            nock.cleanAll();
        });

        it("returns a correct response", async () => {
            try {
                const object = await dynamicsWebApiTest.search({
                    query: searchQuery,
                    impersonateAAD: mocks.data.testEntityId3,
                });
                expect(object).to.deep.equal(mocks.data.searchMultiple);
            } catch (object) {
                console.error(object);
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.suggest -", () => {
    describe("basic", () => {
        let scope;
        const suggestQuery: Suggest = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.suggestMultiple;
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.suggestUrl, <any>suggestQuery)
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
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("basic - term parameter", () => {
        let scope;
        const suggestQuery: Suggest = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.suggestMultiple;
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.suggestUrl, <any>suggestQuery)
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
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("additional header", () => {
        let scope;
        const suggestQuery: Suggest = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.suggestMultiple;
            scope = nock(mocks.searchApiUrl, {
                reqheaders: {
                    CallerObjectId: mocks.data.testEntityId3,
                },
            })
                .post(mocks.responses.suggestUrl, <any>suggestQuery)
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
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.autocomplete -", () => {
    describe("basic", () => {
        let scope;
        const autocompleteQuery: Autocomplete = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.autocompleteResult;
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.autocompleteUrl, <any>autocompleteQuery)
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
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("additional header", () => {
        let scope;
        const autocompleteQuery: Autocomplete = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.autocompleteResult;
            scope = nock(mocks.searchApiUrl, {
                reqheaders: {
                    CallerObjectId: mocks.data.testEntityId3,
                },
            })
                .post(mocks.responses.autocompleteUrl, <any>autocompleteQuery)
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
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
    describe("basic - term parameter", () => {
        let scope;
        const autocompleteQuery: Autocomplete = {
            search: "test",
        };

        before(() => {
            const response = mocks.responses.autocompleteResult;
            scope = nock(mocks.searchApiUrl)
                .post(mocks.responses.autocompleteUrl, <any>autocompleteQuery)
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
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});
