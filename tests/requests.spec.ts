import { expect } from "chai";
import { IDataverseClient } from "../src/client/dataverse";
import { Config } from "../src/dynamics-web-api";
import { associate, associateSingleValued, countAll } from "../src/requests";
import { InternalRequest, WebApiResponse } from "../src/types";
import { defaultConfig } from "../src/utils/Config";

const defaultClient: IDataverseClient = {
    config: defaultConfig(),
    isBatch: false,
    batchRequestId: null,
    makeRequest: async (_request: InternalRequest) => undefined,
    setConfig: (_config: Config): void => {},
};

describe("countAll", () => {
    it("returns number of items in an array", async () => {
        const testClient = {
            ...defaultClient,
            makeRequest: async (_request: InternalRequest) => {
                return { data: { value: ["something", "test"] } } as WebApiResponse;
            },
        };

        const response = await countAll(
            {
                collection: "test",
            },
            testClient,
        );

        expect(response).to.equal(2);
    });
});

describe("associate", () => {
    it("isBatch = true, relatedKey starts with '$'", async () => {
        const testClient = {
            ...defaultClient,
            isBatch: true,
            makeRequest: async (request: InternalRequest) => {
                expect(request.method).to.equal("POST");
                expect(request.navigationProperty).to.equal("relationshipName/$ref");
                expect(request.data).to.deep.equal({ "@odata.id": "$2" });
                return { data: {} } as WebApiResponse;
            },
        };

        await associate(
            {
                primaryKey: "00000000-0000-0000-0000-000000000001",
                relatedKey: "$2",
                relationshipName: "relationshipName",
            },
            testClient,
        );
    });

    it("isBatch = true, relatedKey is a key", async () => {
        const testClient = {
            ...defaultClient,
            isBatch: true,
            makeRequest: async (request: InternalRequest) => {
                expect(request.method).to.equal("POST");
                expect(request.navigationProperty).to.equal("relationshipName/$ref");
                expect(request.data).to.deep.equal({ "@odata.id": "relatedCollection(key='value')" });
                return { data: {} } as WebApiResponse;
            },
        };

        await associate(
            {
                primaryKey: "00000000-0000-0000-0000-000000000001",
                relatedKey: "key='value'",
                relatedCollection: "relatedCollection",
                relationshipName: "relationshipName",
            },
            testClient,
        );
    });

    it("isBatch = false, relatedKey is a key", async () => {
        const testClient = {
            ...defaultClient,
            isBatch: false,
            makeRequest: async (request: InternalRequest) => {
                expect(request.method).to.equal("POST");
                expect(request.navigationProperty).to.equal("relationshipName/$ref");
                expect(request.data).to.deep.equal({ "@odata.id": "relatedCollection(key='value')" });
                return { data: {} } as WebApiResponse;
            },
        };

        await associate(
            {
                primaryKey: "00000000-0000-0000-0000-000000000001",
                relatedKey: "key='value'",
                relatedCollection: "relatedCollection",
                relationshipName: "relationshipName",
            },
            testClient,
        );
    });

    it("isBatch = false, relatedKey starts with '$' throws an error", async () => {
        const testClient = {
            ...defaultClient,
            isBatch: false,
            makeRequest: async () => {
                throw new Error("This should not be called");
            },
        };

        try {
            await associate(
                {
                    primaryKey: "00000000-0000-0000-0000-000000000001",
                    relatedKey: "$2",
                    relatedCollection: "relatedCollection",
                    relationshipName: "relationshipName",
                },
                testClient,
            );
        } catch (error: any) {
            expect(error.message).to.equal(
                "DynamicsWebApi.associate requires a request.relatedKey parameter to be of type String representing GUID or Alternate Key.",
            );
        }
    });

    it("isBatch = true, relatedKey is a key and relatedCollection is not provided throws an error", async () => {
        const testClient = {
            ...defaultClient,
            isBatch: true,
            makeRequest: async () => {
                throw new Error("This should not be called");
            },
        };

        try {
            await associate(
                {
                    primaryKey: "00000000-0000-0000-0000-000000000001",
                    relatedKey: "key='value'",
                    relationshipName: "relationshipName",
                },
                testClient,
            );
        } catch (error: any) {
            expect(error.message).to.equal("DynamicsWebApi.associate requires a request.relatedCollection parameter to be of type String.");
        }
    });
});

