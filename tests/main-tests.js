var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');

var mocks = require("./stubs.js");
var DWA = require("../lib/dwa.js");
var DynamicsWebApi = require("../lib/dynamics-web-api.js");
var dynamicsWebApiTest = new DynamicsWebApi({ webApiVersion: "8.2" });

describe("dynamicsWebApi.create -", function () {
    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.create(mocks.data.testEntity, "tests").then(function (object) {
                responseObject = object;
                done();
            }).catch(function (object) {
                responseObject = object;
                done();
            });

            var response = mocks.responses.createReturnId;
            this.requests[0].respond(response.status, response.responseHeaders);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('POST');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("does not have Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntityId);
        });
    });

    describe("return representation", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest
                .create(mocks.data.testEntity, "tests", DWA.Prefer.ReturnRepresentation)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.createReturnRepresentation;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('POST');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("sends the Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
        });
    });
});

describe("dynamicsWebApi.update -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.update(mocks.data.testEntityId, "tests", mocks.data.testEntity)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PATCH');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("does not have Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
        });

        it("sends the right If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.equal("*");
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });

    describe("return representation", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.update(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.updateReturnRepresentation;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PATCH');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("sends the Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
        });

        it("sends the right If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.equal("*");
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.updatedEntity);
        });
    });

    describe("select in return representation", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dynamicsWebApiTest
                .update(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname"])
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.updateReturnRepresentation;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest
                .update(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"])
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.updateReturnRepresentation;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname");
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname,subject");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PATCH');
            expect(this.requests[1].method).to.equal('PATCH');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[1].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("sends the Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
            expect(this.requests[1].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
        });

        it("sends the right If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.equal("*");
            expect(this.requests[1].requestHeaders['If-Match']).to.equal("*");
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.updatedEntity);
            expect(responseObject2).to.deep.equal(mocks.data.updatedEntity);
        });
    });
});

describe("dynamicsWebApi.updateSingleProperty -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.updateSingleProperty(mocks.data.testEntityId, "tests", mocks.data.updatedEntity)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/fullname");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PUT');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal({
                value: mocks.data.updatedEntity.fullname
            });
        });

        it("does not have Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });

    describe("return representation", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.updateSingleProperty(mocks.data.testEntityId, "tests", mocks.data.updatedEntity, DWA.Prefer.ReturnRepresentation)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.updateReturnRepresentation;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/fullname");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PUT');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal({
                value: mocks.data.updatedEntity.fullname
            });
        });

        it("sends the Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.updatedEntity);
        });
    });
});

describe("dynamicsWebApi.upsert -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dynamicsWebApiTest.upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity)
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity)
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.createReturnId;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl);
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PATCH');
            expect(this.requests[1].method).to.equal('PATCH');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[1].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("does not have Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
            expect(this.requests[1].requestHeaders['Prefer']).to.be.undefined;
        });

        it("does not have If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[1].requestHeaders['If-Match']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
            expect(responseObject2).to.deep.equal(mocks.data.testEntityId);
        });
    });

    describe("return representation", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dynamicsWebApiTest.upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation)
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.updateReturnRepresentation;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation)
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.createReturnRepresentation;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl);
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PATCH');
            expect(this.requests[1].method).to.equal('PATCH');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[1].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("sends the Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
            expect(this.requests[1].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
        });

        it("does not have If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[1].requestHeaders['If-Match']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.updatedEntity);
            expect(responseObject2).to.deep.equal(mocks.data.testEntity);
        });
    });

    describe("select & return representation", function () {
        var responseObject;
        var responseObject2;
        var responseObject3;
        var responseObject4;
        before(function (done) {
            dynamicsWebApiTest
                .upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname"])
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.updateReturnRepresentation;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest
                .upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"])
                .then(function (object) {
                    responseObject2 = object;
                }).catch(function (object) {
                    responseObject2 = object;
                });

            var response2 = mocks.responses.updateReturnRepresentation;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);

            dynamicsWebApiTest
                .upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname"])
                .then(function (object) {
                    responseObject3 = object;
                }).catch(function (object) {
                    responseObject3 = object;
                });

            var response3 = mocks.responses.createReturnId;
            this.requests[2].respond(response3.status, response3.responseHeaders, response3.responseText);

            dynamicsWebApiTest
                .upsert(mocks.data.testEntityId, "tests", mocks.data.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"])
                .then(function (object) {
                    responseObject4 = object;
                    done();
                }).catch(function (object) {
                    responseObject4 = object;
                    done();
                });

            var response4 = mocks.responses.createReturnRepresentation;
            this.requests[3].respond(response4.status, response4.responseHeaders, response4.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname");
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname,subject");
            expect(this.requests[2].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname");
            expect(this.requests[3].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname,subject");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PATCH');
            expect(this.requests[1].method).to.equal('PATCH');
            expect(this.requests[2].method).to.equal('PATCH');
            expect(this.requests[3].method).to.equal('PATCH');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[1].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[2].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[3].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("sends the Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
            expect(this.requests[1].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
            expect(this.requests[2].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
            expect(this.requests[3].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
        });

        it("does not have If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[1].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[2].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[3].requestHeaders['If-Match']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.updatedEntity);
            expect(responseObject2).to.deep.equal(mocks.data.updatedEntity);
            expect(responseObject3).to.deep.equal(mocks.data.testEntityId);
            expect(responseObject4).to.deep.equal(mocks.data.testEntity);
        });
    });
});

describe("dynamicsWebApi.deleteRecord -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.deleteRecord(mocks.data.testEntityId, "tests")
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('DELETE');
        });

        it("does not send data", function () {
            expect(this.requests[0].requestBody).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });

    describe("single property", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.deleteRecord(mocks.data.testEntityId, "tests", "fullname")
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/fullname");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('DELETE');
        });

        it("does not send data", function () {
            expect(this.requests[0].requestBody).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });
});

