import type { Config } from "../../../dynamics-web-api.js";
import type { InternalRequest } from "../../../types.js";
import { ErrorHelper } from "../../../helpers/ErrorHelper.js";
import { extractPreferCallbackUrl, removeDoubleQuotes } from "../../../helpers/Regex.js";

type PreferOptions = {
    returnRepresentation?: boolean | null;
    includeAnnotations?: string | null;
    maxPageSize?: number | null;
    trackChanges?: boolean;
    continueOnError?: boolean;
    backgroundOperationCallbackUrl?: string | null;
    respondAsync?: boolean;
};

export const composePreferHeader = (request: InternalRequest, config: Config): string => {
    const functionName = `DynamicsWebApi.${request.functionName}`;

    // Extract request options with defaults from config
    const options: PreferOptions = {
        respondAsync: request.respondAsync,
        backgroundOperationCallbackUrl: request.backgroundOperationCallbackUrl ?? config?.backgroundOperationCallbackUrl,
        returnRepresentation: request.returnRepresentation ?? config?.returnRepresentation,
        includeAnnotations: request.includeAnnotations ?? config?.includeAnnotations,
        maxPageSize: request.maxPageSize ?? config?.maxPageSize,
        trackChanges: request.trackChanges,
        continueOnError: request.continueOnError,
    };

    const prefer: Set<string> = new Set();

    // Process prefer header from request. Request items have a higher priority than config
    if (request.prefer?.length) {
        ErrorHelper.stringOrArrayParameterCheck(request.prefer, functionName, "request.prefer");
        const preferArray = typeof request.prefer === "string" ? request.prefer.split(",") : request.prefer;

        for (const item of preferArray) {
            const trimmedItem = item.trim();

            if (trimmedItem.includes("respond-async")) {
                options.respondAsync = true;
            } else if (trimmedItem.startsWith("odata.callback")) {
                options.backgroundOperationCallbackUrl = extractPreferCallbackUrl(trimmedItem);
            } else if (trimmedItem === "return=representation") {
                options.returnRepresentation = true;
            } else if (trimmedItem.includes("odata.include-annotations=")) {
                options.includeAnnotations = removeDoubleQuotes(trimmedItem.replace("odata.include-annotations=", ""));
            } else if (trimmedItem.startsWith("odata.maxpagesize=")) {
                options.maxPageSize = Number(removeDoubleQuotes(trimmedItem.replace("odata.maxpagesize=", ""))) || 0;
            } else if (trimmedItem.includes("odata.track-changes")) {
                options.trackChanges = true;
            } else if (trimmedItem.includes("odata.continue-on-error")) {
                options.continueOnError = true;
            } else {
                prefer.add(trimmedItem);
            }
        }
    }

    // Process prefer options
    for (const key in options) {
        const optionFactory = preferOptionsFactory[key];
        if (optionFactory && options[key]) {
            optionFactory.validator?.(options[key], functionName, `request.${key}`);
            if (optionFactory.condition(options[key], options)) {
                prefer.add(optionFactory.formatter(options[key], options));
            }
        }
    }

    return Array.from(prefer).join(",");
};

type PreferValidationHandler = (value: any, functionName: string, paramName: string) => void;
interface PreferFactoryOption {
    validator?: PreferValidationHandler;
    condition: (value: any, options: Record<string, any>) => boolean;
    formatter: (value: any, options: Record<string, any>) => string;
}

const preferOptionsFactory: Record<string, PreferFactoryOption> = {
    respondAsync: {
        validator: ErrorHelper.boolParameterCheck,
        condition: (value) => !!value,
        formatter: () => "respond-async",
    },
    backgroundOperationCallbackUrl: {
        validator: ErrorHelper.stringParameterCheck,
        condition: (value, options) => value && options.respondAsync,
        formatter: (url) => `odata.callback;url="${url}"`,
    },
    returnRepresentation: {
        validator: ErrorHelper.boolParameterCheck,
        condition: (value) => !!value,
        formatter: () => "return=representation",
    },
    includeAnnotations: {
        validator: ErrorHelper.stringParameterCheck,
        condition: (value) => !!value,
        formatter: (annotations) => `odata.include-annotations="${annotations}"`,
    },
    maxPageSize: {
        validator: (value, functionName) => (value > 0 ? ErrorHelper.numberParameterCheck(value, functionName, "request.maxPageSize") : undefined),
        condition: (value) => value > 0,
        formatter: (size) => `odata.maxpagesize=${size}`,
    },
    trackChanges: {
        validator: ErrorHelper.boolParameterCheck,
        condition: (value) => !!value,
        formatter: () => "odata.track-changes",
    },
    continueOnError: {
        validator: ErrorHelper.boolParameterCheck,
        condition: (value) => !!value,
        formatter: () => "odata.continue-on-error",
    },
};
