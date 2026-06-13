import { expect } from "chai";

import type { Query, Suggest } from "../src/dynamics-web-api.js";
import { convertEntitiesProperty, convertQuery, convertSearchQuery, convertSuggestOrAutocompleteQuery } from "../src/requests/search/convertSearchQuery.js";
import type { InternalApiConfig } from "../src/utils/Config.js";

describe("convertEntitiesProperty", () => {
    it("returns undefined if entities is undefined", () => {
        const convertedEntities = convertEntitiesProperty(undefined, "1.0");
        expect(convertedEntities).to.be.undefined;
    });

    describe("v1.0 <- v2.0", () => {
        describe("string", () => {
            const entities = JSON.stringify([
                {
                    name: "account",
                    filter: "filter should be removed",
                },
                {
                    name: "contact",
                    filter: "filter should be removed",
                },
            ]);

            it("converts the entities correctly", () => {
                const convertedEntities = convertEntitiesProperty(entities, "1.0");

                expect(convertedEntities).to.deep.equal(["account", "contact"]);
            });
        });

        describe("invalid json string", () => {
            const entities = "invalid json string";

            it("throws an error", () => {
                expect(function () {
                    convertEntitiesProperty(entities, "1.0");
                }).to.throw("The 'query.entities' property must be a valid JSON string.");
            });
        });

        describe("string - not an array", () => {
            const entities = '{ "test": "invalid json string" }';

            it("throws an error", () => {
                expect(function () {
                    convertEntitiesProperty(entities, "1.0");
                }).to.throw("The 'query.entities' property must be an array of strings or objects.");
            });
        });

        describe("array of objects", () => {
            const entities = [
                {
                    name: "account",
                    filter: "filter should be removed",
                },
                {
                    name: "contact",
                    filter: "filter should be removed",
                },
            ];

            it("converts the entities correctly", () => {
                const convertedEntities = convertEntitiesProperty(entities, "1.0");

                expect(convertedEntities).to.deep.equal(["account", "contact"]);
            });
        });

        describe("array of strings", () => {
            const entities = ["account", "contact"];

            it("should be left as is", () => {
                const convertedEntities = convertEntitiesProperty(entities, "1.0");

                expect(convertedEntities).to.deep.equal(["account", "contact"]);
            });
        });
    });

    describe("v2.0 <- v1.0", () => {
        describe("string", () => {
            const entities = "does not matter what is in here";

            it("should be left as is", () => {
                const convertedEntities = convertEntitiesProperty(entities, "2.0");

                expect(convertedEntities).to.deep.equal(entities);
            });
        });

        describe("array of strings", () => {
            const entities = ["account", "contact"];

            it("converts the entities correctly", () => {
                const convertedEntities = convertEntitiesProperty(entities, "2.0");

                expect(convertedEntities).to.deep.equal(
                    JSON.stringify([
                        {
                            name: "account",
                        },
                        {
                            name: "contact",
                        },
                    ]),
                );
            });
        });

        describe("array of objects", () => {
            const entities = [
                {
                    name: "account",
                    filter: "filter should be removed",
                },
                {
                    name: "contact",
                    filter: "filter should be removed",
                },
            ];

            it("should become a string", () => {
                const convertedEntities = convertEntitiesProperty(entities, "2.0");

                expect(convertedEntities).to.equal(JSON.stringify(entities));
            });
        });
    });
});

