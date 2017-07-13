var DWA = require("./dwa");
var Utility = require('./utilities/Utility');
var RequestConverter = require('./utilities/RequestConverter');
var ErrorHelper = require('./helpers/ErrorHelper');
var sendRequest = require('./requests/sendRequest');

//string es6 polyfill
if (!String.prototype.endsWith || !String.prototype.startsWith) {
    require("./polyfills/string-es6");
}

/* develblock:start */
var dwaExpandRequest = function () {
    return {
        select: [],
        filter: "",
        top: 0,
        orderBy: [],
        property: ""
    }
}
var dwaRequest = function () {
    return {
        collection: "",
        id: "",
        select: [],
        expand: [],
        filter: "",
        maxPageSize: 1,
        count: true,
        top: 1,
        orderBy: [],
        includeAnnotations: "",
        ifmatch: "",
        ifnonematch: "",
        returnRepresentation: true,
        entity: {},
        impersonate: "",
        navigationProperty: "",
        savedQuery: "",
        userQuery: ""
    }
};
/* develblock:end */

/**
 * Configuration object for DynamicsWebApi
 * @typedef {object} DWAConfig
 * @property {string} webApiUrl - A String representing a URL to Web API (webApiVersion not required if webApiUrl specified) [not used inside of CRM]
 * @property {string} webApiVersion - The version of Web API to use, for example: "8.1"
 * @property {string} impersonate - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
 * @property {Function} onTokenRefresh - A function that is called when a security token needs to be refreshed.
 * @property {string} includeAnnotations - Sets Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types.
 * @property {string} maxPageSize - Sets the odata.maxpagesize preference value to request the number of entities returned in the response.
 * @property {string} returnRepresentation - Sets Prefer header request with value "return=representation". Use this property to return just created or updated entity in a single request.
 */

/**
 * DynamicsWebApi - a Microsoft Dynamics CRM Web API helper library. Current version uses Promises instead of Callbacks.
 * 
 * @param {DWAConfig} [config] - configuration object
 */
