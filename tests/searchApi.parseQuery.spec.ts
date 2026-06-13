import { expect } from "chai";

import { parseQueryResponse, type QueryResponseInternal } from "../src/requests/search/responseParsers/parseQueryResponse.js";
import { parseSuggestResponse, type SuggestResponseInternal } from "../src/requests/search/responseParsers/parseSuggestResponse.js";
import { type AutocompleteResponseInternal, parseAutocompleteResponse } from "../src/requests/search/responseParsers/parseAutocompleteResponse.js";
import type { AutocompleteResponse, QueryResponse, SuggestResponse } from "../src/dynamics-web-api.js";

describe("parseQueryResponse", () => {
    it("returns undefined if response is undefined", () => {
        const result = parseQueryResponse(undefined!, { version: "2.0", url: "", enableSearchApiResponseCompatibility: true });
        expect(result).to.be.undefined;
    });

    describe("v1.0 <- v2.0", () => {
        const responseValue: QueryResponse["response"] = {
            Value: [{ Id: "1", EntityName: "test", Attributes: {}, Highlights: {}, ObjectTypeCode: 2, Score: 1.2 }],
            Facets: { name: [] },
            Count: 100,
            //@ts-ignore
            QueryContext: { alteredquery: "test" },
            Error: null,
        };

        const queryResponse: QueryResponseInternal = {
            facets: null,
            totalrecordcount: -1,
            value: [],
            querycontext: null,
            response: JSON.stringify(responseValue),
            "@odata.context": "https://example.com/#QueryResponse",
        };

        it("should parse the query response correctly", () => {
            const result = parseQueryResponse(queryResponse, { version: "2.0", url: "", enableSearchApiResponseCompatibility: true });
            expect(result).to.deep.equal({
                ...queryResponse,
                value: responseValue.Value,
                facets: responseValue.Facets,
                totalrecordcount: responseValue.Count,
                querycontext: responseValue.QueryContext,
                response: responseValue,
            });
        });
    });

    describe("v2.0 <- v1.0", () => {
        const queryResponse: QueryResponseInternal = {
            facets: { name: [] },
            totalrecordcount: 100,
            value: [{ Id: "1", EntityName: "test", Attributes: {}, Highlights: {}, ObjectTypeCode: 2, Score: 1.2 }],
            querycontext: { alteredquery: "test" },
            response: "",
            "@odata.context": "https://example.com/#QueryResponse",
        };

        it("should parse the query response correctly", () => {
            const result = parseQueryResponse(queryResponse, { version: "1.0", url: "", enableSearchApiResponseCompatibility: true });
            expect(result).to.deep.equal({
                ...queryResponse,
                response: {
                    Count: queryResponse.totalrecordcount,
                    Value: queryResponse.value,
                    Facets: queryResponse.facets,
                    QueryContext: queryResponse.querycontext,
                    Error: null,
                },
            });
        });
    });
});

describe("parseSuggestResponse", () => {
    it("returns undefined if response is undefined", () => {
        const result = parseSuggestResponse(undefined!, { version: "2.0", url: "", enableSearchApiResponseCompatibility: true });
        expect(result).to.be.undefined;
    });

    describe("v1.0 <- v2.0", () => {
        const responseValue: SuggestResponse["response"] = {
            Value: [{ Document: "test", Text: "text", document: "", text: "" }],
            //@ts-ignore
            QueryContext: { alteredquery: "test" },
            Error: null,
        };

        const queryResponse: SuggestResponseInternal = {
            value: [],
            querycontext: null,
            response: JSON.stringify(responseValue),
            "@odata.context": "https://example.com/#QueryResponse",
        };

        const result = parseSuggestResponse(queryResponse, { version: "2.0", url: "", enableSearchApiResponseCompatibility: true });

        it("should parse the query response correctly", () => {
            expect(result).to.deep.equal({
                ...queryResponse,
                value: responseValue.Value.map((item) => {
                    item.document = item.Document;
                    item.text = item.Text;
                    return item;
                }),
                querycontext: responseValue.QueryContext,
                response: responseValue,
            });
        });
    });

    describe("v2.0 <- v1.0", () => {
        const queryResponse: SuggestResponseInternal = {
            value: [{ Document: "", Text: "", document: "test", text: "text" }],
            querycontext: { alteredquery: "test" },
            response: "",
            "@odata.context": "https://example.com/#QueryResponse",
        };

        const result = parseSuggestResponse(queryResponse, { version: "1.0", url: "", enableSearchApiResponseCompatibility: true });

        it("should parse the query response correctly", () => {
            expect(result).to.deep.equal({
                ...queryResponse,
                response: {
                    Value: queryResponse.value.map((item) => {
                        item.Document = item.document;
                        item.Text = item.text;
                        return item;
                    }),
                    QueryContext: queryResponse.querycontext,
                    Error: null,
                },
            });
        });
    });
});

describe("parseAutocompleteResponse", () => {
    it("returns undefined if response is undefined", () => {
        const result = parseAutocompleteResponse(undefined!, { version: "2.0", url: "", enableSearchApiResponseCompatibility: true });
        expect(result).to.be.undefined;
    });

    describe("v1.0 <- v2.0", () => {
        const responseValue: AutocompleteResponse["response"] = {
            Error: null,
            //@ts-ignore
            QueryContext: { alteredquery: "test" },
            Value: "autocomplete",
        };

        const queryResponse: AutocompleteResponseInternal = {
            value: "",
            querycontext: null,
            response: JSON.stringify(responseValue),
            "@odata.context": "https://example.com/#QueryResponse",
        };

        const result = parseAutocompleteResponse(queryResponse, { version: "2.0", url: "", enableSearchApiResponseCompatibility: true });

        it("should parse the autocomplete response correctly", () => {
            expect(result).to.deep.equal({
                ...queryResponse,
                value: responseValue.Value,
                querycontext: responseValue.QueryContext,
                response: responseValue,
            });
        });
    });

    describe("v2.0 <- v1.0", () => {
        const queryResponse: AutocompleteResponseInternal = {
            value: "autocomplete",
            querycontext: { alteredquery: "test" },
            response: "",
            "@odata.context": "https://example.com/#QueryResponse",
        };

        const result = parseAutocompleteResponse(queryResponse, { version: "1.0", url: "", enableSearchApiResponseCompatibility: true });

        it("should parse the autocomplete response correctly", () => {
            expect(result).to.deep.equal({
                ...queryResponse,
                response: {
                    Value: queryResponse.value,
                    QueryContext: queryResponse.querycontext,
                    Error: null,
                },
            });
        });
    });
});
