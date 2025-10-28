import { escapeUnicodeSymbols, removeCurlyBracketsFromUuid, removeLeadingSlash, SEARCH_FOR_ENTITY_NAME_REGEX } from "../../helpers/Regex";
import type { InternalConfig } from "../../utils/Config";
import { isNull } from "../../utils/Utility";
import { findCollectionName } from "../helpers";

export const processData = (data: any, config: InternalConfig): string | Uint8Array | Uint16Array | Uint32Array | null => {
    if (!data) return null;

    if (data instanceof Uint8Array || data instanceof Uint16Array || data instanceof Uint32Array) return data;

    const replaceEntityNameWithCollectionName = (value: string): string => {
        const valueParts = SEARCH_FOR_ENTITY_NAME_REGEX.exec(value);
        if (valueParts && valueParts.length > 2) {
            const collectionName = findCollectionName(valueParts[1]);
            if (!isNull(collectionName)) {
                return value.replace(SEARCH_FOR_ENTITY_NAME_REGEX, `${collectionName}$2`);
            }
        }
        return value;
    };

    const addFullWebApiUrl = (key: string, value: string): string => {
        if (!value.startsWith(config.dataApi.url)) {
            if (key.endsWith("@odata.bind")) {
                if (!value.startsWith("/")) {
                    value = `/${value}`;
                }
            } else {
                value = `${config.dataApi.url}${removeLeadingSlash(value)}`;
            }
        }
        return value;
    };

    const stringifiedData = JSON.stringify(data, (key, value) => {
        if (key === "@odata.id" || key.endsWith("@odata.bind")) {
            if (typeof value === "string" && !value.startsWith("$")) {
                value = removeCurlyBracketsFromUuid(value);
                if (config.useEntityNames) {
                    value = replaceEntityNameWithCollectionName(value);
                }

                // the full Web API URL is only added in requests to /$ref
                // the value itself is set directly in the requests that require it
                if (key !== "@odata.id") {
                    value = addFullWebApiUrl(key, value);
                }
            }
        } else if (key.startsWith("oData") || key.endsWith("_Formatted") || key.endsWith("_NavigationProperty") || key.endsWith("_LogicalName")) {
            return undefined;
        }
        return value;
    });

    return escapeUnicodeSymbols(stringifiedData);
};
