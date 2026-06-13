import { dateReviver } from "../../../client/helpers/index.js";
import type { SuggestResponse, SuggestResponseValue } from "../../../dynamics-web-api.js";
import type { InternalApiConfig } from "../../../utils/Config.js";

export interface SuggestResponseInternal extends Omit<SuggestResponse, "response"> {
    response: string;
}

export function parseSuggestResponse(queryResponse: SuggestResponseInternal, config: InternalApiConfig): SuggestResponse {
    if (!queryResponse) return queryResponse;

    const toV1 = (): SuggestResponse => {
        const responseValue = JSON.parse(queryResponse.response, dateReviver) as SuggestResponse["response"];

        if (config.enableSearchApiResponseCompatibility) {
            responseValue.Value?.forEach((item: SuggestResponseValue) => {
                item.document = item.Document;
                item.text = item.Text;
            });
        }

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

    const toV2 = (): SuggestResponse => {
        if (config.enableSearchApiResponseCompatibility) {
            queryResponse.value?.forEach((item: SuggestResponseValue) => {
                item.Document = item.document;
                item.Text = item.text;
            });
        }

        // @ts-ignore we don't enforce to have all properties in the response if the compatibility is disabled
        const toReturn: SuggestResponse = {
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
