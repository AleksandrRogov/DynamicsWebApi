# Breaking Changes in v2 (v1 -> v2)

 ### 1. DynamicsWebApi Callbacks is fully removed
All modern browsers support Promises (including await/async). The main reason why the Callbacks version was added in the first place was Internet Explorer which has been replaced with Edge and is neither maintained or supported by Microsoft anymore.

 ### 2. Configuration object changes
`webApiUrl` and `webApiVersion` have been removed and replaced with `serverUrl`, `dataApi` and `searchApi`. [#139](https://github.com/AleksandrRogov/DynamicsWebApi/issues/139) 

**Node.JS**
**Before**
```js
new DynamicsWebApi({
    webApiUrl: "https://<YOUR ORG HERE>.api.crm.dynamics.com/api/data/v9.1/"
});
```
**Now**
```js
new DynamicsWebApi({
    serverUrl: "https://<YOUR ORG HERE>.api.crm.dynamics.com",
    dataApi: {
        version: "9.1"
    }
});
```
**Web Resource**
**Before**
```js
new DynamicsWebApi({
    webApiVersion: "9.1"
});
```
**Now**
```js
new DynamicsWebApi({
    dataApi: {
        version: "9.1"
    }
});
```

 ### 3. All request functions with multiple parameters are removed.
No more "simple" functions with multiple parameters. This has been done to streamline the request parameters and not introduce breaking changes when new parameters have been added. Furthermore, now all functions have access to impersonation, cache and data tracking functionality.

### 4. Changes to the names of some request functions and properties

| Old Name | New Name |
|--------|--------|
| createRequest | create |
| updateRequest | update |
| upsertRequest | upsert |
| deleteRequest | deleteRecord |
| retrieveRequest | retrieve |
| retrieveMultipleRequest | retrieveMultiple | 
| retrieveAllRequest | retrieveAll |
| executeFetchXml | fetch |
| executeFetchXmlAll | fetchAll |
| executeBoundFunction | callFunction |
| executeUnboundFunction | callFunction |
| executeBoundAction | callAction |
| executeUnboundAction | callAction |
| utility | Utility |

 ### 5. In some requests `entity` property is replaced with `data`
Affected requests: `createRequest`, `updateRequest` and `upsertRequest` and their corresponding new names: `create`, `update` and `upsert`.

Example:
```js
const lead = {
    subject: "Test WebAPI",
    firstname: "Test",
    lastname: "WebAPI",
    jobtitle: "Title"
};

const result = await dynamicsWebApi.create({
    collection: "leads",
    data: lead,
    returnRepresentation: true
});
```

### 6. `config.onTokenRefresh` is now a promise-based function
Usage example:
```ts
const cca = new MSAL.ConfidentialClientApplication(msalConfig);
const serverUrl = 'https://<YOUR ORG HERE>.api.crm.dynamics.com';

//function calls an external functionality that acquires a token and passes it to DynamicsWebApi
const acquireToken = async () => {
    try {
        return await cca.acquireTokenByClientCredential({
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

const dynamicsWebApi = new DynamicsWebApi({
    serverUrl: serverUrl,
    onTokenRefresh: acquireToken
});
```

### 7. Removed `id`  property from the request object.
`id` has been deprecated for quite some time and got removed in v2. Use `key` instead.

### 8. Default version of Dataverse API is set to `9.2`
In case you still need version `8.0`, please set `dataApi.version` to `8.0`.

### 9. Supported minimum version of Node.js raised to v.15.0.0.
It was time to finally bump up the JavaScript specification from ES5 to ES2020 for the project. It is widely supported in all modern browsers and all currently maintained versions of Node. Even though the minimum Node.js version that supports ES2020 is 14.5.0, I would recommend running DynamicsWebApi on at least v.15.0.0 for all features to work correctly. In all versions prior to 15 the `AbortSignal` functionality won't work because it did not exist there yet.