function DynamicsWebApi(config) {

    var _internalConfig = {
        webApiVersion: "8.0",
        webApiUrl: null,
        impersonate: null,
        onTokenRefresh: null,
        includeAnnotations: null,
        maxPageSize: null,
        returnRepresentation: null
    };

    if (!config) {
        config = _internalConfig;
    }

    var _context = function () {

        if (typeof GetGlobalContext != "undefined") {
            return GetGlobalContext();
        }
        else {
            if (typeof Xrm != "undefined") {
                return Xrm.Page.context;
            }
            else {
                throw new Error("Xrm Context is not available.");
            }
        }
    };

    var _getClientUrl = function () {

        var context = _context();

        if (context) {
            var clientUrl = context.getClientUrl();

            if (clientUrl.match(/\/$/)) {
                clientUrl = clientUrl.substring(0, clientUrl.length - 1);
            }
            return clientUrl;
        }

        return "";
    };

    var _initUrl = function () {
        return _getClientUrl() + "/api/data/v" + _internalConfig.webApiVersion + "/";
    };

    /**
     * Sets the configuration parameters for DynamicsWebApi helper.
     *
     * @param {DWAConfig} config - configuration object
     */
    this.setConfig = function (config) {

        if (config.webApiVersion) {
            ErrorHelper.stringParameterCheck(config.webApiVersion, "DynamicsWebApi.setConfig", "config.webApiVersion");
            _internalConfig.webApiVersion = config.webApiVersion;
        }

        if (config.webApiUrl) {
            ErrorHelper.stringParameterCheck(config.webApiUrl, "DynamicsWebApi.setConfig", "config.webApiUrl");
            _internalConfig.webApiUrl = config.webApiUrl;
        } else {
            _internalConfig.webApiUrl = _initUrl();
        }

        if (config.impersonate) {
            _internalConfig.impersonate = ErrorHelper.guidParameterCheck(config.impersonate, "DynamicsWebApi.setConfig", "config.impersonate");
        }

        if (config.onTokenRefresh) {
            ErrorHelper.callbackParameterCheck(config.onTokenRefresh, "DynamicsWebApi.setConfig", "config.onTokenRefresh");
            _internalConfig.onTokenRefresh = config.onTokenRefresh;
        }

        if (config.includeAnnotations) {
            ErrorHelper.stringParameterCheck(config.includeAnnotations, "DynamicsWebApi.setConfig", "config.includeAnnotations");
            _internalConfig.includeAnnotations = config.includeAnnotations;
        }

        if (config.maxPageSize) {
            ErrorHelper.numberParameterCheck(config.maxPageSize, "DynamicsWebApi.setConfig", "config.maxPageSize");
            _internalConfig.maxPageSize = config.maxPageSize;
        }

        if (config.returnRepresentation) {
            ErrorHelper.boolParameterCheck(config.returnRepresentation, "DynamicsWebApi.setConfig", "config.returnRepresentation");
            _internalConfig.returnRepresentation = config.returnRepresentation;
        }
    };

    this.setConfig(config);

    /**
     * Sends a request to given URL with given parameters
     *
     * @param {string} method - Method of the request.
     * @param {string} uri - Request URI.
     * @param {Object} [data] - Data to send in the request.
     * @param {Object} [additionalHeaders] - Object with additional headers. IMPORTANT! This object does not contain default headers needed for every request.
     * @returns {Promise}
     */
    var _sendRequest = function (method, uri, data, additionalHeaders) {
        return new Promise(function (resolve, reject) {
            sendRequest(method, uri, _internalConfig, data, additionalHeaders, resolve, reject);
        });
    };

    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {Object} object - A JavaScript object valid for create operations.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {string|Array} [prefer] - Sets a Prefer header value. For example: ['retrun=representation', 'odata.include-annotations="*"']
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise}
     */
    this.create = function (object, collection, prefer, select) {
        ErrorHelper.parameterCheck(object, "DynamicsWebApi.create", "object");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.create", "collection");

        if (prefer) {
            ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.create", "prefer");
        }

        if (select) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.create", "select");
        }

        var request = {
            collection: collection,
            select: select,
            prefer: prefer
        };

        var result = RequestConverter.convertRequest(request, "create", _internalConfig);

        return _sendRequest("POST", result.url, object, result.headers)
            .then(function (response) {
                if (response.data) {
                    return response.data;
                }

                var entityUrl = response.headers['OData-EntityId']
                    ? response.headers['OData-EntityId']
                    : response.headers['odata-entityid'];
                var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                return id;
            });
    };

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @returns {Promise}
     */
    this.retrieveRequest = function (request) {
        ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieve", "request");

        var result = RequestConverter.convertRequest(request, "retrieve", _internalConfig);

        //copy locally
        var select = request.select;
        return _sendRequest("GET", result.url, null, result.headers).then(function (response) {
            if (select != null && select.length == 1 && select[0].endsWith("/$ref") && response.data["@odata.id"] != null) {
                return Utility.convertToReferenceObject(response.data);
            }

            return response.data;
        });
    };

    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {string} id - A String representing the GUID value for the record to retrieve.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @param {string|Array} [expand] - A String or Array of Expand Objects representing the $expand Query Option value to control which related records need to be returned.
     * @returns {Promise}
     */
    this.retrieve = function (id, collection, select, expand) {

        ErrorHelper.stringParameterCheck(id, "DynamicsWebApi.retrieve", "id");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.retrieve", "id")
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.retrieve", "collection");

        if (select && select.length) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.retrieve", "select");
        }

        if (expand && expand.length) {
            ErrorHelper.stringOrArrayParameterCheck(expand, "DynamicsWebApi.retrieve", "expand");
        }

        var request = {
            collection: collection,
            id: id,
            select: select,
            expand: expand
        };

        return this.retrieveRequest(request);
    };

    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @returns {Promise}
     */
    this.updateRequest = function (request) {

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.update", "request");
        ErrorHelper.parameterCheck(request.entity, "DynamicsWebApi.update", "request.entity");

        if (request.ifmatch == null) {
            request.ifmatch = '*'; //to prevent upsert
        }

        var result = RequestConverter.convertRequest(request, "update", _internalConfig);

        //copy locally
        var ifmatch = request.ifmatch;
        return _sendRequest("PATCH", result.url, request.entity, result.headers)
            .then(function (response) {
                if (response.data) {
                    return response.data;
                }

                return true; //updated

            }).catch(function (error) {
                if (ifmatch && error.status == 412) {
                    //precondition failed - not updated
                    return false;
                }
                //rethrow error otherwise
                throw error;
            });
    };

    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {string} id - A String representing the GUID value for the record to update.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {string} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise}
     */
    this.update = function (id, collection, object, prefer, select) {

        ErrorHelper.stringParameterCheck(id, "DynamicsWebApi.update", "id");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.update", "id")
        ErrorHelper.parameterCheck(object, "DynamicsWebApi.update", "object");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.update", "collection");

        if (prefer) {
            ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.update", "prefer");
        }

        if (select) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.update", "select");
        }

        var request = {
            collection: collection,
            id: id,
            select: select,
            prefer: prefer,
            entity: object
        };

        return this.updateRequest(request);
    };

    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param {string} id - A String representing the GUID value for the record to update.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Object} keyValuePair - keyValuePair object with a logical name of the field as a key and a value to update with. Example: {subject: "Update Record"}
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise}
     */
    this.updateSingleProperty = function (id, collection, keyValuePair, prefer, select) {

        ErrorHelper.stringParameterCheck(id, "DynamicsWebApi.updateSingleProperty", "id");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.updateSingleProperty", "id")
        ErrorHelper.parameterCheck(keyValuePair, "DynamicsWebApi.updateSingleProperty", "keyValuePair");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.updateSingleProperty", "collection");

        var key = Object.keys(keyValuePair)[0];
        var keyValue = keyValuePair[key];

        if (prefer) {
            ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.updateSingleProperty", "prefer");
        }

        if (select) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.updateSingleProperty", "select");
        }

        var request = {
            collection: collection,
            id: id,
            select: select,
            prefer: prefer,
            navigationProperty: key
        };

        var result = RequestConverter.convertRequest(request, "updateSingleProperty", _internalConfig);

        return _sendRequest("PUT", result.url, { value: keyValue }, result.headers)
            .then(function (response) {
                if (response.data) {
                    return response.data;
                }
            });
    };

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @returns {Promise}
     */
    this.deleteRequest = function (request) {

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.delete", "request")

        var result = RequestConverter.convertRequest(request, "deleteRequest", _internalConfig);

        //copy locally
        var ifmatch = request.ifmatch;
        return _sendRequest("DELETE", result.url, null, result.headers).then(function () {
            return true; //deleted
        }).catch(function (error) {
            if (ifmatch && error.status == 412) {
                //precondition failed - not deleted
                return false;
            }
            else {
                //rethrow error otherwise
                throw error;
            }
        });
    }

    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param {string} id - A String representing the GUID value for the record to delete.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {string} [propertyName] - The name of the property which needs to be emptied. Instead of removing a whole record only the specified property will be cleared.
     * @returns {Promise}
     */
    this.deleteRecord = function (id, collection, propertyName) {

        ErrorHelper.stringParameterCheck(id, "DynamicsWebApi.deleteRecord", "id");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.deleteRecord", "id")
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.deleteRecord", "collection");

        if (propertyName != null)
            ErrorHelper.stringParameterCheck(propertyName, "DynamicsWebApi.deleteRecord", "propertyName");

        var url = collection.toLowerCase() + "(" + id + ")";

        if (propertyName != null)
            url += "/" + propertyName;

        return _sendRequest("DELETE", url).then(function () {
            return;
        })
    };

    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @returns {Promise}
     */
    this.upsertRequest = function (request) {

        ErrorHelper.parameterCheck(request, "DynamicsWebApi.upsert", "request")
        ErrorHelper.parameterCheck(request.entity, "DynamicsWebApi.upsert", "request.entity")

        var result = RequestConverter.convertRequest(request, "upsert", _internalConfig);

        //copy locally
        var ifnonematch = request.ifnonematch;
        var ifmatch = request.ifmatch;
        return _sendRequest("PATCH", result.url, request.entity, result.headers)
            .then(function (response) {
                if (response.headers['OData-EntityId'] || response.headers['odata-entityid']) {
                    var entityUrl = response.headers['OData-EntityId']
                        ? response.headers['OData-EntityId']
                        : response.headers['odata-entityid'];
                    var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                    return id;
                }
                else if (response.data) {
                    return response.data;
                }
            }).catch(function (error) {
                if (ifnonematch && error.status == 412) {
                    //if prevent update
                    return;
                }
                else if (ifmatch && error.status == 404) {
                    //if prevent create
                    return;
                }
                //rethrow error otherwise
                throw error;
            });
    };

    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {string} id - A String representing the GUID value for the record to upsert.
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Object} object - A JavaScript object valid for update operations.
     * @param {string|Array} [prefer] - If set to "return=representation" the function will return an updated object
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise}
     */
    this.upsert = function (id, collection, object, prefer, select) {

        ErrorHelper.stringParameterCheck(id, "DynamicsWebApi.upsert", "id");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.upsert", "id")

        ErrorHelper.parameterCheck(object, "DynamicsWebApi.upsert", "object");
        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.upsert", "collection");

        if (prefer) {
            ErrorHelper.stringOrArrayParameterCheck(prefer, "DynamicsWebApi.upsert", "prefer");
        }

        if (select) {
            ErrorHelper.arrayParameterCheck(select, "DynamicsWebApi.upsert", "select");
        }

        var request = {
            collection: collection,
            id: id,
            select: select,
            prefer: prefer,
            entity: object
        };

        return this.upsertRequest(request);
    }

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise}
     */
    var retrieveMultipleRequest = function (request, nextPageLink) {

        if (nextPageLink && !request.collection) {
            request.collection = "any";
        }

        var result = RequestConverter.convertRequest(request, "retrieveMultiple", _internalConfig);

        if (nextPageLink) {
            ErrorHelper.stringParameterCheck(nextPageLink, "DynamicsWebApi.retrieveMultiple", "nextPageLink");
            result.url = nextPageLink.replace(_internalConfig.webApiUrl, "");
        }

        //copy locally
        var toCount = request.count;

        return _sendRequest("GET", result.url, null, result.headers)
            .then(function (response) {
                if (response.data['@odata.nextLink'] != null) {
                    response.data.oDataNextLink = response.data['@odata.nextLink'];
                }
                if (toCount) {
                    response.data.oDataCount = response.data['@odata.count'] != null
                        ? parseInt(response.data['@odata.count'])
                        : 0;
                }
                if (response.data['@odata.context'] != null) {
                    response.data.oDataContext = response.data['@odata.context'];
                }

                return response.data;
            });
    };

    this.retrieveMultipleRequest = retrieveMultipleRequest;

    var _retrieveAllRequest = function (request, nextPageLink, records) {
        var records = records || [];

        return retrieveMultipleRequest(request, nextPageLink).then(function (response) {
            records = records.concat(response.value);

            if (response.oDataNextLink) {
                return _retrieveAllRequest(request, response.oDataNextLink, records);
            }

            return { value: records };
        });
    }

    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {Object} request - An object that represents all possible options for a current request.
     * @returns {Promise}
     */
    this.retrieveAllRequest = function (request) {
        return _retrieveAllRequest(request);
    };

    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
     *
     * @param {string} collection - The Name of the Entity Collection.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @returns {Promise}
     */
    this.count = function (collection, filter) {
        if (filter == null || (filter != null && !filter.length)) {
            ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.count", "collection");

            //if filter has not been specified then simplify the request
            return _sendRequest("GET", collection.toLowerCase() + "/$count")
                .then(function (response) {
                    return response.data ? parseInt(response.data) : 0;
                });
        }
        else {
            return this.retrieveMultipleRequest({
                collection: collection,
                filter: filter,
                count: true
            }, null)
                .then(function (response) {
                    /// <param name="response" type="DWA.Types.MultipleResponse">Request response</param>

                    return response.oDataCount ? response.oDataCount : 0;
                });
        }
    }

    /**
     * Sends an asynchronous request to count records. Returns: Number
     *
     * @param {string} collection - The Name of the Entity Collection.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @param {Array} [select] - An Array representing the $select Query Option to control which attributes will be returned.
     * @returns {Promise}
     */
    this.countAll = function (collection, filter, select) {
        return _retrieveAllRequest({
            collection: collection,
            filter: filter,
            select: select
        })
            .then(function (response) {
                return response
                    ? (response.value ? response.value.length : 0)
                    : 0;
            });
    }

    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise}
     */
    this.retrieveMultiple = function (collection, select, filter, nextPageLink) {
        return this.retrieveMultipleRequest({
            collection: collection,
            select: select,
            filter: filter
        }, nextPageLink);
    }

    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {string} collection - The Name of the Entity Collection.
     * @param {Array} [select] - Use the $select system query option to limit the properties returned.
     * @param {string} [filter] - Use the $filter system query option to set criteria for which entities will be returned.
     * @returns {Promise}
     */
    this.retrieveAll = function (collection, select, filter) {
        return _retrieveAllRequest({
            collection: collection,
            select: select,
            filter: filter
        });
    }

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param {string} collection - An object that represents all possible options for a current request.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {number} [pageNumber] - Page number.
     * @param {string} [pagingCookie] - Paging cookie. For retrieving the first page, pagingCookie should be null.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    var executeFetchXml = function (collection, fetchXml, includeAnnotations, pageNumber, pagingCookie, impersonateUserId) {

        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.executeFetchXml", "type");
        ErrorHelper.stringParameterCheck(fetchXml, "DynamicsWebApi.executeFetchXml", "fetchXml");

        pageNumber = pageNumber || 1;

        ErrorHelper.numberParameterCheck(pageNumber, "DynamicsWebApi.executeFetchXml", "pageNumber");
        var replacementString = '$1 page="' + pageNumber + '"';

        if (pagingCookie != null) {
            ErrorHelper.stringParameterCheck(pagingCookie, "DynamicsWebApi.executeFetchXml", "pagingCookie");
            replacementString += ' paging-cookie="' + pagingCookie + '"';
        }

        //add page number and paging cookie to fetch xml
        fetchXml = fetchXml.replace(/^(<fetch[\w\d\s'"=]+)/, replacementString);

        if (includeAnnotations) {
            ErrorHelper.stringParameterCheck(includeAnnotations, "DynamicsWebApi.executeFetchXml", "includeAnnotations");
        }

        if (impersonateUserId) {
            impersonateUserId = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.executeFetchXml", "impersonateUserId");
        }

        var request = {
            collection: collection,
            includeAnnotations: includeAnnotations,
            impersonate: impersonateUserId
        };

        var result = RequestConverter.convertRequest(request, "executeFetchXml", _internalConfig);

        var encodedFetchXml = encodeURIComponent(fetchXml);

        return _sendRequest("GET", result.url + "?fetchXml=" + encodedFetchXml, null, result.headers)
            .then(function (response) {

                if (response.data['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'] != null) {
                    response.data.PagingInfo = Utility.getFetchXmlPagingCookie(response.data['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'], pageNumber);
                }

                if (response.data['@odata.context'] != null) {
                    response.data.oDataContext = response.data['@odata.context'];
                }

                return response.data;
            });
    }

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param {string} collection - An object that represents all possible options for a current request.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {number} [pageNumber] - Page number.
     * @param {string} [pagingCookie] - Paging cookie. For retrieving the first page, pagingCookie should be null.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.fetch = this.executeFetchXml = executeFetchXml;

    var _executeFetchXmlAll = function (collection, fetchXml, includeAnnotations, pageNumber, pagingCookie, impersonateUserId, records) {
        var records = records || [];

        return executeFetchXml(collection, fetchXml, includeAnnotations, pageNumber, pagingCookie, impersonateUserId, records).then(function (response) {
            records = records.concat(response.value);

            if (response.PagingInfo) {
                return _executeFetchXmlAll(collection, fetchXml, includeAnnotations, response.PagingInfo.nextPage, response.PagingInfo.cookie, impersonateUserId, records);
            }

            return { value: records };
        });
    }

    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param {string} collection - An object that represents all possible options for a current request.
     * @param {string} fetchXml - FetchXML is a proprietary query language that provides capabilities to perform aggregation.
     * @param {string} [includeAnnotations] - Use this parameter to include annotations to a result. For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.fetchAll = this.executeFetchXmlAll = function (collection, fetchXml, includeAnnotations, impersonateUserId) {
        return _executeFetchXmlAll(collection, fetchXml, includeAnnotations, null, null, impersonateUserId);
    }

    /**
     * Associate for a collection-valued navigation property. (1:N or N:N)
     *
     * @param {string} primaryCollection - Primary entity collection name.
     * @param {string} primaryId - Primary entity record id.
     * @param {string} relationshipName - Relationship name.
     * @param {string} relatedCollection - Related colletion name.
     * @param {string} relatedId - Related entity record id.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.associate = function (primaryCollection, primaryId, relationshipName, relatedCollection, relatedId, impersonateUserId) {
        ErrorHelper.stringParameterCheck(primaryCollection, "DynamicsWebApi.associate", "primarycollection");
        ErrorHelper.stringParameterCheck(relatedCollection, "DynamicsWebApi.associate", "relatedcollection");
        ErrorHelper.stringParameterCheck(relationshipName, "DynamicsWebApi.associate", "relationshipName");
        primaryId = ErrorHelper.guidParameterCheck(primaryId, "DynamicsWebApi.associate", "primaryId");
        relatedId = ErrorHelper.guidParameterCheck(relatedId, "DynamicsWebApi.associate", "relatedId");

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        return _sendRequest("POST", primaryCollection + "(" + primaryId + ")/" + relationshipName + "/$ref",
            { "@odata.id": _internalConfig.webApiUrl + relatedCollection + "(" + relatedId + ")" }, header)
            .then(function () { });
    }

    /**
     * Disassociate for a collection-valued navigation property.
     *
     * @param {string} primaryCollection - Primary entity collection name.
     * @param {string} primaryId - Primary entity record id.
     * @param {string} relationshipName - Relationship name.
     * @param {string} relatedId - Related entity record id.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.disassociate = function (primaryCollection, primaryId, relationshipName, relatedId, impersonateUserId) {
        ErrorHelper.stringParameterCheck(primaryCollection, "DynamicsWebApi.disassociate", "primarycollection");
        ErrorHelper.stringParameterCheck(relationshipName, "DynamicsWebApi.disassociate", "relationshipName");
        primaryId = ErrorHelper.guidParameterCheck(primaryId, "DynamicsWebApi.disassociate", "primaryId");
        relatedId = ErrorHelper.guidParameterCheck(relatedId, "DynamicsWebApi.disassociate", "relatedId");

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        return _sendRequest("DELETE", primaryCollection + "(" + primaryId + ")/" + relationshipName + "(" + relatedId + ")/$ref", null, header)
            .then(function () { });
    }

    /**
     * Associate for a single-valued navigation property. (1:N)
     *
     * @param {string} collection - Entity collection name that contains an attribute.
     * @param {string} id - Entity record Id that contains an attribute.
     * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param {string} relatedCollection - Related collection name that the lookup (attribute) points to.
     * @param {string} relatedId - Related entity record id that needs to be associated.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.associateSingleValued = function (collection, id, singleValuedNavigationPropertyName, relatedCollection, relatedId, impersonateUserId) {

        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.associateSingleValued", "collection");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.associateSingleValued", "id");
        relatedId = ErrorHelper.guidParameterCheck(relatedId, "DynamicsWebApi.associateSingleValued", "relatedId");
        ErrorHelper.stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.associateSingleValued", "singleValuedNavigationPropertyName");
        ErrorHelper.stringParameterCheck(relatedCollection, "DynamicsWebApi.associateSingleValued", "relatedcollection");

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        return _sendRequest("PUT", collection + "(" + id + ")/" + singleValuedNavigationPropertyName + "/$ref",
            { "@odata.id": _internalConfig.webApiUrl + relatedCollection + "(" + relatedId + ")" }, header)
            .then(function () { });
    }

    /**
     * Removes a reference to an entity for a single-valued navigation property. (1:N)
     *
     * @param {string} collection - Entity collection name that contains an attribute.
     * @param {string} id - Entity record Id that contains an attribute.
     * @param {string} singleValuedNavigationPropertyName - Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.disassociateSingleValued = function (collection, id, singleValuedNavigationPropertyName, impersonateUserId) {

        ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.disassociateSingleValued", "collection");
        id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.disassociateSingleValued", "id");
        ErrorHelper.stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.disassociateSingleValued", "singleValuedNavigationPropertyName");

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.associate", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        return _sendRequest("DELETE", collection + "(" + id + ")/" + singleValuedNavigationPropertyName + "/$ref", null, header)
            .then(function () { });
    }

    /**
     * Executes an unbound function (not bound to a particular entity record)
     *
     * @param {string} functionName - The name of the function.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.executeUnboundFunction = function (functionName, parameters, impersonateUserId) {
        return _executeFunction(functionName, parameters, null, null, impersonateUserId);
    }

    /**
     * Executes a bound function
     *
     * @param {string} id - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
     * @param {string} functionName - The name of the function.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.executeBoundFunction = function (id, collection, functionName, parameters, impersonateUserId) {
        return _executeFunction(functionName, parameters, collection, id, impersonateUserId);
    }

    /**
     * Executes a function
     *
     * @param {string} id - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
     * @param {string} functionName - The name of the function.
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    var _executeFunction = function (functionName, parameters, collection, id, impersonateUserId) {

        ErrorHelper.stringParameterCheck(functionName, "DynamicsWebApi.executeFunction", "functionName");
        var url = functionName + Utility.buildFunctionParameters(parameters);

        if (collection != null) {
            ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.executeFunction", "collection");
            id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.executeFunction", "id");

            url = collection + "(" + id + ")/" + url;
        }

        var header = {};

        if (impersonateUserId) {
            header["MSCRMCallerID"] = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.executeFunction", "impersonateUserId");
        }

        return _sendRequest("GET", url, null, header).then(function (response) {
            if (response.data) {
                return response.data;
            }
        });
    }

    /**
     * Executes an unbound Web API action (not bound to a particular entity record)
     *
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} requestObject - Action request body object.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.executeUnboundAction = function (actionName, requestObject, impersonateUserId) {
        return _executeAction(actionName, requestObject, null, null, impersonateUserId);
    }

    /**
     * Executes a bound Web API action (bound to a particular entity record)
     *
     * @param {string} id - A String representing the GUID value for the record.
     * @param {string} collection - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} requestObject - Action request body object.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    this.executeBoundAction = function (id, collection, actionName, requestObject, impersonateUserId) {
        return _executeAction(actionName, requestObject, collection, id, impersonateUserId);
    }

    /**
     * Executes a Web API action
     *
     * @param {string} [id] - A String representing the GUID value for the record.
     * @param {string} [collection] - The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.
     * @param {string} actionName - The name of the Web API action.
     * @param {Object} requestObject - Action request body object.
     * @param {string} [impersonateUserId] - A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
     * @returns {Promise}
     */
    var _executeAction = function (actionName, requestObject, collection, id, impersonateUserId) {

        ErrorHelper.stringParameterCheck(actionName, "DynamicsWebApi.executeAction", "actionName");
        var url = actionName;

        if (collection != null) {
            ErrorHelper.stringParameterCheck(collection, "DynamicsWebApi.executeAction", "collection");
            id = ErrorHelper.guidParameterCheck(id, "DynamicsWebApi.executeAction", "id");

            url = collection + "(" + id + ")/" + url;
        }

        var header = {};

        if (impersonateUserId != null) {
            impersonateUserId = ErrorHelper.guidParameterCheck(impersonateUserId, "DynamicsWebApi.executeAction", "impersonateUserId");
            header["MSCRMCallerID"] = impersonateUserId;
        }

        return _sendRequest("POST", url, requestObject, header).then(function (response) {
            if (response.data) {
                return response.data;
            }
        });
    }

    /**
     * Creates a new instance of DynamicsWebApi
     *
     * @param {DWAConfig} [config] - configuration object.
     * @returns {DynamicsWebApi}
     */
    this.initializeInstance = function (config) {
        if (!config) {
            config = _internalConfig;
        }

        return new DynamicsWebApi(config);
    }
};

module.exports = DynamicsWebApi;