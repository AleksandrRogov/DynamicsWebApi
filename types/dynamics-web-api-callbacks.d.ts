declare namespace DynamicsWebApiNamespace {
    interface Expand {
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select: string[];
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter: string;
        /**Limit the number of results returned by using the $top system query option.Do not use $top with $count! */
        top: number
        /**An Array(of Strings) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied. */
        orderBy: string[]
        /**A name of a single-valued navigation property which needs to be expanded. */
        property: string
    }
    interface Request {
        /**XHR requests only! Indicates whether the requests should be made synchronously or asynchronously.Default value is 'true'(asynchronously). */
        async: boolean;
        /**The name of the Entity Collection or Entity Logical name. */
        collection: string;
        /**A String representing the Primary Key(GUID) of the record. */
        id: string;
        /**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
        select: string[];
        /**An array of Expand Objects(described below the table) representing the $expand OData System Query Option value to control which related records are also returned. */
        expand: Expand[];
        /**A String representing collection record's Primary Key (GUID) or Alternate Key(s). */
        key: string;
        /**Use the $filter system query option to set criteria for which entities will be returned. */
        filter: string;
        /**Sets the odata.maxpagesize preference value to request the number of entities returned in the response. */
        maxPageSize: number;
        /**Boolean that sets the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000(per page).Do not use $top with $count! */
        count: boolean;
        /**Limit the number of results returned by using the $top system query option.Do not use $top with $count! */
        top: number;
        /**An Array(of Strings) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied. */
        orderBy: string[];
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types. */
        includeAnnotations: string;
        /**Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests.*/
        ifmatch: string;
        /**Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. */
        ifnonematch: string;
        /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request. */
        returnRepresentation: boolean;
        /**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single - valued navigation properties). */
        entity: any;
        /**Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id. */
        impersonate: string;
        /**A String representing the name of a single - valued navigation property.Useful when needed to retrieve information about a related record in a single request. */
        navigationProperty: string;
        /**v.1.4.3 + A String representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata). */
        navigationPropertyKey: string;
        /**v.1.4.3 + Casts the AttributeMetadata to a specific type. (Used in requests to Attribute Metadata). */
        metadataAttributeType: string;
        /** If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'. */
        noCache: boolean;
        /**A String representing the GUID value of the saved query. */
        savedQuery: string;
        /**A String representing the GUID value of the user query. */
        userQuery: string;
        /**If set to 'true', DynamicsWebApi adds a request header 'MSCRM.MergeLabels: true'.Default value is 'false' */
        mergeLabels: boolean;
        /**If set to 'true', DynamicsWebApi treats a request as a part of a batch request. Call ExecuteBatch to execute all requests in a batch. Default value is 'false'. */
        isBatch: boolean;
    }
    interface Config {
        /**A String representing the GUID value for the Dynamics 365 system user id.Impersonates the user. */
        webApiUrl: string;
        /**The version of Web API to use, for example: "8.1" */
        webApiVersion: string;
        /**A String representing a URL to Web API(webApiVersion not required if webApiUrl specified)[not used inside of CRM] */
        impersonate: string;
        /**A function that is called when a security token needs to be refreshed. */
        onTokenRefresh: Function;
        /**Sets Prefer header with value "odata.include-annotations=" and the specified annotation.Annotations provide additional information about lookups, options sets and other complex attribute types.*/
        includeAnnotations: string;
        /**Sets the odata.maxpagesize preference value to request the number of entities returned in the response. */
        maxPageSize: string;
        /**Sets Prefer header request with value "return=representation".Use this property to return just created or updated entity in a single request.*/
        returnRepresentation: boolean;
        /**Indicates whether to use Entity Logical Names instead of Collection Logical Names.*/
        useEntityNames: boolean;
    }
    interface Utility {
        /**
         * Searches for a collection name by provided entity name in a cached entity metadata.
         * The returned collection name can be null.
         * @param entityName - entity name
         */
        getCollectionName(entityName: string): string;
    }
}