describe("dynamicsWebApi.retrieve -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests")
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.response200;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
        });
    });

    describe("select basic", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["fullname"])
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.response200;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["fullname", "subject"])
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.response200;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname");
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname,subject");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
            expect(this.requests[1].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[1].requestBody)).to.be.null;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
            expect(responseObject2).to.deep.equal(mocks.data.testEntity);
        });
    });

    describe("single value or navigation property", function () {
        var responseObject;
        var responseObject2;
        var responseObject3;
        before(function (done) {
            dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference"])
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.response200;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference", "fullname"])
                .then(function (object) {
                    responseObject2 = object;
                }).catch(function (object) {
                    responseObject2 = object;
                });

            var response2 = mocks.responses.response200;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);

            dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference", "fullname", "subject"])
                .then(function (object) {
                    responseObject3 = object;
                    done();
                }).catch(function (object) {
                    responseObject3 = object;
                    done();
                });

            var response3 = mocks.responses.response200;
            this.requests[2].respond(response3.status, response3.responseHeaders, response3.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/reference");
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl + "/reference?$select=fullname");
            expect(this.requests[2].url).to.equal(mocks.responses.testEntityUrl + "/reference?$select=fullname,subject");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
            expect(this.requests[1].method).to.equal('GET');
            expect(this.requests[2].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[1].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[2].requestBody)).to.be.null;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
            expect(responseObject2).to.deep.equal(mocks.data.testEntity);
            expect(responseObject3).to.deep.equal(mocks.data.testEntity);
        });
    });

    describe("reference", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["reference/$ref"])
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.retrieveReferenceResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/reference/$ref");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.referenceResponseConverted);
        });
    });

    describe("expand basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", null, "reference(something)")
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.response200;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "?$expand=reference(something)");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
        });
    });

    describe("select & expand basic", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["fullname"], "reference(something)")
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.response200;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["fullname", "subject"], "reference(something)")
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.response200;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname&$expand=reference(something)");
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname,subject&$expand=reference(something)");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
            expect(this.requests[1].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[1].requestBody)).to.be.null;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
            expect(responseObject2).to.deep.equal(mocks.data.testEntity);
        });
    });

    describe("select & expand navigation property", function () {
        var responseObject;
        var responseObject2;
        var responseObject3;
        before(function (done) {
            dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference"], "reference(something)")
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.response200;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference", "fullname"], "reference(something)")
                .then(function (object) {
                    responseObject2 = object;
                }).catch(function (object) {
                    responseObject2 = object;
                });

            var response2 = mocks.responses.response200;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);

            dynamicsWebApiTest.retrieve(mocks.data.testEntityId, "tests", ["/reference", "fullname", "subject"], "reference(something)")
                .then(function (object) {
                    responseObject3 = object;
                    done();
                }).catch(function (object) {
                    responseObject3 = object;
                    done();
                });

            var response3 = mocks.responses.response200;
            this.requests[2].respond(response3.status, response3.responseHeaders, response3.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/reference?$expand=reference(something)");
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl + "/reference?$select=fullname&$expand=reference(something)");
            expect(this.requests[2].url).to.equal(mocks.responses.testEntityUrl + "/reference?$select=fullname,subject&$expand=reference(something)");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
            expect(this.requests[1].method).to.equal('GET');
            expect(this.requests[2].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[1].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[2].requestBody)).to.be.null;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
            expect(responseObject2).to.deep.equal(mocks.data.testEntity);
            expect(responseObject3).to.deep.equal(mocks.data.testEntity);
        });
    });
});

describe("dynamicsWebApi.count -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.count("tests")
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.countBasic;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl + "/$count");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(parseInt(mocks.responses.countBasic.responseText));
        });
    });
    describe("filter", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.count("tests", "name eq 'name'")
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.multipleWithCountResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl + "?$filter=name%20eq%20'name'&$count=true");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.multipleWithCount["@odata.count"]);
        });
    });
});

describe("dynamicsWebApi._getPagingCookie -", function () {
    it("paginCookie is empty", function () {
        var result = dynamicsWebApiTest.__forTestsOnly__.getPagingCookie("", 2);
        expect(result).to.deep.equal({
            cookie: "",
            page: 2,
            nextPage: 3
        });
    });

    it("pagingCookie is normal", function () {
        var result = dynamicsWebApiTest.__forTestsOnly__.getPagingCookie(mocks.data.fetchXmls.cookiePage2, 2);
        expect(result).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage2Cookie.PagingInfo);

        result = dynamicsWebApiTest.__forTestsOnly__.getPagingCookie(mocks.data.fetchXmls.cookiePage1, 2);
        expect(result).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo);

        result = dynamicsWebApiTest.__forTestsOnly__.getPagingCookie(mocks.data.fetchXmls.cookiePage2);
        expect(result).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage2Cookie.PagingInfo);

    });
});

describe("dynamicsWebApi.executeFetchXml -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {

            dynamicsWebApiTest.executeFetchXml("tests", mocks.data.fetchXmls.fetchXml)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.fetchXmlResponsePage1Cookie;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl + "?fetchXml=" + escape(escape(mocks.data.fetchXmls.fetchXml1)));
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
        });

        it("does not send the Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage1Cookie);
        });
    });

    describe("paging", function () {
        var responseObject;
        before(function (done) {
            var pagingInfo = mocks.data.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo;
            dynamicsWebApiTest.executeFetchXml("tests", mocks.data.fetchXmls.fetchXml, null, pagingInfo.nextPage, pagingInfo.cookie)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.fetchXmlResponsePage2Cookie;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl + "?fetchXml=" + escape(escape(mocks.data.fetchXmls.fetchXml2cookie)));
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
        });

        it("does not send the Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage2Cookie);
        });
    });

    describe("paging - no cookie", function () {
        var responseObject;
        before(function (done) {

            dynamicsWebApiTest.executeFetchXml("tests", mocks.data.fetchXmls.fetchXml)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.fetchXmlResponsePage1;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl + "?fetchXml=" + escape(escape(mocks.data.fetchXmls.fetchXml1)));
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
        });

        it("does not send the Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage1);
        });
    });

    describe("with prefer", function () {
        var responseObject;
        before(function (done) {
            var pagingInfo = mocks.data.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo;
            dynamicsWebApiTest.executeFetchXml("tests", mocks.data.fetchXmls.fetchXml, DWA.Prefer.Annotations.FormattedValue, pagingInfo.nextPage, pagingInfo.cookie)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.fetchXmlResponsePage2Cookie;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl + "?fetchXml=" + escape(escape(mocks.data.fetchXmls.fetchXml2cookie)));
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
        });

        it("sends the correct Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.equal('odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"')
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage2Cookie);
        });
    });
});

