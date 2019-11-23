var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');

var mocks = require("./stubs");
var DWA = require("../lib/dwa");
var DynamicsWebApi = require("../lib/dynamics-web-api");
var dynamicsWebApiTest = new DynamicsWebApi({ webApiVersion: "8.2" });

describe("xhr -", function () {
    describe("dynamicsWebApi.create -", function () {
        describe("basic", function () {
            var responseObject;
            before(function (done) {
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function (xhr) {
                    requests.push(xhr);
                };

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

            after(function () {
                global.XMLHttpRequest.restore();
                global.XMLHttpRequest = null;
            });

            it("sends the request to the right end point", function () {
                expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ''));
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

        describe("crm error", function () {
            var responseObject;
            before(function (done) {
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function (xhr) {
                    requests.push(xhr);
                };

                dynamicsWebApiTest.create(mocks.data.testEntity, "tests").then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

                var response = mocks.responses.upsertPreventCreateResponse;
                this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
            });

            after(function () {
                global.XMLHttpRequest.restore();
                global.XMLHttpRequest = null;
            });

            it("sends the request to the right end point", function () {
                expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ''));
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
                expect(responseObject).to.deep.equal({ message: "message", status: 404, statusText: "Not Found" });
            });
        });

        describe("unexpected error", function () {
            var responseObject;
            before(function (done) {
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function (xhr) {
                    requests.push(xhr);
                };

                dynamicsWebApiTest.create(mocks.data.testEntity, "tests").then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

                var response = mocks.responses.upsertPreventCreateResponse;
                this.requests[0].respond(response.status, response.responseHeaders);
            });

            after(function () {
                global.XMLHttpRequest.restore();
                global.XMLHttpRequest = null;
            });

            it("sends the request to the right end point", function () {
                expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ''));
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
                expect(responseObject).to.deep.equal({ message: "Unexpected Error", status: 404, statusText: "Not Found" });
            });
        });

        describe("not crm error", function () {
            var responseObject;
            before(function (done) {
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function (xhr) {
                    requests.push(xhr);
                };

                dynamicsWebApiTest.create(mocks.data.testEntity, "tests").then(function (object) {
                    responseObject = object;
                    done();
                }).catch(function (object) {
                    responseObject = object;
                    done();
                });

                var response = mocks.responses.upsertPreventCreateResponse;
                this.requests[0].respond(response.status, response.responseHeaders, 'something');
            });

            after(function () {
                global.XMLHttpRequest.restore();
                global.XMLHttpRequest = null;
            });

            it("sends the request to the right end point", function () {
                expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ''));
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
                var error = new Error("something");
                error.status = 404;
                error.statusText = "Not Found";

                expect(responseObject.message).to.equal(error.message);
                expect(responseObject.status).to.equal(error.status);
                expect(responseObject.statusText).to.equal(error.statusText);
            });
        });
    });

    describe("dynamicsWebApi.executeBatch - ", function () {
        describe("update / delete - returns an error", function () {
            var responseObject;
            var rBody = mocks.data.batchUpdateDelete;
            var rBodys = rBody.split('\n');
            var checkBody = '';
            for (var i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }
            before(function (done) {
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function (xhr) {
                    requests.push(xhr);
                };

                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.update(mocks.data.testEntityId2, 'records', { firstname: "Test", lastname: "Batch!" });
                dynamicsWebApiTest.deleteRecord(mocks.data.testEntityId2, 'records', 'firstname');

                dynamicsWebApiTest.executeBatch()
                    .then(function (object) {
                        responseObject = object;
                        done();
                    }).catch(function (object) {
                        responseObject = object;
                        done();
                    });

                var response = mocks.responses.batchError;
                this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
            });

            after(function () {
                global.XMLHttpRequest.restore();
                global.XMLHttpRequest = null;
            });

            it("sends the request to the right end point", function () {
                expect(this.requests[0].url).to.equal(mocks.webApiUrl + '$batch');
            });

            it("uses the correct method", function () {
                expect(this.requests[0].method).to.equal('POST');
            });

            it("sends the right data", function () {
                function filterBody(body) {
                    body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'dwa_batch_XXX');
                    body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'changeset_XXX');
                    var bodys = body.split('\n');

                    var resultBody = '';
                    for (var i = 0; i < bodys.length; i++) {
                        resultBody += bodys[i];
                    }
                    return resultBody;
                }

                expect(filterBody(this.requests[0].requestBody)).to.deep.equal(checkBody);
            });

            it("does not have Prefer header", function () {
                expect(this.requests[0].requestHeaders['Prefer']).to.be.undefined;
            });

            it("returns the correct response", function () {
                expect(responseObject.length).to.be.eq(1);

                expect(responseObject[0].error).to.deep.equal({
                    "code": "0x0", "message": "error", "innererror": { "message": "error", "type": "Microsoft.Crm.CrmHttpException", "stacktrace": "stack" }
                });

                expect(responseObject[0].status).to.equal(400);
                expect(responseObject[0].statusMessage).to.equal("Bad Request");
                expect(responseObject[0].statusText).to.equal("Bad Request");
            });
        });
    });

    describe("return representation", function () {
        var responseObject;
        before(function (done) {
            global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
            var requests = this.requests = [];

            global.XMLHttpRequest.onCreate = function (xhr) {
                requests.push(xhr);
            };

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
            expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ''));
        });

        after(function () {
            global.XMLHttpRequest.restore();
            global.XMLHttpRequest = null;
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
    describe("dynamicsWebApi.updateRequest -", function () {

        describe("change if-match header", function () {
            var dwaRequest = {
                id: mocks.data.testEntityId,
                collection: "tests",
                entity: mocks.data.testEntity
            };

            var responseObject;
            var responseObject2;
            var responseObject3;
            before(function (done) {
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function (xhr) {
                    requests.push(xhr);
                };

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

            after(function () {
                global.XMLHttpRequest.restore();
                global.XMLHttpRequest = null;
            });

            it("sends the request to the right end point", function () {
                expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, '') + "?$select=fullname,subject");
                expect(this.requests[1].url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, '') + "?$select=fullname,subject");
                expect(this.requests[2].url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, '') + "?$select=fullname,subject");
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
                expect(responseObject).to.equal(true);
                expect(responseObject2).to.equal(false);
                expect(responseObject3.status).to.equal(404);
            });
        });
    });

    describe("dynamicsWebApi.retrieveRequest -", function () {

        describe("basic", function () {
            var responseObject;
            before(function (done) {
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function (xhr) {
                    requests.push(xhr);
                };

                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    expand: [{ property: "prop" }]
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

            after(function () {
                global.XMLHttpRequest.restore();
                global.XMLHttpRequest = null;
            });

            it("sends the request to the right end point", function () {
                expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, '') + "?$expand=prop");
            });

            it("uses the correct method", function () {
                expect(this.requests[0].method).to.equal('GET');
            });

            it("does not send data", function () {
                expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            });

            it("sends the correct If-Match header", function () {
                expect(this.requests[0].requestHeaders['If-Match']).to.be.undefined;
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(this.requests[0].requestHeaders['MSCRMCallerID']).to.be.undefined;
            });

            it("returns the correct response", function () {
                expect(responseObject).to.deep.equal(mocks.data.testEntity);
            });
        });
    });

    describe("dynamicsWebApi.constructor -", function () {

        describe("authentication", function () {
            var responseObject;
            before(function (done) {
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function (xhr) {
                    requests.push(xhr);
                };

                var dwaRequest = {
                    id: mocks.data.testEntityId,
                    collection: "tests",
                    expand: [{ property: "prop" }]
                };

                var getToken = function (callback) { callback({ accessToken: "token001" }) };

                var dynamicsWebApiAuth = new DynamicsWebApi({
                    webApiVersion: "8.2", onTokenRefresh: getToken
                });

                dynamicsWebApiAuth.retrieveRequest(dwaRequest)
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

            after(function () {
                global.XMLHttpRequest.restore();
                global.XMLHttpRequest = null;
            });

            it("sends the request to the right end point", function () {
                expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, '') + "?$expand=prop");
            });

            it("uses the correct method", function () {
                expect(this.requests[0].method).to.equal('GET');
            });

            it("does not send data", function () {
                expect(JSON.parse(this.requests[0].requestBody)).to.be.null;
            });

            it("sends the correct Authorization header", function () {
                expect(this.requests[0].requestHeaders['Authorization']).to.equal("Bearer token001");
            });

            it("returns the correct response", function () {
                expect(responseObject).to.deep.equal(mocks.data.testEntity);
            });
        });
    });

    describe("dynamicsWebApi.retrieveMultiple -", function () {

        describe("basic", function () {
            var responseObject;
            before(function (done) {
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function (xhr) {
                    requests.push(xhr);
                };

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
                expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ''));
            });

            after(function () {
                global.XMLHttpRequest.restore();
                global.XMLHttpRequest = null;
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
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function (xhr) {
                    requests.push(xhr);
                };

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

            after(function () {
                global.XMLHttpRequest.restore();
                global.XMLHttpRequest = null;
            });

            it("sends the request to the right end point", function () {
                expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, '') + "?$select=fullname");
                expect(this.requests[1].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, '') + "?$select=fullname,subject");
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
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function (xhr) {
                    requests.push(xhr);
                };

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

            after(function () {
                global.XMLHttpRequest.restore();
                global.XMLHttpRequest = null;
            });

            it("sends the request to the right end point", function () {
                expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, '') + "?$filter=name%20eq%20'name'");
                expect(this.requests[1].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, '') + "?$select=fullname&$filter=name%20eq%20'name'");
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
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                var requests = this.requests = [];

                global.XMLHttpRequest.onCreate = function (xhr) {
                    requests.push(xhr);
                };

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
                expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ''));
                expect(this.requests[1].url).to.equal(mocks.responses.multipleWithLink().oDataNextLink);
            });

            after(function () {
                global.XMLHttpRequest.restore();
                global.XMLHttpRequest = null;
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

    describe("request error", function () {
        var responseObject;
        before(function (done) {
            global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
            var requests = this.requests = [];

            global.XMLHttpRequest.onCreate = function (xhr) {
                requests.push(xhr);
            };

            dynamicsWebApiTest.create(mocks.data.testEntity, "tests").then(function (object) {
                responseObject = object;
                done();
            }).catch(function (object) {
                responseObject = object;
                done();
            });

            this.requests[0].onerror();
        });

        after(function () {
            global.XMLHttpRequest.restore();
            global.XMLHttpRequest = null;
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ''));
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
            expect(responseObject).to.deep.equal({ message: "Network Error", status: 0, statusText: "" });
        });
    });

    describe("request timeout", function () {
        var responseObject;
        before(function (done) {
            global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
            var requests = this.requests = [];

            global.XMLHttpRequest.onCreate = function (xhr) {
                requests.push(xhr);
            };

            var dynamicsWebApiTimeout = new DynamicsWebApi({ webApiVersion: "8.2", timeout: 100 });

            dynamicsWebApiTimeout.create(mocks.data.testEntity, "tests").then(function (object) {
                responseObject = object;
                done();
            }).catch(function (object) {
                responseObject = object;
                done();
            });

            this.requests[0].ontimeout();
        });

        after(function () {
            global.XMLHttpRequest.restore();
            global.XMLHttpRequest = null;
        });

        it("sends the request to the right end point", function () {
            expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ''));
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
            expect(responseObject).to.deep.equal({ message: "Request Timed Out", status: 0, statusText: "" });
        });
    });
});