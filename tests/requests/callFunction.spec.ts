import { expect } from "chai";
import { buildFunctionParameters as buildParameters } from "../../src/utils/Utility";
import type { FunctionParameterType } from "../../src/dynamics-web-api";

const buildFunctionParameters = (parameters?: any, types?: Record<string, FunctionParameterType>) => buildParameters(parameters, types, true);

//@ts-ignore
global.DWA_BROWSER = false;

describe("callFunction parameter serialization", () => {
    it("escapes and encodes strings and quotes GUID substrings", () => {
        expect(
            buildFunctionParameters({ name: "O'Brien", q: "R&D #1", note: "see 3f2504e0-4f89-11d3-9a0c-0305e82c3301 for details" }).queryParams,
        ).to.deep.equal(["@p1=%27O%27%27Brien%27", "@p2=%27R%26D%20%231%27", "@p3=%27see%203f2504e0-4f89-11d3-9a0c-0305e82c3301%20for%20details%27"]);
    });
    it("honors explicit types and encodes raw values", () => {
        const id = "3f2504e0-4f89-11d3-9a0c-0305e82c3301";
        expect(
            buildFunctionParameters({ text: id, id: `{${id}}`, raw: "Microsoft.Dynamics.CRM.Enum'A+B'" }, { text: "string", id: "guid", raw: "raw" })
                .queryParams,
        ).to.deep.equal([`@p1=%27${id}%27`, `@p2=${id}`, "@p3=Microsoft.Dynamics.CRM.Enum%27A%2BB%27"]);
    });
    it("rejects invalid overrides", () => {
        expect(() => buildFunctionParameters({ id: "bad" }, { id: "guid" })).to.throw("id");
        expect(() => buildFunctionParameters({}, { missing: "string" })).to.throw("missing");
        expect(() => buildFunctionParameters({ x: "" }, { x: "raw" })).to.throw("x");
    });
});

import nock from "nock";
import sinon from "sinon";
import crypto from "crypto";
import { DynamicsWebApi, UnboundFunctionRequest } from "../../src/dynamics-web-api";
import { XhrWrapper } from "../../src/client/xhr";
import { serverUrl, webApiUrl92, responses } from "../stubs";

const guid = "3f2504e0-4f89-11d3-9a0c-0305e82c3301";
const supported: UnboundFunctionRequest = { name: "Fn", parameterTypes: { x: "string", y: "guid", z: "raw" } };
// @ts-expect-error unsupported explicit parameter type
const unsupported: UnboundFunctionRequest = { name: "Fn", parameterTypes: { x: "integer" } };
void supported;
void unsupported;

describe("callFunction parameter edge cases", () => {
    it("encodes empty strings, apostrophes, Unicode, plus and percent", () => {
        expect(buildFunctionParameters({ empty: "", text: "'' café + %2F" }).queryParams).to.deep.equal([
            "@p1=%27%27",
            "@p2=%27%27%27%27%27%20caf%C3%A9%20%2B%20%252F%27",
        ]);
    });
    it("preserves inferred types and honors explicit string values", () => {
        expect(
            buildFunctionParameters(
                { a: guid, b: `{${guid}}`, c: `see ${guid}`, d: "Microsoft.Dynamics.CRM.Enum'X'", e: guid, f: "Microsoft.Dynamics.CRM.text" },
                { e: "string", f: "string" },
            ).queryParams,
        ).to.deep.equal([
            `@p1=${guid}`,
            `@p2=${guid}`,
            `@p3=%27see%20${guid}%27`,
            "@p4=Microsoft.Dynamics.CRM.Enum%27X%27",
            `@p5=%27${guid}%27`,
            "@p6=%27Microsoft.Dynamics.CRM.text%27",
        ]);
    });
    it("serializes JSON data without treating descriptor-shaped objects as wrappers", () => {
        const result = buildFunctionParameters({ obj: { type: "string", value: "A&B#%" }, array: ["+", "O'Brien"] });
        expect(result.queryParams).to.deep.equal([
            "@p1=%7B%22type%22%3A%22string%22%2C%22value%22%3A%22A%26B%23%25%22%7D",
            "@p2=%5B%22%2B%22%2C%22O%27Brien%22%5D",
        ]);
    });
    it("skips nulls without renumbering and preserves inputs", () => {
        const parameters = { omitted: null, name: "O'Brien", other: undefined, id: guid };
        const types = { omitted: "string" as const, name: "string" as const };
        const original = { ...parameters };
        expect(buildFunctionParameters(parameters, types)).to.deep.equal({ key: "(name=@p2,id=@p4)", queryParams: ["@p2=%27O%27%27Brien%27", `@p4=${guid}`] });
        expect(parameters).to.deep.equal(original);
        expect(types).to.deep.equal({ omitted: "string", name: "string" });
    });
    it("rejects invalid maps, types, and non-string overrides", () => {
        for (const map of [null, [], "string"]) expect(() => buildFunctionParameters({ x: "a" }, map as any)).to.throw();
        expect(() => buildFunctionParameters({ x: "a" }, { x: "bad" } as any)).to.throw("x");
        for (const type of ["string", "guid", "raw"] as const) expect(() => buildFunctionParameters({ x: 1 }, { x: type })).to.throw("x");
        expect(() => buildFunctionParameters({ x: "  " }, { x: "raw" })).to.throw("x");
        expect(buildFunctionParameters(undefined, {})).to.deep.equal({ key: "()", queryParams: [] });
    });
});