describe("convertQuery", () => {
    describe("v1.0 <- v2.0", () => {
        describe("options (string)", () => {
            const searchQuery: Query = {
                search: "test",
                options: JSON.stringify({
                    searchmode: "any",
                    querytype: "simple",
                }),
            };

            it("converts the query correctly", () => {
                convertQuery(searchQuery, "1.0");

                expect(searchQuery).to.deep.equal({
                    search: "test",
                    searchMode: "any",
                    searchType: "simple",
                });
            });
        });

        describe("options (invalid json string)", () => {
            const searchQuery: Query = {
                search: "test",
                options: "invalid json string",
            };

            it("throws an error", () => {
                expect(function () {
                    convertQuery(searchQuery, "1.0");
                }).to.throw("The 'query.options' property must be a valid JSON string.");
            });
        });

        describe("options, count", () => {
            const searchQuery: Query = {
                search: "test",
                count: true,
                options: {
                    searchMode: "all",
                    queryType: "lucene",
                },
            };

            it("converts the query correctly", () => {
                convertQuery(searchQuery, "1.0");

                expect(searchQuery).to.deep.equal({
                    search: "test",
                    returnTotalRecordCount: true,
                    searchMode: "all",
                    searchType: "full",
                });
            });
        });

        describe("options - existing", () => {
            const searchQuery: Query = {
                search: "test",
                searchMode: "all",
                searchType: "full",
                returnTotalRecordCount: false,
                count: true,
                options: {
                    searchMode: "any",
                    queryType: "simple",
                },
            };

            it("should not be rewritten", () => {
                convertQuery(searchQuery, "1.0");
                expect(searchQuery).to.deep.equal({
                    search: "test",
                    searchMode: "all",
                    searchType: "full",
                    returnTotalRecordCount: false,
                });
            });
        });

        describe("orderBy", () => {
            it("should parse the value into an array", () => {
                const searchQuery: Query = {
                    search: "test",
                    orderBy: JSON.stringify(["name desc", "contactname asc"]),
                };
                convertQuery(searchQuery, "1.0");

                expect(searchQuery).to.deep.equal({
                    search: "test",
                    orderBy: ["name desc", "contactname asc"],
                });
            });

            it("throws an error - invalid JSON string", () => {
                const searchQuery: Query = {
                    search: "test",
                    orderBy: "invalid json string",
                };

                expect(function () {
                    convertQuery(searchQuery, "1.0");
                }).to.throw("The 'query.orderBy' property must be a valid JSON string.");
            });
        });

        describe("facets", () => {
            it("should parse the value into an array", () => {
                const searchQuery: Query = {
                    search: "test",
                    facets: JSON.stringify(["name", "contactname"]),
                };
                convertQuery(searchQuery, "1.0");

                expect(searchQuery).to.deep.equal({
                    search: "test",
                    facets: ["name", "contactname"],
                });
            });

            it("throws an error - invalid JSON string", () => {
                const searchQuery: Query = {
                    search: "test",
                    facets: "invalid json string",
                };

                expect(function () {
                    convertQuery(searchQuery, "1.0");
                }).to.throw("The 'query.facets' property must be a valid JSON string.");
            });
        });
    });

    describe("v2.0 <- v1.0", () => {
        describe("options (string)", () => {
            const searchQuery: Query = {
                search: "test",
                options: "does not matter what is in here",
            };

            it("left as is", () => {
                convertQuery(searchQuery, "2.0");

                expect(searchQuery).to.deep.equal({
                    search: "test",
                    options: "does not matter what is in here",
                });
            });
        });

        describe("returnTotalRecordCount, searchMode, searchType", () => {
            const searchQuery: Query = {
                search: "test",
                returnTotalRecordCount: true,
                searchMode: "all",
                searchType: "full",
            };

            it("converts the query correctly", () => {
                convertQuery(searchQuery, "2.0");

                expect(searchQuery).to.deep.equal({
                    search: "test",
                    count: true,
                    options: JSON.stringify({
                        searchmode: "all",
                        querytype: "lucene",
                    }),
                });
            });
        });

        describe("returnTotalRecordCount, searchMode, searchType 2", () => {
            const searchQuery: Query = {
                search: "test",
                returnTotalRecordCount: true,
                searchMode: "any",
                searchType: "simple",
            };

            it("converts the query correctly", () => {
                convertQuery(searchQuery, "2.0");

                expect(searchQuery).to.deep.equal({
                    search: "test",
                    count: true,
                    options: JSON.stringify({
                        searchmode: "any",
                        querytype: "simple",
                    }),
                });
            });
        });

        describe("existing options - returnTotalRecordCount, searchMode, searchType", () => {
            const searchQuery: Query = {
                search: "test",
                count: false,
                returnTotalRecordCount: true,
                searchMode: "all",
                searchType: "full",
                options: {
                    searchMode: "any",
                    queryType: "simple",
                    bestEffortSearchEnabled: true,
                },
            };

            it("should not overwrite", () => {
                convertQuery(searchQuery, "2.0");

                expect(searchQuery).to.deep.equal({
                    search: "test",
                    count: false,
                    options: JSON.stringify({
                        searchmode: "any",
                        querytype: "simple",
                        besteffortsearchenabled: true,
                    }),
                });
            });
        });

        describe("orderBy", () => {
            it("converts the query correctly and orderBy should be lowercase", () => {
                const searchQuery: Query = {
                    search: "test",
                    orderBy: ["name desc", "contactname asc"],
                };
                convertQuery(searchQuery, "2.0");

                expect(searchQuery).to.deep.equal({
                    search: "test",
                    orderby: JSON.stringify(["name desc", "contactname asc"]),
                });
            });

            it("(string) left as is", () => {
                const searchQuery: Query = {
                    search: "test",
                    orderBy: "doesnot matter what is in here",
                };

                convertQuery(searchQuery, "2.0");

                expect(searchQuery).to.deep.equal({
                    search: "test",
                    orderBy: "doesnot matter what is in here",
                });
            });
        });

        describe("facets", () => {
            it("should stringify the value", () => {
                const searchQuery: Query = {
                    search: "test",
                    facets: ["name", "contactname"],
                };

                convertQuery(searchQuery, "2.0");

                expect(searchQuery).to.deep.equal({
                    search: "test",
                    facets: JSON.stringify(["name", "contactname"]),
                });
            });

            it("(string) left as is", () => {
                const searchQuery: Query = {
                    search: "test",
                    facets: "doesnot matter what is in here",
                };

                convertQuery(searchQuery, "2.0");

                expect(searchQuery).to.deep.equal({
                    search: "test",
                    facets: "doesnot matter what is in here",
                });
            });
        });

        describe("options (string) - returnTotalRecordCount, searchMode, searchType", () => {
            const searchQuery: Query = {
                search: "test",
                returnTotalRecordCount: true,
                searchMode: "all",
                searchType: "full",
                options: "does not matter what is in here",
            };

            it("should not overwrite", () => {
                convertQuery(searchQuery, "2.0");

                expect(searchQuery).to.deep.equal({
                    search: "test",
                    count: true,
                    options: "does not matter what is in here",
                });
            });
        });
    });
});

