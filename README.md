# CrmWebApi
CrmWebApi is a javascript Microsoft Dynamics CRM Web API helper library.

The project is currently under development.

Any suggestions are welcome!

## Quick Start
In order to use a library CrmWebApi.js needs to be added as a Web Resource in CRM.

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
//call CrmWebApi.createRecord function
CrmWebApi.createRecord(lead, "lead").then(function (id) {
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
    subject: "Test update"
}
//perform an update operation
CrmWebApi.updateRecord(leadId, lead, "lead").then(function () {
    //do something after a succesful operation
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
CrmWebApi.deleteRecord(leadId, "lead").then(function () {
    //do something after a succesful operation
})
.catch(function (error) {
    //catch an error
});
```

#### Retrieve a record

```js
//perform a retrieve operaion
CrmWebApi.retrieveRecord(accountId, "lead", ["fullname", "subject"]).then(function (object) {
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
CrmWebApi.retrieveMultipleRecords("lead", ["fullname", "subject"], "statecode eq 0", null).then(function (records) {
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
CrmWebApi.retrieveMultipleRecordsAdvanced(operationOptions).then(function (records) {
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
CrmWebApi.countRecords("lead", "statecode eq 0").then(function (count) {
    //do something with count here
})
.catch(function (error) {
    //catch an error
});
```

### In Progress
All the rest operations that can be performed using CRM Web API are in a work progress.

Thank you for your patience!

## Javascript Promises
CrmWebApi uses [ES6 Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) instead of callbacks and [Yaku](https://github.com/ysmood/yaku) as a Promise polyfill.
A library version with callbacks is [under a consideraion](https://github.com/o4u/CrmWebApi/issues/1).

## Dependencies
* [Yaku](https://github.com/ysmood/yaku)
* [Axios](https://github.com/mzabriskie/axios)

CrmWebApi.js contains minified code of listed libraries.
