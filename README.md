# DynamicsWebApi for Microsoft Dynamics 365 CE (CRM) / Microsoft Dataverse Web API (formerly known as Microsoft Common Data Service Web API) 

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/AleksandrRogov/DynamicsWebApi/build-test-coverage.yml?style=flat-square)](https://github.com/AleksandrRogov/DynamicsWebApi/actions/workflows/build-test-coverage.yml)
[![Coveralls](https://img.shields.io/coveralls/AleksandrRogov/DynamicsWebApi/master.svg?style=flat-square)](https://coveralls.io/github/AleksandrRogov/DynamicsWebApi)
![npm](https://img.shields.io/npm/dm/dynamics-web-api?style=flat-square)
![npm](https://img.shields.io/npm/dt/dynamics-web-api?style=flat-square)

DynamicsWebApi is a Microsoft Dynamics 365 CE (CRM) / Microsoft Dataverse (formerly: Common Data Service) Web API helper library written in JavaScript.
It is compatible with: Microsoft Dataverse (formerly: Microsoft Common Data Service), Microsoft Dynamics 365 CE (online), Microsoft Dynamics 365 CE (on-premises), Microsoft Dynamics CRM 2016, Microsoft Dynamics CRM Online.

### For a full v1.x documentation please check [DynamicsWebApi project on GitHub](https://github.com/AleksandrRogov/DynamicsWebApi/tree/v1).

### DynamicsWebApi v2 beta is out! Check out [v2.x documentation on GitHub](https://github.com/AleksandrRogov/DynamicsWebApi).

Check out a development progress in a [DynamicsWebApi v2 Project](https://github.com/users/AleksandrRogov/projects/2).

New patches `v.1.7.8+` will contain deprecation warnings, watch out for them in the code and replace them as per recommendations (if available). Otherwise, let me know!

Libraries for browsers can be found in [dist](https://github.com/AleksandrRogov/DynamicsWebApi/tree/v1/dist) folder.

***

Please note, that "Dynamics 365" in this readme refers to Microsoft Dynamics 365 Customer Engagement / Microsoft Dataverse (formerly known as Microsoft Common Data Service).

## v1 Support Plans

I am planning to continue supporting v1 for at least a year, beginning from August 1, 2023 and until I see that the majority of installations moved to v2. After that point, v1 will be obsolete. 

By supporting I mean that v1 will not be getting new features but only bug fixes and, in rare cases, minor additions to its core functionality (like, adding new properties to requests).

I would highly recommend to use v2 for all new projects moving forward. For old/existing projects here is the list of [breaking changes](https://github.com/AleksandrRogov/DynamicsWebApi/issues/135), in case you decide to migrate and if you want to learn about new features - here is a summary of [what's new in v2](https://github.com/AleksandrRogov/DynamicsWebApi/issues/146).

## Usage Examples

### DynamicsWebApi as a Dynamics 365 web resource
In order to use DynamicsWebApi inside Dynamics 365 you need to download a browser version of the library, it can be found in [dist](/dist/) folder.

Upload a script as a JavaScript Web Resource, place on the entity form or refer to it in your HTML Web Resource and then initialize the main object:

```js
//DynamicsWebApi makes calls to Web API v8.0 if a configuration is not set
const dynamicsWebApi = new DynamicsWebApi();

dynamicsWebApi.executeUnboundFunction("WhoAmI").then(function (response) {
    Xrm.Navigation.openAlertDialog({ 
        text: "Hello Dynamics 365! My id is: " + response.UserId,
        title: "DynamicsWebApi Test"
    });
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
//CommonJS
const DynamicsWebApi = require('dynamics-web-api');

//ES6 Module
import DynamicsWebApi from 'dynamics-web-api';
```

### Batch Operation Example

```js

var contact = {
    firstname: 'John',
    lastname: 'Doe'
};

var order = {
    name: '1 year membership',
    //reference a request in a navigation property
    'customerid_contact@odata.bind': '$1'
};

dynamicsWebApi.startBatch();
dynamicsWebApi.createRequest({ entity: contact, collection: 'contacts', contentId: '1' });
dynamicsWebApi.createRequest({ entity: order, collection: 'salesorders' });

dynamicsWebApi.executeBatch()
    .then(function (responses) {
        //in this case both ids exist in a response
        //which makes it a preferred method
        var contactId = responses[0];
        var salesorderId = responses[1];
    }).catch(function (error) {
        //catch error here
    });

```

## Contributions

First of all, I would like to thank you for using `DynamicsWebApi` library in your Dynamics 365 CE / Common Data Service project, the fact that my project helps someone to achieve their development goals already makes me happy. 

And if you would like to contribute to the project you may do it in multiple ways:
1. Submit an issue/bug if you have encountered one.
2. If you know the root of the issue please feel free to submit a pull request, just make sure that all tests pass and if the fix needs new unit tests, please add one.
3. Let me and community know if you have any ideas or suggestions on how to improve the project by submitting an issue on GitHub, I will label it as a 'future enhancement'.
4. Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/alexrogov/) and if you wish to let me know how you use `DynamicsWebApi` and what project you are working on, I will be happy to hear about it.

All contributions are greatly appreciated!