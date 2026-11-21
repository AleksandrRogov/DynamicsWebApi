import { expect } from "chai";
import nock from "nock";
import { DynamicsWebApi } from "../../src/dynamics-web-api.js";
import { buildFunctionParameters } from "../../src/utils/Utility.js";
import { serverUrl, webApiUrl92 } from "../stubs.js";

// @ts-ignore
global.DWA_BROWSER = false;

describe("callFunction parameter serialization", () => {
    afterEach(() => nock.cleanAll());

    it("escapes and encodes function parameters and honors explicit types", () => {
        const guid = "3f2504e0-4f89-11d3-9a0c-0305e82c3301";
        const result = buildFunctionParameters(
            { text: "O'Brien & #1", embedded: `see ${guid}`, stringId: guid, id: `{${guid}}`, raw: "A'B", obj: { a: "&" } },
            { stringId: "string", id: "guid", raw: "raw" },
        );
        expect(result.queryParams).to.deep.equal([
            "@p1=%27O%27%27Brien%20%26%20%231%27",
            `@p2=%27see%20${guid}%27`,
            `@p3=%27${guid}%27`,
            `@p4=${guid}`,
            "@p5=A%27B",
            "@p6=%7B%22a%22%3A%22%26%22%7D",
        ]);
        expect(() => buildFunctionParameters({ id: "bad" }, { id: "guid" })).to.throw("Invalid function parameter id");
        expect(() => buildFunctionParameters({ a: "x" }, { missing: "string" })).to.throw("Unknown function parameter");
        expect(() => buildFunctionParameters({ a: "x" }, { a: "bad" as any })).to.throw("Invalid type");
        expect(() => buildFunctionParameters({ a: 1 }, { a: "raw" })).to.throw("Invalid function parameter a");
    });

    it("sends escaped function parameters through the public API", async () => {
        const api = new DynamicsWebApi({ serverUrl });
        const guid = "3f2504e0-4f89-11d3-9a0c-0305e82c3301";
        const scope = nock(webApiUrl92)
            .get("/MyFunction(text=@p1,id=@p2)")
            .query({ "@p1": "'O''Brien & Co'", "@p2": `'${guid}'` })
            .reply(200, { value: "ok" });
        await api.callFunction({ name: "MyFunction", parameters: { text: "O'Brien & Co", id: guid }, parameterTypes: { id: "string" } });
        expect(scope.isDone()).to.equal(true);
    });
});
