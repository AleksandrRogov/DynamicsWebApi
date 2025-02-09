import { expect } from "chai";
import nock, { cleanAll } from "nock";
import { spy } from "sinon";

import { serverUrl as _serverUrl, responses, webApiUrl, data as _data, webApiUrl92, webApiUrl81, webApiUrl90 } from "./stubs";
import { DWA } from "../src/dwa";
import { DynamicsWebApi } from "../src/dynamics-web-api";

import { Utility } from "../src/utils/Utility";
Utility.downloadChunkSize = 15;

var dynamicsWebApiTest = new DynamicsWebApi({ serverUrl: _serverUrl, dataApi: { version: "8.2" } });

describe("dynamicsWebApi.upsert -", function () {
    describe("basic & update an existing entity", function () {
        var scope;
        before(function () {
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl)
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({ key: _data.testEntityId, collection: "tests", data: _data.testEntity })
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
            var response = responses.createReturnId;
            scope = nock(webApiUrl)
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({ key: _data.testEntityId, collection: "tests", data: _data.testEntity })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntityId);
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
            var response = responses.updateReturnRepresentation;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({ key: _data.testEntityId, collection: "tests", data: _data.testEntity, returnRepresentation: true })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.updatedEntity);
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
            var response = responses.createReturnRepresentation;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({ key: _data.testEntityId, collection: "tests", data: _data.testEntity, returnRepresentation: true })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.updateReturnRepresentation;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(responses.testEntityUrl + "?$select=fullname", _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                .patch(responses.testEntityUrl + "?$select=fullname,subject", _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("[fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({
                    key: _data.testEntityId,
                    collection: "tests",
                    data: _data.testEntity,
                    returnRepresentation: true,
                    select: ["fullname"],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[fullname, subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({
                    key: _data.testEntityId,
                    collection: "tests",
                    data: _data.testEntity,
                    returnRepresentation: true,
                    select: ["fullname", "subject"],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.updatedEntity);
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
            var response = responses.createReturnRepresentation;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(responses.testEntityUrl + "?$select=fullname", _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                .patch(responses.testEntityUrl + "?$select=fullname,subject", _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("[fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({
                    key: _data.testEntityId,
                    collection: "tests",
                    data: _data.testEntity,
                    returnRepresentation: true,
                    select: ["fullname"],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[fullname, subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .upsert({
                    key: _data.testEntityId,
                    collection: "tests",
                    data: _data.testEntity,
                    returnRepresentation: true,
                    select: ["fullname", "subject"],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl).get(responses.testEntityUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: _data.testEntityId, collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.collectionUrl + "(alternateKey='keyValue')")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: "alternateKey='keyValue'", collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.testEntityUrl + "?$select=fullname")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.testEntityUrl + "?$select=fullname,subject")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("[fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: _data.testEntityId, collection: "tests", select: ["fullname"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[fullname, subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: _data.testEntityId, collection: "tests", select: ["fullname", "subject"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.testEntityUrl + "/reference")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.testEntityUrl + "/reference?$select=fullname")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.testEntityUrl + "/reference?$select=fullname,subject")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("[/reference] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: _data.testEntityId, collection: "tests", select: ["/reference"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[/reference, fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: _data.testEntityId, collection: "tests", select: ["/reference", "fullname"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[/reference, fullname, subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: _data.testEntityId, collection: "tests", select: ["/reference", "fullname", "subject"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.retrieveReferenceResponse;
            scope = nock(webApiUrl)
                .get(responses.testEntityUrl + "/reference/$ref")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: _data.testEntityId, collection: "tests", select: ["reference/$ref"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.referenceResponseConverted);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.testEntityUrl + "?$expand=reference($select=something)")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({ key: _data.testEntityId, collection: "tests", expand: [{ property: "reference", select: ["something"] }] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.testEntityUrl + "?$select=fullname&$expand=reference($select=something)")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.testEntityUrl + "?$select=fullname,subject&$expand=reference($select=something)")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("[fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({
                    key: _data.testEntityId,
                    collection: "tests",
                    select: ["fullname"],
                    expand: [{ property: "reference", select: ["something"] }],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[fullname,subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({
                    key: _data.testEntityId,
                    collection: "tests",
                    select: ["fullname", "subject"],
                    expand: [{ property: "reference", select: ["something"] }],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.testEntityUrl + "/reference?$expand=reference($select=something)")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.testEntityUrl + "/reference?$select=fullname&$expand=reference($select=something)")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.testEntityUrl + "/reference?$select=fullname,subject&$expand=reference($select=something)")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("[/reference] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({
                    key: _data.testEntityId,
                    collection: "tests",
                    select: ["/reference"],
                    expand: [{ property: "reference", select: ["something"] }],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[/reference, fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({
                    key: _data.testEntityId,
                    collection: "tests",
                    select: ["/reference", "fullname"],
                    expand: [{ property: "reference", select: ["something"] }],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[/reference, fullname, subject] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieve({
                    key: _data.testEntityId,
                    collection: "tests",
                    select: ["/reference", "fullname", "subject"],
                    expand: [{ property: "reference", select: ["something"] }],
                })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.countBasic;
            scope = nock(webApiUrl)
                .get(responses.collectionUrl + "/$count")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .count({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(parseInt(responses.countBasic.responseText));
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
            var response = responses.multipleWithCountResponse;
            scope = nock(webApiUrl)
                .get(responses.collectionUrl + "?$filter=name%20eq%20%27name%27&$count=true")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .count({ collection: "tests", filter: "name eq 'name'" })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.multipleWithCount["@odata.count"]);
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
            var response = responses.multipleWithCountResponse;
            scope = nock(webApiUrl)
                .get(responses.collectionUrl + "?$filter=name%20eq%20%27name%27")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .countAll({ collection: "tests", filter: "name eq 'name'" })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.multipleWithCount["@odata.count"]);
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
            var response = responses.fetchXmlResponsePage1Cookie;
            scope = nock(webApiUrl)
                .get(responses.collectionUrl + "?fetchXml=" + encodeURIComponent(_data.fetchXmls.fetchXml1))
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .fetch({ collection: "tests", fetchXml: _data.fetchXmls.fetchXml })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.fetchXmls.fetchXmlResultPage1Cookie);
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
            var response = responses.fetchXmlResponsePage2Cookie;
            scope = nock(webApiUrl)
                .get(responses.collectionUrl + "?fetchXml=" + encodeURIComponent(_data.fetchXmls.fetchXml2cookie))
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var pagingInfo = _data.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo;
            dynamicsWebApiTest
                .fetch({ collection: "tests", fetchXml: _data.fetchXmls.fetchXml, pageNumber: pagingInfo.nextPage, pagingCookie: pagingInfo.cookie })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.fetchXmls.fetchXmlResultPage2Cookie);
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
            var response = responses.fetchXmlResponsePage1;
            scope = nock(webApiUrl)
                .get(responses.collectionUrl + "?fetchXml=" + encodeURIComponent(_data.fetchXmls.fetchXml1))
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .fetch({ collection: "tests", fetchXml: _data.fetchXmls.fetchXml })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.fetchXmls.fetchXmlResultPage1);
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
            var response = responses.fetchXmlResponsePage2Cookie;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(responses.collectionUrl + "?fetchXml=" + encodeURIComponent(_data.fetchXmls.fetchXml2cookie))
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var pagingInfo = _data.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo;
            dynamicsWebApiTest
                .fetch({
                    collection: "tests",
                    fetchXml: _data.fetchXmls.fetchXml,
                    includeAnnotations: DWA.Prefer.Annotations.FormattedValue,
                    pageNumber: pagingInfo.nextPage,
                    pagingCookie: pagingInfo.cookie,
                })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.fetchXmls.fetchXmlResultPage2Cookie);
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
            var response = responses.fetchXmlResponsePage1Cookie;
            scope = nock(webApiUrl)
                .get(responses.collectionUrl + "?fetchXml=" + encodeURIComponent(_data.fetchXmls.fetchXmlTop))
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .fetch({
                    collection: "tests",
                    fetchXml: _data.fetchXmls.fetchXmlTop,
                })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.fetchXmls.fetchXmlResultPage1Cookie);
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
            var response = responses.fetchXmlResponsePage1Cookie;
            var response2 = responses.fetchXmlResponsePage2NoCookie;
            scope = nock(webApiUrl)
                .get(responses.collectionUrl + "?fetchXml=" + encodeURIComponent(_data.fetchXmls.fetchXml1))
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.collectionUrl + "?fetchXml=" + encodeURIComponent(_data.fetchXmls.fetchXml2cookie))
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .fetchAll({ collection: "tests", fetchXml: _data.fetchXmls.fetchXml })
                .then(function (object) {
                    var checkResponse = _data.fetchXmls.fetchXmlResultPage1Cookie.value;
                    checkResponse = checkResponse.concat(_data.fetchXmls.fetchXmlResultPage2Cookie.value);
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl)
                .post(responses.testEntityUrl + "/tests_records/$ref", {
                    "@odata.id": webApiUrl + "records(" + _data.testEntityId2 + ")",
                })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .associate({
                    collection: "tests",
                    primaryKey: _data.testEntityId,
                    relationshipName: "tests_records",
                    relatedCollection: "records",
                    relatedKey: _data.testEntityId2,
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
            var response = responses.basicEmptyResponseSuccess;
            var response2 = responses.responseEntityDefinitions;
            scope = nock(webApiUrl)
                .get("/EntityDefinitions?$select=EntitySetName,LogicalName")
                .once()
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .post("/tests(" + _data.testEntityId + ")/tests_records/$ref", {
                    "@odata.id": webApiUrl + "records(" + _data.testEntityId2 + ")",
                })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var dynamicsWebApiE = dynamicsWebApiTest.initializeInstance({ dataApi: { version: "8.2" }, useEntityNames: true });
            dynamicsWebApiE
                .associate({
                    collection: "test",
                    primaryKey: _data.testEntityId,
                    relationshipName: "tests_records",
                    relatedCollection: "record",
                    relatedKey: _data.testEntityId2,
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId3,
                },
            })
                .post(responses.testEntityUrl + "/tests_records/$ref", {
                    "@odata.id": webApiUrl + "records(" + _data.testEntityId2 + ")",
                })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .associate({
                    collection: "tests",
                    primaryKey: _data.testEntityId,
                    relationshipName: "tests_records",
                    relatedCollection: "records",
                    relatedKey: _data.testEntityId2,
                    impersonate: _data.testEntityId3,
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl)
                .delete(responses.testEntityUrl + "/tests_records(" + _data.testEntityId2 + ")/$ref")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .disassociate({
                    collection: "tests",
                    primaryKey: _data.testEntityId,
                    relationshipName: "tests_records",
                    relatedKey: _data.testEntityId2,
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId3,
                },
            })
                .delete(responses.testEntityUrl + "/tests_records(" + _data.testEntityId2 + ")/$ref")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .disassociate({
                    collection: "tests",
                    primaryKey: _data.testEntityId,
                    relationshipName: "tests_records",
                    relatedKey: _data.testEntityId2,
                    impersonate: _data.testEntityId3,
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl)
                .put(responses.testEntityUrl + "/tests_records/$ref", {
                    "@odata.id": webApiUrl + "records(" + _data.testEntityId2 + ")",
                })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .associateSingleValued({
                    collection: "tests",
                    primaryKey: _data.testEntityId,
                    navigationProperty: "tests_records",
                    relatedCollection: "records",
                    relatedKey: _data.testEntityId2,
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId3,
                },
            })
                .put(responses.testEntityUrl + "/tests_records/$ref", {
                    "@odata.id": webApiUrl + "records(" + _data.testEntityId2 + ")",
                })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .associateSingleValued({
                    collection: "tests",
                    primaryKey: _data.testEntityId,
                    navigationProperty: "tests_records",
                    relatedCollection: "records",
                    relatedKey: _data.testEntityId2,
                    impersonate: _data.testEntityId3,
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl)
                .delete(responses.testEntityUrl + "/tests_records/$ref")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .disassociateSingleValued({ collection: "tests", primaryKey: _data.testEntityId, navigationProperty: "tests_records" })
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId3,
                },
            })
                .delete(responses.testEntityUrl + "/tests_records/$ref")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .disassociateSingleValued({
                    collection: "tests",
                    primaryKey: _data.testEntityId,
                    navigationProperty: "tests_records",
                    impersonate: _data.testEntityId3,
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get("/FUN()")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get("/FUN(param1=@p1,param2=@p2)?@p1=%27value1%27&@p2=2")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("(no parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({ name: "FUN" })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(with parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({ name: "FUN", parameters: { param1: "value1", param2: 2 } })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl).get("/FUN()").reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("(no parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction("FUN")
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId,
                },
            })
                .get("/FUN()")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get("/FUN(param1=@p1,param2=@p2)?@p1=%27value1%27&@p2=2")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("(no parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({ name: "FUN", impersonate: _data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(with parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({ name: "FUN", parameters: { param1: "value1", param2: 2 }, impersonate: _data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            var response2 = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl)
                .get(responses.testEntityUrl + "/FUN()")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.testEntityUrl + "/FUN(param1=@p1,param2=@p2)?@p1=%27value1%27&@p2=2")
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("(no parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({ key: _data.testEntityId, collection: "tests", name: "FUN" })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(with parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({
                    key: _data.testEntityId,
                    collection: "tests",
                    name: "FUN",
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
            var response = responses.response200;
            scope = nock(webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId,
                },
            })
                .get(responses.testEntityUrl + "/FUN()")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.testEntityUrl + "/FUN(param1=@p1,param2=@p2)?@p1=%27value1%27&@p2=2")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("(no parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({ key: _data.testEntityId, collection: "tests", name: "FUN", impersonate: _data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(with parameters) returns a correct response", function (done) {
            dynamicsWebApiTest
                .callFunction({
                    key: _data.testEntityId,
                    collection: "tests",
                    name: "FUN",
                    parameters: { param1: "value1", param2: 2 },
                    impersonate: _data.testEntityId,
                })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl).post("/FUN", responses.actionRequestModified).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .callAction({ actionName: "FUN", action: responses.actionRequest })
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId2,
                },
            })
                .post("/FUN", responses.actionRequestModified)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .callAction({ actionName: "FUN", action: responses.actionRequest, impersonate: _data.testEntityId2 })
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .post(responses.testEntityUrl + "/FUN", responses.actionRequestModified)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .callAction({ key: _data.testEntityId, collection: "tests", actionName: "FUN", action: responses.actionRequest })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId2,
                },
            })
                .post(responses.testEntityUrl + "/FUN", responses.actionRequestModified)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .callAction({
                    key: _data.testEntityId,
                    collection: "tests",
                    actionName: "FUN",
                    action: responses.actionRequest,
                    impersonate: _data.testEntityId2,
                })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: _data.testEntityId,
                collection: "tests",
                data: _data.testEntity,
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
            var response = responses.updateReturnRepresentation;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                .patch(responses.testEntityUrl + "?$select=fullname,subject", _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: _data.testEntityId,
                collection: "tests",
                data: _data.testEntity,
                returnRepresentation: true,
            };

            dynamicsWebApiTest
                .update(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(_data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[fullname, subject] returns a correct response", function (done) {
            var dwaRequest = {
                key: _data.testEntityId,
                collection: "tests",
                data: _data.testEntity,
                returnRepresentation: true,
                select: ["fullname", "subject"],
            };

            dynamicsWebApiTest
                .update(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(_data.updatedEntity);
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
            var response = responses.basicEmptyResponseSuccess;

            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "match",
                },
            })
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: _data.testEntityId,
                collection: "tests",
                data: _data.testEntity,
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
            var response = responses.upsertPreventUpdateResponse;

            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "match",
                },
            })
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: _data.testEntityId,
                collection: "tests",
                data: _data.testEntity,
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
            var response = responses.upsertPreventCreateResponse;

            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "match",
                },
            })
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("catches the error", function (done) {
            var dwaRequest = {
                key: _data.testEntityId,
                collection: "tests",
                data: _data.testEntity,
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
            key: _data.testEntityId,
            collection: "tests",
            data: _data.testEntity,
        };

        var scope;
        before(function () {
            var response = responses.basicEmptyResponseSuccess;
            var response2 = responses.createReturnId;

            scope = nock(webApiUrl)
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            cleanAll();
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
                    expect(object).to.deep.equal(_data.testEntityId);
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
            var response = responses.updateReturnRepresentation;
            var response2 = responses.createReturnRepresentation;

            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                .patch(responses.testEntityUrl + "?$select=name", _data.testEntity)
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("(update) returns a correct response", function (done) {
            var dwaRequest = {
                key: _data.testEntityId,
                collection: "tests",
                data: _data.testEntity,
                returnRepresentation: true,
            };

            dynamicsWebApiTest
                .upsert(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(_data.updatedEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("(create) returns a correct response", function (done) {
            var dwaRequest = {
                key: _data.testEntityId,
                collection: "tests",
                data: _data.testEntity,
                returnRepresentation: true,
                select: ["name"],
            };

            dynamicsWebApiTest
                .upsert(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            key: _data.testEntityId,
            collection: "tests",
            data: _data.testEntity,
            returnRepresentation: true,
            ifmatch: "*",
        };
        var scope;
        before(function () {
            var response = responses.upsertPreventCreateResponse;
            var response2 = responses.createReturnRepresentation;
            var response3 = responses.upsertPreventUpdateResponse;

            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                    "If-Match": "*",
                },
            })
                //create prevented
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                //create succeeded
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                //request failed
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response3.status, response3.responseText, response3.responseHeaders);
        });

        after(function () {
            cleanAll();
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
                    expect(object).to.deep.equal(_data.testEntity);
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
                    expect(object.status).to.equal(responses.upsertPreventUpdateResponse.status);
                    done();
                });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("If-None-Match: '*' (Prevent Update)", function () {
        var dwaRequest = {
            key: _data.testEntityId,
            collection: "tests",
            data: _data.testEntity,
            returnRepresentation: true,
            ifnonematch: "*",
        };
        var scope;
        before(function () {
            var response = responses.upsertPreventUpdateResponse;
            var response2 = responses.updateReturnRepresentation;
            var response3 = responses.upsertPreventCreateResponse;

            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                    "If-None-Match": "*",
                },
            })
                //update prevented
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders)
                //update succeeded
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                //request failed
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response3.status, response3.responseText, response3.responseHeaders);
        });

        after(function () {
            cleanAll();
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
                    expect(object).to.deep.equal(_data.updatedEntity);
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
                    expect(object.status).to.equal(responses.upsertPreventCreateResponse.status);
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
            var response = responses.response200;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "match",
                    MSCRMCallerID: _data.testEntityId2,
                },
            })
                .get(responses.testEntityUrl + "?$expand=prop")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: _data.testEntityId,
                collection: "tests",
                expand: [{ property: "prop" }],
                impersonate: _data.testEntityId2,
                ifmatch: "match",
            };

            dynamicsWebApiTest
                .retrieve(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "match",
                    MSCRMCallerID: _data.testEntityId2,
                },
            })
                .get(responses.testEntityUrl + "?$expand=prop($filter=" + encodeURI("field eq ") + "%27value%27)")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: _data.testEntityId,
                collection: "tests",
                expand: [{ property: "prop", filter: "field eq 'value'" }],
                impersonate: _data.testEntityId2,
                ifmatch: "match",
            };

            dynamicsWebApiTest
                .retrieve(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.retrieveReferenceResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "match",
                    MSCRMCallerID: _data.testEntityId2,
                },
            })
                .get(responses.testEntityUrl + "/ownerid/$ref")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: _data.testEntityId,
                collection: "tests",
                select: ["ownerid/$ref"],
                impersonate: _data.testEntityId2,
                ifmatch: "match",
            };

            dynamicsWebApiTest
                .retrieve(dwaRequest)
                .then(function (object) {
                    expect(object).to.deep.equal(_data.referenceResponseConverted);
                    done();
                })
                .catch(function (object) {
                    expect(object).to.be.undefined("any"); //todo: not sure what type to pass here
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl).get(responses.collectionUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl)
                .get(responses.collectionUrl + "?$select=fullname")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.collectionUrl + "?$select=fullname,subject")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("[fullname] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveMultiple({ collection: "tests", select: ["fullname"] })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl)
                .get(responses.collectionUrl + "?$filter=name%20eq%20%27name%27")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.collectionUrl + "?$select=fullname&$filter=name%20eq%20%27name%27")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveMultiple({ collection: "tests", filter: "name eq 'name'" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleResponse;
            var response2 = responses.multipleWithCountResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(responses.collectionUrl + "?$select=name")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.collectionUrl + "?$select=name&$count=true")
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            cleanAll();
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
                    expect(object).to.deep.equal(responses.multiple());
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
                    expect(object).to.deep.equal(responses.multipleWithCount());
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
            var response = responses.multipleWithLinkResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(responses.collectionUrl + "?$select=name")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
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
                    expect(object).to.deep.equal(responses.multipleWithLink());
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
            var response = responses.multipleResponse;
            var linkQuery = responses.multipleWithLink().oDataNextLink.split("?");
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
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                select: ["name"],
                includeAnnotations: DWA.Prefer.Annotations.FormattedValue,
            };

            dynamicsWebApiTest
                .retrieveMultiple(dwaRequest, responses.multipleWithLink().oDataNextLink)
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleWithDeltaLinkResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: "odata.track-changes",
                },
            })
                .get(responses.collectionUrl + "?$select=name")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
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
                    expect(object).to.deep.equal(responses.multipleWithDeltaLink());
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
            var response = responses.multipleResponse;
            var linkQuery = responses.multipleWithDeltaLink().oDataDeltaLink.split("?");
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
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                select: ["name"],
                trackChanges: true,
            };

            dynamicsWebApiTest
                .retrieveMultiple(dwaRequest, responses.multipleWithDeltaLink().oDataDeltaLink)
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(responses.collectionUrl + "?$apply=groupby((statuscode),aggregate(estimatedvalue with sum as total))")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
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
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(
                    responses.collectionUrl +
                        '?$filter=Microsoft.Dynamics.CRM.In(PropertyName=@p1,PropertyValues=@p2)&@p1=\'lastname\'&@p2=["First", "Last\'s"]',
                )
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
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
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(responses.collectionUrl + "?$select=name")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
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
                    var checkResponse = { value: responses.multiple().value };
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
            var response = responses.multipleWithLinkResponse;
            var response2 = responses.multipleResponse;
            var linkQuery = responses.multipleWithLink().oDataNextLink.split("?");
            var link = linkQuery[0].split("/");
            var getLink = `/${link.pop()}?${linkQuery[1]}`;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.FormattedValue),
                },
            })
                .get(responses.collectionUrl + "?$select=name")
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
            cleanAll();
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
                    var multipleResponse = responses.multiple();
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
            var response = responses.multipleWithLinkResponse;
            var response2 = responses.multipleWithDeltaLinkResponse;
            var linkQuery = responses.multipleWithLink().oDataNextLink.split("?");
            var link = linkQuery[0].split("/");
            var getLink = `/${link.pop()}?${linkQuery[1]}`;

            scope = nock(webApiUrl)
                .get(responses.collectionUrl + "?$select=name")
                .reply(response.status, response.responseText, response.responseHeaders);
            scope2 = nock(link.join("/")).get(getLink).reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveAll({ collection: "tests", select: ["name"] })
                .then(function (object) {
                    var multipleResponse = responses.multiple();
                    var checkResponse: Record<string, any> = { value: multipleResponse.value.concat(multipleResponse.value) };
                    checkResponse["@odata.deltaLink"] = responses.multipleWithDeltaLink()["@odata.deltaLink"];
                    checkResponse.oDataDeltaLink = responses.multipleWithDeltaLink()["@odata.deltaLink"];

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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId2,
                },
            })
                .delete(responses.testEntityUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                key: _data.testEntityId,
                impersonate: _data.testEntityId2,
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl)
                .delete(responses.testEntityUrl + "/fullname")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .deleteRecord({ key: _data.testEntityId, collection: "tests", property: "fullname" })
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
            var response = responses.basicEmptyResponseSuccess;
            var response2 = responses.upsertPreventUpdateResponse;
            var response3 = responses.upsertPreventCreateResponse;

            scope = nock(webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId2,
                },
            })
                .delete(responses.testEntityUrl)
                .reply(response.status, response.responseText, response.responseHeaders)
                .delete(responses.testEntityUrl)
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .delete(responses.testEntityUrl)
                .reply(response3.status, response3.responseText, response3.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("(pre-condition approved) returns a correct response", function (done) {
            var dwaRequest = {
                collection: "tests",
                key: _data.testEntityId,
                impersonate: _data.testEntityId2,
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
                key: _data.testEntityId,
                impersonate: _data.testEntityId2,
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
                key: _data.testEntityId,
                impersonate: _data.testEntityId2,
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
            var response = responses.createReturnId;
            scope = nock(webApiUrl)
                .post(responses.entityDefinitionsUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .createEntity({ data: _data.testEntity })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntityId);
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .put(responses.entityDefinitionsIdUrl, _data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateEntity({ data: _data.testEntityDefinition })
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    "MSCRM.MergeLabels": "true",
                },
            })
                .put(responses.entityDefinitionsIdUrl, _data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateEntity({ data: _data.testEntityDefinition, mergeLabels: true })
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
            var response = responses.response200;
            scope = nock(webApiUrl).get(responses.entityDefinitionsIdUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveEntity({ key: _data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.entityDefinitionsUrl + "(alternateKey='keyValue')")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveEntity({ key: "alternateKey='keyValue'" })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.entityDefinitionsIdUrl + "?$select=LogicalName")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.entityDefinitionsIdUrl + "?$select=LogicalName,SchemaName")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("[LogicalName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveEntity({ key: _data.testEntityId, select: ["LogicalName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[LogicalName, SchemaName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveEntity({ key: _data.testEntityId, select: ["LogicalName", "SchemaName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.responseEntityDefinitions;
            scope = nock(webApiUrl).get(responses.entityDefinitionsUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveEntities()
                .then(function (object) {
                    expect(object).to.deep.equal(_data.entityDefinitionList);
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
            var response = responses.createAttributeReturnId;
            scope = nock(webApiUrl)
                .post(responses.entityDefinitionsIdUrl + "/Attributes", _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .createAttribute({ entityKey: _data.testEntityId, data: _data.testEntity })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntityId2);
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .put(responses.entityDefinitionsIdUrl + "/Attributes(" + _data.testEntityId2 + ")", _data.testAttributeDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateAttribute({ entityKey: _data.testEntityId, data: _data.testAttributeDefinition })
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    "MSCRM.MergeLabels": "true",
                },
            })
                .put(responses.entityDefinitionsIdUrl + "/Attributes(" + _data.testEntityId2 + ")", _data.testAttributeDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateAttribute({ entityKey: _data.testEntityId, data: _data.testAttributeDefinition, mergeLabels: true })
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .put(responses.entityDefinitionsIdUrl + "/Attributes(" + _data.testEntityId2 + ")/AttributeType", _data.testAttributeDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateAttribute({ entityKey: _data.testEntityId, data: _data.testAttributeDefinition, castType: "AttributeType" })
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    "MSCRM.MergeLabels": "true",
                },
            })
                .put(responses.entityDefinitionsIdUrl + "/Attributes(" + _data.testEntityId2 + ")/AttributeType", _data.testAttributeDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateAttribute({
                    entityKey: _data.testEntityId,
                    data: _data.testAttributeDefinition,
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
            var response = responses.responseEntityDefinitions;
            scope = nock(webApiUrl)
                .get(responses.entityDefinitionsIdUrl + "/Attributes")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveAttributes({ entityKey: _data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.entityDefinitionList);
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
            var response = responses.responseEntityDefinitions;
            scope = nock(webApiUrl)
                .get(responses.entityDefinitionsIdUrl + "/Attributes/AttributeType")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveAttributes({ entityKey: _data.testEntityId, castType: "AttributeType" })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.entityDefinitionList);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.entityDefinitionsIdUrl + "/Attributes(" + _data.testEntityId2 + ")")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveAttribute({ entityKey: _data.testEntityId, attributeKey: _data.testEntityId2 })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.entityDefinitionsUrl + "(SchemaName='Test')/Attributes(LogicalName='Test2')")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveAttribute({ entityKey: "SchemaName='Test'", attributeKey: "LogicalName='Test2'" })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.entityDefinitionsIdUrl + "/Attributes(" + _data.testEntityId2 + ")/AttributeType")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveAttribute({ entityKey: _data.testEntityId, attributeKey: _data.testEntityId2, castType: "AttributeType" })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.createReturnId;
            scope = nock(webApiUrl)
                .post(responses.relationshipDefinitionsUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .createRelationship({ data: _data.testEntity })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntityId);
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .put(responses.relationshipDefinitionsIdUrl, _data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateRelationship({ data: _data.testEntityDefinition })
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .put(responses.relationshipDefinitionsIdUrl + "/testcast", _data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateRelationship({ data: _data.testEntityDefinition, castType: "testcast" })
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    "MSCRM.MergeLabels": "true",
                },
            })
                .put(responses.relationshipDefinitionsIdUrl, _data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateRelationship({ data: _data.testEntityDefinition, mergeLabels: true })
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl).delete(responses.relationshipDefinitionsIdUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .deleteRelationship({ key: _data.testEntityId })
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
            var response = responses.response200;
            scope = nock(webApiUrl).get(responses.relationshipDefinitionsIdUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationship({ key: _data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.relationshipDefinitionsIdUrl + "?$select=LogicalName")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.relationshipDefinitionsIdUrl + "?$select=LogicalName,SchemaName")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("[LogicalName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationship({ key: _data.testEntityId, select: ["LogicalName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[LogicalName, SchemaName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationship({ key: _data.testEntityId, select: ["LogicalName", "SchemaName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.relationshipDefinitionsIdUrl + "/testcast?$select=LogicalName")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.relationshipDefinitionsIdUrl + "/testcast?$select=LogicalName,SchemaName")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("[LogicalName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationship({ key: _data.testEntityId, castType: "testcast", select: ["LogicalName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[LogicalName, SchemaName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationship({ key: _data.testEntityId, castType: "testcast", select: ["LogicalName", "SchemaName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.responseEntityDefinitions;
            scope = nock(webApiUrl).get(responses.relationshipDefinitionsUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationships()
                .then(function (object) {
                    expect(object).to.deep.equal(_data.entityDefinitionList);
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
            var response = responses.responseEntityDefinitions;
            scope = nock(webApiUrl)
                .get(responses.relationshipDefinitionsUrl + "/testcast?$select=LogicalName")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.relationshipDefinitionsUrl + "/testcast?$select=LogicalName,SchemaName")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("[LogicalName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveRelationships({ castType: "testcast", select: ["LogicalName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.entityDefinitionList);
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
                    expect(object).to.deep.equal(_data.entityDefinitionList);
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
            var response = responses.createReturnId;
            scope = nock(webApiUrl)
                .post(responses.globalOptionSetDefinitionsUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .createGlobalOptionSet({ data: _data.testEntity })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntityId);
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .put(responses.globalOptionSetDefinitionsIdUrl, _data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateGlobalOptionSet({ data: _data.testEntityDefinition })
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                    "MSCRM.MergeLabels": "true",
                },
            })
                .put(responses.globalOptionSetDefinitionsIdUrl, _data.testEntityDefinition)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .updateGlobalOptionSet({ data: _data.testEntityDefinition, mergeLabels: true })
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl).delete(responses.globalOptionSetDefinitionsIdUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .deleteGlobalOptionSet({ key: _data.testEntityId })
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
            var response = responses.response200;
            scope = nock(webApiUrl).get(responses.globalOptionSetDefinitionsIdUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveGlobalOptionSet({ key: _data.testEntityId })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.response200;
            scope = nock(webApiUrl)
                .get(responses.globalOptionSetDefinitionsIdUrl + "?$select=LogicalName")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.globalOptionSetDefinitionsIdUrl + "?$select=LogicalName,SchemaName")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("[LogicalName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveGlobalOptionSet({ key: _data.testEntityId, select: ["LogicalName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
                    done();
                })
                .catch(function (object) {
                    done(object);
                });
        });

        it("[LogicalName, SchemaName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveGlobalOptionSet({ key: _data.testEntityId, select: ["LogicalName", "SchemaName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.responseEntityDefinitions;
            scope = nock(webApiUrl).get(responses.globalOptionSetDefinitionsUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveGlobalOptionSets()
                .then(function (object) {
                    expect(object).to.deep.equal(_data.entityDefinitionList);
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
            var response = responses.responseEntityDefinitions;
            scope = nock(webApiUrl)
                .get(responses.globalOptionSetDefinitionsUrl + "/casttype?$select=LogicalName")
                .reply(response.status, response.responseText, response.responseHeaders)
                .get(responses.globalOptionSetDefinitionsUrl + "/casttype?$select=LogicalName,SchemaName")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("[LogicalName] returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveGlobalOptionSets({ castType: "casttype", select: ["LogicalName"] })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.entityDefinitionList);
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
                    expect(object).to.deep.equal(_data.entityDefinitionList);
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
        var rBody = _data.batchRetrieveMultipleCreateRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = responses.batchRetrieveMultipleCreateRetrieveMultiple;
            scope = nock(webApiUrl)
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
            cleanAll();
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

                    expect(object[0]).to.deep.equal(responses.multiple());
                    expect(object[1]).to.deep.equal(_data.testEntityId);
                    expect(object[2]).to.deep.equal(responses.multiple2());

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
        var rBody = _data.batchRetrieveMultipleUpdateRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = responses.batchRetrieveMultipleUpdateRetrieveMultiple;
            scope = nock(webApiUrl)
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
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.retrieveMultiple({ collection: "tests" });
            dynamicsWebApiTest.update({ key: _data.testEntityId2, collection: "records", data: { firstname: "Test", lastname: "Batch!" } });
            dynamicsWebApiTest.retrieveMultiple({ collection: "morerecords" });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(3);

                    expect(object[0]).to.deep.equal(responses.multiple());
                    expect(object[1]).to.be.true;
                    expect(object[2]).to.deep.equal(responses.multiple2());

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
        var rBody = _data.batchRetrieveMultipleDeleteRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = responses.batchRetrieveMultipleDeleteRetrieveMultiple;
            scope = nock(webApiUrl)
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
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.retrieveMultiple({ collection: "tests" });
            dynamicsWebApiTest.deleteRecord({ key: _data.testEntityId2, collection: "records" });
            dynamicsWebApiTest.retrieveMultiple({ collection: "morerecords" });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(3);

                    expect(object[0]).to.deep.equal(responses.multiple());
                    expect(object[1]).to.be.true;
                    expect(object[2]).to.deep.equal(responses.multiple2());

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
        var rBody = _data.batchRetrieveMultipleCountRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = responses.batchRetrieveMultipleCountRetrieveMultiple;
            scope = nock(webApiUrl)
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
            cleanAll();
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

                    expect(object[0]).to.deep.equal(responses.multiple());
                    expect(object[1]).to.be.eq(5);
                    expect(object[2]).to.deep.equal(responses.multiple2());

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
        var rBody = _data.batchRetrieveMultipleCountFilteredRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = responses.batchRetrieveMultipleCountFilteredRetrieveMultiple;
            scope = nock(webApiUrl)
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
            cleanAll();
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

                    expect(object[0]).to.deep.equal(responses.multiple());
                    expect(object[1]).to.deep.equal(responses.multipleWithCount());
                    expect(object[2]).to.deep.equal(responses.multiple2());

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
        var rBody = _data.batchRetrieveMultipleCountFilteredRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = responses.batchRetrieveMultipleCountFilteredRetrieveMultiple;
            scope = nock(webApiUrl)
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
            cleanAll();
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

                    expect(object[0]).to.deep.equal(responses.multiple());
                    expect(object[1]).to.deep.equal(2);
                    expect(object[2]).to.deep.equal(responses.multiple2());

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
        it("countAll", async () => {
            dynamicsWebApiTest.startBatch();

            await expectThrowsAsync(() => dynamicsWebApiTest.countAll({ collection: "records" }), "DynamicsWebApi.countAll cannot be used in a BATCH request.");
        });

        it("retrieveAll", async () => {
            dynamicsWebApiTest.startBatch();

            await expectThrowsAsync(
                () => dynamicsWebApiTest.retrieveAll({ collection: "records" }),
                "DynamicsWebApi.retrieveAll cannot be used in a BATCH request.",
            );
        });

        it("fetchAll", async () => {
            dynamicsWebApiTest.startBatch();

            await expectThrowsAsync(
                () => dynamicsWebApiTest.fetchAll({ collection: "collection", fetchXml: "any" }),
                "DynamicsWebApi.fetchAll cannot be used in a BATCH request.",
            );
        });
    });

    describe("update / delete", function () {
        var scope;
        var rBody = _data.batchUpdateDelete;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = responses.batchUpdateDelete;
            scope = nock(webApiUrl)
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
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.update({ key: _data.testEntityId2, collection: "records", data: { firstname: "Test", lastname: "Batch!" } });
            dynamicsWebApiTest.deleteRecord({ key: _data.testEntityId2, collection: "records", property: "firstname" });

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
        var rBody = _data.batchUpdateDelete;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = responses.batchUpdateDelete;
            scope = nock(webApiUrl, {
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
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.update({ key: _data.testEntityId2, collection: "records", data: { firstname: "Test", lastname: "Batch!" } });
            dynamicsWebApiTest.deleteRecord({ key: _data.testEntityId2, collection: "records", property: "firstname" });

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
        var rBody = _data.batchUpdateDelete;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = responses.batchError;
            scope = nock(webApiUrl)
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
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.update({ key: _data.testEntityId2, collection: "records", data: { firstname: "Test", lastname: "Batch!" } });
            dynamicsWebApiTest.deleteRecord({ key: _data.testEntityId2, collection: "records", property: "firstname" });

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
        var rBody = _data.batchCreateContentID;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = responses.batchUpdateDelete;
            scope = nock(webApiUrl)
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
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.create({ collection: "records", data: { firstname: "Test", lastname: "Batch!" }, contentId: "1" });
            dynamicsWebApiTest.create({ collection: "test_property", data: { firstname: "Test1", lastname: "Batch!" }, contentId: "$1" });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(2);

                    expect(object[0]).to.be.eq(_data.testEntityId);
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
        var rBody = _data.batchCreateContentIDURLReplace;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = responses.batchUpdateDelete;
            scope = nock(webApiUrl)
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
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.create({ collection: "records", data: { firstname: "Test", lastname: "Batch!" }, contentId: "1" });
            dynamicsWebApiTest.create({ collection: "$1", data: { firstname: "Test1", lastname: "Batch!" } });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(2);

                    expect(object[0]).to.be.eq(_data.testEntityId);
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
        var rBody = _data.batchCreateContentIDPayload;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = responses.batchUpdateDelete;
            scope = nock(webApiUrl)
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
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest.startBatch();

            dynamicsWebApiTest.create({ collection: "records", data: { firstname: "Test", lastname: "Batch!" }, contentId: "1" });
            dynamicsWebApiTest.create({ collection: "tests", data: { firstname: "Test1", lastname: "Batch!", "prop@odata.bind": "$1" } });

            dynamicsWebApiTest
                .executeBatch()
                .then(function (object) {
                    expect(object.length).to.be.eq(2);

                    expect(object[0]).to.be.eq(_data.testEntityId);
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
        var rBody = _data.batchUpsertUpsertUpsertWithAlternateKeys;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }
        before(function () {
            var response = responses.batchUpsertUpsertUpsertWithAlternateKeys;
            scope = nock(webApiUrl)
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
            cleanAll();
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
        var rBody = _data.batchRetrieveMultipleCreateRetrieveMultiple;
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }

        before(function () {
            var response = responses.batchRetrieveMultipleCreateRetrieveMultiple;
            var response2 = responses.createReturnId;
            scope = nock(webApiUrl);

            scope = nock(webApiUrl)
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
                .post(responses.collectionUrl, _data.testEntity)
                .reply(response2.status, response2.responseText, response2.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var isDone = 0;
            function doneCheck(object?: any) {
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

                    expect(object[0]).to.deep.equal(responses.multiple());
                    expect(object[1]).to.deep.equal(_data.testEntityId);
                    expect(object[2]).to.deep.equal(responses.multiple2());

                    doneCheck();
                })
                .catch(function (object) {
                    doneCheck(object);
                });

            dynamicsWebApiTest
                .create({ data: _data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntityId);
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
            key: _data.testEntityId,
            collection: "tests",
            fileName: "test.json",
            property: "dwa_file",
            data: Buffer.from("Welcome to DynamicsWebApi!", "utf-8"),
        };

        var scope;
        var scope1;
        var scope2;
        before(function () {
            var beginResponse = responses.uploadFileBeginResponse;
            var response1 = responses.uploadFile1stResponse;

            var locationUrl = beginResponse.responseHeaders.Location.replace(webApiUrl, "/");

            scope = nock(webApiUrl)
                .matchHeader("x-ms-transfer-mode", "chunked")
                .patch(responses.testEntityUrl + `/${dwaRequest.property}?x-ms-file-name=${dwaRequest.fileName}`)
                //@ts-ignore
                .reply(beginResponse.status, "", beginResponse.responseHeaders);

            scope1 = nock(webApiUrl)
                .matchHeader("Content-Range", `bytes 0-${beginResponse.responseHeaders["x-ms-chunk-size"] - 1}/${dwaRequest.data.length}`)
                .matchHeader("Content-Type", `application/octet-stream`)
                .patch(locationUrl, dwaRequest.data.slice(0, beginResponse.responseHeaders["x-ms-chunk-size"]))
                .reply(response1.status);

            scope2 = nock(webApiUrl)
                .matchHeader(
                    "Content-Range",
                    `bytes ${beginResponse.responseHeaders["x-ms-chunk-size"]}-${dwaRequest.data.length - 1}/${dwaRequest.data.length}`,
                )
                .matchHeader("Content-Type", `application/octet-stream`)
                .patch(locationUrl, dwaRequest.data.slice(beginResponse.responseHeaders["x-ms-chunk-size"], dwaRequest.data.length))
                .reply(response1.status);
        });

        after(function () {
            cleanAll();
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
            key: _data.testEntityId,
            collection: "tests",
            property: "dwa_file",
        };

        var scope;
        var scope1;

        var chunk1 = responses.downloadFileResponseChunk1;
        var chunk2 = responses.downloadFileResponseChunk2;
        before(function () {
            scope = nock(webApiUrl)
                .matchHeader("Range", `bytes=0-${Utility.downloadChunkSize - 1}`)
                .get(responses.testEntityUrl + `/${dwaRequest.property}?size=full`)
                //@ts-ignore
                .reply(chunk1.status, chunk1.responseText, chunk1.responseHeaders as nock.ReplyHeaders);

            scope1 = nock(webApiUrl)
                .matchHeader("Range", `bytes=${Utility.downloadChunkSize}-${Utility.downloadChunkSize * 2 - 1}`)
                .get(responses.testEntityUrl + `/${dwaRequest.property}?size=full`)
                //@ts-ignore
                .reply(chunk2.status, chunk2.responseText, chunk2.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .downloadFile(dwaRequest)
                .then(function (object) {
                    var text = object.data.toString();
                    expect(text).to.eq("Welcome to DynamicsWebApi!");
                    expect(object.fileName).to.eq(chunk2.responseHeaders["x-ms-file-name"]);
                    expect(object.fileSize).to.eq(chunk2.responseHeaders["x-ms-file-size"]);
                    //todo: location does not exist anymore?
                    // expect(object.location).to.eq(chunk2.responseHeaders["Location"]);

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
            const response = responses.xmlResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Accept: "application/xml",
                },
            })
                .get("/$metadata")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveCsdlMetadata()
                .then(function (object) {
                    expect(object).to.deep.equal(responses.xmlResponse.responseText);
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
            const response = responses.xmlResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Accept: "application/xml",
                    Prefer: DWA.Prefer.get(DWA.Prefer.Annotations.All),
                },
            })
                .get("/$metadata")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApiTest
                .retrieveCsdlMetadata({
                    addAnnotations: true,
                })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.xmlResponse.responseText);
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
            var response = responses.createReturnId;
            scope = nock(webApiUrl92).post("/tests", _data.testEntity).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("it makes a correct request and returns a correct response", function (done) {
            dynamicsWebApi92
                .create({ data: _data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.equal(_data.testEntityId);
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
        var dynamicsWebApi92 = new DynamicsWebApi({ impersonate: _data.testEntityId2 });
        var scope;
        before(function () {
            var response = responses.createReturnId;
            scope = nock(webApiUrl92, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId2,
                },
            })
                .post("/tests", _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("it makes a correct request and returns a correct response", function (done) {
            dynamicsWebApi92
                .create({ data: _data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.equal(_data.testEntityId);
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Authorization: "Bearer token001",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("sends the request to the right end point and returns a response", function (done) {
            const getToken = async function () {
                var adalCallback = async function (token) {
                    return token;
                };

                const token = await adalCallback({ accessToken: "token001" });

                return token;
            };

            var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, dataApi: { version: "8.2" } });
            dynamicsWebApiAuth
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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

    describe("authorization - token is empty", function () {
        var scope;
        before(function () {
            var response = responses.multipleResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Authorization: "Bearer token001",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("sends the request to the right end point and returns a response", async () => {
            const getToken = async function () {
                const adalCallback = async function (token) {
                    return token;
                };

                const token = await adalCallback(null);

                return token;
            };

            const dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, dataApi: { version: "8.2" } });

            try {
                const object = await dynamicsWebApiAuth.retrieveMultiple({ collection: "tests" });
                expect(object).to.be.undefined;
            } catch (error) {
                expect(error).to.deep.equal(new Error("Token is empty. Request is aborted."));
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.false;
        });
    });

    describe("authorization - plain token", function () {
        var scope;
        before(function () {
            var response = responses.multipleResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Authorization: "Bearer token001",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("sends the request to the right end point and returns a response", function (done) {
            const getToken = async function () {
                var adalCallback = async function (token) {
                    return token;
                };

                const token = await adalCallback("token001");

                return token;
            };

            var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, dataApi: { version: "8.2" } });
            dynamicsWebApiAuth
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Authorization: "Bearer token001",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);

            scope2 = nock(webApiUrl, {
                reqheaders: {
                    Authorization: "Bearer token002",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        var i = 0;
        const getToken = async function () {
            var adalCallback = async function (token) {
                return token;
            };

            const token = await adalCallback({ accessToken: "token00" + ++i });

            return token;
        };

        it("sends the request to the right end point and returns a response", function (done) {
            var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, dataApi: { version: "8.2" } });
            dynamicsWebApiAuth
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
                })
                .catch(function (object) {
                    expect(object).to.be.undefined;
                });

            dynamicsWebApiAuth
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Authorization: "Bearer overriden",
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        const getToken = spy(async function any() {
            return { accessToken: "token001" };
        });

        it("sends the request to the right end point and returns a response", function (done) {
            var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, dataApi: { version: "8.2" } });
            dynamicsWebApiAuth
                .retrieveMultiple({ collection: "tests", token: "overriden" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.response200;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: 'odata.include-annotations="some-annotations"',
                },
            })
                .get(responses.testEntityUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("it makes a correct request and returns a correct response", function (done) {
            dynamicsWebApi82
                .retrieve({ key: _data.testEntityId, collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"',
                },
            })
                .get("/" + responses.collection + "?$select=name")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
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
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.createReturnRepresentation;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: DWA.Prefer.ReturnRepresentation,
                },
            })
                .post(responses.collectionUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApi82
                .create({ data: _data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(_data.testEntity);
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
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl, {
                reqheaders: {
                    "If-Match": "*",
                },
            })
                .patch(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);

            scope2 = nock(webApiUrl, {
                reqheaders: {
                    Prefer: /.*/,
                    "If-Match": "*",
                },
            })
                .post(responses.testEntityUrl, _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            var dwaRequest = {
                key: _data.testEntityId,
                collection: "tests",
                data: _data.testEntity,
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: "odata.maxpagesize=10",
                },
            })
                .get(responses.collectionUrl)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("returns a correct response", function (done) {
            dynamicsWebApi82
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleWithLinkResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    Prefer: "odata.maxpagesize=100",
                },
            })
                .get(responses.collectionUrl)
                .query({ $select: "name" })
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
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
                    expect(object).to.deep.equal(responses.multipleWithLink());
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
        dynamicsWebApi81.setConfig({ dataApi: { version: "8.1" }, impersonate: _data.testEntityId2 });

        var scope;
        before(function () {
            var response = responses.createReturnId;
            scope = nock(webApiUrl81, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId2,
                },
            })
                .post("/tests", _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("it makes a correct request and returns a correct response", function (done) {
            dynamicsWebApi81
                .create({ data: _data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.equal(_data.testEntityId);
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl81, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId3,
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("sends the request to the right end point with a correct MSCRMCallerID header", function (done) {
            dynamicsWebApi81.setConfig({ dataApi: { version: "8.1" }, impersonate: _data.testEntityId2 });
            dynamicsWebApi81
                .retrieveMultiple({ collection: "tests", impersonate: _data.testEntityId3 })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
        dynamicsWebApi90.setConfig({ dataApi: { version: "9.0" }, impersonateAAD: _data.testEntityId2 });

        var scope;
        before(function () {
            var response = responses.createReturnId;
            scope = nock(webApiUrl90, {
                reqheaders: {
                    CallerObjectId: _data.testEntityId2,
                },
            })
                .post("/tests", _data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("it makes a correct request and returns a correct response", function (done) {
            dynamicsWebApi90
                .create({ data: _data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.equal(_data.testEntityId);
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl90, {
                reqheaders: {
                    CallerObjectId: _data.testEntityId3,
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("sends the request to the right end point with a correct CallerObjectId header", function (done) {
            dynamicsWebApi90.setConfig({ dataApi: { version: "9.0" }, impersonateAAD: _data.testEntityId2 });
            dynamicsWebApi90
                .retrieveMultiple({ collection: "tests", impersonateAAD: _data.testEntityId3 })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
        var dynamicsWebApi81 = new DynamicsWebApi({ dataApi: { version: "8.1" }, impersonate: _data.testEntityId2 });

        var scope;
        before(function () {
            var response = responses.multipleResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId2,
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("sends the request to the right end point and returns a response", function (done) {
            dynamicsWebApi81.setConfig({ dataApi: { version: "8.2" } });
            dynamicsWebApi81
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId2,
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("sends the request to the right end point and returns a response", function (done) {
            dynamicsWebApi82.setConfig({ impersonate: _data.testEntityId2 });
            dynamicsWebApi82
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId2,
                },
            })
                .get("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("sends the request to the right end point and returns a response", function (done) {
            dynamicsWebApi81.setConfig({ dataApi: { version: "8.2" }, impersonate: _data.testEntityId2 });
            dynamicsWebApi81
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
        dynamicsWebApi81.setConfig({ dataApi: { version: "8.1" }, impersonate: _data.testEntityId2 });

        var scope;
        before(function () {
            var response = responses.createReturnId;
            scope = nock(webApiUrl81, {
                reqheaders: {
                    MSCRMCallerID: _data.testEntityId2,
                },
            })
                .post("/tests")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("sends the request to the right end point", function (done) {
            var dynamicsWebApiCopy = dynamicsWebApi81.initializeInstance();
            dynamicsWebApiCopy
                .create({ data: _data.testEntity, collection: "tests" })
                .then(function (object) {
                    expect(object).to.equal(_data.testEntityId);
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
        dynamicsWebApi81.setConfig({ dataApi: { version: "8.1" }, impersonate: _data.testEntityId2 });

        var scope;
        before(function () {
            var response = responses.multipleResponse;
            scope = nock(webApiUrl).get(responses.collectionUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("sends the request to the right end point", function (done) {
            //@ts-ignore
            dynamicsWebApiCopy = dynamicsWebApi81.initializeInstance({ dataApi: { version: "8.2" } });
            //@ts-ignore
            dynamicsWebApiCopy
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl).get(responses.collectionUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("sends the request to the right end point", function (done) {
            dynamicsWebApiProxy
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl).get(responses.collectionUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("sends the request to the right end point", function (done) {
            dynamicsWebApiProxy
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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
            var response = responses.multipleResponse;
            scope = nock(webApiUrl).get(responses.collectionUrl).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
        });

        it("sends the request to the right end point", function (done) {
            dynamicsWebApiProxy
                .retrieveMultiple({ collection: "tests" })
                .then(function (object) {
                    expect(object).to.deep.equal(responses.multiple());
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

const expectThrowsAsync = async (method, errorMessage) => {
    let error = null;
    try {
        await method();
    } catch (err) {
        error = err;
    }
    expect(error).to.be.an("Error");
    if (errorMessage) {
        //@ts-ignore
        expect(error?.message).to.equal(errorMessage);
    }
};
