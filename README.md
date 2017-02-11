# DynamicsWebApi
DynamicsWebApi is a javascript Microsoft Dynamics CRM Web API helper library.
It is compatible with: Dynamics 365 (online), Dynamics 365 (on-premises), Dynamics CRM 2016, Dynamics CRM Online.

The project is currently under development.

Any suggestions are welcome!

## Quick Start
In order to use a library DynamicsWebApi.js needs to be added as a Web Resource in CRM.

## Configuration
Please use the following function to set a configuration for a default DynamicsWebApi helper object.

```js
dynamicsWebApi.setConfig({ webApiVersion: "8.2" });
```

If it is needed to initialize a new instance of DynamicsWebApi helper with a different configuration, please use the following code:

```js
var dynamicsWebApi81 = dynamicsWebApi.initializeInstance({ webApiVersion: "8.1" });
```

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
//call dynamicsWebApi.createRequest function
dynamicsWebApi.createRequest(lead, "lead").then(function (id) {
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
dynamicsWebApi.updateRequest(leadId, "lead", lead).then(function () {
    //do something after a succesful operation
})
.catch(function (error) {
    //catch an error
});
```

##### Update a record and return it

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
dynamicsWebApi.updateRequest(leadId, "lead", lead, true).then(function (updatedRecord) {
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
var keyValuePair = {
    key: "subject",
	value: "Update Single"
};

//perform an update single property operation
dynamicsWebApi.UpdateSingleProperty(leadId, "lead", keyValuePair).then(function () {
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
dynamicsWebApi.upsertRequest(leadId, "lead", lead, "*").then(function (id) {
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
dynamicsWebApi.deleteRequest(leadId, "lead").then(function () {
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
dynamicsWebApi.deleteRequest(leadId, "lead", "subject").then(function () {
    //do something after a succesful operation
})
.catch(function (error) {
    //catch an error
});
```

#### Retrieve a record

```js
//perform a retrieve operaion
dynamicsWebApi.retrieveRecord(accountId, "lead", ["fullname", "subject"]).then(function (object) {
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
dynamicsWebApi.retrieveMultiple("lead", ["fullname", "subject"], "statecode eq 0", null).then(function (records) {
    //do something with retrieved records here
})
.catch(function (error) {
    //catch an error
});
```

##### Advanced call

```js
//initialize call options object
var operationOptions = {
    type: "lead",
    select: ["fullname", "subject"],
    filter: "statecode eq 0",
    maxPageSize: 5,
    count: true
};

//perform a multiple records retrieve operation
dynamicsWebApi.retrieveMultipleAdvanced(operationOptions).then(function (records) {
    var count = records.oDataCount;
    var nextLink = records.oDataNextLink;
    
    //do something else with a records object
})
.catch(function (error){
    //catch an error
});
```

##### Count

It is possible to count records separately from RetrieveMultiple call. In order to do that use the following snippet:

```js
dynamicsWebApi.countRecords("lead", "statecode eq 0").then(function (count) {
    //do something with count here
})
.catch(function (error) {
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

dynamicsWebApi.fetchXmlRequest("account", fetchXml).then(function (records) {
    /// <param name="records" type="Array">Array of FetchXml results</param>
	//do something with results here. For example:
    for (var i = 0; i < records.length; i++) {
        console.trace("accountid: " + records[i].accountid + ", name: " + records[i].name);
    }
})
.catch(function (error) {
    debugger;
    console.trace(error.message);
})
```

### In Progress
All the rest operations that can be performed using CRM Web API are in a work progress.

Thank you for your patience!

## JavaScript Promises
Please use the following library that implements [ES6 Promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise): [DynamicsWebApi with Promises](https://github.com/AleksandrRogov/DynamicsWebApi/blob/master/DynamicsWebApi/Scripts/DynamicsWebApi.js).

[Yaku](https://github.com/ysmood/yaku) - a Promise polyfill added at the top of the file.

## JavaScript Callbacks
Please use the following library that implements Callbacks : [DynamicsWebApi with Callbacks](https://github.com/AleksandrRogov/DynamicsWebApi/blob/master/DynamicsWebApi/Scripts/DynamicsWebApi.jQuery.js).

At this moment a Callbacks version of the library depends on [jQuery](https://github.com/jquery/jquery)

## Dependencies
* [Yaku](https://github.com/ysmood/yaku) - Promise polyfill
* [Axios](https://github.com/mzabriskie/axios)
* [jQuery](https://github.com/jquery/jquery) - if a Callbacks version of the library is being used
