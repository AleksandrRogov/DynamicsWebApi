var chai = require("chai");
var expect = chai.expect;

var sinon = require("sinon");

var crypto = require("crypto");
var base64 = require("Base64");

var mocks = require("./stubs");
var { DWA } = require("../lib/dwa");
var { DynamicsWebApi } = require("../lib/dynamics-web-api");
var dynamicsWebApiTest = new DynamicsWebApi({ dataApi: { version: "8.2" } });

var { XhrWrapper } = require("../lib/client/xhr");
var { Utility } = require("../lib/utils/Utility");
Utility.downloadChunkSize = 15;

describe("xhr -", function () {
    before(function () {
        global.DWA_BROWSER = true;
        global.window = {
            btoa: base64.btoa,
            atob: base64.atob,
            crypto: crypto.webcrypto,
        };
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
    });
    after(function () {
        global.DWA_BROWSER = false;
        global.window = null;

        global.XMLHttpRequest = null;
    });

    // this.beforeAll(function () {

    // });

    // this.afterAll(function () {
    // });

    describe("dynamicsWebApi.create -", function () {
        describe("basic", function () {
            let responseObject;
            const requests = [];
            before(async function () {
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.createReturnId;
                    requests[0]?.respond(response.status, response.responseHeaders);
                };

                responseObject = await dynamicsWebApiTest.create({ data: mocks.data.testEntity, collection: "tests" });
            });

            after(() => {
                XhrWrapper.afterSendEvent = null;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("POST");
            });

            it("sends the right data", function () {
                expect(JSON.parse(requests[0]?.requestBody)).to.deep.equal(mocks.data.testEntity);
            });

            it("does not have Prefer header", function () {
                expect(requests[0]?.requestHeaders["Prefer"]).to.be.undefined;
            });

            it("returns the correct response", function () {
                expect(responseObject).to.deep.equal(mocks.data.testEntityId);
            });
        });

        describe("crm error", function () {
            let responseObject;
            const requests = [];
            before(async function () {
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.upsertPreventCreateResponse;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };
                try {
                    responseObject = await dynamicsWebApiTest.create({ data: mocks.data.testEntity, collection: "tests" });
                } catch (error) {
                    responseObject = error;
                }
            });

            after(function () {
                XhrWrapper.afterSendEvent = null;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("POST");
            });

            it("sends the right data", function () {
                expect(JSON.parse(requests[0]?.requestBody)).to.deep.equal(mocks.data.testEntity);
            });

            it("does not have Prefer header", function () {
                expect(requests[0]?.requestHeaders["Prefer"]).to.be.undefined;
            });

            it("returns the correct response", function () {
                expect(responseObject.message).to.eql("message");
                expect(responseObject.status).to.eql(404);
                expect(responseObject.statusText).to.eql("Not Found");
                expect(responseObject.headers).to.eql(mocks.responses.upsertPreventCreateResponse.responseHeaders);
            });
        });

        describe("unexpected error", function () {
            let responseObject;
            const requests = [];
            before(async function () {
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.upsertPreventCreateResponse;
                    requests[0]?.respond(response.status, response.responseHeaders);
                };

                try {
                    responseObject = await dynamicsWebApiTest.create({ data: mocks.data.testEntity, collection: "tests" });
                } catch (error) {
                    responseObject = error;
                }
            });

            after(function () {
                XhrWrapper.afterSendEvent = null;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("POST");
            });

            it("sends the right data", function () {
                expect(JSON.parse(requests[0]?.requestBody)).to.deep.equal(mocks.data.testEntity);
            });

            it("does not have Prefer header", function () {
                expect(requests[0]?.requestHeaders["Prefer"]).to.be.undefined;
            });

            it("returns the correct response", function () {
                expect(responseObject.message).to.eql("Unexpected Error");
                expect(responseObject.status).to.eql(404);
                expect(responseObject.statusText).to.eql("Not Found");
                expect(responseObject.headers).to.eql(mocks.responses.upsertPreventCreateResponse.responseHeaders);
            });
        });

        describe("not crm error", function () {
            var responseObject;
            const requests = [];
            before(async function () {
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    var response = mocks.responses.upsertPreventCreateResponse;
                    requests[0]?.respond(response.status, response.responseHeaders, "something");
                };

                try {
                    responseObject = await dynamicsWebApiTest.create({ data: mocks.data.testEntity, collection: "tests" });
                } catch (error) {
                    responseObject = error;
                }
            });

            after(function () {});

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("POST");
            });

            it("sends the right data", function () {
                expect(JSON.parse(requests[0]?.requestBody)).to.deep.equal(mocks.data.testEntity);
            });

            it("does not have Prefer header", function () {
                expect(requests[0]?.requestHeaders["Prefer"]).to.be.undefined;
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
            const requests = [];
            var responseObject;
            var rBody = mocks.data.batchUpdateDelete;
            var rBodys = rBody.split("\n");
            var checkBody = "";
            for (let i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }
            before(async function () {
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    var response = mocks.responses.batchError;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.update({ key: mocks.data.testEntityId2, collection: "records", data: { firstname: "Test", lastname: "Batch!" } });
                dynamicsWebApiTest.deleteRecord({ key: mocks.data.testEntityId2, collection: "records", navigationProperty: "firstname" });

                try {
                    responseObject = await dynamicsWebApiTest.executeBatch();
                    throw responseObject;
                } catch (error) {
                    responseObject = error;
                }
            });

            after(function () {});

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + "$batch");
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("POST");
            });

            it("sends the right data", function () {
                function filterBody(body) {
                    body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "dwa_batch_XXX");
                    body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "changeset_XXX");
                    var bodys = body.split("\n");

                    var resultBody = "";
                    for (var i = 0; i < bodys.length; i++) {
                        resultBody += bodys[i];
                    }
                    return resultBody;
                }

                expect(filterBody(requests[0]?.requestBody)).to.deep.equal(checkBody);
            });

            it("does not have Prefer header", function () {
                expect(requests[0]?.requestHeaders["Prefer"]).to.be.undefined;
            });

            it("returns the correct response", function () {
                expect(responseObject.length).to.be.eq(1);

                expect(responseObject[0].error).to.deep.equal({
                    code: "0x0",
                    message: "error",
                    innererror: { message: "error", type: "Microsoft.Crm.CrmHttpException", stacktrace: "stack" },
                });

                expect(responseObject[0].status).to.equal(400);
                expect(responseObject[0].statusMessage).to.equal("Bad Request");
                expect(responseObject[0].statusText).to.equal("Bad Request");
            });
        });
    });

    describe("return representation", function () {
        var responseObject;
        const requests = [];
        before(async function () {
            global.XMLHttpRequest.onCreate = (xhr) => {
                requests.push(xhr);
            };

            XhrWrapper.afterSendEvent = () => {
                var response = mocks.responses.createReturnRepresentation;
                requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
            };

            responseObject = await dynamicsWebApiTest.create({ data: mocks.data.testEntity, collection: "tests", returnRepresentation: true });
        });

        it("sends the request to the right end point", function () {
            expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
        });

        after(function () {
            XhrWrapper.afterSendEvent = undefined;
        });

        it("uses the correct method", function () {
            expect(requests[0]?.method).to.equal("POST");
        });

        it("sends the right data", function () {
            expect(JSON.parse(requests[0]?.requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("sends the Prefer header", function () {
            expect(requests[0]?.requestHeaders["Prefer"]).to.equal(DWA.Prefer.ReturnRepresentation);
        });

        it("returns the correct response", function () {
            expect(responseObject).to.deep.equal(mocks.data.testEntity);
        });
    });
    describe("dynamicsWebApi.update -", function () {
        describe("change if-match header", function () {
            const requests = [];
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                data: mocks.data.testEntity,
            };

            var responseObject;
            var responseObject2;
            var responseObject3;
            before(async function () {
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    var response = mocks.responses.basicEmptyResponseSuccess;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                dwaRequest.select = ["fullname", "subject"];
                dwaRequest.ifmatch = "match";
                dwaRequest.returnRepresentation = false;
                responseObject = await dynamicsWebApiTest.update(dwaRequest);

                dwaRequest.returnRepresentation = true;

                XhrWrapper.afterSendEvent = () => {
                    var response2 = mocks.responses.upsertPreventUpdateResponse;
                    requests[1]?.respond(response2.status, response2.responseHeaders, response2.responseText);
                };

                responseObject2 = await dynamicsWebApiTest.update(dwaRequest);

                XhrWrapper.afterSendEvent = () => {
                    var response3 = mocks.responses.upsertPreventCreateResponse;
                    requests[2]?.respond(response3.status, response3.responseHeaders, response3.responseText);
                };

                try {
                    responseObject3 = await dynamicsWebApiTest.update(dwaRequest);
                } catch (error) {
                    responseObject3 = error;
                }
            });

            after(function () {
                XhrWrapper.afterSendEvent = undefined;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + "?$select=fullname,subject");
                expect(requests[1]?.url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + "?$select=fullname,subject");
                expect(requests[2]?.url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + "?$select=fullname,subject");
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("PATCH");
                expect(requests[1]?.method).to.equal("PATCH");
                expect(requests[2]?.method).to.equal("PATCH");
            });

            it("sends the right data", function () {
                expect(JSON.parse(requests[0]?.requestBody)).to.deep.equal(mocks.data.testEntity);
                expect(JSON.parse(requests[1]?.requestBody)).to.deep.equal(mocks.data.testEntity);
                expect(JSON.parse(requests[2]?.requestBody)).to.deep.equal(mocks.data.testEntity);
            });

            it("sends the Prefer header", function () {
                expect(requests[0]?.requestHeaders["Prefer"]).to.be.undefined;
                expect(requests[1]?.requestHeaders["Prefer"]).to.equal(DWA.Prefer.ReturnRepresentation);
                expect(requests[2]?.requestHeaders["Prefer"]).to.equal(DWA.Prefer.ReturnRepresentation);
            });

            it("sends the right If-Match header", function () {
                expect(requests[0]?.requestHeaders["If-Match"]).to.equal("match");
                expect(requests[1]?.requestHeaders["If-Match"]).to.equal("match");
                expect(requests[2]?.requestHeaders["If-Match"]).to.equal("match");
            });

            it("returns the correct response", function () {
                expect(responseObject).to.equal(true);
                expect(responseObject2).to.equal(false);
                expect(responseObject3.status).to.equal(404);
            });
        });
    });

    describe("dynamicsWebApi.retrieve -", function () {
        describe("basic", function () {
            var responseObject;
            const requests = [];
            before(async function () {
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                var dwaRequest = {
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    expand: [{ property: "prop" }],
                };

                XhrWrapper.afterSendEvent = () => {
                    var response = mocks.responses.response200;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                responseObject = await dynamicsWebApiTest.retrieve(dwaRequest);
            });

            after(function () {
                XhrWrapper.afterSendEvent = undefined;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + "?$expand=prop");
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("GET");
            });

            it("does not send data", function () {
                expect(requests[0]?.requestBody).to.be.undefined;
            });

            it("sends the correct If-Match header", function () {
                expect(requests[0]?.requestHeaders["If-Match"]).to.be.undefined;
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(requests[0]?.requestHeaders["MSCRMCallerID"]).to.be.undefined;
            });

            it("returns the correct response", function () {
                expect(responseObject).to.deep.equal(mocks.data.testEntity);
            });
        });
    });

    describe("dynamicsWebApi.constructor -", function () {
        describe("authentication", function () {
            var responseObject;
            const requests = [];
            before(async function () {
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                const dwaRequest = {
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    expand: [{ property: "prop" }],
                };

                const getToken = async function () {
                    return { accessToken: "token001" };
                };

                const dynamicsWebApiAuth = new DynamicsWebApi({
                    dataApi: { version: "8.2" },
                    onTokenRefresh: getToken,
                });

                XhrWrapper.afterSendEvent = () => {
                    var response = mocks.responses.response200;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                responseObject = await dynamicsWebApiAuth.retrieve(dwaRequest);
            });

            after(function () {
                XhrWrapper.afterSendEvent = undefined;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + "?$expand=prop");
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("GET");
            });

            it("does not send data", function () {
                expect(requests[0]?.requestBody).to.be.undefined;
            });

            it("sends the correct Authorization header", function () {
                expect(requests[0]?.requestHeaders["Authorization"]).to.equal("Bearer token001");
            });

            it("returns the correct response", function () {
                expect(responseObject).to.deep.equal(mocks.data.testEntity);
            });
        });
    });

    describe("dynamicsWebApi.retrieveMultiple -", function () {
        describe("basic", function () {
            var responseObject;
            const requests = [];
            before(async function () {
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    var response = mocks.responses.multipleResponse;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                responseObject = await dynamicsWebApiTest.retrieveMultiple({ collection: "tests" });
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
            });

            after(function () {
                XhrWrapper.afterSendEvent = undefined;
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("GET");
            });

            it("does not send data", function () {
                expect(requests[0]?.requestBody).to.be.undefined;
            });

            it("does not send If-Match header", function () {
                expect(requests[0]?.requestHeaders["If-Match"]).to.be.undefined;
            });

            it("does not send MSCRMCallerID header", function () {
                expect(requests[0]?.requestHeaders["MSCRMCallerID"]).to.be.undefined;
            });

            it("returns the correct response", function () {
                expect(responseObject).to.deep.equal(mocks.responses.multiple());
            });
        });

        describe("select", function () {
            var responseObject;
            var responseObject2;
            const requests = [];
            before(async function () {
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    var response = mocks.responses.multipleResponse;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                responseObject = await dynamicsWebApiTest.retrieveMultiple({ collection: "tests", select: ["fullname"] });

                XhrWrapper.afterSendEvent = () => {
                    var response2 = mocks.responses.multipleResponse;
                    requests[1]?.respond(response2.status, response2.responseHeaders, response2.responseText);
                };

                responseObject2 = await dynamicsWebApiTest.retrieveMultiple({ collection: "tests", select: ["fullname", "subject"] });
            });

            after(function () {
                XhrWrapper.afterSendEvent = undefined;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, "") + "?$select=fullname");
                expect(requests[1]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, "") + "?$select=fullname,subject");
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("GET");
                expect(requests[1]?.method).to.equal("GET");
            });

            it("does not send data", function () {
                expect(requests[0]?.requestBody).to.be.undefined;
                expect(requests[1]?.requestBody).to.be.undefined;
            });

            it("does not send If-Match header", function () {
                expect(requests[0]?.requestHeaders["If-Match"]).to.be.undefined;
                expect(requests[1]?.requestHeaders["If-Match"]).to.be.undefined;
            });

            it("does not send MSCRMCallerID header", function () {
                expect(requests[0]?.requestHeaders["MSCRMCallerID"]).to.be.undefined;
                expect(requests[1]?.requestHeaders["MSCRMCallerID"]).to.be.undefined;
            });

            it("returns the correct response", function () {
                expect(responseObject).to.deep.equal(mocks.responses.multiple());
                expect(responseObject2).to.deep.equal(mocks.responses.multiple());
            });
        });

        describe("filter", function () {
            var responseObject;
            var responseObject2;
            const requests = [];
            before(async function () {
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    var response = mocks.responses.multipleResponse;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                responseObject = await dynamicsWebApiTest.retrieveMultiple({ collection: "tests", filter: "name eq 'name'" });

                XhrWrapper.afterSendEvent = () => {
                    var response2 = mocks.responses.multipleResponse;
                    requests[1]?.respond(response2.status, response2.responseHeaders, response2.responseText);
                };

                responseObject2 = await dynamicsWebApiTest.retrieveMultiple({ collection: "tests", select: ["fullname"], filter: "name eq 'name'" });
            });

            after(function () {
                XhrWrapper.afterSendEvent = undefined;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, "") + "?$filter=name%20eq%20'name'");
                expect(requests[1]?.url).to.equal(
                    mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, "") + "?$select=fullname&$filter=name%20eq%20'name'"
                );
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("GET");
                expect(requests[1]?.method).to.equal("GET");
            });

            it("does not send data", function () {
                expect(requests[0]?.requestBody).to.be.undefined;
                expect(requests[1]?.requestBody).to.be.undefined;
            });

            it("does not send If-Match header", function () {
                expect(requests[0]?.requestHeaders["If-Match"]).to.be.undefined;
                expect(requests[1]?.requestHeaders["If-Match"]).to.be.undefined;
            });

            it("does not send MSCRMCallerID header", function () {
                expect(requests[0]?.requestHeaders["MSCRMCallerID"]).to.be.undefined;
                expect(requests[1]?.requestHeaders["MSCRMCallerID"]).to.be.undefined;
            });

            it("returns the correct response", function () {
                expect(responseObject).to.deep.equal(mocks.responses.multiple());
                expect(responseObject2).to.deep.equal(mocks.responses.multiple());
            });
        });

        describe("next page link", function () {
            var responseObject;
            var responseObject2;
            const requests = [];
            before(async function () {
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    var response = mocks.responses.multipleWithLinkResponse;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                const dwaRequest = { collection: "tests" };

                responseObject = await dynamicsWebApiTest.retrieveMultiple(dwaRequest);

                XhrWrapper.afterSendEvent = () => {
                    var response2 = mocks.responses.multipleResponse;
                    requests[1]?.respond(response2.status, response2.responseHeaders, response2.responseText);
                };

                responseObject2 = await dynamicsWebApiTest.retrieveMultiple(dwaRequest, mocks.responses.multipleWithLink().oDataNextLink);
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
                expect(requests[1]?.url).to.equal(mocks.responses.multipleWithLink().oDataNextLink);
            });

            after(function () {
                XhrWrapper.afterSendEvent = undefined;
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("GET");
                expect(requests[1]?.method).to.equal("GET");
            });

            it("does not send data", function () {
                expect(requests[0]?.requestBody).to.be.undefined;
                expect(requests[1]?.requestBody).to.be.undefined;
            });

            it("does not send If-Match header", function () {
                expect(requests[0]?.requestHeaders["If-Match"]).to.be.undefined;
                expect(requests[1]?.requestHeaders["If-Match"]).to.be.undefined;
            });

            it("does not send MSCRMCallerID header", function () {
                expect(requests[0]?.requestHeaders["MSCRMCallerID"]).to.be.undefined;
                expect(requests[1]?.requestHeaders["MSCRMCallerID"]).to.be.undefined;
            });

            it("returns a correct response", function () {
                expect(responseObject).to.deep.equal(mocks.responses.multipleWithLink());
                expect(responseObject2).to.deep.equal(mocks.responses.multiple());
            });
        });
    });

    describe("request error", function () {
        var responseObject;
        const requests = [];
        before(async function () {
            global.XMLHttpRequest.onCreate = (xhr) => {
                requests.push(xhr);
            };

            XhrWrapper.afterSendEvent = () => {
                requests[0]?.onerror();
            };

            try {
                responseObject = await dynamicsWebApiTest.create({ data: mocks.data.testEntity, collection: "tests" });
            } catch (error) {
                responseObject = error;
            }
        });

        after(function () {
            XhrWrapper.afterSendEvent = undefined;
        });

        it("sends the request to the right end point", function () {
            expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
        });

        it("uses the correct method", function () {
            expect(requests[0]?.method).to.equal("POST");
        });

        it("sends the right data", function () {
            expect(JSON.parse(requests[0]?.requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("does not have Prefer header", function () {
            expect(requests[0]?.requestHeaders["Prefer"]).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject.message).to.eql("Network Error");
            expect(responseObject.status).to.eql(0);
            expect(responseObject.statusText).to.eql("");
            expect(responseObject.headers).to.eql({});
        });
    });

    describe("request timeout", function () {
        var responseObject;
        const requests = [];
        before(async function () {
            global.XMLHttpRequest.onCreate = (xhr) => {
                requests.push(xhr);
            };

            XhrWrapper.afterSendEvent = () => {
                requests[0]?.ontimeout();
            };

            const dynamicsWebApiTimeout = new DynamicsWebApi({ dataApi: { version: "8.2" }, timeout: 100 });
            try {
                responseObject = await dynamicsWebApiTimeout.create({ data: mocks.data.testEntity, collection: "tests" });
            } catch (error) {
                responseObject = error;
            }
        });

        after(function () {
            XhrWrapper.afterSendEvent = undefined;
        });

        it("sends the request to the right end point", function () {
            expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
        });

        it("uses the correct method", function () {
            expect(requests[0]?.method).to.equal("POST");
        });

        it("sends the right data", function () {
            expect(JSON.parse(requests[0]?.requestBody)).to.deep.equal(mocks.data.testEntity);
        });

        it("does not have Prefer header", function () {
            expect(requests[0]?.requestHeaders["Prefer"]).to.be.undefined;
        });

        it("returns the correct response", function () {
            expect(responseObject.message).to.eql("Request Timed Out");
            expect(responseObject.status).to.eql(0);
            expect(responseObject.statusText).to.eql("");
            expect(responseObject.headers).to.eql({});
        });
    });

    describe("dynamicsWebApi.uploadFile -", function () {
        describe("file upload with 2 chunks", function () {
            const requests = [];
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                fileName: "test.json",
                fieldName: "dwa_file",
                data: Buffer.from("Welcome to DynamicsWebApi!", "utf-8"),
            };

            var beginResponse = mocks.responses.uploadFileBeginResponse;
            var response1 = mocks.responses.uploadFile1stResponse;

            var responseObject;
            before(async function () {
                let i = 0;
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = function () {
                    switch (i) {
                        case 0:
                            requests[i].respond(beginResponse.status, beginResponse.responseHeaders);
                            break;
                        default:
                            requests[i].respond(response1.status);
                            break;
                    }

                    i++;
                };

                responseObject = await dynamicsWebApiTest.uploadFile(dwaRequest);
            });

            after(function () {
                XhrWrapper.afterSendEvent = undefined;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(
                    mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + `/${dwaRequest.fieldName}?x-ms-file-name=${dwaRequest.fileName}`
                );
                expect(requests[1]?.url).to.equal(beginResponse.responseHeaders.Location);
                expect(requests[2]?.url).to.equal(beginResponse.responseHeaders.Location);
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("PATCH");
                expect(requests[1]?.method).to.equal("PATCH");
                expect(requests[2]?.method).to.equal("PATCH");
            });

            it("sends data", function () {
                expect(requests[0]?.requestBody).to.be.undefined;
                expect(requests[1]?.requestBody).to.deep.eq(
                    mocks.utils.toTypedArray(dwaRequest.data.slice(0, beginResponse.responseHeaders["x-ms-chunk-size"]))
                );
                expect(requests[2]?.requestBody).to.deep.eq(
                    mocks.utils.toTypedArray(dwaRequest.data.slice(beginResponse.responseHeaders["x-ms-chunk-size"], dwaRequest.data.length))
                );
            });

            it("sends correct headers", function () {
                expect(requests[0]?.requestHeaders["x-ms-transfer-mode"]).to.be.eq("chunked");
                expect(requests[1]?.requestHeaders["Content-Range"]).to.be.eq(
                    `bytes 0-${beginResponse.responseHeaders["x-ms-chunk-size"] - 1}/${dwaRequest.data.length}`
                );
                expect(requests[1]?.requestHeaders["Content-Type"]).to.be.eq("application/octet-stream;charset=utf-8");
                expect(requests[2]?.requestHeaders["Content-Range"]).to.be.eq(
                    `bytes ${beginResponse.responseHeaders["x-ms-chunk-size"]}-${dwaRequest.data.length - 1}/${dwaRequest.data.length}`
                );
                expect(requests[2]?.requestHeaders["Content-Type"]).to.be.eq("application/octet-stream;charset=utf-8");
            });

            it("does not have any response", function () {
                expect(responseObject).to.be.undefined;
            });
        });
    });

    describe("dynamicsWebApi.downloadFile -", function () {
        describe("file download in 2 chunks", function () {
            const requests = [];
            var dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                fieldName: "dwa_file",
            };

            var chunk1 = mocks.responses.downloadFileResponseChunk1;
            var chunk2 = mocks.responses.downloadFileResponseChunk2;

            var responseObject;
            before(async function () {
                global.XMLHttpRequest.onCreate = (xhr) => {
                    requests.push(xhr);
                };

                var i = 0;
                XhrWrapper.afterSendEvent = function () {
                    switch (i) {
                        case 0:
                            requests[i].respond(chunk1.status, chunk1.responseHeaders, chunk1.responseText);
                            break;
                        default:
                            requests[i].respond(chunk2.status, chunk2.responseHeaders, chunk2.responseText);
                            break;
                    }

                    i++;
                };

                responseObject = await dynamicsWebApiTest.downloadFile(dwaRequest);
            });

            after(function () {
                XhrWrapper.afterSendEvent = undefined;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(
                    mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + `/${dwaRequest.fieldName}?size=full`
                );
                expect(requests[1]?.url).to.equal(
                    mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + `/${dwaRequest.fieldName}?size=full`
                );
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("GET");
                expect(requests[1]?.method).to.equal("GET");
            });

            it("does not send data", function () {
                expect(requests[0]?.requestBody).to.be.undefined;
                expect(requests[1]?.requestBody).to.be.undefined;
            });

            it("sends correct headers", function () {
                expect(requests[0]?.requestHeaders["Range"]).to.be.eq(`bytes=0-${Utility.downloadChunkSize - 1}`);
                expect(requests[1]?.requestHeaders["Range"]).to.be.eq(`bytes=${Utility.downloadChunkSize}-${Utility.downloadChunkSize * 2 - 1}`);
            });

            it("does not have any response", function () {
                var text = Buffer.from(responseObject.data).toString();
                expect(text).to.eq("Welcome to DynamicsWebApi!");
                expect(responseObject.fileName).to.eq(chunk2.responseHeaders["x-ms-file-name"]);
                expect(responseObject.fileSize).to.eq(chunk2.responseHeaders["x-ms-file-size"]);
            });
        });
    });
});
