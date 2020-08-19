declare interface DynamicsWebApiError extends Error {
    status: number;
}
export declare class ErrorHelper {
    static handleErrorResponse(req: any): void;
    static parameterCheck(parameter: any, functionName: string, parameterName: string, type?: string): void;
    static stringParameterCheck(parameter: any, functionName: string, parameterName: string): void;
    static arrayParameterCheck(parameter: any, functionName: string, parameterName: string): void;
    static stringOrArrayParameterCheck(parameter: any, functionName: string, parameterName: string): void;
    static numberParameterCheck(parameter: any, functionName: string, parameterName: string): void;
    static handleHttpError(parsedError: any, parameters?: any): DynamicsWebApiError;
    static boolParameterCheck(parameter: any, functionName: string, parameterName: string): void;
    static guidParameterCheck(parameter: any, functionName: string, parameterName: string): string;
    static keyParameterCheck(parameter: any, functionName: string, parameterName: string): string;
    static callbackParameterCheck(callbackParameter: any, functionName: string, parameterName: string): void;
    static batchIncompatible(functionName: string, isBatch: boolean): void;
    static batchNotStarted(isBatch: boolean): void;
}
export {};
