import { generateUUID, isObject, copyRequest, copyObject } from "./utils/Utility";
import { ErrorHelper } from "./helpers/ErrorHelper";
import { getCollectionName } from "./client/RequestClient";
import type { InternalRequest } from "./types";
import {
    associate,
    associateSingleValued,
    callAction,
    callFunction,
    count,
    countAll,
    create,
    createEntity,
    deleteRecord,
    disassociate,
    disassociateSingleValued,
    downloadFile,
    fetchXml,
    fetchXmlAll,
    retrieve,
    retrieveAll,
    retrieveEntity,
    retrieveMultiple,
    update,
    updateEntity,
    updateSingleProperty,
    uploadFile,
    upsert,
} from "./requests";
import { DataverseClient, type IDataverseClient } from "./client/dataverse";

/**
 * Microsoft Dataverse Web API helper library for Node.js and Browser.
 * It is compatible with: Dataverse, Dynamics 365 (online), Dynamics 365 (on-premise), Dynamics CRM 2016, Dynamics CRM Online.
 */
export class DynamicsWebApi {
    #client: IDataverseClient;

    /**
     * Initializes a new instance of DynamicsWebApi
     * @param config - Configuration object
     */
    constructor(config?: Config) {
        this.#client = new DataverseClient(config);
    }

