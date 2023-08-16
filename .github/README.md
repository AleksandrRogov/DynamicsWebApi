# DynamicsWebApi for Microsoft Dynamics 365 CE (CRM) / Microsoft Dataverse Web API (formerly known as Microsoft Common Data Service Web API) 

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/AleksandrRogov/DynamicsWebApi/build-test-coverage.yml?style=flat-square)](https://github.com/AleksandrRogov/DynamicsWebApi/actions/workflows/build-test-coverage.yml)
[![Coveralls](https://img.shields.io/coveralls/AleksandrRogov/DynamicsWebApi.svg?style=flat-square)](https://coveralls.io/github/AleksandrRogov/DynamicsWebApi)
![npm](https://img.shields.io/npm/dm/dynamics-web-api?style=flat-square)
![npm](https://img.shields.io/npm/dt/dynamics-web-api?style=flat-square)

DynamicsWebApi is a Microsoft Dataverse Web API helper library written in Typescript.

It is compatible with: Microsoft Dataverse; Microsoft Dynamics 365: Customer Service, Field Service, Marketing, Project Operations, Talents, Sales and any model-driven application built on Microsoft Power Apps platform. 
As well as Microsoft Dynamics 365 CE (online), Microsoft Dynamics 365 CE (on-premises), Microsoft Dynamics CRM 2016, Microsoft Dynamics CRM Online.

### **This documentation is for version 2.x. If you are working with version 1.x, please check [this instead](https://github.com/AleksandrRogov/DynamicsWebApi/tree/v1).**

If you want to upgrade from v1 - v2 breaking changes are [here](/.github/BREAKING_CHANGES_V2.md). List of new features in v2 is [here](/.github/NEW_IN_V2.md).

Please check [DynamicsWebApi Wiki](../../../wiki/) where you will find documentation to DynamicsWebApi API and more.

Browser-compiled script and type definitions can be found in a v2 [dist](https://github.com/AleksandrRogov/DynamicsWebApi/tree/v2/dist) folder.

## Main Features

- **Microsoft Dataverse Search API**. Access the full power of its Search, Suggestion and Autocomplete capabilities.
- **Batch Requests**. Convert all requests into a Batch operation with two lines of code.
- **Simplicity and Automation**. Such as automated paging, big file downloading/uploading in chunks of data, automated conversion of requests with long URLs into a Batch Request in the background and more!
- **CRUD operations**. Including Fetch XML, Actions and Functions in Microsoft Dataverse Web API.
- **Table Definitions (Entity Metadata)**. Query and modify Table, Column, Choice (Option Set) and Relationship definitions.
- **File Fields**. Upload, Download and Delete data stored in the File Fields.
- **Abort Signal and Abort Controller** (Browser and Node.js 15+). Abort requests when they are no longer need to be completed.
- **Node.js and a Browser** support.
- **Proxy Configuration** support.


## Terminology

Check out [Dataverse Terminology](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/understand-terminology). Microsoft has done some changes in the namings of the objects and components of D365 and since DynamicsWebApi has been developing for many years there may be _conflicting_ naming, such as: `createEntity` - which _right now_ means "Create a Table Definition". Dataverse SDK terminology is what the library has been based on. I have no plans on changing that (except in documentation), mainly because Microsoft may change the namings again in the future which will lead to naming issues ...again.

**Please note!** "Dynamics 365" in this readme refers to Microsoft Dataverse (formerly known as Microsoft Common Data Service) / Microsoft Dynamics 365 Customer Engagement / Micorosft Dynamics CRM. **NOT** Microsoft Dynamics 365 Finance and Operations.

***

I maintain this project in my free time and it takes a considerable amount of time to make sure that the library has all new features, 
gets improved and all raised tickets have been answered and fixed in a short amount of time. If you feel that this project has saved your time and you would like to support it, 
then please feel free to sponsor it through [GitHub Sponsors](https://github.com/sponsors/AleksandrRogov).

Also, please check [suggestions and contributions](#contributions) section to learn more about how you can help to improve the library.

***

## Table of Contents

v2 breaking changes are [here](/.github/BREAKING_CHANGES_V2.md). List of new features in v2 is [here](/.github/NEW_IN_V2.md).
* [Getting Started](#getting-started)
  * [Dynamics 365 Web Resource](#dynamics-365-web-resource)
  * [Node.js](#nodejs)
  * [Configuration](#configuration)
    * [Configuration Parameters](#configuration-parameters)
* [Request Examples](#request-examples)
  * [Create a Table Row](#create-a-table-row)
  * [Update a Table Row](#update-a-table-row)
  * [Update a value in a single column](#update-a-value-in-a-single-column)
  * [Upsert a Table Row](#upsert-a-table-row)
  * [Delete a Table Row](#delete-a-table-row)
    * [Delete a value in a single column](#delete-a-value-in-a-single-column)
  * [Retrieve a Table Row](#retrieve-a-table-row)
  * [Retrieve Multiple Table Rows](#retrieve-multiple-table-rows)
    * [Change Tracking](#change-tracking)
    * [Retrieve All Table Rows](#retrieve-all-records)
  * [Count](#count)
    * [Count limitation workaround](#count-limitation-workaround)
  * [Associate](#associate)
  * [Associate for a single-valued navigation property](#associate-for-a-single-valued-navigation-property)
  * [Disassociate](#disassociate)
  * [Disassociate for a single-valued navigation property](#disassociate-for-a-single-valued-navigation-property)
  * [Fetch XML Request](#fetch-xml-request)
    * [Fetch All records](#fetch-all-records)
  * [Execute Web API functions](#execute-web-api-functions)
  * [Execute Web API actions](#execute-web-api-actions)
* [Batch Operations](#batch-operations)
  * [Content-ID to reference requests in a Change Set](#use-content-id-to-reference-requests-in-a-change-set)
  * [Content-ID inside a request payload](#use-content-id-inside-a-request-payload)
  * [Controlling Change Sets](#controlling-change-sets)
  * [Limitations](#batch-operation-limitations)
* [Work with Table Definitions (Entity Metadata)](#work-with-table-definitions-entity-metadata)
  * Tables
  * [Create a new Table Definition](#create-a-new-table-definition)
  * [Retrieve Table Definitions](#retrieve-table-definitions)
  * [Update Table Definitions](#update-table-definitions)
  * [Retrieve Multiple Table Definitions](#retrieve-multiple-table-definitions)
  * Columns
  * [Create Columns](#create-columns)
  * [Retrieve Columns](#retrieve-columns)
  * [Update Columns](#update-columns)
  * [Retrieve Multiple Columns](#retrieve-multiple-columns)
  * [Use requests to query Table and Column definitions](#use-requests-to-query-table-and-column-definitions)
  * Relationships
  * [Create Relationship](#create-relationship)
  * [Update Relationship](#update-relationship)
  * [Delete Relationship](#delete-relationship)
  * [Retrieve Relationship](#retrieve-relationship)
  * [Retrieve Multiple Relationships](#retrieve-multiple-relationships)
  * [Use multi-table lookup columns (Polymorfic Lookup Attributes)](#use-multi-table-lookup-columns-polymorfic-lookup-attributes)
  * Global Option Sets (Choices)
  * [Create Global Option Set](#create-global-option-set)
  * [Update Global Option Set](#update-global-option-set)
  * [Delete Global Option Set](#delete-global-option-set)
  * [Retrieve Global Option Set](#retrieve-global-option-set)
  * [Retrieve Multiple Global Option Sets](#retrieve-multiple-global-option-sets)
* [Retrieve CSDL $metadata document](#retrieve-csdl-metadata-document)
* [Formatted Values and Lookup Columns](#formatted-values-and-lookup-columns)
* [Using Alternate Keys](#using-alternate-keys)
* [Making requests using Entity Logical Names](#making-requests-using-entity-logical-names)
* [Work with File Fields/Columns](#work-with-file-fields)
    * [Upload file](#upload-file)
    * [Download file](#download-file)
    * [Delete file](#delete-file)
* [Work with Dataverse Search API](#work-with-dataverse-search-api)
    * [Search](#search)
    * [Suggest](#suggest)
    * [Autocomplete](#autocomplete)
* [Abort Request](#abort-request)
* [Using Proxy](#using-proxy)
* [Using TypeScript Declaration Files](#using-typescript-declaration-files)
* [In Progress / Feature List](#in-progress--feature-list)
* [Contributions](#contributions)

## Getting Started

### Dynamics 365 Web Resource
To use DynamicsWebApi inside Dynamics 365 you need to download a browser version of the library, it can be found in v2 [dist](https://github.com/AleksandrRogov/DynamicsWebApi/tree/v2/dist) folder.

Upload a script as a JavaScript Web Resource, add it to a table form or reference it in the HTML Web Resource and then initialize the main object:

```ts
//By default DynamicsWebApi makes calls to 
//Web API v9.2 and Search API v1.0
const dynamicsWebApi = new DynamicsWebApi();

const response = await dynamicsWebApi.callFunction("WhoAmI");
Xrm.Navigation.openAlertDialog({ text: `Hello Dynamics 365! My id is: ${response.UserId}` });
```

### Node.js
To use DynamicsWebApi in Node.js install the `dynamics-web-api` package from NPM:

```shell
npm install dynamics-web-api --save
```

Then include it in your script:

```ts
//CommonJS
const DynamicsWebApi = require("dynamics-web-api");

//ESM
import { DynamicsWebApi } from "dynamics-web-api";
```

DynamicsWebApi does not fetch authorization tokens, so you will need to acquire them in your code and pass them back to the library.
Authorization tokens can be acquired using [Microsoft Authentication Library for Node](https://www.npmjs.com/package/@azure/msal-node) or you can write your own logic to retrieve the tokens.

Here is an example using `@azure/msal-node`:

```ts
//app configuraiton must be stored in a safe place
import { Config } from './config.ts';
import { DynamicsWebApi } from 'dynamics-web-api';
import * as MSAL from '@azure/msal-node';

//OAuth Token Endpoint (from your Azure App Registration)
const authorityUrl = 'https://login.microsoftonline.com/<COPY A GUID HERE>';

const msalConfig = {
    auth: {
        authority: authorityUrl,
        clientId: Config.clientId,
        clientSecret: Config.secret,
        knownAuthorities: ['login.microsoftonline.com']
    }
}

const cca = new MSAL.ConfidentialClientApplication(msalConfig);
const serverUrl = 'https://<YOUR ORG HERE>.api.crm.dynamics.com';

//function that acquires a token and passes it to DynamicsWebApi
const acquireToken = async () => {
    try {
        return cca.acquireTokenByClientCredential({
            scopes: [`${serverUrl}/.default`],
        });
    }
    catch (error) {
        //error logging here
        //or a fallback authentication

        //to abort a request just return null
        //or re-throw an error
        return null;
    }
}

//create DynamicsWebApi;
//By default DynamicsWebApi makes calls to 
//Web API v9.2 and Search API v1.0
const dynamicsWebApi = new DynamicsWebApi({
    serverUrl: serverUrl,
    onTokenRefresh: acquireToken
});

try {
    //call any function
    const response = await dynamicsWebApi.callFunction("WhoAmI");
    console.log(`Hello from Dynamics 365! My id is: ${response.UserId}`);
}
catch (error){
    console.log(error);
}
```

### Configuration
To initialize a new instance of DynamicsWebApi with a configuration object, please use the following code:

#### Dynamics 365 Web Resource

```ts
const dynamicsWebApi = new DynamicsWebApi({ dataApi: { version: "9.1" } });
```

The library in Node.js requires a url to the Web API server and a refresh token callback function:

#### Node.js

```ts
const dynamicsWebApi = new DynamicsWebApi({
    serverUrl: "https://myorg.api.crm.dynamics.com",
    dataApi: {
        version: "9.1"
    },
    onTokenRefresh: acquireToken
});
```

You can set the configuration dynamically if needed:

```ts
dynamicsWebApi.setConfig({ dataApi: { version: "9.0" } });
```

#### Configuration Parameters
Property Name | Type | Description
------------ | ------------- | -------------
dataApi | `ApiConfig` | Configuration object for Dataverse Web API. The name is based on the url path `data`.
impersonate | `string` | Impersonates a user based on their systemuserid by adding a "MSCRMCallerID" header. A String representing the GUID value for the Dynamics 365 systemuserid. [More Info](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/impersonate-another-user-web-api)
impersonateAAD | `string` | Impersonates a user based on their Azure Active Directory (AAD) object id by passing that value along with the header "CallerObjectId". A String should represent a GUID value. [More Info](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/impersonate-another-user-web-api)
includeAnnotations | `string` | Defaults Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types.
maxPageSize | `number` | Defaults the odata.maxpagesize preference. Use to set the number of entities returned in the response.
onTokenRefresh | `Function` | A callback function that triggered when DynamicsWebApi requests a new OAuth token. (At this moment it is done before each call to Dynamics 365, as [recommended by Microsoft](https://msdn.microsoft.com/en-ca/library/gg327838.aspx#Anchor_2)).
organizationUrl | `string` | Dynamics 365 Web Api organization URL. It is required when used in Node.js application (outside web resource). Example: "https://myorg.api.crm.dynamics.com/".
proxy | `Object` | Proxy configuration object. [More Info](#using-proxy)
returnRepresentation | `boolean` | Defaults Prefer header with value "return=representation". Use this property to return just created or updated entity in a single request.
searchApi | `ApiConfig` | Configuration object for Dataverse Search API. The name is based on the url path `search`.
serverUrl | `string` | The url to Dataverse API server, for example: https://contoso.api.crm.dynamics.com/. It is required when used in Node.js application.
timeout | `number` | Sets a number of milliseconds before a request times out.
useEntityNames | `boolean` | Indicates whether to use entity logical names instead of collection logical names during requests.

**Note!**
`serverUrl` and `onTokenRefresh` are required when DynamicsWebApi used in a Node.js application.

**Important!** 
If you are using `DynamicsWebApi` **outside Microsoft Dynamics 365** and set `useEntityNames` to `true` **the first request** to Web Api will fetch `LogicalCollectionName` and `LogicalName` from `EntityMetadata` for all entities. It does not happen when `DynamicsWebApi` is used in Microsoft Dynamics 365 Web Resources (there is no additional request, no impact on perfomance).

**ApiConfig** Properties:

| Property Name | Type | Description |
|--------|--------|--------|
| path | `string` | A path to API, for example: "data" or "search". Optional. |
| version | `string` | API Version, for example: "1.0" or "9.2". Optional. |

Both `dataApi` and `searchApi` can be omitted from a configuration. Their default values are:

```js
//dataApi
{
    path: "data",
    version: "9.2"
}

//searchApi
{
    path: "search",
    version: "1.0"
}
```

**dataApi** properties:
| Property Name | Type | Description |
|--------|--------|--------|
| path | `String` | Optional. A path to API, default: "data". |
| version | `String` | Optional. API Version, default: "9.2". |

**searchApi** properties:
| Property Name | Type | Description |
|--------|--------|--------|
| path | `String` | Optional. A path to API, default: "search". |
| version | `String` | Optional. API Version, default: "1.0". |

## Request Examples

Please use [DynamicsWebApi Wiki](../../../wiki/) for an object reference. It is automatically generated and I could not find a better doc generator, pardon me for that. If you know a good ".d.ts -> .md" doc generator - let me know!

The following table describes all __possible__ properties that can be set in `request` object.

__Please note!__ Not all operaions accept all properties and if 
by mistake an invalid property has been specified you will receive either an error saying that the request is invalid or the response will not have expected results.

Property Name | Type | Operation(s) Supported | Description
------------ | ------------- | ------------- | -------------
action | `Object` | `callAction` | A JavaScript object that represents a Dynamics 365 Web API action.
actionName | `string` | `callAction` | Web API Action name.
addAnnotations | `boolean` | `retrieveCsdlMetadata` | If set to `true` the document will include many different kinds of annotations that can be useful. Most annotations are not included by default because they increase the total size of the document.
apply | `string` | `retrieveMultiple`, `retrieveAll` | Sets the $apply system query option to aggregate and group your data dynamically. [More Info](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/query-data-web-api#aggregate-and-grouping-results)
async | `boolean` | All | **XHR requests only!** Indicates whether the requests should be made synchronously or asynchronously. Default value is `true` (asynchronously).
bypassCustomPluginExecution | `boolean` | `create`, `update`, `upsert`, `delete` | If set to true, the request bypasses custom business logic, all synchronous plug-ins and real-time workflows are disabled. Check for special exceptions in Microsft Docs. [More Info](https://docs.microsoft.com/en-us/powerapps/developer/data-platform/bypass-custom-business-logic)
collection | `string` | All | Entity Collection name.
contentId | `string` | `create`, `update`, `upsert`, `deleteRecord` | **BATCH REQUESTS ONLY!** Sets Content-ID header or references request in a Change Set. [More Info](https://www.odata.org/documentation/odata-version-3-0/batch-processing/)
continueOnError | `boolean` | `executeBatch` | **BATCH REQUESTS ONLY!** Sets Prefer header to `odata.continue-on-error` that allows more requests be processed when errors occur. The batch request will return `200 OK` and individual response errors will be returned in the batch response body. [More Info](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/execute-batch-operations-using-web-api#handling-errors)
count | `boolean` | `retrieveMultiple`, `retrieveAll` | Boolean that sets the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000 (per page). Do not use $top with $count!
data | `Object` or `ArrayBuffer` / `Buffer` (for node.js) | `create`, `update`, `upsert`, `uploadFile` | A JavaScript object that represents Dynamics 365 entity, action, metadata and etc. 
duplicateDetection | `boolean` | `create`, `update`, `upsert` | **D365 Web API v9+** Boolean that enables duplicate detection. [More Info](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/webapi/update-delete-entities-using-web-api#check-for-duplicate-records)
expand | `Expand[]` | `retrieve`, `retrieveMultiple`, `create`, `update`, `upsert` | An array of Expand Objects (described below the table) representing the $expand OData System Query Option value to control which related records are also returned.
fetchXml | `string` | `fetch`, `fetchAll` | Property that sets FetchXML - a proprietary query language that provides capabilities to perform aggregation.
fieldName | `string` | `uploadFile`, `downloadFile`, `deleteRequest` | **D365 Web API v9.1+** Use this option to specify the name of the file attribute in Dynamics 365. [More Info](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/file-attributes)
fileName | `string` | `uploadFile` | **D365 Web API v9.1+** Specifies the name of the filefilter | String | `retrieve`, `retrieveMultiple`, `retrieveAll` | Use the $filter system query option to set criteria for which entities will be returned.
functionName | `string` | `callFunction` | Name of a D365 Web Api function.
ifmatch | `string` | `retrieve`, `update`, `upsert`, `deleteRecord` | Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests. [More Info](https://msdn.microsoft.com/en-us/library/mt607711.aspx)
ifnonematch | `string` | `retrieve`, `upsert` | Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. [More Info](https://msdn.microsoft.com/en-us/library/mt607711.aspx).
impersonate | `string` | All | Impersonates a user based on their systemuserid by adding a "MSCRMCallerID" header. A String representing the GUID value for the Dynamics 365 systemuserid. [More Info](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/impersonate-another-user-web-api)
impersonateAAD | `string` | All | Impersonates a user based on their Azure Active Directory (AAD) object id by passing that value along with the header "CallerObjectId". A String should represent a GUID value. [More Info](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/impersonate-another-user-web-api)
inChangeSet | `boolean` | All, except `uploadFile`, `downloadFile`, `retrieveAll`, `countAll`, `fetchAll`, `search`, `suggest`, `autocomplete` | Indicates if an operation must be included in a Change Set or not. Works in Batch Operations only. `true` by default, except for GET operations - they are not allowed in Change Sets.
includeAnnotations | `string` | `retrieve`, `retrieveMultiple`, `retrieveAll`, `create`, `update`, `upsert` | Sets Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types.
key | `string` | `retrieve`, `create`, `update`, `upsert`, `deleteRecord`, `uploadFile`, `downloadFile`, `callAction`, `callFunction` | A string representing collection record's Primary Key (GUID) or Alternate Key(s).
maxPageSize | `number` | `retrieveMultiple`, `retrieveAll` | Sets the odata.maxpagesize preference value to request the number of entities returned in the response.
mergeLabels | `boolean` | `update` | **Metadata Update only!** Sets `MSCRM.MergeLabels` header that controls whether to overwrite the existing labels or merge your new label with any existing language labels. Default value is `false`. [More Info](https://msdn.microsoft.com/en-us/library/mt593078.aspx#bkmk_updateEntities)
metadataAttributeType | `string` | `retrieve`, `update` | Casts the Attributes to a specific type. (Used in requests to Attribute Metadata) [More Info](https://msdn.microsoft.com/en-us/library/mt607522.aspx#Anchor_4)
navigationProperty | `string` | `retrieve`, `create`, `update` | A string representing the name of a single-valued navigation property. Useful when needed to retrieve information about a related record in a single request.
navigationPropertyKey | `string` | `retrieve`, `create`, `update` | A string representing navigation property's Primary Key (GUID) or Alternate Key(s). (For example, to retrieve Attribute Metadata)
noCache | `boolean` | All | If set to `true`, DynamicsWebApi adds a request header `Cache-Control: no-cache`. Default value is `false`.
orderBy | `string[]` | `retrieveMultiple`, `retrieveAll` | An array (of strings) representing the order in which items are returned using the $orderby system query option. Use the asc or desc suffix to specify ascending or descending order respectively. The default is ascending if the suffix isn't applied.
pageNumber | `number` | `fetch` | Sets a page number for Fetch XML request ONLY!
pagingCookie | `string` | `fetch` | Sets a paging cookie for Fetch XML request ONLY!
parameters | `Object` | `callFunction` | Function's input parameters. Example: `{ param1: "test", param2: 3 }`. 
partitionId | `string` | `create`, `update`, `upsert`, `delete`, `retrieve`, `retrieveMultiple` | Sets a unique partition key value of a logical partition for non-relational custom entity data stored in NoSql tables of Azure heterogenous storage. [More Info](https://docs.microsoft.com/en-us/power-apps/developer/data-platform/webapi/azure-storage-partitioning)
queryParams | `string[]` | `retrieveMultiple`, `retrieveAll` | Additional query parameters that either have not been implemented yet or they are [parameter aliases](https://docs.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query-data-web-api#use-parameter-aliases-with-system-query-options) for "$filter" and "$orderBy". **Important!** These parameters ARE NOT URI encoded!
returnRepresentation | `boolean` | `create`, `update`, `upsert` | Sets Prefer header request with value "return=representation". Use this property to return just created or updated entity in a single request.
savedQuery | `string` | `retrieve` | A String representing the GUID value of the saved query.
select | `string[]` | `retrieve`, `retrieveMultiple`, `retrieveAll`, `update`, `upsert` | An array (of Strings) representing the $select OData System Query Option to control which attributes will be returned.
signal | `AbortSignal` | All | Specifies an `AbortSignal` that can be used to abort a request if required via an `AbortController` object. [More Info](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
timeout | `number` | All | Sets a number of milliseconds before a request times out.
token | `string` | All | Authorization Token. If set, onTokenRefresh will not be called.
top | `number` | `retrieveMultiple`, `retrieveAll` | Limit the number of results returned by using the $top system query option. Do not use $top with $count!
trackChanges | `boolean` | `retrieveMultiple`, `retrieveAll` | Sets Prefer header with value 'odata.track-changes' to request that a delta link be returned which can subsequently be used to retrieve entity changes. __Important!__ Change Tracking must be enabled for the entity. [More Info](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/use-change-tracking-synchronize-data-external-systems#enable-change-tracking-for-an-entity)
userQuery | `string` | `retrieve` | A String representing the GUID value of the user query.

The following table describes Expand Object properties:

Property Name | Type | Description
------------ | ------------- | -------------
expand | `Expand[]` | An array of Expand Objects representing the $expand OData System Query Option value to control which related records are also returned.
filter | `string` | Use the $filter system query option to set criteria for which related entities will be returned.
orderBy | `string[]` | An Array (of strings) representing the order in which related items are returned using the $orderby system query option. Use the asc or desc suffix to specify ascending or descending order respectively. The default is ascending if the suffix isn't applied.
property | `string` | A name of a single-valued navigation property which needs to be expanded.
select | `string[]` | An Array (of strings) representing the $select OData System Query Option to control which attributes will be returned.
top | `number` | Limit the number of results returned by using the $top system query option.

All requests to Web API that have long URLs (more than 2000 characters) are automatically converted to a Batch Request.
This feature is very convenient when you make a call with big Fetch XMLs. No special parameters needed to do a convertation.

### Create a table row

```ts
//declaring interface for a Lead entity (declaration can be done in d.ts file)
interface Lead {
    leadid?: string,
    subject?: string,
    firstname?: string,
    lastname?: string,
    jobtitle?: string
}

//init an object representing Dynamics 365 entity
const lead: Lead = {
    subject: "Test WebAPI",
    firstname: "Test",
    lastname: "WebAPI",
    jobtitle: "Title"
};

//init DynamicsWebApi request
const request: DynamicsWebApi.CreateRequest = {
    collection: "leads",
    data: lead,
    returnRepresentation: true
}

//call dynamicsWebApi.create function
//let's use Lead here because we set returnRepresentation to `true`
//if the type was ommitted here then the result would be of type `any`
const result = await dynamicsWebApi.create<Lead>(request);

//do something with a record here
const leadId = result.leadid;
```

### Update a table row

```ts
//declaring interface for a Lead entity (declaration can be done in d.ts file)
interface Lead {
    leadid?: string,
    subject?: string,
    fullname?: string,
    jobtitle?: string
}

//init DynamicsWebApi request
const request: DynamicsWebApi.UpdateRequest = {
    key: "7d577253-3ef0-4a0a-bb7f-8335c2596e70",
    collection: "leads",
    data: {
        subject: "Test update",
        jobtitle: "Developer"
    },
    returnRepresentation: true,
    select: ["fullname"]
};

//call dynamicsWebApi.update function
//let's use Lead here because we set returnRepresentation to `true`
//if the type was ommitted here then the result would be of type `any`
const result = await dynamicsWebApi.update<Lead>(request);

//do something with a fullname of a recently updated entity record
const fullname = result.fullname;
```

### Update a value in a single column

```ts
//initialize key value pair object
const request: DynamicsWebApi.UpdateSinglePropertyRequest = {
    collection: "leads",
    key: "7d577253-3ef0-4a0a-bb7f-8335c2596e70",
    fieldValuePair: { subject: "Update Single" }
};

//perform an update single property operation
await dynamicsWebApi.updateSingleProperty(request);

//do something after a succesful operation
```

### Upsert a table row

```ts
const leadId = "7d577253-3ef0-4a0a-bb7f-8335c2596e70";

const request: DynamicsWebApi.UpsertRequest = {
    key: leadId,
    collection: "leads",
    returnRepresentation: true,
    select: ["fullname"],
    data: {
        subject: "Test upsert"
    },
    ifnonematch: "*" //to prevent update
};

const result = dynamicsWebApi.upsert<Lead>(request);
if (result != null) {
    //record created
}
else {
    //update prevented
}
```

### Delete a table row

```ts
//delete with optimistic concurrency
const request: DynamicsWebApi.DeleteRequest = {
    key: leadId,
    collection: "leads",
    ifmatch: 'W/"470867"'
}

const isDeleted = await dynamicsWebApi.deleteRecord(request);
if (isDeleted){
    //record has been deleted
}
else{
    //record has not been deleted
}
```
#### Delete a value in a single column
```ts
//delete with optimistic concurrency
const request: DynamicsWebApi.DeleteRequest = {
    key: leadId,
    collection: "leads",
    fieldName: "subject"
}

await dynamicsWebApi.deleteRecord(request);
```
### Retrieve a table row

```ts
//declaring interface for a Lead entity (declaration can be done in d.ts file)
interface Lead {
    leadid?: string,
    subject?: string,
    fullname?: string,
    jobtitle?: string
}

const request: DynamicsWebApi.RetrieveRequest = {
    key: "7d577253-3ef0-4a0a-bb7f-8335c2596e70",
    collection: "leads",
    select: ["fullname", "subject"],

    //ETag value with the If-None-Match header to request data to be retrieved only 
    //if it has changed since the last time it was retrieved.
    ifnonematch: 'W/"468026"',

    //Retrieved record will contain formatted values
    includeAnnotations: "OData.Community.Display.V1.FormattedValue"
};

//call dynamicsWebApi.retrieve function
//if the Lead type was ommitted here then the result would be of type `any`
const result = await dynamicsWebApi.retrieve<Lead>(request);

//do something with a retrieved record
```

#### Retrieve a reference to a related table row using a single-valued navigation property

It is possible to retrieve a reference to the related entity. In order to do that: `select` property
must contain only a single value representing a name of a [single-valued navigation property](https://msdn.microsoft.com/en-us/library/mt607990.aspx#Anchor_5) 
and it must have a suffix `/$ref` attached to it. Example:

```ts
const leadId = "7d577253-3ef0-4a0a-bb7f-8335c2596e70";

const request: DynamicsWebApi.RetrieveRequest = {
    collection: "leads",
    key: leadId,
    select: ["onwerid/$ref"]
}

//perform a retrieve operaion
const reference = await dynamicsWebApi.retrieve(request);
const ownerId = reference.id;
const collectionName = reference.collection; // systemusers or teams
```

#### Retrieve a related table row using a single-valued navigation property

In order to retrieve a related record by a single-valued navigation property you need to add a prefix "/" to the __first__ element in a `select` array: 
`select: ["/ownerid", "fullname"]`. The first element must be the name of a [single-valued navigation property](https://msdn.microsoft.com/en-us/library/mt607990.aspx#Anchor_5) 
and it must contain a prefix "/"; all other elements in a `select` array will represent attributes of __the related entity__. Examples:

```ts
const recordId = "7d577253-3ef0-4a0a-bb7f-8335c2596e70";

const request: DynamicsWebApi.RetrieveRequest = {
    key: recordId,
    collection: "new_tests",
    select: ["/new_ParentLead", "fullname", "subject"]
}

//perform a retrieve operaion
const parentLead = await dynamicsWebApi.retrieve<Lead>(request);

const fullname = parentLead.fullname;
//... and etc
```

Same result can be achieved by setting `request.navigationProperty`:

```ts
const request: DynamicsWebApi.RetrieveRequest = {
    key: recordId,
    collection: "new_tests",
    navigationProperty: "new_ParentLead", //use request.navigationProperty
    select: ["fullname", "subject"]
}

//perform a retrieve operaion
const parentLead = await dynamicsWebApi.retrieve<Lead>(request);

const fullname = parentLead.fullname;
//... and etc
```

### Retrieve multiple table rows

```ts
//declaring interface for a Lead entity (declaration can be done in d.ts file)
interface Lead {
    leadid?: string,
    subject?: string,
    fullname?: string
}

const request: DynamicsWebApi.RetrieveMultipleRequest = {
    collection: "leads",
    select: ["fullname", "subject"],
    filter: "statecode eq 0",
    maxPageSize: 5,
    count: true
}

const response = await dynamicsWebApi.retrieveMultiple<Lead>(request);

const count = response.oDataCount;
const nextLink = response.oDataNextLink;
const records = response.value;
```

#### Change Tracking

```ts
//set the request parameters
const request: DynamicsWebApi.RetrieveMultipleRequest = {
    collection: "leads",
    select: ["fullname", "subject"],
    trackChanges: true
};

//perform a multiple records retrieve operation (1)
const response1 = await dynamicsWebApi.retrieveMultiple<Lead>(request).then(function (response) {

const deltaLink = response1.oDataDeltaLink;
//make other requests to Web API
//...
//(2) only retrieve changes:
const response2 = await dynamicsWebApi.retrieveMultiple<Lead>(request, deltaLink);
//response2 contains only changed records between the first retrieveMultiple (1) and the second one (2)
```

#### Retrieve All records

The following function retrieves records and goes through all pages automatically.

```ts
//perform a multiple records retrieve operation
const response = await dynamicsWebApi.retrieveAll<Lead>({ 
    collection: "leads", 
    select: ["fullname", "subject"], 
    filter: "statecode eq 0"
});

const records = response.value;
//do something else with a records array. Access a record: records[0].subject;
```

### Count

It is possible to count records separately from RetrieveMultiple call. In order to do that use the following snippet:

**IMPORTANT!** The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned.

```ts
const count = await dynamicsWebApi.count({ 
    collection: "leads", 
    filter: "statecode eq 0"
});

//do something with count here
```

#### Count limitation workaround

The following function can be used to count all records in a collection. It's a workaround and just counts the number of objects in the array 
returned in `retrieveAll`.

Downside of this workaround is that it does not only return a count number but also all data for records in a collection. In order to make a small
optimisation always provide a column for select paramete, it will reduce a size of the response significantly. 

```ts
const count = await dynamicsWebApi.countAll({ 
    collection: "leads", 
    filter: "statecode eq 0",
    //if you use this workaround, always provide a column 
    //to limit a response size
    select: ["leadid"]
});
```

FYI, in the majority of cases it is better to use Fetch XML aggregation, but take into a consideration that it is also limited to 50000 records 
by default.

### Associate

```ts
const accountId = "00000000-0000-0000-0000-000000000001";
const leadId = "00000000-0000-0000-0000-000000000002";

//associate lead reacord to account
const request: DynamicsWebApi.AssociateRequest = {
    collection: "accounts",
    primaryKey: accountId,
    relationshipName: "lead_parent_account",
    relatedCollection: "leads",
    relatedKey: leadId
}

await dynamicsWebApi.associate(request);
//does not have any return value
```

### Associate for a single-valued navigation property

The name of a single-valued navigation property can be retrieved by using a `GET` request with a header `Prefer:odata.include-annotations=Microsoft.Dynamics.CRM.associatednavigationproperty`, 
then individual records in the response will contain the property `@Microsoft.Dynamics.CRM.associatednavigationproperty` which is the name of the needed navigation property.

For example, there is an entity with a logical name `new_test`, it has a lookup attribute to `lead` entity called `new_parentlead` and schema name `new_ParentLead` which is needed single-valued navigation property.

```ts
const new_testid = "00000000-0000-0000-0000-000000000001";
const leadId = "00000000-0000-0000-0000-000000000002";

const request: DynamicsWebApi.AssociateSingleValuedRequest = {
    collection: "new_tests",
    primaryKey: new_testid,
    navigationProperty: "new_ParentLead",
    relatedCollection: "leads",
    relatedKey: leadId
}

await dynamicsWebApi.associateSingleValued(request);
//does not have any return value
```

### Disassociate

```ts
const accountId = "00000000-0000-0000-0000-000000000001";
const leadId = "00000000-0000-0000-0000-000000000002";

const request: DynamicsWebApi.DisassociateRequest = {
    collection: "accounts",
    primaryKey: accountId,
    relationshipName: "lead_parent_account",
    relatedKey: leadId
}

await dynamicsWebApi.disassociate(request);
//does not have any return value
```

### Disassociate for a single-valued navigation property
Current request removes a reference to an entity for a single-valued navigation property. 
The following code snippet uses an example shown in [Associate for a single-valued navigation property](#associate-for-a-single-valued-navigation-property).

```ts
const new_testid = "00000000-0000-0000-0000-000000000001";

const request: DynamicsWebApi.AssociateSingleValuedRequest = {
    collection: "new_tests",
    primaryKey: new_testid,
    navigationProperty: "new_ParentLead"
}

await dynamicsWebApi.disassociateSingleValued(request);
//does not have any return value
```

### Fetch XML Request

```ts
//declaring interface for an Account entity (declaration can be done in d.ts file)
interface Account {
    accountid?: string,
    name?: string
}

//build a fetch xml
const fetchXml = '<fetch mapping="logical">' +
                    '<entity name="account">' +
                        '<attribute name="accountid"/>' +
                        '<attribute name="name"/>' +
                    '</entity>' +
               '</fetch>';

const request: DynamicsWebApi.FetchXmlRequest = {
    collection: "accounts",
    fetchXml: fetchXml
}

const result = await dynamicsWebApi.fetch<Account>(request);
//do something with results here; access records result.value[0].accountid 
```

#### Paging

```ts
//build a fetch xml
const fetchXml = '<fetch mapping="logical">' +
                    '<entity name="account">' +
                        '<attribute name="accountid"/>' +
                        '<attribute name="name"/>' +
                    '</entity>' +
               '</fetch>';

const request: DynamicsWebApi.FetchXmlRequest = {
    collection: "accounts",
    fetchXml: fetchXml
}

const page1 = await dynamicsWebApi.fetch<Account>(request);
//do something with results here; access records page1.value[0].accountid

request.pageNumber = page1.PagingInfo.nextPage;
request.pagingCookie = page1.PagingInfo.cookie;

const page2 = await dynamicsWebApi.fetch<Account>(request);
//do something with results here; access records page2.value[0].accountid

request.pageNumber = page2.PagingInfo.nextPage;
request.pagingCookie = page2.PagingInfo.cookie;

const page3 = await dynamicsWebApi.fetch<Account>(request);
//and so on... or use a recoursive loop.
```

#### Fetch All records

The following function executes a FetchXml request and goes through all pages automatically:

```ts
const fetchXml = '<fetch mapping="logical">' +
                    '<entity name="account">' +
                        '<attribute name="accountid"/>' +
                        '<attribute name="name"/>' +
                    '</entity>' +
               '</fetch>';

const result = await dynamicsWebApi.fetchAll<Account>({
    collection: "accounts", 
    fetchXml: fetchXml
});
//do something with results here; access records result.value[0].accountid
```

### Execute Web API functions

#### Bound functions

```ts
//declaring needed types for the Function (types can be declared in *.d.ts file), if needed
enum UserResponse {
    Basic = 0,
    Local = 1,
    Deep = 2,
    Global = 3
}

interface RolePrivilege {
    Depth: UserResponse,
    PrivilegeId: string,
    BusinessUnitId: string
}

interface RetrieveTeamPrivilegesResponse {
    RolePrivileges: RolePrivilege[]
}

const teamId = "00000000-0000-0000-0000-000000000001";

const request: DynamicsWebApi.BoundFunctionRequest = {
    id: teamId,
    collection: "teams",
    functionName: "Microsoft.Dynamics.CRM.RetrieveTeamPrivileges"
}

const result = await dynamicsWebApi.callFunction<RetrieveTeamPrivilegesResponse>(request);
//do something with a result
```

#### Unbound functions

```ts
//declaring needed types for the Function (types can be declared in *.d.ts file), if needed
interface GetTimeZoneCodeByLocalizedNameResponse {
    TimeZoneCode: number
}

const parameters = {
    LocalizedStandardName: "Pacific Standard Time",
    LocaleId: 1033
};

const request: DynamicsWebApi.UnboundFunctionRequest = {
    parameters: parameters,
    functionName: "GetTimeZoneCodeByLocalizedName"
}

const result = await dynamicsWebApi.callFunction<GetTimeZoneCodeByLocalizedNameResponse>(request);
const timeZoneCode = result.TimeZoneCode;
```

Unbound Web API functions can also be called using a short form (in case there are no parameters), for example:

```ts
const whoAmIResult = await dynamicsWebApi.callFunction("WhoAmI");
```

### Execute Web API actions

#### Bound actions

```ts
interface LetterAction {
    Target: {
        activityid: string,
        "@data.type": string
    } 
}

interface LetterActionResponse {
    QueueItemId: string
}

const queueId = "00000000-0000-0000-0000-000000000001";
const actionRequest: DynamicsWebApi.BoundActionRequest<LetterAction> = {
    key: queueId,
    collection: "queues",
    actionName: "Microsoft.Dynamics.CRM.AddToQueue",
    action: {
        Target: {
            activityid: "00000000-0000-0000-0000-000000000002",
            "@odata.type": "Microsoft.Dynamics.CRM.letter"
        }
    }
}

const result = await dynamicsWebApi.callAction<LetterActionResponse>(actionRequest);
const queueItemId = result.QueueItemId;
```

#### Unbound actions

```ts
interface WinOpportunityAction {
    Status: number,
    OpportunityClose: {
        subject: string,
        "opportunityid@odata.bind": string
    }
}

const opportunityId = "b3828ac8-917a-e511-80d2-00155d2a68d2";
const actionRequest: DynamicsWebApi.UnboundActionRequest<WinOpportunityAction> = {
    actionName: "WinOpportunity",
    action: {
        Status: 3,
        OpportunityClose: {
            subject: "Won Opportunity",

            //DynamicsWebApi will add full url if the property contains @odata.bind suffix
            //but it is also possible to provide a full url to the entity record manually
            "opportunityid@odata.bind": "opportunities(" + opportunityId + ")"
        }
    }
}

await dynamicsWebApi.callAction(actionRequest);
```

## Batch Operations

Batch Operations bundle multiple requests into a single one and have the following advantages:

* Reduces a number of requests sent to the Web API server. `Each user is allowed up to 60,000 API requests, per organization instance, within five minute sliding interval.` [More Info](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/api-limits)
* Provides a way to run multiple operations in a single transaction. If any operation that changes data (within a single changeset) fails all completed ones will be rolled back.
* All operations within a batch request run consequently (FIFO).

DynamicsWebApi provides a straightforward way to execute Batch Operations which may not always be simple to compose.

**Please Note!** By default, all operations that modify data, such as: CREATE, UPDATE, UPSERT, PUT and DELETE - are automatically made atomic (combined in Change Sets). You can change this behaviour by setting `inChangeSet` to `false`. [More Info](#controlling-change-sets)

The following example bundles 2 retrieve multiple operations and an update:

```ts
//when you want to start a batch operation call the following function:
//it is important to call it, otherwise all operations below will be executed right away.
dynamicsWebApi.startBatch();

//call necessary operations just like you would normally do.
//these calls will be converted into a single batch request
dynamicsWebApi.retrieveMultiple({ collection: "accounts" });
dynamicsWebApi.update({
    key: '00000000-0000-0000-0000-000000000002',
    collection: "contacts",
    data: { firstname: "Test", lastname: "Batch!" }
});
dynamicsWebApi.retrieveMultiple({ collection: "contacts" });

//execute a batch request:
const responses = await dynamicsWebApi.executeBatch();
//'responses' is an array of responses of each individual request
//they have the same sequence as the calls between startBatch() and executeBatch()
//in this case responses.length is 3

//dynamicsWebApi.retrieveMultiple response:
const accounts = responses[0];
//dynamicsWebApi.update response
const isUpdated = responses[1]; //should be 'true'
//dynamicsWebApi.retrieveMultiple response:
const contacts = responses[2]; //will contain an updated contact
```

The next example shows how to run multiple operations in a single transaction which means if at least one operation fails all completed ones will be rolled back which ensures a data consistency.

```ts
//for example, a user did a checkout and we need to create two orders

const order1 = {
    name: "1 year membership",
    "customerid_contact@odata.bind": "contacts(00000000-0000-0000-0000-000000000001)"
};

const order2 = {
    name: "book",
    "customerid_contact@odata.bind": "contacts(00000000-0000-0000-0000-000000000001)"
};

dynamicsWebApi.startBatch();

dynamicsWebApi.create({ data: order1, collection: "salesorders" });
dynamicsWebApi.create({ data: order2, collection: "salesorders" });

try {
    const responses = await dynamicsWebApi.executeBatch();
    const salesorderId1 = responses[0];
    const salesorderId2 = responses[1];
}
catch (error){
    //catch error here
    //all completed operations will be rolled back
    alert("Cannot complete a checkout. Please try again later.");
}
```

### Use Content-ID to reference requests in a Change Set

You can reference a request in a Change Set. For example, if you want to create related entities in a single batch request:

```ts
const order = {
    name: "1 year membership"
};

const contact = {
    firstname: "John",
    lastname: "Doe"
};

dynamicsWebApi.startBatch();
dynamicsWebApi.create({ data: order, collection: "salesorders", contentId: "1" });
dynamicsWebApi.create({ data: contact, collection: "customerid_contact", contentId: "$1" });

const responses = await dynamicsWebApi.executeBatch()
const salesorderId = responses[0];
//responses[1]; is undefined <- Dataverse Web API limitation
```

Note that if you are making a request to a navigation property (`collection: "customerid_contact"`), the request won't have a response, it is an OOTB Web API limitation.

**Important!** DynamicsWebApi automatically assigns value to a `Content-ID` if it is not provided, therefore, please set your `Content-ID` value less than 100000.

### Use Content-ID inside a request payload

Another option to make the same request is to use `Content-ID` reference inside a request payload as following:

```ts
const contact = {
    firstname: "John",
    lastname: "Doe"
};

const order = {
    name: "1 year membership",
    //reference a request in a navigation property
    "customerid_contact@odata.bind": "$1"
};

dynamicsWebApi.startBatch();
dynamicsWebApi.create({ data: contact, collection: "contacts", contentId: "1" });
dynamicsWebApi.create({ data: order, collection: "salesorders" });

const responses = await dynamicsWebApi.executeBatch();

//in this case both ids exist in a response
//which makes it a preferred method
const contactId = responses[0];
const salesorderId = responses[1];
```

**Important!** Web API seems to have a limitation (or a bug) where it does not return the response with `returnRepresentation` set to `true`. It happens only if you are trying to return a representation of an entity that is being
linked to another one in a single request. [More Info and examples is in this issue](https://github.com/AleksandrRogov/DynamicsWebApi/issues/112).

### Controlling Change Sets

As mentioned before, by default, all operations that modify data: CREATE, UPDATE, UPSERT, PUT and DELETE - are automatically made atomic (combined in Change Sets). 

In some cases this can be an undesirable behaviour and with v2 there are several ways to make those operations non-atomic: per batch operation and per request. Let's use a code sample above and make **all** operations non-atomic. It can be done by setting `inChangeSet` property to `false`.

**Important!** `contentId` can **only** be used inside the Change Sets. Any `contentId` set in a request won't be included in a non-atomic batch operation! If `$1` parameter was used outside of Change Set you will get an error similar to the following: `Error identified in Payload provided by the user for Entity :'<entity name>'`.

Per batch operation:

```ts
const contact = {
    firstname: "John",
    lastname: "Doe"
};

const order = {
    name: "1 year membership",
    //reference a request in a navigation property
    //"customerid_contact@odata.bind": "$1" <--- commented out because we don't want to get an error
};

dynamicsWebApi.startBatch();
dynamicsWebApi.create({ 
    data: contact, 
    collection: "contacts", 
    contentId: "1", //<--- will not be used
});
dynamicsWebApi.create({ 
    data: order, 
    collection: "salesorders", 
});

const responses = await dynamicsWebApi.executeBatch({
    inChangeSet: false //<--- do not use change sets
});
```

**Important!** There seem to be a bug in Dynamics 365 Web Api (Checked: July 16, 2023) where it does not process the last operation in a batch request (Change Sets work fine). As a workaround, you can add any "GET" operation at the end to make it work, like in the following example. Please let me know if this bug was fixed.

Per request:

```ts
dynamicsWebApi.startBatch();
dynamicsWebApi.create({ 
    data: contact, 
    collection: "contacts", 
    inChangeSet: false //<--- do not include in a change set
});
dynamicsWebApi.create({ 
    data: order, 
    collection: "salesorders", 
    inChangeSet: false //<--- do not include in a change set
});

//this is a workaround to a D365 bug (checked on July 16, 2023)
dynamicsWebApi.retrieveMutliple({
    collection: "contacts",
    top: 1,
    select: ["firstname"]
});

const responses = await dynamicsWebApi.executeBatch();
```

These two samples do the same thing: make all requests non-atomic. 

By setting `inChangeSet:false` per request gives more control over which operation should be included in a change set and which ones do not, for example:

```ts
dynamicsWebApi.startBatch();
dynamicsWebApi.create({ 
    data: contact, 
    collection: "contacts", 
});
dynamicsWebApi.create({ 
    data: order, 
    collection: "salesorders", 
});
dynamicsWebApi.create({
    data: email,
    collection: "emails",
    inChangeSet: false //<--- do not include in a change set
});

const responses = await dynamicsWebApi.executeBatch();
```

The first two requests will be atomic (included in a Change Set) and the last one will be executed separately. So, if for some reason, there was an error during creation of an Email record, the whole operation won't be rolled back and the Contact and Order records will be created in the system.

**Be extra careful** with an order of requests in a Batch Operation, especially if it has a combination of atomic and non-atomic operations in it. For example, if in an example above we move the creation of an Email record above Order - it will create 2 separate change sets for the Contact and for the Order records.

```ts
dynamicsWebApi.startBatch();
//Change Set A starts
dynamicsWebApi.create({ 
    data: contact, 
    collection: "contacts", 
    contentId: "1", 
});
//Change Set A ends
dynamicsWebApi.create({
    data: email,
    collection: "emails",
    inChangeSet: false //<--- do not include in a change set
});
//Change Set B starts
dynamicsWebApi.create({ 
    data: order, 
    collection: "salesorders", 
    //"$1" parameter cannot be used here because it is defined in a Change Set A
    //otherwise, you will get an error
});
//Change Set B ends

const responses = await dynamicsWebApi.executeBatch();
```

In this case, if creation of an Email fails Sales Order won't be created either. If this is an intended behaviour and if the operation must continue despite the errors set `continueOnError` to `true` in `executeBatch`:

```ts
const responses = await dynamicsWebApi.executeBatch({ continueOnError: true });
```

### Batch Operation Limitations

Currently, there are some limitations in DynamicsWebApi Batch Operations:

* Operations that use pagination to recursively retrieve all records cannot be used in a 'batch mode'. These include: `retrieveAll`, `retrieveAllRequest`, `countAll`, `fetchAll`, `executeFetchXmlAll`.
You will get an error saying that the operation is incompatible with a 'batch mode'.

There are also out of the box Web API limitations for batch operations:

* Batch requests can contain up to 1000 individual requests and cannot contain other batch requests.

You can find an official documentation that covers Web API batch requests here: [Execute batch operations using the Web API](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/webapi/execute-batch-operations-using-web-api).

## Work with Table Definitions (Entity Metadata)

Before working with metadata read [the following section from Microsoft Documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query-metadata-web-api).

### Create a new Table Definition

```ts
const entityDefinition = {
    "@odata.type": "Microsoft.Dynamics.CRM.EntityMetadata",
    "Attributes": [
    {
        "AttributeType": "String",
        "AttributeTypeName": {
            "Value": "StringType"
        },
        "Description": {
            "@odata.type": "Microsoft.Dynamics.CRM.Label",
            "LocalizedLabels": [{
                "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                "Label": "Type the name of the bank account",
                "LanguageCode": 1033
            }]
        },
        "DisplayName": {
            "@odata.type": "Microsoft.Dynamics.CRM.Label",
            "LocalizedLabels": [{
                "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                "Label": "Account Name",
                "LanguageCode": 1033
            }]
        },
        "IsPrimaryName": true,
        "RequiredLevel": {
            "Value": "None",
            "CanBeChanged": true,
            "ManagedPropertyLogicalName": "canmodifyrequirementlevelsettings"
        },
        "SchemaName": "new_AccountName",
        "@odata.type": "Microsoft.Dynamics.CRM.StringAttributeMetadata",
        "FormatName": {
            "Value": "Text"
        },
        "MaxLength": 100
    }],
    "Description": {
        "@odata.type": "Microsoft.Dynamics.CRM.Label",
        "LocalizedLabels": [{
            "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
            "Label": "An entity to store information about customer bank accounts",
            "LanguageCode": 1033
        }]
    },
    "DisplayCollectionName": {
        "@odata.type": "Microsoft.Dynamics.CRM.Label",
        "LocalizedLabels": [{
            "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
            "Label": "Bank Accounts",
            "LanguageCode": 1033
        }]
    },
    "DisplayName": {
        "@odata.type": "Microsoft.Dynamics.CRM.Label",
        "LocalizedLabels": [{
            "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
            "Label": "Bank Account",
            "LanguageCode": 1033
        }]
    },
    "HasActivities": false,
    "HasNotes": false,
    "IsActivity": false,
    "OwnershipType": "UserOwned",
    "SchemaName": "new_BankAccount"
};

//entityId is newly created entity id (MetadataId)
const entityId = await dynamicsWebApi.createEntity({ data: entityDefinition });

```

### Retrieve Table Definitions

Entity Metadata can be retrieved by either Primary Key (**MetadataId**) or by an Alternate Key (**LogicalName**). [More Info](https://msdn.microsoft.com/en-us/library/mt788314.aspx#bkmk_byName)

```ts
const entityKey = "00000000-0000-0000-0000-000000000001";
//  or you can use an alternate key:
//const entityKey = "LogicalName='new_accountname'";

const entityMetadata = await dynamicsWebApi.retrieveEntity({
    key: entityKey,
    select: ["SchemaName", "LogicalName"]
});

const schemaName = entityMetadata.SchemaName;
```

### Update Table Definitions

Microsoft recommends to make changes in the entity metadata that has been priorly retrieved to avoid any mistake. I would also recommend to read information about **MSCRM.MergeLabels** header prior updating metadata. More information about the header can be found [here](https://msdn.microsoft.com/en-us/library/mt593078.aspx#Anchor_2).

**Important!** Make sure you set **`MetadataId`** property when you update the metadata, DynamicsWebApi uses it as a primary key for the EntityDefinition record.

```ts
const entityKey = "LogicalName='new_accountname'";
const entityMetadata = await dynamicsWebApi.retrieveEntity({ key: entityKey });
//1. change label
entityMetadata.DispalyName.LocalizedLabels[0].Label = "New Bank Account";
//2. update metadata
await dynamicsWebApi.updateEntity({ data: entityMetadata });
```

**Important!** When you update a table definition, you must publish your changes. [More Info](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/publish-customizations). In our case we need to do an additional request to publish changes:

```ts
await dynamicsWebApi.callAction({
    actionName: "PublishXml",
    action: {
        ParameterXml: "<importexportxml><webresources><webresource>new_accountname</webresource></webresources></importexportxml>"
    }
});
```

You can find examples of `ParameterXml` [here](https://learn.microsoft.com/en-us/dotnet/api/microsoft.crm.sdk.messages.publishxmlrequest.parameterxml?view=dataverse-sdk-latest#microsoft-crm-sdk-messages-publishxmlrequest-parameterxml).

### Retrieve Multiple Table Definitions

```ts
const response = await dynamicsWebApi.retrieveEntities({
    select: ["LogicalName"],
    filter: "OwnershipType eq Microsoft.Dynamics.CRM.OwnershipTypes'UserOwned'"
});

const firstLogicalName = response.value[0].LogicalName;
```

### Create Columns

```ts
const entityKey = '00000000-0000-0000-0000-000000000001';
const attributeDefinition = {
    "AttributeType": "Money",
    "AttributeTypeName": {
        "Value": "MoneyType"
    },
    "Description": {
        "@odata.type": "Microsoft.Dynamics.CRM.Label",
        "LocalizedLabels": [{
            "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
            "Label": "Enter the balance amount",
            "LanguageCode": 1033
        }]
    },
    "DisplayName": {
        "@odata.type": "Microsoft.Dynamics.CRM.Label",
        "LocalizedLabels": [{
            "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
            "Label": "Balance",
            "LanguageCode": 1033
        }]
    },
    "RequiredLevel": {
        "Value": "None",
        "CanBeChanged": true,
        "ManagedPropertyLogicalName": "canmodifyrequirementlevelsettings"
    },
    "SchemaName": "new_Balance",
    "@odata.type": "Microsoft.Dynamics.CRM.MoneyAttributeMetadata",
    "PrecisionSource": 2
};

//attributeId is a PrimaryKey (MetadataId) for newly created column
const attributeId = await dynamicsWebApi.createAttribute({
    entityKey: entityKey,
    data: attributeDefinition
});
```

### Retrieve Columns

Column definitions can be retrieved by either Primary Key (**MetadataId**) or by an Alternate Key (**LogicalName**). [More Info](https://msdn.microsoft.com/en-us/library/mt788314.aspx#bkmk_byName)

The following example will retrieve only common properties available in [AttributeMetadata](https://msdn.microsoft.com/en-us/library/mt607551.aspx) entity.

```ts
const entityKey = "00000000-0000-0000-0000-000000000001";
//or you can use an alternate key:
//var entityKey = "LogicalName='new_accountname'";
const attributeKey = "00000000-0000-0000-0000-000000000002";
//or you can use an alternate key:
//var attributeKey = "LogicalName='new_balance'";
const attributeMetadata = await dynamicsWebApi.retrieveAttribute({
    entityKey: entityKey, 
    attributeKey: attributeKey, 
    select: ["SchemaName"]
});

const schemaName = attributeMetadata.SchemaName;
```

Use `castType` property in a request to cast the attribute to a specific type.

```ts
const entityKey = '00000000-0000-0000-0000-000000000001';
const attributeKey = '00000000-0000-0000-0000-000000000002';
const attributeMetadata = await dynamicsWebApi.retrieveAttribute({
    entityKey: entityKey, 
    attributeKey: attributeKey, 
    select: ["SchemaName"],
    castType: "Microsoft.Dynamics.CRM.MoneyAttributeMetadata"
})

const schemaName = attributeMetadata.SchemaName;
```

### Update Columns

**Important!** Make sure you set **`MetadataId`** property when you update the metadata, DynamicsWebApi use it as a primary key for the EntityDefinition record.

The following example will update only common properties availible in [AttributeMetadata](https://msdn.microsoft.com/en-us/library/mt607551.aspx) entity. If you need to update specific properties of Attributes with type that inherit from the AttributeMetadata you will need to cast the attribute to the specific type. [More Info](https://msdn.microsoft.com/en-us/library/mt607522.aspx#Anchor_4)

```ts
const entityKey = "LogicalName='my_accountname'";
const attributeKey = "LogicalName='my_balance'";
const attributeMetadata = await dynamicsWebApi.retrieveAttribute({
    entityKey: entityKey, 
    attributeKey: attributeKey
});
//1. change label
attributeMetadata.DispalyName.LocalizedLabels[0].Label = "New Balance";
//2. update metadata
await dynamicsWebApi.updateAttribute({
    entityKey: entityKey, 
    data: attributeMetadata
});
```

To cast a property to a specific type use a parameter in the function.

```ts
const entityKey = "LogicalName='my_accountname'";
const attributeKey = "LogicalName='my_balance'";
const attributeType = 'Microsoft.Dynamics.CRM.MoneyAttributeMetadata';
const attributeMetadata = await dynamicsWebApi.retrieveAttribute({
    entityKey: entityKey, 
    attributeKey: attributeKey,
    castType: attributeType
});
//1. change label
attributeMetadata.DispalyName.LocalizedLabels[0].Label = "New Balance";
//2. update metadata
await dynamicsWebApi.updateAttribute({
    entityKey: entityKey, 
    data: attributeMetadata,
    castType: attributeType
});
```

**Important!** Make sure you include the attribute type in the update function as well.

**Important!** When you update an attribute, you must publish changes in CRM. [More Info](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/publish-customizations)

### Retrieve Multiple Columns

The following example will retrieve only common properties available in [AttributeMetadata](https://msdn.microsoft.com/en-us/library/mt607551.aspx) entity.

```ts
const entityKey = "LogicalName='my_accountname'";
const response = await dynamicsWebApi.retrieveAttributes({ entityKey: entityKey });
const firstAttribute = response.value[0];
```

To retrieve columns of only a specific type use a `castType` property in a request object:

```ts
const entityKey = "LogicalName='my_accountname'";
const response = await dynamicsWebApi.retrieveAttributes({ 
    entityKey: entityKey,
    castType: "Microsoft.Dynamics.CRM.MoneyAttributeMetadata"
});

const firstAttribute = response.value[0];
```

### Use requests to query Table and Column definitions

You can also use common request functions to create, retrieve and update entity and attribute metadata. Just use the following rules:

1. Always set `collection: "EntityDefinitions"`.
2. To retrieve a specific **entity metadata** by a Primary or Alternate Key use `key` property. For example: `key: 'LogicalName="account"'`.
3. To get attributes, set `navigationProperty: "Attributes"`.
4. To retrieve a specific **attribute metadata** by Primary or Alternate Key use `navigationPropertyKey`. For example: `navigationPropertyKey: "00000000-0000-0000-0000-000000000002"`.
5. During entity or attribute metadata update you can use `mergeLabels` property to set **MSCRM.MergeLabels** attribute. By default `mergeLabels: false`.
6. To send entity or attribute definition use `data` property.

#### Examples

Retrieve a table definition with columns (with common properties):

```ts
const entityMetadata = await dynamicsWebApi.retrieve({
    collection: "EntityDefinitions",
    key: "00000000-0000-0000-0000-000000000001",
    select: ["LogicalName", "SchemaName"],
    expand: "Attributes"
});

const attributes = entityMetadata.Attributes;
```

Retrieve a column definition and cast it to the `StringType`:

```ts
const request = {
    collection: "EntityDefinitions",
    key: "LogicalName='account'",
    navigationProperty: "Attributes",
    navigationPropertyKey: "LogicalName='firstname'",
    metadataAttributeType: "Microsoft.Dynamics.CRM.StringAttributeMetadata"
};

const attributeMetadata = await dynamicsWebApi.retrieve(request);
const displayNameDefaultLabel = attributeMetadata.DisplayName.LocalizedLabels[0].Label;
```

Update entity metadata with **MSCRM.MergeLabels** header set to `true`:

```ts
const entityMetadata = await dynamicsWebApi.retrieve({
    collection: "EntityDefinitions",
    key: "LogicalName='account'"
});
//1. change label
entityMetadata.DisplayName.LocalizedLabels[0].Label = "Organization";
//2. configure update request
const updateRequest = {
    collection: "EntityDefinitions",
    key: entityMetadata.MetadataId,
    mergeLabels: true,
    data: entityMetadata
};
//3. call update request
await dynamicsWebApi.update(updateRequest);

//it is the same as:
const entityMetadata2 = await dynamicsWebApi.retrieveEntity({ key: "LogicalName='account'" });
//1. change label
entityMetadata2.DisplayName.LocalizedLabels[0].Label = "Organization";
//2. call update request
await dynamicsWebApi.updateEntity({ 
    data: entityMetadata, 
    mergeLabels: true 
});
```

### Create Relationship

```ts
const newRelationship = {
    "SchemaName": "dwa_contact_dwa_dynamicswebapitest",
    "@odata.type": "Microsoft.Dynamics.CRM.OneToManyRelationshipMetadata",
    "AssociatedMenuConfiguration": {
        "Behavior": "UseCollectionName",
        "Group": "Details",
        "Label": {
            "@odata.type": "Microsoft.Dynamics.CRM.Label",
            "LocalizedLabels": [
             {
                 "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                 "Label": "DWA Test",
                 "LanguageCode": 1033
             }
            ],
            "UserLocalizedLabel": {
                "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                "Label": "DWA Test",
                "LanguageCode": 1033
            }
        },
        "Order": 10000
    },
    "CascadeConfiguration": {
        "Assign": "Cascade",
        "Delete": "Cascade",
        "Merge": "Cascade",
        "Reparent": "Cascade",
        "Share": "Cascade",
        "Unshare": "Cascade"
    },
    "ReferencedAttribute": "contactid",
    "ReferencedEntity": "contact",
    "ReferencingEntity": "dwa_dynamicswebapitest",
    "Lookup": {
        "AttributeType": "Lookup",
        "AttributeTypeName": {
            "Value": "LookupType"
        },
        "Description": {
            "@odata.type": "Microsoft.Dynamics.CRM.Label",
            "LocalizedLabels": [
             {
                 "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                 "Label": "The owner of the test",
                 "LanguageCode": 1033
             }
            ],
            "UserLocalizedLabel": {
                "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                "Label": "The owner of the test",
                "LanguageCode": 1033
            }
        },
        "DisplayName": {
            "@odata.type": "Microsoft.Dynamics.CRM.Label",
            "LocalizedLabels": [
             {
                 "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                 "Label": "DWA Test Owner",
                 "LanguageCode": 1033
             }
            ],
            "UserLocalizedLabel": {
                "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                "Label": "DWA Test Owner",
                "LanguageCode": 1033
            }
        },
        "RequiredLevel": {
            "Value": "ApplicationRequired",
            "CanBeChanged": true,
            "ManagedPropertyLogicalName": "canmodifyrequirementlevelsettings"
        },
        "SchemaName": "dwa_TestOwner",
        "@odata.type": "Microsoft.Dynamics.CRM.LookupAttributeMetadata"
    }
};

//relationshipId is a PrimaryKey (MetadataId) for a newly created relationship
const relationshipId = await dynamicsWebApi.createRelationship({ data: newRelationship });
```
### Update Relationship

**Important!** Make sure you set **`MetadataId`** property when you update the metadata, DynamicsWebApi use it as a primary key for the EntityDefinition record.

```ts
const metadataId = "10cb680e-b6a7-e811-816a-480fcfe97e21";

const relationship = await dynamicsWebApi.retrieveRelationship({ key: metadataId });
relationship.AssociatedMenuConfiguration.Label.LocalizedLabels[0].Label = "New Label";

const updateResponse = await dynamicsWebApi.updateRelationship(relationship);
```

### Delete Relationship

```ts
const metadataId = "10cb680e-b6a7-e811-816a-480fcfe97e21";

const isDeleted = await dynamicsWebApi.deleteRelationship({ key: metadataId });
```

### Retrieve Relationship

```ts
const metadataId = "10cb680e-b6a7-e811-816a-480fcfe97e21";

const relationship = await dynamicsWebApi.retrieveRelationship({ key: metadataId });
```

You can also cast a relationship into a specific type:

```ts
const metadataId = "10cb680e-b6a7-e811-816a-480fcfe97e21";
const relationship = await dynamicsWebApi.retrieveRelationship({ 
    key: metadataId,
    castType: "Microsoft.Dynamics.CRM.OneToManyRelationshipMetadata"
});
```

### Retrieve Multiple Relationships

```ts
const relationshipType = "Microsoft.Dynamics.CRM.OneToManyRelationshipMetadata";
const relationships = await dynamicsWebApi.retrieveRelationships({
    castType: relationshipType, 
    select: ["SchemaName", "MetadataId"], 
    filter: "ReferencedEntity eq 'account'"
})
```

### Use multi-table lookup columns (Polymorfic Lookup Attributes)

Please check an official [Microsoft Documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/multitable-lookup) for more information.

Find an example on how to create a polymorfic lookup attribute below. All other operations can be done with existing functions such as `retrieveRelationship` or `retrieveAttribute`...

```ts
interface CreatePolymorphicLookupAttributeResponse {
    "@odata.context": string,
    RelationshipIds: string[],
    AttributeId: string
}

const response = await dynamicsWebApi.create<CreatePolymorphicLookupAttributeResponse>({
    collection: "CreatePolymorphicLookupAttribute",
    data: {
        OneToManyRelationships: [
        {
            SchemaName: "new_media_new_book",
            ReferencedEntity: "new_book",
            ReferencingEntity: "new_media"
        },
        {
            SchemaName: "new_media_new_video",
            ReferencedEntity: "new_video",
            ReferencingEntity: "new_media"
        },
        {
            SchemaName: "new_media_new_audio",
            ReferencedEntity: "new_audio",
            ReferencingEntity: "new_media",
            CascadeConfiguration: {  
                Assign: "NoCascade",  
                Delete: "RemoveLink",  
                Merge: "NoCascade",  
                Reparent: "NoCascade",  
                Share: "NoCascade",  
                Unshare: "NoCascade"  
            }
        }],
        Lookup: {
            AttributeType: "Lookup",
            AttributeTypeName: {
                Value: "LookupType"
            },

            Description: {
                "@odata.type": "Microsoft.Dynamics.CRM.Label",
                LocalizedLabels: [
                {
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    Label: "Media Polymorphic Lookup",
                    LanguageCode: 1033
                }],

                UserLocalizedLabel: {
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    Label: " Media Polymorphic Lookup Attribute",
                    LanguageCode: 1033
                }
            },

            DisplayName: {
                "@odata.type": "Microsoft.Dynamics.CRM.Label",
                LocalizedLabels: [
                {
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    Label: "MediaPolymorphicLookup",
                    LanguageCode: 1033
                }],

                UserLocalizedLabel: {
                "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                Label: "MediaPolymorphicLookup",
                LanguageCode: 1033
                }
            },

            SchemaName: "new_mediaPolymporphicLookup",
            "@odata.type": "Microsoft.Dynamics.CRM.ComplexLookupAttributeMetadata"
        }
    }
});

const attributeId = response.AttributeId;

response.RelationshipIds.forEach(id => { 
    //do something with the ids
});
```

### Create Global Option Set

```ts
const optionSetDefinition = {
    "@odata.type": "Microsoft.Dynamics.CRM.OptionSetMetadata",
    IsCustomOptionSet: true,
    IsGlobal: true,
    IsManaged: false,
    Name: "new_customglobaloptionset",
    OptionSetType: "Picklist",
    Options: [{
        Value: 0,
        Label: {
            LocalizedLabels: [{
                Label: "Label 1", LanguageCode: 1033
            }],
            UserLocalizedLabel: {
                Label: "Label 1", LanguageCode: 1033
            }
        },
        Description: {
            LocalizedLabels: [],
            UserLocalizedLabel: null
        }
    }, {
        Value: 1,
        Label: {
            LocalizedLabels: [{
                Label: "Label 2", LanguageCode: 1033
            }],
            UserLocalizedLabel: {
                Label: "Label 2", LanguageCode: 1033
            }
        },
        Description: {
            LocalizedLabels: [],
            UserLocalizedLabel: null
        }
    }],
    Description: {
        LocalizedLabels: [{
            Label: "Description to the Global Option Set.", LanguageCode: 1033
        }],
        UserLocalizedLabel: {
            Label: "Description to the Global Option Set.", LanguageCode: 1033
        }
    },
    DisplayName: {
        LocalizedLabels: [{
            Label: "Display name to the Custom Global Option Set.", LanguageCode: 1033
        }],
        UserLocalizedLabel: {
            Label: "Display name to the Custom Global Option Set.", LanguageCode: 1033
        }
    },
    IsCustomizable: {
        Value: true, "CanBeChanged": true, ManagedPropertyLogicalName: "iscustomizable"
    }
};

//result is a metadata id
const id = await dynamicsWebApi.createGlobalOptionSet({ 
    data: optionSetDefinition 
});
```

### Update Global Option Set

**Important!** Publish your changes after update, otherwise a label won't be modified.

```ts
let key = "6e133d25-abd1-e811-816e-480fcfeab9c1";
//or
key = "Name='new_customglobaloptionset'";

const optionSet = await dynamicsWebApi.retrieveGlobalOptionSet({ key: key });
optionSet.DisplayName.LocalizedLabels[0].Label = "Updated Display name to the Custom Global Option Set.";

const updatedOptionSet = dynamicsWebApi.updateGlobalOptionSet(response);
```

### Delete Global Option Set

```ts
let key = "6e133d25-abd1-e811-816e-480fcfeab9c1";
//or
key = "Name='new_customglobaloptionset'";

const isDeleted = await dynamicsWebApi.deleteGlobalOptionSet({ key: key });
```

### Retrieve Global Option Set

```ts
const key = "6e133d25-abd1-e811-816e-480fcfeab9c1";
//or
key = "Name='new_customglobaloptionset'";

let optionSet = await dynamicsWebApi.retrieveGlobalOptionSet(key);

//OR select specific attributes
optionSet = await dynamicsWebApi.retrieveGlobalOptionSet({
    key: key, 
    select: ["DisplayName"]
});

//OR cast option set to a specific type, for example:
//Options attribute exists only in OptionSetMetadata, therefore we need to cast to it
optionSet = await dynamicsWebApi.retrieveGlobalOptionSet({
    key: key, 
    castType: "Microsoft.Dynamics.CRM.OptionSetMetadata", 
    select: ["Name", "Options"]
});
```

### Retrieve Multiple Global Option Sets

```ts
let optionSetsResponse = await dynamicsWebApi.retrieveGlobalOptionSets();
let optionSet = optionSetsResponse.value[0]; //first global option set

//OR select specific attributes AND cast to a specific type
optionSetResponse = await dynamicsWebApi.retrieveGlobalOptionSets({
    castType: "Microsoft.Dynamics.CRM.OptionSetMetadata", 
    select: ["Name", "Options"]
});
optionSet = optionSetResponse.value[0]; //first global option set
```

## Retrieve CSDL $metadata document

To retrieve a CSDL $metadata document use the following:

```ts
const request: DynamicsWebApi.CsdlMetadataRequest = {
    addAnnotations: false; //or true;
}

//the parameter "request" is optional and can be ommited if additional annotations are not necessary
const csdlDocument: string = await dynamicsWebApi.retrieveCsdlMetadata(request);
```

The `csdlDocument` will be the type of `string`. DynamicsWebApi does not parse the contents of the document and it should be done by the developer.

## Formatted Values and Lookup Columns

With DynamicsWebApi it is easier (less code) to access formatted values for the columns as well as the lookup data in response objects. 
DynamicsWebApi automatically creates aliases for each property that contains a formatted value or lookup data.
For example:

```ts
//DynamicsWebApi supports an access to formatted values in both ways

//normally you would access a formatted value for account.donotpostalmail field could as following:
let doNotPostEmailFormatted = response['donotpostalmail@OData.Community.Display.V1.FormattedValue'];

//with DynamicsWebApi it can be access like this:
doNotPostEmailFormatted = response.donotpostalmail_Formatted;

//same for lookup data
//normally
let customerName = response['_customerid_value@OData.Community.Display.V1.FormattedValue'];
let customerEntityLogicalName = response['_customerid_value@Microsoft.Dynamics.CRM.lookuplogicalname'];
let customerNavigationProperty = response['_customerid_value@Microsoft.Dynamics.CRM.associatednavigationproperty'];

//with DynamicsWebApi
customerName = response._customerid_value_Formatted;
customerEntityLogicalName = response._customerid_value_LogicalName;
customerNavigationProperty = response._customerid_value_NavigationProperty;
```

If you still want to use old properties you can do so, they are not removed from the response, so it does not break your existing functionality.

As you have already noticed formatted and lookup data values are accesed by adding a particular suffix to a property name, 
the following table summarizes it.

OData Annotation | Property Suffix
------------ | -------------
`@OData.Community.Display.V1.FormattedValue` | `_Formatted`
`@Microsoft.Dynamics.CRM.lookuplogicalname` | `_LogicalName`
`@Microsoft.Dynamics.CRM.associatednavigationproperty` | `_NavigationProperty`

## Using Alternate Keys
You can use alternate keys to Update, Upsert, Retrieve and Delete records. [More Info](https://msdn.microsoft.com/en-us/library/mt607871.aspx#Retrieve%20using%20an%20alternate%20key)

```ts
const request = {
    key: "alternateKey='keyValue'",
    collection: 'leads',
    select: ['fullname', 'subject']
};

const record = await dynamicsWebApi.retrieveRequest(request);
//do something with a record
```
## Making requests using Entity Logical Names

It is possible to make requests using Entity Logical Names (for example: `account`, instead of `accounts`).
There's a small perfomance impact when this feature is used **outside CRM/D365 Web Resources**: DynamicsWebApi makes a request to
Entity Metadata and retrieves LogicalCollectionName and LogicalName for all entities during **the first call to Web Api** on the page.

To enable this feature set `useEntityNames: true` in DynamicsWebApi config.

```ts
interface Lead {
    fullname?: string,
    subject?: string,
    leadid?: string
}

const dynamicsWebApi = new DynamicsWebApi({ useEntityNames: true });

//make request using entity names
const lead = await dynamicsWebApi.retrieve<Lead>({
    key: leadId, 
    collection: "lead", 
    select: ["fullname", "subject"] 
});
```

This feature also applies when you set a navigation property and provide an entity name in the value:

```ts
const account = {
    name: "account name",
   "primarycontactid@odata.bind": "contact(00000000-0000-0000-0000-000000000001)"
}

const accountid = await dynamicsWebApi.create({
    collection: "account",
    data: account
});
```

In the example above, entity names will be replaced with collection names: `contact` with `contacts`, `account` with `accounts`.
This happens, because DynamicsWebApi automatically checks all properties that end with `@odata.bind` or `@odata.id`. 
Thus, there may be a case when those properties are not used but you still need a collection name instead of an entity name.
Please use the following method to get a collection name from a cached entity metadata:

```ts
//IMPORTANT! collectionName will be null if there was no call to Web API prior to that
//this restriction does not apply if DynamicsWebApi used inside CRM/D365
const collectionName = dynamicsWebApi.Utility.getCollectionName("account");
```

Please note, everything said above will happen only if you set `useEntityNames: true` in the DynamicsWebApi config.

## Work with File Fields

Please make sure that you are connected to Dynamics 365 Web API with version 9.1+ to successfully use the functions. More information can be found [here](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/file-attributes)

### Upload file

**Browser**

```ts
const fileElement = document.getElementById("upload");
const fileName = fileElement.files[0].name;
const fr = new FileReader();
fr.onload = function(){
    const fileData = new Uint8Array(this.result);
	dynamicsWebApi.uploadFile({
        collection: "dwa_filestorages",
        key: "00000000-0000-0000-0000-000000000001",
        fieldName: "dwa_file",
        fileName: fileName,
        data: fileData
	}).then(function(){
		//success
	}).catch (function (error) {
	    //catch error here
    });
}
fr.readAsArrayBuffer(fileElement.files[0]);
```

**Node.JS**

```ts
const fs = require("fs");
const filename = "logo.png";
fs.readFile(filename, (err, data) => {
    dynamicsWebApi.uploadFile({
        collection: "dwa_filestorages",
        key: "00000000-0000-0000-0000-000000000001",
        fieldName: "dwa_file",
        fileName: filename
        data: data,
    }).then(function() {
        //success
    }).catch(function (error) {
        //catch error here	
    });
});
```

### Download file

```ts
const donwloadResponse = await dynamicsWebApi.downloadFile({
    collection: "dwa_filestorages",
    key: "00000000-0000-0000-0000-000000000001",
    fieldName: "dwa_file"
});

//Uint8Array for browser and Buffer for Node.js
const fileBinary = donwloadResponse.data;
const fileName = donwloadResponse.fileName;
const fileSize = donwloadResponse.fileSize;
```

### Delete file

```ts
const isDeleted = await dynamicsWebApi.deleteRecord({
    collection: "dwa_filestorages",
    key: "00000000-0000-0000-0000-000000000001",
    fieldName: "dwa_file"
});
```

## Work with Dataverse Search API

DynamicsWebApi can be used to call Dataverse Search API and utilize its powerful Search, Suggest and Autocomplete capabilities. Before using, I highly recommend to get familiar with it by reading an [official documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/relevance-search).

To set Search API version use: `new DynamicsWebApi({ searchApi: { version: "2.0" }})`.

Search, Suggest and Autocomplete requests have a common property `query`. This is the main property that configures a relevance search request. 

All functions can also be called with a single parameter `term` which is of type `string`.

Examples below follow Microsoft official documenation.

### Search

The following table describes all parameters for a `search` request:

Property Name | Type | Description
------------ | ------------- | -------------
search | `string` | **Required**. The search parameter value contains the term to be searched for and has a 100-character limit.
entities | `string[]` | The default table list searches across all Dataverse search–configured tables and columns. The default list is configured by your administrator when Dataverse search is enabled.
facets | `string[]` | Facets support the ability to drill down into data results after they've been retrieved.
filter | `string` | Filters are applied while searching data and are specified in standard OData syntax.
orderBy | `string[]` | A list of comma-separated clauses where each clause consists of a column name followed by 'asc' (ascending, which is the default) or 'desc' (descending). This list specifies how to order the results in order of precedence.
returnTotalRecordCount | `boolean` | Specify true to return the total record count; otherwise false. The default is **false**.
searchMode | `string` | Specifies whether **any** or **all** the search terms must be matched to count the document as a match. The default is '**any**'.
searchType | `string` | The search type specifies the syntax of a search query. Using '**simple**' selects simple query syntax and '**full**' selects Lucene query syntax. The default is '**simple**'.
skip | `number` | Specifies the number of search results to skip.
top | `number` | Specifies the number of search results to retrieve. The default is **50**, and the maximum value is **100**.

**Examples:**

```ts
let result = await dynamicsWebApi.search({
    query: {
        search: "<search term>"
    }
});

//the same as:
result = await dynamicsWebApi.search("<search term>");
```

```ts
const result = await dynamicsWebApi.search({
    query: {
        search: "maria",
        facets: [
            "@search.entityname,count:100",
            "account.primarycontactid,count:100",
            "ownerid,count:100",
            "modifiedon,values:2019-04-27T00:00:00|2020-03-27T00:00:00|2020-04-20T00:00:00|2020-04-27T00:00:00",
            "createdon,values:2019-04-27T00:00:00|2020-03-27T00:00:00|2020-04-20T00:00:00|2020-04-27T00:00:00"
        ]
    }
});
```

```ts
const result = await dynamicsWebApi.search({
    query: {
        search: "maria",
        filter: "account:modifiedon ge 2020-04-27T00:00:00," +
                "activities: regardingobjecttypecode eq 'account', annotation:objecttypecode eq 'account'," +
                "incident: (prioritycode eq 1 or prioritycode eq 2)"
    }
});
```

```ts
const result = await dynamicsWebApi.search({
    query: {
        search: "maria",
        facets: [
            "@search.entityname,count:100",  
            "account.primarycontactid,count:100",  
            "ownerid,count:100",  
            "modifiedon,values:2019-04-27T00:00:00|2020-03-27T00:00:00|2020-04-20T00:00:00|2020-04-27T00:00:00",
            "createdon,values:2019-04-27T00:00:00|2020-03-27T00:00:00|2020-04-20T00:00:00|2020-04-27T00:00:00"
        ]
    }
});

const firstHit = result.value[0];
const firstHitScore = firstHit["@search.score"];
const firstSearchEntityName = result.facets["@search.entityname"][0].Value;
```

### Suggest

The following table describes all parameters for a `suggest` request:

Property Name | Type | Description
------------ | ------------- | -------------
search | `string` | **Required**. The search parameter value contains the term to be searched for and has a 3-character min limit and max 100-character limit.
entities | `string[]` | The default table list searches across all Dataverse search–configured tables and columns. The default list is configured by your administrator when Dataverse search is enabled.
orderBy | `string[]` | A list of comma-separated clauses where each clause consists of a column name followed by 'asc' (ascending, which is the default) or 'desc' (descending). This list specifies how to order the results in order of precedence.
filter | `string` | Filters are applied while searching data and are specified in standard OData syntax.
top | `number` | Number of suggestions to retrieve. The default is **5**.
useFuzzy | `boolean` | Use fuzzy search to aid with misspellings. The default is false.

**Examples:**

```ts
let result = await dynamicsWebApi.suggest({
    query: {
        search: "mar"
    }
});

//the same as:
result = await dynamicsWebApi.suggest("mar");

const firstText = result.value[0].text;
const firstDocument = result.value[0].document;
```

```ts
const result = await dynamicsWebApi.suggest({
    query: {
        search: "mar",
        filter: "account:modifiedon ge 2020-04-27T00:00:00," +
                "activities:regardingobjecttypecode eq 'account', annotation:objecttypecode eq 'account'"
    }
});
```

### Autocomplete

The following table describes all parameters for an `autocomplete` request:

Property Name | Type | Description
------------ | ------------- | -------------
search | `string` | **Required**. The search parameter value contains the term to be searched for and has a 100-character limit.
entities | `string[]` | The default table list searches across all Dataverse search–configured tables and columns. The default list is configured by your administrator when Dataverse search is enabled.
filter | `string` | Filters are applied while searching data and are specified in standard OData syntax.
useFuzzy | `boolean` | Use fuzzy search to aid with misspellings. The default is false.

**Examples:**

```ts
let result = await dynamicsWebApi.autocomplete({
    query: {
        search: "mar"
    }
});

//the same as:
result = await dynamicsWebApi.autocomplete("mar");

const value = result.value;
```

```ts
const result = await dynamicsWebApi.autocomplete({
    query: {
        search: "mar",
        filter: "account:modifiedon ge 2020-04-27T00:00:00," +
                "activities:regardingobjecttypecode eq 'account', annotation:objecttypecode eq 'account'"
    }
});
```

## Abort Request
If necessary, it is possible to abort a DynamicsWebApi request via the `AbortController` object. Request cancellation works in Browsers and Node.js v15.0.0+.

```ts
const controller = new AbortController();

const somethingHappenedMustAbort = () => controller.abort();

/*
    setTimeout here is used as an example: something happened
    and the app must abort the request right away.
    ...
    if you need to set a specific timeout for a request, 
    use "timeout" setting in the configuration
*/
setTimeout(() => somethingHappenedMustAbort(), 200);

try {
    const result = await dynamicsWebApi.retrieveAll({
        collection: "contacts",
        select: ["firstname", "lastname"],
        signal: controller.signal
    });
}
catch(error){
    if (error.name === "AbortError") {
        //request was aborted
    }
}
```

## Using Proxy

**Node.js Only.** DynamicsWebApi supports different types of connections through proxy. To make it possible, I added two dependencies in a `package.json`:
[http-proxy-agent](https://github.com/TooTallNate/node-https-proxy-agent) and [https-proxy-agent](https://github.com/TooTallNate/node-http-proxy-agent), DynamicsWebApi will use one of those agents based on the type of a protocol.

In order to let DynamicsWebApi know that you are using proxy you have two options:
1. add environmental variables `http_proxy` or `https_proxy`,
2. or pass parameters in DynamicsWebApi configuration, for example:

```ts
const dynamicsWebApi = new DynamicsWebApi({
    serverUrl: "https://myorg.api.crm.dynamics.com/",
    onTokenRefresh: acquireToken,
    proxy: {
        url: "http://localhost:12345",
        //auth is optional, you can also provide authentication in the url
        auth: {
            username: "john",
            password: "doe"
        }
    }
});
```

## Using TypeScript Declaration Files

If you are not familiar with declaration files, these files are used to provide TypeScript type information about an API.
You want to consume those from your TypeScript code. [Quote](https://stackoverflow.com/a/21247316/2042071)

### Node.Js

If you are using Node.Js with TypeScript, declarations will be fetched with an NPM package during an installation or an update process.
At the top of a necessary `.ts` file add the following:

```ts
import { DynamicsWebApi, Config } from "dynamics-web-api";
//for CommonJS:
//const DynamicsWebApi = require("dynamics-web-api");
```

### Dynamics 365 web resource
If you are developing CRM Web Resources with TypeScript (and are not using NPM), you can download a TypeScript declaration file `dynamics-web-api.d.ts` manually from v2 [dist](https://github.com/AleksandrRogov/DynamicsWebApi/tree/v2/dist) folder. I usually put all declarations in the "./types/" folder of my web resources project. For example:

```
[project root]/
-- src/
  -- form_web_resource.ts
-- types/
  -- dynamics-web-api/
    -- dynamics-web-api.d.ts
-- tsconfig.json
```

**Important!** Make sure that you include `types` folder in your `tsconfig.json`:
```json
"include": [
	"./src/**/*",
	"./types/**/*"
]
```

The declaration file is an ESM module, so if you are not using any bundler, you will have to add another d.ts file (let's call it `dynamics-web-api.browser.d.ts` and put it in the `types` folder) that will make DynamicsWebApi available globally. Here is an example (the same folder structure as mentioned above):

```ts
//dynamics-web-api.browser.d.ts
//import a DynamicsWebApi class from dynamics-web-api.d.ts file
import { DynamicsWebApi } from "./dynamicsWebApi"
//make the DynamicsWebApi class available globally
export = DynamicsWebApi;
//wrap all other exports with a namespace called DynamicsWebApi
export as namespace DynamicsWebApi;
```

You can now access `DynamicsWebApi` anywhere in your source code without needing to import the declarations.

### In Progress / Feature List

- [X] Overloaded functions with rich request options for all Web API operations.
- [X] Get all pages requests, such as: countAll, retrieveMultipleAll, fetchXmlAll and etc. `Implemented in v.1.2.5`
- [X] Web API requests that have long URL (more than 2000 characters) should be automatically converted to batch requests. 
Feature is very convenient for big Fetch XMLs. `Implemented in v.1.2.8`
- [X] "Formatted" values in responses. For instance: Web API splits information about lookup fields into separate properties, 
the config option "formatted" will enable developers to retrieve all information about such fields in a single requests and access it through DynamicsWebApi custom response objects.
- [X] Simplified names for "Formatted" properties. `Implemented in v.1.3.0`
- [X] RUD operations using Alternate Keys. `Implemented in v.1.3.4`
- [X] Duplicate Detection for Web API v.9.0. `Implemented in v.1.3.4`
- [X] Ability to use entity names instead of collection names. `Implemented in v.1.4.0`
- [X] Entity and Attribute Metadata helpers. `Implemented in v.1.4.3`
- [X] Entity Relationships and Global Option Sets helpers. `Implemented in v.1.4.6`
- [X] Batch requests. `Implemented in v.1.5.0`
- [X] TypeScript declaration files `d.ts` `Added in v.1.5.3`
- [X] Implement `Content-ID` header to reference a request in a Change Set in a batch operation `Added in v.1.5.6`
- [X] Change Tracking `Added in v.1.5.11`
- [X] Support for Aggregate and Grouping results `Added in v1.6.4`
- [X] Support for Timeout option in the configuration `Added in v1.6.10`
- [X] Impersonate a user based on their Azure Active Directory (AAD) object id. `Added in v.1.6.12`
- [X] File upload/download/delete for a File Field. `Added in v.1.7.0`
- [X] Full proxy support. `Added in v.1.7.2`
- [X] Full proxy support. `Added in v.1.7.2`
- [X] Refactoring and conversion to TypeScript. `Added in v.2.0`
- [X] Implement [Dataverse Search API](https://docs.microsoft.com/en-us/power-apps/developer/data-platform/webapi/relevance-search). `Added in v.2.0`
- [ ] Allow custom headers to be passed to the request. [#151](https://github.com/AleksandrRogov/DynamicsWebApi/issues/151)

Many more features to come!

Thank you for your patience and for using DynamcisWebApi!

## Contributions

First of all, I would like to thank you for using `DynamicsWebApi` library in your Dynamics 365 CE / Common Data Service project, the fact that my project helps someone to achieve their development goals already makes me happy. 

And if you would like to contribute to the project you may do it in multiple ways:
1. Submit an issue/bug if you have encountered one.
2. If you know the root of the issue please feel free to submit a pull request, just make sure that all tests pass and if the fix needs new unit tests, please add one.
3. Let me and community know if you have any ideas or suggestions on how to improve the project by submitting an issue on GitHub, I will label it as a 'future enhancement'.
4. Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/alexrogov/) and if you wish to let me know how you use `DynamicsWebApi` and what project you are working on, I will be happy to hear about it.
5. I maintain this project in my free time and, to be honest with you, it takes a considerable amount of time to make sure that the library has all new features, 
gets improved and all raised tickets have been answered and fixed in a short amount of time. If you feel that this project has saved your time and you would like to support it, 
then please feel free to use PayPal or GitHub Sponsors. My PayPal button: [![PayPal.Me](/.github/extra/paypal.png)](https://paypal.me/alexrogov), GitHub button can be found on the project's page.

All contributions are greatly appreciated!
