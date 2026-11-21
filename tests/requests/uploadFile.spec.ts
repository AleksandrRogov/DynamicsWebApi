import { expect } from "chai";
import nock from "nock";
import sinon from "sinon";
import crypto from "crypto";
import { DynamicsWebApi } from "../../src/dynamics-web-api";
import { composeUrl } from "../../src/client/request/composers/url";
import { XhrWrapper } from "../../src/client/xhr";
import { serverUrl, webApiUrl, responses } from "../stubs";

// @ts-ignore
global.DWA_BROWSER = false;

const id = "904020fa-6213-43d4-a26a-5347b70095e8";
const baseRequest = { collection: "tests", key: id, property: "dwa_file", data: Buffer.from("test") };

describe("uploadFile filename encoding", () => {
    afterEach(() => nock.cleanAll());

    it("retains the original query by default and when explicitly disabled", () => {
        const request = { functionName: "uploadFile", fileName: "R%26D.txt" };
        expect(composeUrl(request, null, "/file")).to.equal("/file?x-ms-file-name=R%26D.txt");
        expect(composeUrl(request, { encodeFileNames: false }, "/file")).to.equal("/file?x-ms-file-name=R%26D.txt");
    });

    it("encodes original filenames when enabled", () => {
        const examples = [
            ["test.txt", "test.txt"],
            ["test file.txt", "test%20file.txt"],
            ["R&D.txt", "R%26D.txt"],
            ["test#hash.txt", "test%23hash.txt"],
            ["test+plus.txt", "test%2Bplus.txt"],
            ["test%2F.txt", "test%252F.txt"],
            ["café.txt", "caf%C3%A9.txt"],
            ["O'Brien.txt", "O'Brien.txt"],
        ];
        for (const [fileName, expected] of examples) {
            expect(composeUrl({ functionName: "uploadFile", fileName }, { encodeFileNames: true }, "/file")).to.equal(`/file?x-ms-file-name=${expected}`);
        }
    });

    it("validates the option and accepts null", () => {
        expect(() => new DynamicsWebApi({ serverUrl, encodeFileNames: "true" as any })).to.throw("encodeFileNames");
        const api = new DynamicsWebApi({ serverUrl, encodeFileNames: true });
        expect(() => api.setConfig({ encodeFileNames: 1 as any })).to.throw("encodeFileNames");
        expect(() => api.setConfig({ encodeFileNames: null })).not.to.throw();
    });

    it("uses the configured mode for upload initialization and preserves the chunk URL", async () => {
        const api = new DynamicsWebApi({ serverUrl, dataApi: { version: "8.2" } });
        const begin = responses.uploadFileBeginResponse;
        const locationPath = begin.responseHeaders.Location.replace(webApiUrl, "/");
        for (const [enabled, fileName, decodedName] of [
            [false, "R%26D.txt", "R&D.txt"],
            [true, "R&D #1+%2F.txt", "R&D #1+%2F.txt"],
            [false, "R%26D.txt", "R&D.txt"],
        ] as const) {
            api.setConfig({ encodeFileNames: enabled });
            const scope = nock(webApiUrl)
                .patch(`/tests(${id})/dwa_file`)
                .query({ "x-ms-file-name": decodedName })
                .matchHeader("x-ms-transfer-mode", "chunked")
                .reply(begin.status, "", { ...begin.responseHeaders, "x-ms-chunk-size": String(begin.responseHeaders["x-ms-chunk-size"]) })
                .patch(locationPath, baseRequest.data)
                .matchHeader("Content-Range", "bytes 0-3/4")
                .reply(206);
            await api.uploadFile({ ...baseRequest, fileName });
            expect(scope.isDone()).to.equal(true);
        }
    });

    it("sends the encoded filename through XMLHttpRequest", async () => {
        // @ts-ignore
        const previousBrowser = global.DWA_BROWSER;
        const previousWindow = global.window;
        const previousXhr = global.XMLHttpRequest;
        let fake: ReturnType<typeof sinon.useFakeXMLHttpRequest> | undefined;
        try {
            // @ts-ignore
            global.DWA_BROWSER = true;
            (global as any).window = {
                crypto: crypto.webcrypto,
                btoa: (s: string) => Buffer.from(s, "binary").toString("base64"),
                atob: (s: string) => Buffer.from(s, "base64").toString("binary"),
            };
            fake = sinon.useFakeXMLHttpRequest();
            (global as any).XMLHttpRequest = fake;
            const requests: any[] = [];
            fake.onCreate = (xhr) => requests.push(xhr);
            XhrWrapper.afterSendEvent = () => {
                const current = requests[requests.length - 1];
                if (requests.length === 1) current.respond(200, responses.uploadFileBeginResponse.responseHeaders, "");
                else current.respond(206, {}, "");
            };
            const api = new DynamicsWebApi({ serverUrl, dataApi: { version: "8.2" }, encodeFileNames: true });
            await api.uploadFile({ ...baseRequest, fileName: "R&D #1+%2F.txt" });
            expect(requests[0].url).to.contain("?x-ms-file-name=R%26D%20%231%2B%252F.txt");
            expect(requests[1].url).to.equal(responses.uploadFileBeginResponse.responseHeaders.Location);
        } finally {
            fake?.restore();
            XhrWrapper.afterSendEvent = undefined as any;
            // @ts-ignore
            global.DWA_BROWSER = previousBrowser;
            global.window = previousWindow;
            global.XMLHttpRequest = previousXhr;
        }
    });
});
