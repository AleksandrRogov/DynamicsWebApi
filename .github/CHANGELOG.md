<a name="v2.2.0"></a>
# [v2.2.0](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.2.0) - 09 Feb 2025

**Changes**
- :warning: Dropping official support for Node.js v16. Mainly because I cannot run actions with that version anymore, so I cannot guarantee that any future changes will continue working in it.
- Replaced a custom UUID generator function with a built-in `randomUUID` (Crypto API). 
:warning: This may cause issues in the older browsers, and the library must now run in the "Secure Context" (https).
- Slightly optimized `dateReviver` function.

**Fixes**
- Modified `expand` property in the type definitions to accept a `string`. It could always accept a `string` instead of an array of expand objects.

[Changes][v2.2.0]


<a name="v2.1.7"></a>
# [v2.1.7](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.1.7) - 16 Sep 2024

**Fixes:**
- Wrong type declaration for `UploadRequest` and `DownloadRequest`: `property` and `fieldName` should be optional, until `fieldName` is removed.

**Changes:**
- Additional optimizations of regular expressions.

[Changes][v2.1.7]


<a name="v.2.1.6"></a>
# [v2.1.6 (v.2.1.6)](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v.2.1.6) - 10 Sep 2024

**Changes**
- :warning: Deprecated: `fieldName` in request properties for `deleteRecord`, `uploadFile`, `downloadFile`. Please use `property` instead.
- Curly brackets won't be removed from the GUIDs inside `filter` if the value that contains the GUID is inside single quotes, which means it's a string. This is an improvement of an existing functionality.
Before: `"attribute eq 'some text {GUID} more text'"` would result in `"attribute eq 'some text GUID more text'"`
Now: `"attribute eq 'some text {GUID} more text'"` stays the same `"attribute eq 'some text {GUID} more text'"`
- Improving performance by pre-compiling and optimizing regular expressions.
- General refactoring to improve code readability.

[Changes][v.2.1.6]


<a name="v2.1.5"></a>
# [v2.1.5](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.1.5) - 11 Jul 2024

