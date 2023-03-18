import { DynamicsWebApi } from "../dynamics-web-api";
type ApiType = "dataApi" | "searchApi";
export interface InternalApiConfig extends DynamicsWebApi.ApiConfig {
    url: string;
}
export interface InternalConfig extends DynamicsWebApi.Config {
    dataApi: InternalApiConfig;
    searchApi: InternalApiConfig;
}
export declare class ConfigurationUtility {
    static mergeApiConfigs: (apiConfig: DynamicsWebApi.ApiConfig | undefined, apiType: ApiType, internalConfig: InternalConfig) => void;
    static merge(internalConfig: InternalConfig, config?: DynamicsWebApi.Config): void;
    static default(): InternalConfig;
}
export {};
//# sourceMappingURL=Config.d.ts.map