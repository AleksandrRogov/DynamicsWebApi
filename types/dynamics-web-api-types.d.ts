export declare namespace DynamicsWebApi {
	namespace Core {
		interface RequestOptions {
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

		interface ConvertedRequest {
			path?: string,
			headers?: any,
			async?: boolean,
			method?: string,
			data?: any,
			responseParams?: any,
			isAsync?: boolean
		}

		interface BatchRequestPart {
			method?: string,
			request?: InternalRequest,
		}

		interface InternalBatchRequest {
			body?: any,
			headers?: any
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
			impersonateAAD: string;
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
			expand?: Expand[];
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
		}

		interface FetchXmlCookie {
			cookie: string,
			page: number,
			nextPage: number
		}

		interface ReferenceObject {
			id: string,
			collection: string,
			oDataContext: string
		}
	}

    interface WebApiRequest {
        requestUrl: string,
        headers: any,
        async?: boolean
    }

	interface Expand {
		/**An Array(of Strings) representing the $select OData System Query Option to control which attributes will be returned. */
		select?: string[]
		/**Use the $filter system query option to set criteria for which entities will be returned. */
		filter?: string
		/**Limit the number of results returned by using the $top system query option.Do not use $top with $count! */
		top?: number
		/**An Array(of Strings) representing the order in which items are returned using the $orderby system query option.Use the asc or desc suffix to specify ascending or descending order respectively.The default is ascending if the suffix isn't applied. */
		orderBy?: string[]
		/**A name of a single-valued navigation property which needs to be expanded. */
		property?: string
		/**An Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned. */
		expand?: Expand[]
	}

	interface Request {
		/**XHR requests only! Indicates whether the requests should be made synchronously or asynchronously.Default value is 'true'(asynchronously). */
		async?: boolean;
		/**The name of the Entity Collection or Entity Logical name. */
		collection?: string;
		/**Impersonates the user.A String representing the GUID value for the Dynamics 365 system user id. */
		impersonate?: string;
		/** If set to 'true', DynamicsWebApi adds a request header 'Cache-Control: no-cache'.Default value is 'false'. */
		noCache?: boolean;
		/** Authorization Token. If set, onTokenRefresh will not be called. */
		token?: string;
		/**Sets a number of milliseconds before a request times out. */
		timeout?: number;
	}

	interface CRUDRequest extends Request {
		/** DEPRECATED Use "key" instead. A String representing the Primary Key(GUID) of the record. */
		id?: string;
		/**A String representing collection record's Primary Key (GUID) or Alternate Key(s). */
		key?: string;
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
		apply?: string
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
		maxPageSize?: string;
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
		}
	}

	interface MultipleResponse<T = any> {
		/**Multiple respone entities */
		value?: T[]
	}

	interface AllResponse<T> extends MultipleResponse<T> {
		/**@odata.deltaLink value */
		oDataDeltaLink?: string
	}

	interface RetrieveMultipleResponse<T> extends MultipleResponse<T> {
		/**@odata.nextLink value */
		oDataNextLink?: string,
		/**@odata.deltaLink value */
		oDataDeltaLink?: string
	}

	interface FetchXmlResponse<T> extends MultipleResponse<T> {
		/**Paging information */
		PagingInfo?: {
			/**Number of the next page */
			nextPage?: number,
			/**Next page cookie */
			cookie?: string
		}
	}
}