import { dateReviver } from "../../../client/helpers/index.js";
import type { AutocompleteResponse } from "../../../dynamics-web-api.js";
import type { InternalApiConfig } from "../../../utils/Config.js";

export interface AutocompleteResponseInternal extends Omit<AutocompleteResponse, "response"> {
    response: string;
}

export function parseAutocompleteResponse(queryResponse: AutocompleteResponseInternal, config: InternalApiConfig): AutocompleteResponse {
    if (!queryResponse) return queryResponse;

    const toV1 = (): AutocompleteResponse => {
        const responseValue = JSON.parse(queryResponse.response, dateReviver) as AutocompleteResponse["response"];

        const toReturn = {
            ...queryResponse,
            response: responseValue,
        };

        if (config.enableSearchApiResponseCompatibility) {
            toReturn.value = responseValue.Value;
            toReturn.querycontext = responseValue.QueryContext;
        }

        return toReturn;
    };

    const toV2 = (): AutocompleteResponse => {
        // @ts-ignore we don't enforce to have all properties in the response if the compatibility is disabled
        const toReturn: AutocompleteResponse = {
            ...queryResponse,
        };

        if (config.enableSearchApiResponseCompatibility) {
            toReturn.response = {
                Value: queryResponse.value,
                QueryContext: queryResponse.querycontext,
                Error: null,
            };
        }

        return toReturn;
    };

    return config?.version === "2.0" ? toV1() : toV2();
}
