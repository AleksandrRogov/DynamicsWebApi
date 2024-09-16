import { expect } from "chai";
import * as mocks from "./stubs";

import sinon, { SinonFakeXMLHttpRequest, SinonFakeXMLHttpRequestStatic } from "sinon";
import crypto from "crypto";
import { DynamicsWebApi, RetrieveRequest } from "../src/dynamics-web-api";
import { XhrWrapper } from "../src/client/xhr";
import { DWA } from "../src/dwa";
import { Utility } from "../src/utils/Utility";
import base64 from "Base64";
Utility.downloadChunkSize = 15;

const dynamicsWebApiTest = new DynamicsWebApi({
    dataApi: {
        version: "8.2",
    },
});

declare module "sinon" {
    interface SinonFakeXMLHttpRequest {
        ontimeout: () => void;
        onabort: () => void;
        aborted: boolean;
    }
}

const requests: SinonFakeXMLHttpRequest[] = [];

describe("xhr -", () => {
    before(function () {
        global.DWA_BROWSER = true;
        //@ts-ignore
        global.window = {
            btoa: <any>base64.btoa,
            atob: base64.atob,
            crypto: <any>crypto.webcrypto,
        };
        (global as any).XMLHttpRequest = sinon.useFakeXMLHttpRequest();

        requests.length = 0;
    });
    after(function () {
        //@ts-ignore
        global.XMLHttpRequest.restore();

        global.DWA_BROWSER = false;
        //@ts-ignore
        global.window = null;
        //@ts-ignore
        global.XMLHttpRequest = null;

        requests.length = 0;
    });

    describe("dynamicsWebApi.retrieve -", () => {
        describe("AbortSignal", () => {
            let responseObject: any;
            const ac = new AbortController();
            before(async function () {
                //@ts-ignore
                global.XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                const dwaRequest: RetrieveRequest = {
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    expand: [{ property: "prop1" }],
                    signal: ac.signal,
                };

                setTimeout(() => ac.abort(), 0);

                try {
                    await dynamicsWebApiTest.retrieve(dwaRequest);
                    throw new Error();
                } catch (error) {
                    responseObject = error;
                }
            });

            after(function () {
                requests.length = 0;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + "?$expand=prop1");
            });

            it("uses the correct method", function () {
                expect(requests[0].method).to.equal("GET");
            });

            it("does not send data", function () {
                expect(requests[0].requestBody).to.be.undefined;
            });

            it("sends the correct If-Match header", function () {
                expect(requests[0].requestHeaders["If-Match"]).to.be.undefined;
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(requests[0].requestHeaders["MSCRMCallerID"]).to.be.undefined;
            });

            it("cancels request and throws a correct error", function () {
                expect(requests[0].aborted).to.be.true;
                expect(responseObject.message).to.eql("The user aborted a request.");
                expect(responseObject.name).to.eql("AbortError");
                expect(responseObject.code).to.eql(20);
                expect(responseObject.status).to.eql(0);
                expect(responseObject.statusText).to.eql("");
                expect(responseObject.headers).to.eql({});
            });
        });

        describe("Power Pages", () => {
            let responseObject: any;
            before(async function () {
                //@ts-ignore
                global.XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                //@ts-ignore
                global.window.shell = {
                    getTokenDeferred: async () => {
                        return "token";
                    },
                };
                //@ts-ignore
                global.window.location = {};
                //@ts-ignore
                global.window.location.origin = mocks.portalUrl;

                const powerPagesWebApi = new DynamicsWebApi({
                    dataApi: {
                        version: "8.2",
                    },
                });

                const dwaRequest: RetrieveRequest = {
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    expand: [{ property: "prop" }],
                };
                try {
                    XhrWrapper.afterSendEvent = () => {
                        const response = mocks.responses.response200;
                        requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                    };

                    responseObject = await powerPagesWebApi.retrieve(dwaRequest);
                } catch (error) {
                    responseObject = error;
                }
            });

            after(function () {
                requests.length = 0;
                //@ts-ignore
                delete global.window.shell;
                //@ts-ignore
                delete global.window.location;
                //@ts-ignore
                XhrWrapper.afterSendEvent = undefined;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0].url).to.equal(mocks.powerPagesApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + "?$expand=prop");
            });

            it("uses the correct method", function () {
                expect(requests[0].method).to.equal("GET");
            });

            it("does not send data", function () {
                expect(requests[0].requestBody).to.be.undefined;
            });

            it("sends the correct __RequestVerificationToken header", function () {
                expect(requests[0].requestHeaders["__RequestVerificationToken"]).to.be.eq("token");
            });

            it("sends the correct If-Match header", function () {
                expect(requests[0].requestHeaders["If-Match"]).to.be.undefined;
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(requests[0].requestHeaders["MSCRMCallerID"]).to.be.undefined;
            });

            it("returns the correct response", function () {
                expect(responseObject).to.deep.equal(mocks.data.testEntity);
            });
        });
    });

    describe("dynamicsWebApi.create -", function () {
        describe("basic", function () {
            let responseObject: any;
            before(async function () {
                //@ts-ignore
                global.XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.createReturnId;
                    requests[0]?.respond(response.status, response.responseHeaders, "");
                };

                responseObject = await dynamicsWebApiTest.create({ data: mocks.data.testEntity, collection: "tests" });
            });

            after(() => {
                requests.length = 0;
                //@ts-ignore
                XhrWrapper.afterSendEvent = null;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("POST");
            });

            it("sends the right data", function () {
                expect(JSON.parse(requests[0]?.requestBody as string)).to.deep.equal(mocks.data.testEntity);
            });

            it("does not have Prefer header", function () {
                expect(requests[0]?.requestHeaders["Prefer"]).to.be.undefined;
            });

            it("returns the correct response", function () {
                expect(responseObject).to.deep.equal(mocks.data.testEntityId);
            });
        });

        describe("crm error", function () {
            let responseObject: any;
            before(async function () {
                //@ts-ignore
                global.XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
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
                requests.length = 0;
                //@ts-ignore
                XhrWrapper.afterSendEvent = null;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("POST");
            });

            it("sends the right data", function () {
                expect(JSON.parse(requests[0]?.requestBody as string)).to.deep.equal(mocks.data.testEntity);
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
            let responseObject: any;
            before(async function () {
                //@ts-ignore
                global.XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.upsertPreventCreateResponse;
                    requests[0]?.respond(response.status, response.responseHeaders, "");
                };

                try {
                    responseObject = await dynamicsWebApiTest.create({ data: mocks.data.testEntity, collection: "tests" });
                } catch (error) {
                    responseObject = error;
                }
            });

            after(function () {
                requests.length = 0;
                //@ts-ignore
                XhrWrapper.afterSendEvent = null;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("POST");
            });

            it("sends the right data", function () {
                expect(JSON.parse(requests[0]?.requestBody as string)).to.deep.equal(mocks.data.testEntity);
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
            let responseObject: any;
            before(async function () {
                //@ts-ignore
                global.XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.upsertPreventCreateResponse;
                    requests[0]?.respond(response.status, response.responseHeaders, "something");
                };

                try {
                    responseObject = await dynamicsWebApiTest.create({ data: mocks.data.testEntity, collection: "tests" });
                } catch (error) {
                    responseObject = error;
                }
            });

            after(function () {
                requests.length = 0;
                //@ts-ignore
                XhrWrapper.afterSendEvent = null;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("POST");
            });

            it("sends the right data", function () {
                expect(JSON.parse(requests[0]?.requestBody as string)).to.deep.equal(mocks.data.testEntity);
            });

            it("does not have Prefer header", function () {
                expect(requests[0]?.requestHeaders["Prefer"]).to.be.undefined;
            });

            it("returns the correct response", function () {
                const error = new CustomError("something", 404, "Not Found");

                expect(responseObject.message).to.equal(error.message);
                expect(responseObject.status).to.equal(error.status);
                expect(responseObject.statusText).to.equal(error.statusText);
            });
        });
    });

    describe("dynamicsWebApi.executeBatch - ", function () {
        describe("update / delete - returns an error", function () {
            let responseObject: any;
            const rBody = mocks.data.batchUpdateDelete;
            const rBodys = rBody.split("\n");
            let checkBody = "";
            for (let i = 0; i < rBodys.length; i++) {
                checkBody += rBodys[i];
            }

            before(async function () {
                //@ts-ignore
                global.XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.batchError;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                dynamicsWebApiTest.startBatch();

                dynamicsWebApiTest.update({ key: mocks.data.testEntityId2, collection: "records", data: { firstname: "Test", lastname: "Batch!" } });
                dynamicsWebApiTest.deleteRecord({ key: mocks.data.testEntityId2, collection: "records", property: "firstname" });

                try {
                    responseObject = await dynamicsWebApiTest.executeBatch();
                    throw responseObject;
                } catch (error) {
                    responseObject = error;
                }
            });

            after(function () {
                requests.length = 0;
                //@ts-ignore
                XhrWrapper.afterSendEvent = undefined;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + "$batch");
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("POST");
            });

            it("sends the right data", function () {
                function filterBody(body: string): string {
                    body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "dwa_batch_XXX");
                    body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "changeset_XXX");
                    const bodys = body.split("\n");

                    let resultBody = "";
                    for (let i = 0; i < bodys.length; i++) {
                        resultBody += bodys[i];
                    }
                    return resultBody;
                }

                expect(filterBody(requests[0]?.requestBody as string)).to.deep.equal(checkBody);
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

        describe("return representation", function () {
            let responseObject: any;
            before(async function () {
                //@ts-ignore
                global.XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.createReturnRepresentation;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                responseObject = await dynamicsWebApiTest.create({ data: mocks.data.testEntity, collection: "tests", returnRepresentation: true });
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
            });

            after(function () {
                requests.length = 0;
                //@ts-ignore
                XhrWrapper.afterSendEvent = undefined;
            });

            it("uses the correct method", function () {
                expect(requests[0]?.method).to.equal("POST");
            });

            it("sends the right data", function () {
                expect(JSON.parse(requests[0]?.requestBody as string)).to.deep.equal(mocks.data.testEntity);
            });

            it("sends the Prefer header", function () {
                expect(requests[0]?.requestHeaders["Prefer"]).to.equal(DWA.Prefer.ReturnRepresentation);
            });

            it("returns the correct response", function () {
                expect(responseObject).to.deep.equal(mocks.data.testEntity);
            });
        });
    });

    describe("dynamicsWebApi.update -", function () {
        describe("change if-match header", function () {
            const dwaRequest: any = {
                key: mocks.data.testEntityId,
                collection: "tests",
                data: mocks.data.testEntity,
            };

            let responseObject: any;
            let responseObject2: any;
            let responseObject3: any;

            before(async function () {
                (global as any).XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.basicEmptyResponseSuccess;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                dwaRequest.select = ["fullname", "subject"];
                dwaRequest.ifmatch = "match";
                dwaRequest.returnRepresentation = false;
                responseObject = await dynamicsWebApiTest.update(dwaRequest);

                dwaRequest.returnRepresentation = true;

                XhrWrapper.afterSendEvent = () => {
                    const response2 = mocks.responses.upsertPreventUpdateResponse;
                    requests[1]?.respond(response2.status, response2.responseHeaders, response2.responseText);
                };

                responseObject2 = await dynamicsWebApiTest.update(dwaRequest);

                XhrWrapper.afterSendEvent = () => {
                    const response3 = mocks.responses.upsertPreventCreateResponse;
                    requests[2]?.respond(response3.status, response3.responseHeaders, response3.responseText);
                };

                try {
                    responseObject3 = await dynamicsWebApiTest.update(dwaRequest);
                } catch (error) {
                    responseObject3 = error;
                }
            });

            after(function () {
                requests.length = 0;
                //@ts-ignore
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
                expect(JSON.parse(requests[0]?.requestBody as string)).to.deep.equal(mocks.data.testEntity);
                expect(JSON.parse(requests[1]?.requestBody as string)).to.deep.equal(mocks.data.testEntity);
                expect(JSON.parse(requests[2]?.requestBody as string)).to.deep.equal(mocks.data.testEntity);
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
            let responseObject: any;

            before(async function () {
                (global as any).XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                const dwaRequest: any = {
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    expand: [{ property: "prop" }],
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.response200;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                responseObject = await dynamicsWebApiTest.retrieve(dwaRequest);
            });

            after(function () {
                requests.length = 0;
                //@ts-ignore
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
            let responseObject: any;

            before(async function () {
                (global as any).XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                const dwaRequest: any = {
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    expand: [{ property: "prop" }],
                };

                const getToken = async function (): Promise<{ accessToken: string }> {
                    return { accessToken: "token001" };
                };

                const dynamicsWebApiAuth = new DynamicsWebApi({
                    dataApi: { version: "8.2" },
                    onTokenRefresh: getToken,
                });

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.response200;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                responseObject = await dynamicsWebApiAuth.retrieve(dwaRequest);
            });

            after(function () {
                requests.length = 0;
                //@ts-ignore
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
            let responseObject: any;

            before(async function () {
                (global as any).XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.multipleResponse;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                responseObject = await dynamicsWebApiTest.retrieveMultiple({ collection: "tests" });
            });

            after(function () {
                //@ts-ignore
                XhrWrapper.afterSendEvent = undefined;
                requests.length = 0;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
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
            let responseObject: any;
            let responseObject2: any;

            before(async function () {
                (global as any).XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.multipleResponse;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                responseObject = await dynamicsWebApiTest.retrieveMultiple({ collection: "tests", select: ["fullname"] });

                XhrWrapper.afterSendEvent = () => {
                    const response2 = mocks.responses.multipleResponse;
                    requests[1]?.respond(response2.status, response2.responseHeaders, response2.responseText);
                };

                responseObject2 = await dynamicsWebApiTest.retrieveMultiple({ collection: "tests", select: ["fullname", "subject"] });
            });

            after(function () {
                //@ts-ignore
                XhrWrapper.afterSendEvent = undefined;
                requests.length = 0;
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
            let responseObject: any;
            let responseObject2: any;

            before(async function () {
                (global as any).XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.multipleResponse;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                responseObject = await dynamicsWebApiTest.retrieveMultiple({ collection: "tests", filter: "name eq 'name'" });

                XhrWrapper.afterSendEvent = () => {
                    const response2 = mocks.responses.multipleResponse;
                    requests[1]?.respond(response2.status, response2.responseHeaders, response2.responseText);
                };

                responseObject2 = await dynamicsWebApiTest.retrieveMultiple({ collection: "tests", select: ["fullname"], filter: "name eq 'name'" });
            });

            after(function () {
                //@ts-ignore
                XhrWrapper.afterSendEvent = undefined;
                requests.length = 0;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, "") + "?$filter=name%20eq%20'name'");
                expect(requests[1]?.url).to.equal(
                    mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, "") + "?$select=fullname&$filter=name%20eq%20'name'",
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
            let responseObject: any;
            let responseObject2: any;

            before(async function () {
                (global as any).XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = () => {
                    const response = mocks.responses.multipleWithLinkResponse;
                    requests[0]?.respond(response.status, response.responseHeaders, response.responseText);
                };

                const dwaRequest = { collection: "tests" };

                responseObject = await dynamicsWebApiTest.retrieveMultiple(dwaRequest);

                XhrWrapper.afterSendEvent = () => {
                    const response2 = mocks.responses.multipleResponse;
                    requests[1]?.respond(response2.status, response2.responseHeaders, response2.responseText);
                };

                responseObject2 = await dynamicsWebApiTest.retrieveMultiple(dwaRequest, mocks.responses.multipleWithLink().oDataNextLink);
            });

            after(function () {
                //@ts-ignore
                XhrWrapper.afterSendEvent = undefined;
                requests.length = 0;
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
                expect(requests[1]?.url).to.equal(mocks.responses.multipleWithLink().oDataNextLink);
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
        let responseObject: any;

        before(async function () {
            (global as any).XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                requests.push(xhr);
            };

            XhrWrapper.afterSendEvent = () => {
                requests[0]?.onerror?.();
            };

            try {
                responseObject = await dynamicsWebApiTest.create({ data: mocks.data.testEntity, collection: "tests" });
            } catch (error) {
                responseObject = error;
            }
        });

        after(function () {
            //@ts-ignore
            XhrWrapper.afterSendEvent = undefined;
            requests.length = 0; // Clear the requests array
        });

        it("sends the request to the right end point", function () {
            expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
        });

        it("uses the correct method", function () {
            expect(requests[0]?.method).to.equal("POST");
        });

        it("sends the right data", function () {
            expect(JSON.parse(requests[0]?.requestBody || "")).to.deep.equal(mocks.data.testEntity);
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
        let responseObject: any;

        before(async function () {
            (global as any).XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                requests.push(xhr);
            };

            XhrWrapper.afterSendEvent = () => {
                requests[0]?.ontimeout?.();
            };

            const dynamicsWebApiTimeout = new DynamicsWebApi({ dataApi: { version: "8.2" }, timeout: 100 });
            try {
                responseObject = await dynamicsWebApiTimeout.create({ data: mocks.data.testEntity, collection: "tests" });
            } catch (error) {
                responseObject = error;
            }
        });

        after(function () {
            //@ts-ignore
            XhrWrapper.afterSendEvent = undefined;
            requests.length = 0; // Clear the requests array
        });

        it("sends the request to the right end point", function () {
            expect(requests[0]?.url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
        });

        it("uses the correct method", function () {
            expect(requests[0]?.method).to.equal("POST");
        });

        it("sends the right data", function () {
            expect(JSON.parse(requests[0]?.requestBody || "")).to.deep.equal(mocks.data.testEntity);
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
            const dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                fileName: "test.json",
                fieldName: "dwa_file",
                data: Buffer.from("Welcome to DynamicsWebApi!", "utf-8"),
            };

            const beginResponse = mocks.responses.uploadFileBeginResponse;
            const response1 = mocks.responses.uploadFile1stResponse;

            let responseObject: any;
            before(async function () {
                let i = 0;
                (global as any).XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                XhrWrapper.afterSendEvent = function () {
                    switch (i) {
                        case 0:
                            requests[i].respond(beginResponse.status, beginResponse.responseHeaders, "");
                            break;
                        default:
                            requests[i].respond(response1.status, [], "");
                            break;
                    }

                    i++;
                };

                responseObject = await dynamicsWebApiTest.uploadFile(dwaRequest);
            });

            after(function () {
                //@ts-ignore
                XhrWrapper.afterSendEvent = undefined;
                requests.length = 0; // Clear the requests array
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(
                    mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + `/${dwaRequest.fieldName}?x-ms-file-name=${dwaRequest.fileName}`,
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
                    mocks.utils.toTypedArray(dwaRequest.data.subarray(0, beginResponse.responseHeaders["x-ms-chunk-size"])),
                );
                expect(requests[2]?.requestBody).to.deep.eq(
                    mocks.utils.toTypedArray(dwaRequest.data.subarray(beginResponse.responseHeaders["x-ms-chunk-size"], dwaRequest.data.length)),
                );
            });

            it("sends correct headers", function () {
                expect(requests[0]?.requestHeaders["x-ms-transfer-mode"]).to.be.eq("chunked");
                expect(requests[1]?.requestHeaders["Content-Range"]).to.be.eq(
                    `bytes 0-${beginResponse.responseHeaders["x-ms-chunk-size"] - 1}/${dwaRequest.data.length}`,
                );
                expect(requests[1]?.requestHeaders["Content-Type"]).to.be.eq("application/octet-stream;charset=utf-8");
                expect(requests[2]?.requestHeaders["Content-Range"]).to.be.eq(
                    `bytes ${beginResponse.responseHeaders["x-ms-chunk-size"]}-${dwaRequest.data.length - 1}/${dwaRequest.data.length}`,
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
            const dwaRequest = {
                key: mocks.data.testEntityId,
                collection: "tests",
                property: "dwa_file",
            };

            const chunk1 = mocks.responses.downloadFileResponseChunk1;
            const chunk2 = mocks.responses.downloadFileResponseChunk2;

            let responseObject: any;
            before(async function () {
                (global as any).XMLHttpRequest.onCreate = (xhr: SinonFakeXMLHttpRequest) => {
                    requests.push(xhr);
                };

                let i = 0;
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
                //@ts-ignore
                XhrWrapper.afterSendEvent = undefined;
                requests.length = 0; // Clear the requests array
            });

            it("sends the request to the right end point", function () {
                expect(requests[0]?.url).to.equal(
                    mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + `/${dwaRequest.property}?size=full`,
                );
                expect(requests[1]?.url).to.equal(
                    mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + `/${dwaRequest.property}?size=full`,
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
                const text = Buffer.from(responseObject.data).toString();
                expect(text).to.eq("Welcome to DynamicsWebApi!");
                expect(responseObject.fileName).to.eq(chunk2.responseHeaders["x-ms-file-name"]);
                expect(responseObject.fileSize).to.eq(chunk2.responseHeaders["x-ms-file-size"]);
            });
        });
    });
});

class CustomError extends Error {
    status: number;
    statusText: string;

    constructor(message: string, status: number, statusText: string) {
        super(message);
        this.status = status;
        this.statusText = statusText;
    }
}
