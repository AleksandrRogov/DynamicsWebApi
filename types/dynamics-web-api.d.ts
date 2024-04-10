﻿// Type definitions for dynamics-web-api v1.7.12
// Project: https://github.com/AleksandrRogov/DynamicsWebApi/
// Definitions by: Aleksandr Rogov https://github.com/AleksandrRogov/

declare class DynamicsWebApi {
    /**
     * DynamicsWebApi constructor
     * @param config - DynamicsWebApi configuration
     */
    constructor(config?: DynamicsWebApi.Config);
    /**
	 * Sets DynamicsWebApi configuration parameters.
	 *
	 * @param config - configuration object
	 * @example
		dynamicsWebApi.setConfig({ webApiVersion: '9.1' });
	 */
    setConfig(config: DynamicsWebApi.Config): void;
    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param request - An object that represents all possible options for a current request.
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
     *}.catch(function (error) {
     *});
     */
    createRequest<T = any>(request: DynamicsWebApi.CreateRequest<T>): Promise<T>;
    /**
     * Sends an asynchronous request to create a new record.
     * @deprecated Please use "createRequest". It will be easier to fix breaking changes once v2 is realeased.
     *
     * @param object - A JavaScript object valid for create operations.
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param prefer - Sets a Prefer header value. For example: ['retrun=representation', 'odata.include-annotations="*"'].
     * @param select - An Array representing the $select Query Option to control which attributes will be returned.
     * @example
     *var lead = {
     *    subject: "Test WebAPI",
     *    firstname: "Test",
     *    lastname: "WebAPI",
     *    jobtitle: "Title"
     *};
     *
     *dynamicsWebApi.create(lead, "leads").then(function (id) {
     *}.catch(function (error) {
     *});
     */
    create<T = any>(object: T, collection: string, prefer?: string | string[], select?: string[]): Promise<T>;
    /**
     * Sends an asynchronous request to update a record.
     *
     * @param request - An object that represents all possible options for a current request.
     */
    updateRequest<T = any>(request: DynamicsWebApi.UpdateRequest<T>): Promise<T>;
    /**
     * Sends an asynchronous request to update a record.
     * @deprecated Please use "updateRequest". It will be easier to fix breaking changes once v2 is realeased.
     *
     * @param key - A String representing the GUID value or Alternate Key(s) for the record to update.
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param object - A JavaScript object valid for update operations.
     * @param prefer - If set to "return=representation" the function will return an updated object
     * @param select - An Array representing the $select Query Option to control which attributes will be returned.
     */
    update<T = any>(key: string, collection: string, object: T, prefer?: string | string[], select?: string[]): Promise<T>;
    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param key - A String representing the GUID value or Alternate Key(s) for the record to update.
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param keyValuePair - keyValuePair object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"}
     * @param prefer - If set to "return=representation" the function will return an updated object
     * @param select - An Array representing the $select Query Option to control which attributes will be returned.
     */
    updateSingleProperty<T = any>(
        key: string,
        collection: string,
        keyValuePair: { [key: string]: any },
        prefer?: string | string[],
        select?: string[]
    ): Promise<T>;
    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param request - An object that represents all possible options for a current request.
     */
    deleteRequest(request: DynamicsWebApi.DeleteRequest): Promise<any>;
    /**
     * Sends an asynchronous request to delete a record.
     * @deprecated Please use "deleteRequest". It will be easier to fix breaking changes once v2 is realeased.
     *
     * @param key - A String representing the GUID value or Alternate Key(s) for the record to delete.
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param propertyName - The name of the property which needs to be emptied. Instead of removing a whole record only the specified property will be cleared.
     */
    deleteRecord(key: string, collection: string, propertyName?: string): Promise<any>;
    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param request - An object that represents all possible options for a current request.
     */
    retrieveRequest<T = any>(request: DynamicsWebApi.RetrieveRequest): Promise<T>;
    /**
     * Sends an asynchronous request to retrieve a record.
     * @deprecated Please use "retrieveRequest". It will be easier to fix breaking changes once v2 is realeased.
     *
     * @param key - A String representing the GUID value or Alternate Key(s) for the record to retrieve.
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param select - An Array representing the $select Query Option to control which attributes will be returned.
     * @param expand - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     */
    retrieve<T = any>(key: string, collection: string, select?: string[], expand?: DynamicsWebApi.Expand[]): Promise<T>;
    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param request - An object that represents all possible options for a current request.
     */
    upsertRequest<T = any>(request: DynamicsWebApi.UpsertRequest<T>): Promise<T>;
    /**
     * Sends an asynchronous request to upsert a record.
     * @deprecated Please use "upsertRequest". It will be easier to fix breaking changes once v2 is realeased.
     *
     * @param key - A String representing the GUID value or Alternate Key(s) for the record to upsert.
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param object - A JavaScript object valid for update operations.
     * @param prefer - If set to "return=representation" the function will return an updated object
     * @param select - An Array representing the $select Query Option to control which attributes will be returned.
     */
    upsert<T = any>(key: string, collection: string, object: T, prefer?: string | string[], select?: string[]): Promise<T>;
    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param filter - Use the $filter system query option to set criteria for which entities will be returned.
     */
    count(collection: string, filter?: string): Promise<number>;
    /**
     * Sends an asynchronous request to count records. Returns: Number
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param filter - Use the $filter system query option to set criteria for which entities will be returned.
     * @param select - An Array representing the $select Query Option to control which attributes will be returned.
     */
    countAll(collection: string, filter?: string, select?: string[]): Promise<number>;
    /**
     * Sends an asynchronous request to retrieve records.
     * @deprecated Please use "retrieveMultipleRequest". It will be easier to fix breaking changes once v2 is realeased.
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param select - Use the $select system query option to limit the properties returned.
     * @param filter - Use the $filter system query option to set criteria for which entities will be returned.
     * @param oDataLink - Use this parameter to pass @odata.nextLink or @odata.deltaLink to return a necessary response. Pass null to retrieveMultipleOptions.
     */
    retrieveMultiple<T = any>(collection: string, select?: string[], filter?: string, oDataLink?: string): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>>;
    /**
     * Sends an asynchronous request to retrieve all records.
     * @deprecated Please use "retrieveAllRequest". It will be easier to fix breaking changes once v2 is realeased.
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param select - Use the $select system query option to limit the properties returned.
     * @param filter - Use the $filter system query option to set criteria for which entities will be returned.
     */
    retrieveAll<T = any>(collection: string, select?: string[], filter?: string): Promise<DynamicsWebApi.AllResponse<T>>;
    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param request - An object that represents all possible options for a current request.
     * @param oDataLink - Use this parameter to pass @odata.nextLink or @odata.deltaLink to return a necessary response. Pass null to retrieveMultipleOptions
     */
    retrieveMultipleRequest<T = any>(request: DynamicsWebApi.RetrieveMultipleRequest, oDataLink?: string): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>>;
    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param request - An object that represents all possible options for a current request.
     */
    retrieveAllRequest<T = any>(request: DynamicsWebApi.RetrieveMultipleRequest): Promise<DynamicsWebApi.AllResponse<T>>;
    /**
     * Sends an asynchronous request to count records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param includeAnnotations - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param pageNumber - Page number.
     * @param pagingCookie - Paging cookie. For retrieving the first page, pagingCookie should be null.
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    executeFetchXml<T = any>(
        collection: string,
        fetchXml: string,
        includeAnnotations?: string,
        pageNumber?: number,
        pagingCookie?: string,
        impersonateUserId?: string
    ): Promise<DynamicsWebApi.FetchXmlResponse<T>>;
    /**
     * Sends an asynchronous request to count records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param includeAnnotations - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param pageNumber - Page number.
     * @param pagingCookie - Paging cookie. For retrieving the first page, pagingCookie should be null.
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    fetch<T = any>(
        collection: string,
        fetchXml: string,
        includeAnnotations?: string,
        pageNumber?: number,
        pagingCookie?: string,
        impersonateUserId?: string
    ): Promise<DynamicsWebApi.FetchXmlResponse<T>>;
    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param includeAnnotations - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    executeFetchXmlAll<T = any>(
        collection: string,
        fetchXml: string,
        includeAnnotations?: string,
        impersonateUserId?: string
    ): Promise<DynamicsWebApi.MultipleResponse<T>>;
    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param includeAnnotations - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    fetchAll<T = any>(
        collection: string,
        fetchXml: string,
        includeAnnotations?: string,
        impersonateUserId?: string
    ): Promise<DynamicsWebApi.MultipleResponse<T>>;
    /**
     * Uploads a file to a file attribute
     * @param request - An object that represents all possible options for a current request.
     */
    uploadFile(request: DynamicsWebApi.UploadRequest): Promise<void>;
    /**
     * Downloads a file from a file attribute
     * @param request - An object that represents all possible options for a current request.
     */
    downloadFile(request: DynamicsWebApi.DownloadRequest): Promise<DynamicsWebApi.DownloadResponse>;
    /**
     * Associate for a collection-valued navigation property. (1:N or N:N)
     *
     * @param collection - Primary Entity Collection name or Entity Name.
     * @param primaryKey - Primary entity record id.
     * @param relationshipName - Relationship name.
     * @param relatedCollection - Related Entity Collection name or Entity Name.
     * @param relatedKey - Related entity record id.
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    associate(
        collection: string,
        primaryKey: string,
        relationshipName: string,
        relatedCollection: string,
        relatedKey: string,
        impersonateUserId?: string
    ): Promise<any>;
    /**
     * Disassociate for a collection-valued navigation property.
     *
     * @param collection - Primary Entity Collection name or Entity Name.
     * @param primaryKey - Primary entity record id.
     * @param relationshipName - Relationship name.
     * @param relatedKey - Related entity record id.
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    disassociate(collection: string, primaryKey: string, relationshipName: string, relatedKey: string, impersonateUserId?: string): Promise<any>;
    /**
     * Associate for a single-valued navigation property. (1:N)
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param key - Entity record Id that contains an attribute.
     * @param singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param relatedCollection - Related collection name that the lookup (attribute) points to.
     * @param relatedKey - Related entity record id that needs to be associated.
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    associateSingleValued(
        collection: string,
        key: string,
        singleValuedNavigationPropertyName: string,
        relatedCollection: string,
        relatedKey: string,
        impersonateUserId?: string
    ): Promise<any>;
    /**
     * Removes a reference to an entity for a single-valued navigation property. (1:N)
     *
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param key - Entity record Id that contains an attribute.
     * @param singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    disassociateSingleValued(collection: string, key: string, singleValuedNavigationPropertyName: string, impersonateUserId?: string): Promise<any>;
    /**
     * Executes an unbound function (not bound to a particular entity record)
     *
     * @param functionName - The name of the function.
     * @param parameters - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    executeUnboundFunction<T = any>(functionName: string, parameters?: Object, impersonateUserId?: string): Promise<T>;
    /**
     * Executes a bound function
     *
     * @param id - A String representing the GUID value for the record.
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param functionName - The name of the function.
     * @param parameters - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    executeBoundFunction<T = any>(id: string, collection: string, functionName: string, parameters?: Object, impersonateUserId?: string): Promise<T>;
    /**
     * Executes an unbound Web API action (not bound to a particular entity record)
     *
     * @param actionName - The name of the Web API action.
     * @param requestObject - Action request body object.
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    executeUnboundAction<T = any>(actionName: string, requestObject?: Object, impersonateUserId?: string): Promise<T>;
    /**
     * Executes a bound Web API action (bound to a particular entity record)
     *
     * @param id - A String representing the GUID value for the record (pass "null" for an optional parameter)
     * @param collection - The name of the Entity Collection or Entity Logical name.
     * @param actionName - The name of the Web API action.
     * @param requestObject - Action request body object.
     * @param impersonateUserId - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     */
    executeBoundAction<T = any>(id: string, collection: string, actionName: string, requestObject?: Object, impersonateUserId?: string): Promise<T>;
    /**
     * Sends an asynchronous request to create an entity definition.
     *
     * @param entityDefinition - Entity Definition.
     */
    createEntity<T = any>(entityDefinition: Object): Promise<T>;
    /**
     * Sends an asynchronous request to update an entity definition.
     *
     * @param entityDefinition - Entity Definition.
     * @param mergeLabels - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     */
    updateEntity<T = any>(entityDefinition: Object, mergeLabels?: boolean): Promise<T>;
    /**
     * Sends an asynchronous request to retrieve a specific entity definition.
     *
     * @param entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param select - Use the $select system query option to limit the properties returned.
     * @param expand - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     */
    retrieveEntity<T = any>(entityKey: string, select?: string[], expand?: DynamicsWebApi.Expand[]): Promise<T>;
    /**
     * Sends an asynchronous request to retrieve entity definitions.
     *
     * @param select - Use the $select system query option to limit the properties returned.
     * @param filter - Use the $filter system query option to set criteria for which entity definitions will be returned.
     */
    retrieveEntities<T = any>(select?: string[], filter?: string): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>>;
    /**
     * Sends an asynchronous request to create an attribute.
     *
     * @param entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param attributeDefinition - Object that describes the attribute.
     */
    createAttribute<T = any>(entityKey: string, attributeDefinition: Object): Promise<T>;
    /**
     * Sends an asynchronous request to update an attribute.
     *
     * @param entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param attributeDefinition - Object that describes the attribute.
     * @param attributeType - Use this parameter to cast the Attribute to a specific type.
     * @param mergeLabels - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     */
    updateAttribute<T = any>(entityKey: string, attributeDefinition: Object, attributeType?: string, mergeLabels?: boolean): Promise<T>;
    /**
     * Sends an asynchronous request to retrieve attribute metadata for a specified entity definition.
     *
     * @param entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param attributeType - Use this parameter to cast the Attributes to a specific type.
     * @param select - Use the $select system query option to limit the properties returned.
     * @param filter - Use the $filter system query option to set criteria for which attribute definitions will be returned.
     * @param expand - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     */
    retrieveAttributes<T = any>(
        entityKey: string,
        attributeType?: string,
        select?: string[],
        filter?: string,
        expand?: DynamicsWebApi.Expand[]
    ): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>>;
    /**
     * Sends an asynchronous request to retrieve a specific attribute metadata for a specified entity definition.
     *
     * @param entityKey - The Entity MetadataId or Alternate Key (such as LogicalName).
     * @param attributeKey - The Attribute Metadata id.
     * @param attributeType - Use this parameter to cast the Attribute to a specific type.
     * @param select - Use the $select system query option to limit the properties returned.
     * @param expand - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     */
    retrieveAttribute<T = any>(
        entityKey: string,
        attributeKey: string,
        attributeType?: string,
        select?: string[],
        expand?: DynamicsWebApi.Expand[]
    ): Promise<T>;
    /**
     * Sends an asynchronous request to create a relationship definition.
     *
     * @param relationshipDefinition - Relationship Definition.
     */
    createRelationship<T = any>(relationshipDefinition: Object): Promise<T>;
    /**
     * Sends an asynchronous request to update a relationship definition.
     *
     * @param relationshipDefinition - Relationship Definition.
     * @param relationshipType - Use this parameter to cast the Relationship to a specific type.
     * @param mergeLabels - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     */
    updateRelationship<T = any>(relationshipDefinition: Object, relationshipType?: string, mergeLabels?: boolean): Promise<T>;
    /**
     * Sends an asynchronous request to delete a relationship definition.
     *
     * @param metadataId - A String representing the GUID value.
     */
    deleteRelationship(metadataId: string): Promise<any>;
    /**
     * Sends an asynchronous request to retrieve relationship definitions.
     *
     * @param relationshipType - Use this parameter to cast a Relationship to a specific type: 1:M or M:M.
     * @param select - Use the $select system query option to limit the properties returned.
     * @param filter - Use the $filter system query option to set criteria for which relationships will be returned.
     */
    retrieveRelationships<T = any>(relationshipType?: string, select?: string[], filter?: string): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>>;
    /**
     * Sends an asynchronous request to retrieve a specific relationship definition.
     *
     * @param metadataId - String representing the Metadata Id GUID.
     * @param relationshipType - Use this parameter to cast a Relationship to a specific type: 1:M or M:M.
     * @param select - Use the $select system query option to limit the properties returned.
     */
    retrieveRelationship<T = any>(metadataId: string, relationshipType?: string, select?: string[]): Promise<T>;
    /**
     * Sends an asynchronous request to create a Global Option Set definition
     *
     * @param globalOptionSetDefinition - Global Option Set Definition.
     */
    createGlobalOptionSet<T = any>(globalOptionSetDefinition: Object): Promise<T>;
    /**
     * Sends an asynchronous request to update a Global Option Set.
     *
     * @param globalOptionSetDefinition - Global Option Set Definition.
     * @param mergeLabels - Sets MSCRM.MergeLabels header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is false.
     */
    updateGlobalOptionSet<T = any>(globalOptionSetDefinition: Object, mergeLabels?: boolean): Promise<T>;
    /**
     * Sends an asynchronous request to delete a Global Option Set.
     *
     * @param globalOptionSetKey - A String representing the GUID value or Alternate Key (such as Name).
     */
    deleteGlobalOptionSet(globalOptionSetKey: string): Promise<any>;
    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     *
     * @param globalOptionSetKey - The Global Option Set MetadataID or Alternate Key (such as Name).
     * @param castType - Use this parameter to cast a Global Option Set to a specific type.
     * @param select - Use the $select system query option to limit the properties returned
     */
    retrieveGlobalOptionSet<T = any>(globalOptionSetKey: string, castType?: string, select?: string[]): Promise<T>;
    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     *
     * @param castType - Use this parameter to cast a Global Option Set to a specific type.
     * @param select - Use the $select system query option to limit the properties returned
     */
    retrieveGlobalOptionSets<T = any>(castType?: string, select?: string[]): Promise<DynamicsWebApi.RetrieveMultipleResponse<T>>;
    /**
     * Starts a batch request.
     *
     */
    startBatch(): void;
    /**
     * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
     */
    executeBatch(request?: DynamicsWebApi.BatchRequest): Promise<any[]>;
    /**
     * Creates a new instance of DynamicsWebApi
     *
     * @param config - configuration object.
     */
    initializeInstance(config?: DynamicsWebApi.Config): DynamicsWebApi;
    /**
     * Utility functions
     * @deprecated please use dynamicsWebApi.Utility instead
     */
    utility: DynamicsWebApi.Utility;
    /**
     * Utility functions
     */
    Utility: DynamicsWebApi.Utility;
}