**Fixes**
- Missing authorization token when request with a long URL is converted into a Batch request. [#175](https://github.com/AleksandrRogov/DynamicsWebApi/issues/175) 

[Changes][v2.1.5]


<a name="v2.1.4"></a>
# [v2.1.4](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.1.4) - 11 Apr 2024

**Fixes**
- `name` property in a `callFunction` must be optional, until `functionName` is removed.

[Changes][v2.1.4]


<a name="v2.1.3"></a>
# [v2.1.3](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.1.3) - 11 Apr 2024

**Changes**:
- Added support for composable functions. Request object in `callFunction` now accepts `select` and `filter` parameters. [#168](https://github.com/AleksandrRogov/DynamicsWebApi/issues/168) 
- ContentId can be used as an URI reference inside the Batch Request. For example:
```ts
dynamicsWebApi.startBatch();

dynamicsWebApi.create({
  contentId: "1", //<-- this content id will be used in the next request
  collection: "contacts",
  data: {
    firstname: "James",
    lastname: "Doe"
  }
});

dynamicsWebApi.updateSingleProperty({
  contentId: "$1", //<-- using content id of the record created in a previous request
  // note, that neither "collection" nor "key" is used in this request, 
  // contentId replaces those
  fieldValuePair: { lastname: "Bond" }
});

const results = await dynamicsWebApi.executeBatch();
//results[0] will have an id of a contact record
//results[1] will be empty
```

**Deprecations**:
- `functionName` parameter in `callFunction` is marked as deprecated and will be removed in one of the future versions. Please use `name` instead.

[Changes][v2.1.3]


<a name="v1.7.12"></a>
# [v1.7.12](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.7.12) - 10 Apr 2024

**Changes:**
* Added a `skipNameCheck` for composable functions workaround [#168](https://github.com/AleksandrRogov/DynamicsWebApi/issues/168) 

[Changes][v1.7.12]


<a name="v2.1.2"></a>
# [v2.1.2](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.1.2) - 22 Dec 2023

**Changes**:
- Added `@odata.nextLink`, `@odata.count` and `@odata.deltaLink` to TypeScript definitions.

**Fixes**:
- Duplicate query parameters during pagination with `nextPageLink` parameter in `retrieveMultiple`. [#164](https://github.com/AleksandrRogov/DynamicsWebApi/issues/164) 
- Duplicate `serverUrl` in a request url during pagination with `nextPageLink` parameter in `retrieveMultiple`. This only happened if `serverUrl` in DynamicsWebApi config had a closing slash. [#164](https://github.com/AleksandrRogov/DynamicsWebApi/issues/164) 

[Changes][v2.1.2]


<a name="v2.1.1"></a>
# [v2.1.1](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.1.1) - 02 Sep 2023

**Changes:**
* Minor changes in type declarations.

[Changes][v2.1.1]


<a name="v2.1.0"></a>
# [v2.1.0](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.1.0) - 27 Aug 2023

**Changes:**
- Custom headers can now be added by default through the configuration object, or included with each request. [#151](https://github.com/AleksandrRogov/DynamicsWebApi/issues/151)
    For example: `await dynamicsWebApi.retrieveMultiple({ collection: "contacts", headers: { "my-header": "value" } });`
- Added support for Microsoft Power Pages. Thanks to [@03-CiprianoG](https://github.com/03-CiprianoG) for the PRs! [More Info](https://github.com/AleksandrRogov/DynamicsWebApi#microsoft-power-pages-microsoft-portal).

[Changes][v2.1.0]


<a name="v2.0.1"></a>
# [v2.0.1](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.0.1) - 16 Aug 2023

Fixes:
- Object.hasOwn is replaced with hasOwnProperty because it's not supported in Node v15. [#160](https://github.com/AleksandrRogov/DynamicsWebApi/issues/160) 

[Changes][v2.0.1]


<a name="v2.0.0"></a>
# [v2.0.0](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.0.0) - 20 Jul 2023

Version 2 is out! :raised_hands: 
What a run... I am very excited to see how many of you will migrate and, of course, I will be happy to hear your comments and/or you have any issues with it.
Special thank you to all who helped me to test the beta version of the library! :thumbsup:

v2 open discussion is [here](https://github.com/AleksandrRogov/DynamicsWebApi/discussions/155).

Forgot to include the .js.map files in this release on GitHub, so if you'd like to get them please refer to this [commit](https://github.com/AleksandrRogov/DynamicsWebApi/tree/4eca6bf48c5c497a4e820df8db6a866a817738b2/dist). 

**More details about v2:**
- What's new in version 2? Check out [this link](https://github.com/AleksandrRogov/DynamicsWebApi/blob/master/.github/NEW_IN_V2.md).
- For the list of Breaking Changes check out [this link](https://github.com/AleksandrRogov/DynamicsWebApi/blob/master/.github/BREAKING_CHANGES_V2.md).

[Changes][v2.0.0]


<a name="v2.0.0-beta.4"></a>
# [v2.0.0-beta.4](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.0.0-beta.4) - 16 Jul 2023

**This is a beta release of v2.** Thus, there can still be changes and fixes. For testing purposes only!

**Fixes:**
* Several issues with ESM bundles.

Also found a bug in Dynamics 365 with batch operations. It throws an error when multiple non-atomic operations that change data were done. A workaround there is to add a "GET" request at the end of the batch to make it work. Seems like that bug was there for a looong time already.

v2.0.0-beta.3 was not the last one, so I lied! :) Hopefully, this one will be the last!

**More details about v2:**
- What's new in version 2? Check out [this link](https://github.com/AleksandrRogov/DynamicsWebApi/blob/master/.github/NEW_IN_V2.md).
- For the list of Breaking Changes check out [this link](https://github.com/AleksandrRogov/DynamicsWebApi/blob/master/.github/BREAKING_CHANGES_V2.md)

[Changes][v2.0.0-beta.4]


<a name="v2.0.0-beta.3"></a>
# [v2.0.0-beta.3](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.0.0-beta.3) - 14 Jul 2023

**This is a beta release of v2.** Thus, there can still be changes and fixes. For testing purposes only!

**Fixes:**
- Wrong error message in case of network error. [#153](https://github.com/AleksandrRogov/DynamicsWebApi/issues/153)

This will be the last beta release for v2. The official release will be either this weekend or next week!

**More details about v2:**
- What's new in version 2? Check out [this link](https://github.com/AleksandrRogov/DynamicsWebApi/blob/master/.github/NEW_IN_V2.md).
- For the list of Breaking Changes check out [this link](https://github.com/AleksandrRogov/DynamicsWebApi/blob/master/.github/BREAKING_CHANGES_V2.md)

[Changes][v2.0.0-beta.3]


<a name="v1.7.11"></a>
# [v1.7.11](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.7.11) - 14 Jul 2023

**Fixes:**
* Wrong error message in case of network error. [#153](https://github.com/AleksandrRogov/DynamicsWebApi/issues/153) 
* Incorrect bundle for a browser.

[Changes][v1.7.11]


<a name="v1.7.10"></a>
# [v1.7.10](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.7.10) - 11 Jul 2023

**Changes:**
- Added `continueOnError` property to `executeBatch`.
```js
dynamicsWebApi.executeBatch({
  continueOnError: true
});
```

[Changes][v1.7.10]


<a name="v2.0.0-beta.1"></a>
# [v2.0.0-beta.1](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.0.0-beta.1) - 10 Jul 2023

**This is a beta release of v2.** Thus, there can still be changes and fixes. For testing purposes only!

**Changes:**
- Added `continueOnError` in `executeRequest` parameter.
- Added ESM bundles for Node and Browser.
- Fixed Browser bundle. Previously, the generated code did not create a global DynamicsWebApi class.

**More details about v2:**
- What's new in version 2? Check out: [#146](https://github.com/AleksandrRogov/DynamicsWebApi/issues/146) 
- For the list of Breaking Changes check out [#135](https://github.com/AleksandrRogov/DynamicsWebApi/issues/135) 

[Changes][v2.0.0-beta.1]


<a name="v2.0.0-beta.0"></a>
# [v2.0.0-beta.0](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v2.0.0-beta.0) - 17 Jun 2023

**This is a beta release of v2.** Thus, there can still be changes and fixes. For testing purposes only!

- What's new in version 2? Check out: [#146](https://github.com/AleksandrRogov/DynamicsWebApi/issues/146) 
- For the list of Breaking Changes check out [#135](https://github.com/AleksandrRogov/DynamicsWebApi/issues/135) 

[Changes][v2.0.0-beta.0]


<a name="v1.7.9"></a>
# [v1.7.9](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.7.9) - 15 May 2023

**Fixes:**
* Fixed an issue with function parameters of type "guid" [#149](https://github.com/AleksandrRogov/DynamicsWebApi/issues/149) .

**Heads up!**
* I changed the way the guids are validated. Before you could have typed in something like `savedQuery = 'my wonderful guid=fb15ee32-524d-41be-b6a0-7d0f28055d52'` and it would normally extract it, now the value must be an exact guid `savedQuery = 'fb15ee32-524d-41be-b6a0-7d0f28055d52'` or `savedQuery = '{fb15ee32-524d-41be-b6a0-7d0f28055d52}'`. Otherwise it would throw an error: `<function name> requires the <param name> parameter to be of type GUID String`.

Please let me know if this causes any issues.

[Changes][v1.7.9]


<a name="v1.7.8"></a>
# [v1.7.8](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.7.8) - 02 Apr 2023

**Changes**
- Added deprecations. All deprecated functions and properties will be removed in v2. Please consult [#135](https://github.com/AleksandrRogov/DynamicsWebApi/issues/135) for a list of breaking changes.

[Changes][v1.7.8]


<a name="v1.7.7"></a>
# [v1.7.7](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.7.7) - 16 Mar 2023

**Changes:**

* Added new parameter for the "advanced" requests: `partitionId`. [More Info.](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/azure-storage-partitioning)
* Added new parameter for the "advanced" requests: `queryParams`. 
**Important!** The values in the parameters are NOT being URI encoded! If the encoding is needed, please encode it before calling a function.

Example:

```js
const response = await dynamicsWebApi.retrieveMultipleRequest({
    collection: `accounts`,
    filter: "Microsoft.Dynamics.CRM.In(PropertyName=@p1,PropertyValues=@p2)",
    queryParams: ["@p1='lastname'", '@p2=["Last", "Last\'2"]']
});

// the request will be made to the following url:
// https://<server>?$filter=Microsoft.Dynamics.CRM.In(PropertyName=@p1,PropertyValues=@p2)&@p1=\'lastname\'&@p2=["First", "Last\'s"]
```

[Changes][v1.7.7]


<a name="v1.7.6"></a>
# [v.1.7.6 (v1.7.6)](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.7.6) - 29 Aug 2022

**Fixes:**
* Fix the regex from rejecting alternativeKeys with multiple navigation properties. [#111](https://github.com/AleksandrRogov/DynamicsWebApi/issues/111). Thanks to [@benlaughlin](https://github.com/benlaughlin) for a pull request! 
* Fix to double quote replace function in the alternate key. It was only replacing the first appearance of `"`. [#117](https://github.com/AleksandrRogov/DynamicsWebApi/issues/117) 

**Changes:**
* Multiple changes to documentation:
  * Replaced an old authentication code example that used `adal-node` with `@azure/msal-node`.
  * Added more information to a Batch Request documentaiton. [#112](https://github.com/AleksandrRogov/DynamicsWebApi/issues/112) 

[Changes][v1.7.6]


<a name="v1.7.5"></a>
# [v1.7.5](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.7.5) - 14 Mar 2022

**Changes:**

* Added new advanced request parameter `bypassCustomPluginExecution` that allows developers to bypass custom plugin/workflow executions [#107](https://github.com/AleksandrRogov/DynamicsWebApi/issues/107). [More Info](https://docs.microsoft.com/en-us/powerapps/developer/data-platform/bypass-custom-business-logic)

[Changes][v1.7.5]


<a name="v1.7.4"></a>
# [v1.7.4](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.7.4) - 19 Jun 2021

**Fixes:**

* Fixed a bug that was not allowing developers to put "top" inside the fetch xml. Everytime it has been done `executeFetchXml` was throwing an error: "The top attribute can't be specified with paging attribute page" [#98](https://github.com/AleksandrRogov/DynamicsWebApi/issues/98)

**Changes:**

* Typescript type definitions. Added a generic type to `CreateRequest` , `UpdateRequest` and `UpserRequest` for type checking of the `entity` property inside the request object.

[Changes][v1.7.4]


<a name="v1.7.3"></a>
# [v1.7.3](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.7.3) - 12 Apr 2021

Fixes:
* Fixed a bug with request that may fail if it runs right after an execute batch `executeBatch()` function. Thanks to [@Kukunin](https://github.com/Kukunin) for a PR [#92](https://github.com/AleksandrRogov/DynamicsWebApi/issues/92) 

Changes:
* Added a meaningful error that will be returned if the batch operation has an empty payload.

[Changes][v1.7.3]


<a name="v1.7.2"></a>
# [v1.7.2](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.7.2) - 24 Feb 2021

**Fixes**
* Some request parameters may have never been deleted from a temporary cache after some specific errors. This issue has been introduced in `v.1.6.15`, so the update to this new version is highly recommended.

**Changes**
* Default Node.js HTTP/HTTPS agent will now reuse an existing connection which should improve application performance.
* Added full support for different proxy servers.
* Added 2 dependencies: [http-proxy-agent](https://github.com/TooTallNate/node-https-proxy-agent) and [https-proxy-agent](https://github.com/TooTallNate/node-http-proxy-agent)

Thank you to [@nabeelamir-defra](https://github.com/nabeelamir-defra) for submitting the proxy issue [#89](https://github.com/AleksandrRogov/DynamicsWebApi/issues/89) .

[Changes][v1.7.2]


<a name="v1.7.1"></a>
# [v1.7.1](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.7.1) - 31 Jan 2021

**Changes:**
* No major/minor changes, just decreased the size of an NPM package.
* updated type definitions for promises.

[Changes][v1.7.1]


<a name="v1.7.0"></a>
# [v1.7.0](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.7.0) - 04 Dec 2020

Changes:
* Added `uploadFile` function.
* Added `downloadFile` function.
* Added `fieldName` to `deleteRequest` request parameter, in order to allow developers to delete file from the file field.

Minor version is wrapping up major changes done in `v.1.6.15` and adding new upload/download file functionality. No breaking changes at this point.

Starting from `v1.7.1` `dist` and `test` folders are no longer going to be a part of an npm package. That will shrink the size of the package from 1.7mb to around 350kb.

[Changes][v1.7.0]


<a name="v1.6.15"></a>
# [v1.6.15](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.15) - 30 Nov 2020

Fixes:
* Major issue with concurrency in the library. See [#80](https://github.com/AleksandrRogov/DynamicsWebApi/issues/80) and [#81](https://github.com/AleksandrRogov/DynamicsWebApi/issues/81). Thank you [@Suxsem](https://github.com/Suxsem) for reporting the issues.

Upcoming in the next release:
* `uploadFile` and `downloadFile` functions for uploading/downloading data from file fields. [#82](https://github.com/AleksandrRogov/DynamicsWebApi/issues/82)  

[Changes][v1.6.15]


<a name="v1.6.14"></a>
# [v1.6.14](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.14) - 07 Nov 2020

Fixes:
* `fetch`, `fetchAll` did not return `PagingInfo` with `useEntityNames` set to `true`. Thanks to [@Lebowskovitch](https://github.com/Lebowskovitch) for reporting this issue [#79](https://github.com/AleksandrRogov/DynamicsWebApi/issues/79).

[Changes][v1.6.14]


<a name="v1.6.13"></a>
# [v1.6.13](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.13) - 23 Oct 2020

Fixes:
* Undeclared variables. Thanks to [@Lebowskovitch](https://github.com/Lebowskovitch) for a PR [#78](https://github.com/AleksandrRogov/DynamicsWebApi/issues/78) 

[Changes][v1.6.13]


<a name="v1.6.12"></a>
# [v1.6.12](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.12) - 08 Sep 2020

Changes:

* Added a new way of user impersonation. [More Info](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/impersonate-another-user-web-api). Thanks to [@azakariaMSFT](https://github.com/azakariaMSFT) for the PR [#76](https://github.com/AleksandrRogov/DynamicsWebApi/issues/76) ! 
Please use a parameter called `impersonateAAD` in the configuration or in advanced requests if you want to leverage new functionality.

[Changes][v1.6.12]


<a name="v1.6.11"></a>
# [v1.6.11](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.11) - 19 Aug 2020

Fixes:
* Dates were not converted correctly in batch requests after changes in the previous patch `v1.6.10`.

Changes:
* Added an optional `request` parameter to `executeBatch` function [#74](https://github.com/AleksandrRogov/DynamicsWebApi/issues/74) . Thanks to [@andreaValenzi](https://github.com/andreaValenzi) for pull requests! 

[Changes][v1.6.11]


<a name="v1.6.10"></a>
# [v1.6.10](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.10) - 01 Aug 2020

Fixes:
* New config setting set using `.setConfig` does not rewrite `webApiUrl` if it has not been passed as a parameter.

Changes:
* Added `timeout` parameter to advanced request. Parameter can be set in all operations.

[Changes][v1.6.10]


<a name="v1.6.9"></a>
# [v1.6.9](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.9) - 29 Jul 2020

Changes:

* Internal batch request collection now stores deep copy of the request objects instead of original ones.

[Changes][v1.6.9]


<a name="v1.6.8"></a>
# [v1.6.8](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.8) - 19 Jul 2020

`1.6.7` hot fix release

Changes:
* Normalize response headers in a batch response


[Changes][v1.6.8]


<a name="v1.6.7"></a>
# [v1.6.7](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.7) - 19 Jul 2020

Changes:

* Added response headers to error object as requested in [#69](https://github.com/AleksandrRogov/DynamicsWebApi/issues/69) . To access response headers use `error.headers` property.

[Changes][v1.6.7]


<a name="v1.6.6"></a>
# [v1.6.6](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.6) - 30 Jun 2020

**Fixes:**
* Formatted values did not have aliases in expand objects.

**Changes:**
* Added response types to TypeScript declaration files.

[Changes][v1.6.6]


<a name="v1.6.5"></a>
# [v1.6.5](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.5) - 23 Jun 2020

Changes:

* Removed limitation where `useEntityNames: true` did not work if there was no cached metadata before executing batch request.

[Changes][v1.6.5]


<a name="v1.6.4"></a>
# [v1.6.4](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.4) - 10 Jun 2020

Changes:
* Added `apply` request option to advanced requests that allows to dynamically aggregate and group data. At this moment the parameter is a type of string, I will be looking into making it an object. [More Info](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/webapi/query-data-web-api#aggregate-and-grouping-results)
* Allow nested `expand` options. [#67](https://github.com/AleksandrRogov/DynamicsWebApi/issues/67) 

[Changes][v1.6.4]


<a name="v1.6.3"></a>
# [v1.6.3](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.3) - 31 Mar 2020

Fixes:
* Issue [#66](https://github.com/AleksandrRogov/DynamicsWebApi/issues/66) . Alternate Key can now contain a UUID value.

[Changes][v1.6.3]


<a name="v1.6.2"></a>
# [v1.6.2](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.2) - 12 Feb 2020

Fixes:
* **Dynamics 365 Unified Interface Only**: when `useEntityNames` set to `true` and a web api request is made with a collection name instead of a logical name of the entity, the request could fail because metadata for the entity cannot be found.

[Changes][v1.6.2]


<a name="v1.6.1"></a>
# [v1.6.1](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.1) - 03 Feb 2020

Fixes:
* Skip adding quotes for Web API type parameters in Web API Function operations: [#65](https://github.com/AleksandrRogov/DynamicsWebApi/issues/65) 

[Changes][v1.6.1]


<a name="v1.6.0"></a>
# [v1.6.0](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.6.0) - 23 Nov 2019

Changes:
* Parse response of a failed batch request. **Important!** This is a breaking change for those who use batch requests because of changes in an error parameter type which is passed in the catch callback. Starting from `v1.6.0` a parameter passed inside a catch callback of a failed batch request is an array of objects, one of those objects is the error that caused the batch to fail. Usually it is at the same index as a failed request in the batch. To get an error message, I would recommend looping though an array and checking the type of each object, for example: `response[i] instanceof Error`.

```js
dynamicsWebApi.startBatch();

dynamicsWebApi.retrieveMultiple('accounts');
dynamicsWebApi.update('00000000-0000-0000-0000-000000000002', 'contacts', { firstname: "Test", lastname: "Batch!" });
dynamicsWebApi.retrieveMultiple('contacts');

//execute a batch request:
dynamicsWebApi.executeBatch()
    .then(function (responses) {
       //parse response
    }).catch(function (response) {
        //response is an array
        for (var i = 0; i < response.length; i++){
            if (response[i] instanceof Error){
                //error will be at the same index as the failed request in the batch
            }
            else{
                //response of a successful request
            }
        }
    });
```

[Changes][v1.6.0]


<a name="v1.5.14"></a>
# [v1.5.14](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.14) - 16 Nov 2019

Fixes
* error during parsing of a batch response that contains urls with alternate keys

[Changes][v1.5.14]


<a name="v1.5.13"></a>
# [v1.5.13](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.13) - 11 Nov 2019

Fixes:
* made changes to findCollectionName function to make it work in the Dynamics 365 Unified Interface

[Changes][v1.5.13]


<a name="v1.5.12"></a>
# [v1.5.12](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.12) - 09 Nov 2019

Changes:
* `retrieveAllRequest` will include `@odata.deltaLink` in the result of the request that had `trackChanges` set to `true`.

[Changes][v1.5.12]


<a name="v1.5.11"></a>
# [v1.5.11](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.11) - 16 Oct 2019

Changes
* Added Change Tracking functionality [#57](https://github.com/AleksandrRogov/DynamicsWebApi/issues/57).

[Changes][v1.5.11]


<a name="v1.5.10"></a>
# [v1.5.10](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.10) - 08 Aug 2019

Fixes:

* [#55](https://github.com/AleksandrRogov/DynamicsWebApi/issues/55) - Avoid undefined error in batch operation. Thanks [@yonaichin](https://github.com/yonaichin) for a pull request.
* [#56](https://github.com/AleksandrRogov/DynamicsWebApi/issues/56) - A required parameter cannot follow an optional parameter in TypeScript definitions.

[Changes][v1.5.10]


<a name="v1.5.9"></a>
# [v1.5.9](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.9) - 05 Jul 2019

Fixes:
* `@odata.bind` now does not add a full Web API url, instead it adds `/` if it is not present. This change is crucial for on-premise organizations.
* added `expand` property `RetrieveMutlipleRequest` type definition for TypeScript.
* inconsistent removing of curly braces in guids during a bind operation `@odata.bind`.

Known Issue (On-Premise only):
* DynamicsWebApi uses `GlobalContext.getClientUrl()` to get the URL of an organization, therefore `@odata.id` operations (for example `associate`) are not going to work if the client is running outside of the local network and the client cannot resolve the name of the server that runs Dynamics 365 organization.
`@odata.id` operations require an absolute uri to the resource and because the operation runs at the server it also needs to be a service route uri which contains a server machine name and therefore it is not resolvable for clients outside a local network. If this happens, you will get an error "AbsoluteUri should contain ServiceRouteUri".

[Changes][v1.5.9]


<a name="v1.5.7"></a>
# [v1.5.7](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.7) - 12 May 2019

Changes:
- Use `Content-ID` reference in a batch request payload.
- Fixed type definitions.

[Changes][v1.5.7]


<a name="v1.5.6"></a>
# [v1.5.6](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.6) - 11 May 2019

Changes:
- Added `contentId` in a request object to reference requests in a Change Set.
- Merge [#48](https://github.com/AleksandrRogov/DynamicsWebApi/issues/48) 

[Changes][v1.5.6]


<a name="v1.5.5"></a>
# [v1.5.5](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.5) - 26 Apr 2019

Fixes:
* [#47](https://github.com/AleksandrRogov/DynamicsWebApi/issues/47). Make it work for older js versions.

[Changes][v1.5.5]


<a name="v1.5.4"></a>
# [v1.5.4](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.4) - 17 Apr 2019

Changes:
* Added a `timeout` configuration option. Thanks to [@ncjones](https://github.com/ncjones) [#46](https://github.com/AleksandrRogov/DynamicsWebApi/issues/46) 

[Changes][v1.5.4]


<a name="v1.5.3"></a>
# [v1.5.3](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.3) - 31 Mar 2019

Added:
* TypeScript declaration files. Can be found [here](../../tree/master/types/). [#29](https://github.com/AleksandrRogov/DynamicsWebApi/issues/29) 

Fixes:
* [#45](https://github.com/AleksandrRogov/DynamicsWebApi/issues/45) Issue with parsing object arguments in a `buildFunctionParameters` function.

[Changes][v1.5.3]


<a name="v1.5.2"></a>
# [v1.5.2](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.2) - 29 Mar 2019

Changes:
* Merge [#44](https://github.com/AleksandrRogov/DynamicsWebApi/issues/44) "Add support for http proxy environment variables".

[Changes][v1.5.2]


<a name="v1.5.1"></a>
# [v1.5.1](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.1) - 07 Feb 2019

Fixes:
* [#41](https://github.com/AleksandrRogov/DynamicsWebApi/issues/41) Upsert with AlternateKey causes "TypeError: Cannot read property '1' of null"error

[Changes][v1.5.1]


<a name="v1.5.0"></a>
# [v1.5.0](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.5.0) - 29 Dec 2018

Changes:
* Added Batch operations.

Fixes:
* [#38](https://github.com/AleksandrRogov/DynamicsWebApi/issues/38) Alternate keys does not allow to use integer value (it is forcing to use a string).

[Changes][v1.5.0]


<a name="v1.4.7"></a>
# [v1.4.7](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.4.7) - 19 Oct 2018

Fixed:
* npm update; added `.npmignore` file

Other minor changes.

[Changes][v1.4.7]


<a name="v1.4.6"></a>
# [v1.4.6](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.4.6) - 17 Oct 2018

Changes:
* Added functionality to work with Global Option Sets

[Changes][v1.4.6]


<a name="v1.4.5"></a>
# [v1.4.5](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.4.5) - 02 Sep 2018

Fixes:
* FetchXml paging issue [#30](https://github.com/AleksandrRogov/DynamicsWebApi/issues/30)

Changes:
* Added support for a raw ADAL token [#31](https://github.com/AleksandrRogov/DynamicsWebApi/issues/31)

[Changes][v1.4.5]


<a name="v1.4.4"></a>
# [v1.4.4](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.4.4) - 25 Aug 2018

Fixes:
* fixed [#27](https://github.com/AleksandrRogov/DynamicsWebApi/issues/27) 
* other fixes

Changes:
* added functionality to work with Relationship Definitions
* additional tests

[Changes][v1.4.4]


<a name="v1.4.3"></a>
# [v1.4.3](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.4.3) - 29 Apr 2018

Changes:
* Added Entity Metadata helper functions: `createEntity`, `updateEntity`, `retrieveEntity`, `retrieveEntities`.
* Added Attribute Metadata helper functions: `createAttribute`, `updateAttribute`, `retrieveAttribute`, `retrieveAttributes`.
* Additional request properties related to Entity and Attribute Metadata queries: `navigationPropertyKey`, `metadataAttributeType`.

Next release will include helper functions to work with Relationship and Global Options Sets Metadata.

[Changes][v1.4.3]


<a name="v1.4.2"></a>
# [v1.4.2](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.4.2) - 11 Mar 2018

This release contains multiple fixes and enhancements. At this moment, I am working on adding functions to help developers to work with Entity Metadata.

Changes:
* Parse aliases into a JavaScript object. This enhancement is related to the following ticket: [#23](https://github.com/AleksandrRogov/DynamicsWebApi/issues/23).
Starting from this version you can access aliased parameters in the following way:
```js
var fetchXml = "<fetch version='1.0' distinct='false'>" +
    "  <entity name='contact'>" +
    "    <attribute name='fullname' />" +
    "    <attribute name='contactid' />" +
    "    <link-entity name='systemuser' from='systemuserid' to='owninguser' visible='false' link-type='outer' alias='owner'>" +
    "      <attribute name='fullname' />" +
    "    </link-entity>" +
    "  </entity>" +
    "</fetch>";

dynamicsWebApi.fetch('contacts', fetchXml).then(function (response) {
    var ownerFullname = response.value[0].owner.fullname;
    //instead of: response.value[0].owner_x002e_fullname;
})
.catch(function (error) {
    //...
});
```
* Enhancements related to Entity Metadata requests. Next release will contain functions that will help developers to use DynamicsWebApi to query metadata.

Fixes:
* Special symbols in the filter query parameter. Related to [#22](https://github.com/AleksandrRogov/DynamicsWebApi/issues/22).
* Other fixes.

**Thank you for all your support!** It means a lot to me.

[Changes][v1.4.2]


<a name="v1.4.1"></a>
# [v1.4.1](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.4.1) - 11 Feb 2018

Changes:
* Added: `createRequest` function for create request with additional parameters.
* GUID brackets will be removed from the filter if they exist, for instance: `accountid eq {00000000-0000-0000-0000-000000000001}` will be replaced with `accountid eq 00000000-0000-0000-0000-000000000001`.  It does not apply if the right side of the condition is a string, for example: `sometextfield eq "{00000000-0000-0000-0000-000000000001}"` will remain the same.

[Changes][v1.4.1]


<a name="v1.4.0"></a>
# [v1.4.0](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.4.0) - 24 Nov 2017

Changes:

Added:
* Ability to use Entity Logical Names instead of Collection Logical Names.
* `noCache` request parameter that disables caching.

Fixed:
* Timezone Independent DateTime field value parsing.
* Handling of errors in Node.js.
* Other minor issues.

[Changes][v1.4.0]


<a name="v1.3.4"></a>
# [v1.3.4](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.3.4) - 18 Nov 2017

Changes:

* Update, Delete and Retrieve records using Alternate Key (s).
* Duplicate Detection for Web API v.9.0.

[Changes][v1.3.4]


<a name="v1.3.3"></a>
# [v1.3.3](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.3.3) - 14 Nov 2017

Changes:

* Fixed double URI encoding when $expand query parameter used.
* The `@odata.bind` field value may now contain or does not contain a slash in the beginning.

[Changes][v1.3.3]


<a name="v1.3.2"></a>
# [v1.3.2](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.3.2) - 07 Nov 2017

Added:
* Exclusion to collection name transformation to allow retrieving EntityDefinitions using supported requests. For example: 
```js
_dynamicsWebApi.retrieveMultiple('EntityDefinitions',
 ['DisplayName', 'IsKnowledgeManagementEnabled', 'EntitySetName'], "SchemaName eq 'Account'").then(function(response){
    //response.value[0].EntitySetName
});
```

[Changes][v1.3.2]


<a name="v1.3.1"></a>
# [v1.3.1](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.3.1) - 30 Oct 2017

Changes:
* Added `async` request parameter. Works for XHR requests only!
* Fix [#13](https://github.com/AleksandrRogov/DynamicsWebApi/issues/13) 

[Changes][v1.3.1]


<a name="v1.3.0"></a>
# [v1.3.0](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.3.0) - 07 Oct 2017

Changes:
* Simplified access to formatted and lookup data values. Please check README for more details.
* Improvement [#10](https://github.com/AleksandrRogov/DynamicsWebApi/issues/10)

[Changes][v1.3.0]


<a name="v1.2.9"></a>
# [v1.2.9](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.2.9) - 05 Aug 2017

Changes:

* Minor change in a URL length check.
* Updated README.

[Changes][v1.2.9]


<a name="v1.2.8"></a>
# [v1.2.8](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.2.8) - 04 Aug 2017

Added:

* Web API Request that exceeds a maximum limit of characters in URL will automatically be converted to a Batch Request. A very useful feature when big Fetch XMLs are used. 
* This is the 1st part of Batch Request implementation that will be added to DynamicsWebApi in the future and at this moment `POST`, `PATCH` and `PUT` HTTP request methods are not supported for Batching.

[Changes][v1.2.8]


<a name="v1.2.7"></a>
# [v1.2.7](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.2.7) - 21 Jul 2017

Added:

* Remove brackets from GUID in a navigation property `@odata.bind` value if they exist. Example: `parentcustomerid@odata.bind: '/account({00000000-0000-0000-0000-000000000001})'` will be automatically changed to `parentcustomerid@odata.bind: '/account(00000000-0000-0000-0000-000000000001)'`. No need to call `.replace(/[{}]/g, "")` anymore.

[Changes][v1.2.7]


<a name="v1.2.6"></a>
# [v1.2.6](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.2.6) - 13 Jul 2017

Fixes [#7](https://github.com/AleksandrRogov/DynamicsWebApi/issues/7) - "Mismatched Anonymous Define" error, when require.js is being used together with DynamicsWebApi.



[Changes][v1.2.6]


<a name="v1.2.5"></a>
# [v1.2.5](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.2.5) - 08 Jul 2017

Added:
* `fetch` - is an alias to `executeFetchXml` with same parameters and shorter name.
* `fetchAll` and `executeFetchXmlAll` - execute Fetch XML and do a pagination automatically.
* `retrieveAll` - is a basic version of `retrieveAllRequest` with a limited number of parameters.

[Changes][v1.2.5]


<a name="v1.2.4"></a>
# [v1.2.4](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.2.4) - 08 Jul 2017

Added:
 * `retrieveAllRequest` that retrieves all records by going through all pages automatically.
 * `countAll` can be used to count all records without any limitation. Please check README for some important notes about this function.

[Changes][v1.2.4]


<a name="v1.2.3"></a>
# [v1.2.3](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.2.3) - 13 May 2017

Fix: Dynamics 365 OAuth authentication in Node.js applicaiton.

[Changes][v1.2.3]


<a name="v1.2.2"></a>
# [v1.2.2](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.2.2) - 12 Apr 2017

Changes:
- Add support for combinational Prefer header values. Use comma separated values for basic requests. For example: `return=representation,odata.include-annotations="*"`.
- Add `select` parameter in `create` and `updateSingleProperty` functions.
- `prefer` parameter in basic functions can also be of `Array` type. So, the Prefer header value mentioned before can be written like this: `['return=representation', 'odata.include-annotations="*"']`.

[Changes][v1.2.2]


<a name="v1.2.1"></a>
# [v1.2.1](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.2.1) - 09 Apr 2017

- Fix issues with URI encoding.

Added:

- Prefer header can be set in the config and will be added by default to each request. This default value can be overridden by setting corresponding request parameters directly in the request.

[Changes][v1.2.1]


<a name="v1.2.0"></a>
# [v1.2.0](https://github.com/AleksandrRogov/DynamicsWebApi/releases/tag/v1.2.0) - 08 Apr 2017

- Added integration with Dynamics 365 using OAuth token.

[Changes][v1.2.0]


[v2.2.0]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v2.1.7...v2.2.0
[v2.1.7]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v.2.1.6...v2.1.7
[v.2.1.6]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v2.1.5...v.2.1.6
[v2.1.5]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v2.1.4...v2.1.5
[v2.1.4]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v2.1.3...v2.1.4
[v2.1.3]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.7.12...v2.1.3
[v1.7.12]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v2.1.2...v1.7.12
[v2.1.2]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v2.1.1...v2.1.2
[v2.1.1]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v2.1.0...v2.1.1
[v2.1.0]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v2.0.1...v2.1.0
[v2.0.1]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v2.0.0...v2.0.1
[v2.0.0]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v2.0.0-beta.4...v2.0.0
[v2.0.0-beta.4]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v2.0.0-beta.3...v2.0.0-beta.4
[v2.0.0-beta.3]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.7.11...v2.0.0-beta.3
[v1.7.11]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.7.10...v1.7.11
[v1.7.10]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v2.0.0-beta.1...v1.7.10
[v2.0.0-beta.1]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v2.0.0-beta.0...v2.0.0-beta.1
[v2.0.0-beta.0]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.7.9...v2.0.0-beta.0
[v1.7.9]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.7.8...v1.7.9
[v1.7.8]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.7.7...v1.7.8
[v1.7.7]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.7.6...v1.7.7
[v1.7.6]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.7.5...v1.7.6
[v1.7.5]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.7.4...v1.7.5
[v1.7.4]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.7.3...v1.7.4
[v1.7.3]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.7.2...v1.7.3
[v1.7.2]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.7.1...v1.7.2
[v1.7.1]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.7.0...v1.7.1
[v1.7.0]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.15...v1.7.0
[v1.6.15]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.14...v1.6.15
[v1.6.14]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.13...v1.6.14
[v1.6.13]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.12...v1.6.13
[v1.6.12]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.11...v1.6.12
[v1.6.11]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.10...v1.6.11
[v1.6.10]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.9...v1.6.10
[v1.6.9]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.8...v1.6.9
[v1.6.8]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.7...v1.6.8
[v1.6.7]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.6...v1.6.7
[v1.6.6]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.5...v1.6.6
[v1.6.5]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.4...v1.6.5
[v1.6.4]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.3...v1.6.4
[v1.6.3]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.2...v1.6.3
[v1.6.2]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.1...v1.6.2
[v1.6.1]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.6.0...v1.6.1
[v1.6.0]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.14...v1.6.0
[v1.5.14]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.13...v1.5.14
[v1.5.13]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.12...v1.5.13
[v1.5.12]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.11...v1.5.12
[v1.5.11]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.10...v1.5.11
[v1.5.10]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.9...v1.5.10
[v1.5.9]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.7...v1.5.9
[v1.5.7]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.6...v1.5.7
[v1.5.6]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.5...v1.5.6
[v1.5.5]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.4...v1.5.5
[v1.5.4]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.3...v1.5.4
[v1.5.3]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.2...v1.5.3
[v1.5.2]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.1...v1.5.2
[v1.5.1]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.5.0...v1.5.1
[v1.5.0]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.4.7...v1.5.0
[v1.4.7]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.4.6...v1.4.7
[v1.4.6]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.4.5...v1.4.6
[v1.4.5]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.4.4...v1.4.5
[v1.4.4]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.4.3...v1.4.4
[v1.4.3]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.4.2...v1.4.3
[v1.4.2]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.4.1...v1.4.2
[v1.4.1]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.4.0...v1.4.1
[v1.4.0]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.3.4...v1.4.0
[v1.3.4]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.3.3...v1.3.4
[v1.3.3]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.3.2...v1.3.3
[v1.3.2]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.3.1...v1.3.2
[v1.3.1]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.3.0...v1.3.1
[v1.3.0]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.2.9...v1.3.0
[v1.2.9]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.2.8...v1.2.9
[v1.2.8]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.2.7...v1.2.8
[v1.2.7]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.2.6...v1.2.7
[v1.2.6]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.2.5...v1.2.6
[v1.2.5]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.2.4...v1.2.5
[v1.2.4]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.2.3...v1.2.4
[v1.2.3]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.2.2...v1.2.3
[v1.2.2]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.2.1...v1.2.2
[v1.2.1]: https://github.com/AleksandrRogov/DynamicsWebApi/compare/v1.2.0...v1.2.1
[v1.2.0]: https://github.com/AleksandrRogov/DynamicsWebApi/tree/v1.2.0

<!-- Generated by https://github.com/rhysd/changelog-from-release v3.7.2 -->