describe("dynamicsWebApi.associate -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.associate("tests", mocks.data.testEntityId, "tests_records", "records", mocks.data.testEntityId2)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/tests_records/$ref");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('POST');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal({
                "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")"
            });
        });

        it("does not have MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });

    describe("impersonation", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.associate("tests", mocks.data.testEntityId, "tests_records", "records", mocks.data.testEntityId2, mocks.data.testEntityId3)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.updateReturnRepresentation;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/tests_records/$ref");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('POST');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal({
                "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")"
            });
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId3);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });
});

describe("dynamicsWebApi.disassociate -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.disassociate("tests", mocks.data.testEntityId, "tests_records", mocks.data.testEntityId2)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/tests_records(" + mocks.data.testEntityId2 + ")/$ref");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('DELETE');
        });

        it("does not send the data", function () {
            expect(this.requests[0].requestBody).to.be.undefined;
        });

        it("does not have MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });

    describe("impersonation", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.disassociate("tests", mocks.data.testEntityId, "tests_records", mocks.data.testEntityId2, mocks.data.testEntityId3)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.updateReturnRepresentation;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/tests_records(" + mocks.data.testEntityId2 + ")/$ref");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('DELETE');
        });

        it("does not send the data", function () {
            expect(this.requests[0].requestBody).to.be.undefined;
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId3);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });
});

describe("dynamicsWebApi.associateSingleValued -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.associateSingleValued("tests", mocks.data.testEntityId, "tests_records", "records", mocks.data.testEntityId2)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/tests_records/$ref");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PUT');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal({
                "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")"
            });
        });

        it("does not have MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });

    describe("impersonation", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.associateSingleValued("tests", mocks.data.testEntityId, "tests_records", "records", mocks.data.testEntityId2, mocks.data.testEntityId3)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.updateReturnRepresentation;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/tests_records/$ref");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PUT');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal({
                "@odata.id": mocks.webApiUrl + "records(" + mocks.data.testEntityId2 + ")"
            });
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId3);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });
});

describe("dynamicsWebApi.disassociateSingleValued -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.disassociateSingleValued("tests", mocks.data.testEntityId, "tests_records")
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/tests_records/$ref");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('DELETE');
        });

        it("does not send the data", function () {
            expect(this.requests[0].requestBody).to.be.undefined;
        });

        it("does not have MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });

    describe("impersonation", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.disassociateSingleValued("tests", mocks.data.testEntityId, "tests_records", mocks.data.testEntityId3)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.updateReturnRepresentation;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/tests_records/$ref");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('DELETE');
        });

        it("does not send the data", function () {
            expect(this.requests[0].requestBody).to.be.undefined;
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId3);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });
});

describe("dynamicsWebApi._buildFunctionParameters - ", function () {
    it("no parameters", function () {
        var result = dynamicsWebApiTest.__forTestsOnly__.buildFunctionParameters();
        expect(result).to.equal("()");
    });
    it("1 parameter", function () {
        var result = dynamicsWebApiTest.__forTestsOnly__.buildFunctionParameters({ param1: "value1" });
        expect(result).to.equal("(param1=@p1)?@p1='value1'");
    });
    it("2 parameters", function () {
        var result = dynamicsWebApiTest.__forTestsOnly__.buildFunctionParameters({ param1: "value1", param2: 2 });
        expect(result).to.equal("(param1=@p1,param2=@p2)?@p1='value1'&@p2=2");
    });
    it("3 parameters", function () {
        var result = dynamicsWebApiTest.__forTestsOnly__.buildFunctionParameters({ param1: "value1", param2: 2, param3: "value2" });
        expect(result).to.equal("(param1=@p1,param2=@p2,param3=@p3)?@p1='value1'&@p2=2&@p3='value2'");
    });
});

describe("dynamicsWebApi.executeFunction -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("unbound", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dynamicsWebApiTest.executeUnboundFunction("FUN")
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.response200;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.executeUnboundFunction("FUN", { param1: "value1", param2: 2 })
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.response200;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.webApiUrl + "FUN()");
            expect(this.requests[1].url).to.equal(mocks.webApiUrl + "FUN(param1=@p1,param2=@p2)?@p1='value1'&@p2=2");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
            expect(this.requests[1].method).to.equal('GET');
        });

        it("does not send the data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[1].requestBody)).to.be.null;
        });

        it("does not have MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
            expect(this.requests[1].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
            expect(responseObject2).to.deep.equal(mocks.data.testEntity);
        });
    });

    describe("unbound impersonation", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dynamicsWebApiTest.executeUnboundFunction("FUN", null, mocks.data.testEntityId)
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.response200;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.executeUnboundFunction("FUN", { param1: "value1", param2: 2 }, mocks.data.testEntityId)
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.response200;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.webApiUrl + "FUN()");
            expect(this.requests[1].url).to.equal(mocks.webApiUrl + "FUN(param1=@p1,param2=@p2)?@p1='value1'&@p2=2");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
            expect(this.requests[1].method).to.equal('GET');
        });

        it("does not send the data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[1].requestBody)).to.be.null;
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId);
            expect(this.requests[1].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
            expect(responseObject2).to.deep.equal(mocks.data.testEntity);
        });
    });

    describe("bound", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dynamicsWebApiTest.executeBoundFunction(mocks.data.testEntityId, "tests", "FUN")
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.response200;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.executeBoundFunction(mocks.data.testEntityId, "tests", "FUN", { param1: "value1", param2: 2 })
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.basicEmptyResponseSuccess;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/FUN()");
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl + "/FUN(param1=@p1,param2=@p2)?@p1='value1'&@p2=2");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
            expect(this.requests[1].method).to.equal('GET');
        });

        it("does not send the data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[1].requestBody)).to.be.null;
        });

        it("does not have MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
            expect(this.requests[1].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
            expect(responseObject2).to.be.undefined;
        });
    });

    describe("bound impersonation", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dynamicsWebApiTest.executeBoundFunction(mocks.data.testEntityId, "tests", "FUN", null, mocks.data.testEntityId)
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.response200;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.executeBoundFunction(mocks.data.testEntityId, "tests", "FUN", { param1: "value1", param2: 2 }, mocks.data.testEntityId)
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.response200;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/FUN()");
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl + "/FUN(param1=@p1,param2=@p2)?@p1='value1'&@p2=2");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
            expect(this.requests[1].method).to.equal('GET');
        });

        it("does not send the data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[1].requestBody)).to.be.null;
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId);
            expect(this.requests[1].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
            expect(responseObject2).to.deep.equal(mocks.data.testEntity);
        });
    });
});

