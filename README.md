# DynamicsWebApi for Microsoft Dynamics CRM Web API

[![Travis](https://img.shields.io/travis/AleksandrRogov/DynamicsWebApi.svg?style=flat-square)](https://travis-ci.org/AleksandrRogov/DynamicsWebApi)
[![Coveralls](https://img.shields.io/coveralls/AleksandrRogov/DynamicsWebApi.svg?style=flat-square)](https://coveralls.io/github/AleksandrRogov/DynamicsWebApi)

DynamicsWebApi is a Microsoft Dynamics CRM Web API helper library written in JavaScript.
It is compatible with: Dynamics 365 (online), Dynamics 365 (on-premises), Dynamics CRM 2016, Dynamics CRM Online.

Libraries for browsers can be found in [dist](/dist/) folder.

Any suggestions are welcome!

## Table of Contents

* [Getting Started](#getting-started)
  * [DynamicsWebApi as a Dynamics 365 web resource](#dynamicswebapi-as-a-dynamics-365-web-resource)
  * [DynamicsWebApi for Node.js](#dynamicswebapi-for-nodejs)
  * [Configuration](#configuration)
    * [Configuration Parameters](#configuration-parameters)
* [Request Examples](#request-examples)
  * [Create a record](#create-a-record)
  * [Update a record](#update-a-record)
  * [Update a single property value](#update-a-single-property-value)
  * [Upsert a record](#upsert-a-record)
  * [Delete a record](#delete-a-record)
    * [Delete a single property value](#delete-a-single-property-value)
  * [Retrieve a record](#retrieve-a-record)
  * [Retrieve multiple records](#retrieve-multiple-records)
    * [Retrieve All records](#retrieve-all-records)
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
* [JavaScript Promises](#javascript-promises)
* [JavaScript Callbacks](#javascript-callbacks)

## Getting Started

### DynamicsWebApi as a Dynamics 365 web resource
In order to use DynamicsWebApi inside Dynamics 365 you need to download a browser version of the library, it can be found in [dist](/dist/) folder.

Upload a script as a JavaScript Web Resource, place on the entity form or refer to it in your HTML Web Resource and then initialize the main object:

```js
//DynamicsWebApi makes calls to Web API v8.0 if a configuration not set
var dynamicsWebApi = new DynamicsWebApi();

dynamicsWebApi.executeUnboundFunction("WhoAmI").then(function (response) {
    Xrm.Utility.alertDialog('Hello Dynamics 365! My id is: ' + response.UserId);
}).catch(function(error){
    console.log(error.message);
});
```

### DynamicsWebApi for Node.js
DynamicsWebApi can be used as Node.js module to access Dynamics 365 Web API using OAuth. 

First of all, install a package from NPM:

```shell
npm install dynamics-web-api --save
```

Then include it in your file:

```js
var DynamicsWebApi = require('dynamics-web-api');
```

At this moment DynamicsWebApi does not fetch authorization tokens, so you will need to acquire OAuth token in your code and pass it to the DynamicsWebApi.
Token can be aquired using [ADAL for Node.js](https://github.com/AzureAD/azure-activedirectory-library-for-nodejs) or you can write your own functionality, as it is described [here](http://alexanderdevelopment.net/post/2016/11/23/dynamics-365-and-node-js-integration-using-the-web-api/).

Here is a sample using `adal-node`:

```js
var DynamicsWebApi = require('dynamics-web-api');
var AuthenticationContext = require('adal-node').AuthenticationContext;

//the following settings should be taken from Azure for your application
//and stored in app settings file or in global variables

//OAuth Token Endpoint
var authorityUrl = 'https://login.microsoftonline.com/00000000-0000-0000-0000-000000000011/oauth2/token';
//CRM Organization URL
var resource = 'https://myorg.crm.dynamics.com';
//Dynamics 365 Client Id when registered in Azure
var clientId = '00000000-0000-0000-0000-000000000001';
var username = 'crm-user-name';
var password = 'crm-user-password';

var adalContext = new AuthenticationContext(authorityUrl);

//add a callback as a parameter for your function
function acquireToken(dynamicsWebApiCallback){
    //a callback for adal-node
    function adalCallback(error, token) {
        if (!error){
            //call DynamicsWebApi callback only when a token has been retrieved
            dynamicsWebApiCallback(token);
        }
        else{
            console.log('Token has not been retrieved. Error: ' + error.stack);
        }
    }

    //call a necessary function in adal-node object to get a token
    adalContext.acquireTokenWithUsernamePassword(resource, username, password, clientId, adalCallback);
}

//create DynamicsWebApi object
var dynamicsWebApi = new DynamicsWebApi({ 
    webApiUrl: 'https:/myorg.api.crm.dynamics.com/api/data/v8.2/',
    onTokenRefresh: acquireToken
});

//call any function
dynamicsWebApi.executeUnboundFunction("WhoAmI").then(function (response) {
    console.log('Hello Dynamics 365! My id is: ' + response.UserId);
}).catch(function(error){
    console.log(error.message);
});
```

### Configuration
To initialize a new instance of DynamicsWebApi with a configuration object, please use the following code:

```js
//config can be passed directly to the constructor
var dynamicsWebApi = new DynamicsWebApi({ webApiVersion: "8.2" });
```

You can set a configuration dynamically if needed:

```js
//or can be set dynamically
dynamicsWebApi.setConfig({ webApiVersion: "8.2" });
```

#### Configuration Parameters
Property Name | Type | Description
------------ | ------------- | -------------
impersonate | String | A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
includeAnnotations | String | Defaults Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types.
maxPageSize | Number | Defaults the odata.maxpagesize preference. Use to set the number of entities returned in the response.
onTokenRefresh | Function | A callback function that triggered when DynamicsWebApi requests a new OAuth token. (At this moment it is done before each call to Dynamics 365, as [recommended by Microsoft](https://msdn.microsoft.com/en-ca/library/gg327838.aspx#Anchor_2)).
returnRepresentation | Boolean | Defaults Prefer header with value "return=representation". Use this property to return just created or updated entity in a single request.
webApiUrl | String | A complete URL string to Web API. Example of the URL: "https:/myorg.api.crm.dynamics.com/api/data/v8.2/". If it is specified then webApiVersion property will not be used even if it is not empty. 
webApiVersion | String | Version of the Web API. Default version is "8.0".

Configuration property `webApiVersion` is required only when DynamicsWebApi used inside CRM. 
Property `webApiUrl` is required when DynamicsWebApi used externally. 
If both configuration properties set then `webApiUrl` will have a higher priority than `webApiVersion`, so the last one will be skipped.

## Request Examples

DynamicsWebApi supports __Basic__ and __Advanced__ calls to Web API.

Basic calls can be made by using functions with the most common input parameters. They are convenient for simple operations as they do 
not provide all possible ways of interaction with CRM Web API (for example, [conditional retrievals](https://msdn.microsoft.com/en-us/library/mt607711.aspx#bkmk_DetectIfChanged)
are not supported in basic functions).

Basic functions are: `create`, `update`, `upsert`, `deleteRecord`, `retrieve`, `retrieveMultiple`, `retrieveAll`, `count`, `countAll`, 
`executeFetchXml`, `executeFetchXmlAll`, `associate`, `disassociate`, `associateSingleValued`, `disassociateSingleValued`, `executeBoundFunction`, 
`executeUnboundFunction`, `executeBoundAction`, `executeUnboundAction`.

Advanced functions have a suffix `Request` added to the end of the applicable operation. 
Most of the functions have a single input parameter which is a `request` object.

The following table describes all properties that are accepted in this object. __Important!__ Not all operaions accept all properties and if you by mistake specified
an invalid property you will receive either an error saying that the request is invalid or the response will not have expected results.

Property Name | Type | Operation(s) Supported | Description
------------ | ------------- | ------------- | -------------
collection | String | All | The name of the Entity Collection, for example, for `account` use `accounts`, `opportunity` - `opportunities` and etc.
count | Boolean | `retrieveMultipleRequest`, `retrieveAllRequest` | Boolean that sets the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000 (per page). Do not use $top with $count!
entity | Object | `updateRequest`, `upsertRequest` | A JavaScript object with properties corresponding to the logical name of entity attributes (exceptions are lookups and single-valued navigation properties).
expand | Array | `retrieveRequest`, `updateRequest`, `upsertRequest` | An array of Expand Objects (described below the table) representing the $expand OData System Query Option value to control which related records are also returned.
filter | String | `retrieveRequest`, `retrieveMultipleRequest`, `retrieveAllRequest` | Use the $filter system query option to set criteria for which entities will be returned.
id | String | `retrieveRequest`, `updateRequest`, `upsertRequest`, `deleteRequest` | A String representing the GUID value for the record.
ifmatch | String | `retrieveRequest`, `updateRequest`, `upsertRequest`, `deleteRequest` | Sets If-Match header value that enables to use conditional retrieval or optimistic concurrency in applicable requests. [More info](https://msdn.microsoft.com/en-us/library/mt607711.aspx).
ifnonematch | String | `retrieveRequest`, `upsertRequest` | Sets If-None-Match header value that enables to use conditional retrieval in applicable requests. [More info](https://msdn.microsoft.com/en-us/library/mt607711.aspx).
impersonate | String | All | A String representing the GUID value for the Dynamics 365 system user id. Impersonates the user.
includeAnnotations | String | `retrieveRequest`, `retrieveMultipleRequest`, `retrieveAllRequest`, `updateRequest`, `upsertRequest` | Sets Prefer header with value "odata.include-annotations=" and the specified annotation. Annotations provide additional information about lookups, options sets and other complex attribute types.
maxPageSize | Number | `retrieveMultipleRequest`, `retrieveAllRequest` | Sets the odata.maxpagesize preference value to request the number of entities returned in the response.
navigationProperty | String | `retrieveRequest` | A String representing the name of a single-valued navigation property. Useful when needed to retrieve information about a related record in a single request.
orderBy | Array | `retrieveMultipleRequest`, `retrieveAllRequest` | An Array (of Strings) representing the order in which items are returned using the $orderby system query option. Use the asc or desc suffix to specify ascending or descending order respectively. The default is ascending if the suffix isn't applied.
returnRepresentation | Boolean | `updateRequest`, `upsertRequest` | Sets Prefer header request with value "return=representation". Use this property to return just created or updated entity in a single request.
savedQuery | String | `retrieveRequest` | A String representing the GUID value of the saved query.
select | Array | `retrieveRequest`, `retrieveMultipleRequest`, `retrieveAllRequest`, `updateRequest`, `upsertRequest` | An Array (of Strings) representing the $select OData System Query Option to control which attributes will be returned.
token | String | All | Authorization Token. If set, onTokenRefresh will not be called.
top | Number | `retrieveMultipleRequest`, `retrieveAllRequest` | Limit the number of results returned by using the $top system query option. Do not use $top with $count!
userQuery | String | `retrieveRequest` | A String representing the GUID value of the user query.

Basic and Advanced functions are also have differences in `expand` parameters. For Basic ones this parameter is a type of String 
while request.expand property is an Array of Expand Objects for Advanced operations. The following table describes Expand Object properties:

Property Name | Type | Description
------------ | ------------- | -------------
filter | String | Use the $filter system query option to set criteria for which related entities will be returned.
orderBy | Array | An Array (of Strings) representing the order in which related items are returned using the $orderby system query option. Use the asc or desc suffix to specify ascending or descending order respectively. The default is ascending if the suffix isn't applied.
property | String | A name of a single-valued navigation property which needs to be expanded.
select | Array | An Array (of Strings) representing the $select OData System Query Option to control which attributes will be returned.
top | Number | Limit the number of results returned by using the $top system query option.

According to CRM developers ([here](http://stackoverflow.com/a/34742977/2042071) and [here](https://community.dynamics.com/crm/b/joegilldynamicscrm/archive/2016/03/23/web-api-querying-with-expand) 
$expand does not work for retrieveMultiple requests which is claimed as a bug of CRM Web API.
As well as multi-level expands are not implemented yet. This situation may be changed with the future updates in the platform. Please look for the news!

For complex requests to Web API with multi-level expands use `executeFetchXml` function.

Starting from version 1.2.8, all requests to Web API that have long URLs (more than 2000 characters) are automatically converted to a Batch Request.
This feature is very convenient if you are trying to make a call using big Fetch XMLs. No special parameters needed to do a convertation.

### Create a record

```js
//initialize a CRM entity record object
var lead = {
    subject: "Test WebAPI",
    firstname: "Test",
    lastname: "WebAPI",
    jobtitle: "Title"
};
//call dynamicsWebApi.create function
dynamicsWebApi.create(lead, "leads").then(function (id) {
    //do something with id here
}).catch(function (error) {
    //catch error here
})
```

If you need to return just created entity record, add "return=representation" parameter:

```js
//initialize a CRM entity record object
var lead = {
    subject: "Test WebAPI",
    firstname: "Test",
    lastname: "WebAPI",
    jobtitle: "Title"
};
//call dynamicsWebApi.create function
dynamicsWebApi.create(lead, "leads", ["return=representation"]).then(function (record) {
    //do something with a record here
	var subject = record.subject;
}).catch(function (error) {
    //catch error here
})
```

Also you can include attribute annotations:

```js
dynamicsWebApi.create(lead, "leads", ["return=representation", "odata.include-annotations=*"]) //...
//or
dynamicsWebApi.create(lead, "leads", "return=representation,odata.include-annotations=*") //...
//and select some attributes from the record
dynamicsWebApi.create(lead, "leads", ["return=representation", "odata.include-annotations=*"], ["subject"]) //...
```

### Update a record

#### Basic

```js
//lead id is needed for an update operation
var leadId = '7d577253-3ef0-4a0a-bb7f-8335c2596e70';

//initialize a CRM entity record object
//and specify fields with values that need to be updated
var lead = {
    subject: "Test update",
    jobtitle: "Developer"
}
//perform an update operation
dynamicsWebApi.update(leadId, "leads", lead).then(function () {
    //do something after a succesful operation
})
.catch(function (error) {
    //catch an error
});
```

#### Advanced using Request Object

```js
var request = {
    id: '7d577253-3ef0-4a0a-bb7f-8335c2596e70',
    collection: "leads",
    entity: {
        subject: "Test update",
        jobtitle: "Developer"
    },
    returnRepresentation: true,
    select: ["fullname"]
};

dynamicsWebApi.updateRequest(request).then(function (response) {
    var fullname = response.fullname;
    //do something with a fullname of a recently updated entity record
})
.catch(function (error) {
    //catch an error
});
```

### Update a single property value

```js
//lead id is needed for an update single property operation
var leadId = '7d577253-3ef0-4a0a-bb7f-8335c2596e70';

//initialize key value pair object
var keyValuePair = { subject: "Update Single" };

//perform an update single property operation
dynamicsWebApi.updateSingleProperty(leadId, "leads", keyValuePair).then(function () {
    //do something after a succesful operation
})
.catch(function (error) {
    //catch an error
});
```

### Upsert a record

#### Basic

```js
//lead id is needed for an upsert operation
var leadId = '7d577253-3ef0-4a0a-bb7f-8335c2596e70';

var lead = {
    subject: "Test Upsert"
};

//initialize a CRM entity record object
//and specify fields with values that need to be upserted
dynamicsWebApi.upsert(leadId, "leads", lead).then(function (id) {
    //do something with id
})
.catch(function (error) {
    //catch an error
});
```

#### Advanced using Request Object

```js
var leadId = '7d577253-3ef0-4a0a-bb7f-8335c2596e70';

var request = {
    id: leadId,
    collection: "leads",
    returnRepresentation: true,
    select: ["fullname"],
    entity: {
        subject: "Test upsert"
    },
    ifnonematch: "*" //to prevent update
};

dynamicsWebApi.upsertRequest(request).then(function (record) {
    if (record != null) {
        //record created
    }
    else {
        //update prevented
    }
})
.catch(function (error) {
    //catch an error
});
```

### Delete a record

#### Basic

```js
//record id is needed to perform a delete operation
var leadId = '7d577253-3ef0-4a0a-bb7f-8335c2596e70';

//perform a delete
dynamicsWebApi.deleteRecord(leadId, "leads").then(function () {
    //do something after a succesful operation
})
.catch(function (error) {
    //catch an error
});
```

#### Advanced using Request Object

```js
//delete with optimistic concurrency
var request = {
    id: recordId,
    collection: "leads",
    ifmatch: 'W/"470867"'
}

dynamicsWebApi.deleteRequest(request).then(function (isDeleted) {
    if (isDeleted){
        //the record has been deleted
    }
    else{
        //the record has not been deleted
    }
})
.catch(function (error) {
    //catch an error
});
```

#### Delete a single property value

```js
//record id is needed to perform a delete of a single property value operation
var leadId = '7d577253-3ef0-4a0a-bb7f-8335c2596e70';

//perform a delete of a single property value
dynamicsWebApi.deleteRecord(leadId, "leads", "subject").then(function () {
    //do something after a succesful operation
})
.catch(function (error) {
    //catch an error
});
```

### Retrieve a record

#### Basic

```js
var leadId = '7d577253-3ef0-4a0a-bb7f-8335c2596e70';

//perform a retrieve operaion
dynamicsWebApi.retrieve(leadid, "leads", ["fullname", "subject"]).then(function (record) {
    //do something with a record here
})
.catch(function (error) {
    //catch an error
});
```

#### Advanced using Request Object

```js
var request = {
    id: '7d577253-3ef0-4a0a-bb7f-8335c2596e70',
    collection: "leads",
    select: ["fullname", "subject"],

    //ETag value with the If-None-Match header to request data to be retrieved only 
    //if it has changed since the last time it was retrieved.
    ifnonematch: 'W/"468026"',

    //Retrieved record will contain formatted values
    includeAnnotations: "OData.Community.Display.V1.FormattedValue"
};

dynamicsWebApi.retrieveRequest(request).then(function (record) {
    //do something with a record
})
.catch(function (error) {
    //if the record has not been found the error will be thrown
});
```

#### Retrieve a reference to related record using a single-valued navigation property

It is possible to retrieve a reference to the related entity (it works both in Basic and Advanced requests): `select: ["ownerid/$ref"]`. The parameter
must be the only one, it must be the name of a [single-valued navigation property](https://msdn.microsoft.com/en-us/library/mt607990.aspx#Anchor_5) 
and it must have a suffix `/$ref` attached to it. Example:

```js
var leadId = '7d577253-3ef0-4a0a-bb7f-8335c2596e70';

//perform a retrieve operaion
dynamicsWebApi.retrieve(leadid, "leads", ["ownerid/$ref"]).then(function (reference) {
    var ownerId = reference.id;
    var collectionName = reference.collection; // systemusers or teams
}) //.catch ...
```

#### Retrieve a related record data using a single-valued navigation property

In order to retrieve a related record by a signle-valued navigation property you need to add a prefix "/" to the __first__ element in a `select` array: 
`select: ["/ownerid", "fullname"]`. The first element must be the name of a [single-valued navigation property](https://msdn.microsoft.com/en-us/library/mt607990.aspx#Anchor_5) 
and it must contain a prefix "/"; all other elements in a `select` array will represent attributes of __the related entity__. Examples:

```js
var recordId = '7d577253-3ef0-4a0a-bb7f-8335c2596e70';

//perform a retrieve operaion
dynamicsWebApi.retrieve(recordId, "new_tests", ["/new_ParentLead", "fullname", "subject"])
    .then(function (leadRecord) {
        var fullname = leadRecord.fullname;
        //and etc...
    }) //.catch ...
```

In advanced request you have a choice to specify a `request.navigationProperty` or use it in the same way as for the Basic function.

```js
var request = {
    id: recordId,
    collection: "new_tests",
    navigationProperty: "new_ParentLead", //use request.navigationProperty
    select: ["fullname", "subject"]
}

//or

request = {
    id: recordId,
    collection: "new_tests",
    select: ["/new_ParentLead", "fullname", "subject"]    //inline with prefix "/"
}

dynamicsWebApi.retrieveRequest(request).then(function (leadRecord) {
    var fullname = leadRecord.fullname;
    //and etc...
}) // .catch...
```

### Retrieve multiple records

#### Basic

```js
dynamicsWebApi.retrieveMultiple("leads", ["fullname", "subject"], "statecode eq 0").then(function (records) {
    //do something with retrieved records here
})
.catch(function (error) {
    //catch an error
});
```

#### Advanced using Request Object

```js
//set the request parameters
var request = {
    collection: "leads",
    select: ["fullname", "subject"],
    filter: "statecode eq 0",
    maxPageSize: 5,
    count: true
};

//perform a multiple records retrieve operation
dynamicsWebApi.retrieveMultipleRequest(request).then(function (response) {
    /// <param name="response" type="DWA.Types.MultipleResponse">Response object</param>

    var count = response.oDataCount;
    var nextLink = response.oDataNextLink;
    var records = response.value;
    //do something else with a records array. Access a record: response.value[0].subject;
})
.catch(function (error){
    //catch an error
});
```

#### Retrieve All records

The following function retrieves records and goes through all pages automatically.

```js
//perform a multiple records retrieve operation
dynamicsWebApi.retrieveAll("leads", ["fullname", "subject"], "statecode eq 0").then(function (response) {

    var records = response.value;
    //do something else with a records array. Access a record: response.value[0].subject;
})
.catch(function (error){
    //catch an error
});
```

OR advanced function:

```js
//set the request parameters
var request = {
    collection: "leads",
    select: ["fullname", "subject"],
    filter: "statecode eq 0",
    maxPageSize: 5				//just for an example
};

//perform a multiple records retrieve operation
dynamicsWebApi.retrieveAllRequest(request).then(function (response) {

    var records = response.value;
    //do something else with a records array. Access a record: response.value[0].subject;
})
.catch(function (error){
    //catch an error
});
```

### Count

It is possible to count records separately from RetrieveMultiple call. In order to do that use the following snippet:

IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned.

For now please use dynamicsWebApi.retrieveMultipleRequest function and loop through all pages to rollup all records. dynamicsWebApi.countAll will be available soon.

```js
dynamicsWebApi.count("leads", "statecode eq 0").then(function (count) {
    //do something with count here
})
.catch(function (error) {
    //catch an error
});
```

#### Count limitation workaround

The following function can be used to count all records in a collection. It's a workaround and just counts the number of objects in the array 
returned in `retrieveAllRequest`.


```js
dynamicsWebApi.countAll("leads", "statecode eq 0").then(function (count) {
    //do something with count here
})
.catch(function (error) {
    //catch an error
});
```

Downside of this workaround is that it not only returns a count number but also all data for records in a collection. In order to make a small
optimisation I added the third parameter to the function that can be used to reduce the length of the response. The third parameter represents
a select query option.

```js
dynamicsWebApi.countAll("leads", "statecode eq 0", ["subject"]).then(function (count) {
    //do something with count here
})
.catch(function (error) {
    //catch an error
});
```

FYI, in the majority of cases it is better to use Fetch XML aggregation, but take into a consideration that it is also limited to 50000 records 
by default.

### Associate

```js
var accountId = '00000000-0000-0000-0000-000000000001';
var leadId = '00000000-0000-0000-0000-000000000002';
dynamicsWebApi.associate("accounts", accountId, "lead_parent_account", "leads", leadId).then(function () {
    //success
}).catch(function (error) {
    //catch an error
});
```

### Associate for a single-valued navigation property

The name of a single-valued navigation property can be retrieved by using a `GET` request with a header `Prefer:odata.include-annotations=Microsoft.Dynamics.CRM.associatednavigationproperty`, 
then individual records in the response will contain the property `@Microsoft.Dynamics.CRM.associatednavigationproperty` which is the name of the needed navigation property. 
Usually it will be equal to a schema name of the entity attribute.

For example, there is an entity with a logical name `new_test`, it has a lookup attribute to `lead` entity called `new_parentlead` and schema name `new_ParentLead` which is needed single-valued navigation property.

```js
var new_testid = '00000000-0000-0000-0000-000000000001';
var leadId = '00000000-0000-0000-0000-000000000002';
dynamicsWebApi.associateSingleValued("new_tests", new_testid, "new_ParentLead", "leads", leadId)
    .then(function () {
        //success
    }).catch(function (error) {
        //catch an error
    });
```

### Disassociate

```js
var accountId = '00000000-0000-0000-0000-000000000001';
var leadId = '00000000-0000-0000-0000-000000000002';
dynamicsWebApi.disassociate("accounts", accountId, "lead_parent_account", leadId).then(function () {
    //success
}).catch(function (error) {
    //catch an error
});
```

### Disassociate for a single-valued navigation property
Current request removes a reference to an entity for a single-valued navigation property. The following code snippet uses an example shown in [Associate for a single-valued navigation property](#associate-for-a-single-valued-navigation-property).

```js
var new_testid = '00000000-0000-0000-0000-000000000001';
dynamicsWebApi.disassociateSingleValued("new_tests", new_testid, "new_ParentLead").then(function () {
    //success
}).catch(function (error) {
    //catch an error
});
```

### Fetch XML Request

```js
//build a fetch xml
var fetchXml = '<fetch mapping="logical">' +
                    '<entity name="account">' +
                        '<attribute name="accountid"/>' +
                        '<attribute name="name"/>' +
                    '</entity>' +
               '</fetch>';

dynamicsWebApi.executeFetchXml("accounts", fetchXml).then(function (response) {
    /// <param name="response" type="DWA.Types.FetchXmlResponse">Request response</param>

    //do something with results here; access records response.value[0].accountid 
})
.catch(function (error) {
    //catch an error
});
```

Starting from version 1.2.5 DynamicsWebApi has an alias with a shorter name and same parameters: `dynamicsWebApi.fetch(...)`, 
that works in the same way as `executeFetchXml`.

#### Paging

```js
//build a fetch xml
var fetchXml = '<fetch mapping="logical">' +
                    '<entity name="account">' +
                        '<attribute name="accountid"/>' +
                        '<attribute name="name"/>' +
                    '</entity>' +
               '</fetch>';

dynamicsWebApi.executeFetchXml("accounts", fetchXml).then(function (response) {
    /// <param name="response" type="DWA.Types.FetchXmlResponse">Request response</param>
    
    //do something with results here; access records response.value[0].accountid

    return dynamicsWebApi
        .executeFetchXml("accounts", fetchXml, null, response.PagingInfo.nextPage, response.PagingInfo.cookie);
}).then(function (response) {
    /// <param name="response" type="DWA.Types.FetchXmlResponse">Request response</param>
    
    //page 2
    //do something with results here; access records response.value[0].accountid

    return dynamicsWebApi
        .executeFetchXml("accounts", fetchXml, null, response.PagingInfo.nextPage, response.PagingInfo.cookie);
}).then(function (response) {
    /// <param name="response" type="DWA.Types.FetchXmlResponse">Request response</param>
    //page 3
    //and so on... or use a loop.
})
//catch...
```

#### Fetch All records

The following function executes a FetchXml and goes through all pages automatically:

```js
var fetchXml = '<fetch mapping="logical">' +
                    '<entity name="account">' +
                        '<attribute name="accountid"/>' +
                        '<attribute name="name"/>' +
                    '</entity>' +
               '</fetch>';

dynamicsWebApi.executeFetchXmlAll("accounts", fetchXml).then(function (response) {
    
    //do something with results here; access records response.value[0].accountid
})
//catch...
```

Starting from version 1.2.5 DynamicsWebApi has an alias with a shorter name and same parameters: `dynamicsWebApi.fetchAll(...)`, 
that works in the same way as `executeFetchXmlAll`.

### Execute Web API functions

#### Bound functions

```js
var teamId = "00000000-0000-0000-0000-000000000001";
dynamicsWebApi.executeBoundFunction(teamId, "teams", "Microsoft.Dynamics.CRM.RetrieveTeamPrivileges")
    .then(function (response) {
        //do something with a response
    }).catch(function (error) {
        //catch an error
    });
```

#### Unbound functions

```js
var parameters = {
    LocalizedStandardName: 'Pacific Standard Time',
    LocaleId: 1033
};
dynamicsWebApi.executeUnboundFunction("GetTimeZoneCodeByLocalizedName", parameters).then(function (result) {
    var timeZoneCode = result.TimeZoneCode;
}).catch(function (error) {
    //catch an error
});
```

### Execute Web API actions

#### Bound actions

```js
var queueId = "00000000-0000-0000-0000-000000000001";
var letterActivityId = "00000000-0000-0000-0000-000000000002";
var actionRequest = {
    Target: {
        activityid: letterActivityId,
        "@odata.type": "Microsoft.Dynamics.CRM.letter"
    }
};
dynamicsWebApi.executeBoundAction(queueId, "queues", "Microsoft.Dynamics.CRM.AddToQueue", actionRequest)
    .then(function (result) {
        var queueItemId = result.QueueItemId;
    })
    .catch(function (error) {
        //catch an error
    });
```

#### Unbound actions

```js
var opportunityId = "b3828ac8-917a-e511-80d2-00155d2a68d2";
var actionRequest = {
    Status: 3,
    OpportunityClose: {
        subject: "Won Opportunity",

        //DynamicsWebApi will add full url if the property contains @odata.bind suffix
        //but it is also possible to specify a full url to the entity record
        "opportunityid@odata.bind": "opportunities(" + opportunityId + ")"
    }
};
dynamicsWebApi.executeUnboundAction("WinOpportunity", actionRequest).then(function () {
    //success
}).catch(function (error) {
    //catch an error
});
```

### In Progress

- [X] Overloaded functions with rich request options for all Web API operations.
- [X] Get all pages requests, such as: countAll, retrieveMultipleAll, fetchXmlAll and etc. Implemented in v.1.2.5.
- [X] Web API requests that have long URL (more than 2000 characters) should be automatically converted to batch requests. 
Feature is very convenient for big Fetch XMLs. Implemented in v.1.2.8.
- [ ] Web API Authentication for On-Premise instances.
- [ ] Intellisense for request objects.
- [ ] "Formatted" values in responses. For instance: Web API splits information about lookup fields into separate properties, 
the config option "formatted" will enable developers to retrieve all information about such fields in a single requests and access it through DynamicsWebApi custom response objects.
- [ ] Batch requests.
- [ ] Use entity names instead of collection names. I have not done an investigation about it but if you, by any chance, know how to do that, 
I will be very grateful for an advice! Quick guess, does it work like in English language?

Many more features to come!

Thank you for your patience!

## JavaScript Promises
Please use the following library that implements [ES6 Promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise): [DynamicsWebApi with Promises](/scripts/dynamics-web-api.js).

It is highly recommended to use one of the Promise Polyfills (Yaku, ES6 Promise and etc.) if DynamicsWebApi is intended to be used in the browsers.

## JavaScript Callbacks
Please use the following library that implements Callbacks : [DynamicsWebApi with Callbacks](/scripts/dynamics-web-api-callbacks.js).