declare namespace DynamicsWebApi {
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

    interface RequestBase {
        /**XHR requests only! Indicates whether the requests should be made synchronously or asynchronously.Default value is 'true'(asynchronously). */
        async?: boolean;
        /**Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id. */
        impersonate?: string;
        /**Impersonates the user.A String representing the GUID value for the Azure active directory object id. */
        impersonateAAD?: string;
        /**If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'. */
        noCache?: boolean;
        /**Authorization Token. If set, onTokenRefresh will not be called. */
        token?: string;
        /**Sets a number of milliseconds before a request times out. */
        timeout?: number;
    }

    interface BatchRequest extends RequestBase{
        //Sets Prefer header to "odata.continue-on-error" that allows more requests be processed when errors occur. The batch request will return '200 OK' and individual response errors will be returned in the batch response body.
        continueOnError?: boolean;
    }

    interface Request extends RequestBase {
        /**The name of the Entity Collection or Entity Logical name. */
        collection?: string;
        /**Skips the collection name check in DynamicsWebApi */
        skipNameCheck?: boolean;
    }

    interface CRUDRequest extends Request {
        /**@deprecated Use "key" instead. A String representing the Primary Key(GUID) of the record. */
        id?: string;
        /**A String representing collection record's Primary Key (GUID) or Alternate Key(s). */
        key?: string;
    }

