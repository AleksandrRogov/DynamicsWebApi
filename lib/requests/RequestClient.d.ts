import { DynamicsWebApi } from "../../ts/dynamics-web-api";
import { Core } from "../../ts/types";
export declare class RequestClient {
    private static _batchRequestCollection;
    private static _responseParseParams;
    /**
     * Sends a request to given URL with given parameters
     *
     * @param {string} method - Method of the request.
     * @param {string} path - Request path.
     * @param {Object} config - DynamicsWebApi config.
     * @param {Object} [data] - Data to send in the request.
     * @param {Object} [additionalHeaders] - Object with additional headers. IMPORTANT! This object does not contain default headers needed for every request.
     * @param {any} [responseParams] - parameters for parsing the response
     * @param {Function} successCallback - A callback called on success of the request.
     * @param {Function} errorCallback - A callback called when a request failed.
     * @param {boolean} [isBatch] - Indicates whether the request is a Batch request or not. Default: false
     * @param {boolean} [isAsync] - Indicates whether the request should be made synchronously or asynchronously.
     */
    static sendRequest(request: Core.InternalRequest, config: DynamicsWebApi.Config, successCallback: Function, errorCallback: Function): void;
    private static _getCollectionNames;
    private static _isEntityNameException;
    private static _checkCollectionName;
    static makeRequest(request: Core.InternalRequest, config: DynamicsWebApi.Config, resolve: Function, reject: Function): void;
    static _clearEntityNames(): void;
    static getCollectionName(entityName: string): string;
}
//# sourceMappingURL=RequestClient.d.ts.map