import { ApiConfig, Config } from "../dynamics-web-api";
type ApiType = "dataApi" | "searchApi";
export interface InternalApiConfig extends ApiConfig {
    url: string;
}
export interface InternalConfig extends Config {
    dataApi: InternalApiConfig;
    searchApi: InternalApiConfig;
}
export declare class ConfigurationUtility {
    static mergeApiConfigs: (apiConfig: ApiConfig | undefined, apiType: ApiType, internalConfig: InternalConfig) => void;
    static merge(internalConfig: InternalConfig, config?: Config): void;
    static default(): InternalConfig;
}
export {};
//# sourceMappingURL=Config.d.ts.map