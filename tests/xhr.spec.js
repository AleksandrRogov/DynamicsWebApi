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
