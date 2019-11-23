var chai = require('chai');
var expect = chai.expect;
var nock = require('nock');
var sinon = require('sinon');

var mocks = require("./stubs");
var DWA = require("../lib/dwa");
var DynamicsWebApi = require("../lib/dynamics-web-api");

var dynamicsWebApiTest = new DynamicsWebApi({ webApiVersion: "8.2" });

describe("promises -", function () {
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
                dynamicsWebApiTest.create(mocks.data.testEntity, "tests")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntityId);
                        done();
                    }).catch(function (object) {
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
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .post(mocks.responses.collectionUrl, mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest
                    .create(mocks.data.testEntity, "tests", DWA.Prefer.ReturnRepresentation)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .post(mocks.responses.collectionUrl + "?$select=name", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest
                    .create(mocks.data.testEntity, "tests", DWA.Prefer.ReturnRepresentation, ['name'])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                        "If-Match": "*"
                    }
                })
                    .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.update(mocks.data.testEntityId, "tests", mocks.data.testEntity)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);

            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.update(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
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
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
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
                    .update(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest
                    .update(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
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
                        value: mocks.data.updatedEntity.fullname
                    })
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateSingleProperty(mocks.data.testEntityId, "tests", mocks.data.updatedEntity)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .put(mocks.responses.testEntityUrl + "/fullname", {
                        value: mocks.data.updatedEntity.fullname
                    })
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateSingleProperty(mocks.data.testEntityId, "tests", mocks.data.updatedEntity, DWA.Prefer.ReturnRepresentation)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
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
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .put(mocks.responses.testEntityUrl + "/fullname?$select=name", {
                        value: mocks.data.updatedEntity.fullname
                    })
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateSingleProperty(mocks.data.testEntityId, "tests", mocks.data.updatedEntity, DWA.Prefer.ReturnRepresentation, ['name'])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                dynamicsWebApiTest.upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntityId);
                        done();
                    }).catch(function (object) {
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
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .patch(mocks.responses.testEntityUrl, mocks.data.testEntityUrl)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
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
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
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
                    .upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest
                    .upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
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
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
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
                    .upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest
                    .upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.deleteRecord -", function () {

        describe("basic", function () {
            var scope;
            before(function () {
                var response = mocks.responses.basicEmptyResponseSuccess;
                scope = nock(mocks.webApiUrl)
                    .delete(mocks.responses.testEntityUrl)
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.deleteRecord(mocks.data.testEntityId, "tests")
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.deleteRecord(mocks.data.testEntityId, "tests", "fullname")
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                scope = nock(mocks.webApiUrl)
                    .get(mocks.responses.testEntityUrl)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieve("alternateKey='keyValue'", "tests")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["fullname"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["fullname", "subject"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[/reference, fullname] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference", "fullname"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[/reference, fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference", "fullname", "subject"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["reference/$ref"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.referenceResponseConverted);
                        done();
                    }).catch(function (object) {
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
                    .get(mocks.responses.testEntityUrl + "?$expand=reference(something)")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", null, "reference(something)")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                    .get(mocks.responses.testEntityUrl + "?$select=fullname&$expand=reference(something)")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get(mocks.responses.testEntityUrl + "?$select=fullname,subject&$expand=reference(something)")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("[fullname] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["fullname"], "reference(something)")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[fullname,subject] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["fullname", "subject"], "reference(something)")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                    .get(mocks.responses.testEntityUrl + "/reference?$expand=reference(something)")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get(mocks.responses.testEntityUrl + "/reference?$select=fullname&$expand=reference(something)")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get(mocks.responses.testEntityUrl + "/reference?$select=fullname,subject&$expand=reference(something)")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("[/reference] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference"], "reference(something)")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[/reference, fullname] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference", "fullname"], "reference(something)")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[/reference, fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference", "fullname", "subject"], "reference(something)")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.count("tests")
                    .then(function (object) {
                        expect(object).to.deep.equal(parseInt(mocks.responses.countBasic.responseText));
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.count("tests", "name eq 'name'")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.multipleWithCount["@odata.count"]);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.countAll("tests", "name eq 'name'")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.multipleWithCount["@odata.count"]);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.executeFetchXml -", function () {

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
                dynamicsWebApiTest.executeFetchXml("tests", mocks.data.fetchXmls.fetchXml)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage1Cookie);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.executeFetchXml("tests", mocks.data.fetchXmls.fetchXml, null, pagingInfo.nextPage, pagingInfo.cookie)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage2Cookie);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.executeFetchXml("tests", mocks.data.fetchXmls.fetchXml)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage1);
                        done();
                    }).catch(function (object) {
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
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
                })
                    .get(mocks.responses.collectionUrl + "?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXml2cookie))
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                var pagingInfo = mocks.data.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo;
                dynamicsWebApiTest.executeFetchXml("tests", mocks.data.fetchXmls.fetchXml, DWA.Prefer.Annotations.FormattedValue, pagingInfo.nextPage, pagingInfo.cookie)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage2Cookie);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.executeFetchXmlAll -", function () {

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
                dynamicsWebApiTest.fetchAll("tests", mocks.data.fetchXmls.fetchXml)
                    .then(function (object) {
                        var checkResponse = mocks.data.fetchXmls.fetchXmlResultPage1Cookie.value;
                        checkResponse = checkResponse.concat(mocks.data.fetchXmls.fetchXmlResultPage2Cookie.value);
                        expect(object).to.deep.equal({ value: checkResponse });
                        done();
                    }).catch(function (object) {
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
                        "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")"
                    })
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.associate("tests", mocks.data.testEntityId, "tests_records", "records", mocks.data.testEntityId2)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                    .get('/EntityDefinitions?$select=EntitySetName,LogicalName')
                    .once()
                    .reply(response2.status, response2.responseText, response2.responseHeaders)
                    .post("/tests(" + mocks.data.testEntityId + ")/tests_records/$ref", {
                        "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")"
                    })
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                var dynamicsWebApiE = dynamicsWebApiTest.initializeInstance({ webApiVersion: "8.2", useEntityNames: true });
                dynamicsWebApiE.associate("test", mocks.data.testEntityId, "tests_records", "record", mocks.data.testEntityId2)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        var colName = dynamicsWebApiE.utility.getCollectionName('test');
                        expect(colName).to.be.eq('tests');
                        done();
                    }).catch(function (object) {
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
                        MSCRMCallerID: mocks.data.testEntityId3
                    }
                })
                    .post(mocks.responses.testEntityUrl + "/tests_records/$ref", {
                        "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")"
                    })
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.associate("tests", mocks.data.testEntityId, "tests_records", "records", mocks.data.testEntityId2, mocks.data.testEntityId3)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                dynamicsWebApiTest.disassociate("tests", mocks.data.testEntityId, "tests_records", mocks.data.testEntityId2)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                        MSCRMCallerID: mocks.data.testEntityId3
                    }
                })
                    .delete(mocks.responses.testEntityUrl + "/tests_records(" + mocks.data.testEntityId2 + ")/$ref")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.disassociate("tests", mocks.data.testEntityId, "tests_records", mocks.data.testEntityId2, mocks.data.testEntityId3)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                        "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")"
                    })
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.associateSingleValued("tests", mocks.data.testEntityId, "tests_records", "records", mocks.data.testEntityId2)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                        MSCRMCallerID: mocks.data.testEntityId3
                    }
                })
                    .put(mocks.responses.testEntityUrl + "/tests_records/$ref", {
                        "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")"
                    })
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.associateSingleValued("tests", mocks.data.testEntityId, "tests_records", "records", mocks.data.testEntityId2, mocks.data.testEntityId3)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                dynamicsWebApiTest.disassociateSingleValued("tests", mocks.data.testEntityId, "tests_records")
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                        MSCRMCallerID: mocks.data.testEntityId3
                    }
                })
                    .delete(mocks.responses.testEntityUrl + "/tests_records/$ref")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.disassociateSingleValued("tests", mocks.data.testEntityId, "tests_records", mocks.data.testEntityId3)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.executeFunction -", function () {

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
                dynamicsWebApiTest.executeUnboundFunction("FUN")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(with parameters) returns a correct response", function (done) {
                dynamicsWebApiTest.executeUnboundFunction("FUN", { param1: "value1", param2: 2 })
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                        MSCRMCallerID: mocks.data.testEntityId
                    }
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
                dynamicsWebApiTest.executeUnboundFunction("FUN", null, mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(with parameters) returns a correct response", function (done) {
                dynamicsWebApiTest.executeUnboundFunction("FUN", { param1: "value1", param2: 2 }, mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.executeBoundFunction(mocks.data.testEntityId, "tests", "FUN")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(with parameters) returns a correct response", function (done) {
                dynamicsWebApiTest.executeBoundFunction(mocks.data.testEntityId, "tests", "FUN", { param1: "value1", param2: 2 })
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                        MSCRMCallerID: mocks.data.testEntityId
                    }
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
                dynamicsWebApiTest.executeBoundFunction(mocks.data.testEntityId, "tests", "FUN", null, mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(with parameters) returns a correct response", function (done) {
                dynamicsWebApiTest.executeBoundFunction(mocks.data.testEntityId, "tests", "FUN", { param1: "value1", param2: 2 }, mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.executeAction -", function () {

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
                dynamicsWebApiTest.executeUnboundAction("FUN", mocks.responses.actionRequest)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                        MSCRMCallerID: mocks.data.testEntityId2
                    }
                })
                    .post("/FUN", mocks.responses.actionRequestModified)
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.executeUnboundAction("FUN", mocks.responses.actionRequest, mocks.data.testEntityId2)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                dynamicsWebApiTest.executeBoundAction(mocks.data.testEntityId, "tests", "FUN", mocks.responses.actionRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                        MSCRMCallerID: mocks.data.testEntityId2
                    }
                })
                    .post(mocks.responses.testEntityUrl + "/FUN", mocks.responses.actionRequestModified)
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.executeBoundAction(mocks.data.testEntityId, "tests", "FUN", mocks.responses.actionRequest, mocks.data.testEntityId2)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.updateRequest -", function () {
        describe("basic", function () {
            var scope;
            before(function () {
                var response = mocks.responses.basicEmptyResponseSuccess;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        'If-Match': '*'
                    }
                })
                    .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    entity: mocks.data.testEntity
                };

                dynamicsWebApiTest.updateRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                        'If-Match': '*',
                        'Prefer': DWA.Prefer.ReturnRepresentation
                    }
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
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    entity: mocks.data.testEntity,
                    returnRepresentation: true
                };

                dynamicsWebApiTest.updateRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[fullname, subject] returns a correct response", function (done) {
                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    entity: mocks.data.testEntity,
                    returnRepresentation: true,
                    select: ["fullname", "subject"]
                };

                dynamicsWebApiTest.updateRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
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
                        'If-Match': 'match'
                    }
                })
                    .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    entity: mocks.data.testEntity,
                    ifmatch: "match"
                };

                dynamicsWebApiTest
                    .updateRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.equal(true);
                        done();
                    }).catch(function (object) {
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
                        'If-Match': 'match'
                    }
                })
                    .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    entity: mocks.data.testEntity,
                    ifmatch: "match"
                };

                dynamicsWebApiTest
                    .updateRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.equal(false);
                        done();
                    }).catch(function (object) {
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
                        'If-Match': 'match'
                    }
                })
                    .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("catches the error", function (done) {
                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    entity: mocks.data.testEntity,
                    ifmatch: "match"
                };

                dynamicsWebApiTest
                    .updateRequest(dwaRequest)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
                        expect(object.status).to.equal(404);
                        done();
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.upsertRequest -", function () {

        describe("(update) basic", function () {
            var dwaRequest = {
                id: mocks.data.testEntityId,
                collection: "tests",
                entity: mocks.data.testEntity
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
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(create) returns a correct response", function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntityId);
                        done();
                    }).catch(function (object) {
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
                        Prefer: DWA.Prefer.ReturnRepresentation
                    }
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
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    entity: mocks.data.testEntity,
                    returnRepresentation: true
                };

                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(create) returns a correct response", function (done) {
                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    entity: mocks.data.testEntity,
                    returnRepresentation: true,
                    select: ["name"]
                };

                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("If-Match: '*' (Prevent Create)", function () {
            var dwaRequest = {
                id: mocks.data.testEntityId,
                collection: "tests",
                entity: mocks.data.testEntity,
                returnRepresentation: true,
                ifmatch: '*'
            };
            var scope;
            before(function () {
                var response = mocks.responses.upsertPreventCreateResponse;
                var response2 = mocks.responses.createReturnRepresentation;
                var response3 = mocks.responses.upsertPreventUpdateResponse;

                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        Prefer: DWA.Prefer.ReturnRepresentation,
                        'If-Match': '*'
                    }
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
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(create succeeded) returns a correct response", function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(request failed) catches the error", function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                id: mocks.data.testEntityId,
                collection: "tests",
                entity: mocks.data.testEntity,
                returnRepresentation: true,
                ifnonematch: '*'
            }
            var scope;
            before(function () {
                var response = mocks.responses.upsertPreventUpdateResponse;
                var response2 = mocks.responses.updateReturnRepresentation;
                var response3 = mocks.responses.upsertPreventCreateResponse;

                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        Prefer: DWA.Prefer.ReturnRepresentation,
                        'If-None-Match': '*'
                    }
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
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(update succeeded) returns a correct response", function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(request failed) catches the error", function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
                        expect(object.status).to.equal(mocks.responses.upsertPreventCreateResponse.status);
                        done();
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.retrieveRequest -", function () {

        describe("basic", function () {
            var scope;
            before(function () {
                var response = mocks.responses.response200;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        'If-Match': 'match',
                        'MSCRMCallerID': mocks.data.testEntityId2
                    }
                })
                    .get(mocks.responses.testEntityUrl + "?$expand=prop")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    expand: [{ property: "prop" }],
                    impersonate: mocks.data.testEntityId2,
                    ifmatch: "match"
                };

                dynamicsWebApiTest.retrieveRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("basic - expand filter", function () {
            var scope;
            before(function () {
                var response = mocks.responses.response200;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        'If-Match': 'match',
                        'MSCRMCallerID': mocks.data.testEntityId2
                    }
                })
                    .get(mocks.responses.testEntityUrl + "?$expand=prop($filter=" + encodeURI("field eq ") + '%27value%27)')
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    expand: [{ property: "prop", filter: "field eq 'value'" }],
                    impersonate: mocks.data.testEntityId2,
                    ifmatch: "match"
                };

                dynamicsWebApiTest.retrieveRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("retrieve reference", function () {
            var scope;
            before(function () {
                var response = mocks.responses.retrieveReferenceResponse;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        'If-Match': 'match',
                        'MSCRMCallerID': mocks.data.testEntityId2
                    }
                })
                    .get(mocks.responses.testEntityUrl + "/ownerid/$ref")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    select: ["ownerid/$ref"],
                    impersonate: mocks.data.testEntityId2,
                    ifmatch: "match"
                };

                dynamicsWebApiTest.retrieveRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.referenceResponseConverted);
                        done();
                    }).catch(function (object) {
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
                scope = nock(mocks.webApiUrl)
                    .get(mocks.responses.collectionUrl)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveMultiple("tests")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveMultiple("tests", ["fullname"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveMultiple("tests", ["fullname", "subject"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveMultiple("tests", null, "name eq 'name'")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(+select) returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveMultiple("tests", ["fullname"], "name eq 'name'")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("returns next page link", function () {
            var scope;
            before(function () {
                var response = mocks.responses.multipleWithLinkResponse;
                scope = nock(mocks.webApiUrl)
                    .get(mocks.responses.collectionUrl)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveMultiple("tests")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multipleWithLink());
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("goes by next page link", function () {
            var scope;
            before(function () {
                var response = mocks.responses.multipleResponse;

                var linkQuery = mocks.responses.multipleWithLink().oDataNextLink.split('?');
                var link = linkQuery[0].split('/');
                var getLink = `/${link.pop()}?${linkQuery[1]}`;
                link = link.join('/');

                scope = nock(link)
                    .get(getLink)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveMultiple(null, null, null, mocks.responses.multipleWithLink().oDataNextLink)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.retrieveAll -", function () {

        describe("multiple pages", function () {
            var scope;
            var scope2;
            before(function () {
                var response = mocks.responses.multipleWithLinkResponse;
                var response2 = mocks.responses.multipleResponse;
                var linkQuery = mocks.responses.multipleWithLink().oDataNextLink.split('?');
                var link = linkQuery[0].split('/');
                var getLink = `/${link.pop()}?${linkQuery[1]}`;

                scope = nock(mocks.webApiUrl)
                    .get(mocks.responses.collectionUrl + "?$select=name")
                    .reply(response.status, response.responseText, response.responseHeaders);
                scope2 = nock(link.join('/'))
                    .get(getLink)
                    .reply(response2.status, response2.responseText, response2.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveAll("tests", ["name"])
                    .then(function (object) {
                        var multipleResponse = mocks.responses.multiple();
                        var checkResponse = { value: multipleResponse.value.concat(multipleResponse.value) };
                        expect(object).to.deep.equal(checkResponse);
                        done();
                    }).catch(function (object) {
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
                var linkQuery = mocks.responses.multipleWithLink().oDataNextLink.split('?');
                var link = linkQuery[0].split('/');
                var getLink = `/${link.pop()}?${linkQuery[1]}`;

                scope = nock(mocks.webApiUrl)
                    .get(mocks.responses.collectionUrl + "?$select=name")
                    .reply(response.status, response.responseText, response.responseHeaders);
                scope2 = nock(link.join('/'))
                    .get(getLink)
                    .reply(response2.status, response2.responseText, response2.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveAll("tests", ["name"])
                    .then(function (object) {
                        var multipleResponse = mocks.responses.multiple();
                        var checkResponse = { value: multipleResponse.value.concat(multipleResponse.value) };
                        checkResponse["@odata.deltaLink"] = mocks.responses.multipleWithDeltaLink()["@odata.deltaLink"];
                        checkResponse.oDataDeltaLink = mocks.responses.multipleWithDeltaLink()["@odata.deltaLink"];

                        expect(object).to.deep.equal(checkResponse);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
                expect(scope2.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.retrieveMultipleRequest -", function () {

        describe("basic", function () {
            var scope;
            before(function () {
                var response = mocks.responses.multipleResponse;
                var response2 = mocks.responses.multipleWithCountResponse;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
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
                    includeAnnotations: DWA.Prefer.Annotations.FormattedValue
                };

                dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(+count) returns a correct response", function (done) {
                var dwaRequest = {
                    collection: "tests",
                    select: ["name"],
                    includeAnnotations: DWA.Prefer.Annotations.FormattedValue,
                    count: true
                };

                dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multipleWithCount());
                        done();
                    }).catch(function (object) {
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
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
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
                    includeAnnotations: DWA.Prefer.Annotations.FormattedValue
                };

                dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multipleWithLink());
                        done();
                    }).catch(function (object) {
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
                var linkQuery = mocks.responses.multipleWithLink().oDataNextLink.split('?');
                var link = linkQuery[0].split('/');
                var getLink = `/${link.pop()}?${linkQuery[1]}`;
                scope = nock(link.join('/'), {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
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
                    includeAnnotations: DWA.Prefer.Annotations.FormattedValue
                };

                dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest, mocks.responses.multipleWithLink().oDataNextLink)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
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
                        Prefer: 'odata.track-changes'
                    }
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
                    trackChanges: true
                };

                dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multipleWithDeltaLink());
                        done();
                    }).catch(function (object) {
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
                var linkQuery = mocks.responses.multipleWithDeltaLink().oDataDeltaLink.split('?');
                var link = linkQuery[0].split('/');
                var getLink = `/${link.pop()}?${linkQuery[1]}`;
                scope = nock(link.join('/'), {
                    reqheaders: {
                        Prefer: 'odata.track-changes'
                    }
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
                    trackChanges: true
                };

                dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest, mocks.responses.multipleWithDeltaLink().oDataDeltaLink)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.retrieveAllRequest -", function () {

        describe("single page", function () {
            var scope;
            before(function () {
                var response = mocks.responses.multipleResponse;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
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
                    includeAnnotations: DWA.Prefer.Annotations.FormattedValue
                };

                dynamicsWebApiTest.retrieveAllRequest(dwaRequest)
                    .then(function (object) {
                        var checkResponse = { value: mocks.responses.multiple().value };
                        expect(object).to.deep.equal(checkResponse);
                        done();
                    }).catch(function (object) {
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
                var linkQuery = mocks.responses.multipleWithLink().oDataNextLink.split('?');
                var link = linkQuery[0].split('/');
                var getLink = `/${link.pop()}?${linkQuery[1]}`;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
                })
                    .get(mocks.responses.collectionUrl + "?$select=name")
                    .reply(response.status, response.responseText, response.responseHeaders);
                scope2 = nock(link.join('/'), {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
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
                    includeAnnotations: DWA.Prefer.Annotations.FormattedValue
                };

                dynamicsWebApiTest.retrieveAllRequest(dwaRequest)
                    .then(function (object) {
                        var multipleResponse = mocks.responses.multiple();
                        var checkResponse = { value: multipleResponse.value.concat(multipleResponse.value) };
                        expect(object).to.deep.equal(checkResponse);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
                expect(scope2.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.deleteRequest -", function () {

        describe("basic", function () {
            var scope;
            before(function () {
                var response = mocks.responses.basicEmptyResponseSuccess;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        MSCRMCallerID: mocks.data.testEntityId2
                    }
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
                    id: mocks.data.testEntityId,
                    impersonate: mocks.data.testEntityId2
                };

                dynamicsWebApiTest.deleteRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.equal(true);
                        done();
                    }).catch(function (object) {
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
                        MSCRMCallerID: mocks.data.testEntityId2
                    }
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
                    id: mocks.data.testEntityId,
                    impersonate: mocks.data.testEntityId2,
                    ifmatch: "match"
                };

                dynamicsWebApiTest.deleteRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(pre-condition failed) returns a correct response", function (done) {
                var dwaRequest = {
                    collection: "tests",
                    id: mocks.data.testEntityId,
                    impersonate: mocks.data.testEntityId2,
                    ifmatch: "match"
                };

                dynamicsWebApiTest.deleteRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.be.false;
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("(request failed) returns a correct response", function (done) {
                var dwaRequest = {
                    collection: "tests",
                    id: mocks.data.testEntityId,
                    impersonate: mocks.data.testEntityId2,
                    ifmatch: "match"
                };

                dynamicsWebApiTest.deleteRequest(dwaRequest)
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
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
                dynamicsWebApiTest.createEntity(mocks.data.testEntity)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntityId);
                        done();
                    }).catch(function (object) {
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
                        "If-Match": "*"
                    }
                })
                    .put(mocks.responses.entityDefinitionsIdUrl, mocks.data.testEntityDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateEntity(mocks.data.testEntityDefinition)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                        "MSCRM.MergeLabels": "true"
                    }
                })
                    .put(mocks.responses.entityDefinitionsIdUrl, mocks.data.testEntityDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateEntity(mocks.data.testEntityDefinition, true)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                scope = nock(mocks.webApiUrl)
                    .get(mocks.responses.entityDefinitionsIdUrl)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveEntity(mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveEntity("alternateKey='keyValue'")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveEntity(mocks.data.testEntityId, ["LogicalName"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[LogicalName, SchemaName] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveEntity(mocks.data.testEntityId, ["LogicalName", "SchemaName"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                scope = nock(mocks.webApiUrl)
                    .get(mocks.responses.entityDefinitionsUrl)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveEntities()
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                        done();
                    }).catch(function (object) {
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
                    .post(mocks.responses.entityDefinitionsIdUrl + '/Attributes', mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.createAttribute(mocks.data.testEntityId, mocks.data.testEntity)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntityId2);
                        done();
                    }).catch(function (object) {
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
                        "If-Match": "*"
                    }
                })
                    .put(mocks.responses.entityDefinitionsIdUrl + '/Attributes(' + mocks.data.testEntityId2 + ')', mocks.data.testAttributeDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateAttribute(mocks.data.testEntityId, mocks.data.testAttributeDefinition)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                        "MSCRM.MergeLabels": "true"
                    }
                })
                    .put(mocks.responses.entityDefinitionsIdUrl + '/Attributes(' + mocks.data.testEntityId2 + ')', mocks.data.testAttributeDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateAttribute(mocks.data.testEntityId, mocks.data.testAttributeDefinition, null, true)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                        "If-Match": "*"
                    }
                })
                    .put(mocks.responses.entityDefinitionsIdUrl + '/Attributes(' + mocks.data.testEntityId2 + ')/AttributeType', mocks.data.testAttributeDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateAttribute(mocks.data.testEntityId, mocks.data.testAttributeDefinition, 'AttributeType')
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                        "MSCRM.MergeLabels": "true"
                    }
                })
                    .put(mocks.responses.entityDefinitionsIdUrl + '/Attributes(' + mocks.data.testEntityId2 + ')/AttributeType', mocks.data.testAttributeDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateAttribute(mocks.data.testEntityId, mocks.data.testAttributeDefinition, 'AttributeType', true)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                    .get(mocks.responses.entityDefinitionsIdUrl + '/Attributes')
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveAttributes(mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                        done();
                    }).catch(function (object) {
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
                    .get(mocks.responses.entityDefinitionsIdUrl + '/Attributes/AttributeType')
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveAttributes(mocks.data.testEntityId, 'AttributeType')
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                        done();
                    }).catch(function (object) {
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
                    .get(mocks.responses.entityDefinitionsIdUrl + '/Attributes(' + mocks.data.testEntityId2 + ')')
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveAttribute(mocks.data.testEntityId, mocks.data.testEntityId2)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveAttribute("SchemaName='Test'", "LogicalName='Test2'")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                    .get(mocks.responses.entityDefinitionsIdUrl + '/Attributes(' + mocks.data.testEntityId2 + ')/AttributeType')
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveAttribute(mocks.data.testEntityId, mocks.data.testEntityId2, 'AttributeType')
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                        "If-Match": "*"
                    }
                })
                    .put(mocks.responses.entityDefinitionsIdUrl + '/Attributes(' + mocks.data.testEntityId2 + ')', mocks.data.testAttributeDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateAttribute(mocks.data.testEntityId, mocks.data.testAttributeDefinition)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                        "MSCRM.MergeLabels": "true"
                    }
                })
                    .put(mocks.responses.entityDefinitionsIdUrl + '/Attributes(' + mocks.data.testEntityId2 + ')', mocks.data.testAttributeDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateAttribute(mocks.data.testEntityId, mocks.data.testAttributeDefinition, null, true)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                        "If-Match": "*"
                    }
                })
                    .put(mocks.responses.entityDefinitionsIdUrl + '/Attributes(' + mocks.data.testEntityId2 + ')/AttributeType', mocks.data.testAttributeDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateAttribute(mocks.data.testEntityId, mocks.data.testAttributeDefinition, 'AttributeType')
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                        "MSCRM.MergeLabels": "true"
                    }
                })
                    .put(mocks.responses.entityDefinitionsIdUrl + '/Attributes(' + mocks.data.testEntityId2 + ')/AttributeType', mocks.data.testAttributeDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateAttribute(mocks.data.testEntityId, mocks.data.testAttributeDefinition, 'AttributeType', true)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                    .get(mocks.responses.entityDefinitionsIdUrl + '/Attributes')
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveAttributes(mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                        done();
                    }).catch(function (object) {
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
                    .get(mocks.responses.entityDefinitionsIdUrl + '/Attributes/AttributeType')
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveAttributes(mocks.data.testEntityId, 'AttributeType')
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                        done();
                    }).catch(function (object) {
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
                    .get(mocks.responses.entityDefinitionsIdUrl + '/Attributes(' + mocks.data.testEntityId2 + ')')
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveAttribute(mocks.data.testEntityId, mocks.data.testEntityId2)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveAttribute("SchemaName='Test'", "LogicalName='Test2'")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                    .get(mocks.responses.entityDefinitionsIdUrl + '/Attributes(' + mocks.data.testEntityId2 + ')/AttributeType')
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveAttribute(mocks.data.testEntityId, mocks.data.testEntityId2, 'AttributeType')
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.createRelationship(mocks.data.testEntity)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntityId);
                        done();
                    }).catch(function (object) {
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
                        "If-Match": "*"
                    }
                })
                    .put(mocks.responses.relationshipDefinitionsIdUrl, mocks.data.testEntityDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateRelationship(mocks.data.testEntityDefinition)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                        "If-Match": "*"
                    }
                })
                    .put(mocks.responses.relationshipDefinitionsIdUrl + "/testcast", mocks.data.testEntityDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateRelationship(mocks.data.testEntityDefinition, "testcast")
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                        "MSCRM.MergeLabels": "true"
                    }
                })
                    .put(mocks.responses.relationshipDefinitionsIdUrl, mocks.data.testEntityDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateRelationship(mocks.data.testEntityDefinition, null, true)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.deleteRelationship(mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveRelationship(mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveRelationship(mocks.data.testEntityId, null, ["LogicalName"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[LogicalName, SchemaName] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveRelationship(mocks.data.testEntityId, null, ["LogicalName", "SchemaName"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveRelationship(mocks.data.testEntityId, "testcast", ["LogicalName"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[LogicalName, SchemaName] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveRelationship(mocks.data.testEntityId, "testcast", ["LogicalName", "SchemaName"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveRelationships()
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveRelationships("testcast", ["LogicalName"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[LogicalName, SchemaName] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveRelationships("testcast", ["LogicalName", "SchemaName"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.createGlobalOptionSet(mocks.data.testEntity)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntityId);
                        done();
                    }).catch(function (object) {
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
                        "If-Match": "*"
                    }
                })
                    .put(mocks.responses.globalOptionSetDefinitionsIdUrl, mocks.data.testEntityDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateGlobalOptionSet(mocks.data.testEntityDefinition)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                        "MSCRM.MergeLabels": "true"
                    }
                })
                    .put(mocks.responses.globalOptionSetDefinitionsIdUrl, mocks.data.testEntityDefinition)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.updateGlobalOptionSet(mocks.data.testEntityDefinition, true)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.deleteGlobalOptionSet(mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveGlobalOptionSet(mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveGlobalOptionSet(mocks.data.testEntityId, null, ["LogicalName"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[LogicalName, SchemaName] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveGlobalOptionSet(mocks.data.testEntityId, null, ["LogicalName", "SchemaName"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveGlobalOptionSets()
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                        done();
                    }).catch(function (object) {
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
                dynamicsWebApiTest.retrieveGlobalOptionSets('casttype', ["LogicalName"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("[LogicalName, SchemaName] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveGlobalOptionSets('casttype', ["LogicalName", "SchemaName"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.entityDefinitionList);
                        done();
                    }).catch(function (object) {
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
            var rBodys = rBody.split('\n');
            var checkBody = '';
            for (var i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }
            before(function () {
                var response = mocks.responses.batchRetrieveMultipleCreateRetrieveMultiple;
                scope = nock(mocks.webApiUrl + '$batch')
                    .filteringRequestBody(function (body) {
                        body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'dwa_batch_XXX');
                        body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'changeset_XXX');
                        var bodys = body.split('\n');

                        var resultBody = '';
                        for (var i = 0; i < bodys.length; i++) {
                            resultBody += bodys[i];
                        }
                        return resultBody;
                    })
                    .post("", checkBody)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.retrieveMultiple('tests');
                dynamicsWebApiTest.create({ firstname: "Test", lastname: "Batch!" }, 'records');
                dynamicsWebApiTest.retrieveMultiple('morerecords');

                dynamicsWebApiTest.executeBatch()
                    .then(function (object) {
                        expect(object.length).to.be.eq(3);

                        expect(object[0]).to.deep.equal(mocks.responses.multiple());
                        expect(object[1]).to.deep.equal(mocks.data.testEntityId);
                        expect(object[2]).to.deep.equal(mocks.responses.multiple2());

                        done();
                    }).catch(function (object) {
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
            var rBodys = rBody.split('\n');
            var checkBody = '';
            for (var i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }
            before(function () {
                var response = mocks.responses.batchRetrieveMultipleUpdateRetrieveMultiple;
                scope = nock(mocks.webApiUrl + '$batch')
                    .filteringRequestBody(function (body) {
                        body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'dwa_batch_XXX');
                        body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'changeset_XXX');
                        var bodys = body.split('\n');

                        var resultBody = '';
                        for (var i = 0; i < bodys.length; i++) {
                            resultBody += bodys[i];
                        }
                        return resultBody;
                    })
                    .post("", checkBody)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.retrieveMultiple('tests');
                dynamicsWebApiTest.update(mocks.data.testEntityId2, 'records', { firstname: "Test", lastname: "Batch!" });
                dynamicsWebApiTest.retrieveMultiple('morerecords');

                dynamicsWebApiTest.executeBatch()
                    .then(function (object) {
                        expect(object.length).to.be.eq(3);

                        expect(object[0]).to.deep.equal(mocks.responses.multiple());
                        expect(object[1]).to.be.true;
                        expect(object[2]).to.deep.equal(mocks.responses.multiple2());

                        done();
                    }).catch(function (object) {
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
            var rBodys = rBody.split('\n');
            var checkBody = '';
            for (var i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }
            before(function () {
                var response = mocks.responses.batchRetrieveMultipleDeleteRetrieveMultiple;
                scope = nock(mocks.webApiUrl + '$batch')
                    .filteringRequestBody(function (body) {
                        body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'dwa_batch_XXX');
                        body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'changeset_XXX');
                        var bodys = body.split('\n');

                        var resultBody = '';
                        for (var i = 0; i < bodys.length; i++) {
                            resultBody += bodys[i];
                        }
                        return resultBody;
                    })
                    .post("", checkBody)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.retrieveMultiple('tests');
                dynamicsWebApiTest.deleteRecord(mocks.data.testEntityId2, 'records');
                dynamicsWebApiTest.retrieveMultiple('morerecords');

                dynamicsWebApiTest.executeBatch()
                    .then(function (object) {
                        expect(object.length).to.be.eq(3);

                        expect(object[0]).to.deep.equal(mocks.responses.multiple());
                        expect(object[1]).to.be.undefined;
                        expect(object[2]).to.deep.equal(mocks.responses.multiple2());

                        done();
                    }).catch(function (object) {
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
            var rBodys = rBody.split('\n');
            var checkBody = '';
            for (var i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }
            before(function () {
                var response = mocks.responses.batchRetrieveMultipleCountRetrieveMultiple;
                scope = nock(mocks.webApiUrl + '$batch')
                    .filteringRequestBody(function (body) {
                        body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'dwa_batch_XXX');
                        body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'changeset_XXX');
                        var bodys = body.split('\n');

                        var resultBody = '';
                        for (var i = 0; i < bodys.length; i++) {
                            resultBody += bodys[i];
                        }
                        return resultBody;
                    })
                    .post("", checkBody)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.retrieveMultiple('tests');
                dynamicsWebApiTest.count('records');
                dynamicsWebApiTest.retrieveMultiple('morerecords');

                dynamicsWebApiTest.executeBatch()
                    .then(function (object) {
                        expect(object.length).to.be.eq(3);

                        expect(object[0]).to.deep.equal(mocks.responses.multiple());
                        expect(object[1]).to.be.eq(5);
                        expect(object[2]).to.deep.equal(mocks.responses.multiple2());

                        done();
                    }).catch(function (object) {
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
            var rBodys = rBody.split('\n');
            var checkBody = '';
            for (var i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }
            before(function () {
                var response = mocks.responses.batchRetrieveMultipleCountFilteredRetrieveMultiple;
                scope = nock(mocks.webApiUrl + '$batch')
                    .filteringRequestBody(function (body) {
                        body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'dwa_batch_XXX');
                        body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'changeset_XXX');
                        var bodys = body.split('\n');

                        var resultBody = '';
                        for (var i = 0; i < bodys.length; i++) {
                            resultBody += bodys[i];
                        }
                        return resultBody;
                    })
                    .post("", checkBody)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.retrieveMultiple('tests');
                dynamicsWebApiTest.retrieveMultipleRequest({ collection: 'records', count: true, filter: 'statecode eq 0' });
                dynamicsWebApiTest.retrieveMultiple('morerecords');

                dynamicsWebApiTest.executeBatch()
                    .then(function (object) {
                        expect(object.length).to.be.eq(3);

                        expect(object[0]).to.deep.equal(mocks.responses.multiple());
                        expect(object[1]).to.deep.equal(mocks.responses.multipleWithCount());
                        expect(object[2]).to.deep.equal(mocks.responses.multiple2());

                        done();
                    }).catch(function (object) {
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
            var rBodys = rBody.split('\n');
            var checkBody = '';
            for (var i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }
            before(function () {
                var response = mocks.responses.batchRetrieveMultipleCountFilteredRetrieveMultiple;
                scope = nock(mocks.webApiUrl + '$batch')
                    .filteringRequestBody(function (body) {
                        body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'dwa_batch_XXX');
                        body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'changeset_XXX');
                        var bodys = body.split('\n');

                        var resultBody = '';
                        for (var i = 0; i < bodys.length; i++) {
                            resultBody += bodys[i];
                        }
                        return resultBody;
                    })
                    .post("", checkBody)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.retrieveMultiple('tests');
                dynamicsWebApiTest.count('records', 'statecode eq 0');
                dynamicsWebApiTest.retrieveMultiple('morerecords');

                dynamicsWebApiTest.executeBatch()
                    .then(function (object) {
                        expect(object.length).to.be.eq(3);

                        expect(object[0]).to.deep.equal(mocks.responses.multiple());
                        expect(object[1]).to.deep.equal(2);
                        expect(object[2]).to.deep.equal(mocks.responses.multiple2());

                        done();
                    }).catch(function (object) {
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
                    dynamicsWebApiTest.countAll('records');
                }).to.throw("DynamicsWebApi.countAll cannot be used in a BATCH request.");
            });

            it("retrieveAll", function () {
                dynamicsWebApiTest.startBatch();

                expect(function () {
                    dynamicsWebApiTest.retrieveAll('records');
                }).to.throw("DynamicsWebApi.retrieveAll cannot be used in a BATCH request.");
            });

            it("retrieveAllRequest", function () {
                dynamicsWebApiTest.startBatch();

                expect(function () {
                    dynamicsWebApiTest.retrieveAllRequest({ collection: 'records' });
                }).to.throw("DynamicsWebApi.retrieveAllRequest cannot be used in a BATCH request.");
            });

            it("fetchAll", function () {
                dynamicsWebApiTest.startBatch();

                expect(function () {
                    dynamicsWebApiTest.fetchAll('collection', 'any');
                }).to.throw("DynamicsWebApi.executeFetchXmlAll cannot be used in a BATCH request.");
            });
        });

        describe("update / delete", function () {
            var scope;
            var rBody = mocks.data.batchUpdateDelete;
            var rBodys = rBody.split('\n');
            var checkBody = '';
            for (var i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }
            before(function () {
                var response = mocks.responses.batchUpdateDelete;
                scope = nock(mocks.webApiUrl + '$batch')
                    .filteringRequestBody(function (body) {
                        body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'dwa_batch_XXX');
                        body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'changeset_XXX');
                        var bodys = body.split('\n');

                        var resultBody = '';
                        for (var i = 0; i < bodys.length; i++) {
                            resultBody += bodys[i];
                        }
                        return resultBody;
                    })
                    .post("", checkBody)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.update(mocks.data.testEntityId2, 'records', { firstname: "Test", lastname: "Batch!" });
                dynamicsWebApiTest.deleteRecord(mocks.data.testEntityId2, 'records', 'firstname');

                dynamicsWebApiTest.executeBatch()
                    .then(function (object) {
                        expect(object.length).to.be.eq(2);

                        expect(object[0]).to.be.true;
                        expect(object[1]).to.be.undefined;

                        done();
                    }).catch(function (object) {
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
            var rBodys = rBody.split('\n');
            var checkBody = '';
            for (var i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }
            before(function () {
                var response = mocks.responses.batchError;
                scope = nock(mocks.webApiUrl + '$batch')
                    .filteringRequestBody(function (body) {
                        body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'dwa_batch_XXX');
                        body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'changeset_XXX');
                        var bodys = body.split('\n');

                        var resultBody = '';
                        for (var i = 0; i < bodys.length; i++) {
                            resultBody += bodys[i];
                        }
                        return resultBody;
                    })
                    .post("", checkBody)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.update(mocks.data.testEntityId2, 'records', { firstname: "Test", lastname: "Batch!" });
                dynamicsWebApiTest.deleteRecord(mocks.data.testEntityId2, 'records', 'firstname');

                dynamicsWebApiTest.executeBatch()
                    .then(function (object) {
                        done(object);
                    }).catch(function (object) {
                        expect(object.length).to.be.eq(1);

                        expect(object[0].error).to.deep.equal({
                            "code": "0x0", "message": "error", "innererror": { "message": "error", "type": "Microsoft.Crm.CrmHttpException", "stacktrace": "stack" }
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
            var rBodys = rBody.split('\n');
            var checkBody = '';
            for (var i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }
            before(function () {
                var response = mocks.responses.batchUpdateDelete;
                scope = nock(mocks.webApiUrl + '$batch')
                    .filteringRequestBody(function (body) {
                        body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'dwa_batch_XXX');
                        body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'changeset_XXX');
                        var bodys = body.split('\n');

                        var resultBody = '';
                        for (var i = 0; i < bodys.length; i++) {
                            resultBody += bodys[i];
                        }
                        return resultBody;
                    })
                    .post("", checkBody)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.createRequest({ collection: 'records', entity: { firstname: "Test", lastname: "Batch!" }, contentId: '1' });
                dynamicsWebApiTest.createRequest({ collection: 'test_property', entity: { firstname: "Test1", lastname: "Batch!" }, contentId: '$1' });

                dynamicsWebApiTest.executeBatch()
                    .then(function (object) {
                        expect(object.length).to.be.eq(2);

                        expect(object[0]).to.be.eq(mocks.data.testEntityId);
                        expect(object[1]).to.be.undefined;

                        done();
                    }).catch(function (object) {
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
            var rBodys = rBody.split('\n');
            var checkBody = '';
            for (var i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }
            before(function () {
                var response = mocks.responses.batchUpdateDelete;
                scope = nock(mocks.webApiUrl + '$batch')
                    .filteringRequestBody(function (body) {
                        body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'dwa_batch_XXX');
                        body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'changeset_XXX');
                        var bodys = body.split('\n');

                        var resultBody = '';
                        for (var i = 0; i < bodys.length; i++) {
                            resultBody += bodys[i];
                        }
                        return resultBody;
                    })
                    .post("", checkBody)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.createRequest({ collection: 'records', entity: { firstname: "Test", lastname: "Batch!" }, contentId: '1' });
                dynamicsWebApiTest.createRequest({ collection: 'tests', entity: { firstname: "Test1", lastname: "Batch!", "prop@odata.bind": "$1" } });

                dynamicsWebApiTest.executeBatch()
                    .then(function (object) {
                        expect(object.length).to.be.eq(2);

                        expect(object[0]).to.be.eq(mocks.data.testEntityId);
                        expect(object[1]).to.be.undefined;

                        done();
                    }).catch(function (object) {
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
            var rBodys = rBody.split('\n');
            var checkBody = '';
            for (var i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }
            before(function () {
                var response = mocks.responses.batchUpsertUpsertUpsertWithAlternateKeys;
                scope = nock(mocks.webApiUrl + '$batch')
                    .filteringRequestBody(function (body) {
                        body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'dwa_batch_XXX');
                        body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'changeset_XXX');
                        var bodys = body.split('\n');

                        var resultBody = '';
                        for (var i = 0; i < bodys.length; i++) {
                            resultBody += bodys[i];
                        }
                        return resultBody;
                    })
                    .post("", checkBody)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.upsert("key='key1'", "records", { firstname: "Test", lastname: "Batch!" });
                dynamicsWebApiTest.upsert("key='key2'", "records", { firstname: "Test", lastname: "Batch!" });
                dynamicsWebApiTest.upsert("key='key3'", "records", { firstname: "Test", lastname: "Batch!" });

                dynamicsWebApiTest.executeBatch()
                    .then(function (object) {
                        expect(object.length).to.be.eq(3);

                        expect(object[0]).to.be.undefined;
                        expect(object[1]).to.be.undefined;
                        expect(object[2]).to.be.undefined;

                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.constructor -", function () {

        describe("webApiVersion", function () {
            var dynamicsWebApi80 = new DynamicsWebApi();
            var scope;
            before(function () {
                var response = mocks.responses.createReturnId;
                scope = nock(mocks.webApiUrl80)
                    .post("/tests", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("it makes a correct request and returns a correct response", function (done) {
                dynamicsWebApi80.create(mocks.data.testEntity, "tests")
                    .then(function (object) {
                        expect(object).to.equal(mocks.data.testEntityId);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("impersonate", function () {
            var dynamicsWebApi80 = new DynamicsWebApi({ impersonate: mocks.data.testEntityId2 });
            var scope;
            before(function () {
                var response = mocks.responses.createReturnId;
                scope = nock(mocks.webApiUrl80, {
                    reqheaders: {
                        MSCRMCallerID: mocks.data.testEntityId2
                    }
                })
                    .post("/tests", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("it makes a correct request and returns a correct response", function (done) {
                dynamicsWebApi80.create(mocks.data.testEntity, "tests")
                    .then(function (object) {
                        expect(object).to.equal(mocks.data.testEntityId);
                        done();
                    }).catch(function (object) {
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
                        Authorization: "Bearer token001"
                    }
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

                var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, webApiUrl: mocks.webApiUrl });
                dynamicsWebApiAuth.retrieveMultipleRequest({ collection: "tests" })
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
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
                        Authorization: "Bearer token001"
                    }
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

                var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, webApiUrl: mocks.webApiUrl });
                dynamicsWebApiAuth.retrieveMultipleRequest({ collection: "tests" })
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
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
                        Authorization: "Bearer token001"
                    }
                })
                    .get("/tests")
                    .reply(response.status, response.responseText, response.responseHeaders);

                scope2 = nock(mocks.webApiUrl, {
                    reqheaders: {
                        Authorization: "Bearer token002"
                    }
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
                var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, webApiUrl: mocks.webApiUrl });
                dynamicsWebApiAuth.retrieveMultipleRequest({ collection: "tests" })
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                    });

                dynamicsWebApiAuth.retrieveMultipleRequest({ collection: "tests" })
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
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
                        Authorization: "Bearer overriden"
                    }
                })
                    .get("/tests")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            var getToken = sinon.spy(function any(callback) { callback({ accessToken: "token001" }) });

            it("sends the request to the right end point and returns a response", function (done) {
                var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, webApiUrl: mocks.webApiUrl });
                dynamicsWebApiAuth.retrieveMultipleRequest({ collection: "tests", token: "overriden" })
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
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
            var dynamicsWebApi82 = new DynamicsWebApi({ webApiVersion: "8.2", includeAnnotations: "some-annotations" });
            var scope;
            before(function () {
                var response = mocks.responses.response200;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="some-annotations"'
                    }
                })
                    .get(mocks.responses.testEntityUrl)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("it makes a correct request and returns a correct response", function (done) {
                dynamicsWebApi82.retrieve(mocks.data.testEntityId, "tests")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("prefer - include annotations overriden if set in the request", function () {
            var dynamicsWebApi82 = new DynamicsWebApi({ webApiVersion: "8.2", includeAnnotations: "some-annotations" });
            var scope;
            before(function () {
                var response = mocks.responses.multipleResponse;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
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
                    includeAnnotations: DWA.Prefer.Annotations.FormattedValue
                };

                dynamicsWebApi82.retrieveMultipleRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("prefer - return representation added to request if set in the config", function () {
            var dynamicsWebApi82 = new DynamicsWebApi({ webApiVersion: "8.2", returnRepresentation: true });
            var scope;
            before(function () {
                var response = mocks.responses.createReturnRepresentation;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .post(mocks.responses.collectionUrl, mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApi82
                    .create(mocks.data.testEntity, "tests")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("prefer - return representation overriden if set in the request", function () {
            var dynamicsWebApi82 = new DynamicsWebApi({ webApiVersion: "8.2", returnRepresentation: true });
            var scope;
            var scope2;
            before(function () {
                var response = mocks.responses.basicEmptyResponseSuccess;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        'If-Match': '*'
                    }
                })
                    .patch(mocks.responses.testEntityUrl, mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);

                scope2 = nock(mocks.webApiUrl, {
                    reqheaders: {
                        "Prefer": /.*/,
                        'If-Match': '*'
                    }
                })
                    .post(mocks.responses.testEntityUrl, mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    entity: mocks.data.testEntity,
                    returnRepresentation: false
                };

                dynamicsWebApi82.updateRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
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
            var dynamicsWebApi82 = new DynamicsWebApi({ webApiVersion: "8.2", maxPageSize: 10 });
            var scope;
            before(function () {
                var response = mocks.responses.multipleResponse;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        Prefer: 'odata.maxpagesize=10'
                    }
                })
                    .get(mocks.responses.collectionUrl)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApi82.retrieveMultiple("tests")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("prefer - maxPageSize overriden if set in the request", function () {
            var dynamicsWebApi82 = new DynamicsWebApi({ webApiVersion: "8.2", maxPageSize: 10 });
            var scope;
            before(function () {
                var response = mocks.responses.multipleWithLinkResponse;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        Prefer: 'odata.maxpagesize=100'
                    }
                })
                    .get(mocks.responses.collectionUrl)
                    .query({ '$select': 'name' })
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                var dwaRequest = {
                    collection: "tests",
                    select: ["name"],
                    maxPageSize: 100
                };

                dynamicsWebApi82.retrieveMultipleRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multipleWithLink());
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });

    describe("dynamicsWebApi.setConfig -", function () {

        describe("webApiVersion and impersonate", function () {
            var dynamicsWebApi81 = new DynamicsWebApi();
            dynamicsWebApi81.setConfig({ webApiVersion: "8.1", impersonate: mocks.data.testEntityId2 });

            var scope;
            before(function () {
                var response = mocks.responses.createReturnId;
                scope = nock(mocks.webApiUrl81, {
                    reqheaders: {
                        MSCRMCallerID: mocks.data.testEntityId2
                    }
                })
                    .post("/tests", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("it makes a correct request and returns a correct response", function (done) {
                dynamicsWebApi81.create(mocks.data.testEntity, "tests")
                    .then(function (object) {
                        expect(object).to.equal(mocks.data.testEntityId);
                        done();
                    }).catch(function (object) {
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
                        MSCRMCallerID: mocks.data.testEntityId3
                    }
                })
                    .get("/tests")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("sends the request to the right end point with a correct MSCRMCallerID header", function (done) {
                dynamicsWebApi81.setConfig({ webApiVersion: "8.1", impersonate: mocks.data.testEntityId2 });
                dynamicsWebApi81.retrieveMultipleRequest({ collection: "tests", impersonate: mocks.data.testEntityId3 })
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("webApiVersion is overriden by url set in setConfig", function () {
            var dynamicsWebApi81 = new DynamicsWebApi({ webApiVersion: "8.1", impersonate: mocks.data.testEntityId2 });

            var scope;
            before(function () {
                var response = mocks.responses.multipleResponse;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        MSCRMCallerID: mocks.data.testEntityId2
                    }
                })
                    .get("/tests")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("sends the request to the right end point and returns a response", function (done) {
                dynamicsWebApi81.setConfig({ webApiUrl: mocks.webApiUrl });
                dynamicsWebApi81.retrieveMultipleRequest({ collection: "tests" })
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
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
            dynamicsWebApi81.setConfig({ webApiVersion: "8.1", impersonate: mocks.data.testEntityId2 });

            var scope;
            before(function () {
                var response = mocks.responses.createReturnId;
                scope = nock(mocks.webApiUrl81, {
                    reqheaders: {
                        MSCRMCallerID: mocks.data.testEntityId2
                    }
                })
                    .post("/tests")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("sends the request to the right end point", function (done) {
                var dynamicsWebApiCopy = dynamicsWebApi81.initializeInstance();
                dynamicsWebApiCopy.create(mocks.data.testEntity, "tests")
                    .then(function (object) {
                        expect(object).to.equal(mocks.data.testEntityId);
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("config changed", function () {
            var dynamicsWebApi81 = new DynamicsWebApi();
            dynamicsWebApi81.setConfig({ webApiVersion: "8.1", impersonate: mocks.data.testEntityId2 });

            var scope;
            before(function () {
                var response = mocks.responses.multipleResponse;
                scope = nock(mocks.webApiUrl)
                    .get(mocks.responses.collectionUrl)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("sends the request to the right end point", function (done) {
                dynamicsWebApiCopy = dynamicsWebApi81.initializeInstance({ webApiVersion: "8.2" });
                dynamicsWebApiCopy.retrieveMultipleRequest({ collection: "tests" })
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
                        done(object);
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });
});