import { expect } from "chai";
import { IDataverseClient } from "../../src/client/dataverse";
import { Config } from "../../src/dynamics-web-api";
import { retrieveGlobalOptionSet } from "../../src/requests";
import { InternalRequest } from "../../src/types";
import { defaultConfig } from "../../src/utils/Config";

const defaultClient: IDataverseClient = {
    config: defaultConfig(),
    isBatch: false,
    batchRequestId: null,
    makeRequest: async (_request: InternalRequest) => undefined,
    setConfig: (_config: Config): void => {},
};

describe("dynamicsWebApi.retrieveGlobalOptionSet", () => {
    it("castType. returns expected result", async () => {
        const result = await retrieveGlobalOptionSet(
            {
                key: "test",
                castType: "OptionSetMetadata",
            },
            defaultClient,
        );

        expect(result).to.be.undefined;
    });
    it("castType. wrong type throws error", async () => {
        try {
            await retrieveGlobalOptionSet(
                {
                    key: "test",
                    castType: true as any,
                },
                defaultClient,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
        }
    });
});
