import { DynamicsWebApi } from "./dynamics-web-api";
export declare namespace Core {
    interface RequestOptions {
        method: string;
        uri: string;
        data: string;
        additionalHeaders: any;
        responseParams: {
            [key: string]: any[];
        };
        successCallback: Function;
        errorCallback: Function;
        timeout: number;
        isAsync?: boolean;
        requestId?: string;
    }
    interface BatchRequestCollection {
        [key: string]: InternalRequest[];
    }
    interface ConvertedRequest {
        path?: string;
        headers?: any;
        async?: boolean;
        method?: string;
        data?: any;
        responseParams?: any;
        isAsync?: boolean;
    }
    interface InternalBatchRequest {
        body?: any;
        headers?: any;
    }
    interface InternalRequest {
        /**XHR requests only! Indicates whether the requests should be made synchronously or asynchronously.Default value is 'true'(asynchronously). */
        async?: boolean;
        /**Sets the $apply system query option to aggregate and group your data dynamically. */
        apply?: string;
        /**The name of the Entity Collection or Entity Logical name. */
        collection?: string;
        /**Impersonates a user based on their systemuserid by adding "MSCRMCallerID" header. A String representing the GUID value for the Dynamics 365 systemuserid. */
        impersonate?: string;
        /**Impersonates a user based on their Azure Active Directory (AAD) object id by passing that value along with the header "CallerObjectId". A String should represent a GUID value. */
        impersonateAAD?: string;
        /** If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'. */
        noCache?: boolean;
        /** Authorization Token. If set, onTokenRefresh will not be called. */
        token?: string;
        /** DEPRECATED Use "key" instead. A String representing the Primary Key(GUID) of the record. */
        id?: string;
        /**A String representing collection record's Primary Key (GUID) or Alternate Key(s). */
        key?: string;
        /**v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection. */
        duplicateDetection?: boolean;
        /**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
        navigationProperty?: string;
        /**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
        navigationPropertyKey?: string;
        /**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
        entity?: any;
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: DynamicsWebApi.Expand[];
        /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
        ifmatch?: string;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
        includeAnnotations?: string;
        /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request. */
        returnRepresentation?: boolean;
        /**Prefer header values */
        prefer?: string | string[];
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
        contentId?: string;
        /**v.1.4.3 + Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata). */
        metadataAttributeType?: string;
        /**If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false' */
        mergeLabels?: boolean;
        /**Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. */
        ifnonematch?: string;
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter?: string;
        /**A String representing the GUID value of the saved query. */
        savedQuery?: string;
        /**A String representing the GUID value of the user query. */
        userQuery?: string;
        /**Boolean that sets the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000(per page).Do not use $top with $count! */
        count?: boolean;
        /**Sets the odata.maxpagesize preference value to request the number of entities returned in the response. */
        maxPageSize?: number;
        /**An Array(of string) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied. */
        orderBy?: string[];
        /**Limit the number of results returned by using the $top system query option.Do not use $top with $count! */
        top?: number;
        /**Sets Prefer header with value 'odata.track-changes' to request that a delta link be returned which can subsequently be used to retrieve entity changes. */
        trackChanges?: boolean;
        /**v.1.7.0+ Web API v9.1+ only! Use this option to specify the name of the file attribute in Dynamics 365. */
        fieldName?: string;
        /**v.1.7.0+ Web API v9.1+ only! Specifies the name of the file */
        fileName?: string;
        contentRange?: string;
        url?: string;
        _isUnboundRequest?: boolean;
        _additionalUrl?: string;
        fetchXml?: string;
        isBatch?: boolean;
        data?: any;
        timeout?: number;
        method?: string;
        functionName?: string;
        responseParameters?: any;
        path?: string;
        headers?: any;
        pageNumber?: number;
        pagingCookie?: string;
        requestId?: string;
        transferMode?: string;
        range?: string;
        downloadSize?: string;
    }
    interface FileParseResult {
        value: any;
        fileName?: string;
        fileSize?: number;
        location?: string;
    }
    interface FetchXmlCookie {
        cookie: string;
        page: number;
        nextPage: number;
    }
    interface ReferenceObject {
        id: string;
        collection: string;
        oDataContext: string;
    }
    interface WebApiRequest {
        requestUrl: string;
        headers: any;
        async?: boolean;
    }
}
//# sourceMappingURL=types.d.ts.map