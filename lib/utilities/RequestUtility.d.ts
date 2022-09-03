import { DynamicsWebApi } from "../dynamics-web-api";
import { Core } from "../types";
/**
 * @typedef {Object} ConvertedRequestOptions
 * @property {string} url URL (without query)
 * @property {string} query Query String
 * @property {Object} headers Heades object (always an Object; can be empty: {})
 */
/**
 * @typedef {Object} ConvertedRequest
 * @property {string} url URL (including Query String)
 * @property {Object} headers Heades object (always an Object; can be empty: {})
 * @property {boolean} async
 */
export declare class RequestUtility {
    /**
     * Converts a request object to URL link
     *
     * @param {Object} request - Request object
     * @param {Object} [config] - DynamicsWebApi config
     * @returns {ConvertedRequest} Converted request
     */
    static compose(request: Core.InternalRequest, config: DynamicsWebApi.Config): Core.InternalRequest;
    /**
     * Converts optional parameters of the request to URL. If expand parameter exists this function is called recursively.
     *
     * @param {Object} request - Request object
     * @param {string} request.functionName - Name of the function that converts a request (for Error Handling)
     * @param {string} url - URL beginning (with required parameters)
     * @param {string} [joinSymbol] - URL beginning (with required parameters)
     * @param {Object} [config] - DynamicsWebApi config
     * @returns {ConvertedRequestOptions} Additional options in request
     */
    static composeUrl(request: Core.InternalRequest, config: DynamicsWebApi.Config, url?: string, joinSymbol?: string): string;
    static composeHeaders(request: Core.InternalRequest, config: DynamicsWebApi.Config): any;
    static composePreferHeader(request: Core.InternalRequest, config: DynamicsWebApi.Config): string;
    static convertToBatch(requests: Core.InternalRequest[], config: DynamicsWebApi.Config): Core.InternalBatchRequest;
    static entityNames: any;
    static findCollectionName(entityName: string): string;
    static processData(data: any, config: DynamicsWebApi.Config): any;
    static setStandardHeaders(headers?: any): any;
}
//# sourceMappingURL=RequestUtility.d.ts.map