    interface CreateRequest<T = any> extends CRUDRequest {
        /**v.1.7.5+ If set to true, the request bypasses custom business logic, all synchronous plug-ins and real-time workflows are disabled. Check for special exceptions in Microsft Docs. */
        bypassCustomPluginExecution?: boolean;
        /**v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection. */
        duplicateDetection?: boolean;
        /**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
        data?: T;
        /**@deprecated use "data" instead */
        entity?: T;
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
        includeAnnotations?: string;
        /**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
        navigationProperty?: string;
        /**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
        navigationPropertyKey?: string;
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select?: string[];
        /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request. */
        returnRepresentation?: boolean;
        /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
        contentId?: string;
        /**v.1.7.7+ A unique partition key value of a logical partition for non-relational custom entity data stored in NoSql tables of Azure heterogenous storage. */
        partitionId?: string;
    }

    interface UpdateRequestBase<T = any> extends CRUDRequest {
        /**v.1.7.5+ If set to true, the request bypasses custom business logic, all synchronous plug-ins and real-time workflows are disabled. Check for special exceptions in Microsft Docs. */
        bypassCustomPluginExecution?: boolean;
        /**v.1.3.4+ Web API v9+ only! Boolean that enables duplicate detection. */
        duplicateDetection?: boolean;
        /**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
        data?: T;
        /**@deprecated use "data" instead */
        entity?: T;
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
        /**A String representing the name of a single - valued navigation property. Useful when needed to retrieve information about a related record in a single request. */
        navigationProperty?: string;
        /**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
        navigationPropertyKey?: string;
        /**v.1.7.7+ A unique partition key value of a logical partition for non-relational custom entity data stored in NoSql tables of Azure heterogenous storage. */
        partitionId?: string;
    }

