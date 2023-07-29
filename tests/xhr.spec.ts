import { expect } from "chai";
import * as mocks from "./stubs";

import sinon, { SinonFakeXMLHttpRequest } from "sinon";
import crypto from "crypto";
import { DynamicsWebApi, RetrieveRequest } from "../src/dynamics-web-api";
import { XhrWrapper } from "../src/client/xhr";

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
                global.window.shell = {};
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
                        var response = mocks.responses.response200;
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
});
