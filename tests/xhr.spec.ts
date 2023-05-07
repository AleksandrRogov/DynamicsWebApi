import { expect } from "chai";
import * as mocks from "./stubs";

import sinon, { SinonFakeXMLHttpRequest } from "sinon";

import { DynamicsWebApi, RetrieveRequest } from "../src/dynamics-web-api";

const dynamicsWebApiTest = new DynamicsWebApi({
    dataApi: {
        version: "8.2",
    },
});

declare global {
    namespace Mocha {
        interface Context {
            requests: SinonFakeXMLHttpRequest[];
        }
    }
}

declare module "sinon" {
    interface SinonFakeXMLHttpRequest {
        ontimeout: () => void;
        onabort: () => void;
        aborted: boolean;
    }
}

describe("xhr -", () => {
    describe("dynamicsWebApi.retrieve -", () => {
        describe("AbortSignal", () => {
            let responseObject: any;
            const ac = new AbortController();
            before(async function () {
                //@ts-ignore
                global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                const requests: SinonFakeXMLHttpRequest[] = (this.requests = []);

                //@ts-ignore
                global.XMLHttpRequest.onCreate = function (xhr: SinonFakeXMLHttpRequest) {
                    requests.push(xhr);
                };

                var dwaRequest: RetrieveRequest = {
                    key: mocks.data.testEntityId,
                    collection: "tests",
                    expand: [{ property: "prop" }],
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
                //@ts-ignore
                global.XMLHttpRequest.restore();
                //@ts-ignore
                global.XMLHttpRequest = null;
            });

            it("sends the request to the right end point", function () {
                expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + "?$expand=prop");
            });

            it("uses the correct method", function () {
                expect(this.requests[0].method).to.equal("GET");
            });

            it("does not send data", function () {
                expect(this.requests[0].requestBody).to.be.undefined;
            });

            it("sends the correct If-Match header", function () {
                expect(this.requests[0].requestHeaders["If-Match"]).to.be.undefined;
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(this.requests[0].requestHeaders["MSCRMCallerID"]).to.be.undefined;
            });

            it("cancels request and throws a correct error", function () {
                expect(this.requests[0].aborted).to.be.true;
                expect(responseObject.message).to.eql("Request cancelled");
                expect(responseObject.status).to.eql(0);
                expect(responseObject.statusText).to.eql("");
                expect(responseObject.headers).to.eql({});
            });
        });
    });
});