describe("dynamicsWebApi.executeAction -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("unbound", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.executeUnboundAction("FUN", mocks.responses.actionRequest)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.webApiUrl + "FUN");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('POST');
        });

        it("does not send the data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.responses.actionRequestModified);
        });

        it("does not have MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });

    describe("unbound impersonation", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.executeUnboundAction("FUN", mocks.responses.actionRequest, mocks.data.testEntityId2)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.webApiUrl + "FUN");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('POST');
        });

        it("does not send the data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.responses.actionRequestModified);
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId2);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
        });
    });

    describe("bound", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.executeBoundAction(mocks.data.testEntityId, "tests", "FUN", mocks.responses.actionRequest)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.response200;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/FUN");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('POST');
        });

        it("does not send the data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.responses.actionRequestModified);
        });

        it("does not have MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
        });
    });

    describe("bound impersonation", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.executeBoundAction(mocks.data.testEntityId, "tests", "FUN", mocks.responses.actionRequest, mocks.data.testEntityId2)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.response200;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/FUN");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('POST');
        });

        it("does not send the data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.responses.actionRequestModified);
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId2);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
        });
    });
});

describe("dynamicsWebApi._convertOptions -", function () {
    var stubUrl = mocks.webApiUrl + "tests";
    //{ url: url, query: query, headers: headers }
    it("request is empty", function () {
        var dwaRequest;

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl, "&");
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(null, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions({}, "", stubUrl, "&");
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

    });

    it("count=true", function () {
        var dwaRequest = {
            count: true
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$count=true", headers: {} });
    });

    it("count=false", function () {
        var dwaRequest = {
            count: false
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("expand is empty", function () {
        var dwaRequest = {
            expand: undefined
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            expand: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            expand: []
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("expand - filter without expand.property", function () {
        var dwaRequest = {
            expand: [{
                filter: "name eq 'name'"
            }]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            expand: [{
                filter: "name eq 'name'",
                property: null
            }]
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("expand - property", function () {
        var dwaRequest = {
            expand: [{
                property: "property"
            }]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });
    });

    it("expand - property,filter empty", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                filter: ""
            }]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                filter: null
            }]
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });
    });

    it("expand - property,filter", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                filter: "name eq 'name'"
            }]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($filter=" + encodeURI("name eq 'name'") + ")", headers: {} });
    });

    it("expand - property,orderBy empty", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                orderBy: []
            }]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                orderBy: null
            }]
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });
    });

    it("expand - property,orderBy", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                orderBy: ["name"]
            }]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($orderBy=name)", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                orderBy: ["name", "subject"]
            }]
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($orderBy=name,subject)", headers: {} });
    });

    it("expand - property,select empty", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                select: []
            }]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                select: null
            }]
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });
    });

    it("expand - property,select", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                select: ["name"]
            }]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($select=name)", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                select: ["name", "subject"]
            }]
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($select=name,subject)", headers: {} });
    });

    it("expand - property,top empty or <=0", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                top: 0
            }]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                top: -1
            }]
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                top: null
            }]
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });
    });

    it("expand - property,top", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                top: 3
            }]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($top=3)", headers: {} });
    });

    it("expand - different properties", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                select: ["name", "subject"],
                top: 3
            }]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($select=name,subject;$top=3)", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                select: ["name", "subject"],
                orderBy: ["order"],
                top: 3
            }]
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($select=name,subject;$top=3;$orderBy=order)", headers: {} });
    });

    it("filter empty", function () {
        var dwaRequest = {
            filter: ""
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            filter: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("filter", function () {
        var dwaRequest = {
            filter: "name eq 'name'"
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$filter=name eq 'name'", headers: {} });
    });

    it("ifmatch empty", function () {
        var dwaRequest = {
            ifmatch: ""
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            ifmatch: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("ifmatch", function () {
        var dwaRequest = {
            ifmatch: "*"
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: { "If-Match": "*" } });
    });

    it("ifnonematch empty", function () {
        var dwaRequest = {
            ifnonematch: ""
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            ifnonematch: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("ifnonematch", function () {
        var dwaRequest = {
            ifnonematch: "*"
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: { "If-None-Match": "*" } });
    });

    it("impersonate empty", function () {
        var dwaRequest = {
            impersonate: ""
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            impersonate: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("impersonate", function () {
        var dwaRequest = {
            impersonate: mocks.data.testEntityId
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: { "MSCRMCallerID": mocks.data.testEntityId } });
    });

    it("includeAnnotations empty", function () {
        var dwaRequest = {
            includeAnnotations: ""
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            includeAnnotations: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("includeAnnotations", function () {
        var dwaRequest = {
            includeAnnotations: DWA.Prefer.Annotations.AssociatedNavigationProperty
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: { Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"' } });
    });

    it("maxPageSize empty or <=0", function () {
        var dwaRequest = {
            maxPageSize: 0
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            maxPageSize: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            maxPageSize: -2
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("maxPageSize", function () {
        var dwaRequest = {
            maxPageSize: 10
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: { Prefer: 'odata.maxpagesize=10' } });
    });

    it("navigationProperty empty", function () {
        var dwaRequest = {
            navigationProperty: ""
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            navigationProperty: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("navigationProperty", function () {
        var dwaRequest = {
            navigationProperty: "nav"
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav", query: "", headers: {} });
    });

    it("orderBy empty", function () {
        var dwaRequest = {
            orderBy: []
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            orderBy: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("orderBy", function () {
        var dwaRequest = {
            orderBy: ["name"]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$orderBy=name", headers: {} });

        dwaRequest = {
            orderBy: ["name", "subject"]
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "$orderBy=name,subject", headers: {}
        });
    });

    it("returnRepresentation empty", function () {
        var dwaRequest = {
            returnRepresentation: false
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            returnRepresentation: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("returnRepresentation", function () {
        var dwaRequest = {
            returnRepresentation: true
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });
    });

    it("select empty", function () {
        var dwaRequest = {
            select: []
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            select: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("select", function () {
        var dwaRequest = {
            select: ["name"]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$select=name", headers: {} });

        dwaRequest = {
            select: ["name", "subject"]
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$select=name,subject", headers: {} });
    });

    it("select navigation property", function () {
        var dwaRequest = {
            select: ["/nav"]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "retrieve", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav", query: "", headers: {} });

        dwaRequest = {
            select: ["/nav", "subject"]
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "retrieve", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav", query: "$select=subject", headers: {} });

        dwaRequest = {
            select: ["/nav", "subject", "fullname"]
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "retrieve", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav", query: "$select=subject,fullname", headers: {} });
    });

    it("select reference", function () {
        var dwaRequest = {
            select: ["nav/$ref"]
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "retrieve", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav/$ref", query: "", headers: {} });
    });

    it("top empty or <=0", function () {
        var dwaRequest = {
            top: 0
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            top: -1
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            top: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("top", function () {
        var dwaRequest = {
            top: 3
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$top=3", headers: {} });
    });

    it("savedQuery empty", function () {
        var dwaRequest = {
            savedQuery: ""
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            savedQuery: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("savedQuery", function () {
        var dwaRequest = {
            savedQuery: mocks.data.testEntityId
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "savedQuery=" + mocks.data.testEntityId, headers: {} });
    });

    it("userQuery empty", function () {
        var dwaRequest = {
            userQuery: ""
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            userQuery: null
        };

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("userQuery", function () {
        var dwaRequest = {
            userQuery: mocks.data.testEntityId
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "userQuery=" + mocks.data.testEntityId, headers: {} });
    });

    it("multiple options", function () {
        var dwaRequest = {
            select: ["name", "subject"],
            orderBy: ["order"],
            top: 5
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$select=name,subject&$top=5&$orderBy=order", headers: {} });

        dwaRequest.expand = [{
            property: "property",
            select: ["name"],
            orderBy: ["order"]
        }, {
            property: "property2",
            select: ["name3"]
        }];

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$select=name,subject&$top=5&$orderBy=order&$expand=property($select=name;$orderBy=order),property2($select=name3)", headers: {} });

        dwaRequest.expand = null;
        dwaRequest.returnRepresentation = true;

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$select=name,subject&$top=5&$orderBy=order", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });

        dwaRequest.top = 0;
        dwaRequest.count = true;
        dwaRequest.impersonate = mocks.data.testEntityId;

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$select=name,subject&$count=true&$orderBy=order", headers: { Prefer: DWA.Prefer.ReturnRepresentation, MSCRMCallerID: mocks.data.testEntityId } });

        dwaRequest.impersonate = null;
        dwaRequest.navigationProperty = "nav";

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav", query: "$select=name,subject&$count=true&$orderBy=order", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });

        dwaRequest.navigationProperty = null;
        dwaRequest.returnRepresentation = false;
        dwaRequest.includeAnnotations = DWA.Prefer.Annotations.All;
        dwaRequest.select[0] = "/nav";

        result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "retrieve", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav", query: "$select=subject&$count=true&$orderBy=order", headers: { Prefer: 'odata.include-annotations="*"' } });
    });
});

describe("dynamicsWebApi._convertRequestToLink -", function () {
    //{ url: result.url, headers: result.headers }
    it("collection", function () {
        var dwaRequest = {
            collection: "cols"
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
        expect(result).to.deep.equal({ url: "cols", headers: {} });
    });

    it("collection empty - throw error", function () {
        var dwaRequest = {
            collection: ""
        };

        var test = function () {
            dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
        }

        expect(test).to.throw(/request\.collection/);

        dwaRequest.collection = 0;
        expect(test).to.throw(/request\.collection/);

        dwaRequest.collection = null;
        expect(test).to.throw(/request\.collection/);
    });

    it("collection, id empty", function () {
        var dwaRequest = {
            collection: "cols",
            id: null
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
        expect(result).to.deep.equal({ url: "cols", headers: {} });

        dwaRequest.id = "";

        result = dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
        expect(result).to.deep.equal({ url: "cols", headers: {} });
    });

    it("collection, id - wrong format throw error", function () {
        var dwaRequest = {
            collection: "cols",
            id: "sa"
        };

        var test = function () {
            dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
        }

        expect(test).to.throw(/request\.id/);
    });

    it("collection, id", function () {
        var dwaRequest = {
            collection: "cols",
            id: mocks.data.testEntityId
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
        expect(result).to.deep.equal({ url: "cols(" + mocks.data.testEntityId + ")", headers: {} });
    });

    it("full", function () {
        var dwaRequest = {
            collection: "cols",
            id: mocks.data.testEntityId,
            select: ["name"],
            returnRepresentation: true
        };

        var result = dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
        expect(result).to.deep.equal({ url: "cols(" + mocks.data.testEntityId + ")?$select=name", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });

        dwaRequest.navigationProperty = "nav";

        result = dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
        expect(result).to.deep.equal({ url: "cols(" + mocks.data.testEntityId + ")/nav?$select=name", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });
    });
});

describe("dynamicsWebApi.updateRequest -", function () {
    var dwaRequest = {
        id: mocks.data.testEntityId,
        collection: "tests",
        entity: mocks.data.testEntity
    }

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.updateRequest(dwaRequest)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PATCH');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("does not have Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
        });

        it("sends the right If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.equal("*");
        });

        it("returns the correct response", function () {
            expect(responseObject).to.equal(true);
        });
    });

    describe("return representation", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dwaRequest.returnRepresentation = true;

            dynamicsWebApiTest.updateRequest(dwaRequest)
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.updateReturnRepresentation;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dwaRequest.select = ["fullname", "subject"];

            dynamicsWebApiTest.updateRequest(dwaRequest)
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.updateReturnRepresentation;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl);
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname,subject");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PATCH');
            expect(this.requests[1].method).to.equal('PATCH');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[1].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("sends the Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
            expect(this.requests[1].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
        });

        it("sends the right If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.equal("*");
            expect(this.requests[1].requestHeaders['If-Match']).to.equal("*");
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.updatedEntity);
            expect(responseObject2).to.deep.equal(mocks.data.updatedEntity);
        });
    });

    describe("change if-match header", function () {
        var responseObject;
        var responseObject2;
        var responseObject3;
        before(function (done) {
            dwaRequest.select = ["fullname", "subject"];
            dwaRequest.ifmatch = "match";
            dwaRequest.returnRepresentation = false;
            dynamicsWebApiTest
                .updateRequest(dwaRequest)
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dwaRequest.returnRepresentation = true;

            dynamicsWebApiTest
                .updateRequest(dwaRequest)
                .then(function (object) {
                    responseObject2 = object;
                }).catch(function (object) {
                    responseObject2 = object;
                });

            var response2 = mocks.responses.upsertPreventUpdateResponse;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);

            dynamicsWebApiTest
                .updateRequest(dwaRequest)
                .then(function (object) {
                    responseObject3 = object;
                    done();
                }).catch(function (object) {
                    responseObject3 = object;
                    done();
                });

            var response3 = mocks.responses.upsertPreventCreateResponse;
            this.requests[2].respond(response3.status, response3.responseHeaders, response3.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname,subject");
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname,subject");
            expect(this.requests[2].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname,subject");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PATCH');
            expect(this.requests[1].method).to.equal('PATCH');
            expect(this.requests[2].method).to.equal('PATCH');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[1].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[2].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("sends the Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
            expect(this.requests[1].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
            expect(this.requests[2].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
        });

        it("sends the right If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.equal("match");
            expect(this.requests[1].requestHeaders['If-Match']).to.equal("match");
            expect(this.requests[2].requestHeaders['If-Match']).to.equal("match");
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(true);
            expect(responseObject2).to.deep.equal(false);
            expect(responseObject3.status).to.deep.equal(404);
        });
    });
});

describe("dynamicsWebApi.upsertRequest -", function () {
    var dwaRequest = {
        id: mocks.data.testEntityId,
        collection: "tests",
        entity: mocks.data.testEntity
    }

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic & return representation", function () {
        var responseObject;
        var responseObject2;
        var responseObject3;
        var responseObject4;
        before(function (done) {
            dynamicsWebApiTest.upsertRequest(dwaRequest)
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.upsertRequest(dwaRequest)
                .then(function (object) {
                    responseObject2 = object;
                }).catch(function (object) {
                    responseObject2 = object;
                });

            var response2 = mocks.responses.createReturnId;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);

            dwaRequest.returnRepresentation = true;

            dynamicsWebApiTest.upsertRequest(dwaRequest)
                .then(function (object) {
                    responseObject3 = object;
                }).catch(function (object) {
                    responseObject3 = object;
                });

            var response3 = mocks.responses.updateReturnRepresentation;
            this.requests[2].respond(response3.status, response3.responseHeaders, response3.responseText);

            dwaRequest.select = ["name"];

            dynamicsWebApiTest.upsertRequest(dwaRequest)
                .then(function (object) {
                    responseObject4 = object;
                    done();
                }).catch(function (object) {
                    responseObject4 = object;
                    done();
                });

            var response4 = mocks.responses.updateReturnRepresentation;
            this.requests[3].respond(response4.status, response4.responseHeaders, response4.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl);
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl);
            expect(this.requests[2].url).to.equal(mocks.responses.testEntityUrl);
            expect(this.requests[3].url).to.equal(mocks.responses.testEntityUrl + "?$select=name");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PATCH');
            expect(this.requests[1].method).to.equal('PATCH');
            expect(this.requests[2].method).to.equal('PATCH');
            expect(this.requests[3].method).to.equal('PATCH');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[1].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[2].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[3].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("sends the right Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
            expect(this.requests[1].requestHeaders['Prefer']).to.be.undefined;
            expect(this.requests[2].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
            expect(this.requests[3].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
        });

        it("does not have If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[1].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[2].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[3].requestHeaders['If-Match']).to.be.undefined;
        });

        it("does not have If-None-Match header", function () {
            expect(this.requests[0].requestHeaders['If-None-Match']).to.be.undefined;
            expect(this.requests[1].requestHeaders['If-None-Match']).to.be.undefined;
            expect(this.requests[2].requestHeaders['If-None-Match']).to.be.undefined;
            expect(this.requests[3].requestHeaders['If-None-Match']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
            expect(responseObject2).to.deep.equal(mocks.data.testEntityId);
            expect(responseObject3).to.deep.equal(mocks.data.updatedEntity);
            expect(responseObject4).to.deep.equal(mocks.data.updatedEntity);
        });
    });

    describe("If-Match", function () {
        var responseObject;
        var responseObject2;
        var responseObject3;
        before(function (done) {
            dwaRequest.select = null;
            dwaRequest.returnRepresentation = false;
            dwaRequest.ifmatch = "*";

            dynamicsWebApiTest.upsertRequest(dwaRequest)
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.upsertPreventCreateResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dwaRequest.returnRepresentation = true;

            dynamicsWebApiTest.upsertRequest(dwaRequest)
                .then(function (object) {
                    responseObject2 = object;
                }).catch(function (object) {
                    responseObject2 = object;
                });

            var response2 = mocks.responses.createReturnRepresentation;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);

            dynamicsWebApiTest.upsertRequest(dwaRequest)
                .then(function (object) {
                    responseObject3 = object;
                    done();
                }).catch(function (object) {
                    responseObject3 = object;
                    done();
                });

            var response3 = mocks.responses.upsertPreventUpdateResponse;
            this.requests[2].respond(response3.status, response3.responseHeaders, response3.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl);
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl);
            expect(this.requests[2].url).to.equal(mocks.responses.testEntityUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PATCH');
            expect(this.requests[1].method).to.equal('PATCH');
            expect(this.requests[2].method).to.equal('PATCH');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[1].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[2].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("sends the right Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
            expect(this.requests[1].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
            expect(this.requests[2].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
        });

        it("sends the correct If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.equal("*");
            expect(this.requests[1].requestHeaders['If-Match']).to.equal("*");
            expect(this.requests[2].requestHeaders['If-Match']).to.equal("*");
        });

        it("does not have If-None-Match header", function () {
            expect(this.requests[0].requestHeaders['If-None-Match']).to.be.undefined;
            expect(this.requests[1].requestHeaders['If-None-Match']).to.be.undefined;
            expect(this.requests[2].requestHeaders['If-None-Match']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
            expect(responseObject2).to.deep.equal(mocks.data.testEntity);
            expect(responseObject3.status).to.equal(mocks.responses.upsertPreventUpdateResponse.status);
        });
    });

    describe("If-None-Match", function () {
        var responseObject;
        var responseObject2;
        var responseObject3;
        before(function (done) {
            dwaRequest.select = null;
            dwaRequest.returnRepresentation = false;
            dwaRequest.ifmatch = null;
            dwaRequest.ifnonematch = "*";

            dynamicsWebApiTest.upsertRequest(dwaRequest)
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.upsertPreventUpdateResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dwaRequest.returnRepresentation = true;

            dynamicsWebApiTest.upsertRequest(dwaRequest)
                .then(function (object) {
                    responseObject2 = object;
                }).catch(function (object) {
                    responseObject2 = object;
                });

            var response2 = mocks.responses.createReturnRepresentation;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);

            dynamicsWebApiTest.upsertRequest(dwaRequest)
                .then(function (object) {
                    responseObject3 = object;
                    done();
                }).catch(function (object) {
                    responseObject3 = object;
                    done();
                });

            var response3 = mocks.responses.upsertPreventCreateResponse;
            this.requests[2].respond(response3.status, response3.responseHeaders, response3.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl);
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl);
            expect(this.requests[2].url).to.equal(mocks.responses.testEntityUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('PATCH');
            expect(this.requests[1].method).to.equal('PATCH');
            expect(this.requests[2].method).to.equal('PATCH');
        });

        it("sends the right data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[1].requestBody)).to.deep.equal(mocks.data.testEntity);
            expect(JSON.parse(this.requests[2].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("sends the right Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
            expect(this.requests[1].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
            expect(this.requests[2].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
        });

        it("does not have If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[1].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[2].requestHeaders['If-Match']).to.be.undefined;;
        });

        it("sends the correct If-None-Match header", function () {
            expect(this.requests[0].requestHeaders['If-None-Match']).to.equal("*");
            expect(this.requests[1].requestHeaders['If-None-Match']).to.equal("*");
            expect(this.requests[2].requestHeaders['If-None-Match']).to.equal("*");
        });

        it("returns the correct response", function () {
            expect(responseObject).to.be.undefined;
            expect(responseObject2).to.deep.equal(mocks.data.testEntity);
            expect(responseObject3.status).to.equal(mocks.responses.upsertPreventCreateResponse.status);
        });
    });
});

describe("dynamicsWebApi.retrieveRequest -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            var dwaRequest = {
                id: mocks.data.testEntityId,
                collection: "tests",
                expand: [{ property: "prop" }],
                impersonate: mocks.data.testEntityId2,
                ifmatch: "match"
            };

            dynamicsWebApiTest.retrieveRequest(dwaRequest)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.response200;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "?$expand=prop");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
        });

        it("sends the correct If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.equal("match");
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId2);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
        });
    });

    describe("retrieve reference", function () {
        var responseObject;
        before(function (done) {
            var dwaRequest = {
                id: mocks.data.testEntityId,
                collection: "tests",
                select: ["ownerid/$ref"],
                impersonate: mocks.data.testEntityId2,
                ifmatch: "match"
            };

            dynamicsWebApiTest.retrieveRequest(dwaRequest)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.retrieveReferenceResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "/ownerid/$ref");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
        });

        it("sends the correct If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.equal("match");
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId2);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.referenceResponseConverted);
        });
    });
});

describe("dynamicsWebApi.retrieveMultiple -", function () {

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.retrieveMultiple("tests")
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.multipleResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
        });

        it("does not send If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.be.undefined;
        });

        it("does not send MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.responses.multiple());
        });
    });

    describe("select", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dynamicsWebApiTest.retrieveMultiple("tests", ["fullname"])
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.multipleResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.retrieveMultiple("tests", ["fullname", "subject"])
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.multipleResponse;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl + "?$select=fullname");
            expect(this.requests[1].url).to.equal(mocks.responses.collectionUrl + "?$select=fullname,subject");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
            expect(this.requests[1].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[1].requestBody)).to.be.null;
        });

        it("does not send If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[1].requestHeaders['If-Match']).to.be.undefined;
        });

        it("does not send MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
            expect(this.requests[1].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.responses.multiple());
            expect(responseObject2).to.deep.equal(mocks.responses.multiple());
        });
    });

    describe("filter", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dynamicsWebApiTest.retrieveMultiple("tests", null, "name eq 'name'")
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.multipleResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.retrieveMultiple("tests", ["fullname"], "name eq 'name'")
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.multipleResponse;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl + "?$filter=name%20eq%20'name'");
            expect(this.requests[1].url).to.equal(mocks.responses.collectionUrl + "?$select=fullname&$filter=name%20eq%20'name'");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
            expect(this.requests[1].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[1].requestBody)).to.be.null;
        });

        it("does not send If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[1].requestHeaders['If-Match']).to.be.undefined;
        });

        it("does not send MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
            expect(this.requests[1].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.responses.multiple());
            expect(responseObject2).to.deep.equal(mocks.responses.multiple());
        });
    });

    describe("next page link", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dynamicsWebApiTest.retrieveMultiple("tests")
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.multipleWithLinkResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.retrieveMultiple(null, null, null, mocks.responses.multipleWithLink().oDataNextLink)
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.multipleResponse;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl);
            expect(this.requests[1].url).to.equal(mocks.responses.multipleWithLink().oDataNextLink);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
            expect(this.requests[1].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[1].requestBody)).to.be.null;
        });

        it("does not send If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[1].requestHeaders['If-Match']).to.be.undefined;
        });

        it("does not send MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
            expect(this.requests[1].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.responses.multipleWithLink());
            expect(responseObject2).to.deep.equal(mocks.responses.multiple());
        });
    });
});

describe("dynamicsWebApi.retrieveMultipleRequest -", function () {
    var dwaRequest = {
        collection: "tests",
        select: ["name"],
        includeAnnotations: DWA.Prefer.Annotations.FormattedValue
    };

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest)
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.multipleResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dwaRequest.count = true;

            dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest)
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.multipleWithCountResponse;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl + "?$select=name");
            expect(this.requests[1].url).to.equal(mocks.responses.collectionUrl + "?$select=name&$count=true");
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
            expect(this.requests[1].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[1].requestBody)).to.be.null;
        });

        it("does not send If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.be.undefined;
            expect(this.requests[1].requestHeaders['If-Match']).to.be.undefined;
        });

        it("sends the correct Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.equal('odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"');
            expect(this.requests[1].requestHeaders['Prefer']).to.equal('odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"');
        });

        it("does not send MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
            expect(this.requests[1].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.responses.multiple());
            expect(responseObject2).to.deep.equal(mocks.responses.multipleWithCount());
        });
    });

    describe("next page link", function () {
        var responseObject;
        var responseObject2;
        before(function (done) {
            dwaRequest.count = false;
            dwaRequest.impersonate = mocks.data.testEntityId2;

            dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest)
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.multipleWithLinkResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest, mocks.responses.multipleWithLink().oDataNextLink)
                .then(function (object) {
                    responseObject2 = object;
                    done();
                }).catch(function (object) {
                    responseObject2 = object;
                    done();
                });

            var response2 = mocks.responses.multipleResponse;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl + "?$select=name");
            expect(this.requests[1].url).to.equal(mocks.responses.multipleWithLink().oDataNextLink);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('GET');
            expect(this.requests[1].method).to.equal('GET');
        });

        it("does not send data", function () {
            expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            expect(JSON.parse(this.requests[1].requestBody)).to.be.null;
        });

        it("sends the correct Prefer header", function () {
            expect(this.requests[0].requestHeaders['Prefer']).to.equal('odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"');
            expect(this.requests[1].requestHeaders['Prefer']).to.equal('odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"');
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId2);
            expect(this.requests[1].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId2);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.responses.multipleWithLink());
            expect(responseObject2).to.deep.equal(mocks.responses.multiple());
        });
    });
});

