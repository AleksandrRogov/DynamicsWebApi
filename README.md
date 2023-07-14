# DynamicsWebApi for Microsoft Dynamics 365 CE (CRM) / Microsoft Dataverse Web API (formerly known as Microsoft Common Data Service Web API) 

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/AleksandrRogov/DynamicsWebApi/build-test-coverage.yml?style=flat-square)](https://github.com/AleksandrRogov/DynamicsWebApi/actions/workflows/build-test-coverage.yml)
[![Coveralls](https://img.shields.io/coveralls/AleksandrRogov/DynamicsWebApi.svg?style=flat-square)](https://coveralls.io/github/AleksandrRogov/DynamicsWebApi)
![npm](https://img.shields.io/npm/dm/dynamics-web-api?style=flat-square)
![npm](https://img.shields.io/npm/dt/dynamics-web-api?style=flat-square)

DynamicsWebApi is a Microsoft Dataverse Web API helper library written in Typescript.

It is compatible with: Microsoft Dataverse, Microsoft Dynamics 365: Customer Service, Field Service, Marketing, Project Operations, Talents, Sales and any application built on Microsoft Power Apps platform. 
As well as Microsoft Dynamics 365 CE (online), Microsoft Dynamics 365 CE (on-premises), Microsoft Dynamics CRM 2016, Microsoft Dynamics CRM Online.

## Main Features

- **Microsoft Dataverse Search API**. Access full power of its Search, Suggestion and Autocomplete capabilities.
- **Batch Requests**. Convert all requests into a Batch operation with a single line of code.
- **Simplicity and Automation**. Such as automated paging, big file downloading/uploading in chunks of data, automated conversion of requests with long URLs into a Batch Request in the background and more!
- **CRUD operations**. Including Fetch XML, Actions and Functions in Microsoft Dataverse Web API.
- **Table Definitions (Entity Metadata)**. Query and modify Table, Column, Choice (Option Set) and Relationship definitions.
- **File Fields**. Upload, Download and Delete data stored in the File Fields.
- **Abort Signal and Abort Controller** (Browser and Node.js 15+). Abort requests when they are no longer need to be completed.
- **Node.js and a Browser** support.
- **Proxy Configuration** support.

Browser-compiled script and type definitions can be found in a [dist](/dist/) folder.

**Please note!** "Dynamics 365" in this readme refers to Microsoft Dataverse (formerly known as Microsoft Common Data Service) / Microsoft Dynamics 365 Customer Engagement / Micorosft Dynamics CRM. **NOT** Microsoft Dynamics 365 Finance and Operations.

## Usage examples

### For a full documentation please check [DynamicsWebApi on GitHub](https://github.com/AleksandrRogov/DynamicsWebApi).

### Dynamics 365 Web Resource
To use DynamicsWebApi inside Dynamics 365 you need to download a browser version of the library, it can be found in [dist](/dist/) folder.

Upload a script as a JavaScript Web Resource, add it to a table form or reference it in your HTML Web Resource and then initialize the main object:

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

### Example of a Batch Operation using DynamicsWebApi

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

### For a full documentation please check [DynamicsWebApi on GitHub](https://github.com/AleksandrRogov/DynamicsWebApi).

## Contributions

First of all, I would like to thank you for using `DynamicsWebApi` library in your Dynamics 365 CE / Common Data Service project, the fact that my project helps someone to achieve their development goals already makes me happy. 

And if you would like to contribute to the project you may do it in multiple ways:
1. Submit an issue/bug if you have encountered one.
2. If you know the root of the issue please feel free to submit a pull request, just make sure that all tests pass and if the fix needs new unit tests, please add one.
3. Let me and community know if you have any ideas or suggestions on how to improve the project by submitting an issue on GitHub, I will label it as a 'future enhancement'.
4. Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/alexrogov/) and if you wish to let me know how you use `DynamicsWebApi` and what project you are working on, I will be happy to hear about it.

All contributions are greatly appreciated!