    interface UpdateRequest<T = any> extends UpdateRequestBase<T> {
        /**If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'. Default value is 'false' */
        mergeLabels?: boolean;
    }

    interface UpsertRequest<T = any> extends UpdateRequestBase<T> {
        /**Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. */
        ifnonematch?: string;
    }

    interface DeleteRequest extends CRUDRequest {
        /**v.1.7.5+ If set to true, the request bypasses custom business logic, all synchronous plug-ins and real-time workflows are disabled. Check for special exceptions in Microsft Docs. */
        bypassCustomPluginExecution?: boolean;
        /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
        ifmatch?: string;
        /**BATCH REQUESTS ONLY! Sets Content-ID header or references request in a Change Set. */
        contentId?: string;
        /**Field name that needs to be cleared (for example File Field) */
        fieldName?: string;
        /**v.1.7.7+ A unique partition key value of a logical partition for non-relational custom entity data stored in NoSql tables of Azure heterogenous storage. */
        partitionId?: string;
    }

    interface RetrieveRequest extends CRUDRequest {
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand?: Expand[];
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
        /**v.1.7.7+ A unique partition key value of a logical partition for non-relational custom entity data stored in NoSql tables of Azure heterogenous storage. */
        partitionId?: string;
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
        /**v.1.7.7+ A unique partition key value of a logical partition for non-relational custom entity data stored in NoSql tables of Azure heterogenous storage. */
        partitionId?: string;
        /**v.1.7.7+ Additional query parameters that either have not been implemented yet or they are parameter aliases for "$filter" and "$orderBy". Important! These parameters ARE NOT URI encoded! */
        queryParams?: string[];
    }