describe("dynamicsWebApi.deleteRequest -", function () {

    var dwaRequest = {
        collection: "tests",
        id: mocks.data.testEntityId,
        impersonate: mocks.data.testEntityId2
    };

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("basic", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiTest.deleteRequest(dwaRequest)
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('DELETE');
        });

        it("does not send data", function () {
            expect(this.requests[0].requestBody).to.be.undefined;
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId2);
        });

        it("does not send If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject).to.equal(true);
        });
    });

    describe("If-Match", function () {
        var responseObject;
        var responseObject2;
        var responseObject3;
        before(function (done) {
            dwaRequest.ifmatch = "match";
            dynamicsWebApiTest.deleteRequest(dwaRequest)
                .then(function (object) {
                    responseObject = object;
                }).catch(function (object) {
                    responseObject = object;
                });

            var response = mocks.responses.basicEmptyResponseSuccess;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

            dynamicsWebApiTest.deleteRequest(dwaRequest)
                .then(function (object) {
                    responseObject2 = object;
                }).catch(function (object) {
                    responseObject2 = object;
                });

            var response2 = mocks.responses.upsertPreventUpdateResponse;
            this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);

            dynamicsWebApiTest.deleteRequest(dwaRequest)
                .then(function (object) {
                    responseObject3 = object;
                    done();
                }).catch(function (object) {
                    responseObject3 = object;
                    done();
                });

            var response3 = mocks.responses.upsertPreventCreateResponse;
            this.requests[2].respond(response3.status, response3.responseHeaders, response3.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl);
            expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl);
            expect(this.requests[2].url).to.equal(mocks.responses.testEntityUrl);
        });

        it("uses the correct method", function () {
            expect(this.requests[0].method).to.equal('DELETE');
            expect(this.requests[1].method).to.equal('DELETE');
            expect(this.requests[2].method).to.equal('DELETE');
        });

        it("does not send data", function () {
            expect(this.requests[0].requestBody).to.be.undefined;
            expect(this.requests[1].requestBody).to.be.undefined;
            expect(this.requests[2].requestBody).to.be.undefined;
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId2);
            expect(this.requests[1].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId2);
            expect(this.requests[2].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId2);
        });

        it("sends the correct If-Match header", function () {
            expect(this.requests[0].requestHeaders['If-Match']).to.equal("match");
            expect(this.requests[1].requestHeaders['If-Match']).to.equal("match");
            expect(this.requests[2].requestHeaders['If-Match']).to.equal("match");
        });

        it("returns the correct response", function () {
            expect(responseObject).to.equal(true);
            expect(responseObject2).to.equal(false);
            expect(responseObject3.status).to.equal(404);
        });
    });
});

