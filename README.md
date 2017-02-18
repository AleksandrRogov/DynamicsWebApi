# DynamicsWebApi for Microsoft Dynamics CRM Web API
DynamicsWebApi is a Microsoft Dynamics CRM Web API helper library written using JavaScript.
It is compatible with: Dynamics 365 (online), Dynamics 365 (on-premises), Dynamics CRM 2016, Dynamics CRM Online.

The project is currently under development.

Any suggestions are welcome!

## Table of Contents

* [Quick Start](#quick-start)
  * [Configuration] (#configuration)
    * [Configuration Object Properties] (#configuration-object-properties)
  * [Examples] (#examples)
    * [Create a record] (#create-a-record)
	* [Update a record] (#update-a-record)
	  * [Update a record and return it] (#update-a-record-and-return-it)
	* [Update a single property value] (#update-a-single-property-value)
	* [Upsert a record] (#upsert-a-record)
	* [Delete a record] (#delete-a-record)
	  * [Delete a single property value] (#delete-a-single-property-value)
	* [Retrieve a record] (#retrieve-a-record)
	* [Retrieve multiple records] (#retrieve-multiple-records)
	  * [Simple call] (#simple-call)
	  * [Advanced call] (#advanced-call)
	  * [Count] (#count)
	* [Associate] (#associate)
	* [Associate for a single-valued navigation property] (#associate-for-a-single-valued-navigation-property)
	* [Disassociate] (#disassociate)
	* [Disassociate for a single-valued navigation property] (#disassociate-for-a-single-valued-navigation-property)
	* [Fetch XML Request] (#fetch-xml-request)
* [JavaScript Promises] (#javascript-promises)
* [JavaScript Callbacks] (#javascript-callbacks)
  * [Custom Request Function to Web API] (#custom-request-function-to-web-api)

## Quick Start
In order to use a library DynamicsWebApi.js needs to be added as a Web Resource in CRM.

### Configuration
Please use the following function to set a configuration for a default DynamicsWebApi helper object.

```js
dynamicsWebApi.setConfig({ webApiVersion: "8.2" });
```

To initialize a new instance of DynamicsWebApi helper with a different configuration, please use the following code:

```js
var dynamicsWebApi81 = dynamicsWebApi.initializeInstance({ webApiVersion: "8.1" });
//or
var dynamicsWebApi81 = new DynamicsWebApi({ webApiVersion: "8.1" });
```

In case if you are using [DynamicsWebApi with Callbacks](#javascript-callbacks) and create a new object using `new` keyword, use the following snippet:
```js
//in the case below you will need to manually provide a sendRequest function if you are not using a default function (it will not be copied automatically)
var dynamicsWebApi81 = new DynamicsWebApi({
	webApiVersion: "8.1", 
	sendRequest: function(){
		//code here....
	}
});
```

If an "out of the box" functionality (jQuery) is used in the code or when a new DynamicsWebApi instance is created by using `dynamicsWebApi.initializeInstance()` there is no need to provide a sendRequest function.

#### Configuration Object Properties
Property Name | Type | Description
------------ | ------------- | -------------
__webApiVersion__ | String | Version of the Web API. By default version "8.0" used.
__webApiUrl__ | String | A complete URL string to Web API. Example of the URL: "https:/myorg.crm.dynamics.com/api/data/v8.2/". If it is specified then webApiVersion property will not be used even if it is not empty. 
__sendRequest__ | Function | __Exists only for the version with Callbacks__. A custom Request Function to Web API. More info: [here](#custom-request-function-to-web-api)

At this moment the library only works inside CRM.

### Examples
#### Create a record

```js
//initialize a CRM entity record object
var lead = {
    subject: "Test WebAPI",
    firstname: "Test",
    lastname: "WebAPI",
    jobtitle: "Title"
};
//call dynamicsWebApi.create function
dynamicsWebApi.createRecord(lead, "leads").then(function (id) {
    //do something with id here
}).catch(function (error) {
    //catch error here
})
```

#### Update a record

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

##### Update a record and return its representation

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
dynamicsWebApi.update(leadId, "leads", lead, "return=representation").then(function (updatedRecord) {
    //do something with updatedRecord
})
.catch(function (error) {
    //catch an error
});
```

#### Update a single property value

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

#### Upsert a record

```js
//lead id is needed for an upsert operation
var leadId = '7d577253-3ef0-4a0a-bb7f-8335c2596e70';

var lead = {
    subject: "Test Upsert"
};

//initialize a CRM entity record object
//and specify fields with values that need to be upserted
dynamicsWebApi.upsert(leadId, "leads", lead, "*").then(function (id) {
    if (id != null) {
        //record has been created
    }
	else{
		//record has been updated; or ETag header condition was positive
	}
})
.catch(function (error) {
    //catch an error
});
```

#### Delete a record

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

##### Delete a single property value

```js
//record id is needed to perform a delete a single property value operation
var leadId = '7d577253-3ef0-4a0a-bb7f-8335c2596e70';

//perform a delete of a single property value
dynamicsWebApi.deleteRecord(leadId, "leads", "subject").then(function () {
    //do something after a succesful operation
})
.catch(function (error) {
    //catch an error
});
```

#### Retrieve a record

```js
//perform a retrieve operaion
dynamicsWebApi.retrieve(accountId, "leads", ["fullname", "subject"]).then(function (object) {
    //do something with an object here
})
.catch(function (error) {
    //catch an error
});
```

#### Retrieve multiple records

Retrieve multiple records can be called differently depending on what level of operation is needed.

##### Simple call

```js
dynamicsWebApi.retrieveMultiple("leads", ["fullname", "subject"], "statecode eq 0").then(function (records) {
    //do something with retrieved records here
})
.catch(function (error) {
    //catch an error
});
```

##### Advanced call

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
    //do something else with a records array. Access a record: response.value[0];
})
.catch(function (error){
    //catch an error
});
```

##### Count

It is possible to count records separately from RetrieveMultiple call. In order to do that use the following snippet:

IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned.

For now please use dynamicsWebApi.retrieveMultipleAdvanced function to loop through all pages and rollup all the records. dynamicsWebApi.countAll will be available soon.

```js
dynamicsWebApi.count("leads", "statecode eq 0").then(function (count) {
    //do something with count here
})
.catch(function (error) {
    //catch an error
});
```

#### Associate

```js
var accountId = '00000000-0000-0000-0000-000000000001';
var leadId = '00000000-0000-0000-0000-000000000002';
dynamicsWebApi.associate("accounts", accountId, "lead_parent_account", "leads", leadId).then(function () {
    //success
}).catch(function (error) {
    //catch an error
});
```

#### Associate for a single-valued navigation property

The name of a single-valued navigation property can be retrieved by using a `GET` request with a header `Prefer:odata.include-annotations=Microsoft.Dynamics.CRM.associatednavigationproperty`, then individual records in the response will contain the property `@Microsoft.Dynamics.CRM.associatednavigationproperty` which is the name of the needed navigation property. Usually it will be equal to a schema name of the entity attribute.

For example, there is an entity with a logical name `new_test`, it has a lookup attribute to `lead` entity called `new_leadtest` and schema name `new_LeadTest` which is needed single-valued navigation property.

```js
var new_testid = '00000000-0000-0000-0000-000000000001';
var leadId = '00000000-0000-0000-0000-000000000002';
dynamicsWebApi.associateSingleValued("new_tests", new_testid, "new_LeadTest", "leads", leadId).then(function () {
    //success
}).catch(function (error) {
    //catch an error
});
```

#### Disassociate

```js
var accountId = '00000000-0000-0000-0000-000000000001';
var leadId = '00000000-0000-0000-0000-000000000002';
dynamicsWebApi.disassociate("accounts", accountId, "lead_parent_account", leadId).then(function () {
    //success
}).catch(function (error) {
    //catch an error
});
```

#### Disassociate for a single-valued navigation property
Current request removes a reference to an entity for a single-valued navigation property. The following code snippet uses an example shown in [Associate for a single-valued navigation property](#associate-for-a-single-valued-navigation-property).

```js
var new_testid = '00000000-0000-0000-0000-000000000001';
dynamicsWebApi.disassociateSingleValued("new_tests", new_testid, "new_LeadTest").then(function () {
    //success
}).catch(function (error) {
    //catch an error
});
```

#### Fetch XML Request

Current operation is in a development. Adding a paging.

```js
//build a fetch xml
var fetchXml = "<fetch mapping='logical'>" +
					"<entity name='account'>" +
						"<attribute name='accountid'/>" +
						"<attribute name='name'/>" +
					"</entity>" +
				"</fetch>";

dynamicsWebApi.executeFetchXml("accounts", fetchXml).then(function (response) {
    /// <param name="response" type="DWA.Types.FetchXmlResponse">Request response</param>

	//do something with results here. For example:
    for (var i = 0; i < response.value.length; i++) {
        console.trace("accountid: " + response.value[i].accountid + ", name: " + response.value[i].name);
    }
})
.catch(function (error) {
    debugger;
    console.trace(error.message);
})
```

### In Progress

- [ ] execute fetch xml request using POST method.
- [ ] get all pages requests, such as: countAll, retrieveMultipleAll, fetchXmlAll and etc.
- [ ] "formatted" values in responses. For instance: Web API splits information about lookup fields into separate properties, the config option "formatted" will enable developers to retrieve all information about such fields in a single requests and access it through DynamicsWebApi custom response objects.

Many more features to come!

Thank you for your patience!

## JavaScript Promises
Please use the following library that implements [ES6 Promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise): [DynamicsWebApi with Promises](https://github.com/AleksandrRogov/DynamicsWebApi/blob/master/DynamicsWebApi/Scripts/DynamicsWebApi.js).

### Dependencies
* [Yaku](https://github.com/ysmood/yaku) - Promise polyfill added at the top of the file while the project is under development.
* [Axios](https://github.com/mzabriskie/axios) - Added at the top of the library while the project is under development.

## JavaScript Callbacks
Please use the following library that implements Callbacks : [DynamicsWebApi with Callbacks](https://github.com/AleksandrRogov/DynamicsWebApi/blob/master/DynamicsWebApi/Scripts/DynamicsWebApi.Callbacks.js).

### Custom Request Function to Web API

It is possible to provide a custom request function for a DynamicsWebApi Callbacks library. Then it can be specified in the configuration object of the DynamicsWebApi. The example can be seen below.

Current DynamicsWebApi.Callbacks.js includes a function that uses jQuery to send Web API requests, its implementation can be found at the top of the file.

```js
var dynamicsWebApi = new DynamicsWebApi({
    sendRequest: function (method, url, successCallback, errorCallback, data, additionalHeaders) {
        /// <summary>Sends a request to given URL with given parameters</summary>
        /// <param name="method" type="String">Method of the request</param>
        /// <param name="url" type="String">The request URL</param>
        /// <param name="successCallback" type="Function">A callback called on success of the request</param>
        /// <param name="errorCallback" type="Function">A callback called when a request failed</param>
        /// <param name="data" type="Object" optional="true">Data to send in the request</param>
        /// <param name="additionalHeaders" type="Object" optional="true">Object with additional headers.<para>IMPORTANT! This object does not contain default headers needed for every request.</para></param>

        var request = {
            type: method,
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: url,
            beforeSend: function (xhr) {

                //Specifying this header ensures that the results will be returned as JSON.             
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("OData-Version", "4.0");
                xhr.setRequestHeader("OData-MaxVersion", "4.0");

                //set additional headers
                if (additionalHeaders != null) {
                    var headerKeys = Object.keys(additionalHeaders);

                    for (var i = 0; i < headerKeys.length; i++) {
                        xhr.setRequestHeader(headerKeys[i], additionalHeaders[headerKeys[i]]);
                    }
                }
            },
            success: function (data, testStatus, xhr) {
                successCallback(xhr);
            },
            error: errorCallback
        };

        if (data != null) {
            request.data = window.JSON.stringify(data);
        }

        $.ajax(request);
    }
});
```

It is important to note the following:

* Both `successCallback` and `errorCallback` passed to the `sendRequest` function must be called with XMLHttpRequest object as a parameter.
* `data` parameter will not be stringified.
* `additionalHeaders` does not contain default headers needed for every request as the parameter name suggests.

When another DynamicsWebApi object with a different configuration created using `initializeInstance` function, the `sendRequest` function will be copied, no need to specify it in the configuration object for every instance of the Wep API helper library.

### Dependencies
* [jQuery](https://github.com/jquery/jquery) - optional. Custom `sendRequest` function can be implemented that uses a native XMLHttpRequest.