    interface UploadRequest extends CRUDRequest {
        /**Binary Buffer*/
        data: Uint8Array | Buffer;
        /**Name of the file */
        fileName: string;
        /**File Field Name */
        fieldName: string;
    }

    interface DownloadRequest extends CRUDRequest {
        /**File Field Name */
        fieldName: string;
    }

    interface ProxyConfig {
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

    interface Config {
        /**The url to Dataverse API server, for example: https://contoso.api.crm.dynamics.com/. It is required when used in Node.js application. */
        serverUrl?: string;
        /**@deprecated use serverUrl together with dataApi (if required) instead */
        webApiUrl?: string;
        /**@deprecated use dataApi.version instead */
        webApiVersion?: string;
        /**A String representing a GUID value for the Dynamics 365 system user id */
        impersonate?: string;
        /**Impersonates the user.A String representing the GUID value for the Azure active directory object id. */
        impersonateAAD?: string;
        /**A function that is called when a security token needs to be refreshed. */
        onTokenRefresh?: (callback: OnTokenAcquiredCallback) => void;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types.*/
        includeAnnotations?: string;
        /**Sets the odata.maxpagesize preference value to request the number of entities returned in the response. */
        maxPageSize?: string;
        /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request.*/
        returnRepresentation?: boolean;
        /**Indicates whether to use Entity Logical Names instead of Collection Logical Names.*/
        useEntityNames?: boolean;
        /**Sets a number of milliseconds before a request times out */
        timeout?: number;
        /**Proxy configuration */
        proxy?: ProxyConfig;
        /**Configuration object for Dataverse Web API. The name is based on the url path "data". */
        dataApi?: ApiConfig;
    }

    interface ApiConfig {
        /**Optional. A path to API, for example: "data". */
        path?: string;
        /**Optional. API Version, for example: "9.0" or "9.2". */
        version?: string;
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
        value: T[];
        oDataCount?: number;
        oDataContext?: string;
    }

    interface AllResponse<T> extends MultipleResponse<T> {
        /**@odata.deltaLink value */
        oDataDeltaLink?: string;
    }

    interface RetrieveMultipleResponse<T> extends MultipleResponse<T> {
        "@Microsoft.Dynamics.CRM.totalrecordcount"?: number;
        "@Microsoft.Dynamics.CRM.totalrecordcountlimitexceeded"?: boolean;
        /**@odata.nextLink value */
        oDataNextLink?: string;
        /**@odata.deltaLink value */
        oDataDeltaLink?: string;
    }

    interface FetchXmlResponse<T> extends MultipleResponse<T> {
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

    interface DownloadResponse {
        /**The name of the file */
        fileName: string;
        /**File size */
        fileSize: number;
        /**File Data */
        data: Uint8Array | Buffer;
    }
}

declare module "dynamics-web-api" {
    export = DynamicsWebApi;
}
