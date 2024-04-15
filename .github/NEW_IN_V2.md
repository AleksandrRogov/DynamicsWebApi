# What's New in Version 2

DynamicsWebApi v2 has been fully rewritten in TypeScript. The process of rewriting the code made it possible to refactor and improve many modules of the library and organize them in a more logical way as well as to remove redundant features that were no longer needed. As a result, DynamicsWebApi now has many new features such as:

### Microsoft Dataverse Search API
v2 brings the power of Search, Suggest and Autocomplete capabilities of Microsoft Dataverse Search API.

### `AbortController` and `AbortSignal` support (for Node.js 15+ and Browser)
Each request can now be aborted when it's no longer need to be completed via the `AbortController`.

### All requests support Impersonation, NoCache and other common properties
v1 did not have full support of mentioned properties in some requests. v2 fixes that by making all request parameters implement a single `BaseRequest` interface.

### On demand Changesets in Batch Operations
Control what requests should be included or excluded from the changesets by setting `inChangeSet` parameter to `false` (it's `true` when no set). By default, all requests (except for GET) are included in a changeset. Thus, it does not break the core logic introduced in v1.

### CSDL $metadata document
Retrieve the org's CSDL $metadata document with a single call of `retrieveCsdlMetadata` function. The library returns the raw text and does not parse or process it in any way.

### `v2.1+` Microsoft Power Pages Support
DynamicsWebApi now can be used in Micorosoft Power Pages website.

### NPM Package contents
NPM package now includes a pre-bundled code of DynamicsWebApi to simplify a compilation process of the projects that depend on it. There are 4 separate bundles: 
- `dist/dynamics-web-api.js` - a Browser ready version (to use as a Dynamics 365 web resource) + it's minified version `.min.js` [IIFE].
- `dist/cjs/dynamics-web-api.js` - a Node.js module [CommonJS].
- `dist/esm/dynamics-web-api.mjs` - a Node.js module [ESM].
- `dist/browser/esm/dynamics-web-api.js` - an ES module for the Browser (to use as a Dynamics 365 web resource).

Type definition for the library also moved into the `dist` folder.

Please let me know (create an issue) if we need to add a `cjs` bundle for the Browser as well. I did not have any case where I had to use cjs specifically for the browser but it's just me :blush: and you may have a different case.

### Other changes
Not all changes are visible outside, some changes and fixes I've done were in the core of the library itself. Here are some of them:
- All request objects passed as function parameters are fully cloned and remain untouched. Which means, whatever has been passed into the functions is not getting modified in any way. This was not always true in v1 (and I admit that it was my mistake). It is a positive change because _input parameters should never be changed inside the functions_ (there are exceptions but not in this case).
- All deprecated JavaScript functions used by the library have been replaced with their modern alternatives.
- The library code is now written with a `use strict;` directive! :) With additional strict rules set in `tsconfig.json`.
- The core has been _promisified_, except for `xhr` and `http` modules. This makes the overall code cleaner and easier to follow.
- Rewriting to TypeScript gave me a chance to go through the code line by line and identify suboptimal functions/features which were successfully tweaked or removed.

...and more.

### Migration

If you are currently using v1 and planning on migrating to v2 please consult with a list of [breaking changes](/.github/BREAKING_CHANGES_V2.md).