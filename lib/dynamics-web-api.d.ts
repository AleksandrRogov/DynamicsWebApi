import { RequestClient } from "./requests/RequestClient";
/**
 * Microsoft Dynamics CRM Web API helper library written in JavaScript.
 * It is compatible with: Dynamics 365 (online), Dynamics 365 (on-premise), Dynamics CRM 2016, Dynamics CRM Online.
 * @module dynamics-web-api
 */
export declare class DynamicsWebApi {
    private _internalConfig;
    private _isBatch;
    constructor(config?: DynamicsWebApi.Config);
    /**
     * Sets the configuration parameters for DynamicsWebApi helper.
     *
     * @param {DWAConfig} config - configuration object
     * @example
       dynamicsWebApi.setConfig({ webApiVersion: '9.0' });
     */
    setConfig: (config: DynamicsWebApi.Config) => void;
    private _makeRequest;
    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     * @example
        *var lead = {
        *    subject: "Test WebAPI",
        *    firstname: "Test",
        *    lastname: "WebAPI",
        *    jobtitle: "Title"
        *};
        *
        *var request = {
        *    entity: lead,
        *    collection: "leads",
        *    returnRepresentation: true
        *}
        *
        *dynamicsWebApi.createRequest(request).then(function (response) {
        *}).catch(function (error) {
        *});
     */
    createRequest: <T = any>(request: DynamicsWebApi.CreateRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {Object} object - A JavaScript object valid for create operations.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string|Array} [prefer] - Sets a Prefer header value. For example: ['retrun=representation', 'odata.include-annotations="*"']
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     * @example
        *var lead = {
        *    subject: "Test WebAPI",
        *    firstname: "Test",
        *    lastname: "WebAPI",
        *    jobtitle: "Title"
        *};
        *
        *dynamicsWebApi.create(lead, "leads").then(function (id) {
        *}).catch(function (error) {
        *});
     */
    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     * @example
        *var request = {
        *    key: '7d577253-3ef0-4a0a-bb7f-8335c2596e70',
        *    collection: "leads",
        *    select: ["fullname", "subject"],
        *    ifnonematch: 'W/"468026"',
        *    includeAnnotations: "OData.Community.Display.V1.FormattedValue"
        *};
        *
        *dynamicsWebApi.retrieveRequest(request).then(function (response) {
        *
        *}).catch(function (error) {
        *
        *});
     */
    retrieveRequest: <T = any>(request: DynamicsWebApi.RetrieveRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {string} key - A String representing the GUID value or Aternate Key for the record to retrieve.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     * @returns {Promise} D365 Web Api result
     */
    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    updateRequest: <T = any>(request: DynamicsWebApi.UpdateRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key for the record to update.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {string} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     */
    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key for the record to update.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Object} keyValuePair - keyValuePair object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"}
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     */
    updateSingleProperty: <T = any>(key: string, collection: string, keyValuePair: Object, prefer?: string | string[], select?: string[]) => Promise<T>;
    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    deleteRequest: (request: DynamicsWebApi.DeleteRequest) => Promise<any>;
    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key for the record to delete.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {string} [propertyName] - The name of the property which needs to be emptied. Instead of removing a whole record only the specified property will be cleared.
     * @returns {Promise} D365 Web Api result
     */
    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    upsertRequest: <T = any>(request: DynamicsWebApi.UpsertRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {string} key - A String representing the GUID value or Alternate Key for the record to upsert.
     * @param {string} collection - The name of the Entity Collection or Entity Logical name.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise} D365 Web Api result
     */
    retrieveMultipleRequest: <T = any>(request: DynamicsWebApi.RetrieveMultipleRequest, nextPageLink?: string) => Promise<DynamicsWebApi.RetrieveMultipleResponse<T>>;
    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise} D365 Web Api result
     */
    private _retrieveAllRequest;
    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    retrieveAllRequest: <T = any>(request: DynamicsWebApi.RetrieveMultipleRequest) => Promise<DynamicsWebApi.AllResponse<T>>;
    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    count: (request: DynamicsWebApi.CountRequest) => Promise<number>;
    /**
     * Sends an asynchronous request to count records. Returns: Number
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    countAll: (request: DynamicsWebApi.CountAllRequest) => Promise<number>;
    /**
     * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    fetch: <T = any>(request: DynamicsWebApi.FetchXmlRequest) => Promise<DynamicsWebApi.FetchXmlResponse<T>>;
    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    fetchAll: <T = any>(request: DynamicsWebApi.FetchAllRequest) => Promise<DynamicsWebApi.FetchXmlResponse<T>>;
    /**
     * Associate for a collection-valued navigation property. (1:N or N:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    associate: (request: DynamicsWebApi.AssociateRequest) => Promise<void>;
    /**
     * Disassociate for a collection-valued navigation property.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    disassociate: (request: DynamicsWebApi.DisassociateRequest) => Promise<void>;
    /**
     * Associate for a single-valued navigation property. (1:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    associateSingleValued: (request: DynamicsWebApi.AssociateSingleValuedRequest) => Promise<void>;
    /**
     * Removes a reference to an entity for a single-valued navigation property. (1:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    disassociateSingleValued: (request: DynamicsWebApi.DisassociateSingleValuedRequest) => Promise<void>;
    /**
     * Executes an unbound function (not bound to a particular entity record)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    executeUnboundFunction: <T = any>(request: DynamicsWebApi.UnboundFunctionRequest) => Promise<T>;
    /**
     * Executes a bound function
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    executeBoundFunction: <T = any>(request: DynamicsWebApi.BoundFunctionRequest) => Promise<T>;
    private _executeFunction;
    /**
     * Executes an unbound Web API action (not bound to a particular entity record)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    executeUnboundAction: <T = any>(request: DynamicsWebApi.UnboundActionRequest) => Promise<T>;
    /**
     * Executes a bound Web API action (bound to a particular entity record)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise | Function} D365 Web Api result
     */
    executeBoundAction: <T = any>(request: DynamicsWebApi.BoundActionRequest) => Promise<T>;
    private _executeAction;
    /**
     * Sends an asynchronous request to create an entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    createEntity: <T = any>(request: DynamicsWebApi.CreateEntityRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to update an entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    updateEntity: <T = any>(request: DynamicsWebApi.UpdateEntityRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to retrieve a specific entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
    * @returns {Promise} D365 Web Api result
     */
    retrieveEntity: <T = any>(request: DynamicsWebApi.RetrieveEntityRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to retrieve entity definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api result
     */
    retrieveEntities: <T = any>(request?: DynamicsWebApi.RetrieveEntitiesRequest) => Promise<DynamicsWebApi.RetrieveMultipleResponse<T>>;
    /**
     * Sends an asynchronous request to create an attribute.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {Object} attributeDefinition - Object that describes the attribute.
     * @returns {Promise} D365 Web Api result
     */
    createAttribute: <T = any>(request: DynamicsWebApi.CreateAttributeRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to update an attribute.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {Object} attributeDefinition - Object that describes the attribute.
     * @param {string} [attributeType] - Use this parameter to cast the Attribute to a specific type.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     * @returns {Promise} D365 Web Api result
     */
    updateAttribute: <T = any>(request: DynamicsWebApi.UpdateAttributeRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to retrieve attribute metadata for a specified entity definition.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {string} [attributeType] - Use this parameter to cast the Attributes to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which attribute definitions will be returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     * @returns {Promise} D365 Web Api result
     */
    retrieveAttributes: <T = any>(request: DynamicsWebApi.RetrieveAttributesRequest) => Promise<DynamicsWebApi.RetrieveMultipleResponse<T>>;
    /**
     * Sends an asynchronous request to retrieve a specific attribute metadata for a specified entity definition.
     *
     * @param {string} entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param {string} attributeKey - The Attribute Metadata id.
     * @param {string} [attributeType] - Use this parameter to cast the Attribute to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     * @returns {Promise} D365 Web Api result
     */
    retrieveAttribute: <T = any>(request: DynamicsWebApi.RetrieveAttributeRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to create a relationship definition.
     *
     * @param {string} relationshipDefinition - Relationship Definition.
     * @returns {Promise} D365 Web Api result
     */
    createRelationship: <T = any>(request: DynamicsWebApi.CreateRelationshipRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to update a relationship definition.
     *
     * @param {string} relationshipDefinition - Relationship Definition.
     * @param {string} [relationshipType] - Use this parameter to cast the Relationship to a specific type.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     * @returns {Promise} D365 Web Api result
     */
    updateRelationship: <T = any>(request: DynamicsWebApi.UpdateRelationshipRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to delete a relationship definition.
     *
     * @param {string} metadataId - A String representing the GUID value.
     * @returns {Promise} D365 Web Api result
     */
    deleteRelationship: (request: DynamicsWebApi.DeleteRelationshipRequest) => Promise<any>;
    /**
     * Sends an asynchronous request to retrieve relationship definitions.
     *
     * @param {string} [relationshipType] - Use this parameter to cast a Relationship to a specific type: 1:M or M:M.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which relationships will be returned.
     * @returns {Promise} D365 Web Api result
     */
    retrieveRelationships: <T = any>(request?: DynamicsWebApi.RetrieveRelationshipsRequest) => Promise<DynamicsWebApi.RetrieveMultipleResponse<T>>;
    /**
     * Sends an asynchronous request to retrieve a specific relationship definition.
     *
     * @param {string} metadataId - String representing the Metadata Id GUID.
     * @param {string} [relationshipType] - Use this parameter to cast a Relationship to a specific type: 1:M or M:M.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @returns {Promise} D365 Web Api result
     */
    retrieveRelationship: <T = any>(request: DynamicsWebApi.RetrieveRelationshipRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to create a Global Option Set definition
     *
     * @param {string} globalOptionSetDefinition - Global Option Set Definition.
     * @returns {Promise} D365 Web Api result
     */
    createGlobalOptionSet: <T = any>(request: DynamicsWebApi.CreateGlobalOptionSetRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to update a Global Option Set.
     *
     * @param {string} globalOptionSetDefinition - Global Option Set Definition.
     * @param {boolean} [mergeLabels] - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     * @returns {Promise} D365 Web Api result
     */
    updateGlobalOptionSet: <T = any>(request: DynamicsWebApi.UpdateGlobalOptionSetRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to delete a Global Option Set.
     *
     * @param {string} globalOptionSetKey - A String representing the GUID value or Alternate Key (such as Name).
     * @returns {Promise} D365 Web Api result
     */
    deleteGlobalOptionSet: (request: DynamicsWebApi.DeleteGlobalOptionSetRequest) => Promise<any>;
    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     *
     * @param {string} globalOptionSetKey - The Global Option Set MetadataID or Alternate Key (such as Name).
     * @param {string} [castType] - Use this parameter to cast a Global Option Set to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned
     * @returns {Promise} D365 Web Api result
     */
    retrieveGlobalOptionSet: <T = any>(request: DynamicsWebApi.RetrieveGlobalOptionSetRequest) => Promise<T>;
    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     *
     * @param {string} [castType] - Use this parameter to cast a Global Option Set to a specific type.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned
     * @returns {Promise} D365 Web Api result
     */
    retrieveGlobalOptionSets: <T = any>(request?: DynamicsWebApi.RetrieveGlobalOptionSetsRequest) => Promise<DynamicsWebApi.RetrieveMultipleResponse<T>>;
    /**
     * Starts a batch request.
     *
     */
    startBatch: () => void;
    /**
     * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
     * @returns {Promise} D365 Web Api result
     */
    executeBatch: (request?: DynamicsWebApi.BaseRequest) => Promise<any[]>;
    /**
     * Creates a new instance of DynamicsWebApi
     *
     * @param {DWAConfig} [config] - configuration object.
     * @returns {DynamicsWebApi} The new instance of a DynamicsWebApi
     */
    initializeInstance: (config: any) => DynamicsWebApi;
    utility: {
        /**
         * Searches for a collection name by provided entity name in a cached entity metadata.
         * The returned collection name can be null.
         *
         * @param {string} entityName - entity name
         * @returns {string} a collection name
         */
        getCollectionName: typeof RequestClient.getCollectionName;
    };
}
/**
 * DynamicsWebApi Utility helper class
 * @typicalname dynamicsWebApi.utility
 */
/**
 * Microsoft Dynamics CRM Web API helper library written in JavaScript.
 * It is compatible with: Dynamics 365 (online), Dynamics 365 (on-premise), Dynamics CRM 2016, Dynamics CRM Online.
 * @module dynamics-web-api
 * @typicalname dynamicsWebApi
 */
export declare namespace DynamicsWebApi {
    interface Expand {
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
    interface BaseRequest {
        /**XHR requests only! Indicates whether the requests should be made synchronously or asynchronously.Default value is 'true'(asynchronously). */
        async?: boolean;
        /**Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id. */
        impersonate?: string;
        /** If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'. */
        noCache?: boolean;
        /** Authorization Token. If set, onTokenRefresh will not be called. */
        token?: string;
        /**Sets a number of milliseconds before a request times out. */
        timeout?: number;
    }
    interface Request extends BaseRequest {
        /**The name of the Entity Collection or Entity Logical name. */
        collection: string;
    }
    interface CRUDRequest extends Request {
        /**A String representing collection record's Primary Key (GUID) or Alternate Key(s). */
        key?: string;
    }
    interface CountRequest extends Request {
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter?: string;
    }
    interface CountAllRequest extends CountRequest {
        /**An Array (of strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
    }
    interface FetchAllRequest extends Request {
        /**FetchXML is a proprietary query language that provides capabilities to perform aggregation. */
        fetchXml: string;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie */
        includeAnnotations?: string;
    }
    interface FetchXmlRequest extends FetchAllRequest {
        /**Page number. */
        pageNumber?: number;
        /**Paging cookie. To retrive the first page, pagingCookie must be null. */
        pagingCookie?: string;
    }
    interface CreateRequest extends CRUDRequest {
        /**v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection. */
        duplicateDetection?: boolean;
        /**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
        entity?: any;
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
        includeAnnotations?: string;
        /**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
        navigationProperty?: string;
        /**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
        navigationPropertyKey?: string;
        /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request. */
        returnRepresentation?: boolean;
        /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
        contentId?: string;
    }
    interface UpdateRequestBase extends CRUDRequest {
        /**v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection. */
        duplicateDetection?: boolean;
        /**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
        entity?: any;
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
        /**v.1.4.3 + Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata). */
        metadataAttributeType?: string;
        /**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
        navigationProperty?: string;
        /**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
        navigationPropertyKey?: string;
    }
    interface UpdateRequest extends UpdateRequestBase {
        /**If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false' */
        mergeLabels?: boolean;
    }
    interface UpsertRequest extends UpdateRequestBase {
        /**Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. */
        ifnonematch?: string;
    }
    interface DeleteRequest extends CRUDRequest {
        /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
        ifmatch?: string;
        /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
        contentId?: string;
    }
    interface RetrieveRequest extends CRUDRequest {
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter?: string;
        /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
        ifmatch?: string;
        /**Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. */
        ifnonematch?: string;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
        includeAnnotations?: string;
        /**v.1.4.3 + Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata). */
        metadataAttributeType?: string;
        /**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
        navigationProperty?: string;
        /**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
        navigationPropertyKey?: string;
        /**A String representing the GUID value of the saved query. */
        savedQuery?: string;
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**A String representing the GUID value of the user query. */
        userQuery?: string;
    }
    interface RetrieveMultipleRequest extends Request {
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
    }
    interface AssociateRequest extends Request {
        /**Primary entity record id/key. */
        primaryKey: string;
        /**Relationship name. */
        relationshipName: string;
        /**Related name of the Entity Collection or Entity Logical name. */
        relatedCollection: string;
        /**Related entity record id/key. */
        relatedKey: string;
    }
    interface AssociateSingleValuedRequest extends Request {
        /**Primary entity record id/key. */
        primaryKey: string;
        /**Navigation property name. */
        navigationProperty: string;
        /**Related name of the Entity Collection or Entity Logical name. */
        relatedCollection: string;
        /**Related entity record id/key. */
        relatedKey: string;
    }
    interface DisassociateRequest extends Request {
        /**Primary entity record id/key. */
        primaryKey: string;
        /**Relationship name. */
        relationshipName: string;
        /**Related entity record id/key. */
        relatedKey: string;
    }
    interface DisassociateSingleValuedRequest extends Request {
        /**Primary entity record id/key. */
        primaryKey: string;
        /**Navigation property name. */
        navigationProperty: string;
    }
    interface UnboundFunctionRequest extends BaseRequest {
        /**The name of the function. */
        functionName: string;
        /**Function's input parameters. Example: { param1: "test", param2: 3 }. */
        parameters?: any;
    }
    interface BoundFunctionRequest extends UnboundFunctionRequest, Request {
        /**A String representing the GUID value for the record. */
        id?: string;
    }
    interface UnboundActionRequest extends BaseRequest {
        /**The name of the Web API action. */
        actionName: string;
        /**Action request body. */
        action?: any;
    }
    interface BoundActionRequest extends UnboundActionRequest, Request {
        /**A String representing the GUID value for the record. */
        id?: string;
    }
    interface CreateEntityRequest extends BaseRequest {
        /**An object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
        data: any;
    }
    interface UpdateEntityRequest extends CRUDRequest {
        /**An object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
        data: any;
        /**Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false. */
        mergeLabels?: boolean;
    }
    interface RetrieveEntityRequest extends BaseRequest {
        /**The Entity MetadataId or Alternate Key (such as LogicalName). */
        key: string;
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
    }
    interface RetrieveEntitiesRequest extends BaseRequest {
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter?: string;
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
    }
    interface CreateAttributeRequest extends BaseRequest {
        /**The Entity MetadataId or Alternate Key (such as LogicalName). */
        entityKey: string;
        /**Attribute metadata object. */
        data: any;
    }
    interface UpdateAttributeRequest extends CreateAttributeRequest {
        /**Use this parameter to cast the Attribute to a specific type. */
        castType?: string;
        /**Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false. */
        mergeLabels?: boolean;
    }
    interface RetrieveAttributesRequest extends BaseRequest {
        /**The Entity MetadataId or Alternate Key (such as LogicalName). */
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
    interface RetrieveAttributeRequest extends BaseRequest {
        /**The Attribute MetadataId or Alternate Key (such as LogicalName). */
        attributeKey: string;
        /**The Entity MetadataId or Alternate Key (such as LogicalName). */
        entityKey: string;
        /**Use this parameter to cast the Attribute to a specific type. */
        castType?: string;
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
    }
    interface CreateRelationshipRequest extends BaseRequest {
        /**Relationship Definition. */
        data: any;
    }
    interface UpdateRelationshipRequest extends CreateRelationshipRequest {
        /**Use this parameter to cast the Relationship metadata to a specific type. */
        castType?: string;
        /**Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false. */
        mergeLabels?: boolean;
    }
    interface DeleteRelationshipRequest extends BaseRequest {
        /**The Relationship MetadataId or Alternate Key (such as LogicalName). */
        key: string;
    }
    interface RetrieveRelationshipsRequest extends BaseRequest {
        /**Use this parameter to cast the Relationship metadata to a specific type. */
        castType?: string;
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter?: string;
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
    }
    interface RetrieveRelationshipRequest extends BaseRequest {
        /**The Relationship MetadataId or Alternate Key (such as LogicalName). */
        key: string;
        /**Use this parameter to cast the Relationship metadata to a specific type. */
        castType?: string;
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
    }
    interface CreateGlobalOptionSetRequest extends BaseRequest {
        /**Global Option Set Definition. */
        data: any;
    }
    interface UpdateGlobalOptionSetRequest extends CreateRelationshipRequest {
        /**Use this parameter to cast the Global Option Set metadata to a specific type. */
        castType?: string;
        /**Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false. */
        mergeLabels?: boolean;
    }
    interface DeleteGlobalOptionSetRequest extends BaseRequest {
        /**The Global Option Set MetadataId or Alternate Key (such as LogicalName). */
        key: string;
    }
    interface RetrieveGlobalOptionSetsRequest extends BaseRequest {
        /**Use this parameter to cast the Global Option Set metadata to a specific type. */
        castType?: string;
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter?: string;
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
    }
    interface RetrieveGlobalOptionSetRequest extends BaseRequest {
        /**The Global Option Set MetadataId or Alternate Key (such as LogicalName). */
        key: string;
        /**Use this parameter to cast the Global Option Set metadata to a specific type. */
        castType?: string;
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
    }
    interface Config {
        /**A String representing the GUID value for the Dynamics 365 system user id.Impersonates the user. */
        webApiUrl?: string;
        /**The version of Web API to use, for example: "8.1" */
        webApiVersion?: string;
        /**A String representing a URL to Web API(webApiVersion not required if webApiUrl specified)[not used inside of CRM] */
        impersonate?: string;
        /**A function that is called when a security token needs to be refreshed. */
        onTokenRefresh?: (callback: OnTokenAcquiredCallback) => void;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types.*/
        includeAnnotations?: string;
        /**Sets the odata.maxpagesize preference value to request the number of entities returned in the response. */
        maxPageSize?: number;
        /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request.*/
        returnRepresentation?: boolean;
        /**Indicates whether to use Entity Logical Names instead of Collection Logical Names.*/
        useEntityNames?: boolean;
        /**Sets a number of milliseconds before a request times out */
        timeout?: number;
    }
    /** Callback with an acquired token called by DynamicsWebApi; "token" argument can be a string or an object with a property {accessToken: <token>}  */
    interface OnTokenAcquiredCallback {
        (token: any): void;
    }
    interface Utility {
        /**
         * Searches for a collection name by provided entity name in a cached entity metadata.
         * The returned collection name can be null.
         * @param entityName - entity name
         */
        getCollectionName(entityName: string): string;
    }
    interface RequestError extends Error {
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
    interface MultipleResponse<T = any> {
        /**Multiple respone entities */
        value?: T[];
    }
    interface AllResponse<T> extends MultipleResponse<T> {
        /**@odata.deltaLink value */
        oDataDeltaLink?: string;
    }
    interface RetrieveMultipleResponse<T> extends MultipleResponse<T> {
        /**@odata.nextLink value */
        oDataNextLink?: string;
        /**@odata.deltaLink value */
        oDataDeltaLink?: string;
    }
    interface FetchXmlResponse<T> extends MultipleResponse<T> {
        /**Paging information */
        PagingInfo?: {
            /**Number of the next page */
            nextPage?: number;
            /**Next page cookie */
            cookie?: string;
        };
    }
}
//# sourceMappingURL=dynamics-web-api.d.ts.map