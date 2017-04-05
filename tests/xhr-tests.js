var chai = require('chai');
var expect = chai.expect;
var nock = require('nock');

var sinon = require('sinon');

var mocks = require("./stubs");
var DWA = require("../lib/dwa");
var DynamicsWebApi = require("../lib/dynamics-web-api");
var dynamicsWebApiTest = new DynamicsWebApi({ webApiVersion: "8.2" });

describe("xhr -", function() {
    describe("dynamicsWebApi.create -", function() {
        describe("basic", function() {
            var responseObject;
            before(function(done) {
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function(xhr) {
                    requests.push(xhr);
                };

                dynamicsWebApiTest.create(mocks.data.testEntity, "tests").then(function(object) {
                    responseObject = object;
                    done();
                }).catch(function(object) {
                    responseObject = object;
                    done();
                });

                var response = mocks.responses.createReturnId;
                this.requests[0].respond(response.status, response.responseHeaders);
            });

            after(function() {
                global.XMLHttpRequest.restore();
                global.XMLHttpRequest = null;
            });

            it("sends the request to the right end point", function() {
                expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl);
            });

            it("uses the correct method", function() {
                expect(this.requests[0].method).to.equal('POST');
            });

            it("sends the right data", function() {
                expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
            });

            it("does not have Prefer header", function() {
                expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
            });

            it("returns the correct response", function() {
                expect(responseObject).to.deep.equal(mocks.data.testEntityId);
            });
        });
    });

    describe("return representation", function() {
        var responseObject;
        before(function(done) {
            global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
            var requests = this.requests = [];

            global.XMLHttpRequest.onCreate = function(xhr) {
                requests.push(xhr);
            };

            dynamicsWebApiTest
                .create(mocks.data.testEntity, "tests", DWA.Prefer.ReturnRepresentation)
                .then(function(object) {
                    responseObject = object;
                    done();
                }).catch(function(object) {
                    responseObject = object;
                    done();
                });

            var response = mocks.responses.createReturnRepresentation;
            this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
        });

        it("sends the request to the right end point", function() {
            expect(this.requests[0].url).to.equal(mocks.responses.collectionUrl);
        });

        after(function() {
            global.XMLHttpRequest.restore();
            global.XMLHttpRequest = null;
        });

        it("uses the correct method", function() {
            expect(this.requests[0].method).to.equal('POST');
        });

        it("sends the right data", function() {
            expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("sends the Prefer header", function() {
            expect(this.requests[0].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
        });

        it("returns the correct response", function() {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
        });
    });
    describe("dynamicsWebApi.updateRequest -", function() {
        
        describe("change if-match header", function() {
            var dwaRequest = {
                id: mocks.data.testEntityId,
                collection: "tests",
                entity: mocks.data.testEntity
            }

            var responseObject;
            var responseObject2;
            var responseObject3;
            before(function(done) {
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function(xhr) {
                    requests.push(xhr);
                };

                dwaRequest.select = ["fullname", "subject"];
                dwaRequest.ifmatch = "match";
                dwaRequest.returnRepresentation = false;
                dynamicsWebApiTest
                    .updateRequest(dwaRequest)
                    .then(function(object) {
                        responseObject = object;
                    }).catch(function(object) {
                        responseObject = object;
                    });

                var response = mocks.responses.basicEmptyResponseSuccess;
                this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

                dwaRequest.returnRepresentation = true;

                dynamicsWebApiTest
                    .updateRequest(dwaRequest)
                    .then(function(object) {
                        responseObject2 = object;
                    }).catch(function(object) {
                        responseObject2 = object;
                    });

                var response2 = mocks.responses.upsertPreventUpdateResponse;
                this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);

                dynamicsWebApiTest
                    .updateRequest(dwaRequest)
                    .then(function(object) {
                        responseObject3 = object;
                        done();
                    }).catch(function(object) {
                        responseObject3 = object;
                        done();
                    });

                var response3 = mocks.responses.upsertPreventCreateResponse;
                this.requests[2].respond(response3.status, response3.responseHeaders, response3.responseText);
            });

            after(function() {
                global.XMLHttpRequest.restore();
            });

            it("sends the request to the right end point", function() {
                expect(this.requests[0].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname,subject");
                expect(this.requests[1].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname,subject");
                expect(this.requests[2].url).to.equal(mocks.responses.testEntityUrl + "?$select=fullname,subject");
            });

            it("uses the correct method", function() {
                expect(this.requests[0].method).to.equal('PATCH');
                expect(this.requests[1].method).to.equal('PATCH');
                expect(this.requests[2].method).to.equal('PATCH');
            });

            it("sends the right data", function() {
                expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
                expect(JSON.parse(this.requests[1].requestBody)).to.deep.equal(mocks.data.testEntity);
                expect(JSON.parse(this.requests[2].requestBody)).to.deep.equal(mocks.data.testEntity);
            });

            it("sends the Prefer header", function() {
                expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
                expect(this.requests[1].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
                expect(this.requests[2].requestHeaders['Prefer']).to.equal(DWA.Prefer.ReturnRepresentation);
            });

            it("sends the right If-Match header", function() {
                expect(this.requests[0].requestHeaders['If-Match']).to.equal("match");
                expect(this.requests[1].requestHeaders['If-Match']).to.equal("match");
                expect(this.requests[2].requestHeaders['If-Match']).to.equal("match");
            });

            it("returns the correct response", function() {
                expect(responseObject).to.equal(true);
                expect(responseObject2).to.equal(false);
                expect(responseObject3.status).to.equal(404);
            });
        });
    });
});