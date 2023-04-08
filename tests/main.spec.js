var chai = require("chai");
var expect = chai.expect;
var nock = require("nock");
var sinon = require("sinon");

var mocks = require("./stubs");
var { DWA } = require("../lib/dwa");
var { DynamicsWebApi } = require("../lib/dynamics-web-api");

var { Utility } = require("../lib/utils/Utility");
Utility.downloadChunkSize = 15;

var dynamicsWebApiTest = new DynamicsWebApi({ dataApi: { version: "8.2" } });

describe("dynamicsWebApi.create -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.createReturnId;
            scope = nock(mocks.webApiUrl)
                .post(mocks.responses.collectionUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .create({ data: mocks.data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntityId);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("return representation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.createReturnRepresentation;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .post(mocks.responses.collectionUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .create({ data: mocks.data.testEntity, collection: "tests", returnRepresentation: true })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("select", function () {
        var scope;
        before(function () {
            var response = mocks.responses.createReturnRepresentation;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .post(mocks.responses.collectionUrl + "?$select=name", mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .create({ data: mocks.data.testEntity, collection: "tests", returnRepresentation: true, select: ["name"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.update -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .update({ key: mocks.data.testEntityId, collection: "tests", data: mocks.data.testEntity })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("return representation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.updateReturnRepresentation;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .update({ key: mocks.data.testEntityId, collection: "tests", data: mocks.data.testEntity, returnRepresentation: true })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("return representation - select", function () {
        var scope;
        before(function () {
            var response = mocks.responses.updateReturnRepresentation;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(mocks.responses.testEntityUrl + "?$select=fullname", mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                .patch(mocks.responses.testEntityUrl + "?$select=fullname,subject", mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .update({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    data: mocks.data.testEntity,
                    returnRepresentation: true,
                    select: ["fullname"],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[fullname, subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .update({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    data: mocks.data.testEntity,
                    returnRepresentation: true,
                    select: ["fullname", "subject"],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.updateSingleProperty -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl)
                .put(mocks.responses.testEntityUrl + "/fullname", {
                    value: mocks.data.updatedEntity.fullname,
                })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateSingleProperty({ key: mocks.data.testEntityId, collection: "tests", fieldValuePair: mocks.data.updatedEntity })
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("return representation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.updateReturnRepresentation;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .put(mocks.responses.testEntityUrl + "/fullname", {
                    value: mocks.data.updatedEntity.fullname,
                })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateSingleProperty({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    fieldValuePair: mocks.data.updatedEntity,
                    returnRepresentation: true,
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("select", function () {
        var scope;
        before(function () {
            var response = mocks.responses.updateReturnRepresentation;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .put(mocks.responses.testEntityUrl + "/fullname?$select=name", {
                    value: mocks.data.updatedEntity.fullname,
                })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateSingleProperty({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    fieldValuePair: mocks.data.updatedEntity,
                    returnRepresentation: true,
                    select: ["name"],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.upsert -", function () {
    describe("basic & update an existing entity", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl)
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntityUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({ key: mocks.data.testEntityId, collection: "tests", data: mocks.data.testEntity })
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("basic & create an entity", function () {
        var scope;
        before(function () {
            var response = mocks.responses.createReturnId;
            scope = nock(mocks.webApiUrl)
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntityUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({ key: mocks.data.testEntityId, collection: "tests", data: mocks.data.testEntity })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntityId);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("return representation & update an existing entity", function () {
        var scope;
        before(function () {
            var response = mocks.responses.updateReturnRepresentation;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntityUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({ key: mocks.data.testEntityId, collection: "tests", data: mocks.data.testEntity, returnRepresentation: true })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("return representation & create an entity", function () {
        var scope;
        before(function () {
            var response = mocks.responses.createReturnRepresentation;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({ key: mocks.data.testEntityId, collection: "tests", data: mocks.data.testEntity, returnRepresentation: true })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("return representation & update an existing entity & select", function () {
        var scope;
        before(function () {
            var response = mocks.responses.updateReturnRepresentation;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(mocks.responses.testEntityUrl + "?$select=fullname", mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                .patch(mocks.responses.testEntityUrl + "?$select=fullname,subject", mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    data: mocks.data.testEntity,
                    returnRepresentation: true,
                    select: ["fullname"],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[fullname, subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    data: mocks.data.testEntity,
                    returnRepresentation: true,
                    select: ["fullname", "subject"],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("return representation & create an entity & select", function () {
        var scope;
        before(function () {
            var response = mocks.responses.createReturnRepresentation;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(mocks.responses.testEntityUrl + "?$select=fullname", mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                .patch(mocks.responses.testEntityUrl + "?$select=fullname,subject", mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    data: mocks.data.testEntity,
                    returnRepresentation: true,
                    select: ["fullname"],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[fullname, subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    data: mocks.data.testEntity,
                    returnRepresentation: true,
                    select: ["fullname", "subject"],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.retrieve -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl).get(mocks.responses.testEntityUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: mocks.data.testEntityId, collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("basic - alternate key", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.collectionUrl + "(alternateKey=%27keyValue%27)")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: "alternateKey='keyValue'", collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("select", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.testEntityUrl + "?$select=fullname")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.testEntityUrl + "?$select=fullname,subject")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: mocks.data.testEntityId, collection: "tests", select: ["fullname"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[fullname, subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: mocks.data.testEntityId, collection: "tests", select: ["fullname", "subject"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("single value or navigation property", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.testEntityUrl + "/reference")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.testEntityUrl + "/reference?$select=fullname")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.testEntityUrl + "/reference?$select=fullname,subject")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[/reference] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: mocks.data.testEntityId, collection: "tests", select: ["/reference"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[/reference, fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: mocks.data.testEntityId, collection: "tests", select: ["/reference", "fullname"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[/reference, fullname, subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: mocks.data.testEntityId, collection: "tests", select: ["/reference", "fullname", "subject"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("reference", function () {
        var scope;
        before(function () {
            var response = mocks.responses.retrieveReferenceResponse;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.testEntityUrl + "/reference/$ref")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: mocks.data.testEntityId, collection: "tests", select: ["reference/$ref"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.referenceResponseConverted);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("expand basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.testEntityUrl + "?$expand=reference($select=something)")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: mocks.data.testEntityId, collection: "tests", expand: [{ property: "reference", select: ["something"] }] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("select & expand basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.testEntityUrl + "?$select=fullname&$expand=reference($select=something)")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.testEntityUrl + "?$select=fullname,subject&$expand=reference($select=something)")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    select: ["fullname"],
                    expand: [{ property: "reference", select: ["something"] }],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[fullname,subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    select: ["fullname", "subject"],
                    expand: [{ property: "reference", select: ["something"] }],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("select & expand navigation property", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.testEntityUrl + "/reference?$expand=reference($select=something)")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.testEntityUrl + "/reference?$select=fullname&$expand=reference($select=something)")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.testEntityUrl + "/reference?$select=fullname,subject&$expand=reference($select=something)")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[/reference] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    select: ["/reference"],
                    expand: [{ property: "reference", select: ["something"] }],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[/reference, fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    select: ["/reference", "fullname"],
                    expand: [{ property: "reference", select: ["something"] }],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[/reference, fullname, subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    select: ["/reference", "fullname", "subject"],
                    expand: [{ property: "reference", select: ["something"] }],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.count -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.countBasic;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.collectionUrl + "/$count")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .count({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(parseInt(mocks.responses.countBasic.responseText));
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("filter", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleWithCountResponse;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.collectionUrl + "?$filter=name%20eq%20%27name%27&$count=true")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .count({ collection: "tests", filter: "name eq 'name'" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.multipleWithCount["@odata.count"]);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.countAll -", function () {
    describe("filter", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleWithCountResponse;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.collectionUrl + "?$filter=name%20eq%20%27name%27")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .countAll({ collection: "tests", filter: "name eq 'name'" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.multipleWithCount["@odata.count"]);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.fetch -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.fetchXmlResponsePage1Cookie;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.collectionUrl + "?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXml1))
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .fetch({ collection: "tests", fetchXml: mocks.data.fetchXmls.fetchXml })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage1Cookie);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("paging", function () {
        var scope;
        before(function () {
            var response = mocks.responses.fetchXmlResponsePage2Cookie;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.collectionUrl + "?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXml2cookie))
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var pagingInfo = mocks.data.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo;
            dynamicsWebApiTest
                .fetch({ collection: "tests", fetchXml: mocks.data.fetchXmls.fetchXml, pageNumber: pagingInfo.nextPage, pagingCookie: pagingInfo.cookie })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage2Cookie);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("paging - no cookie", function () {
        var scope;
        before(function () {
            var response = mocks.responses.fetchXmlResponsePage1;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.collectionUrl + "?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXml1))
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .fetch({ collection: "tests", fetchXml: mocks.data.fetchXmls.fetchXml })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage1);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("with prefer", function () {
        var scope;
        before(function () {
            var response = mocks.responses.fetchXmlResponsePage2Cookie;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(mocks.responses.collectionUrl + "?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXml2cookie))
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var pagingInfo = mocks.data.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo;
            dynamicsWebApiTest
                .fetch({
                    collection: "tests",
                    fetchXml: mocks.data.fetchXmls.fetchXml,
                    includeAnnotations: DWA.Prefer.Annotations.FormattedValue,
                    pageNumber: pagingInfo.nextPage,
                    pagingCookie: pagingInfo.cookie,
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage2Cookie);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("with top attribute", function () {
        var scope;
        before(function () {
            var response = mocks.responses.fetchXmlResponsePage1Cookie;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.collectionUrl + "?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXmlTop))
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .fetch({
                    collection: "tests",
                    fetchXml: mocks.data.fetchXmls.fetchXmlTop,
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage1Cookie);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.fetchAll -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.fetchXmlResponsePage1Cookie;
            var response2 = mocks.responses.fetchXmlResponsePage2NoCookie;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.collectionUrl + "?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXml1))
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.collectionUrl + "?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXml2cookie))
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .fetchAll({ collection: "tests", fetchXml: mocks.data.fetchXmls.fetchXml })
                .then(function (object) {
                    var checkResponse = mocks.data.fetchXmls.fetchXmlResultPage1Cookie.value;
                    checkResponse = checkResponse.concat(mocks.data.fetchXmls.fetchXmlResultPage2Cookie.value);
                    expect(object).to.deep.equal({ value: checkResponse });
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.associate -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl)
                .post(mocks.responses.testEntityUrl + "/tests_records/$ref", {
                    "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")",
                })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .associate({
                    collection: "tests",
                    primaryKey: mocks.data.testEntityId,
                    relationshipName: "tests_records",
                    relatedCollection: "records",
                    relatedKey: mocks.data.testEntityId2,
                })
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("basic - use entity names: true", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            var response2 = mocks.responses.responseEntityDefinitions;
            scope = nock(mocks.webApiUrl)
                .get("/EntityDefinitions?$select=EntitySetName,LogicalName")
                .once()
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .post("/tests(" + mocks.data.testEntityId + ")/tests_records/$ref", {
                    "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")",
                })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dynamicsWebApiE = dynamicsWebApiTest.initializeInstance({ dataApi: { version: "8.2" }, useEntityNames: true });
            dynamicsWebApiE
                .associate({
                    collection: "test",
                    primaryKey: mocks.data.testEntityId,
                    relationshipName: "tests_records",
                    relatedCollection: "record",
                    relatedKey: mocks.data.testEntityId2,
                })
                .then(function (object) {
                    expect(object).to.be.undefined;
                    var colName = dynamicsWebApiE.Utility.getCollectionName("test");
                    expect(colName).to.be.eq("tests");
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("impersonation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId3,
                },
            })
                .post(mocks.responses.testEntityUrl + "/tests_records/$ref", {
                    "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")",
                })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .associate({
                    collection: "tests",
                    primaryKey: mocks.data.testEntityId,
                    relationshipName: "tests_records",
                    relatedCollection: "records",
                    relatedKey: mocks.data.testEntityId2,
                    impersonate: mocks.data.testEntityId3,
                })
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.disassociate -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl)
                .delete(mocks.responses.testEntityUrl + "/tests_records(" + mocks.data.testEntityId2 + ")/$ref")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .disassociate({
                    collection: "tests",
                    primaryKey: mocks.data.testEntityId,
                    relationshipName: "tests_records",
                    relatedKey: mocks.data.testEntityId2,
                })
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("impersonation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId3,
                },
            })
                .delete(mocks.responses.testEntityUrl + "/tests_records(" + mocks.data.testEntityId2 + ")/$ref")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .disassociate({
                    collection: "tests",
                    primaryKey: mocks.data.testEntityId,
                    relationshipName: "tests_records",
                    relatedKey: mocks.data.testEntityId2,
                    impersonate: mocks.data.testEntityId3,
                })
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.associateSingleValued -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl)
                .put(mocks.responses.testEntityUrl + "/tests_records/$ref", {
                    "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")",
                })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .associateSingleValued({
                    collection: "tests",
                    primaryKey: mocks.data.testEntityId,
                    navigationProperty: "tests_records",
                    relatedCollection: "records",
                    relatedKey: mocks.data.testEntityId2,
                })
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("impersonation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId3,
                },
            })
                .put(mocks.responses.testEntityUrl + "/tests_records/$ref", {
                    "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")",
                })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .associateSingleValued({
                    collection: "tests",
                    primaryKey: mocks.data.testEntityId,
                    navigationProperty: "tests_records",
                    relatedCollection: "records",
                    relatedKey: mocks.data.testEntityId2,
                    impersonate: mocks.data.testEntityId3,
                })
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.disassociateSingleValued -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl)
                .delete(mocks.responses.testEntityUrl + "/tests_records/$ref")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .disassociateSingleValued({ collection: "tests", primaryKey: mocks.data.testEntityId, navigationProperty: "tests_records" })
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("impersonation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId3,
                },
            })
                .delete(mocks.responses.testEntityUrl + "/tests_records/$ref")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .disassociateSingleValued({
                    collection: "tests",
                    primaryKey: mocks.data.testEntityId,
                    navigationProperty: "tests_records",
                    impersonate: mocks.data.testEntityId3,
                })
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.callFunction -", function () {
    describe("unbound", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get("/FUN()")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get("/FUN(param1=@p1,param2=@p2)?@p1=%27value1%27&@p2=2")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("(no parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({ functionName: "FUN" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(with parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({ functionName: "FUN", parameters: { param1: "value1", param2: 2 } })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("unbound - short version", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl).get("/FUN()").reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("(no parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction("FUN")
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("unbound impersonation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId,
                },
            })
                .get("/FUN()")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get("/FUN(param1=@p1,param2=@p2)?@p1=%27value1%27&@p2=2")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("(no parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({ functionName: "FUN", impersonate: mocks.data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(with parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({ functionName: "FUN", parameters: { param1: "value1", param2: 2 }, impersonate: mocks.data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("bound", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            var response2 = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.testEntityUrl + "/FUN()")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.testEntityUrl + "/FUN(param1=@p1,param2=@p2)?@p1=%27value1%27&@p2=2")
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("(no parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({ key: mocks.data.testEntityId, collection: "tests", functionName: "FUN" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(with parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    functionName: "FUN",
                    parameters: { param1: "value1", param2: 2 },
                })
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("bound impersonation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId,
                },
            })
                .get(mocks.responses.testEntityUrl + "/FUN()")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.testEntityUrl + "/FUN(param1=@p1,param2=@p2)?@p1=%27value1%27&@p2=2")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("(no parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({ key: mocks.data.testEntityId, collection: "tests", functionName: "FUN", impersonate: mocks.data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(with parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    functionName: "FUN",
                    parameters: { param1: "value1", param2: 2 },
                    impersonate: mocks.data.testEntityId,
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.callAction -", function () {
    describe("unbound", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl)
                .post("/FUN", mocks.responses.actionRequestModified)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .callAction({ actionName: "FUN", action: mocks.responses.actionRequest })
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("unbound impersonation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId2,
                },
            })
                .post("/FUN", mocks.responses.actionRequestModified)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .callAction({ actionName: "FUN", action: mocks.responses.actionRequest, impersonate: mocks.data.testEntityId2 })
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("bound", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .post(mocks.responses.testEntityUrl + "/FUN", mocks.responses.actionRequestModified)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .callAction({ key: mocks.data.testEntityId, collection: "tests", actionName: "FUN", action: mocks.responses.actionRequest })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("bound impersonation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId2,
                },
            })
                .post(mocks.responses.testEntityUrl + "/FUN", mocks.responses.actionRequestModified)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .callAction({
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    actionName: "FUN",
                    action: mocks.responses.actionRequest,
                    impersonate: mocks.data.testEntityId2,
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.update -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                data: mocks.data.testEntity,
            };

            dynamicsWebApiTest
                .update(dwaRequest)
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("return representation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.updateReturnRepresentation;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                .patch(mocks.responses.testEntityUrl + "?$select=fullname,subject", mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                data: mocks.data.testEntity,
                returnRepresentation: true,
            };

            dynamicsWebApiTest
                .update(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[fullname, subject] returns a correct response", function (done) {
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                data: mocks.data.testEntity,
                returnRepresentation: true,
                select: ["fullname", "subject"],
            };

            dynamicsWebApiTest
                .update(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("(success) check optimistic concurrency", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;

            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "match",
                },
            })
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                data: mocks.data.testEntity,
                ifmatch: "match",
            };

            dynamicsWebApiTest
                .update(dwaRequest)
                .then(function (object) {
                    expect(object).to.equal(true);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("(pre condition failed) check optimistic concurrency", function () {
        var scope;
        before(function () {
            var response = mocks.responses.upsertPreventUpdateResponse;

            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "match",
                },
            })
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                data: mocks.data.testEntity,
                ifmatch: "match",
            };

            dynamicsWebApiTest
                .update(dwaRequest)
                .then(function (object) {
                    expect(object).to.equal(false);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("(error response) check optimistic concurrency", function () {
        var scope;
        before(function () {
            var response = mocks.responses.upsertPreventCreateResponse;

            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "match",
                },
            })
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("catches the error", function (done) {
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                data: mocks.data.testEntity,
                ifmatch: "match",
            };

            dynamicsWebApiTest
                .update(dwaRequest)
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    expect(object.status).to.equal(404);
                    done();
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.upsert -", function () {
    describe("(update) basic", function () {
        var dwaRequest = {
            key: mocks.data.testEntityId,
            collection: "tests",
            data: mocks.data.testEntity,
        };

        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            var response2 = mocks.responses.createReturnId;

            scope = nock(mocks.webApiUrl)
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("(update) returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert(dwaRequest)
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(create) returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntityId);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("return representation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.updateReturnRepresentation;
            var response2 = mocks.responses.createReturnRepresentation;

            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                .patch(mocks.responses.testEntityUrl + "?$select=name", mocks.data.testEntity)
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("(update) returns a correct response", function (done) {
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                data: mocks.data.testEntity,
                returnRepresentation: true,
            };

            dynamicsWebApiTest
                .upsert(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(create) returns a correct response", function (done) {
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                data: mocks.data.testEntity,
                returnRepresentation: true,
                select: ["name"],
            };

            dynamicsWebApiTest
                .upsert(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("If-Match: '*' (Prevent Create)", function () {
        var dwaRequest = {
            key: mocks.data.testEntityId,
            collection: "tests",
            data: mocks.data.testEntity,
            returnRepresentation: true,
            ifmatch: "*",
        };
        var scope;
        before(function () {
            var response = mocks.responses.upsertPreventCreateResponse;
            var response2 = mocks.responses.createReturnRepresentation;
            var response3 = mocks.responses.upsertPreventUpdateResponse;

            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                    "If-Match": "*",
                },
            })
                //create prevented
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                //create succeeded
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                //request failed
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response3.status, response3.responseText, response3.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("(create prevented) returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert(dwaRequest)
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(create succeeded) returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(request failed) catches the error", function (done) {
            dynamicsWebApiTest
                .upsert(dwaRequest)
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    expect(object.status).to.equal(mocks.responses.upsertPreventUpdateResponse.status);
                    done();
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("If-None-Match: '*' (Prevent Update)", function () {
        var dwaRequest = {
            key: mocks.data.testEntityId,
            collection: "tests",
            data: mocks.data.testEntity,
            returnRepresentation: true,
            ifnonematch: "*",
        };
        var scope;
        before(function () {
            var response = mocks.responses.upsertPreventUpdateResponse;
            var response2 = mocks.responses.updateReturnRepresentation;
            var response3 = mocks.responses.upsertPreventCreateResponse;

            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                    "If-None-Match": "*",
                },
            })
                //update prevented
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                //update succeeded
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                //request failed
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response3.status, response3.responseText, response3.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("(update prevented) returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert(dwaRequest)
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(update succeeded) returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(request failed) catches the error", function (done) {
            dynamicsWebApiTest
                .upsert(dwaRequest)
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    expect(object.status).to.equal(mocks.responses.upsertPreventCreateResponse.status);
                    done();
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.retrieve -", function () {
    describe("match and impersonation", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "match",
                    MSCRMCallerID: mocks.data.testEntityId2,
                },
            })
                .get(mocks.responses.testEntityUrl + "?$expand=prop")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                expand: [{ property: "prop" }],
                impersonate: mocks.data.testEntityId2,
                ifmatch: "match",
            };

            dynamicsWebApiTest
                .retrieve(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("match and impersonation - expand filter", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "match",
                    MSCRMCallerID: mocks.data.testEntityId2,
                },
            })
                .get(mocks.responses.testEntityUrl + "?$expand=prop($filter=" + encodeURI("field eq ") + "%27value%27)")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                expand: [{ property: "prop", filter: "field eq 'value'" }],
                impersonate: mocks.data.testEntityId2,
                ifmatch: "match",
            };

            dynamicsWebApiTest
                .retrieve(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("match and impersonation - retrieve reference", function () {
        var scope;
        before(function () {
            var response = mocks.responses.retrieveReferenceResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "match",
                    MSCRMCallerID: mocks.data.testEntityId2,
                },
            })
                .get(mocks.responses.testEntityUrl + "/ownerid/$ref")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                select: ["ownerid/$ref"],
                impersonate: mocks.data.testEntityId2,
                ifmatch: "match",
            };

            dynamicsWebApiTest
                .retrieve(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.referenceResponseConverted);
                    done();
                })
                .catch(function (object) {
                    expect(object).to.be.undefined();
                    done();
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.retrieveMultiple -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl).get(mocks.responses.collectionUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("select", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.collectionUrl + "?$select=fullname")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.collectionUrl + "?$select=fullname,subject")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveMultiple({ collection: "tests", select: ["fullname"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[fullname, subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveMultiple({ collection: "tests", select: ["fullname", "subject"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("filter", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.collectionUrl + "?$filter=name%20eq%20%27name%27")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.collectionUrl + "?$select=fullname&$filter=name%20eq%20%27name%27")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveMultiple({ collection: "tests", filter: "name eq 'name'" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(+select) returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveMultiple({ collection: "tests", select: ["fullname"], filter: "name eq 'name'" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("includeAnnotations", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            var response2 = mocks.responses.multipleWithCountResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(mocks.responses.collectionUrl + "?$select=name")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.collectionUrl + "?$select=name&$count=true")
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                select: ["name"],
                includeAnnotations: DWA.Prefer.Annotations.FormattedValue,
            };

            dynamicsWebApiTest
                .retrieveMultiple(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(+count) returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                select: ["name"],
                includeAnnotations: DWA.Prefer.Annotations.FormattedValue,
                count: true,
            };

            dynamicsWebApiTest
                .retrieveMultiple(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multipleWithCount());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("retrieves the next page link", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleWithLinkResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(mocks.responses.collectionUrl + "?$select=name")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                select: ["name"],
                includeAnnotations: DWA.Prefer.Annotations.FormattedValue,
            };

            dynamicsWebApiTest
                .retrieveMultiple(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multipleWithLink());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("when goes by next page link", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            var linkQuery = mocks.responses.multipleWithLink().oDataNextLink.split("?");
            var link = linkQuery[0].split("/");
            var getLink = `/${link.pop()}?${linkQuery[1]}`;
            scope = nock(link.join("/"), {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(getLink)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                select: ["name"],
                includeAnnotations: DWA.Prefer.Annotations.FormattedValue,
            };

            dynamicsWebApiTest
                .retrieveMultiple(dwaRequest, mocks.responses.multipleWithLink().oDataNextLink)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("retrieves the delta link (@odata.deltaLink)", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleWithDeltaLinkResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: "odata.track-changes",
                },
            })
                .get(mocks.responses.collectionUrl + "?$select=name")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                select: ["name"],
                trackChanges: true,
            };

            dynamicsWebApiTest
                .retrieveMultiple(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multipleWithDeltaLink());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("when goes by delta link (@odata.deltaLink)", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            var linkQuery = mocks.responses.multipleWithDeltaLink().oDataDeltaLink.split("?");
            var link = linkQuery[0].split("/");
            var getLink = `/${link.pop()}?${linkQuery[1]}`;
            scope = nock(link.join("/"), {
                reqheaders: {
                    Prefer: "odata.track-changes",
                },
            })
                .get(getLink)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                select: ["name"],
                trackChanges: true,
            };

            dynamicsWebApiTest
                .retrieveMultiple(dwaRequest, mocks.responses.multipleWithDeltaLink().oDataDeltaLink)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("$apply", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(mocks.responses.collectionUrl + "?$apply=groupby((statuscode),aggregate(estimatedvalue with sum as total))")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                includeAnnotations: DWA.Prefer.Annotations.FormattedValue,
                apply: "groupby((statuscode),aggregate(estimatedvalue with sum as total))",
            };

            dynamicsWebApiTest
                .retrieveMultiple(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("filter & queryParams parameters", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(
                    mocks.responses.collectionUrl +
                        '?$filter=Microsoft.Dynamics.CRM.In(PropertyName=@p1,PropertyValues=@p2)&@p1=\'lastname\'&@p2=["First", "Last\'s"]'
                )
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                includeAnnotations: DWA.Prefer.Annotations.FormattedValue,
                filter: "Microsoft.Dynamics.CRM.In(PropertyName=@p1,PropertyValues=@p2)",
                queryParams: ["@p1='lastname'", '@p2=["First", "Last\'s"]'],
            };

            dynamicsWebApiTest
                .retrieveMultiple(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.retrieveAll -", function () {
    describe("single page", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(mocks.responses.collectionUrl + "?$select=name")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                select: ["name"],
                includeAnnotations: DWA.Prefer.Annotations.FormattedValue,
            };

            dynamicsWebApiTest
                .retrieveAll(dwaRequest)
                .then(function (object) {
                    var checkResponse = { value: mocks.responses.multiple().value };
                    expect(object).to.deep.equal(checkResponse);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("multiple pages", function () {
        var scope;
        var scope2;
        before(function () {
            var response = mocks.responses.multipleWithLinkResponse;
            var response2 = mocks.responses.multipleResponse;
            var linkQuery = mocks.responses.multipleWithLink().oDataNextLink.split("?");
            var link = linkQuery[0].split("/");
            var getLink = `/${link.pop()}?${linkQuery[1]}`;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(mocks.responses.collectionUrl + "?$select=name")
                .reply(response.status, response.responseText, response.responseHeaders);
            scope2 = nock(link.join("/"), {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(getLink)
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                select: ["name"],
                includeAnnotations: DWA.Prefer.Annotations.FormattedValue,
            };

            dynamicsWebApiTest
                .retrieveAll(dwaRequest)
                .then(function (object) {
                    var multipleResponse = mocks.responses.multiple();
                    var checkResponse = { value: multipleResponse.value.concat(multipleResponse.value) };
                    expect(object).to.deep.equal(checkResponse);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
            expect(scope2.isDone()).to.be.true;
        });
    });

    describe("multiple pages - delta link", function () {
        var scope;
        var scope2;
        before(function () {
            var response = mocks.responses.multipleWithLinkResponse;
            var response2 = mocks.responses.multipleWithDeltaLinkResponse;
            var linkQuery = mocks.responses.multipleWithLink().oDataNextLink.split("?");
            var link = linkQuery[0].split("/");
            var getLink = `/${link.pop()}?${linkQuery[1]}`;

            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.collectionUrl + "?$select=name")
                .reply(response.status, response.responseText, response.responseHeaders);
            scope2 = nock(link.join("/")).get(getLink).reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveAll({ collection: "tests", select: ["name"] })
                .then(function (object) {
                    var multipleResponse = mocks.responses.multiple();
                    var checkResponse = { value: multipleResponse.value.concat(multipleResponse.value) };
                    checkResponse["@odata.deltaLink"] = mocks.responses.multipleWithDeltaLink()["@odata.deltaLink"];
                    checkResponse.oDataDeltaLink = mocks.responses.multipleWithDeltaLink()["@odata.deltaLink"];

                    expect(object).to.deep.equal(checkResponse);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
            expect(scope2.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.deleteRecord -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId2,
                },
            })
                .delete(mocks.responses.testEntityUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                key: mocks.data.testEntityId,
                impersonate: mocks.data.testEntityId2,
            };

            dynamicsWebApiTest
                .deleteRecord(dwaRequest)
                .then(function (object) {
                    expect(object).to.equal(true);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("single property", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl)
                .delete(mocks.responses.testEntityUrl + "/fullname")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .deleteRecord({ key: mocks.data.testEntityId, collection: "tests", navigationProperty: "fullname" })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("If-Match", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            var response2 = mocks.responses.upsertPreventUpdateResponse;
            var response3 = mocks.responses.upsertPreventCreateResponse;

            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId2,
                },
            })
                .delete(mocks.responses.testEntityUrl)
                .reply(response.status, response.responseText, response.responseHeaders)
                .delete(mocks.responses.testEntityUrl)
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .delete(mocks.responses.testEntityUrl)
                .reply(response3.status, response3.responseText, response3.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("(pre-condition approved) returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                key: mocks.data.testEntityId,
                impersonate: mocks.data.testEntityId2,
                ifmatch: "match",
            };

            dynamicsWebApiTest
                .deleteRecord(dwaRequest)
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(pre-condition failed) returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                key: mocks.data.testEntityId,
                impersonate: mocks.data.testEntityId2,
                ifmatch: "match",
            };

            dynamicsWebApiTest
                .deleteRecord(dwaRequest)
                .then(function (object) {
                    expect(object).to.be.false;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(request failed) returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                key: mocks.data.testEntityId,
                impersonate: mocks.data.testEntityId2,
                ifmatch: "match",
            };

            dynamicsWebApiTest
                .deleteRecord(dwaRequest)
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    expect(object.status).to.equal(404);
                    done();
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.createEntity -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.createReturnId;
            scope = nock(mocks.webApiUrl)
                .post(mocks.responses.entityDefinitionsUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .createEntity({ data: mocks.data.testEntity })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntityId);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.updateEntity -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .put(mocks.responses.entityDefinitionsIdUrl, mocks.data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateEntity({ data: mocks.data.testEntityDefinition })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("mergeLabels = true", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    "MSCRM.MergeLabels": "true",
                },
            })
                .put(mocks.responses.entityDefinitionsIdUrl, mocks.data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateEntity({ data: mocks.data.testEntityDefinition, mergeLabels: true })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.retrieveEntity -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl).get(mocks.responses.entityDefinitionsIdUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveEntity({ key: mocks.data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("basic - alternate key", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.entityDefinitionsUrl + "(alternateKey=%27keyValue%27)")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveEntity({ key: "alternateKey='keyValue'" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("select", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.entityDefinitionsIdUrl + "?$select=LogicalName")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.entityDefinitionsIdUrl + "?$select=LogicalName,SchemaName")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[LogicalName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveEntity({ key: mocks.data.testEntityId, select: ["LogicalName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[LogicalName, SchemaName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveEntity({ key: mocks.data.testEntityId, select: ["LogicalName", "SchemaName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.retrieveEntities -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.responseEntityDefinitions;
            scope = nock(mocks.webApiUrl).get(mocks.responses.entityDefinitionsUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveEntities()
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.createAttribute -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.createAttributeReturnId;
            scope = nock(mocks.webApiUrl)
                .post(mocks.responses.entityDefinitionsIdUrl + "/Attributes", mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .createAttribute({ entityKey: mocks.data.testEntityId, data: mocks.data.testEntity })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntityId2);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.updateAttribute -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .put(mocks.responses.entityDefinitionsIdUrl + "/Attributes(" + mocks.data.testEntityId2 + ")", mocks.data.testAttributeDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateAttribute({ entityKey: mocks.data.testEntityId, data: mocks.data.testAttributeDefinition })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("mergeLabels = true", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    "MSCRM.MergeLabels": "true",
                },
            })
                .put(mocks.responses.entityDefinitionsIdUrl + "/Attributes(" + mocks.data.testEntityId2 + ")", mocks.data.testAttributeDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateAttribute({ entityKey: mocks.data.testEntityId, data: mocks.data.testAttributeDefinition, mergeLabels: true })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("with Attribute Type", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .put(mocks.responses.entityDefinitionsIdUrl + "/Attributes(" + mocks.data.testEntityId2 + ")/AttributeType", mocks.data.testAttributeDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateAttribute({ entityKey: mocks.data.testEntityId, data: mocks.data.testAttributeDefinition, castType: "AttributeType" })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("with Attribute Type & mergeLabels = true", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    "MSCRM.MergeLabels": "true",
                },
            })
                .put(mocks.responses.entityDefinitionsIdUrl + "/Attributes(" + mocks.data.testEntityId2 + ")/AttributeType", mocks.data.testAttributeDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateAttribute({
                    entityKey: mocks.data.testEntityId,
                    data: mocks.data.testAttributeDefinition,
                    castType: "AttributeType",
                    mergeLabels: true,
                })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.retrieveAttributes -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.responseEntityDefinitions;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.entityDefinitionsIdUrl + "/Attributes")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveAttributes({ entityKey: mocks.data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("with AttributeType", function () {
        var scope;
        before(function () {
            var response = mocks.responses.responseEntityDefinitions;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.entityDefinitionsIdUrl + "/Attributes/AttributeType")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveAttributes({ entityKey: mocks.data.testEntityId, castType: "AttributeType" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.retrieveAttribute -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.entityDefinitionsIdUrl + "/Attributes(" + mocks.data.testEntityId2 + ")")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveAttribute({ entityKey: mocks.data.testEntityId, attributeKey: mocks.data.testEntityId2 })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("basic - AlternateKeys", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.entityDefinitionsUrl + "(SchemaName=%27Test%27)/Attributes(LogicalName=%27Test2%27)")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveAttribute({ entityKey: "SchemaName='Test'", attributeKey: "LogicalName='Test2'" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("with AttributeType", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.entityDefinitionsIdUrl + "/Attributes(" + mocks.data.testEntityId2 + ")/AttributeType")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveAttribute({ entityKey: mocks.data.testEntityId, attributeKey: mocks.data.testEntityId2, castType: "AttributeType" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.createRelationship -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.createReturnId;
            scope = nock(mocks.webApiUrl)
                .post(mocks.responses.relationshipDefinitionsUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .createRelationship({ data: mocks.data.testEntity })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntityId);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.updateRelationship -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .put(mocks.responses.relationshipDefinitionsIdUrl, mocks.data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateRelationship({ data: mocks.data.testEntityDefinition })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("cast relationship", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .put(mocks.responses.relationshipDefinitionsIdUrl + "/testcast", mocks.data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateRelationship({ data: mocks.data.testEntityDefinition, castType: "testcast" })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("mergeLabels = true", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    "MSCRM.MergeLabels": "true",
                },
            })
                .put(mocks.responses.relationshipDefinitionsIdUrl, mocks.data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateRelationship({ data: mocks.data.testEntityDefinition, mergeLabels: true })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.deleteRelationship -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl)
                .delete(mocks.responses.relationshipDefinitionsIdUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .deleteRelationship({ key: mocks.data.testEntityId })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.retrieveRelationship -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.relationshipDefinitionsIdUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationship({ key: mocks.data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("select", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.relationshipDefinitionsIdUrl + "?$select=LogicalName")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.relationshipDefinitionsIdUrl + "?$select=LogicalName,SchemaName")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[LogicalName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationship({ key: mocks.data.testEntityId, select: ["LogicalName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[LogicalName, SchemaName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationship({ key: mocks.data.testEntityId, select: ["LogicalName", "SchemaName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("cast relationship, select", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.relationshipDefinitionsIdUrl + "/testcast?$select=LogicalName")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.relationshipDefinitionsIdUrl + "/testcast?$select=LogicalName,SchemaName")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[LogicalName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationship({ key: mocks.data.testEntityId, castType: "testcast", select: ["LogicalName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[LogicalName, SchemaName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationship({ key: mocks.data.testEntityId, castType: "testcast", select: ["LogicalName", "SchemaName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.retrieveRelationships -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.responseEntityDefinitions;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.relationshipDefinitionsUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationships()
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("cast, select", function () {
        var scope;
        before(function () {
            var response = mocks.responses.responseEntityDefinitions;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.relationshipDefinitionsUrl + "/testcast?$select=LogicalName")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.relationshipDefinitionsUrl + "/testcast?$select=LogicalName,SchemaName")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[LogicalName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationships({ castType: "testcast", select: ["LogicalName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[LogicalName, SchemaName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationships({ castType: "testcast", select: ["LogicalName", "SchemaName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.createGlobalOptionSet -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.createReturnId;
            scope = nock(mocks.webApiUrl)
                .post(mocks.responses.globalOptionSetDefinitionsUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .createGlobalOptionSet({ data: mocks.data.testEntity })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntityId);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.updateGlobalOptionSet -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .put(mocks.responses.globalOptionSetDefinitionsIdUrl, mocks.data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateGlobalOptionSet({ data: mocks.data.testEntityDefinition })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("mergeLabels = true", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    "MSCRM.MergeLabels": "true",
                },
            })
                .put(mocks.responses.globalOptionSetDefinitionsIdUrl, mocks.data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateGlobalOptionSet({ data: mocks.data.testEntityDefinition, mergeLabels: true })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.deleteGlobalOptionSet -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl)
                .delete(mocks.responses.globalOptionSetDefinitionsIdUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .deleteGlobalOptionSet({ key: mocks.data.testEntityId })
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.retrieveGlobalOptionSet -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.globalOptionSetDefinitionsIdUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveGlobalOptionSet({ key: mocks.data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("select", function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.globalOptionSetDefinitionsIdUrl + "?$select=LogicalName")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.globalOptionSetDefinitionsIdUrl + "?$select=LogicalName,SchemaName")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[LogicalName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveGlobalOptionSet({ key: mocks.data.testEntityId, select: ["LogicalName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[LogicalName, SchemaName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveGlobalOptionSet({ key: mocks.data.testEntityId, select: ["LogicalName", "SchemaName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.retrieveGlobalOptionSets -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            var response = mocks.responses.responseEntityDefinitions;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.globalOptionSetDefinitionsUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveGlobalOptionSets()
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("cast, select", function () {
        var scope;
        before(function () {
            var response = mocks.responses.responseEntityDefinitions;
            scope = nock(mocks.webApiUrl)
                .get(mocks.responses.globalOptionSetDefinitionsUrl + "/casttype?$select=LogicalName")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(mocks.responses.globalOptionSetDefinitionsUrl + "/casttype?$select=LogicalName,SchemaName")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("[LogicalName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveGlobalOptionSets({ castType: "casttype", select: ["LogicalName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[LogicalName, SchemaName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveGlobalOptionSets({ castType: "casttype", select: ["LogicalName", "SchemaName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.executeBatch -", function () {
    describe("retrieve multiple / create / retrieve multiple", function () {
        var scope;
        var rBody = mocks.data.batchRetrieveMultipleCreateRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = mocks.responses.batchRetrieveMultipleCreateRetrieveMultiple;
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

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.retrieveMultiple({ collection: "tests" });
            dynamicsWebApiTest.create({ data: { firstname: "Test", lastname: "Batch!" }, collection: "records" });
            dynamicsWebApiTest.retrieveMultiple({ collection: "morerecords" });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(3);

                    expect(object[0]).to.deep.equal(mocks.responses.multiple());
                    expect(object[1]).to.deep.equal(mocks.data.testEntityId);
                    expect(object[2]).to.deep.equal(mocks.responses.multiple2());

                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("retrieve multiple / update / retrieve multiple", function () {
        var scope;
        var rBody = mocks.data.batchRetrieveMultipleUpdateRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = mocks.responses.batchRetrieveMultipleUpdateRetrieveMultiple;
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

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.retrieveMultiple({ collection: "tests" });
            dynamicsWebApiTest.update({ key: mocks.data.testEntityId2, collection: "records", data: { firstname: "Test", lastname: "Batch!" } });
            dynamicsWebApiTest.retrieveMultiple({ collection: "morerecords" });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(3);

                    expect(object[0]).to.deep.equal(mocks.responses.multiple());
                    expect(object[1]).to.be.true;
                    expect(object[2]).to.deep.equal(mocks.responses.multiple2());

                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("retrieve multiple / delete / retrieve multiple", function () {
        var scope;
        var rBody = mocks.data.batchRetrieveMultipleDeleteRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = mocks.responses.batchRetrieveMultipleDeleteRetrieveMultiple;
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

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.retrieveMultiple({ collection: "tests" });
            dynamicsWebApiTest.deleteRecord({ key: mocks.data.testEntityId2, collection: "records" });
            dynamicsWebApiTest.retrieveMultiple({ collection: "morerecords" });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(3);

                    expect(object[0]).to.deep.equal(mocks.responses.multiple());
                    expect(object[1]).to.be.true;
                    expect(object[2]).to.deep.equal(mocks.responses.multiple2());

                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("retrieve multiple / count / retrieve multiple", function () {
        var scope;
        var rBody = mocks.data.batchRetrieveMultipleCountRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = mocks.responses.batchRetrieveMultipleCountRetrieveMultiple;
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

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.retrieveMultiple({ collection: "tests" });
            dynamicsWebApiTest.count({ collection: "records" });
            dynamicsWebApiTest.retrieveMultiple({ collection: "morerecords" });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(3);

                    expect(object[0]).to.deep.equal(mocks.responses.multiple());
                    expect(object[1]).to.be.eq(5);
                    expect(object[2]).to.deep.equal(mocks.responses.multiple2());

                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("retrieve multiple / retrieve multiple (count) / retrieve multiple", function () {
        var scope;
        var rBody = mocks.data.batchRetrieveMultipleCountFilteredRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = mocks.responses.batchRetrieveMultipleCountFilteredRetrieveMultiple;
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

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.retrieveMultiple({ collection: "tests" });
            dynamicsWebApiTest.retrieveMultiple({ collection: "records", count: true, filter: "statecode eq 0" });
            dynamicsWebApiTest.retrieveMultiple({ collection: "morerecords" });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(3);

                    expect(object[0]).to.deep.equal(mocks.responses.multiple());
                    expect(object[1]).to.deep.equal(mocks.responses.multipleWithCount());
                    expect(object[2]).to.deep.equal(mocks.responses.multiple2());

                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("retrieve multiple / count (filtered) / retrieve multiple", function () {
        var scope;
        var rBody = mocks.data.batchRetrieveMultipleCountFilteredRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = mocks.responses.batchRetrieveMultipleCountFilteredRetrieveMultiple;
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

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.retrieveMultiple({ collection: "tests" });
            dynamicsWebApiTest.count({ collection: "records", filter: "statecode eq 0" });
            dynamicsWebApiTest.retrieveMultiple({ collection: "morerecords" });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(3);

                    expect(object[0]).to.deep.equal(mocks.responses.multiple());
                    expect(object[1]).to.deep.equal(2);
                    expect(object[2]).to.deep.equal(mocks.responses.multiple2());

                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("throws error", function () {
        it("countAll", function () {
            dynamicsWebApiTest.startBatch();

            expect(function () {
                dynamicsWebApiTest.countAll({ collection: "records" });
            }).to.throw("DynamicsWebApi.countAll cannot be used in a BATCH request.");
        });

        it("retrieveAll", function () {
            dynamicsWebApiTest.startBatch();

            expect(function () {
                dynamicsWebApiTest.retrieveAll({ collection: "records" });
            }).to.throw("DynamicsWebApi.retrieveAll cannot be used in a BATCH request.");
        });

        it("fetchAll", function () {
            dynamicsWebApiTest.startBatch();

            expect(function () {
                dynamicsWebApiTest.fetchAll({ collection: "collection", fetchXml: "any" });
            }).to.throw("DynamicsWebApi.fetchAll cannot be used in a BATCH request.");
        });
    });

    describe("update / delete", function () {
        var scope;
        var rBody = mocks.data.batchUpdateDelete;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = mocks.responses.batchUpdateDelete;
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

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.update({ key: mocks.data.testEntityId2, collection: "records", data: { firstname: "Test", lastname: "Batch!" } });
            dynamicsWebApiTest.deleteRecord({ key: mocks.data.testEntityId2, collection: "records", navigationProperty: "firstname" });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object).to.be.not.null;

                    expect(object.length).to.be.eq(2);

                    expect(object[0]).to.be.true;
                    expect(object[1]).to.be.true;

                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("update / delete - passing a request parameter", function () {
        var scope;
        var rBody = mocks.data.batchUpdateDelete;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = mocks.responses.batchUpdateDelete;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Authorization: "Bearer 123",
                },
            })
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

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.update({ key: mocks.data.testEntityId2, collection: "records", data: { firstname: "Test", lastname: "Batch!" } });
            dynamicsWebApiTest.deleteRecord({ key: mocks.data.testEntityId2, collection: "records", navigationProperty: "firstname" });

            dynamicsWebApiTest
                .executeBatch({ token: "123" })
                .then(function (object) {
                    expect(object.length).to.be.eq(2);

                    expect(object[0]).to.be.true;
                    expect(object[1]).to.be.true;

                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("update / delete - returns an error", function () {
        var scope;
        var rBody = mocks.data.batchUpdateDelete;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = mocks.responses.batchError;
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

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.update({ key: mocks.data.testEntityId2, collection: "records", data: { firstname: "Test", lastname: "Batch!" } });
            dynamicsWebApiTest.deleteRecord({ key: mocks.data.testEntityId2, collection: "records", navigationProperty: "firstname" });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    expect(object.length).to.be.eq(1);

                    expect(object[0].headers).to.deep.equal({
                        "odata-version": "4.0",
                        req_id: "5fe339e5-c75e-4dad-9597-b257ebce666b",
                        "content-type": "application/json; odata.metadata=minimal",
                    });

                    expect(object[0].error).to.deep.equal({
                        code: "0x0",
                        message: "error",
                        innererror: { message: "error", type: "Microsoft.Crm.CrmHttpException", stacktrace: "stack" },
                    });

                    expect(object[0].status).to.equal(400);
                    expect(object[0].statusMessage).to.equal("Bad Request");
                    expect(object[0].statusText).to.equal("Bad Request");

                    done();
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("create / create with Content-ID", function () {
        var scope;
        var rBody = mocks.data.batchCreateContentID;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = mocks.responses.batchUpdateDelete;
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

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.create({ collection: "records", data: { firstname: "Test", lastname: "Batch!" }, contentId: "1" });
            dynamicsWebApiTest.create({ collection: "test_property", data: { firstname: "Test1", lastname: "Batch!" }, contentId: "$1" });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(2);

                    expect(object[0]).to.be.eq(mocks.data.testEntityId);
                    expect(object[1]).to.be.undefined;

                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("create / create with Content-ID - URL Replacement", function () {
        var scope;
        var rBody = mocks.data.batchCreateContentIDURLReplace;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = mocks.responses.batchUpdateDelete;
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

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.create({ collection: "records", data: { firstname: "Test", lastname: "Batch!" }, contentId: "1" });
            dynamicsWebApiTest.create({ collection: "$1", data: { firstname: "Test1", lastname: "Batch!" } });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(2);

                    expect(object[0]).to.be.eq(mocks.data.testEntityId);
                    expect(object[1]).to.be.undefined;

                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("create / create with Content-ID in a payload", function () {
        var scope;
        var rBody = mocks.data.batchCreateContentIDPayload;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = mocks.responses.batchUpdateDelete;
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

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.create({ collection: "records", data: { firstname: "Test", lastname: "Batch!" }, contentId: "1" });
            dynamicsWebApiTest.create({ collection: "tests", data: { firstname: "Test1", lastname: "Batch!", "prop@odata.bind": "$1" } });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(2);

                    expect(object[0]).to.be.eq(mocks.data.testEntityId);
                    expect(object[1]).to.be.undefined;

                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("upsert / upsert / upsert with alternate keys", function () {
        var scope;
        var rBody = mocks.data.batchUpsertUpsertUpsertWithAlternateKeys;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = mocks.responses.batchUpsertUpsertUpsertWithAlternateKeys;
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

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.upsert({ key: "key='key1'", collection: "records", data: { firstname: "Test", lastname: "Batch!" } });
            dynamicsWebApiTest.upsert({ key: "key='key2'", collection: "records", data: { firstname: "Test", lastname: "Batch!" } });
            dynamicsWebApiTest.upsert({ key: "key='key3'", collection: "records", data: { firstname: "Test", lastname: "Batch!" } });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(3);

                    expect(object[0]).to.be.undefined;
                    expect(object[1]).to.be.undefined;
                    expect(object[2]).to.be.undefined;

                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("next request has a new requestId", function () {
        var scope;
        //1st request body check
        var rBody = mocks.data.batchRetrieveMultipleCreateRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }

        before(function () {
            var response = mocks.responses.batchRetrieveMultipleCreateRetrieveMultiple;
            var response2 = mocks.responses.createReturnId;
            scope = nock(mocks.webApiUrl);

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
                .reply(response.status, response.responseText, response.responseHeaders)
                .post(mocks.responses.collectionUrl, mocks.data.testEntity)
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var isDone = 0;
            function doneCheck(object) {
                if (++isDone === 2) done(object);
            }

            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.retrieveMultiple({ collection: "tests" });
            dynamicsWebApiTest.create({ collection: "records", data: { firstname: "Test", lastname: "Batch!" } });
            dynamicsWebApiTest.retrieveMultiple({ collection: "morerecords" });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(3);

                    expect(object[0]).to.deep.equal(mocks.responses.multiple());
                    expect(object[1]).to.deep.equal(mocks.data.testEntityId);
                    expect(object[2]).to.deep.equal(mocks.responses.multiple2());

                    doneCheck();
                })
                .catch(function (object) {
                    doneCheck(object);
                });

            dynamicsWebApiTest
                .create({ data: mocks.data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntityId);
                    doneCheck();
                })
                .catch(function (object) {
                    doneCheck(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.uploadFile -", function () {
    describe("file upload with 2 chunks", function () {
        var dwaRequest = {
            key: mocks.data.testEntityId,
            collection: "tests",
            fileName: "test.json",
            fieldName: "dwa_file",
            data: Buffer.from("Welcome to DynamicsWebApi!", "utf-8"),
        };

        var scope;
        var scope1;
        var scope2;
        before(function () {
            var beginResponse = mocks.responses.uploadFileBeginResponse;
            var response1 = mocks.responses.uploadFile1stResponse;

            var locationUrl = beginResponse.responseHeaders.Location.replace(mocks.webApiUrl, "/");

            scope = nock(mocks.webApiUrl)
                .matchHeader("x-ms-transfer-mode", "chunked")
                .patch(mocks.responses.testEntityUrl + `/${dwaRequest.fieldName}?x-ms-file-name=${dwaRequest.fileName}`)
                .reply(beginResponse.status, "", beginResponse.responseHeaders);

            scope1 = nock(mocks.webApiUrl)
                .matchHeader("Content-Range", `bytes 0-${beginResponse.responseHeaders["x-ms-chunk-size"] - 1}/${dwaRequest.data.length}`)
                .matchHeader("Content-Type", `application/octet-stream`)
                .patch(locationUrl, dwaRequest.data.slice(0, beginResponse.responseHeaders["x-ms-chunk-size"]))
                .reply(response1.status);

            scope2 = nock(mocks.webApiUrl)
                .matchHeader(
                    "Content-Range",
                    `bytes ${beginResponse.responseHeaders["x-ms-chunk-size"]}-${dwaRequest.data.length - 1}/${dwaRequest.data.length}`
                )
                .matchHeader("Content-Type", `application/octet-stream`)
                .patch(locationUrl, dwaRequest.data.slice(beginResponse.responseHeaders["x-ms-chunk-size"], dwaRequest.data.length))
                .reply(response1.status);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .uploadFile(dwaRequest)
                .then(function (object) {
                    done(object);
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
            expect(scope1.isDone()).to.be.true;
            expect(scope2.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.downloadFile -", function () {
    describe("file download in 2 chunks", function () {
        var dwaRequest = {
            key: mocks.data.testEntityId,
            collection: "tests",
            fieldName: "dwa_file",
        };

        var scope;
        var scope1;

        var chunk1 = mocks.responses.downloadFileResponseChunk1;
        var chunk2 = mocks.responses.downloadFileResponseChunk2;
        before(function () {
            scope = nock(mocks.webApiUrl)
                .matchHeader("Range", `bytes=0-${Utility.downloadChunkSize - 1}`)
                .get(mocks.responses.testEntityUrl + `/${dwaRequest.fieldName}?size=full`)
                .reply(chunk1.status, chunk1.responseText, chunk1.responseHeaders);

            scope1 = nock(mocks.webApiUrl)
                .matchHeader("Range", `bytes=${Utility.downloadChunkSize}-${Utility.downloadChunkSize * 2 - 1}`)
                .get(mocks.responses.testEntityUrl + `/${dwaRequest.fieldName}?size=full`)
                .reply(chunk2.status, chunk2.responseText, chunk2.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .downloadFile(dwaRequest)
                .then(function (object) {
                    var text = object.data.toString();
                    expect(text).to.eq("Welcome to DynamicsWebApi!");
                    expect(object.fileName).to.eq(chunk2.responseHeaders["x-ms-file-name"]);
                    expect(object.fileSize).to.eq(chunk2.responseHeaders["x-ms-file-size"]);
                    expect(object.location).to.eq(chunk2.responseHeaders["Location"]);

                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
            expect(scope1.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.retrieveCsdlMetadata -", function () {
    describe("basic", function () {
        var scope;
        before(function () {
            const response = mocks.responses.xmlResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Accept: "application/xml",
                },
            })
                .get("/$metadata")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveCsdlMetadata()
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.xmlResponse.responseText);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("annotations = true", function () {
        var scope;
        before(function () {
            const response = mocks.responses.xmlResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Accept: "application/xml",
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.All),
                },
            })
                .get("/$metadata")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveCsdlMetadata({
                    addAnnotations: true,
                })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.xmlResponse.responseText);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.constructor -", function () {
    describe("dataApi.version", function () {
        var dynamicsWebApi92 = new DynamicsWebApi();
        var scope;
        before(function () {
            var response = mocks.responses.createReturnId;
            scope = nock(mocks.webApiUrl92).post("/tests", mocks.data.testEntity).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("it makes a correct request and returns a correct response", function (done) {
            dynamicsWebApi92
                .create({ data: mocks.data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.equal(mocks.data.testEntityId);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("impersonate", function () {
        var dynamicsWebApi92 = new DynamicsWebApi({ impersonate: mocks.data.testEntityId2 });
        var scope;
        before(function () {
            var response = mocks.responses.createReturnId;
            scope = nock(mocks.webApiUrl92, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId2,
                },
            })
                .post("/tests", mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("it makes a correct request and returns a correct response", function (done) {
            dynamicsWebApi92
                .create({ data: mocks.data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.equal(mocks.data.testEntityId);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("authorization", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Authorization: "Bearer token001",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends the request to the right end point and returns a response", function (done) {
            var getToken = function (callback) {
                var adalCallback = function (token) {
                    callback(token);
                };

                adalCallback({ accessToken: "token001" });
            };

            var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, dataApi: { version: "8.2" } });
            dynamicsWebApiAuth
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("authorization - plain token", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Authorization: "Bearer token001",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends the request to the right end point and returns a response", function (done) {
            var getToken = function (callback) {
                var adalCallback = function (token) {
                    callback(token);
                };

                adalCallback("token001");
            };

            var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, dataApi: { version: "8.2" } });
            dynamicsWebApiAuth
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("authorization - two requests use different authorization tokens", function () {
        var scope;
        var scope2;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Authorization: "Bearer token001",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);

            scope2 = nock(mocks.webApiUrl, {
                reqheaders: {
                    Authorization: "Bearer token002",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        var i = 0;
        var getToken = function (callback) {
            var adalCallback = function (token) {
                callback(token);
            };

            adalCallback({ accessToken: "token00" + ++i });
        };

        it("sends the request to the right end point and returns a response", function (done) {
            var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, dataApi: { version: "8.2" } });
            dynamicsWebApiAuth
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                })
                .catch(function (object) {
                    expect(object).to.be.undefined;
                });

            dynamicsWebApiAuth
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
            expect(scope2.isDone()).to.be.true;
        });
    });

    describe("authorization - when token set in the request it overrides token returned from a callback", function () {
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Authorization: "Bearer overriden",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        var getToken = sinon.spy(function any(callback) {
            callback({ accessToken: "token001" });
        });

        it("sends the request to the right end point and returns a response", function (done) {
            var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, dataApi: { version: "8.2" } });
            dynamicsWebApiAuth
                .retrieveMultiple({ collection: "tests", token: "overriden" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });

        it("and token refresh callback has not been called", function () {
            expect(getToken.notCalled).to.be.true;
        });
    });

    describe("prefer - include annotations added to request if set in the config", function () {
        var dynamicsWebApi82 = new DynamicsWebApi({ dataApi: { version: "8.2" }, includeAnnotations: "some-annotations" });
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: 'odata.include-annotations="some-annotations"',
                },
            })
                .get(mocks.responses.testEntityUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("it makes a correct request and returns a correct response", function (done) {
            dynamicsWebApi82
                .retrieve({ key: mocks.data.testEntityId, collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("prefer - include annotations overriden if set in the request", function () {
        var dynamicsWebApi82 = new DynamicsWebApi({ dataApi: { version: "8.2" }, includeAnnotations: "some-annotations" });
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"',
                },
            })
                .get("/" + mocks.responses.collection + "?$select=name")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("it makes a correct request and returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                select: ["name"],
                includeAnnotations: DWA.Prefer.Annotations.FormattedValue,
            };

            dynamicsWebApi82
                .retrieveMultiple(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("prefer - return representation added to request if set in the config", function () {
        var dynamicsWebApi82 = new DynamicsWebApi({ dataApi: { version: "8.2" }, returnRepresentation: true });
        var scope;
        before(function () {
            var response = mocks.responses.createReturnRepresentation;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .post(mocks.responses.collectionUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApi82
                .create({ data: mocks.data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("prefer - return representation overriden if set in the request", function () {
        var dynamicsWebApi82 = new DynamicsWebApi({ dataApi: { version: "8.2" }, returnRepresentation: true });
        var scope;
        var scope2;
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);

            scope2 = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: /.*/,
                    "If-Match": "*",
                },
            })
                .post(mocks.responses.testEntityUrl, mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                data: mocks.data.testEntity,
                returnRepresentation: false,
            };

            dynamicsWebApi82
                .update(dwaRequest)
                .then(function (object) {
                    expect(object).to.be.true;
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });

        it("prefer header has not been set", function () {
            expect(scope2.isDone()).to.be.false;
        });
    });

    describe("prefer - maxPageSize added to request if set in the config", function () {
        var dynamicsWebApi82 = new DynamicsWebApi({ dataApi: { version: "8.2" }, maxPageSize: 10 });
        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: "odata.maxpagesize=10",
                },
            })
                .get(mocks.responses.collectionUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApi82
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("prefer - maxPageSize overriden if set in the request", function () {
        var dynamicsWebApi82 = new DynamicsWebApi({ dataApi: { version: "8.2" }, maxPageSize: 10 });
        var scope;
        before(function () {
            var response = mocks.responses.multipleWithLinkResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    Prefer: "odata.maxpagesize=100",
                },
            })
                .get(mocks.responses.collectionUrl)
                .query({ $select: "name" })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                select: ["name"],
                maxPageSize: 100,
            };

            dynamicsWebApi82
                .retrieveMultiple(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multipleWithLink());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.setConfig -", function () {
    describe("dataApi.version and impersonate", function () {
        var dynamicsWebApi81 = new DynamicsWebApi();
        dynamicsWebApi81.setConfig({ dataApi: { version: "8.1" }, impersonate: mocks.data.testEntityId2 });

        var scope;
        before(function () {
            var response = mocks.responses.createReturnId;
            scope = nock(mocks.webApiUrl81, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId2,
                },
            })
                .post("/tests", mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("it makes a correct request and returns a correct response", function (done) {
            dynamicsWebApi81
                .create({ data: mocks.data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.equal(mocks.data.testEntityId);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("impersonate overriden with a request.impersonate", function () {
        var dynamicsWebApi81 = new DynamicsWebApi();

        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl81, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId3,
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends the request to the right end point with a correct MSCRMCallerID header", function (done) {
            dynamicsWebApi81.setConfig({ dataApi: { version: "8.1" }, impersonate: mocks.data.testEntityId2 });
            dynamicsWebApi81
                .retrieveMultiple({ collection: "tests", impersonate: mocks.data.testEntityId3 })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("dataApi.version and impersonateAAD", function () {
        var dynamicsWebApi90 = new DynamicsWebApi();
        dynamicsWebApi90.setConfig({ dataApi: { version: "9.0" }, impersonateAAD: mocks.data.testEntityId2 });

        var scope;
        before(function () {
            var response = mocks.responses.createReturnId;
            scope = nock(mocks.webApiUrl90, {
                reqheaders: {
                    CallerObjectId: mocks.data.testEntityId2,
                },
            })
                .post("/tests", mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("it makes a correct request and returns a correct response", function (done) {
            dynamicsWebApi90
                .create({ data: mocks.data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.equal(mocks.data.testEntityId);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("impersonateAAD overriden with a request.impersonateAAD", function () {
        var dynamicsWebApi90 = new DynamicsWebApi();

        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl90, {
                reqheaders: {
                    CallerObjectId: mocks.data.testEntityId3,
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends the request to the right end point with a correct CallerObjectId header", function (done) {
            dynamicsWebApi90.setConfig({ dataApi: { version: "9.0" }, impersonateAAD: mocks.data.testEntityId2 });
            dynamicsWebApi90
                .retrieveMultiple({ collection: "tests", impersonateAAD: mocks.data.testEntityId3 })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("dataApi.version is overriden by version set in setConfig", function () {
        var dynamicsWebApi81 = new DynamicsWebApi({ dataApi: { version: "8.1" }, impersonate: mocks.data.testEntityId2 });

        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId2,
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends the request to the right end point and returns a response", function (done) {
            dynamicsWebApi81.setConfig({ dataApi: { version: "8.2" } });
            dynamicsWebApi81
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("impersonate uses the same url as original instance", function () {
        var dynamicsWebApi82 = new DynamicsWebApi({ dataApi: { version: "8.2" } });

        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId2,
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends the request to the right end point and returns a response", function (done) {
            dynamicsWebApi82.setConfig({ impersonate: mocks.data.testEntityId2 });
            dynamicsWebApi82
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("dataApi.version is overriden by the new config set", function () {
        var dynamicsWebApi81 = new DynamicsWebApi({ dataApi: { version: "8.1" } });

        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId2,
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends the request to the right end point and returns a response", function (done) {
            dynamicsWebApi81.setConfig({ dataApi: { version: "8.2" }, impersonate: mocks.data.testEntityId2 });
            dynamicsWebApi81
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi.initializeInstance -", function () {
    describe("current instance copied with its config", function () {
        var dynamicsWebApi81 = new DynamicsWebApi();
        dynamicsWebApi81.setConfig({ dataApi: { version: "8.1" }, impersonate: mocks.data.testEntityId2 });

        var scope;
        before(function () {
            var response = mocks.responses.createReturnId;
            scope = nock(mocks.webApiUrl81, {
                reqheaders: {
                    MSCRMCallerID: mocks.data.testEntityId2,
                },
            })
                .post("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends the request to the right end point", function (done) {
            var dynamicsWebApiCopy = dynamicsWebApi81.initializeInstance();
            dynamicsWebApiCopy
                .create({ data: mocks.data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.equal(mocks.data.testEntityId);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("config changed", function () {
        var dynamicsWebApi81 = new DynamicsWebApi();
        dynamicsWebApi81.setConfig({ dataApi: { version: "8.1" }, impersonate: mocks.data.testEntityId2 });

        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl).get(mocks.responses.collectionUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends the request to the right end point", function (done) {
            dynamicsWebApiCopy = dynamicsWebApi81.initializeInstance({ dataApi: { version: "8.2" } });
            dynamicsWebApiCopy
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("dynamicsWebApi proxy -", function () {
    describe("basic", function () {
        var dynamicsWebApiProxy = new DynamicsWebApi({
            dataApi: { version: "8.2" },
            proxy: {
                url: "http://localhost:1234",
            },
        });

        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl).get(mocks.responses.collectionUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends the request to the right end point", function (done) {
            dynamicsWebApiProxy
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("with auth", function () {
        var dynamicsWebApiProxy = new DynamicsWebApi({
            dataApi: { version: "8.2" },
            proxy: {
                url: "http://localhost:1235",
                auth: {
                    username: "john",
                    password: "doe",
                },
            },
        });

        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl).get(mocks.responses.collectionUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends the request to the right end point", function (done) {
            dynamicsWebApiProxy
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("with auth in url", function () {
        var dynamicsWebApiProxy = new DynamicsWebApi({
            dataApi: { version: "8.2" },
            proxy: {
                url: "http://john:doe@localhost:1235",
            },
        });

        var scope;
        before(function () {
            var response = mocks.responses.multipleResponse;
            scope = nock(mocks.webApiUrl).get(mocks.responses.collectionUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("sends the request to the right end point", function (done) {
            dynamicsWebApiProxy
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(mocks.responses.multiple());
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});
