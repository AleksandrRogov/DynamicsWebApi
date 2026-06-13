import { Config } from "../dynamics-web-api.js";
import type { InternalRequest, WebApiResponse } from "../types.js";
import { defaultConfig, mergeConfig, type InternalConfig } from "../utils/Config.js";
import { makeRequest } from "./RequestClient.js";

// module is in development; multiple changes might be made here

export interface IDataverseClient {
    get config(): InternalConfig;
    get isBatch(): boolean;
    set isBatch(value: boolean);
    get batchRequestId(): string | null;
    set batchRequestId(value: string | null);

    setConfig(config: Config): void;
    makeRequest(request: InternalRequest): Promise<WebApiResponse | undefined>;
}

export class DataverseClient implements IDataverseClient {
    #config = defaultConfig();
    #isBatch = false;
    #batchRequestId: string | null = null;

    constructor(config?: Config) {
        mergeConfig(this.#config, config);
    }
    get batchRequestId(): string | null {
        return this.#batchRequestId;
    }
    set batchRequestId(value: string | null) {
        this.#batchRequestId = value;
    }

    get config(): InternalConfig {
        return this.#config;
    }

    get isBatch(): boolean {
        return this.#isBatch;
    }

    set isBatch(value: boolean) {
        this.#isBatch = value;
    }

    setConfig = (config: Config) => mergeConfig(this.#config, config);

    makeRequest = (request: InternalRequest): Promise<WebApiResponse | undefined> => {
        request.isBatch = this.#isBatch;
        if (this.#batchRequestId) request.requestId = this.#batchRequestId;
        return makeRequest(request, this.#config);
    };
}
