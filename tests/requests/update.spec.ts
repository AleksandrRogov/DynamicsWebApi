import { expect } from "chai";
import type { IDataverseClient } from "../../src/client/dataverse.js";
import type { Config } from "../../src/dynamics-web-api.js";
import { update } from "../../src/requests/index.js";
import type { InternalRequest, WebApiResponse } from "../../src/types.js";
import { defaultConfig } from "../../src/utils/Config.js";

const defaultClient: IDataverseClient = {
    config: defaultConfig(),
    isBatch: false,
    batchRequestId: null,
    makeRequest: async (_request: InternalRequest) => undefined,
    setConfig: (_config: Config): void => {},
};

describe("dynamicsWebApi.update", () => {
    it("propagateErrors = true. propagates errors correctly", async () => {
        const testClient = {
            ...defaultClient,
            config: {
                ...defaultClient.config,
                propagateErrors: true,
            },
            makeRequest: async (_request: InternalRequest) => {
                throw { status: 412, message: "Test error" };
            },
        };

        try {
            await update(
                {
                    collection: "test",
                },
                testClient,
            );
        } catch (error: any) {
            expect(error).to.deep.equal({ status: 412, message: "Test error" });
        }
    });

    it("propagateErrors = true. returns expected result when no error", async () => {
        const testClient = {
            ...defaultClient,
            config: {
                ...defaultClient.config,
                propagateErrors: true,
            },
            makeRequest: async (_request: InternalRequest) => {
                return { status: 200, data: {}, headers: {} } satisfies WebApiResponse;
            },
        };

        const result = await update(
            {
                collection: "test",
            },
            testClient,
        );
        expect(result).to.deep.equal({});
    });
});
