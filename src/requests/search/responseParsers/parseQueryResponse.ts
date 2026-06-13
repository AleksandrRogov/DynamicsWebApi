import { dateReviver } from "../../../client/helpers/index.js";
import type { QueryResponse } from "../../../dynamics-web-api.js";
import type { InternalApiConfig } from "../../../utils/Config.js";

export interface QueryResponseInternal extends Omit<QueryResponse, "response"> {
    response: string;
}

export function parseQueryResponse(queryResponse: QueryResponseInternal, config: InternalApiConfig): QueryResponse {
    if (!queryResponse) return queryResponse;

    const toV1 = (): QueryResponse => {
        const responseValue = JSON.parse(queryResponse.response, dateReviver) as QueryResponse["response"];

        const toReturn = {
            ...queryResponse,
            response: responseValue,
        };

        if (config.enableSearchApiResponseCompatibility) {
            toReturn.value = responseValue.Value;
            toReturn.facets = responseValue.Facets;
            toReturn.totalrecordcount = responseValue.Count;
            toReturn.querycontext = responseValue.QueryContext;
        }

        return toReturn;
    };

    const toV2 = (): QueryResponse => {
        // @ts-ignore we don't enforce to have all properties in the response if the compatibility is disabled
        const toReturn: QueryResponse = {
            ...queryResponse,
        };

        if (config.enableSearchApiResponseCompatibility) {
            toReturn.response = {
                Count: queryResponse.totalrecordcount,
                Value: queryResponse.value,
                Facets: queryResponse.facets,
                QueryContext: queryResponse.querycontext,
                Error: null,
            };
        }

        return toReturn;
    };

    return config?.version === "2.0" ? toV1() : toV2();
}
