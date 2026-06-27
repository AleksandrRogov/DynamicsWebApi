# Breaking Changes in v3 (v2.5 -> v3)

### 1. `DynamicsWebApi.search()` method removed

The deprecated `search` method alias was fully removed. Use `query()` instead.

**Before**
```ts
const results = await dynamicsWebApi.search("test term");
```

**Now**
```ts
const results = await dynamicsWebApi.query({ search: "test term" });
```

### 2. `fieldName` request property removed from all interfaces

The `fieldName` property was deprecated across multiple request interfaces and has been fully removed. Use `property` instead.

**Affected interfaces:** `DeleteRequest`, `UploadRequest`, `DownloadRequest`, `InternalRequest`

**Before**
```ts
// Delete with fieldName
await dynamicsWebApi.deleteRecord({
    collection: "accounts",
    key: accountId,
    fieldName: "accountid"
});

// Upload with fieldName
await dynamicsWebApi.uploadFile({
    collection: "accounts",
    key: accountId,
    fieldName: "documentbody",
    data: fileBuffer,
    fileName: "file.txt"
});
```

**Now**
```ts
// Delete with property
await dynamicsWebApi.deleteRecord({
    collection: "accounts",
    key: accountId,
    property: "accountid"
});

// Upload with property
await dynamicsWebApi.uploadFile({
    collection: "accounts",
    key: accountId,
    property: "documentbody",
    data: fileBuffer,
    fileName: "file.txt"
});
```

### 3. `functionName` request property removed from `UnboundFunctionRequest`

The `functionName` property on unbound function requests was deprecated and removed. Use `name` instead.

**Before**
```ts
await dynamicsWebApi.callFunction({
    functionName: "orgUnit.GetUsers",
    parameters: { orgUnitId: "xxx" },
    select: ["fullname"]
});
```

**Now**
```ts
await dynamicsWebApi.callFunction({
    name: "orgUnit.GetUsers",
    parameters: { orgUnitId: "xxx" },
    select: ["fullname"]
});
```

### 4. Search API deprecated type aliases removed

The deprecated type aliases for the Dataverse Search API were removed. Use the new type names instead.

| Old Type (removed) | New Type (use instead) |
|---|---|
| `Search` | `Query` |
| `SearchRequest` | `QueryRequest` |
| `SearchResponse<TValue>` | `QueryResponse` |
| `SearchFunction` | `QueryFunction` |

**Before**
```ts
// These types no longer exist
type MySearch = Search;
type MySearchRequest = SearchRequest;
type MySearchResponse = SearchResponse<MyResult>;
```

**Now**
```ts
type MyQuery = Query;
type MyQueryRequest = QueryRequest;
type MyQueryResponse = QueryResponse;
```

### 5. Internal `fieldName` fallback logic removed

The backward-compatible logic that automatically copied `fieldName` to `property` in the URL composer and `uploadFile` has been removed. Requests that rely on this implicit fallback will fail.

**Before** — passing only `fieldName` without `property` would silently use `fieldName` as the property name:
```ts
// This used to work (fieldName was copied to property internally)
await dynamicsWebApi.composeUrl({ fieldName: "documentbody" }, null);
```

**Now** — `property` must be set explicitly:
```ts
// property must be provided
await dynamicsWebApi.composeUrl({ property: "documentbody" }, null);
```

### 6. Search API response structure simplified

`SearchResponse` interface was removed and `QueryResponse` now extends directly from the result structure without the intermediate wrapper. The `QueryResponse` interface has been restructured for consistency.

**Before** — `SearchResponse` was a separate interface from `QueryResponse`:
```ts
const response: SearchResponse<MyType> = await dynamicsWebApi.search("term");
// response.value, response.facets, etc.
```

**Now** — use `QueryResponse` directly:
```ts
const response: QueryResponse = await dynamicsWebApi.query({ search: "term" });
// response.value, response.facets, etc.
```
