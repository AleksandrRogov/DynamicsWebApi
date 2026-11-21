import { expect } from "chai";
import nock from "nock";
import sinon from "sinon";
import crypto from "crypto";
import { DynamicsWebApi } from "../../src/dynamics-web-api.js";
import { composeUrl } from "../../src/client/request/composers/url.js";
import { XhrWrapper } from "../../src/client/xhr.js";
import { serverUrl, webApiUrl92, responses } from "../stubs.js";

// @ts-ignore
global.DWA_BROWSER = false;
const id = "904020fa-6213-43d4-a26a-5347b70095e8";

describe("partitionId query parameter", () => {
    afterEach(() => nock.cleanAll());

    it("encodes partition IDs exactly once", () => {
        for (const [value, encoded] of [
            ["test space", "test%20space"],
            ["R&D#%2F", "R%26D%23%252F"],
            ["café", "caf%C3%A9"],
            ["O'Brien", "O'Brien"],
        ]) {
            expect(composeUrl({ functionName: "retrieve", partitionId: value }, null, "/rows")).to.equal(`/rows?partitionId=${encoded}`);
        }
    });

    it("sends original partition values in retrieve and delete requests", async () => {
        const api = new DynamicsWebApi({ serverUrl });
        const scope = nock(webApiUrl92)
            .get(`/tests(${id})`)
            .query({ partitionId: "test#hash" })
            .reply(200, { ok: true })
            .delete(`/tests(${id})`)
            .query({ partitionId: "test space" })
            .reply(204);
        await api.retrieve({ collection: "tests", key: id, partitionId: "test#hash" });
        await api.deleteRecord({ collection: "tests", key: id, partitionId: "test space" });
        expect(scope.isDone()).to.equal(true);
    });

    it("preserves encoded partition IDs in batch requests", async () => {
        const api = new DynamicsWebApi({ serverUrl });
        let body = "";
        const scope = nock(webApiUrl92)
            .post("/$batch", (b) => {
                body = String(b);
                return true;
            })
            .reply(responses.batchError.status, responses.batchError.responseText, responses.batchError.responseHeaders);
        api.startBatch();
        await api.retrieve({ collection: "tests", key: id, partitionId: "test#hash" });
        try {
            await api.executeBatch();
        } catch (_) {
            /* error fixture */
        }
        expect(scope.isDone()).to.equal(true);
        expect(body).to.contain(`tests(${id})?partitionId=test%23hash HTTP/1.1`);
    });

    it("sends the encoded partition URL through XMLHttpRequest", async () => {
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
            XhrWrapper.afterSendEvent = () => requests[0].respond(200, { "Content-Type": "application/json" }, "{}");
            const api = new DynamicsWebApi({ serverUrl, dataApi: { version: "8.2" } });
            await api.retrieve({ collection: "tests", key: id, partitionId: "test#hash" });
            expect(requests[0].url).to.contain("?partitionId=test%23hash");
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