//generate test cases for associateSingleValued similar to associate
describe("associateSingleValued", () => {
    it("isBatch = true, relatedKey starts with '$'", async () => {
        const testClient = {
            ...defaultClient,
            isBatch: true,
            makeRequest: async (request: InternalRequest) => {
                expect(request.method).to.equal("PUT");
                expect(request.navigationProperty).to.equal("navigationProperty/$ref");
                expect(request.data).to.deep.equal({ "@odata.id": "$2" });
                return { data: {} } as WebApiResponse;
            },
        };

        await associateSingleValued(
            {
                primaryKey: "00000000-0000-0000-0000-000000000001",
                relatedKey: "$2",
                navigationProperty: "navigationProperty",
            },
            testClient,
        );
    });

    it("isBatch = true, relatedKey is a key", async () => {
        const testClient = {
            ...defaultClient,
            isBatch: true,
            makeRequest: async (request: InternalRequest) => {
                expect(request.method).to.equal("PUT");
                expect(request.navigationProperty).to.equal("navigationProperty/$ref");
                expect(request.data).to.deep.equal({ "@odata.id": "relatedCollection(key='value')" });
                return { data: {} } as WebApiResponse;
            },
        };

        await associateSingleValued(
            {
                primaryKey: "00000000-0000-0000-0000-000000000001",
                relatedKey: "key='value'",
                relatedCollection: "relatedCollection",
                navigationProperty: "navigationProperty",
            },
            testClient,
        );
    });

    it("isBatch = false, relatedKey is a key", async () => {
        const testClient = {
            ...defaultClient,
            isBatch: false,
            makeRequest: async (request: InternalRequest) => {
                expect(request.method).to.equal("PUT");
                expect(request.navigationProperty).to.equal("navigationProperty/$ref");
                expect(request.data).to.deep.equal({ "@odata.id": "relatedCollection(key='value')" });
                return { data: {} } as WebApiResponse;
            },
        };

        await associateSingleValued(
            {
                primaryKey: "00000000-0000-0000-0000-000000000001",
                relatedKey: "key='value'",
                relatedCollection: "relatedCollection",
                navigationProperty: "navigationProperty",
            },
            testClient,
        );
    });
    it("isBatch = false, relatedKey starts with '$' throws an error", async () => {
        const testClient = {
            ...defaultClient,
            isBatch: false,
            makeRequest: async () => {
                throw new Error("This should not be called");
            },
        };

        try {
            await associateSingleValued(
                {
                    primaryKey: "00000000-0000-0000-0000-000000000001",
                    relatedKey: "$2",
                    relatedCollection: "relatedCollection",
                    navigationProperty: "navigationProperty",
                },
                testClient,
            );
        } catch (error: any) {
            expect(error.message).to.equal(
                "DynamicsWebApi.associateSingleValued requires a request.relatedKey parameter to be of type String representing GUID or Alternate Key.",
            );
        }
    });
    it("isBatch = true, relatedKey is a key and relatedCollection is not provided throws an error", async () => {
        const testClient = {
            ...defaultClient,
            isBatch: true,
            makeRequest: async () => {
                throw new Error("This should not be called");
            },
        };

        try {
            await associateSingleValued(
                {
                    primaryKey: "00000000-0000-0000-0000-000000000001",
                    relatedKey: "key='value'",
                    navigationProperty: "navigationProperty",
                },
                testClient,
            );
        } catch (error: any) {
            expect(error.message).to.equal("DynamicsWebApi.associateSingleValued requires a request.relatedCollection parameter to be of type String.");
        }
    });
});
