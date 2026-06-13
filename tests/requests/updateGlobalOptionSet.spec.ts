import { expect } from "chai";
import type { IDataverseClient } from "../../src/client/dataverse.js";
import type { Config } from "../../src/dynamics-web-api.js";
import { updateGlobalOptionSet } from "../../src/requests/index.js";
import type { InternalRequest } from "../../src/types.js";
import { defaultConfig } from "../../src/utils/Config.js";
import { data } from "../stubs.js";

const defaultClient: IDataverseClient = {
    config: defaultConfig(),
    isBatch: false,
    batchRequestId: null,
    makeRequest: async (_request: InternalRequest) => undefined,
    setConfig: (_config: Config): void => {},
};

describe("dynamicsWebApi.updateGlobalOptionSet", () => {
    it("castType. returns expected result", async () => {
        const result = await updateGlobalOptionSet(
            {
                castType: "OptionSetMetadata",
                data: {
                    MetadataId: data.testEntityId,
                },
            },
            defaultClient,
        );

        expect(result).to.be.undefined;
    });
    it("castType. wrong type throws error", async () => {
        try {
            await updateGlobalOptionSet(
                {
                    data: {
                        MetadataId: data.testEntityId,
                    },
                    castType: true as any,
                },
                defaultClient,
            );
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
        }
    });
});