describe("convertSearchQuery", () => {
    const defaultSearchApi: InternalApiConfig = {
        url: "",
    };

    describe("query is null", () => {
        const convertedQuery = convertSearchQuery(null as any, "query", defaultSearchApi);

        it("returns null", () => {
            expect(convertedQuery).to.be.null;
        });
    });

    describe("v1.0 <- v2.0", () => {
        describe("query", () => {
            const searchQuery: Query = {
                search: "test",
                entities: [
                    {
                        name: "account",
                        filter: "filter should be removed",
                    },
                    {
                        name: "contact",
                        filter: "filter should be removed",
                    },
                ],
                count: false,
                options: {
                    searchMode: "any",
                    queryType: "simple",
                },
                facets: ["facet1", "facet2"],
            };

            it("converts the query correctly", () => {
                const convertedQuery = convertSearchQuery(searchQuery, "query", { ...defaultSearchApi, version: "1.0" });

                expect(convertedQuery).to.deep.equal({
                    search: searchQuery.search,
                    returnTotalRecordCount: false,
                    entities: ["account", "contact"],
                    searchMode: "any",
                    searchType: "simple",
                    facets: searchQuery.facets,
                });
            });
        });

        describe("query - escape search term", () => {
            const searchQuery: Query = {
                search: "test+(test)",
                entities: [
                    {
                        name: "account",
                        filter: "filter should be removed",
                    },
                    {
                        name: "contact",
                        filter: "filter should be removed",
                    },
                ],
                count: false,
                options: {
                    searchMode: "any",
                    queryType: "simple",
                },
                facets: ["facet1", "facet2"],
            };

            it("converts the query correctly", () => {
                const convertedQuery = convertSearchQuery(searchQuery, "query", { ...defaultSearchApi, version: "1.0", escapeSpecialCharacters: true });

                expect(convertedQuery).to.deep.equal({
                    search: "test\\+\\(test\\)",
                    returnTotalRecordCount: false,
                    entities: ["account", "contact"],
                    searchMode: "any",
                    searchType: "simple",
                    facets: searchQuery.facets,
                });
            });
        });

        describe("suggest & autocomplete", () => {
            it("converts the query correctly", () => {
                const suggestQuery: Suggest = {
                    search: "test",
                    entities: [
                        {
                            name: "account",
                            filter: "filter should be removed",
                        },
                        {
                            name: "contact",
                            filter: "filter should be removed",
                        },
                    ],
                    options: {
                        advancedSuggestEnabled: true,
                    },
                    fuzzy: true,
                    top: 10,
                };

                const convertedQuery = convertSearchQuery(suggestQuery, "suggest", { ...defaultSearchApi, version: "1.0" });

                expect(convertedQuery).to.deep.equal({
                    search: suggestQuery.search,
                    entities: ["account", "contact"],
                    useFuzzy: true,
                    top: 10,
                });
            });

            it("useFuzzy does not get overridden if set", () => {
                const suggestQuery: Suggest = {
                    search: "test",
                    useFuzzy: false,
                    fuzzy: true,
                };

                const convertedQuery = convertSearchQuery(suggestQuery, "suggest", { ...defaultSearchApi, version: "1.0" });

                expect(convertedQuery).to.deep.equal({
                    search: suggestQuery.search,
                    useFuzzy: false,
                });
            });

            describe("orderBy", () => {
                it("should parse the value into an array", () => {
                    const suggestQuery: Suggest = {
                        search: "test",
                        orderBy: JSON.stringify(["name desc", "contactname asc"]),
                    };
                    convertSuggestOrAutocompleteQuery(suggestQuery, "1.0");

                    expect(suggestQuery).to.deep.equal({
                        search: "test",
                        orderBy: ["name desc", "contactname asc"],
                    });
                });

                it("throws an error - invalid JSON string", () => {
                    const suggestQuery: Suggest = {
                        search: "test",
                        orderBy: "invalid json string",
                    };

                    expect(function () {
                        convertSuggestOrAutocompleteQuery(suggestQuery, "1.0");
                    }).to.throw("The 'query.orderBy' property must be a valid JSON string.");
                });
                
            });
        });
    });

    describe("v2.0 <- v1.0", () => {
        describe("returnTotalRecordCount, searchMode, searchType", () => {
            const searchQuery: Query = {
                search: "test",
                returnTotalRecordCount: true,
                searchMode: "all",
                searchType: "full",
            };

            it("converts the query correctly", () => {
                const convertedQuery = convertSearchQuery(searchQuery, "query", { ...defaultSearchApi, version: "2.0" });

                expect(convertedQuery).to.deep.equal({
                    search: "test",
                    count: true,
                    options: JSON.stringify({
                        searchmode: "all",
                        querytype: "lucene",
                    }),
                });
            });
        });

        describe("suggest & autocomplete", () => {
            it("converts the query correctly", () => {
                const suggestQuery: Suggest = {
                    search: "test",
                    entities: [
                        {
                            name: "account",
                            filter: "filter should not be removed",
                        },
                        {
                            name: "contact",
                            filter: "filter should not be removed",
                        },
                    ],
                    options: {
                        advancedSuggestEnabled: true,
                    },
                    fuzzy: true,
                    top: 10,
                };

                const convertedQuery = convertSearchQuery(suggestQuery, "suggest", { ...defaultSearchApi, version: "2.0" });

                expect(convertedQuery).to.deep.equal({
                    search: suggestQuery.search,
                    entities: JSON.stringify([
                        {
                            name: "account",
                            filter: "filter should not be removed",
                        },
                        {
                            name: "contact",
                            filter: "filter should not be removed",
                        },
                    ]),
                    options: JSON.stringify({
                        advancedsuggestenabled: true,
                    }),
                    fuzzy: true,
                    top: 10,
                });
            });

            it("orderBy - converts the query correctly and orderBy should be lowercase", () => {
                const suggestQuery: Suggest = {
                    search: "test",
                    orderBy: ["name desc", "contactname asc"],
                };
                convertSearchQuery(suggestQuery, "suggest", { ...defaultSearchApi, version: "2.0" });

                expect(suggestQuery).to.deep.equal({
                    search: "test",
                    orderby: JSON.stringify(["name desc", "contactname asc"]),
                });
            });

            it("useFuzzy - should become fuzzy", () => {
                const suggestQuery: Suggest = {
                    search: "test",
                    useFuzzy: true,
                };
                convertSearchQuery(suggestQuery, "suggest", { ...defaultSearchApi, version: "2.0" });

                expect(suggestQuery).to.deep.equal({
                    search: "test",
                    fuzzy: true,
                });
            });

            it("fuzzy does not get overridden if set", () => {
                const suggestQuery: Suggest = {
                    search: "test",
                    useFuzzy: true,
                    fuzzy: false,
                };
                convertSearchQuery(suggestQuery, "autocomplete", { ...defaultSearchApi, version: "2.0" });

                expect(suggestQuery).to.deep.equal({
                    search: "test",
                    fuzzy: false,
                });
            });
        });
    });
});
