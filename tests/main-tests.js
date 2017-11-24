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
                scope = nock(mocks.responses.collectionUrl)
                    .post("", mocks.data.testEntity)
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
                        console.error(object.message);
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl, {
                    reqheaders: {
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .post("", mocks.data.testEntity)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl, {
                    reqheaders: {
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .post("?$select=name", mocks.data.testEntity)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        "If-Match": "*"
                    }
                })
                    .patch("", mocks.data.testEntity)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        "If-Match": "*",
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .patch("", mocks.data.testEntity)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        "If-Match": "*",
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .patch("?$select=fullname", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .patch("?$select=fullname,subject", mocks.data.testEntity)
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("[fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest
                    .update(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .put("/fullname", {
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
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .put("/fullname", {
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .put("/fullname?$select=name", {
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .patch("", mocks.data.testEntityUrl)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .patch("", mocks.data.testEntityUrl)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .patch("", mocks.data.testEntityUrl)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .patch("", mocks.data.testEntity)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .patch("?$select=fullname", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .patch("?$select=fullname,subject", mocks.data.testEntity)
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("[fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest
                    .upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .patch("?$select=fullname", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .patch("?$select=fullname,subject", mocks.data.testEntity)
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("[fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest
                    .upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .delete("")
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.deleteRecord(mocks.data.testEntityId, "tests")
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .delete("/fullname")
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.deleteRecord(mocks.data.testEntityId, "tests", "fullname")
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .get("")
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl + "(alternateKey='keyValue')")
                    .get("")
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .get("?$select=fullname")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get("?$select=fullname,subject")
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("[fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["fullname", "subject"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .get("/reference")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get("/reference?$select=fullname")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get("/reference?$select=fullname,subject")
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("[/reference, fullname] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference", "fullname"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("[/reference, fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference", "fullname", "subject"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .get("/reference/$ref")
                    .reply(response.status, response.responseText, response.responseHeaders)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .get("?$expand=reference(something)")
                    .reply(response.status, response.responseText, response.responseHeaders)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .get("?$select=fullname&$expand=reference(something)")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get("?$select=fullname,subject&$expand=reference(something)")
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("[fullname,subject] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["fullname", "subject"], "reference(something)")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .get("/reference?$expand=reference(something)")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get("/reference?$select=fullname&$expand=reference(something)")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get("/reference?$select=fullname,subject&$expand=reference(something)")
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("[/reference, fullname] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference", "fullname"], "reference(something)")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("[/reference, fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference", "fullname", "subject"], "reference(something)")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl)
                    .get("/$count")
                    .reply(response.status, response.responseText, response.responseHeaders)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl)
                    .get("?$filter=name%20eq%20%27name%27&$count=true")
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl)
                    .get("?$filter=name%20eq%20%27name%27")
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl)
                    .get("?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXml1))
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl)
                    .get("?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXml2cookie))
                    .reply(response.status, response.responseText, response.responseHeaders)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl)
                    .get("?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXml1))
                    .reply(response.status, response.responseText, response.responseHeaders)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl, {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
                })
                    .get("?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXml2cookie))
                    .reply(response.status, response.responseText, response.responseHeaders)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl)
                    .get("?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXml1))
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get("?fetchXml=" + encodeURIComponent(mocks.data.fetchXmls.fetchXml2cookie))
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .post("/tests_records/$ref", {
                        "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")"
                    })
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.associate("tests", mocks.data.testEntityId, "tests_records", "records", mocks.data.testEntityId2)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                    .get('/EntityDefinitions?$select=LogicalCollectionName,LogicalName')
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        MSCRMCallerID: mocks.data.testEntityId3
                    }
                })
                    .post("/tests_records/$ref", {
                        "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")"
                    })
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.associate("tests", mocks.data.testEntityId, "tests_records", "records", mocks.data.testEntityId2, mocks.data.testEntityId3)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .delete("/tests_records(" + mocks.data.testEntityId2 + ")/$ref")
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.disassociate("tests", mocks.data.testEntityId, "tests_records", mocks.data.testEntityId2)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        MSCRMCallerID: mocks.data.testEntityId3
                    }
                })
                    .delete("/tests_records(" + mocks.data.testEntityId2 + ")/$ref")
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.disassociate("tests", mocks.data.testEntityId, "tests_records", mocks.data.testEntityId2, mocks.data.testEntityId3)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .put("/tests_records/$ref", {
                        "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")"
                    })
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.associateSingleValued("tests", mocks.data.testEntityId, "tests_records", "records", mocks.data.testEntityId2)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        MSCRMCallerID: mocks.data.testEntityId3
                    }
                })
                    .put("/tests_records/$ref", {
                        "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")"
                    })
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.associateSingleValued("tests", mocks.data.testEntityId, "tests_records", "records", mocks.data.testEntityId2, mocks.data.testEntityId3)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .delete("/tests_records/$ref")
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.disassociateSingleValued("tests", mocks.data.testEntityId, "tests_records")
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        MSCRMCallerID: mocks.data.testEntityId3
                    }
                })
                    .delete("/tests_records/$ref")
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.disassociateSingleValued("tests", mocks.data.testEntityId, "tests_records", mocks.data.testEntityId3)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("(with parameters) returns a correct response", function (done) {
                dynamicsWebApiTest.executeUnboundFunction("FUN", { param1: "value1", param2: 2 })
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("(with parameters) returns a correct response", function (done) {
                dynamicsWebApiTest.executeUnboundFunction("FUN", { param1: "value1", param2: 2 }, mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .get("/FUN()")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get("/FUN(param1=@p1,param2=@p2)?@p1=%27value1%27&@p2=2")
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("(with parameters) returns a correct response", function (done) {
                dynamicsWebApiTest.executeBoundFunction(mocks.data.testEntityId, "tests", "FUN", { param1: "value1", param2: 2 })
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
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
                dynamicsWebApiTest.executeBoundFunction(mocks.data.testEntityId, "tests", "FUN", null, mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("(with parameters) returns a correct response", function (done) {
                dynamicsWebApiTest.executeBoundFunction(mocks.data.testEntityId, "tests", "FUN", { param1: "value1", param2: 2 }, mocks.data.testEntityId)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function () {
                nock.cleanAll();
            });

            it("returns a correct response", function (done) {
                dynamicsWebApiTest.executeUnboundAction("FUN", mocks.responses.actionRequest)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl)
                    .post("/FUN", mocks.responses.actionRequestModified)
                    .reply(response.status, response.responseText, response.responseHeaders)
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
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
                dynamicsWebApiTest.executeBoundAction(mocks.data.testEntityId, "tests", "FUN", mocks.responses.actionRequest, mocks.data.testEntityId2)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        'If-Match': '*'
                    }
                })
                    .patch("", mocks.data.testEntity)
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
                }

                dynamicsWebApiTest.updateRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        'If-Match': '*',
                        'Prefer': DWA.Prefer.ReturnRepresentation
                    }
                })
                    .patch("", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .patch("?$select=fullname,subject", mocks.data.testEntity)
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
                }

                dynamicsWebApiTest.updateRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("[fullname, subject] returns a correct response", function (done) {
                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    entity: mocks.data.testEntity,
                    returnRepresentation: true,
                    select: ["fullname", "subject"]
                }

                dynamicsWebApiTest.updateRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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

                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        'If-Match': 'match'
                    }
                })
                    .patch("", mocks.data.testEntity)
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
                }

                dynamicsWebApiTest
                    .updateRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.equal(true);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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

                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        'If-Match': 'match'
                    }
                })
                    .patch("", mocks.data.testEntity)
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
                }

                dynamicsWebApiTest
                    .updateRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.equal(false);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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

                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        'If-Match': 'match'
                    }
                })
                    .patch("", mocks.data.testEntity)
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
                }

                dynamicsWebApiTest
                    .updateRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
            }

            var scope;
            before(function () {
                var response = mocks.responses.basicEmptyResponseSuccess;
                var response2 = mocks.responses.createReturnId;

                scope = nock(mocks.responses.testEntityUrl)
                    .patch("", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .patch("", mocks.data.testEntity)
                    .reply(response2.status, response2.responseText, response2.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("(update) returns a correct response", function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("(create) returns a correct response", function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntityId);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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

                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        Prefer: DWA.Prefer.ReturnRepresentation
                    }
                })
                    .patch("", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .patch("?$select=name", mocks.data.testEntity)
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
                }

                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("(create) returns a correct response", function (done) {
                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    entity: mocks.data.testEntity,
                    returnRepresentation: true,
                    select: ["name"]
                }

                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
            }
            var scope;
            before(function () {
                var response = mocks.responses.upsertPreventCreateResponse;
                var response2 = mocks.responses.createReturnRepresentation;
                var response3 = mocks.responses.upsertPreventUpdateResponse;

                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        Prefer: DWA.Prefer.ReturnRepresentation,
                        'If-Match': '*'
                    }
                })
                    //create prevented
                    .patch("", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders)
                    //create succeeded
                    .patch("", mocks.data.testEntity)
                    .reply(response2.status, response2.responseText, response2.responseHeaders)
                    //request failed
                    .patch("", mocks.data.testEntity)
                    .reply(response3.status, response3.responseText, response3.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("(create prevented) returns a correct response", function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("(create succeeded) returns a correct response", function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("(request failed) catches the error", function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
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

                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        Prefer: DWA.Prefer.ReturnRepresentation,
                        'If-None-Match': '*'
                    }
                })
                    //update prevented
                    .patch("", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders)
                    //update succeeded
                    .patch("", mocks.data.testEntity)
                    .reply(response2.status, response2.responseText, response2.responseHeaders)
                    //request failed
                    .patch("", mocks.data.testEntity)
                    .reply(response3.status, response3.responseText, response3.responseHeaders);
            });

            after(function () {
                nock.cleanAll();
            });

            it("(update prevented) returns a correct response", function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("(update succeeded) returns a correct response", function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.data.updatedEntity);
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("(request failed) catches the error", function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest)
                    .then(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        'If-Match': 'match',
                        'MSCRMCallerID': mocks.data.testEntityId2
                    }
                })
                    .get("?$expand=prop")
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        'If-Match': 'match',
                        'MSCRMCallerID': mocks.data.testEntityId2
                    }
                })
                    .get("?$expand=prop($filter=" + encodeURI("field eq ") + '%27value%27)')
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        'If-Match': 'match',
                        'MSCRMCallerID': mocks.data.testEntityId2
                    }
                })
                    .get("/ownerid/$ref")
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
                scope = nock(mocks.responses.collectionUrl)
                    .get("")
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl)
                    .get("?$select=fullname")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get("?$select=fullname,subject")
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("[fullname, subject] returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveMultiple("tests", ["fullname", "subject"])
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl)
                    .get("?$filter=name%20eq%20%27name%27")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get("?$select=fullname&$filter=name%20eq%20%27name%27")
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("(+select) returns a correct response", function (done) {
                dynamicsWebApiTest.retrieveMultiple("tests", ["fullname"], "name eq 'name'")
                    .then(function (object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function (object) {
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl)
                    .get("")
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
                        expect(object).to.be.undefined;
                        done();
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
                var link = mocks.responses.multipleWithLink().oDataNextLink.split('?');
                scope = nock(link[0])
                    .get("?" + link[1])
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
                        expect(object).to.be.undefined;
                        done();
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
                var link = mocks.responses.multipleWithLink().oDataNextLink.split('?');
                scope = nock(mocks.responses.collectionUrl)
                    .get("?$select=name")
                    .reply(response.status, response.responseText, response.responseHeaders);
                scope2 = nock(link[0])
                    .get("?" + link[1])
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl, {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
                })
                    .get("?$select=name")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .get("?$select=name&$count=true")
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
                        expect(object).to.be.undefined;
                        done();
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl, {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
                })
                    .get("?$select=name")
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
                        expect(object).to.be.undefined;
                        done();
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
                var link = mocks.responses.multipleWithLink().oDataNextLink.split('?');
                scope = nock(link[0], {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
                })
                    .get("?" + link[1])
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl, {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
                })
                    .get("?$select=name")
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
                        expect(object).to.be.undefined;
                        done();
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
                var link = mocks.responses.multipleWithLink().oDataNextLink.split('?');
                scope = nock(mocks.responses.collectionUrl, {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
                })
                    .get("?$select=name")
                    .reply(response.status, response.responseText, response.responseHeaders);
                scope2 = nock(link[0], {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
                })
                    .get("?" + link[1])
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        MSCRMCallerID: mocks.data.testEntityId2
                    }
                })
                    .delete("")
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
                        expect(object).to.be.undefined;
                        done();
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

                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        MSCRMCallerID: mocks.data.testEntityId2
                    }
                })
                    .delete("")
                    .reply(response.status, response.responseText, response.responseHeaders)
                    .delete("")
                    .reply(response2.status, response2.responseText, response2.responseHeaders)
                    .delete("")
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
                        expect(object).to.be.undefined;
                        done();
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
                        expect(object).to.be.undefined;
                        done();
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
                        expect(object).to.be.undefined;
                        done();
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
                        expect(object).to.be.undefined;
                        done();
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
                        expect(object).to.be.undefined;
                        done();
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("authorization - two requests use different authorization tokens", function() {
            var scope;
            var scope2;
            before(function() {
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

            after(function() {
                nock.cleanAll();
            });

            var i = 0;
            var getToken = function(callback) {
                var adalCallback = function(token) {
                    callback(token);
                };

                adalCallback({ accessToken: "token00" + ++i });
            };

            it("sends the request to the right end point and returns a response", function(done) {
                var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, webApiUrl: mocks.webApiUrl });
                dynamicsWebApiAuth.retrieveMultipleRequest({ collection: "tests" })
                    .then(function(object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                    }).catch(function(object) {
                        expect(object).to.be.undefined;
                    });

                dynamicsWebApiAuth.retrieveMultipleRequest({ collection: "tests" })
                    .then(function(object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function(object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("all requests have been made", function() {
                expect(scope.isDone()).to.be.true;
                expect(scope2.isDone()).to.be.true;
            });
        });

        describe("authorization - when token set in the request it overrides token returned from a callback", function() {
            var scope;
            before(function() {
                var response = mocks.responses.multipleResponse;
                scope = nock(mocks.webApiUrl, {
                    reqheaders: {
                        Authorization: "Bearer overriden"
                    }
                })
                    .get("/tests")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function() {
                nock.cleanAll();
            });

            var getToken = sinon.spy(function any(callback) { callback({ accessToken: "token001" }) });

            it("sends the request to the right end point and returns a response", function(done) {
                var dynamicsWebApiAuth = new DynamicsWebApi({ onTokenRefresh: getToken, webApiUrl: mocks.webApiUrl });
                dynamicsWebApiAuth.retrieveMultipleRequest({ collection: "tests", token: "overriden" })
                    .then(function(object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function(object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("all requests have been made", function() {
                expect(scope.isDone()).to.be.true;
            });

            it("and token refresh callback has not been called", function() {
                expect(getToken.notCalled).to.be.true;
            });
        });

        describe("prefer - include annotations added to request if set in the config", function() {
            var dynamicsWebApi82 = new DynamicsWebApi({ webApiVersion: "8.2", includeAnnotations: "some-annotations" });
            var scope;
            before(function() {
                var response = mocks.responses.response200;
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="some-annotations"'
                    }
                })
                    .get("")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function() {
                nock.cleanAll();
            });

            it("it makes a correct request and returns a correct response", function(done) {
                dynamicsWebApi82.retrieve(mocks.data.testEntityId, "tests")
                    .then(function(object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function(object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("all requests have been made", function() {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("prefer - include annotations overriden if set in the request", function() {
            var dynamicsWebApi82 = new DynamicsWebApi({ webApiVersion: "8.2", includeAnnotations: "some-annotations" });
            var scope;
            before(function() {
                var response = mocks.responses.multipleResponse;
                scope = nock(mocks.responses.collectionUrl, {
                    reqheaders: {
                        Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"'
                    }
                })
                    .get("?$select=name")
                    .reply(response.status, response.responseText, response.responseHeaders)
            });

            after(function() {
                nock.cleanAll();
            });

            it("it makes a correct request and returns a correct response", function(done) {
                var dwaRequest = {
                    collection: "tests",
                    select: ["name"],
                    includeAnnotations: DWA.Prefer.Annotations.FormattedValue
                };

                dynamicsWebApi82.retrieveMultipleRequest(dwaRequest)
                    .then(function(object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function(object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("all requests have been made", function() {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("prefer - return representation added to request if set in the config", function() {
            var dynamicsWebApi82 = new DynamicsWebApi({ webApiVersion: "8.2", returnRepresentation: true});
            var scope;
            before(function() {
                var response = mocks.responses.createReturnRepresentation;
                scope = nock(mocks.responses.collectionUrl, {
                    reqheaders: {
                        "Prefer": DWA.Prefer.ReturnRepresentation
                    }
                })
                    .post("", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function() {
                nock.cleanAll();
            });

            it("returns a correct response", function(done) {
                dynamicsWebApi82
                    .create(mocks.data.testEntity, "tests")
                    .then(function(object) {
                        expect(object).to.deep.equal(mocks.data.testEntity);
                        done();
                    }).catch(function(object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("all requests have been made", function() {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("prefer - return representation overriden if set in the request", function() {
            var dynamicsWebApi82 = new DynamicsWebApi({ webApiVersion: "8.2", returnRepresentation: true });
            var scope;
            var scope2;
            before(function() {
                var response = mocks.responses.basicEmptyResponseSuccess;
                scope = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        'If-Match': '*'
                    }
                })
                    .patch("", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);

                scope2 = nock(mocks.responses.testEntityUrl, {
                    reqheaders: {
                        "Prefer": /.*/,
                        'If-Match': '*'
                    }
                })
                    .post("", mocks.data.testEntity)
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function() {
                nock.cleanAll();
            });

            it("returns a correct response", function(done) {
                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    entity: mocks.data.testEntity,
                    returnRepresentation: false
                }

                dynamicsWebApi82.updateRequest(dwaRequest)
                    .then(function(object) {
                        expect(object).to.be.true;
                        done();
                    }).catch(function(object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("all requests have been made", function() {
                expect(scope.isDone()).to.be.true;
            });

            it("prefer header has not been set", function () {
                expect(scope2.isDone()).to.be.false;
            });
        });

        describe("prefer - maxPageSize added to request if set in the config", function() {
            var dynamicsWebApi82 = new DynamicsWebApi({ webApiVersion: "8.2", maxPageSize: 10});
            var scope;
            before(function() {
                var response = mocks.responses.multipleResponse;
                scope = nock(mocks.responses.collectionUrl, {
                    reqheaders: {
                        Prefer: 'odata.maxpagesize=10'
                    }
                })
                    .get("")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function() {
                nock.cleanAll();
            });

            it("returns a correct response", function(done) {
                dynamicsWebApi82.retrieveMultiple("tests")
                    .then(function(object) {
                        expect(object).to.deep.equal(mocks.responses.multiple());
                        done();
                    }).catch(function(object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("all requests have been made", function() {
                expect(scope.isDone()).to.be.true;
            });
        });

        describe("prefer - maxPageSize overriden if set in the request", function() {
            var dynamicsWebApi82 = new DynamicsWebApi({ webApiVersion: "8.2", maxPageSize: 10});
            var scope;
            before(function() {
                var response = mocks.responses.multipleWithLinkResponse;
                scope = nock(mocks.responses.collectionUrl, {
                    reqheaders: {
                        Prefer: 'odata.maxpagesize=100'
                    }
                })
                    .get("?$select=name")
                    .reply(response.status, response.responseText, response.responseHeaders);
            });

            after(function() {
                nock.cleanAll();
            });

            it("returns a correct response", function(done) {
                var dwaRequest = {
                    collection: "tests",
                    select: ["name"],
                    maxPageSize: 100
                };

                dynamicsWebApi82.retrieveMultipleRequest(dwaRequest)
                    .then(function(object) {
                        expect(object).to.deep.equal(mocks.responses.multipleWithLink());
                        done();
                    }).catch(function(object) {
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("all requests have been made", function() {
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
                        expect(object).to.be.undefined;
                        done();
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
                        expect(object).to.be.undefined;
                        done();
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
                        expect(object).to.be.undefined;
                        done();
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
                        expect(object).to.be.undefined;
                        done();
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
                scope = nock(mocks.responses.collectionUrl)
                    .get("")
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
                        expect(object).to.be.undefined;
                        done();
                    });
            });

            it("all requests have been made", function () {
                expect(scope.isDone()).to.be.true;
            });
        });
    });
});