describe("dynamicsWebApi.constructor -", function () {
    var dynamicsWebApi80 = new DynamicsWebApi();

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("webApiVersion and impersonate", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApi80.create(mocks.data.testEntity, "tests")
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.createReturnId;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.webApiUrl80 + "tests");
        });

        it("does not send MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });
    });
});

describe("dynamicsWebApi.setConfig -", function () {
    var dynamicsWebApi81 = new DynamicsWebApi();
    dynamicsWebApi81.setConfig({ webApiVersion: "8.1", impersonate: mocks.data.testEntityId2 });

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("webApiVersion and impersonate", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApi81.create(mocks.data.testEntity, "tests")
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.createReturnId;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.webApiUrl81 + "tests");
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId2);
        });
    });

    describe("impersonate overriden with a request.impersonate", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApi81.retrieveMultipleRequest({ collection: "tests", impersonate: mocks.data.testEntityId3 })
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.multipleResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.webApiUrl81 + "tests");
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId3);
        });
    });

    describe("webApiVersion is overriden by mocks.webApiUrl", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApi81.setConfig({ webApiUrl: mocks.webApiUrl });
            dynamicsWebApi81.retrieveMultipleRequest({ collection: "tests" })
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.multipleResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl);
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId2);
        });
    });
});

describe("dynamicsWebApi.initializeInstance -", function () {
    var dynamicsWebApi81 = new DynamicsWebApi();
    dynamicsWebApi81.setConfig({ webApiVersion: "8.1", impersonate: mocks.data.testEntityId2 });
    dynamicsWebApiCopy = dynamicsWebApi81.initializeInstance();

    before(function () {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        global.XMLHttpRequest.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    after(function () {
        global.XMLHttpRequest.restore();
    });

    describe("current instance copied with its config", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiCopy.create(mocks.data.testEntity, "tests")
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.createReturnId;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.webApiUrl81 + "tests");
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.equal(mocks.data.testEntityId2);
        });
    });

    describe("config changed", function () {
        var responseObject;
        before(function (done) {
            dynamicsWebApiCopy = dynamicsWebApi81.initializeInstance({ webApiVersion: "8.2" });
            dynamicsWebApiCopy.retrieveMultipleRequest({ collection: "tests" })
                .then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.multipleResponse;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl);
        });

        it("does not send MSCRMCallerID header", function () {
            expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
        });
    });
});