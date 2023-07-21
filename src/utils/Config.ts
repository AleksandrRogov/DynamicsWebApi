import { Utility } from "./Utility";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { ApiConfig, Config } from "../dynamics-web-api";

type ApiType = "dataApi" | "searchApi";

export interface InternalApiConfig extends ApiConfig {
    url: string;
}

export interface InternalConfig extends Config {
    dataApi: InternalApiConfig;
    searchApi: InternalApiConfig;
}

const getApiUrl = (serverUrl: string | undefined | null, apiConfig: ApiConfig, portalsApi: boolean | undefined | null): string => {
    if (portalsApi) {
        return `${window.location.origin}/_api/`;
    } else {
        if (!serverUrl) serverUrl = Utility.getClientUrl();
        return `${serverUrl}/api/${apiConfig.path}/v${apiConfig.version}/`;
    }
};

const mergeApiConfigs = (apiConfig: ApiConfig | undefined, apiType: ApiType, internalConfig: InternalConfig): void => {
    const internalApiConfig = internalConfig[apiType] as InternalApiConfig;

    if (apiConfig?.version) {
        ErrorHelper.stringParameterCheck(apiConfig.version, "DynamicsWebApi.setConfig", `config.${apiType}.version`);
        internalApiConfig.version = apiConfig.version;
    }

    if (apiConfig?.path) {
        ErrorHelper.stringParameterCheck(apiConfig.path, "DynamicsWebApi.setConfig", `config.${apiType}.path`);
        internalApiConfig.path = apiConfig.path;
    }

    internalApiConfig.url = getApiUrl(internalConfig.serverUrl, internalApiConfig, internalConfig.portalsApi);
};

export class ConfigurationUtility {
    static mergeApiConfigs = mergeApiConfigs;

    static merge(internalConfig: InternalConfig, config?: Config): void {
        if (config?.serverUrl) {
            ErrorHelper.stringParameterCheck(config.serverUrl, "DynamicsWebApi.setConfig", "config.serverUrl");
            internalConfig.serverUrl = config.serverUrl;
        }

        mergeApiConfigs(config?.dataApi, "dataApi", internalConfig);
        mergeApiConfigs(config?.searchApi, "searchApi", internalConfig);

        if (config?.impersonate) {
            internalConfig.impersonate = ErrorHelper.guidParameterCheck(config.impersonate, "DynamicsWebApi.setConfig", "config.impersonate");
        }

        if (config?.impersonateAAD) {
            internalConfig.impersonateAAD = ErrorHelper.guidParameterCheck(config.impersonateAAD, "DynamicsWebApi.setConfig", "config.impersonateAAD");
        }

        if (config?.onTokenRefresh) {
            ErrorHelper.callbackParameterCheck(config.onTokenRefresh, "DynamicsWebApi.setConfig", "config.onTokenRefresh");
            internalConfig.onTokenRefresh = config.onTokenRefresh;
        }

        if (config?.includeAnnotations) {
            ErrorHelper.stringParameterCheck(config.includeAnnotations, "DynamicsWebApi.setConfig", "config.includeAnnotations");
            internalConfig.includeAnnotations = config.includeAnnotations;
        }

        if (config?.timeout) {
            ErrorHelper.numberParameterCheck(config.timeout, "DynamicsWebApi.setConfig", "config.timeout");
            internalConfig.timeout = config.timeout;
        }

        if (config?.maxPageSize) {
            ErrorHelper.numberParameterCheck(config.maxPageSize, "DynamicsWebApi.setConfig", "config.maxPageSize");
            internalConfig.maxPageSize = config.maxPageSize;
        }

        if (config?.returnRepresentation) {
            ErrorHelper.boolParameterCheck(config.returnRepresentation, "DynamicsWebApi.setConfig", "config.returnRepresentation");
            internalConfig.returnRepresentation = config.returnRepresentation;
        }

        if (config?.useEntityNames) {
            ErrorHelper.boolParameterCheck(config.useEntityNames, "DynamicsWebApi.setConfig", "config.useEntityNames");
            internalConfig.useEntityNames = config.useEntityNames;
        }

        /// #if node
        if (config?.proxy) {
            ErrorHelper.parameterCheck(config.proxy, "DynamicsWebApi.setConfig", "config.proxy");

            if (config.proxy.url) {
                ErrorHelper.stringParameterCheck(config.proxy.url, "DynamicsWebApi.setConfig", "config.proxy.url");

                if (config.proxy.auth) {
                    ErrorHelper.parameterCheck(config.proxy.auth, "DynamicsWebApi.setConfig", "config.proxy.auth");
                    ErrorHelper.stringParameterCheck(config.proxy.auth.username, "DynamicsWebApi.setConfig", "config.proxy.auth.username");
                    ErrorHelper.stringParameterCheck(config.proxy.auth.password, "DynamicsWebApi.setConfig", "config.proxy.auth.password");
                }
            }

            internalConfig.proxy = config.proxy;
        }
        /// #endif
    }

    static default(): InternalConfig {
        return {
            serverUrl: null,
            impersonate: null,
            impersonateAAD: null,
            onTokenRefresh: null,
            includeAnnotations: null,
            maxPageSize: null,
            returnRepresentation: null,
            proxy: null,
            dataApi: {
                path: "data",
                version: "9.2",
                url: "",
            },
            searchApi: {
                path: "search",
                version: "1.0",
                url: "",
            },
            portalsApi: null,
        };
    }
}