    /**
	 * Merges provided configuration properties with an existing one.
	 *
	 * @param {DynamicsWebApi.Config} config - Configuration
	 * @example
	   dynamicsWebApi.setConfig({ serverUrl: 'https://contoso.api.crm.dynamics.com/' });
	 */
    setConfig = (config: Config) => this.#client.setConfig(config);

    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
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
    create = async <TData = any>(request: CreateRequest<TData>): Promise<TData> => create(request, this.#client);

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
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
    retrieve = async <T = any>(request: RetrieveRequest): Promise<T> => retrieve(request, this.#client);

    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    update = async <TData = any>(request: UpdateRequest<TData>): Promise<TData> => update(request, this.#client);

    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    updateSingleProperty = async <T = any>(request: UpdateSinglePropertyRequest): Promise<T> => updateSingleProperty(request, this.#client);

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    deleteRecord = async (request: DeleteRequest): Promise<any> => deleteRecord(request, this.#client);

    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    upsert = async <TData = any>(request: UpsertRequest<TData>): Promise<TData> => upsert(request, this.#client);

    /**
     * Upload file to a File Attribute
     *
     * @param request - An object that represents all possible options for a current request.
     */
    uploadFile = async (request: UploadRequest): Promise<void> => uploadFile(request, this.#client);

    /**
     * Download a file from a File Attribute
     * @param request - An object that represents all possible options for a current request.
     */
    downloadFile = (request: DownloadRequest): Promise<DownloadResponse> => downloadFile(request, this.#client);

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param request - An object that represents all possible options for a current request.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveMultiple = async <T = any>(request: RetrieveMultipleRequest, nextPageLink?: string): Promise<RetrieveMultipleResponse<T>> =>
        retrieveMultiple(request, this.#client, nextPageLink);

    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveAll = <T = any>(request: RetrieveMultipleRequest): Promise<AllResponse<T>> => retrieveAll(request, this.#client);

    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    count = async (request: CountRequest): Promise<number> => count(request, this.#client);

    /**
     * Sends an asynchronous request to count records. Returns: Number
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    countAll = async (request: CountAllRequest): Promise<number> => countAll(request, this.#client);

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    fetch = async <T = any>(request: FetchXmlRequest): Promise<FetchXmlResponse<T>> => fetchXml(request, this.#client);

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    fetchAll = async <T = any>(request: FetchAllRequest): Promise<FetchXmlResponse<T>> => fetchXmlAll(request, this.#client);

    /**
     * Associate for a collection-valued navigation property. (1:N or N:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    associate = async (request: AssociateRequest): Promise<void> => associate(request, this.#client);

    /**
     * Disassociate for a collection-valued navigation property.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    disassociate = async (request: DisassociateRequest): Promise<void> => disassociate(request, this.#client);

    /**
     * Associate for a single-valued navigation property. (1:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    associateSingleValued = async (request: AssociateSingleValuedRequest): Promise<void> => associateSingleValued(request, this.#client);

    /**
     * Removes a reference to an entity for a single-valued navigation property. (1:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    disassociateSingleValued = async (request: DisassociateSingleValuedRequest): Promise<void> => disassociateSingleValued(request, this.#client);

    /**
     * Calls a Web API function
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    callFunction: CallFunction = async <T = any>(request: string | BoundFunctionRequest | UnboundFunctionRequest): Promise<T> =>
        callFunction(request, this.#client);

    /**
     * Calls a Web API action
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    callAction: CallAction = async <TResponse = any, TAction = any>(request: BoundActionRequest<TAction> | UnboundActionRequest<TAction>): Promise<TResponse> =>
        callAction(request, this.#client);
    /**
     * Sends an asynchronous request to create an entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    createEntity = <T = any>(request: CreateEntityRequest): Promise<T> => createEntity(request, this.#client);

    /**
     * Sends an asynchronous request to update an entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    updateEntity = <T = any>(request: UpdateEntityRequest): Promise<T> => updateEntity(request, this.#client);

    /**
     * Sends an asynchronous request to retrieve a specific entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveEntity = <T = any>(request: RetrieveEntityRequest): Promise<T> => retrieveEntity(request, this.#client);

    /**
     * Sends an asynchronous request to retrieve entity definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveEntities = <T = any>(request?: RetrieveEntitiesRequest): Promise<RetrieveMultipleResponse<T>> => {
        const internalRequest: InternalRequest = !request ? {} : copyRequest(request);

        internalRequest.collection = "EntityDefinitions";
        internalRequest.functionName = "retrieveEntities";

        return this.retrieveMultiple(<RetrieveMultipleRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to create an attribute.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    createAttribute = <T = any>(request: CreateAttributeRequest): Promise<T> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.createAttribute", "request");
        ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createAttribute", "request.data");
        ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.createAttribute", "request.entityKey");

        const internalRequest = copyRequest(request);
        internalRequest.collection = "EntityDefinitions";
        internalRequest.functionName = "retrieveEntity";
        internalRequest.navigationProperty = "Attributes";
        internalRequest.key = request.entityKey;

        return this.create(<CreateRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to update an attribute.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    updateAttribute = <T = any>(request: UpdateAttributeRequest): Promise<T> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateAttribute", "request");
        ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateAttribute", "request.data");
        ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.updateAttribute", "request.entityKey");
        ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateAttribute", "request.data.MetadataId");

        if (request.castType) {
            ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateAttribute", "request.castType");
        }

        const internalRequest = copyRequest(request);
        internalRequest.collection = "EntityDefinitions";
        internalRequest.navigationProperty = "Attributes";
        internalRequest.navigationPropertyKey = request.data.MetadataId;
        internalRequest.metadataAttributeType = request.castType;
        internalRequest.key = request.entityKey;
        internalRequest.functionName = "updateAttribute";
        internalRequest.method = "PUT";

        return this.update(<UpdateRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to retrieve attribute metadata for a specified entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveAttributes = <T = any>(request: RetrieveAttributesRequest): Promise<RetrieveMultipleResponse<T>> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveAttributes", "request");
        ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.retrieveAttributes", "request.entityKey");

        if (request.castType) {
            ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveAttributes", "request.castType");
        }

        const internalRequest = copyRequest(request);
        internalRequest.collection = "EntityDefinitions";
        internalRequest.navigationProperty = "Attributes";
        internalRequest.metadataAttributeType = request.castType;
        internalRequest.key = request.entityKey;
        internalRequest.functionName = "retrieveAttributes";

        return this.retrieveMultiple(<RetrieveMultipleRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to retrieve a specific attribute metadata for a specified entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveAttribute = <T = any>(request: RetrieveAttributeRequest): Promise<T> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveAttributes", "request");
        ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.retrieveAttribute", "request.entityKey");
        ErrorHelper.keyParameterCheck(request.attributeKey, "DynamicsWebApi.retrieveAttribute", "request.attributeKey");

        if (request.castType) {
            ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveAttribute", "request.castType");
        }

        const internalRequest = copyRequest(request);
        internalRequest.collection = "EntityDefinitions";
        internalRequest.navigationProperty = "Attributes";
        internalRequest.navigationPropertyKey = request.attributeKey;
        internalRequest.metadataAttributeType = request.castType;
        internalRequest.key = request.entityKey;
        internalRequest.functionName = "retrieveAttribute";

        return this.retrieve(<RetrieveRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to create a relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    createRelationship = <T = any>(request: CreateRelationshipRequest): Promise<T> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.createRelationship", "request");
        ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createRelationship", "request.data");

        const internalRequest = copyRequest(request);
        internalRequest.collection = "RelationshipDefinitions";
        internalRequest.functionName = "createRelationship";

        return this.create(<CreateRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to update a relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    updateRelationship = <T = any>(request: UpdateRelationshipRequest): Promise<T> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateRelationship", "request");
        ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateRelationship", "request.data");
        ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateRelationship", "request.data.MetadataId");

        if (request.castType) {
            ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateRelationship", "request.castType");
        }

        const internalRequest = copyRequest(request);
        internalRequest.collection = "RelationshipDefinitions";
        internalRequest.key = request.data.MetadataId;
        internalRequest.navigationProperty = request.castType;
        internalRequest.functionName = "updateRelationship";
        internalRequest.method = "PUT";

        return this.update(<UpdateRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to delete a relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    deleteRelationship = (request: DeleteRelationshipRequest): Promise<any> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteRelationship", "request");
        ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.deleteRelationship", "request.key");

        const internalRequest = copyRequest(request);
        internalRequest.collection = "RelationshipDefinitions";
        internalRequest.functionName = "deleteRelationship";

        return this.deleteRecord(<DeleteRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to retrieve relationship definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveRelationships = <T = any>(request?: RetrieveRelationshipsRequest): Promise<RetrieveMultipleResponse<T>> => {
        const internalRequest: InternalRequest = !request ? {} : copyRequest(request);

        internalRequest.collection = "RelationshipDefinitions";
        internalRequest.functionName = "retrieveRelationships";

        if (request) {
            if (request.castType) {
                ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveRelationships", "request.castType");
                internalRequest.navigationProperty = request.castType;
            }
        }

        return this.retrieveMultiple(<RetrieveMultipleRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to retrieve a specific relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveRelationship = <T = any>(request: RetrieveRelationshipRequest): Promise<T> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveRelationship", "request");
        ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.retrieveRelationship", "request.key");

        if (request.castType) {
            ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveRelationship", "request.castType");
        }

        const internalRequest = copyRequest(request);
        internalRequest.collection = "RelationshipDefinitions";
        internalRequest.navigationProperty = request.castType;
        internalRequest.functionName = "retrieveRelationship";

        return this.retrieve(<RetrieveRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to create a Global Option Set definition
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    createGlobalOptionSet = <T = any>(request: CreateGlobalOptionSetRequest): Promise<T> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.createGlobalOptionSet", "request");
        ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createGlobalOptionSet", "request.data");

        const internalRequest = copyRequest(request);
        internalRequest.collection = "GlobalOptionSetDefinitions";
        internalRequest.functionName = "createGlobalOptionSet";

        return this.create(<CreateRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to update a Global Option Set.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    updateGlobalOptionSet = <T = any>(request: UpdateGlobalOptionSetRequest): Promise<T> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateGlobalOptionSet", "request");
        ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateGlobalOptionSet", "request.data");
        ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateGlobalOptionSet", "request.data.MetadataId");

        if (request.castType) {
            ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateGlobalOptionSet", "request.castType");
        }

        const internalRequest = copyRequest(request);
        internalRequest.collection = "GlobalOptionSetDefinitions";
        internalRequest.key = request.data.MetadataId;
        internalRequest.functionName = "updateGlobalOptionSet";
        internalRequest.method = "PUT";

        return this.update(<UpdateRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to delete a Global Option Set.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    deleteGlobalOptionSet = (request: DeleteGlobalOptionSetRequest): Promise<any> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteGlobalOptionSet", "request");

        const internalRequest = copyRequest(request);
        internalRequest.collection = "GlobalOptionSetDefinitions";
        internalRequest.functionName = "deleteGlobalOptionSet";

        return this.deleteRecord(<DeleteRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveGlobalOptionSet = <T = any>(request: RetrieveGlobalOptionSetRequest): Promise<T> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveGlobalOptionSet", "request");

        if (request.castType) {
            ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveGlobalOptionSet", "request.castType");
        }

        const internalRequest = copyRequest(request);
        internalRequest.collection = "GlobalOptionSetDefinitions";
        internalRequest.navigationProperty = request.castType;
        internalRequest.functionName = "retrieveGlobalOptionSet";

        return this.retrieve(<RetrieveRequest>internalRequest);
    };

    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    retrieveGlobalOptionSets = <T = any>(request?: RetrieveGlobalOptionSetsRequest): Promise<RetrieveMultipleResponse<T>> => {
        const internalRequest: InternalRequest = !request ? {} : copyRequest(request);

        internalRequest.collection = "GlobalOptionSetDefinitions";
        internalRequest.functionName = "retrieveGlobalOptionSets";

        if (request?.castType) {
            ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveGlobalOptionSets", "request.castType");
            internalRequest.navigationProperty = request.castType;
        }

        return this.retrieveMultiple(<RetrieveMultipleRequest>internalRequest);
    };

    /**
     * Retrieves a CSDL Document Metadata
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<string>} A raw CSDL $metadata document.
     */
    retrieveCsdlMetadata = async (request?: CsdlMetadataRequest): Promise<string> => {
        const internalRequest: InternalRequest = !request ? {} : copyRequest(request);

        internalRequest.collection = "$metadata";
        internalRequest.functionName = "retrieveCsdlMetadata";

        if (request?.addAnnotations) {
            ErrorHelper.boolParameterCheck(request.addAnnotations, "DynamicsWebApi.retrieveCsdlMetadata", "request.addAnnotations");
            internalRequest.includeAnnotations = "*";
        }

        const response = await this.#client.makeRequest(internalRequest);
        return response?.data;
    };

    /**
     * Provides a search results page.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<SearchResponse<TValue>>} Search result
     */
    search: SearchFunction = async <TValue = any>(request: string | SearchRequest): Promise<SearchResponse<TValue>> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.search", "request");

        const _isObject = isObject(request);
        const parameterName = _isObject ? "request.query.search" : "term";
        const internalRequest: InternalRequest = _isObject ? copyObject(request) : { query: { search: request as string } };

        ErrorHelper.parameterCheck(internalRequest.query, "DynamicsWebApi.search", "request.query");
        ErrorHelper.stringParameterCheck(internalRequest.query.search, "DynamicsWebApi.search", parameterName);
        ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, "DynamicsWebApi.search", parameterName, 100);

        internalRequest.collection = "query";
        internalRequest.functionName = "search";
        internalRequest.method = "POST";
        internalRequest.data = internalRequest.query;
        internalRequest.apiConfig = this.#client.config.searchApi;

        delete internalRequest.query;

        const response = await this.#client.makeRequest(internalRequest);
        return response?.data;
    };

    /**
     * Provides suggestions as the user enters text into a form field.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<SuggestResponse<TValueDocument>>} Suggestions result
     */
    suggest: SuggestFunction = async <TValueDocument = any>(request: string | SuggestRequest): Promise<SuggestResponse<TValueDocument>> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.suggest", "request");

        const _isObject = isObject(request);
        const parameterName = _isObject ? "request.query.search" : "term";
        const internalRequest: InternalRequest = _isObject ? copyObject(request) : { query: { search: request as string } };

        ErrorHelper.parameterCheck(internalRequest.query, "DynamicsWebApi.suggest", "request.query");
        ErrorHelper.stringParameterCheck(internalRequest.query.search, "DynamicsWebApi.suggest", parameterName);
        ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, "DynamicsWebApi.suggest", parameterName, 100);

        internalRequest.functionName = internalRequest.collection = "suggest";
        internalRequest.method = "POST";
        internalRequest.data = internalRequest.query;
        internalRequest.apiConfig = this.#client.config.searchApi;

        delete internalRequest.query;

        const response = await this.#client.makeRequest(internalRequest);
        return response?.data;
    };

    /**
     * Provides autocompletion of input as the user enters text into a form field.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<AutocompleteResponse>} Result of autocomplete
     */
    autocomplete: AutocompleteFunction = async (request: string | AutocompleteRequest): Promise<AutocompleteResponse> => {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.autocomplete", "request");

        const _isObject = isObject(request);
        const parameterName = _isObject ? "request.query.search" : "term";
        const internalRequest: InternalRequest = _isObject ? copyObject(request) : { query: { search: request as string } };

        if (_isObject) ErrorHelper.parameterCheck(internalRequest.query, "DynamicsWebApi.autocomplete", "request.query");
        ErrorHelper.stringParameterCheck(internalRequest.query.search, `DynamicsWebApi.autocomplete`, parameterName);
        ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, "DynamicsWebApi.autocomplete", parameterName, 100);

        internalRequest.functionName = internalRequest.collection = "autocomplete";
        internalRequest.method = "POST";
        internalRequest.data = internalRequest.query;
        internalRequest.apiConfig = this.#client.config.searchApi;

        delete internalRequest.query;

        const response = await this.#client.makeRequest(internalRequest);
        return response?.data;
    };

    /**
     * Starts/executes a batch request.
     */
    startBatch = (): void => {
        this.#client.isBatch = true;
        this.#client.batchRequestId = generateUUID();
    };

    /**
     * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    executeBatch = async (request?: BatchRequest): Promise<any[]> => {
        ErrorHelper.throwBatchNotStarted(this.#client.isBatch);

        const internalRequest: InternalRequest = !request ? {} : copyRequest(request);

        internalRequest.collection = "$batch";
        internalRequest.method = "POST";
        internalRequest.functionName = "executeBatch";
        internalRequest.requestId = this.#client.batchRequestId;

        this.#client.batchRequestId = null;
        this.#client.isBatch = false;

        const response = await this.#client.makeRequest(internalRequest);
        return response?.data;
    };

    /**
     * Creates a new instance of DynamicsWebApi. If config is not provided, it is copied from a current instance.
     *
     * @param {Config} config configuration object.
     * @returns {DynamicsWebApi} A new instance of DynamicsWebApi
     */
    initializeInstance = (config?: Config): DynamicsWebApi => new DynamicsWebApi(config || this.#client.config);

    Utility = {
        /**
         * Searches for a collection name by provided entity name in a cached entity metadata.
         * The returned collection name can be null.
         *
         * @param {string} entityName entity name
         * @returns {string | null} collection name
         */
        getCollectionName: (entityName: string): string | null => getCollectionName(entityName),
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
    /**Impersonates a user based on their systemuserid by adding "MSCRMCallerID" header. A String representing the GUID value for the Dynamics 365 systemuserid. */
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
    /**Indicates if an operation must be included in a Change Set or not. Works in Batch Operations only. By default, it's "true", except for GET operations - they are not allowed in Change Sets. */
    inChangeSet?: boolean;
    /**Headers to supply with a request. These headers will override configuraiton headers if the identical ones were set. */
    headers?: HeaderCollection;
    /**Custom query parameters. Can be used to set parameter aliases for "$filter" and "$orderBy". Important! These parameters ARE NOT URI encoded! */
    queryParams?: string[];
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
    /**A String representing collection record's Primary Key (GUID) or Alternate Key(s). */
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

export interface CreateRequest<T = any> extends CRUDRequest {
    /**If set to true, the request bypasses custom business logic, all synchronous plug-ins and real-time workflows are disabled. Check for special exceptions in Microsft Docs. */
    bypassCustomPluginExecution?: boolean;
    /**Web API v9+ only! Boolean that enables duplicate detection. */
    duplicateDetection?: boolean;
    /**A JavaScript object with properties corresponding to the logical name of entity attributes(exceptions are lookups and single-valued navigation properties). */
    data?: T;
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
    fieldValuePair: { [key: string]: any };
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
    /**Primary entity record id/key. */
    primaryKey: string;
    /**Relationship name. */
    relationshipName: string;
    /**Related name of the Entity Collection or Entity Logical name. */
    relatedCollection: string;
    /**Related entity record id/key. */
    relatedKey: string;
}

export interface AssociateSingleValuedRequest extends Request {
    /**Primary entity record id/key. */
    primaryKey: string;
    /**Navigation property name. */
    navigationProperty: string;
    /**Related name of the Entity Collection or Entity Logical name. */
    relatedCollection: string;
    /**Related entity record id/key. */
    relatedKey: string;
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

export type SearchMode = "any" | "all";
export type SearchType = "simple" | "full";

export interface SearchQueryBase {
    /**The search parameter value contains the term to be searched for and has a 100-character limit. For suggestions, min 3 characters in addition. */
    search: string;
    /**The default table list searches across all Dataverse search–configured tables and columns. The default list is configured by your administrator when Dataverse search is enabled. */
    entities?: string[];
    /**Filters are applied while searching data and are specified in standard OData syntax. */
    filter?: string;
}

export interface Search extends SearchQueryBase {
    /**Facets support the ability to drill down into data results after they've been retrieved. */
    facets?: string[];
    /**Specify true to return the total record count; otherwise false. The default is false. */
    returnTotalRecordCount?: boolean;
    /**Specifies the number of search results to skip. */
    skip?: number;
    /**Specifies the number of search results to retrieve. The default is 50, and the maximum value is 100. */
    top?: number;
    /**A list of comma-separated clauses where each clause consists of a column name followed by 'asc' (ascending, which is the default) or 'desc' (descending). This list specifies how to order the results in order of precedence. */
    orderBy?: string[];
    /**Specifies whether any or all the search terms must be matched to count the document as a match. The default is 'any'. */
    searchMode?: SearchMode;
    /**The search type specifies the syntax of a search query. Using 'simple' selects simple query syntax and 'full' selects Lucene query syntax. The default is 'simple'. */
    searchType?: SearchType;
}

export interface Suggest extends SearchQueryBase {
    /**Use fuzzy search to aid with misspellings. The default is false. */
    useFuzzy?: boolean;
    /**Number of suggestions to retrieve. The default is 5. */
    top?: number;
    /**A list of comma-separated clauses where each clause consists of a column name followed by 'asc' (ascending, which is the default) or 'desc' (descending). This list specifies how to order the results in order of precedence. */
    orderBy?: string[];
}

export interface Autocomplete extends SearchQueryBase {
    /**Use fuzzy search to aid with misspellings. The default is false. */
    useFuzzy?: boolean;
}

export interface SearchRequest extends BaseRequest {
    /**Search query object */
    query: Search;
}

export interface SuggestRequest extends BaseRequest {
    /**Suggestion query object */
    query: Suggest;
}

export interface AutocompleteRequest extends BaseRequest {
    /**Autocomplete query object */
    query: Autocomplete;
}

export interface ApiConfig {
    /** API Version to use, for example: "9.2" or "1.0" */
    version?: string;
    /** API Path, for example: "data" or "search" */
    path?: string;
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
    searchApi?: ApiConfig;
    /**Default headers to supply with each request. */
    headers?: HeaderCollection;
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
// export interface OnTokenAcquiredCallback {
//     (token: any): void;
// }

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

export interface MultipleResponse<T = any> {
    /**Multiple respone entities */
    value: T[];
    oDataCount?: number;
    "@odata.count"?: number;
    oDataContext?: string;
    "@odata.context"?: number;
}

export interface AllResponse<T> extends MultipleResponse<T> {
    /**@odata.deltaLink value */
    oDataDeltaLink?: string;
}

export interface RetrieveMultipleResponse<T> extends MultipleResponse<T> {
    "@Microsoft.Dynamics.CRM.totalrecordcount"?: number;
    "@Microsoft.Dynamics.CRM.totalrecordcountlimitexceeded"?: boolean;
    /**@odata.nextLink value */
    oDataNextLink?: string;
    /**@odata.deltaLink value */
    oDataDeltaLink?: string;
    "@odata.deltaLink"?: string;
    "@odata.nextLink"?: string;
}

export interface FetchXmlResponse<T> extends MultipleResponse<T> {
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

export interface SearchResponse<TValue = any> {
    /**Search results*/
    value: TValue[];
    facets: any | null;
    totalrecordcount: number;
    querycontext: any | null;
}

export interface SuggestResponseValue<TDocument = any> {
    text: string;
    document: TDocument;
}

export interface SuggestResponse<TValueDocument = any> {
    /**Suggestions*/
    value: SuggestResponseValue<TValueDocument>[];
    querycontext: any | null;
}

export interface AutocompleteResponse {
    /**Autocomplete result*/
    value: string | null;
    querycontext: any | null;
}

//function overloads

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
    <TValue = any>(request: SearchRequest): Promise<SearchResponse<TValue>>;
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