interface DynamicsWebApi {
    setConfig(config: DynamicsWebApiNamespace.Config);
    createRequest(request: DynamicsWebApiNamespace.Request, successCallback: Function, errorCallback: Function);
    create(object: Object, collection: string, successCallback: Function, errorCallback: Function, prefer?: string | string[], select?: string[]);
    updateRequest(request: DynamicsWebApiNamespace.Request, successCallback: Function, errorCallback: Function);
    update(key: string, collection: string, object: Object, successCallback: Function, errorCallback: Function, prefer?: string | string[], select?: string[]);
    updateSingleProperty(key: string, collection: string, keyValuePair: Object, successCallback: Function, errorCallback: Function, prefer?: string | string[], select?: string[]);
    deleteRequest(request: DynamicsWebApiNamespace.Request, successCallback: Function, errorCallback: Function);
    deleteRecord(key: string, collection: string, successCallback: Function, errorCallback: Function, propertyName?: string);
    retrieveRequest(request: DynamicsWebApiNamespace.Request, successCallback: Function, errorCallback: Function);
    retrieve(key: string, collection: string, successCallback: Function, errorCallback: Function, select?: string[], expand?: DynamicsWebApiNamespace.Expand[]);
    upsertRequest(request: DynamicsWebApiNamespace.Request, successCallback: Function, errorCallback: Function);
    upsert(key: string, collection: string, object: Object, successCallback: Function, errorCallback: Function, prefer?: string | string[], select?: string[]);
    count(collection: string, successCallback: Function, errorCallback: Function, filter?: string);
    countAll(collection: string, successCallback: Function, errorCallback: Function, filter?: string, select?: string[]);
    retrieveMultiple(collection: string, successCallback: Function, errorCallback: Function, select?: string[], filter?: string, nextPageLink?: string);
    retrieveAll(collection: string, successCallback: Function, errorCallback: Function, select?: string[], filter?: string);
    retrieveMultipleRequest(request: DynamicsWebApiNamespace.Request, successCallback: Function, errorCallback: Function);
    retrieveAllRequest(request: DynamicsWebApiNamespace.Request, successCallback: Function, errorCallback: Function);
    executeFetchXml(collection: string, fetchXml: string, successCallback: Function, errorCallback: Function, includeAnnotations?: string, pageNumber?: number, pagingCookie?: string, impersonateUserId?: string);
    fetch(collection: string, fetchXml: string, successCallback: Function, errorCallback: Function, includeAnnotations?: string, pageNumber?: number, pagingCookie?: string, impersonateUserId?: string);
    executeFetchXmlAll(collection: string, fetchXml: string, successCallback: Function, errorCallback: Function, includeAnnotations?: string, impersonateUserId?: string);
    fetchAll(collection: string, fetchXml: string, successCallback: Function, errorCallback: Function, includeAnnotations?: string, impersonateUserId?: string);
    associate(collection: string, primaryKey: string, relationshipName: string, relatedCollection: string, relatedKey: string, successCallback: Function, errorCallback: Function, impersonateUserId?: string);
    disassociate(collection: string, primaryKey: string, relationshipName: string, relatedKey: string, successCallback: Function, errorCallback: Function, impersonateUserId?: string);
    associateSingleValued(collection: string, key: string, singleValuedNavigationPropertyName: string, relatedCollection: string, relatedKey: string, successCallback: Function, errorCallback: Function, impersonateUserId?: string);
    disassociateSingleValued(collection: string, key: string, singleValuedNavigationPropertyName: string, successCallback: Function, errorCallback: Function, impersonateUserId?: string);
    executeUnboundFunction(functionName: string, successCallback: Function, errorCallback: Function, parameters?: Object, impersonateUserId?: string);
    executeBoundFunction(id: string, collection: string, functionName: string, successCallback: Function, errorCallback: Function, parameters?: Object, impersonateUserId?: string);
    executeUnboundAction(actionName: string, requestObject: Object, successCallback: Function, errorCallback: Function, impersonateUserId?: string);
    executeBoundAction(id: string, collection: string, actionName: string, requestObject: Object, successCallback: Function, errorCallback: Function, impersonateUserId?: string);
    createEntity(entityDefinition: Object, successCallback: Function, errorCallback: Function);
    updateEntity(entityDefinition: Object, successCallback: Function, errorCallback: Function, mergeLabels?: boolean);
    retrieveEntity(entityKey: string, successCallback: Function, errorCallback: Function, select?: string[], expand?: DynamicsWebApiNamespace.Expand[]);
    retrieveEntities(successCallback: Function, errorCallback: Function, select?: string[], filter?: string);
    createAttribute(entityKey: string, attributeDefinition: Object, successCallback: Function, errorCallback: Function);
    updateAttribute(entityKey: string, attributeDefinition: Object, successCallback: Function, errorCallback: Function, attributeType?: string, mergeLabels?: boolean);
    retrieveAttributes(entityKey: string, successCallback: Function, errorCallback: Function, attributeType?: string, select?: string[], filter?: string, expand?: DynamicsWebApiNamespace.Expand[]);
    retrieveAttribute(entityKey: string, attributeKey: string, successCallback: Function, errorCallback: Function, attributeType?: string, select?: string[], expand?: DynamicsWebApiNamespace.Expand[]);
    createRelationship(relationshipDefinition: Object, successCallback: Function, errorCallback: Function);
    updateRelationship(relationshipDefinition: Object, successCallback: Function, errorCallback: Function, relationshipType?: string, mergeLabels?: boolean);
    deleteRelationship(metadataId: string, successCallback: Function, errorCallback: Function);
    retrieveRelationships(successCallback: Function, errorCallback: Function, relationshipType?: string, select?: string[], filter?: string);
    retrieveRelationship(metadataId: string, successCallback: Function, errorCallback: Function, relationshipType?: string, select?: string[]);
    createGlobalOptionSet(globalOptionSetDefinition: Object, successCallback: Function, errorCallback: Function);
    updateGlobalOptionSet(globalOptionSetDefinition: Object, successCallback: Function, errorCallback: Function, mergeLabels?: boolean);
    deleteGlobalOptionSet(globalOptionSetKey: string, successCallback: Function, errorCallback: Function);
    retrieveGlobalOptionSet(globalOptionSetKey: string, successCallback: Function, errorCallback: Function, castType?: string, select?: string[]);
    retrieveGlobalOptionSets(successCallback: Function, errorCallback: Function, castType?: string, select?: string[]);
    startBatch();
    executeBatch(successCallback: Function, errorCallback: Function);
    initializeInstance(config?: DynamicsWebApiNamespace.Config): DynamicsWebApi;
    utility: DynamicsWebApiNamespace.Utility;
}