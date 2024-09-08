import { expect } from "chai";
import * as mocks from "./stubs";

import sinon, { SinonFakeXMLHttpRequest, SinonFakeXMLHttpRequestStatic } from "sinon";
import crypto from "crypto";
import { DynamicsWebApi, RetrieveRequest } from "../src/dynamics-web-api";
import { XhrWrapper } from "../src/client/xhr";
import { DWA } from "../lib/dwa";

const dynamicsWebApiTest = new DynamicsWebApi({
    dataApi: {
        version: "8.2",
    },
});

// declare global {
//     namespace Mocha {
//         interface Context {
//             requests: SinonFakeXMLHttpRequest[];
//         }
//     }
// }

interface CustomXMLHttpRequest extends XMLHttpRequest {
    ontimeout: () => void;
    onabort: () => void;
    aborted: boolean;
}

declare module "sinon" {
    interface SinonFakeXMLHttpRequest {
        ontimeout: () => void;
        onabort: () => void;
        aborted: boolean;
    }
}

let requests: SinonFakeXMLHttpRequest[];

describe("xhr -", () => {
    before(function () {
        global.DWA_BROWSER = true;
        //@ts-ignore
        global.window = {
            crypto: <any>crypto.webcrypto,
        };
        //@ts-ignore
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

        requests = [];
    });
    after(function () {
        //@ts-ignore
        global.XMLHttpRequest.restore();

        global.DWA_BROWSER = false;
        //@ts-ignore
        global.window = null;
        //@ts-ignore
        global.XMLHttpRequest = null;

        requests = [];
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
                requests = [];
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
                requests = [];
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
                requests = [];
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
                requests = [];
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
                requests = [];
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
                requests = [];
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
                requests = [];
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
                requests = [];
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
