"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationUtility = void 0;
const Utility_1 = require("./Utility");
const ErrorHelper_1 = require("../helpers/ErrorHelper");
const getApiUrl = (serverUrl, apiConfig) => {
    if (!serverUrl)
        serverUrl = Utility_1.Utility.getClientUrl();
    return `${serverUrl}/api/${apiConfig.path}/v${apiConfig.version}/`;
};
const mergeApiConfigs = (apiConfig, apiType, internalConfig) => {
    const internalApiConfig = internalConfig[apiType];
    if (apiConfig === null || apiConfig === void 0 ? void 0 : apiConfig.version) {
        ErrorHelper_1.ErrorHelper.stringParameterCheck(apiConfig.version, "DynamicsWebApi.setConfig", `config.${apiType}.version`);
        internalApiConfig.version = apiConfig.version;
    }
    if (apiConfig === null || apiConfig === void 0 ? void 0 : apiConfig.path) {
        ErrorHelper_1.ErrorHelper.stringParameterCheck(apiConfig.path, "DynamicsWebApi.setConfig", `config.${apiType}.path`);
        internalApiConfig.path = apiConfig.path;
    }
    internalApiConfig.url = getApiUrl(internalConfig.serverUrl, internalApiConfig);
};
class ConfigurationUtility {
    static merge(internalConfig, config) {
        if (config === null || config === void 0 ? void 0 : config.serverUrl) {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(config.serverUrl, "DynamicsWebApi.setConfig", "config.serverUrl");
            internalConfig.serverUrl = config.serverUrl;
        }
        mergeApiConfigs(config === null || config === void 0 ? void 0 : config.dataApi, "dataApi", internalConfig);
        mergeApiConfigs(config === null || config === void 0 ? void 0 : config.searchApi, "searchApi", internalConfig);
        if (config === null || config === void 0 ? void 0 : config.impersonate) {
            internalConfig.impersonate = ErrorHelper_1.ErrorHelper.guidParameterCheck(config.impersonate, "DynamicsWebApi.setConfig", "config.impersonate");
        }
        if (config === null || config === void 0 ? void 0 : config.impersonateAAD) {
            internalConfig.impersonateAAD = ErrorHelper_1.ErrorHelper.guidParameterCheck(config.impersonateAAD, "DynamicsWebApi.setConfig", "config.impersonateAAD");
        }
        if (config === null || config === void 0 ? void 0 : config.onTokenRefresh) {
            ErrorHelper_1.ErrorHelper.callbackParameterCheck(config.onTokenRefresh, "DynamicsWebApi.setConfig", "config.onTokenRefresh");
            internalConfig.onTokenRefresh = config.onTokenRefresh;
        }
        if (config === null || config === void 0 ? void 0 : config.includeAnnotations) {
            ErrorHelper_1.ErrorHelper.stringParameterCheck(config.includeAnnotations, "DynamicsWebApi.setConfig", "config.includeAnnotations");
            internalConfig.includeAnnotations = config.includeAnnotations;
        }
        if (config === null || config === void 0 ? void 0 : config.timeout) {
            ErrorHelper_1.ErrorHelper.numberParameterCheck(config.timeout, "DynamicsWebApi.setConfig", "config.timeout");
            internalConfig.timeout = config.timeout;
        }
        if (config === null || config === void 0 ? void 0 : config.maxPageSize) {
            ErrorHelper_1.ErrorHelper.numberParameterCheck(config.maxPageSize, "DynamicsWebApi.setConfig", "config.maxPageSize");
            internalConfig.maxPageSize = config.maxPageSize;
        }
        if (config === null || config === void 0 ? void 0 : config.returnRepresentation) {
            ErrorHelper_1.ErrorHelper.boolParameterCheck(config.returnRepresentation, "DynamicsWebApi.setConfig", "config.returnRepresentation");
            internalConfig.returnRepresentation = config.returnRepresentation;
        }
        if (config === null || config === void 0 ? void 0 : config.useEntityNames) {
            ErrorHelper_1.ErrorHelper.boolParameterCheck(config.useEntityNames, "DynamicsWebApi.setConfig", "config.useEntityNames");
            internalConfig.useEntityNames = config.useEntityNames;
        }
        /// #if node
        if (config === null || config === void 0 ? void 0 : config.proxy) {
            ErrorHelper_1.ErrorHelper.parameterCheck(config.proxy, "DynamicsWebApi.setConfig", "config.proxy");
            if (config.proxy.url) {
                ErrorHelper_1.ErrorHelper.stringParameterCheck(config.proxy.url, "DynamicsWebApi.setConfig", "config.proxy.url");
                if (config.proxy.auth) {
                    ErrorHelper_1.ErrorHelper.parameterCheck(config.proxy.auth, "DynamicsWebApi.setConfig", "config.proxy.auth");
                    ErrorHelper_1.ErrorHelper.stringParameterCheck(config.proxy.auth.username, "DynamicsWebApi.setConfig", "config.proxy.auth.username");
                    ErrorHelper_1.ErrorHelper.stringParameterCheck(config.proxy.auth.password, "DynamicsWebApi.setConfig", "config.proxy.auth.password");
                }
            }
            internalConfig.proxy = config.proxy;
        }
        /// #endif
    }
    static default() {
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
        };
    }
}
ConfigurationUtility.mergeApiConfigs = mergeApiConfigs;
exports.ConfigurationUtility = ConfigurationUtility;
//# sourceMappingURL=Config.js.map