describe("callFunction request aliases", () => {
    const api = new DynamicsWebApi({ serverUrl, useODataFunctionParameterSerialization: true });
    afterEach(() => nock.cleanAll());

    it("sends encoded unbound and bound requests, including the v2 functionName fallback", async () => {
        const scope = nock(webApiUrl92)
            .get("/MyFn(q=@p1)")
            .query({ "@p1": "'R&D #1'" })
            .reply(200, {}, { "Content-Type": "application/json" })
            .get(`/accounts(${guid})/MyFn(q=@p1)`)
            .query({ "@p1": "'O''Brien'" })
            .reply(200, {}, { "Content-Type": "application/json" });
        await api.callFunction({ functionName: "MyFn", parameters: { q: "R&D #1" } });
        await api.callFunction({ name: "MyFn", collection: "accounts", key: guid, parameters: { q: "O'Brien" } });
        expect(scope.isDone()).to.equal(true);
    });
    it("includes encoded aliases in the batch GET request", async () => {
        let body = "";
        const scope = nock(webApiUrl92)
            .post("/$batch", (value) => {
                body = String(value);
                return true;
            })
            .reply(responses.batchError.status, responses.batchError.responseText, responses.batchError.responseHeaders);
        api.startBatch();
        await api.callFunction({ name: "MyFn", parameters: { q: "R&D #1" } });
        try {
            await api.executeBatch();
        } catch (_) {
            /* fixture represents a batch error */
        }
        expect(body).to.contain("MyFn(q=@p1)?@p1=%27R%26D%20%231%27 HTTP/1.1");
        expect(scope.isDone()).to.equal(true);
    });
    it("validates overrides before making a request", async () => {
        let failure: Error | undefined;
        try {
            await api.callFunction({ name: "MyFn", parameters: { x: 5 }, parameterTypes: { x: "string" } });
        } catch (error) {
            failure = error as Error;
        }
        expect(failure).to.be.instanceOf(Error);
        expect(failure!.message).to.contain("x");
    });
    it("sends encoded aliases through XMLHttpRequest", async () => {
        //@ts-ignore
        const oldBrowser = global.DWA_BROWSER;
        const oldWindow = global.window;
        const oldXhr = global.XMLHttpRequest;
        let fake: ReturnType<typeof sinon.useFakeXMLHttpRequest> | undefined;
        try {
            //@ts-ignore
            global.DWA_BROWSER = true;
            (global as any).window = {
                crypto: crypto.webcrypto,
                btoa: (value: string) => Buffer.from(value, "binary").toString("base64"),
                atob: (value: string) => Buffer.from(value, "base64").toString("binary"),
            };
            fake = sinon.useFakeXMLHttpRequest();
            (global as any).XMLHttpRequest = fake;
            let captured: any;
            fake.onCreate = (xhr) => {
                captured = xhr;
            };
            XhrWrapper.afterSendEvent = () => captured.respond(200, { "Content-Type": "application/json" }, "{}");
            await api.callFunction({ name: "MyFn", parameters: { x: guid }, parameterTypes: { x: "string" } });
            expect(captured.url).to.contain(`MyFn(x=@p1)?@p1=%27${guid}%27`);
        } finally {
            fake?.restore();
            XhrWrapper.afterSendEvent = undefined as any;
            //@ts-ignore
            global.DWA_BROWSER = oldBrowser;
            global.window = oldWindow;
            global.XMLHttpRequest = oldXhr;
        }
    });
});

describe("callFunction serialization configuration", () => {
    it("preserves v2 aliases by default, including pre-encoded strings and GUID substrings", () => {
        const result = buildParameters({ text: "R%26D", quote: "O''Brien", note: `see ${guid}`, object: { text: "R%26D" }, empty: null });
        expect(result).to.deep.equal({
            key: "(text=@p1,quote=@p2,note=@p3,object=@p4)",
            queryParams: ["@p1='R%26D'", "@p2='O''Brien'", `@p3=see ${guid}`, '@p4={"text":"R%26D"}'],
        });
    });
    it("requires opt-in when parameterTypes is supplied", () => {
        expect(() => buildParameters({ x: guid }, { x: "string" })).to.throw("useODataFunctionParameterSerialization");
    });
    it("validates the flag and supports setConfig toggling", async () => {
        expect(() => new DynamicsWebApi({ serverUrl, useODataFunctionParameterSerialization: "true" as any })).to.throw(
            "useODataFunctionParameterSerialization",
        );
        const client = new DynamicsWebApi({ serverUrl });
        const scope = nock(webApiUrl92)
            .get("/Fn(x=@p1)")
            .query({ "@p1": "'R&D'" })
            .reply(200, {}, { "Content-Type": "application/json" })
            .get("/Fn(x=@p1)")
            .query({ "@p1": "'R%26D'" })
            .reply(200, {}, { "Content-Type": "application/json" })
            .get("/Fn(x=@p1)")
            .query({ "@p1": "'R&D'" })
            .reply(200, {}, { "Content-Type": "application/json" });
        try {
            await client.callFunction({ name: "Fn", parameters: { x: "R%26D" } });
            client.setConfig({ useODataFunctionParameterSerialization: true });
            await client.callFunction({ name: "Fn", parameters: { x: "R%26D" } });
            client.setConfig({ useODataFunctionParameterSerialization: false });
            await client.callFunction({ name: "Fn", parameters: { x: "R%26D" } });
            expect(scope.isDone()).to.equal(true);
        } finally {
            nock.cleanAll();
        }
    });
});
