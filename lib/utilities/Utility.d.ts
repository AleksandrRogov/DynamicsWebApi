/// <reference types="node" />
import { Core } from "../types";
declare function isNodeEnv(): boolean;
export declare class Utility {
    /**
     * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
     *
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @returns {string}
     */
    static buildFunctionParameters(parameters?: any): string;
    /**
     * Parses a paging cookie returned in response
     *
     * @param {string} pageCookies - Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.
     * @param {number} currentPageNumber - A current page number. Fix empty paging-cookie for complex fetch xmls.
     * @returns {{cookie: "", number: 0, next: 1}}
     */
    static getFetchXmlPagingCookie(pageCookies?: string, currentPageNumber?: number): Core.FetchXmlCookie;
    static isNodeEnv: typeof isNodeEnv;
    static downloadChunkSize: number;
    /**
     * Converts a response to a reference object
     *
     * @param {Object} responseData - Response object
     * @returns {ReferenceObject}
     */
    static convertToReferenceObject(responseData: any): Core.ReferenceObject;
    /**
     * Checks whether the value is JS Null.
     * @param {Object} value
     * @returns {boolean}
     */
    static isNull(value: any): boolean;
    /** Generates UUID */
    static generateUUID(): string;
    static getXrmContext(): any;
    static getXrmUtility(): any;
    static getClientUrl(): string;
    static initWebApiUrl(version: string): string;
    static isObject(obj: any): boolean;
    static copyObject<T = any>(src: any): T;
    static setFileChunk(request: Core.InternalRequest, fileBuffer: Uint8Array | Buffer, chunkSize: number, offset: number): void;
    static convertToFileBuffer(binaryString: string): Uint8Array | Buffer;
}
export {};
//# sourceMappingURL=Utility.d.ts.map