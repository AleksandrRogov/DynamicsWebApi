import { expect } from "chai";
import nock from "nock";
import sinon from "sinon";
import crypto from "crypto";
import { DynamicsWebApi } from "../../src/dynamics-web-api.js";
import { composeUrl } from "../../src/client/request/composers/url.js";
import { XhrWrapper } from "../../src/client/xhr.js";
import { serverUrl, webApiUrl, responses } from "../stubs.js";

// @ts-ignore
global.DWA_BROWSER = false;
const id = "904020fa-6213-43d4-a26a-5347b70095e8";

describe("uploadFile filename encoding", () => {
    afterEach(() => nock.cleanAll());

    it("encodes filenames exactly once", () => {
        for (const [value, encoded] of [
            ["test space", "test%20space"],
            ["R&D#%2F", "R%26D%23%252F"],
            ["café", "caf%C3%A9"],
            ["O'Brien", "O'Brien"],
        ]) {
            expect(composeUrl({ functionName: "uploadFile", fileName: value }, null, "/file")).to.equal(`/file?x-ms-file-name=${encoded}`);
        }
    });

    it("encodes upload initialization and preserves the continuation URL", async () => {
        const api = new DynamicsWebApi({ serverUrl, dataApi: { version: "8.2" } });
        const begin = responses.uploadFileBeginResponse;
        const data = Buffer.from("test");
        const scope = nock(webApiUrl)
            .patch(`/tests(${id})/dwa_file`)
            .query({ "x-ms-file-name": "R&D #1+%2F.txt" })
            .reply(begin.status, "", { ...begin.responseHeaders, "x-ms-chunk-size": String(begin.responseHeaders["x-ms-chunk-size"]) })
            .patch(begin.responseHeaders.Location.replace(webApiUrl, "/"), data)
            .matchHeader("Content-Range", "bytes 0-3/4")
            .reply(206);
        await api.uploadFile({ collection: "tests", key: id, property: "dwa_file", data, fileName: "R&D #1+%2F.txt" });
        expect(scope.isDone()).to.equal(true);
    });

    it("sends the encoded filename and continuation URL through XMLHttpRequest", async () => {
        // @ts-ignore
        const previousBrowser = global.DWA_BROWSER;
        const previousWindow = global.window,
            previousXhr = global.XMLHttpRequest;
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
                const xhr = requests[requests.length - 1];
                if (requests.length === 1) xhr.respond(200, responses.uploadFileBeginResponse.responseHeaders, "");
                else xhr.respond(206, {}, "");
            };
            const api = new DynamicsWebApi({ serverUrl, dataApi: { version: "8.2" } });
            await api.uploadFile({ collection: "tests", key: id, property: "dwa_file", data: Buffer.from("test"), fileName: "R&D #1+%2F.txt" });
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
