import { escapeSearchSpecialCharacters } from "../../helpers/Regex.js";
import type { Autocomplete, Suggest, Query, SearchEntity, SearchOptions, SuggestOptions } from "../../dynamics-web-api.js";
import type { InternalApiConfig } from "../../utils/Config.js";
import type { SearchApiFunction } from "./search.types.js";

export function convertSearchQuery(
    query: Query | Suggest | Autocomplete,
    functionName: SearchApiFunction,
    config: InternalApiConfig,
): Query | Suggest | Autocomplete {
    if (!query) return query;

    //escape special characters in a search query only if the option is set to true
    if (config?.escapeSpecialCharacters === true) {
        query.search = escapeSearchSpecialCharacters(query.search);
    }

    if (query.entities?.length) {
        query.entities = convertEntitiesProperty(query.entities, config?.version);
    }

    switch (functionName) {
        case "query":
            convertQuery(query as Query, config?.version);
            break;
        default:
            convertSuggestOrAutocompleteQuery(query as Suggest | Autocomplete, config?.version);
            break;
    }

    return query;
}

export function convertEntitiesProperty(entities?: string | string[] | SearchEntity[], version: string = "1.0"): string | string[] | undefined {
    if (!entities) return entities;
    if (typeof entities === "string") {
        if (version !== "1.0") return entities;
        try {
            entities = JSON.parse(entities) as SearchEntity[];
        } catch {
            throw new Error("The 'query.entities' property must be a valid JSON string.");
        }

        if (!Array.isArray(entities)) {
            throw new Error("The 'query.entities' property must be an array of strings or objects.");
        }
    }

    const toStringArray = (entity: string | SearchEntity) => {
        if (typeof entity === "string") return entity;
        return entity.name;
    };

    const toSearchEntity = (entity: string | SearchEntity) => {
        if (typeof entity === "string") return { name: entity };
        return entity;
    };

    const toReturn = entities.map((entity: string | SearchEntity) => (version === "1.0" ? toStringArray(entity) : toSearchEntity(entity)));

    if (version !== "1.0") return JSON.stringify(toReturn);
    return toReturn as string[];
}

export function convertQuery(query: Query, version: string = "1.0"): void {
    const toV1 = (query: Query) => {
        if (query.count != null) {
            if (query.returnTotalRecordCount == null) {
                query.returnTotalRecordCount = query.count;
            }
            delete query.count;
        }

        if (query.options) {
            if (typeof query.options === "string") {
                try {
                    query.options = JSON.parse(query.options, searchOptionsReviver) as SearchOptions;
                } catch {
                    throw new Error("The 'query.options' property must be a valid JSON string.");
                }
            }

            if (!query.searchMode) {
                query.searchMode = query.options.searchMode;
            }

            if (!query.searchType) {
                query.searchType = query.options.queryType === "lucene" ? "full" : query.options.queryType;
            }

            delete query.options;
        }

        // in v1.0, orderBy and facets are arrays of strings
        for (const prop of specialProperties) {
            if (query[prop] && typeof query[prop] === "string") {
                try {
                    query[prop] = JSON.parse(query[prop]);
                } catch {
                    throw new Error(`The 'query.${prop}' property must be a valid JSON string.`);
                }
            }
        }
    };

    const toV2 = (query: Query) => {
        if (query.returnTotalRecordCount != null) {
            if (query.count == null) {
                query.count = query.returnTotalRecordCount;
            }
            delete query.returnTotalRecordCount;
        }

        if (query.searchMode || query.searchType) {
            //only set the options property if it's not a string
            if (typeof query.options !== "string") {
                if (!query.options) query.options = {};

                if (!query.options.searchMode) {
                    query.options.searchMode = query.searchMode;
                }

                if (!query.options.queryType) {
                    query.options.queryType = query.searchType === "full" ? "lucene" : query.searchType;
                }
            }

            delete query.searchMode;
            delete query.searchType;
        }

        if (query.orderBy && typeof query.orderBy !== "string") {
            //@ts-ignore - orderby for some reason must be lowercase in v2.
            query.orderby = JSON.stringify(query.orderBy);
            delete query.orderBy;
        }

        if (query.facets && typeof query.facets !== "string") {
            query.facets = JSON.stringify(query.facets);
        }

        //convert options to string if it's an object
        if (query.options && typeof query.options !== "string") {
            query.options = JSON.stringify(convertOptionKeysToLowerCase(query.options));
        }
    };

    version === "1.0" ? toV1(query) : toV2(query);
}

export function convertSuggestOrAutocompleteQuery(query: Suggest | Autocomplete, version: string = "1.0"): void {
    const toV1 = (query: Suggest) => {
        if (query.fuzzy != null) {
            if (query.useFuzzy == null) {
                query.useFuzzy = query.fuzzy;
            }
            delete query.fuzzy;
        }

        delete query.options;

        if (query.orderBy && typeof query.orderBy === "string") {
            try {
                query.orderBy = JSON.parse(query.orderBy);
            } catch {
                throw new Error(`The 'query.orderBy' property must be a valid JSON string.`);
            }
        }
    };

    const toV2 = (query: Suggest) => {
        if (query.useFuzzy != null) {
            if (query.fuzzy == null) {
                query.fuzzy = query.useFuzzy;
            }
            delete query.useFuzzy;
        }

        if (query.orderBy && typeof query.orderBy !== "string") {
            //@ts-ignore - orderby for some reason must be lowercase in v2.
            query.orderby = JSON.stringify(query.orderBy);
            delete query.orderBy;
        }

        //convert options to string if it's an object
        if (query.options && typeof query.options !== "string") {
            query.options = JSON.stringify(convertOptionKeysToLowerCase(query.options));
        }
    };

    version === "1.0" ? toV1(query) : toV2(query);
}

function convertOptionKeysToLowerCase(options: SearchOptions): SearchOptions {
    const newOptions: SearchOptions = {};

    for (const key in options) {
        newOptions[key.toLowerCase()] = options[key];
    }

    return newOptions;
}

//we need a reviver to change the keys of the search options to camel case
function searchOptionsReviver(this: SearchOptions, key: string, value: any): any {
    switch (key) {
        case "searchmode":
            this.searchMode = value;
            break;
        case "querytype":
            this.queryType = value;
            break;
        default:
            return value;
    }
}

const specialProperties = ["orderBy", "facets"];
