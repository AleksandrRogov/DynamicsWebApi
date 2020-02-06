export interface RequestOptions {
    method: string,
    uri: string,
    data: string,
    additionalHeaders: any,
    responseParams: any[],
    successCallback: Function,
    errorCallback: Function,
    timeout: number,
    isAsync?: boolean
}