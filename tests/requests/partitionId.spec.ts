import { expect } from "chai";
import nock from "nock";
import sinon from "sinon";
import crypto from "crypto";
import { DynamicsWebApi } from "../../src/dynamics-web-api";
import { composeUrl } from "../../src/client/request/composers/url";
import { XhrWrapper } from "../../src/client/xhr";
import { serverUrl, webApiUrl92, responses } from "../stubs";

// @ts-ignore
global.DWA_BROWSER = false;

const id = "142a7a62-bee5-f111-84ea-6045bdf9d579";

describe("partitionId query parameter", () => {
    const api = new DynamicsWebApi({ serverUrl });
    afterEach(() => nock.cleanAll());

    it("encodes plain partition values without adding or escaping apostrophes", () => {
        const cases = [
            ["test-001", "test-001"],
            ["test'quote", "test'quote"],
            ["test space", "test%20space"],
            ["test#hash", "test%23hash"],
            ["café", "caf%C3%A9"],
            ["test%2F", "test%252F"],
        ];
        for (const [partitionId, encoded] of cases) {
            expect(composeUrl({ functionName: "retrieve", partitionId }, null, "/rows")).to.equal(`/rows?partitionId=${encoded}`);
        }
    });

    it("sends the original value through retrieve and delete requests", async () => {
        const scope = nock(webApiUrl92)
            .get(`/vlbsi_partitiontests(${id})`)
            .query({ partitionId: "test#hash" })
            .reply(200, { partitionid: "test#hash" }, { "Content-Type": "application/json" })
            .delete(`/vlbsi_partitiontests(${id})`)
            .query({ partitionId: "test space" })
            .reply(204);
        const row = await api.retrieve({ collection: "vlbsi_partitiontests", key: id, partitionId: "test#hash" });
        expect(row.partitionid).to.equal("test#hash");
        await api.deleteRecord({ collection: "vlbsi_partitiontests", key: id, partitionId: "test space" });
        expect(scope.isDone()).to.equal(true);
    });

    it("preserves the encoded partition value in a batch request", async () => {
        let batchBody = "";
        const scope = nock(webApiUrl92)
            .post("/$batch", (body) => {
                batchBody = String(body);
                return true;
            })
            .reply(responses.batchError.status, responses.batchError.responseText, responses.batchError.responseHeaders);
        api.startBatch();
        await api.retrieve({ collection: "vlbsi_partitiontests", key: id, partitionId: "test#hash" });
        try {
            await api.executeBatch();
        } catch (_) {
            /* fixture represents a batch error */
        }
        expect(scope.isDone()).to.equal(true);
        expect(batchBody).to.contain(`vlbsi_partitiontests(${id})?partitionId=test%23hash HTTP/1.1`);
    });

    it("passes the encoded query to XMLHttpRequest", async () => {
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
            let xhr: any;
            fake.onCreate = (request) => {
                xhr = request;
            };
            XhrWrapper.afterSendEvent = () => xhr.respond(200, { "Content-Type": "application/json" }, "{}");
            await api.retrieve({ collection: "vlbsi_partitiontests", key: id, partitionId: "test#hash" });
            expect(xhr.url).to.contain(`vlbsi_partitiontests(${id})?partitionId=test%23hash`);
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
