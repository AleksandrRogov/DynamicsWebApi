import { expect } from "chai";
import { IDataverseClient } from "../../src/client/dataverse";
import { Config } from "../../src/dynamics-web-api";
import { updateGlobalOptionSet } from "../../src/requests";
import { InternalRequest } from "../../src/types";
import { defaultConfig } from "../../src/utils/Config";
import { data } from "../stubs";

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
