/*! dynamics-web-api v2.3.1 (c) 2025 Aleksandr Rogov. License: MIT */
/**
 * Microsoft Dataverse Web API helper library for Node.js and Browser.
 * It is compatible with: Dataverse, Dynamics 365 (online), Dynamics 365 (on-premise), Dynamics CRM 2016, Dynamics CRM Online.
 */
export declare class DynamicsWebApi {
    #private;
    /**
     * Initializes a new instance of DynamicsWebApi
     * @param config - Configuration object
     */
    constructor(config?: Config);
    /**
     * Merges provided configuration properties with an existing one.
     *
     * @param {DynamicsWebApi.Config} config - Configuration
     * @example
       dynamicsWebApi.setConfig({ serverUrl: 'https://contoso.api.crm.dynamics.com/' });
     */
    setConfig: (config: Config) => void;
    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @template TData - Type of the data to be created.
     * @template TResponse - Type of the response to be returned.
     * @returns {Promise} D365 Web Api Response
     * @example
     *const lead = {
     *    subject: "Test WebAPI",
     *    firstname: "Test",
     *    lastname: "WebAPI",
     *    jobtitle: "Title"
     *};
     *
     *const request = {
     *    data: lead,
     *    collection: "leads",
     *    returnRepresentation: true
     *}
     *
     *const response = await dynamicsWebApi.create(request);
     *
     */
    create: <TData = any, TResponse = TData>(request: CreateRequest<TData>) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the response to be returned.
     * @returns {Promise} D365 Web Api Response
     * @example
     *const request = {
     *    key: '7d577253-3ef0-4a0a-bb7f-8335c2596e70',
     *    collection: "leads",
     *    select: ["fullname", "subject"],
     *    ifnonematch: 'W/"468026"',
     *    includeAnnotations: "OData.Community.Display.V1.FormattedValue"
     *};
     *
     *const response = await dynamicsWebApi.retrieve(request);
     */
    retrieve: <TResponse = any>(request: RetrieveRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @template TData - Type of the data to be created.
     * @template TResponse - Type of the response to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    update: <TData = any, TResponse = TData>(request: UpdateRequest<TData>) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the response to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    updateSingleProperty: <TResponse = any>(request: UpdateSinglePropertyRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    deleteRecord: (request: DeleteRequest) => Promise<any>;
    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @template TData - Type of the data to be created.
     * @template TResponse - Type of the response to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    upsert: <TData = any, TResponse = TData>(request: UpsertRequest<TData>) => Promise<TResponse>;
    /**
     * Upload file to a File Attribute
     *
     * @param request - An object that represents all possible options for a current request.
     */
    uploadFile: (request: UploadRequest) => Promise<void>;
    /**
     * Download a file from a File Attribute
     * @param request - An object that represents all possible options for a current request.
     */
    downloadFile: (request: DownloadRequest) => Promise<DownloadResponse>;
    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveMultiple: <TValue = any>(request: RetrieveMultipleRequest, nextPageLink?: string) => Promise<RetrieveMultipleResponse<TValue>>;
    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveAll: <TValue = any>(request: RetrieveMultipleRequest) => Promise<AllResponse<TValue>>;
    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system.
     * It is limited by the maximum number of entities that can be returned. Returns: Number
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    count: (request: CountRequest) => Promise<number>;
    /**
     * Sends an asynchronous request to count records. Returns: Number
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    countAll: (request: CountAllRequest) => Promise<number>;
    /**
     * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
     * @returns {Promise} D365 Web Api Response
     */
    fetch: <TValue = any>(request: FetchXmlRequest) => Promise<FetchXmlResponse<TValue>>;
    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
     * @returns {Promise} D365 Web Api Response
     */
    fetchAll: <TValue = any>(request: FetchAllRequest) => Promise<FetchXmlResponse<TValue>>;
    /**
     * Associate for a collection-valued navigation property. (1:N or N:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    associate: (request: AssociateRequest) => Promise<void>;
    /**
     * Disassociate for a collection-valued navigation property.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    disassociate: (request: DisassociateRequest) => Promise<void>;
    /**
     * Associate for a single-valued navigation property. (1:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    associateSingleValued: (request: AssociateSingleValuedRequest) => Promise<void>;
    /**
     * Removes a reference to an entity for a single-valued navigation property. (1:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    disassociateSingleValued: (request: DisassociateSingleValuedRequest) => Promise<void>;
    /**
     * Calls a Web API function
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the response to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    callFunction: CallFunction;
    /**
     * Calls a Web API action
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the response to be returned.
     * @template TAction - Type of the action to be executed.
     * @returns {Promise} D365 Web Api Response
     */
    callAction: CallAction;
    /**
     * Sends an asynchronous request to create an entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    createEntity: <TResponse = any>(request: CreateEntityRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to update an entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    updateEntity: <TResponse = any>(request: UpdateEntityRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to retrieve a specific entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveEntity: <TResponse = any>(request: RetrieveEntityRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to retrieve entity definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveEntities: <TValue = any>(request?: RetrieveEntitiesRequest) => Promise<RetrieveMultipleResponse<TValue>>;
    /**
     * Sends an asynchronous request to create an attribute.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    createAttribute: <TResponse = any>(request: CreateAttributeRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to update an attribute.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    updateAttribute: <TResponse = any>(request: UpdateAttributeRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to retrieve attribute metadata for a specified entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveAttributes: <TValue = any>(request: RetrieveAttributesRequest) => Promise<RetrieveMultipleResponse<TValue>>;
    /**
     * Sends an asynchronous request to retrieve a specific attribute metadata for a specified entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveAttribute: <TResponse = any>(request: RetrieveAttributeRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to create a relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    createRelationship: <TResponse = any>(request: CreateRelationshipRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to update a relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    updateRelationship: <TResponse = any>(request: UpdateRelationshipRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to delete a relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    deleteRelationship: (request: DeleteRelationshipRequest) => Promise<any>;
    /**
     * Sends an asynchronous request to retrieve relationship definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveRelationships: <TValue = any>(request?: RetrieveRelationshipsRequest) => Promise<RetrieveMultipleResponse<TValue>>;
    /**
     * Sends an asynchronous request to retrieve a specific relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveRelationship: <TResponse = any>(request: RetrieveRelationshipRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to create a Global Option Set definition
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    createGlobalOptionSet: <TResponse = any>(request: CreateGlobalOptionSetRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to update a Global Option Set.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    updateGlobalOptionSet: <TResponse = any>(request: UpdateGlobalOptionSetRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to delete a Global Option Set.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    deleteGlobalOptionSet: (request: DeleteGlobalOptionSetRequest) => Promise<any>;
    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveGlobalOptionSet: <TResponse = any>(request: RetrieveGlobalOptionSetRequest) => Promise<TResponse>;
    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveGlobalOptionSets: <TValue = any>(request?: RetrieveGlobalOptionSetsRequest) => Promise<RetrieveMultipleResponse<TValue>>;
    /**
     * Retrieves a CSDL Document Metadata
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<string>} A raw CSDL $metadata document.
     */
    retrieveCsdlMetadata: (request?: CsdlMetadataRequest) => Promise<string>;
    /**
     * @deprecated Use "query" instead.
     * Provides a search results page.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<SearchResponse<TValue>>} Search result.
     */
    search: SearchFunction;
    /**
     * The query operation returns search results based on a search term.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<QueryResponse>} Query result.
     */
    query: QueryFunction;
    /**
     * Provides suggestions as the user enters text into a form field.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<SuggestResponse<TValueDocument>>} Suggestions result.
     */
    suggest: SuggestFunction;
    /**
     * Provides autocompletion of input as the user enters text into a form field.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<AutocompleteResponse>} Result of an autocomplete.
     */
    autocomplete: AutocompleteFunction;
    /**
     * Sends a request to the status monitor resource.
     * @param backgroundOperationId - The ID of the background operation.
     * @returns {Promise<BackgroundOperationStatusResponse>} Background operation status.
     */
    getBackgroundOperationStatus: (backgroundOperationId: string) => Promise<BackgroundOperationStatusResponse>;
    /**
     * Cancels a background operation via the status monitor resource.
     * @param backgroundOperationId - The ID of the background operation.
     * @returns {Promise<BackgroundOperationStatusResponse>} Background operation status.
     */
    cancelBackgroundOperation: (backgroundOperationId: string) => Promise<BackgroundOperationStatusResponse>;
    /**
     * Starts a batch request.
     */
    startBatch: () => void;
    /**
     * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    executeBatch: (request?: BatchRequest) => Promise<any[]>;
    /**
     * Creates a new instance of DynamicsWebApi. If config is not provided, it is copied from a current instance.
     *
     * @param {Config} config configuration object.
     * @returns {DynamicsWebApi} A new instance of DynamicsWebApi
     */
    initializeInstance: (config?: Config) => DynamicsWebApi;
    Utility: {
        /**
         * Searches for a collection name by provided entity name in a cached entity metadata.
         * The returned collection name can be null.
         *
         * @param {string} entityName entity name
         * @returns {string | null} collection name
         */
        getCollectionName: (entityName: string) => string | null;
    };
}
export interface Expand {
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**Use the $filter system query option to set criteria for which entities will be returned. */
    filter?: string;
    /**Limit the number of results returned by using the $top system query option.Do not use $top with $count! */
    top?: number;
    /**An Array(of Strings) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied. */
    orderBy?: string[];
    /**A name of a single-valued navigation property which needs to be expanded. */
    property?: string;
    /**An Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned. */
    expand?: Expand[];
}
export interface BaseRequest {
    /**XHR requests only! Indicates whether the requests should be made synchronously or asynchronously.Default value is 'true'(asynchronously). */
    async?: boolean;
    /**Impersonates a user based on their systemuserid by adding "MSCRMCallerID" header.
     * A String representing the GUID value for the Dynamics 365 systemuserid. */
    impersonate?: string;
    /**Impersonates a user based on their Azure Active Directory (AAD) object id by passing that value along with the header "CallerObjectId". A String should represent a GUID value. */
    impersonateAAD?: string;
    /**If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'. */
    noCache?: boolean;
    /** Authorization Token. If set, onTokenRefresh will not be called. */
    token?: string;
    /**Sets a number of milliseconds before a request times out. */
    timeout?: number;
    /**The AbortSignal interface represents a signal object that allows you to communicate with a DOM request and abort it if required via an AbortController object. */
    signal?: AbortSignal;
    /**Indicates if an operation must be included in a Change Set or not. Works in Batch Operations only.
     * By default, it's "true", except for GET operations - they are not allowed in Change Sets. */
    inChangeSet?: boolean;
    /**Headers to supply with a request. These headers will override configuraiton headers if the identical ones were set. */
    headers?: HeaderCollection;
    /**
     * Custom query parameters. Can be used to set parameter aliases for "$filter" and "$orderBy".
     * Important! These parameters ARE NOT URI encoded! */
    queryParams?: string[];
    /**
     * Use this parameter to include a shared variable value that is accessible within a plug-in.
     */
    tag?: string;
}
export interface BatchRequest extends BaseRequest {
    /** Sets Prefer header to "odata.continue-on-error" that allows more requests be processed when errors occur. The batch request will return '200 OK' and individual response errors will be returned in the batch response body. */
    continueOnError?: boolean;
}
export interface Request extends BaseRequest {
    /**A name of the Entity Collection or Entity Logical name. */
    collection?: string;
}
export interface CRUDRequest extends Request {
    /**
     * A String representing collection record's Primary Key (GUID) or Alternate Key(s).
     * Can be ommitted in a Batch request when contentId is set.
     */
    key?: string;
}
export interface CountRequest extends Request {
    /**Use the $filter system query option to set criteria for which entities will be returned. */
    filter?: string;
}
export interface CountAllRequest extends CountRequest {
    /**A name of the Entity Collection or Entity Logical name. */
    collection: string;
    /**An Array (of strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
}
export interface FetchAllRequest extends Request {
    /**Sets FetchXML - a proprietary query language that provides capabilities to perform aggregation. */
    fetchXml: string;
    /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie */
    includeAnnotations?: string;
}
export interface FetchXmlRequest extends FetchAllRequest {
    /**Page number. */
    pageNumber?: number;
    /**Paging cookie. To retrive the first page, pagingCookie must be null. */
    pagingCookie?: string;
}
export interface CreateRequest<TData = any> extends CRUDRequest {
    /**If set to true, the request bypasses custom business logic, all synchronous plug-ins and real-time workflows are disabled. Check for special exceptions in Microsft Docs. */
    bypassCustomPluginExecution?: boolean;
    /**Web API v9+ only! Boolean that enables duplicate detection. */
    duplicateDetection?: boolean;
    /**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
    data?: TData;
    /**An array of Expand Objects representing the $expand OData System Query Option value to control which related records are also returned. Can also accept a string. */
    expand?: string | Expand[];
    /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
    includeAnnotations?: string;
    /**A String representing the name of a single - valued navigation property. Useful when needed to retrieve information about a related record in a single request. */
    navigationProperty?: string;
    /**A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
    navigationPropertyKey?: string;
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request. */
    returnRepresentation?: boolean;
    /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
    contentId?: string;
    /**A unique partition key value of a logical partition for non-relational custom entity data stored in NoSql tables of Azure heterogenous storage. */
    partitionId?: string;
}
export interface CreateWithRepresentationRequest<TData = any> extends Omit<CreateRequest<TData>, "returnRepresentation"> {
    returnRepresentation: true;
}
export interface UpdateRequestBase<T = any> extends CRUDRequest {
    /**If set to true, the request bypasses custom business logic, all synchronous plug-ins and real-time workflows are disabled. Check for special exceptions in Microsft Docs. */
    bypassCustomPluginExecution?: boolean;
    /**Web API v9+ only! Boolean that enables duplicate detection. */
    duplicateDetection?: boolean;
    /**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
    data?: T;
    /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
    expand?: Expand[];
    /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
    ifmatch?: string;
    /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
    includeAnnotations?: string;
    /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request. */
    returnRepresentation?: boolean;
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
    contentId?: string;
    /**Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata). */
    metadataAttributeType?: string;
    /**A String representing the name of a single - valued navigation property. Useful when needed to retrieve information about a related record in a single request. */
    navigationProperty?: string;
    /**A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
    navigationPropertyKey?: string;
    /**A unique partition key value of a logical partition for non-relational custom entity data stored in NoSql tables of Azure heterogenous storage. */
    partitionId?: string;
}
export interface UpdateRequest<T = any> extends UpdateRequestBase<T> {
    /**If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false' */
    mergeLabels?: boolean;
}
export interface UpdateSinglePropertyRequest extends CRUDRequest {
    /**Object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"} */
    fieldValuePair: {
        [key: string]: any;
    };
    /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
    expand?: Expand[];
    /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
    ifmatch?: string;
    /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
    includeAnnotations?: string;
    /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request. */
    returnRepresentation?: boolean;
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
    contentId?: string;
}
export interface UpsertRequest<T = any> extends UpdateRequestBase<T> {
    /**Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. */
    ifnonematch?: string;
}
export interface DeleteRequest extends CRUDRequest {
    /**If set to true, the request bypasses custom business logic, all synchronous plug-ins and real-time workflows are disabled. Check for special exceptions in Microsft Docs. */
    bypassCustomPluginExecution?: boolean;
    /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
    ifmatch?: string;
    /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
    contentId?: string;
    /**
     * Field name that needs to be cleared (for example File Field)
     * @deprecated Use "property".
     */
    fieldName?: string;
    /**Single property that needs to be cleared (including the File property) */
    property?: string;
}
export interface RetrieveRequest extends CRUDRequest {
    /**A name of the Entity Collection or Entity Logical name. */
    collection: string;
    /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
    expand?: Expand[];
    /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
    ifmatch?: string;
    /**Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. */
    ifnonematch?: string;
    /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
    includeAnnotations?: string;
    /**Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata). */
    metadataAttributeType?: string;
    /**A String representing the name of a single - valued navigation property. Useful when needed to retrieve information about a related record in a single request. */
    navigationProperty?: string;
    /**A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
    navigationPropertyKey?: string;
    /**A String representing the GUID value of the saved query. */
    savedQuery?: string;
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**A String representing the GUID value of the user query. */
    userQuery?: string;
    /**A unique partition key value of a logical partition for non-relational custom entity data stored in NoSql tables of Azure heterogenous storage. */
    partitionId?: string;
}
export interface RetrieveMultipleRequest extends Request {
    /**A name of the Entity Collection or Entity Logical name. */
    collection: string;
    /**Use the $apply to aggregate and group your data dynamically */
    apply?: string;
    /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
    expand?: Expand[];
    /**Boolean that sets the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000(per page).Do not use $top with $count! */
    count?: boolean;
    /**Use the $filter system query option to set criteria for which entities will be returned. */
    filter?: string;
    /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
    includeAnnotations?: string;
    /**Sets the odata.maxpagesize preference value to request the number of entities returned in the response. */
    maxPageSize?: number;
    /**An Array(of string) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied. */
    orderBy?: string[];
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**Limit the number of results returned by using the $top system query option.Do not use $top with $count! */
    top?: number;
    /**Sets Prefer header with value 'odata.track-changes' to request that a delta link be returned which can subsequently be used to retrieve entity changes. */
    trackChanges?: boolean;
    /**A unique partition key value of a logical partition for non-relational custom entity data stored in NoSql tables of Azure heterogenous storage. */
    partitionId?: string;
}
export interface AssociateRequest extends Request {
    /**
     * Primary entity record id/key.
     * Can be ommitted in a Batch request when contentId is set.
     */
    primaryKey?: string;
    /**Relationship name. */
    relationshipName: string;
    /**
     * Related name of the Entity Collection or Entity Logical name.
     * Can be omitted in a Batch request when relatedKey is set to a ContentId.
     */
    relatedCollection?: string;
    /**Related entity record id/key or a ContentId in a Batch request (e.g. $2). */
    relatedKey: string;
    /**v2.3.1+ BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
    contentId?: string;
}
export interface AssociateSingleValuedRequest extends Request {
    /**
     * Primary entity record id/key.
     * Can be ommitted in a Batch request when contentId is set.
     */
    primaryKey?: string;
    /**Navigation property name. */
    navigationProperty: string;
    /**
     * Related name of the Entity Collection or Entity Logical name.
     * Can be omitted in a Batch request when relatedKey is set to a ContentId.
     */
    relatedCollection?: string;
    /**Related entity record id/key or a ContentId in a Batch request (e.g. $2). */
    relatedKey: string;
    /**v2.3.1+ BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
    contentId?: string;
}
export interface DisassociateRequest extends Request {
    /**Primary entity record id/key. */
    primaryKey: string;
    /**Relationship name. */
    relationshipName: string;
    /**Related entity record id/key. */
    relatedKey: string;
}
export interface DisassociateSingleValuedRequest extends Request {
    /**Primary entity record id/key. */
    primaryKey: string;
    /**Navigation property name. */
    navigationProperty: string;
}
export interface UnboundFunctionRequest extends BaseRequest {
    /**
     * Name of the function.
     */
    name?: string;
    /**
     * Name of the function.
     * @deprecated Use "name" parameter.
     */
    functionName?: string;
    /**Function's input parameters. Example: { param1: "test", param2: 3 }. */
    parameters?: any;
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**Use the $filter system query option to set criteria for which entities will be returned. */
    filter?: string;
}
export interface BoundFunctionRequest extends UnboundFunctionRequest, Request {
    /**A String representing the GUID value for the record. */
    key?: string;
}
export interface UnboundActionRequest<TAction = any> extends BaseRequest {
    /**A name of the Web API action. */
    actionName: string;
    /**An object that represents a Dynamics 365 action. */
    action?: TAction;
    /**
     * A callback URL when the background operation is completed.
     * Dataverse uses this URL to send a POST request.
     */
    backgroundOperationCallbackUrl?: string;
    /**
     * Use background operations to send requests that Dataverse processes asynchronously.
     * Background operations are useful when you don't want to maintain a connection while a request runs.
     */
    respondAsync?: boolean;
}
export interface BoundActionRequest<TAction = any> extends UnboundActionRequest<TAction>, Request {
    /**A String representing the GUID value for the record. */
    key?: string;
}
export interface CreateEntityRequest extends BaseRequest {
    /**An object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
    data: any;
}
export interface UpdateEntityRequest extends CRUDRequest {
    /**An object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
    data: any;
    /**Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false. */
    mergeLabels?: boolean;
}
export interface RetrieveEntityRequest extends BaseRequest {
    /**An Entity MetadataId or Alternate Key (such as LogicalName). */
    key: string;
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
    expand?: Expand[];
}
export interface RetrieveEntitiesRequest extends BaseRequest {
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**Use the $filter system query option to set criteria for which entities will be returned. */
    filter?: string;
    /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
    expand?: Expand[];
}
export interface CreateAttributeRequest extends BaseRequest {
    /**An Entity MetadataId or Alternate Key (such as LogicalName). */
    entityKey: string;
    /**Attribute metadata object. */
    data: any;
}
export interface UpdateAttributeRequest extends CreateAttributeRequest {
    /**Use this parameter to cast the Attribute to a specific type. */
    castType?: string;
    /**Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false. */
    mergeLabels?: boolean;
}
export interface RetrieveAttributesRequest extends BaseRequest {
    /**An Entity MetadataId or Alternate Key (such as LogicalName). */
    entityKey: string;
    /**Use this parameter to cast the Attribute to a specific type. */
    castType?: string;
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**Use the $filter system query option to set criteria for which entities will be returned. */
    filter?: string;
    /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
    expand?: Expand[];
}
export interface RetrieveAttributeRequest extends BaseRequest {
    /**An Attribute MetadataId or Alternate Key (such as LogicalName). */
    attributeKey: string;
    /**An Entity MetadataId or Alternate Key (such as LogicalName). */
    entityKey: string;
    /**Use this parameter to cast the Attribute to a specific type. */
    castType?: string;
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
    expand?: Expand[];
}
export interface CreateRelationshipRequest extends BaseRequest {
    /**Relationship Definition. */
    data: any;
}
export interface UpdateRelationshipRequest extends CreateRelationshipRequest {
    /**Use this parameter to cast the Relationship metadata to a specific type. */
    castType?: string;
    /**Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false. */
    mergeLabels?: boolean;
}
export interface DeleteRelationshipRequest extends BaseRequest {
    /**A Relationship MetadataId or Alternate Key (such as LogicalName). */
    key: string;
}
export interface RetrieveRelationshipsRequest extends BaseRequest {
    /**Use this parameter to cast the Relationship metadata to a specific type. */
    castType?: string;
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**Use the $filter system query option to set criteria for which entities will be returned. */
    filter?: string;
    /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
    expand?: Expand[];
}
export interface RetrieveRelationshipRequest extends BaseRequest {
    /**A Relationship MetadataId or Alternate Key (such as LogicalName). */
    key: string;
    /**Use this parameter to cast the Relationship metadata to a specific type. */
    castType?: string;
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
    expand?: Expand[];
}
export interface CreateGlobalOptionSetRequest extends BaseRequest {
    /**Global Option Set Definition. */
    data: any;
}
export interface UpdateGlobalOptionSetRequest extends CreateRelationshipRequest {
    /**Use this parameter to cast the Global Option Set metadata to a specific type. */
    castType?: string;
    /**Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false. */
    mergeLabels?: boolean;
}
export interface DeleteGlobalOptionSetRequest extends BaseRequest {
    /**A Global Option Set MetadataId or Alternate Key (such as LogicalName). */
    key: string;
}
export interface RetrieveGlobalOptionSetsRequest extends BaseRequest {
    /**Use this parameter to cast the Global Option Set metadata to a specific type. */
    castType?: string;
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**Use the $filter system query option to set criteria for which entities will be returned. */
    filter?: string;
    /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
    expand?: Expand[];
}
export interface RetrieveGlobalOptionSetRequest extends BaseRequest {
    /**A Global Option Set MetadataId or Alternate Key (such as LogicalName). */
    key: string;
    /**Use this parameter to cast the Global Option Set metadata to a specific type. */
    castType?: string;
    /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
    select?: string[];
    /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
    expand?: Expand[];
}
export interface UploadRequest extends CRUDRequest {
    /**Binary Buffer*/
    data: Uint8Array | Buffer;
    /**Name of the file */
    fileName: string;
    /**The name of File Column (field) */
    property?: string;
    /**
     * File Field Name
     * @deprecated Use "property".
     */
    fieldName?: string;
}
export interface DownloadRequest extends CRUDRequest {
    /**The name of File Column (field) */
    property?: string;
    /**
     * File Field Name
     * @deprecated Use "property".
     */
    fieldName?: string;
}
export interface CsdlMetadataRequest extends BaseRequest {
    /**If set to "true" the document will include many different kinds of annotations that can be useful. Most annotations are not included by default because they increase the total size of the document. */
    addAnnotations?: boolean;
}
export type BackgroundOperationResponse = {
    /**
     * Location URL of the background operation.
     */
    location: string;
    /**
     * The ID of the background operation.
     */
    backgroundOperationId: string;
};
export type SearchMode = "any" | "all";
export type SearchType = "simple" | "full";
export type SearchEntity = {
    /**Logical name of the table. Specifies scope of the query. */
    name: string;
    /**List of columns that needs to be projected when table documents are returned in response. If empty, only the table primary name is returned. */
    selectColumns?: string[];
    /**List of columns to scope the query on. If empty, only the table primary name is searched on.*/
    searchColumns?: string[];
    /**Filters applied on the entity.*/
    filter?: string;
};
export type SearchOptions = Record<string, any> & {
    /**Values can be simple or lucene. */
    queryType?: "simple" | "lucene";
    /**Enables intelligent query workflow to return probable set of results if no good matches are found for the search request terms.*/
    bestEffortSearchEnabled?: boolean;
    /**Enable ranking of results in the response optimized for display in search results pages where results are grouped by table.*/
    searchMode?: SearchMode;
    /**When specified as all the search terms must be matched in order to consider the document as a match. Setting its value to any defaults to matching any word in the search term.*/
    groupRankingEnabled?: boolean;
};
export type SuggestOptions = Record<string, any> & {
    /**Enables advanced suggestions for the search query. The default is false. */
    advancedSuggestEnabled?: boolean;
};
export interface SearchQueryBase {
    /**The text to search with. It has a 100-character limit. For suggestions, min 3 characters in addition. */
    search: string;
    /**Limits the scope of search to a subset of tables. The default set is configured by your administrator when Dataverse search is enabled. */
    entities?: string[] | SearchEntity[] | string;
    /**Limits the scope of the search results returned. */
    filter?: string;
}
export interface Query extends SearchQueryBase {
    /**V2. Specify true to return the total record count; otherwise false. The default is false. */
    count?: boolean;
    /**Facets support the ability to drill down into data results after they've been retrieved. */
    facets?: string | string[];
    /**
     * V1. Specify true to return the total record count; otherwise false. The default is false.
     * @deprecated Use "count".
     */
    returnTotalRecordCount?: boolean;
    /**Specifies the number of search results to skip. */
    skip?: number;
    /**Specifies the number of search results to retrieve. The default is 50, and the maximum value is 100. */
    top?: number;
    /**A list of clauses where each clause consists of a column name followed by 'asc' (ascending, which is the default) or 'desc' (descending). This list specifies how to order the results in order of precedence. */
    orderBy?: string | string[];
    /**V2. Options are settings configured to search a search term. */
    options?: string | SearchOptions;
    /**
     * V1. Specifies whether any or all the search terms must be matched to count the document as a match. The default is 'any'.
     * @deprecated Use "options.searchmode".
     */
    searchMode?: SearchMode;
    /**
     * V1. The search type specifies the syntax of a search query. Using 'simple' selects simple query syntax and 'full' selects Lucene query syntax. The default is 'simple'.
     * @deprecated Use "options.querytype".
     */
    searchType?: SearchType;
}
/**@deprecated Use Query instead */
export interface Search extends Query {
}
export interface Suggest extends SearchQueryBase {
    /**Use fuzzy search to aid with misspellings. The default is false. */
    fuzzy?: boolean;
    /**
     * Use fuzzy search to aid with misspellings. The default is false.
     * @deprecated Use "fuzzy".
     */
    useFuzzy?: boolean;
    /**V2. Options are settings configured to search a search term. */
    options?: string | SuggestOptions;
    /**Number of suggestions to retrieve. The default is 5. */
    top?: number;
    /**A list of comma-separated clauses where each clause consists of a column name followed by 'asc' (ascending, which is the default) or 'desc' (descending). This list specifies how to order the results in order of precedence. */
    orderBy?: string | string[];
}
export interface Autocomplete extends SearchQueryBase {
    /**Use fuzzy search to aid with misspellings. The default is false. */
    fuzzy?: boolean;
    /**
     * Use fuzzy search to aid with misspellings. The default is false.
     * @deprecated Use "fuzzy".
     */
    useFuzzy?: boolean;
}
export interface QueryRequest extends BaseRequest {
    /**Search query object */
    query: Query;
}
/**@deprecated Use QueryRequest instead. */
export interface SearchRequest extends QueryRequest {
}
export interface SuggestRequest extends BaseRequest {
    /**Suggestion query object */
    query: Suggest;
}
export interface AutocompleteRequest extends BaseRequest {
    /**Autocomplete query object */
    query: Autocomplete;
}
export type SearchApiOptions = {
    /**
     * Escapes the search string.
     * Special characters that require escaping include the following: + - & | ! ( ) { } [ ] ^ " ~ * ? : \ /.
     */
    escapeSpecialCharacters?: boolean;
    /**
     * Enables compatibility of the responses between v1 and v2.
     * Only enable this option temporarily, because it will force all response properties to be duplicated to achieve a full compatibility.
     */
    enableResponseCompatibility?: boolean;
};
export interface ApiConfig<TOptions = any> {
    /** API Version to use, for example: "9.2" or "1.0". */
    version?: string;
    /** API Path, for example: "data" or "search". */
    path?: string;
    /** Specific API options. Currently it is only available for the Search API .*/
    options?: TOptions;
}
export interface AccessToken {
    /** Access Token */
    accessToken: string;
}
export interface Config {
    /**The url to Dataverse API server, for example: https://contoso.api.crm.dynamics.com/. It is required when used in Node.js application. */
    serverUrl?: string | null;
    /**Impersonates a user based on their systemuserid by adding "MSCRMCallerID" header. A String representing the GUID value for the Dynamics 365 systemuserid. */
    impersonate?: string | null;
    /**Impersonates a user based on their Azure Active Directory (AAD) object id by passing that value along with the header "CallerObjectId". A String should represent a GUID value. */
    impersonateAAD?: string | null;
    /**A function that is called when a security token needs to be refreshed. */
    onTokenRefresh?: (() => Promise<AccessToken | string | null>) | null;
    /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types.*/
    includeAnnotations?: string | null;
    /**Sets the odata.maxpagesize preference value to request the number of entities returned in the response. */
    maxPageSize?: number | null;
    /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request.*/
    returnRepresentation?: boolean | null;
    /**Indicates whether to use Entity Logical Names instead of Collection Logical Names.*/
    useEntityNames?: boolean | null;
    /**Sets a number of milliseconds before a request times out. */
    timeout?: number | null;
    /**Proxy configuration object. */
    proxy?: ProxyConfig | null;
    /**Configuration object for Dataverse Web API (with path "data"). */
    dataApi?: ApiConfig;
    /**Configuration object for Dataverse Search API (with path "search"). */
    searchApi?: ApiConfig<SearchApiOptions>;
    /**Default headers to supply with each request. */
    headers?: HeaderCollection;
    /**
     * A default callback URL when the background operation is completed.
     * Dataverse uses this URL to send a POST request.
     * You can also set a callback URL per request.
     */
    backgroundOperationCallbackUrl?: string;
}
/**Header collection type */
export type HeaderCollection = Record<string, string>;
export interface ProxyConfig {
    /**Proxy server url */
    url: string;
    /**Basic authentication credentials */
    auth?: {
        /**Username */
        username: string;
        /**Password */
        password: string;
    };
}
/** Callback with an acquired token called by DynamicsWebApi; "token" argument can be a string or an object with a property {accessToken: <token>}  */
export interface RequestError extends Error {
    /**The name of the error */
    name: string;
    /**This code is not related to the http status code and is frequently empty */
    code?: string;
    /**A message describing the error */
    message: string;
    /**HTTP status code */
    status?: number;
    /**HTTP status text. Frequently empty */
    statusText?: string;
    /**HTTP Response headers */
    headers?: any;
    /**Details about an error */
    innererror?: {
        /**A message describing the error, this is frequently the same as the outer message */
        message?: string;
        /**Microsoft.Crm.CrmHttpException */
        type?: string;
        /**Details from the server about where the error occurred */
        stacktrace?: string;
    };
}
export interface MultipleResponse<TValue = any> {
    /**Multiple respone entities */
    value: TValue[];
    oDataCount?: number;
    "@odata.count"?: number;
    oDataContext?: string;
    "@odata.context"?: number;
}
export interface AllResponse<TValue> extends MultipleResponse<TValue> {
    /**@odata.deltaLink value */
    oDataDeltaLink?: string;
}
export interface RetrieveMultipleResponse<TValue> extends MultipleResponse<TValue> {
    "@Microsoft.Dynamics.CRM.totalrecordcount"?: number;
    "@Microsoft.Dynamics.CRM.totalrecordcountlimitexceeded"?: boolean;
    /**@odata.nextLink value */
    oDataNextLink?: string;
    /**@odata.deltaLink value */
    oDataDeltaLink?: string;
    "@odata.deltaLink"?: string;
    "@odata.nextLink"?: string;
}
export interface FetchXmlResponse<TValue> extends MultipleResponse<TValue> {
    "@Microsoft.Dynamics.CRM.totalrecordcount"?: number;
    "@Microsoft.Dynamics.CRM.totalrecordcountlimitexceeded"?: boolean;
    /**Paging information */
    PagingInfo?: {
        /**Number of the next page */
        nextPage?: number;
        /**Next page cookie */
        cookie?: string;
    };
}
export interface DownloadResponse {
    /**The name of the file */
    fileName: string;
    /**File size */
    fileSize: number;
    /**File Data */
    data: Uint8Array | Buffer;
}
/**@deprecated Use QueryResponse instead */
export interface SearchResponse<TValue = any> {
    /**
     * A collection of matching records.
     * @deprecated Use "response.Value" instead.
     */
    value: TValue[];
    /**
     * If facets were requested in the query, a dictionary of facet values.
     * @deprecated Use "response.Facets" instead.
     */
    facets: any | null;
    /**
     * If "Count": true is included in the body of the request, the count of all documents that match the search, ignoring top and skip.
     * @deprecated Use "response.Count" instead.
     */
    totalrecordcount: number;
    /**
     * This property is used for backend search. It's included for future feature releases and isn't currently used.
     * @deprecated Use "response.QueryContext" instead.
     */
    querycontext: any | null;
}
export interface QueryResponse extends SearchResponse<SearchQueryResult> {
    /** Query response */
    response: {
        /**
         * A collection of matching records.
         */
        Value: SearchQueryResult[];
        /**
         * Provides error information from Azure Cognitive search.
         */
        Error: SearchErrorDetail | null;
        /**
         * If facets were requested in the query, a dictionary of facet values.
         */
        Facets: Record<string, SearchFacetResult[]> | null;
        /**
         * This property is used for backend search. It's included for future feature releases and isn't currently used.
         */
        QueryContext: SearchQueryContext | null;
        /**
         * If "Count": true is included in the body of the request, the count of all documents that match the search, ignoring top and skip.
         */
        Count: number;
    };
    "@odata.context": string;
}
export interface SuggestResponse<TValueDocument = any> {
    /**
     * A collection of matching records.
     * @deprecated Use "response.Value" instead.
     */
    value: SuggestResponseValue<TValueDocument>[];
    /**
     * Suggestions query context
     * @deprecated Use "response.QueryContext" instead.
     */
    querycontext: any | null;
    /** Suggestion response. */
    response: {
        /** Provides error information from Azure Cognitive search. */
        Error: SearchErrorDetail | null;
        /** A collection of matching records. */
        Value: SuggestResponseValue<TValueDocument>[];
        /**
         * The query context returned as part of response. This property is used for backend search.
         * It's included for future feature releases and isn't currently used.
         */
        QueryContext: SearchQueryContext | null;
    };
    "@odata.context": string;
}
export interface AutocompleteResponse {
    /**
     * Autocomplete text result.
     * @deprecated Use "response.Value" instead.
     */
    value: string | null;
    /**
     * This property is used for backend search. It's included for future feature releases and isn't currently used.
     * @deprecated Use "response.QueryContext" instead.
     */
    querycontext: any | null;
    /** Autocomplete response. */
    response: {
        /** Provides error information from Azure Cognitive search. */
        Error: SearchErrorDetail | null;
        /** Autocomplete text result. */
        Value: string | null;
        /**
         * This property is used for backend search. It's included for future feature releases and isn't currently used.
         */
        QueryContext: SearchQueryContext | null;
    };
    "@odata.context": string;
}
type CallFunction = {
    /**
     * Calls a Web API function
     *
     * @param name - The name of a function.
     * @returns {Promise} D365 Web Api Response
     */
    <T = any>(name: string): Promise<T>;
    /**
     * Calls a bound Web API function
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    <T = any>(request: BoundFunctionRequest): Promise<T>;
    /**
     * Calls an unbound Web API function (not bound to a particular table row)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    <T = any>(request: UnboundFunctionRequest): Promise<T>;
};
type CallAction = {
    /**
     * Calls a bound Web API action (bound to a particular table row)
     *
     * @param request - An object that represents all possible options for a current request.
     * @type {T} Type of the value in a response
     * @returns {Promise} D365 Web Api Response
     */
    <T = any>(request: BoundActionRequest): Promise<T>;
    /**
     * Calls an unbound Web API action (not bound to a particular table row)
     *
     * @param request - An object that represents all possible options for a current request.
     * @type {T} Type of the value in a response
     * @returns {Promise} D365 Web Api Response
     */
    <T = any>(request: UnboundActionRequest): Promise<T>;
    /**
     * Calls a bound Web API action (bound to a particular table row)
     *
     * @param request - An object that represents all possible options for a current request.
     * @type {TResponse} Type of the value in a response
     * @type {TAction} Type of an action object
     * @returns {Promise} D365 Web Api Response
     */
    <TResponse = any, TAction = any>(request: BoundActionRequest<TAction>): Promise<TResponse>;
    /**
     * Calls an unbound Web API action (not bound to a particular table row)
     *
     * @param request - An object that represents all possible options for a current request.
     * @type {TResponse} Type of the value in a response
     * @type {TAction} Type of an action object
     * @returns {Promise} D365 Web Api Response
     */
    <TResponse = any, TAction = any>(request: UnboundActionRequest<TAction>): Promise<TResponse>;
};
/**@deprecated Use "QueryFunction" instead */
type SearchFunction = {
    /**
     * Provides a search results page.
     * @param term - The term to be searched for and has a max 100-character limit.
     * @returns {Promise<SearchResponse>} Search result
     */
    (term: string): Promise<SearchResponse>;
    /**
     * Provides a search results page.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<SearchResponse<TValue>>} Search result
     */
    <TValue = any>(request: QueryRequest): Promise<SearchResponse<TValue>>;
};
type QueryFunction = {
    /**
     * Provides a search results page.
     * @param term - The term to be searched for and has a max 100-character limit.
     * @returns {Promise<SearchResponse>} Search result
     */
    (term: string): Promise<QueryResponse>;
    /**
     * Provides a search results page.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<QueryResponse>} Search result
     */
    (request: QueryRequest): Promise<QueryResponse>;
};
type SuggestFunction = {
    /**
     * Provides suggestions as the user enters text into a form field.
     * @param term - The term to be searched for and has min 3 characters to a max 100-character limit.
     * @returns {Promise<SuggestResponse>} Suggestions result
     */
    (term: string): Promise<SuggestResponse>;
    /**
     * Provides suggestions as the user enters text into a form field.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<SuggestResponse<TValueDocument>>} Suggestions result
     */
    <TValueDocument = any>(request: SuggestRequest): Promise<SuggestResponse<TValueDocument>>;
};
type AutocompleteFunction = {
    /**
     * Provides autocompletion of input as the user enters text into a form field.
     * @param term - The term to be searched for and has a 100-character limit.
     * @returns {Promise<AutocompleteResponse>} Result of autocomplete
     */
    (term: string): Promise<AutocompleteResponse>;
    /**
     * Provides autocompletion of input as the user enters text into a form field.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<AutocompleteResponse>} Result of autocomplete
     */
    (request: AutocompleteRequest): Promise<AutocompleteResponse>;
};
/**
 * The Azure Cognitive search error returned as part of the response.
 */
export type SearchErrorDetail = {
    /**
     * The error code.
     */
    code: string;
    /**
     * The error message.
     */
    message: string;
    /**
     * More error information.
     */
    propertybag: Record<string, any>;
};
/**
 * A facet query result that reports the number of documents with a field falling within a particular range or having a particular value or interval.
 */
export type SearchFacetResult = {
    /**
     * The count of documents falling within the bucket described by this facet.
     */
    count?: number;
    /**
     * Value indicating the inclusive lower bound of the facet's range, or null to indicate that there's no lower bound.
     */
    from: any;
    /**
     * Value indicating the exclusive upper bound of the facet's range, or null to indicate that there's no upper bound.
     */
    to: any;
    /**
     * Type of the facet.
     */
    type: "Value" | "Range";
    /**
     * Value of the facet, or the inclusive lower bound if it's an interval facet.
     */
    value: any;
    /**
     * Another or optional value of the facet, populated while faceting on lookups.
     */
    optionalvalue: any;
};
/**
 * The query context returned as part of response. This property is used for backend search. It's included for future feature releases and isn't currently used.
 */
export type SearchQueryContext = {
    /** The query string as specified in the request. */
    originalquery: string;
    /**
     * The query string that Dataverse search used to perform the query. Dataverse search uses the altered query string
     * if the original query string contained spelling mistakes or didn't yield optimal results.
     */
    alteredquery: string;
    /** The reasons behind query alter decision by Dataverse search. */
    reason: string[];
    /** The spell suggestion that is the likely words that represent user's intent. Populated only when Dataverse alters the query search due to spell check. */
    spellsuggestions: string[];
};
/**
 * Represents a record in Dataverse.
 */
export type SearchQueryResult = {
    /**
     * The identifier of the record.
     */
    Id: string;
    /**
     * The logical name of the table.
     */
    EntityName: string;
    /**
     * The object type code.
     */
    ObjectTypeCode: number;
    /**
     * Record attributes
     */
    Attributes: Record<string, any>;
    /**
     * The highlights.
     */
    Highlights: Record<string, string[]>;
    /**
     * The document score.
     */
    Score: number;
};
export interface SuggestResponseValue<TDocument = any> {
    /**
     * Provides the suggested text.
     * @deprecated Use "Text" instead.
     */
    text: string;
    /**
     * Provides the suggested text.
     */
    Text: string;
    /**
     * The document.
     * @deprecated Use "Document" instead.
     */
    document: TDocument;
    /**
     * The document.
     */
    Document: TDocument;
}
export type BackgroundOperationStatusResponse = Record<string, any> & {
    /**
     * Background operation error code.
     */
    backgroundOperationErrorCode?: number;
    /**
     * Background operation error message.
     */
    backgroundOperationErrorMessage?: string;
    /**
     * Background operation state code.
     */
    backgroundOperationStateCode: number;
    /**
     * Background operation status code.
     */
    backgroundOperationStatusCode: number;
};
export {};
//# sourceMappingURL=dynamics-web-api.d.ts.map