/*! dynamics-web-api v2.3.0-beta (c) 2025 Aleksandr Rogov. License: MIT */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);

// src/helpers/crypto/node.ts
var node_exports = {};
__export(node_exports, {
  getCrypto: () => getCrypto
});
import nCrypto from "node:crypto";
function getCrypto() {
  return nCrypto;
}
var init_node = __esm({
  "src/helpers/crypto/node.ts"() {
    "use strict";
  }
});

// src/helpers/Crypto.ts
function getCrypto2() {
  return false ? global.window.crypto : (init_node(), __toCommonJS(node_exports)).getCrypto();
}
var init_Crypto = __esm({
  "src/helpers/Crypto.ts"() {
    "use strict";
  }
});

// src/helpers/Regex.ts
function isUuid(value) {
  const match = UUID_REGEX.exec(value);
  return !!match;
}
function extractUuid(value) {
  const match = EXTRACT_UUID_REGEX.exec(value);
  return match ? match[1] : null;
}
function extractUuidFromUrl(url) {
  if (!url) return null;
  const match = EXTRACT_UUID_FROM_URL_REGEX.exec(url);
  return match ? match[1] : null;
}
function removeCurlyBracketsFromUuid(value) {
  return value.replace(REMOVE_BRACKETS_FROM_UUID_REGEX, (_match, p1) => p1);
}
function safelyRemoveCurlyBracketsFromUrl(url) {
  const parts = url.split(QUOTATION_MARK_REGEX);
  return parts.map((part, index) => {
    if (index % 2 === 0) {
      return removeCurlyBracketsFromUuid(part);
    }
    return part;
  }).join("");
}
function convertToReferenceObject(responseData) {
  const result = ENTITY_UUID_REGEX.exec(responseData["@odata.id"]);
  return { id: result[2], collection: result[1], oDataContext: responseData["@odata.context"] };
}
function parsePagingCookie(pagingCookie) {
  const info = PAGING_COOKIE_REGEX.exec(pagingCookie);
  if (!info) return null;
  const page = parseInt(info[2], 10);
  const sanitizedCookie = sanitizeCookie(info[1]);
  return { page, sanitizedCookie };
}
function sanitizeCookie(cookie) {
  const characterMap = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
    // Use numeric reference for single quote to avoid confusion
  };
  return cookie.replace(SPECIAL_CHARACTER_REGEX, (char) => characterMap[char]);
}
function removeLeadingSlash(value) {
  return value.replace(LEADING_SLASH_REGEX, "");
}
function escapeUnicodeSymbols(value) {
  return value.replace(UNICODE_SYMBOLS_REGEX, (chr) => `\\u${("0000" + chr.charCodeAt(0).toString(16)).slice(-4)}`);
}
function removeDoubleQuotes(value) {
  return value.replace(DOUBLE_QUOTE_REGEX, "");
}
function getUpdateMethod(collection) {
  return SPECIAL_COLLECTION_FOR_UPDATE_REGEX.test(collection ?? "") ? "PUT" : "PATCH";
}
var UUID, UUID_REGEX, EXTRACT_UUID_REGEX, EXTRACT_UUID_FROM_URL_REGEX, REMOVE_BRACKETS_FROM_UUID_REGEX, ENTITY_UUID_REGEX, QUOTATION_MARK_REGEX, PAGING_COOKIE_REGEX, SPECIAL_CHARACTER_REGEX, LEADING_SLASH_REGEX, UNICODE_SYMBOLS_REGEX, DOUBLE_QUOTE_REGEX, BATCH_RESPONSE_HEADERS_REGEX, HTTP_STATUS_REGEX, CONTENT_TYPE_PLAIN_REGEX, ODATA_ENTITYID_REGEX, TEXT_REGEX, LINE_ENDING_REGEX, SEARCH_FOR_ENTITY_NAME_REGEX, SPECIAL_COLLECTION_FOR_UPDATE_REGEX, FETCH_XML_TOP_REGEX, FETCH_XML_PAGE_REGEX, FETCH_XML_REPLACE_REGEX, DATE_FORMAT_REGEX;
var init_Regex = __esm({
  "src/helpers/Regex.ts"() {
    "use strict";
    UUID = "[0-9a-fA-F]{8}[-]?([0-9a-fA-F]{4}[-]?){3}[0-9a-fA-F]{12}";
    UUID_REGEX = new RegExp(UUID, "i");
    EXTRACT_UUID_REGEX = new RegExp("^{?(" + UUID + ")}?$", "i");
    EXTRACT_UUID_FROM_URL_REGEX = new RegExp("(" + UUID + ")\\)$", "i");
    REMOVE_BRACKETS_FROM_UUID_REGEX = new RegExp(`{(${UUID})}`, "g");
    ENTITY_UUID_REGEX = new RegExp(`\\/(\\w+)\\((${UUID})`, "i");
    QUOTATION_MARK_REGEX = /(["'].*?["'])/;
    PAGING_COOKIE_REGEX = /pagingcookie="(<cookie page="(\d+)".+<\/cookie>)/;
    SPECIAL_CHARACTER_REGEX = /[<>"']/g;
    LEADING_SLASH_REGEX = /^\//;
    UNICODE_SYMBOLS_REGEX = /[\u007F-\uFFFF]/g;
    DOUBLE_QUOTE_REGEX = /"/g;
    BATCH_RESPONSE_HEADERS_REGEX = /^([^()<>@,;:\\"\/[\]?={} \t]+)\s?:\s?(.*)/;
    HTTP_STATUS_REGEX = /HTTP\/?\s*[\d.]*\s+(\d{3})\s+([\w\s]*)$/m;
    CONTENT_TYPE_PLAIN_REGEX = /Content-Type: text\/plain/i;
    ODATA_ENTITYID_REGEX = /OData-EntityId.+/i;
    TEXT_REGEX = /\w+$/g;
    LINE_ENDING_REGEX = /\r?\n/;
    SEARCH_FOR_ENTITY_NAME_REGEX = /(\w+)(\([\d\w-]+\))$/;
    SPECIAL_COLLECTION_FOR_UPDATE_REGEX = /EntityDefinitions|RelationshipDefinitions|GlobalOptionSetDefinitions/;
    FETCH_XML_TOP_REGEX = /^<fetch.+top=/;
    FETCH_XML_PAGE_REGEX = /^<fetch.+page=/;
    FETCH_XML_REPLACE_REGEX = /^(<fetch)/;
    DATE_FORMAT_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:Z|[-+]\d{2}:\d{2})$/;
  }
});

// src/utils/Utility.ts
function formatParameterValue(value) {
  if (value == null) return "";
  if (typeof value === "string" && !value.startsWith("Microsoft.Dynamics.CRM") && !isUuid(value)) {
    return `'${value}'`;
  } else if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return value.toString();
}
function processParameters(parameters) {
  const parameterNames = Object.keys(parameters);
  const functionParams = [];
  const urlQuery = [];
  parameterNames.forEach((parameterName, index) => {
    let value = parameters[parameterName];
    if (value == null) return;
    value = formatParameterValue(value);
    const paramIndex = index + 1;
    functionParams.push(`${parameterName}=@p${paramIndex}`);
    urlQuery.push(`@p${paramIndex}=${extractUuid(value) || value}`);
  });
  return {
    key: `(${functionParams.join(",")})`,
    queryParams: urlQuery
  };
}
function hasHeader(headers, name) {
  return headers.hasOwnProperty(name) || headers.hasOwnProperty(name.toLowerCase());
}
function getHeader(headers, name) {
  if (headers[name]) return headers[name];
  return headers[name.toLowerCase()];
}
function buildFunctionParameters(parameters) {
  return parameters ? processParameters(parameters) : { key: "()" };
}
function getFetchXmlPagingCookie(pageCookies = "", currentPageNumber = 1) {
  pageCookies = decodeURIComponent(decodeURIComponent(pageCookies));
  const result = parsePagingCookie(pageCookies);
  return {
    cookie: (result == null ? void 0 : result.sanitizedCookie) || "",
    page: (result == null ? void 0 : result.page) || currentPageNumber,
    nextPage: (result == null ? void 0 : result.page) ? result.page + 1 : currentPageNumber + 1
  };
}
function isNull(value) {
  return typeof value === "undefined" || value == null;
}
function generateUUID() {
  return getCrypto2().randomUUID();
}
function getXrmContext() {
  if (typeof GetGlobalContext !== "undefined") {
    return GetGlobalContext();
  } else {
    if (typeof Xrm !== "undefined") {
      if (!isNull(Xrm.Utility) && !isNull(Xrm.Utility.getGlobalContext)) {
        return Xrm.Utility.getGlobalContext();
      } else if (!isNull(Xrm.Page) && !isNull(Xrm.Page.context)) {
        return Xrm.Page.context;
      }
    }
  }
  throw new Error(
    "Xrm Context is not available. In most cases, it can be resolved by adding a reference to a ClientGlobalContext.js.aspx. Please refer to MSDN documentation for more details."
  );
}
function getClientUrl() {
  const context = getXrmContext();
  let clientUrl = context.getClientUrl();
  if (clientUrl.match(/\/$/)) {
    clientUrl = clientUrl.substring(0, clientUrl.length - 1);
  }
  return clientUrl;
}
function isRunningWithinPortals() {
  return false ? !!global.window.shell : false;
}
function isObject(obj) {
  return typeof obj === "object" && !!obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== "[object Date]";
}
function copyObject(src, excludeProps) {
  let target = {};
  for (let prop in src) {
    if (src.hasOwnProperty(prop) && !(excludeProps == null ? void 0 : excludeProps.includes(prop))) {
      if (isObject(src[prop])) {
        target[prop] = copyObject(src[prop]);
      } else if (Array.isArray(src[prop])) {
        target[prop] = src[prop].slice();
      } else {
        target[prop] = src[prop];
      }
    }
  }
  return target;
}
function copyRequest(src, excludeProps = []) {
  if (!excludeProps.includes("signal")) excludeProps.push("signal");
  const result = copyObject(src, excludeProps);
  result.signal = src.signal;
  return result;
}
function setFileChunk(request, fileBuffer, chunkSize, offset) {
  offset = offset || 0;
  const count2 = offset + chunkSize > fileBuffer.length ? fileBuffer.length % chunkSize : chunkSize;
  let content;
  if (false) {
    content = new Uint8Array(count2);
    for (let i = 0; i < count2; i++) {
      content[i] = fileBuffer[offset + i];
    }
  } else {
    content = fileBuffer.slice(offset, offset + count2);
  }
  request.data = content;
  request.contentRange = "bytes " + offset + "-" + (offset + count2 - 1) + "/" + fileBuffer.length;
}
function convertToFileBuffer(binaryString) {
  if (true) return Buffer.from(binaryString, "binary");
  const bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
var downloadChunkSize;
var init_Utility = __esm({
  "src/utils/Utility.ts"() {
    "use strict";
    init_Crypto();
    init_Regex();
    downloadChunkSize = 4194304;
  }
});

// src/helpers/ErrorHelper.ts
function throwParameterError(functionName, parameterName, type) {
  throw new Error(
    type ? `${functionName} requires a ${parameterName} parameter to be of type ${type}.` : `${functionName} requires a ${parameterName} parameter.`
  );
}
var ErrorHelper;
var init_ErrorHelper = __esm({
  "src/helpers/ErrorHelper.ts"() {
    "use strict";
    init_Regex();
    ErrorHelper = class _ErrorHelper {
      static handleErrorResponse(req) {
        throw new Error(`Error: ${req.status}: ${req.message}`);
      }
      static parameterCheck(parameter, functionName, parameterName, type) {
        if (typeof parameter === "undefined" || parameter === null || parameter === "") {
          throwParameterError(functionName, parameterName, type);
        }
      }
      static stringParameterCheck(parameter, functionName, parameterName) {
        if (typeof parameter !== "string") {
          throwParameterError(functionName, parameterName, "String");
        }
      }
      static maxLengthStringParameterCheck(parameter, functionName, parameterName, maxLength) {
        if (!parameter) return;
        if (parameter.length > maxLength) {
          throw new Error(`${parameterName} has a ${maxLength} character limit.`);
        }
      }
      static arrayParameterCheck(parameter, functionName, parameterName) {
        if (parameter.constructor !== Array) {
          throwParameterError(functionName, parameterName, "Array");
        }
      }
      static stringOrArrayParameterCheck(parameter, functionName, parameterName) {
        if (parameter.constructor !== Array && typeof parameter !== "string") {
          throwParameterError(functionName, parameterName, "String or Array");
        }
      }
      static numberParameterCheck(parameter, functionName, parameterName) {
        if (typeof parameter != "number") {
          if (typeof parameter === "string" && parameter) {
            if (!isNaN(parseInt(parameter))) {
              return;
            }
          }
          throwParameterError(functionName, parameterName, "Number");
        }
      }
      static batchIsEmpty() {
        return [
          new Error(
            "Payload of the batch operation is empty. Please make that you have other operations in between startBatch() and executeBatch() to successfuly build a batch payload."
          )
        ];
      }
      static handleHttpError(parsedError, parameters) {
        const error = new Error();
        Object.keys(parsedError).forEach((k) => {
          error[k] = parsedError[k];
        });
        if (parameters) {
          Object.keys(parameters).forEach((k) => {
            error[k] = parameters[k];
          });
        }
        return error;
      }
      static boolParameterCheck(parameter, functionName, parameterName) {
        if (typeof parameter != "boolean") {
          throwParameterError(functionName, parameterName, "Boolean");
        }
      }
      /**
       * Private function used to check whether required parameter is a valid GUID
       * @param parameter The GUID parameter to check
       * @param functionName
       * @param parameterName
       * @returns
       */
      static guidParameterCheck(parameter, functionName, parameterName) {
        const match = extractUuid(parameter);
        if (!match) throwParameterError(functionName, parameterName, "GUID String");
        return match;
      }
      static keyParameterCheck(parameter, functionName, parameterName) {
        try {
          _ErrorHelper.stringParameterCheck(parameter, functionName, parameterName);
          const match = extractUuid(parameter);
          if (match) return match;
          const alternateKeys = parameter.split(",");
          if (alternateKeys.length) {
            for (let i = 0; i < alternateKeys.length; i++) {
              alternateKeys[i] = alternateKeys[i].trim().replace(/"/g, "'");
              /^[\w\d\_]+\=(.+)$/i.exec(alternateKeys[i])[0];
            }
          }
          return alternateKeys.join(",");
        } catch (error) {
          throwParameterError(functionName, parameterName, "String representing GUID or Alternate Key");
        }
      }
      static callbackParameterCheck(callbackParameter, functionName, parameterName) {
        if (typeof callbackParameter != "function") {
          throwParameterError(functionName, parameterName, "Function");
        }
      }
      static throwBatchIncompatible(functionName, isBatch) {
        if (isBatch) {
          isBatch = false;
          throw new Error(functionName + " cannot be used in a BATCH request.");
        }
      }
      static throwBatchNotStarted(isBatch) {
        if (!isBatch) {
          throw new Error(
            "Batch operation has not been started. Please call a DynamicsWebApi.startBatch() function prior to calling DynamicsWebApi.executeBatch() to perform a batch request correctly."
          );
        }
      }
    };
  }
});

// src/dwa.ts
var _a, _b, _DWA, DWA;
var init_dwa = __esm({
  "src/dwa.ts"() {
    "use strict";
    _DWA = class _DWA {
    };
    _DWA.Prefer = (_b = class {
      static get(annotation) {
        return `${_DWA.Prefer.IncludeAnnotations}="${annotation}"`;
      }
    }, _b.ReturnRepresentation = "return=representation", _b.Annotations = (_a = class {
    }, _a.AssociatedNavigationProperty = "Microsoft.Dynamics.CRM.associatednavigationproperty", _a.LookupLogicalName = "Microsoft.Dynamics.CRM.lookuplogicalname", _a.All = "*", _a.FormattedValue = "OData.Community.Display.V1.FormattedValue", _a.FetchXmlPagingCookie = "Microsoft.Dynamics.CRM.fetchxmlpagingcookie", _a), _b.IncludeAnnotations = "odata.include-annotations", _b);
    DWA = _DWA;
  }
});

// src/client/helpers/dateReviver.ts
function dateReviver(key, value) {
  if (typeof value === "string") {
    const a = DATE_FORMAT_REGEX.exec(value);
    if (a) {
      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
    }
  }
  return value;
}
var init_dateReviver = __esm({
  "src/client/helpers/dateReviver.ts"() {
    "use strict";
    init_Regex();
  }
});

// src/client/helpers/parseBatchResponse.ts
function parseBatchHeaders(text) {
  const ctx = { position: 0 };
  const headers = {};
  let parts;
  let line;
  let pos;
  do {
    pos = ctx.position;
    line = readLine(text, ctx);
    if (!line) break;
    parts = BATCH_RESPONSE_HEADERS_REGEX.exec(line);
    if (parts !== null) {
      headers[parts[1].toLowerCase()] = parts[2];
    } else {
      ctx.position = pos;
    }
  } while (line && parts);
  return headers;
}
function readLine(text, ctx) {
  return readTo(text, ctx, LINE_ENDING_REGEX);
}
function readTo(text, ctx, searchRegTerm) {
  const start = ctx.position || 0;
  const slicedText = text.slice(start);
  const match = searchRegTerm.exec(slicedText);
  if (!match) {
    return null;
  }
  const end = start + match.index;
  ctx.position = end + match[0].length;
  return text.substring(start, end);
}
function getHttpStatus(response) {
  const parts = HTTP_STATUS_REGEX.exec(response);
  return { httpStatusString: parts[0], httpStatus: parseInt(parts[1]), httpStatusMessage: parts[2].trim() };
}
function getPlainContent(response) {
  HTTP_STATUS_REGEX.lastIndex = 0;
  const textReg = TEXT_REGEX.exec(response.trim());
  return (textReg == null ? void 0 : textReg.length) ? textReg[0] : void 0;
}
function handlePlainContent(batchResponse, parseParams, requestNumber) {
  const plainContent = getPlainContent(batchResponse);
  return handlePlainResponse(plainContent);
}
function handleEmptyContent(batchResponse, parseParams, requestNumber) {
  var _a2;
  if (((_a2 = parseParams == null ? void 0 : parseParams[requestNumber]) == null ? void 0 : _a2.valueIfEmpty) !== void 0) {
    return parseParams[requestNumber].valueIfEmpty;
  } else {
    const entityUrl = ODATA_ENTITYID_REGEX.exec(batchResponse);
    return extractUuidFromUrl(entityUrl == null ? void 0 : entityUrl[0]) ?? void 0;
  }
}
function processBatchPart(batchResponse, parseParams, requestNumber) {
  const { httpStatusString, httpStatus, httpStatusMessage } = getHttpStatus(batchResponse);
  const responseData = batchResponse.substring(batchResponse.indexOf("{"), batchResponse.lastIndexOf("}") + 1);
  if (!responseData) {
    if (CONTENT_TYPE_PLAIN_REGEX.test(batchResponse)) {
      return handlePlainContent(batchResponse, parseParams, requestNumber);
    }
    return handleEmptyContent(batchResponse, parseParams, requestNumber);
  }
  const parsedResponse = handleJsonResponse(responseData, parseParams, requestNumber);
  if (httpStatus < 400) {
    return parsedResponse;
  }
  const responseHeaders = parseBatchHeaders(
    batchResponse.substring(batchResponse.indexOf(httpStatusString) + httpStatusString.length + 1, batchResponse.indexOf("{"))
  );
  return ErrorHelper.handleHttpError(parsedResponse, {
    status: httpStatus,
    statusText: httpStatusMessage,
    statusMessage: httpStatusMessage,
    headers: responseHeaders
  });
}
function parseBatchResponse(response, parseParams, requestNumber = 0) {
  const delimiter = response.substring(0, response.search(LINE_ENDING_REGEX));
  const batchResponseParts = response.split(delimiter);
  batchResponseParts.shift();
  batchResponseParts.pop();
  let result = [];
  for (let part of batchResponseParts) {
    if (part.indexOf("--changesetresponse_") === -1) {
      result.push(processBatchPart(part, parseParams, requestNumber++));
      continue;
    }
    part = part.trim();
    const batchToProcess = part.substring(part.search(LINE_ENDING_REGEX) + 1).trim();
    result = result.concat(parseBatchResponse(batchToProcess, parseParams, requestNumber++));
  }
  return result;
}
var init_parseBatchResponse = __esm({
  "src/client/helpers/parseBatchResponse.ts"() {
    "use strict";
    init_ErrorHelper();
    init_Regex();
    init_parseResponse();
  }
});

// src/client/helpers/parseResponse.ts
function getFormattedKeyValue(keyName, value) {
  let newKey = null;
  if (keyName.indexOf("@") !== -1) {
    const format = keyName.split("@");
    switch (format[1]) {
      case "odata.context":
        newKey = "oDataContext";
        break;
      case "odata.count":
        newKey = "oDataCount";
        value = value != null ? parseInt(value) : 0;
        break;
      case "odata.nextLink":
        newKey = "oDataNextLink";
        break;
      case "odata.deltaLink":
        newKey = "oDataDeltaLink";
        break;
      case DWA.Prefer.Annotations.FormattedValue:
        newKey = format[0] + "_Formatted";
        break;
      case DWA.Prefer.Annotations.AssociatedNavigationProperty:
        newKey = format[0] + "_NavigationProperty";
        break;
      case DWA.Prefer.Annotations.LookupLogicalName:
        newKey = format[0] + "_LogicalName";
        break;
    }
  }
  return [newKey, value];
}
function parseData(object, parseParams) {
  if (parseParams) {
    if (parseParams.isRef && object["@odata.id"] != null) {
      return convertToReferenceObject(object);
    }
    if (parseParams.toCount) {
      return getFormattedKeyValue("@odata.count", object["@odata.count"])[1] || 0;
    }
  }
  for (const currentKey in object) {
    if (object[currentKey] != null) {
      if (Array.isArray(object[currentKey])) {
        for (var j = 0; j < object[currentKey].length; j++) {
          object[currentKey][j] = parseData(object[currentKey][j]);
        }
      } else if (typeof object[currentKey] === "object") {
        parseData(object[currentKey]);
      }
    }
    let formattedKeyValue = getFormattedKeyValue(currentKey, object[currentKey]);
    if (formattedKeyValue[0]) {
      object[formattedKeyValue[0]] = formattedKeyValue[1];
    }
    if (currentKey.indexOf("_x002e_") !== -1) {
      const aliasKeys = currentKey.split("_x002e_");
      if (!object.hasOwnProperty(aliasKeys[0])) {
        object[aliasKeys[0]] = { _dwaType: "alias" };
      } else if (typeof object[aliasKeys[0]] !== "object" || typeof object[aliasKeys[0]] === "object" && !object[aliasKeys[0]].hasOwnProperty("_dwaType")) {
        throw new Error("The alias name of the linked entity must be unique!");
      }
      object[aliasKeys[0]][aliasKeys[1]] = object[currentKey];
      formattedKeyValue = getFormattedKeyValue(aliasKeys[1], object[currentKey]);
      if (formattedKeyValue[0]) {
        object[aliasKeys[0]][formattedKeyValue[0]] = formattedKeyValue[1];
      }
    }
  }
  if (parseParams) {
    if (parseParams.hasOwnProperty("pageNumber") && object["@" + DWA.Prefer.Annotations.FetchXmlPagingCookie] != null) {
      object.PagingInfo = getFetchXmlPagingCookie(object["@" + DWA.Prefer.Annotations.FetchXmlPagingCookie], parseParams.pageNumber);
    }
  }
  return object;
}
function base64ToString(base64) {
  return false ? global.window.atob(base64) : Buffer.from(base64, "base64").toString("binary");
}
function parseFileResponse(response, responseHeaders, parseParams) {
  let data = response;
  if (parseParams == null ? void 0 : parseParams.hasOwnProperty("parse")) {
    data = JSON.parse(data).value;
    data = base64ToString(data);
  }
  const parseResult = {
    value: data
  };
  if (responseHeaders["x-ms-file-name"]) parseResult.fileName = responseHeaders["x-ms-file-name"];
  if (responseHeaders["x-ms-file-size"]) parseResult.fileSize = parseInt(responseHeaders["x-ms-file-size"]);
  const location = getHeader(responseHeaders, "Location");
  if (location) parseResult.location = location;
  return parseResult;
}
function isBatchResponse(response) {
  return response.indexOf("--batchresponse_") > -1;
}
function isFileResponse(responseHeaders) {
  return hasHeader(responseHeaders, "Content-Disposition");
}
function isJsonResponse(responseHeaders) {
  const contentType = getHeader(responseHeaders, "Content-Type");
  return (contentType == null ? void 0 : contentType.startsWith("application/json")) == true;
}
function handleBatchResponse(response, parseParams) {
  const batch = parseBatchResponse(response, parseParams);
  return (parseParams == null ? void 0 : parseParams[0].convertedToBatch) ? batch[0] : batch;
}
function handleFileResponse(response, responseHeaders, parseParams) {
  return parseFileResponse(response, responseHeaders, parseParams[0]);
}
function handleJsonResponse(response, parseParams, requestNumber = 0) {
  return parseData(JSON.parse(response, dateReviver), parseParams[requestNumber]);
}
function handlePlainResponse(response) {
  const numberResponse = Number(response);
  return isFinite(numberResponse) ? numberResponse : response;
}
function handleEmptyResponse(responseHeaders, parseParams) {
  var _a2;
  if (((_a2 = parseParams == null ? void 0 : parseParams[0]) == null ? void 0 : _a2.valueIfEmpty) !== void 0) {
    return parseParams[0].valueIfEmpty;
  }
  const entityUrl = getHeader(responseHeaders, "OData-EntityId");
  if (entityUrl) {
    return extractUuidFromUrl(entityUrl) ?? void 0;
  }
  const location = getHeader(responseHeaders, "Location");
  if (location) {
    const result = { location };
    if (responseHeaders["x-ms-chunk-size"]) {
      result.chunkSize = parseInt(responseHeaders["x-ms-chunk-size"]);
    }
    return result;
  }
}
function parseResponse(response, responseHeaders, parseParams) {
  if (!response.length) {
    return handleEmptyResponse(responseHeaders, parseParams);
  }
  if (isBatchResponse(response)) {
    return handleBatchResponse(response, parseParams);
  }
  if (isFileResponse(responseHeaders)) {
    return handleFileResponse(response, responseHeaders, parseParams);
  }
  if (isJsonResponse(responseHeaders)) {
    return handleJsonResponse(response, parseParams);
  }
  return handlePlainResponse(response);
}
var init_parseResponse = __esm({
  "src/client/helpers/parseResponse.ts"() {
    "use strict";
    init_dwa();
    init_Utility();
    init_dateReviver();
    init_Regex();
    init_parseBatchResponse();
  }
});

// src/client/http.ts
var http_exports = {};
__export(http_exports, {
  executeRequest: () => executeRequest
});
import * as http from "http";
import * as https from "https";
import HttpProxyAgent from "http-proxy-agent";
import HttpsProxyAgent from "https-proxy-agent";
function executeRequest(options) {
  return new Promise((resolve, reject) => {
    _executeRequest(options, resolve, reject);
  });
}
function _executeRequest(options, successCallback, errorCallback) {
  var _a2;
  const data = options.data;
  const headers = options.headers;
  const responseParams = options.responseParams;
  const signal = options.abortSignal;
  const httpHeaders = {};
  if (data) {
    httpHeaders["Content-Type"] = headers["Content-Type"];
    httpHeaders["Content-Length"] = data.length;
    delete headers["Content-Type"];
  }
  for (let key in headers) {
    httpHeaders[key] = headers[key];
  }
  const parsedUrl = new URL(options.uri);
  const protocol = ((_a2 = parsedUrl.protocol) == null ? void 0 : _a2.slice(0, -1)) || "https";
  const protocolInterface = protocol === "http" ? http : https;
  const internalOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname + parsedUrl.search,
    method: options.method,
    timeout: options.timeout || 0,
    headers: httpHeaders,
    signal
  };
  if (!options.proxy && process.env[`${protocol}_proxy`]) {
    options.proxy = {
      url: process.env[`${protocol}_proxy`]
    };
  }
  internalOptions.agent = getAgent(options, protocol);
  if (options.proxy) {
    const hostHeader = new URL(options.proxy.url).host;
    if (hostHeader) httpHeaders.host = hostHeader;
  }
  const request = protocolInterface.request(internalOptions, function(res) {
    let rawData = "";
    res.setEncoding("utf8");
    res.on("data", function(chunk) {
      rawData += chunk;
    });
    res.on("end", function() {
      switch (res.statusCode) {
        case 200:
        // Success with content returned in response body.
        case 201:
        // Success with content returned in response body.
        case 204:
        // Success with no content returned in response body.
        case 206:
        //Success with partial content
        case 304: {
          let responseData = parseResponse(rawData, res.headers, responseParams[options.requestId]);
          let response = {
            data: responseData,
            headers: res.headers,
            status: res.statusCode
          };
          successCallback(response);
          break;
        }
        default:
          let crmError;
          try {
            var errorParsed = parseResponse(rawData, res.headers, responseParams[options.requestId]);
            if (Array.isArray(errorParsed)) {
              errorCallback(errorParsed);
              break;
            }
            crmError = errorParsed.hasOwnProperty("error") && errorParsed.error ? errorParsed.error : { message: errorParsed.Message };
          } catch (e) {
            if (rawData.length > 0) {
              crmError = { message: rawData };
            } else {
              crmError = { message: "Unexpected Error" };
            }
          }
          errorCallback(
            ErrorHelper.handleHttpError(crmError, {
              status: res.statusCode,
              statusText: "",
              statusMessage: res.statusMessage,
              headers: res.headers
            })
          );
          break;
      }
    });
  });
  if (internalOptions.timeout) {
    request.setTimeout(internalOptions.timeout, function() {
      request.destroy();
    });
  }
  request.on("error", function(error) {
    errorCallback(error);
  });
  if (data) {
    request.write(data);
  }
  request.end();
}
var agents, getAgent;
var init_http = __esm({
  "src/client/http.ts"() {
    "use strict";
    init_ErrorHelper();
    init_parseResponse();
    agents = {};
    getAgent = (options, protocol) => {
      const isHttp = protocol === "http";
      const proxy = options.proxy;
      const agentName = proxy ? proxy.url : protocol;
      if (!agents[agentName]) {
        if (proxy) {
          const parsedProxyUrl = new URL(proxy.url);
          const proxyAgent = isHttp ? HttpProxyAgent.HttpProxyAgent : HttpsProxyAgent.HttpsProxyAgent;
          const proxyOptions = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port,
            protocol: parsedProxyUrl.protocol
          };
          if (proxy.auth) proxyOptions.auth = proxy.auth.username + ":" + proxy.auth.password;
          else if (parsedProxyUrl.username && parsedProxyUrl.password) proxyOptions.auth = `${parsedProxyUrl.username}:${parsedProxyUrl.password}`;
          agents[agentName] = new proxyAgent(proxyOptions);
        } else {
          const protocolInterface = isHttp ? http : https;
          agents[agentName] = new protocolInterface.Agent({
            keepAlive: true,
            maxSockets: Infinity
          });
        }
      }
      return agents[agentName];
    };
  }
});

// src/dynamics-web-api.ts
init_Utility();
init_ErrorHelper();

// src/client/RequestClient.ts
init_Utility();

// src/utils/Request.ts
init_Utility();
init_ErrorHelper();
init_Regex();
var entityNames = null;
var setEntityNames = (newEntityNames) => {
  entityNames = newEntityNames;
};
var compose = (request, config) => {
  request.path = request.path || "";
  request.functionName = request.functionName || "";
  if (!request.url) {
    if (!request._isUnboundRequest && !request.contentId && !request.collection) {
      ErrorHelper.parameterCheck(request.collection, `DynamicsWebApi.${request.functionName}`, "request.collection");
    }
    if (request.collection != null) {
      ErrorHelper.stringParameterCheck(request.collection, `DynamicsWebApi.${request.functionName}`, "request.collection");
      request.path = request.collection;
      if (request.key) {
        request.key = ErrorHelper.keyParameterCheck(request.key, `DynamicsWebApi.${request.functionName}`, "request.key");
        request.path += `(${request.key})`;
      }
    }
    if (request.contentId) {
      ErrorHelper.stringParameterCheck(request.contentId, `DynamicsWebApi.${request.functionName}`, "request.contentId");
      if (request.contentId.startsWith("$")) {
        request.path = request.path ? `${request.contentId}/${request.path}` : request.contentId;
      }
    }
    if (request.addPath) {
      if (request.path) {
        request.path += "/";
      }
      request.path += request.addPath;
    }
    request.path = composeUrl(request, config, request.path);
    if (request.fetchXml) {
      ErrorHelper.stringParameterCheck(request.fetchXml, `DynamicsWebApi.${request.functionName}`, "request.fetchXml");
      let join = request.path.indexOf("?") === -1 ? "?" : "&";
      request.path += `${join}fetchXml=${encodeURIComponent(request.fetchXml)}`;
    }
  } else {
    ErrorHelper.stringParameterCheck(request.url, `DynamicsWebApi.${request.functionName}`, "request.url");
    request.path = request.url.replace(config.dataApi.url, "");
  }
  if (request.hasOwnProperty("async") && request.async != null) {
    ErrorHelper.boolParameterCheck(request.async, `DynamicsWebApi.${request.functionName}`, "request.async");
  } else {
    request.async = true;
  }
  request.headers = composeHeaders(request, config);
  return request;
};
var composeUrl = (request, config, url = "", joinSymbol = "&") => {
  var _a2, _b2, _c;
  const queryArray = [];
  if (request) {
    if (request.navigationProperty) {
      ErrorHelper.stringParameterCheck(request.navigationProperty, `DynamicsWebApi.${request.functionName}`, "request.navigationProperty");
      url += "/" + request.navigationProperty;
      if (request.navigationPropertyKey) {
        let navigationKey = ErrorHelper.keyParameterCheck(
          request.navigationPropertyKey,
          `DynamicsWebApi.${request.functionName}`,
          "request.navigationPropertyKey"
        );
        url += "(" + navigationKey + ")";
      }
      if (request.navigationProperty === "Attributes") {
        if (request.metadataAttributeType) {
          ErrorHelper.stringParameterCheck(request.metadataAttributeType, `DynamicsWebApi.${request.functionName}`, "request.metadataAttributeType");
          url += "/" + request.metadataAttributeType;
        }
      }
    }
    if ((_a2 = request.select) == null ? void 0 : _a2.length) {
      ErrorHelper.arrayParameterCheck(request.select, `DynamicsWebApi.${request.functionName}`, "request.select");
      if (request.functionName == "retrieve" && request.select.length == 1 && request.select[0].endsWith("/$ref")) {
        url += "/" + request.select[0];
      } else {
        if (request.select[0].startsWith("/") && request.functionName == "retrieve") {
          if (request.navigationProperty == null) {
            url += request.select.shift();
          } else {
            request.select.shift();
          }
        }
        if (request.select.length) {
          queryArray.push("$select=" + request.select.join(","));
        }
      }
    }
    if (request.filter) {
      ErrorHelper.stringParameterCheck(request.filter, `DynamicsWebApi.${request.functionName}`, "request.filter");
      const filterResult = safelyRemoveCurlyBracketsFromUrl(request.filter);
      queryArray.push("$filter=" + encodeURIComponent(filterResult));
    }
    if (request.fieldName) {
      ErrorHelper.stringParameterCheck(request.fieldName, `DynamicsWebApi.${request.functionName}`, "request.fieldName");
      if (!request.property) request.property = request.fieldName;
      delete request.fieldName;
    }
    if (request.property) {
      ErrorHelper.stringParameterCheck(request.property, `DynamicsWebApi.${request.functionName}`, "request.property");
      url += "/" + request.property;
    }
    if (request.savedQuery) {
      queryArray.push("savedQuery=" + ErrorHelper.guidParameterCheck(request.savedQuery, `DynamicsWebApi.${request.functionName}`, "request.savedQuery"));
    }
    if (request.userQuery) {
      queryArray.push("userQuery=" + ErrorHelper.guidParameterCheck(request.userQuery, `DynamicsWebApi.${request.functionName}`, "request.userQuery"));
    }
    if (request.apply) {
      ErrorHelper.stringParameterCheck(request.apply, `DynamicsWebApi.${request.functionName}`, "request.apply");
      queryArray.push("$apply=" + request.apply);
    }
    if (request.count) {
      ErrorHelper.boolParameterCheck(request.count, `DynamicsWebApi.${request.functionName}`, "request.count");
      queryArray.push("$count=" + request.count);
    }
    if (request.top && request.top > 0) {
      ErrorHelper.numberParameterCheck(request.top, `DynamicsWebApi.${request.functionName}`, "request.top");
      queryArray.push("$top=" + request.top);
    }
    if (request.orderBy != null && request.orderBy.length) {
      ErrorHelper.arrayParameterCheck(request.orderBy, `DynamicsWebApi.${request.functionName}`, "request.orderBy");
      queryArray.push("$orderby=" + request.orderBy.join(","));
    }
    if (request.partitionId) {
      ErrorHelper.stringParameterCheck(request.partitionId, `DynamicsWebApi.${request.functionName}`, "request.partitionId");
      queryArray.push("partitionid='" + request.partitionId + "'");
    }
    if (request.downloadSize) {
      ErrorHelper.stringParameterCheck(request.downloadSize, `DynamicsWebApi.${request.functionName}`, "request.downloadSize");
      queryArray.push("size=" + request.downloadSize);
    }
    if ((_b2 = request.queryParams) == null ? void 0 : _b2.length) {
      ErrorHelper.arrayParameterCheck(request.queryParams, `DynamicsWebApi.${request.functionName}`, "request.queryParams");
      queryArray.push(request.queryParams.join("&"));
    }
    if (request.fileName) {
      ErrorHelper.stringParameterCheck(request.fileName, `DynamicsWebApi.${request.functionName}`, "request.fileName");
      queryArray.push("x-ms-file-name=" + request.fileName);
    }
    if (request.data) {
      ErrorHelper.parameterCheck(request.data, `DynamicsWebApi.${request.functionName}`, "request.data");
    }
    if (request.isBatch) {
      ErrorHelper.boolParameterCheck(request.isBatch, `DynamicsWebApi.${request.functionName}`, "request.isBatch");
    }
    if (!isNull(request.inChangeSet)) {
      ErrorHelper.boolParameterCheck(request.inChangeSet, `DynamicsWebApi.${request.functionName}`, "request.inChangeSet");
    }
    if (request.isBatch && isNull(request.inChangeSet)) request.inChangeSet = true;
    if (request.timeout) {
      ErrorHelper.numberParameterCheck(request.timeout, `DynamicsWebApi.${request.functionName}`, "request.timeout");
    }
    if ((_c = request.expand) == null ? void 0 : _c.length) {
      ErrorHelper.stringOrArrayParameterCheck(request.expand, `DynamicsWebApi.${request.functionName}`, "request.expand");
      if (typeof request.expand === "string") {
        queryArray.push("$expand=" + request.expand);
      } else {
        const expandQueryArray = [];
        for (const { property, ...expand } of request.expand) {
          if (!property) continue;
          const expandRequest = {
            functionName: `${request.functionName} $expand`,
            ...expand
          };
          let expandConverted = composeUrl(expandRequest, config, "", ";");
          if (expandConverted) {
            expandConverted = `(${expandConverted.slice(1)})`;
          }
          expandQueryArray.push(property + expandConverted);
        }
        if (expandQueryArray.length) {
          queryArray.push("$expand=" + expandQueryArray.join(","));
        }
      }
    }
  }
  return !queryArray.length ? url : url + "?" + queryArray.join(joinSymbol);
};
var composeHeaders = (request, config) => {
  const headers = { ...config.headers, ...request.userHeaders };
  const prefer = composePreferHeader(request, config);
  if (prefer.length) {
    headers["Prefer"] = prefer;
  }
  if (request.collection === "$metadata") {
    headers["Accept"] = "application/xml";
  }
  if (request.transferMode) {
    headers["x-ms-transfer-mode"] = request.transferMode;
  }
  if (request.ifmatch != null && request.ifnonematch != null) {
    throw new Error(
      `DynamicsWebApi.${request.functionName}. Either one of request.ifmatch or request.ifnonematch parameters should be used in a call, not both.`
    );
  }
  if (request.ifmatch) {
    ErrorHelper.stringParameterCheck(request.ifmatch, `DynamicsWebApi.${request.functionName}`, "request.ifmatch");
    headers["If-Match"] = request.ifmatch;
  }
  if (request.ifnonematch) {
    ErrorHelper.stringParameterCheck(request.ifnonematch, `DynamicsWebApi.${request.functionName}`, "request.ifnonematch");
    headers["If-None-Match"] = request.ifnonematch;
  }
  if (request.impersonate) {
    ErrorHelper.stringParameterCheck(request.impersonate, `DynamicsWebApi.${request.functionName}`, "request.impersonate");
    headers["MSCRMCallerID"] = ErrorHelper.guidParameterCheck(request.impersonate, `DynamicsWebApi.${request.functionName}`, "request.impersonate");
  }
  if (request.impersonateAAD) {
    ErrorHelper.stringParameterCheck(request.impersonateAAD, `DynamicsWebApi.${request.functionName}`, "request.impersonateAAD");
    headers["CallerObjectId"] = ErrorHelper.guidParameterCheck(request.impersonateAAD, `DynamicsWebApi.${request.functionName}`, "request.impersonateAAD");
  }
  if (request.token) {
    ErrorHelper.stringParameterCheck(request.token, `DynamicsWebApi.${request.functionName}`, "request.token");
    headers["Authorization"] = "Bearer " + request.token;
  }
  if (request.duplicateDetection) {
    ErrorHelper.boolParameterCheck(request.duplicateDetection, `DynamicsWebApi.${request.functionName}`, "request.duplicateDetection");
    headers["MSCRM.SuppressDuplicateDetection"] = "false";
  }
  if (request.bypassCustomPluginExecution) {
    ErrorHelper.boolParameterCheck(request.bypassCustomPluginExecution, `DynamicsWebApi.${request.functionName}`, "request.bypassCustomPluginExecution");
    headers["MSCRM.BypassCustomPluginExecution"] = "true";
  }
  if (request.noCache) {
    ErrorHelper.boolParameterCheck(request.noCache, `DynamicsWebApi.${request.functionName}`, "request.noCache");
    headers["Cache-Control"] = "no-cache";
  }
  if (request.mergeLabels) {
    ErrorHelper.boolParameterCheck(request.mergeLabels, `DynamicsWebApi.${request.functionName}`, "request.mergeLabels");
    headers["MSCRM.MergeLabels"] = "true";
  }
  if (request.contentId) {
    ErrorHelper.stringParameterCheck(request.contentId, `DynamicsWebApi.${request.functionName}`, "request.contentId");
    if (!request.contentId.startsWith("$")) {
      headers["Content-ID"] = request.contentId;
    }
  }
  if (request.contentRange) {
    ErrorHelper.stringParameterCheck(request.contentRange, `DynamicsWebApi.${request.functionName}`, "request.contentRange");
    headers["Content-Range"] = request.contentRange;
  }
  if (request.range) {
    ErrorHelper.stringParameterCheck(request.range, `DynamicsWebApi.${request.functionName}`, "request.range");
    headers["Range"] = request.range;
  }
  return headers;
};
var composePreferHeader = (request, config) => {
  let { returnRepresentation, includeAnnotations, maxPageSize, trackChanges, continueOnError } = request;
  if (request.prefer && request.prefer.length) {
    ErrorHelper.stringOrArrayParameterCheck(request.prefer, `DynamicsWebApi.${request.functionName}`, "request.prefer");
    const preferArray = typeof request.prefer === "string" ? request.prefer.split(",") : request.prefer;
    preferArray.forEach((item) => {
      const trimmedItem = item.trim();
      if (trimmedItem === "return=representation") {
        returnRepresentation = true;
      } else if (trimmedItem.includes("odata.include-annotations=")) {
        includeAnnotations = removeDoubleQuotes(trimmedItem.replace("odata.include-annotations=", ""));
      } else if (trimmedItem.startsWith("odata.maxpagesize=")) {
        maxPageSize = Number(removeDoubleQuotes(trimmedItem.replace("odata.maxpagesize=", ""))) || 0;
      } else if (trimmedItem.includes("odata.track-changes")) {
        trackChanges = true;
      } else if (trimmedItem.includes("odata.continue-on-error")) {
        continueOnError = true;
      }
    });
  }
  const prefer = [];
  if (config) {
    if (returnRepresentation == null) {
      returnRepresentation = config.returnRepresentation;
    }
    includeAnnotations = includeAnnotations ?? config.includeAnnotations;
    maxPageSize = maxPageSize ?? config.maxPageSize;
  }
  if (returnRepresentation) {
    ErrorHelper.boolParameterCheck(returnRepresentation, `DynamicsWebApi.${request.functionName}`, "request.returnRepresentation");
    prefer.push("return=representation");
  }
  if (includeAnnotations) {
    ErrorHelper.stringParameterCheck(includeAnnotations, `DynamicsWebApi.${request.functionName}`, "request.includeAnnotations");
    prefer.push(`odata.include-annotations="${includeAnnotations}"`);
  }
  if (maxPageSize && maxPageSize > 0) {
    ErrorHelper.numberParameterCheck(maxPageSize, `DynamicsWebApi.${request.functionName}`, "request.maxPageSize");
    prefer.push("odata.maxpagesize=" + maxPageSize);
  }
  if (trackChanges) {
    ErrorHelper.boolParameterCheck(trackChanges, `DynamicsWebApi.${request.functionName}`, "request.trackChanges");
    prefer.push("odata.track-changes");
  }
  if (continueOnError) {
    ErrorHelper.boolParameterCheck(continueOnError, `DynamicsWebApi.${request.functionName}`, "request.continueOnError");
    prefer.push("odata.continue-on-error");
  }
  return prefer.join(",");
};
var convertToBatch = (requests, config, batchRequest) => {
  const batchBoundary = `dwa_batch_${generateUUID()}`;
  const batchBody = [];
  let currentChangeSet = null;
  let contentId = 1e5;
  const addHeaders = (headers2, batchBody2) => {
    for (const key in headers2) {
      if (key === "Authorization" || key === "Content-ID") continue;
      batchBody2.push(`${key}: ${headers2[key]}`);
    }
  };
  requests.forEach((internalRequest) => {
    var _a2;
    internalRequest.functionName = "executeBatch";
    if ((batchRequest == null ? void 0 : batchRequest.inChangeSet) === false) internalRequest.inChangeSet = false;
    const inChangeSet = internalRequest.method === "GET" ? false : !!internalRequest.inChangeSet;
    if (!inChangeSet && currentChangeSet) {
      batchBody.push(`
--${currentChangeSet}--`);
      currentChangeSet = null;
      contentId = 1e5;
    }
    if (!currentChangeSet) {
      batchBody.push(`
--${batchBoundary}`);
      if (inChangeSet) {
        currentChangeSet = `changeset_${generateUUID()}`;
        batchBody.push("Content-Type: multipart/mixed;boundary=" + currentChangeSet);
      }
    }
    if (inChangeSet) {
      batchBody.push(`
--${currentChangeSet}`);
    }
    batchBody.push("Content-Type: application/http");
    batchBody.push("Content-Transfer-Encoding: binary");
    if (inChangeSet) {
      const contentIdValue = internalRequest.headers.hasOwnProperty("Content-ID") ? internalRequest.headers["Content-ID"] : ++contentId;
      batchBody.push(`Content-ID: ${contentIdValue}`);
    }
    if (!((_a2 = internalRequest.path) == null ? void 0 : _a2.startsWith("$"))) {
      batchBody.push(`
${internalRequest.method} ${config.dataApi.url}${internalRequest.path} HTTP/1.1`);
    } else {
      batchBody.push(`
${internalRequest.method} ${internalRequest.path} HTTP/1.1`);
    }
    if (internalRequest.method === "GET") {
      batchBody.push("Accept: application/json");
    } else {
      batchBody.push("Content-Type: application/json");
    }
    if (internalRequest.headers) {
      addHeaders(internalRequest.headers, batchBody);
    }
    if (internalRequest.data) {
      batchBody.push(`
${processData(internalRequest.data, config)}`);
    }
  });
  if (currentChangeSet) {
    batchBody.push(`
--${currentChangeSet}--`);
  }
  batchBody.push(`
--${batchBoundary}--`);
  const headers = setStandardHeaders(batchRequest == null ? void 0 : batchRequest.userHeaders);
  headers["Content-Type"] = `multipart/mixed;boundary=${batchBoundary}`;
  return { headers, body: batchBody.join("\n") };
};
var findCollectionName = (entityName) => {
  if (isNull(entityNames)) return null;
  const collectionName = entityNames[entityName];
  if (!collectionName) {
    for (const key in entityNames) {
      if (entityNames[key] === entityName) {
        return entityName;
      }
    }
  }
  return collectionName;
};
var processData = (data, config) => {
  if (!data) return null;
  if (data instanceof Uint8Array || data instanceof Uint16Array || data instanceof Uint32Array) return data;
  const replaceEntityNameWithCollectionName = (value) => {
    const valueParts = SEARCH_FOR_ENTITY_NAME_REGEX.exec(value);
    if (valueParts && valueParts.length > 2) {
      const collectionName = findCollectionName(valueParts[1]);
      if (!isNull(collectionName)) {
        return value.replace(SEARCH_FOR_ENTITY_NAME_REGEX, `${collectionName}$2`);
      }
    }
    return value;
  };
  const addFullWebApiUrl = (key, value) => {
    if (!value.startsWith(config.dataApi.url)) {
      if (key.endsWith("@odata.bind")) {
        if (!value.startsWith("/")) {
          value = `/${value}`;
        }
      } else {
        value = `${config.dataApi.url}${removeLeadingSlash(value)}`;
      }
    }
    return value;
  };
  const stringifiedData = JSON.stringify(data, (key, value) => {
    if (key.endsWith("@odata.bind") || key.endsWith("@odata.id")) {
      if (typeof value === "string" && !value.startsWith("$")) {
        value = removeCurlyBracketsFromUuid(value);
        if (config.useEntityNames) {
          value = replaceEntityNameWithCollectionName(value);
        }
        value = addFullWebApiUrl(key, value);
      }
    } else if (key.startsWith("oData") || key.endsWith("_Formatted") || key.endsWith("_NavigationProperty") || key.endsWith("_LogicalName")) {
      return void 0;
    }
    return value;
  });
  return escapeUnicodeSymbols(stringifiedData);
};
var setStandardHeaders = (headers = {}) => {
  if (!headers["Accept"]) headers["Accept"] = "application/json";
  if (!headers["OData-MaxVersion"]) headers["OData-MaxVersion"] = "4.0";
  if (!headers["OData-Version"]) headers["OData-Version"] = "4.0";
  if (headers["Content-Range"]) headers["Content-Type"] = "application/octet-stream";
  else if (!headers["Content-Type"]) headers["Content-Type"] = "application/json; charset=utf-8";
  return headers;
};

// src/client/RequestClient.ts
init_ErrorHelper();

// src/client/helpers/executeRequest.ts
async function executeRequest2(options) {
  return false ? null.executeRequest(options) : (init_http(), __toCommonJS(http_exports)).executeRequest(options);
}

// src/client/RequestClient.ts
var _addResponseParams = (requestId, responseParams) => {
  if (_responseParseParams[requestId]) _responseParseParams[requestId].push(responseParams);
  else _responseParseParams[requestId] = [responseParams];
};
var _addRequestToBatchCollection = (requestId, request) => {
  if (_batchRequestCollection[requestId]) _batchRequestCollection[requestId].push(request);
  else _batchRequestCollection[requestId] = [request];
};
var _clearRequestData = (requestId) => {
  delete _responseParseParams[requestId];
  if (_batchRequestCollection.hasOwnProperty(requestId)) delete _batchRequestCollection[requestId];
};
var _runRequest = async (request, config) => {
  try {
    const result = await sendRequest(request, config);
    _clearRequestData(request.requestId);
    return result;
  } catch (error) {
    _clearRequestData(request.requestId);
    throw error;
  } finally {
    _clearRequestData(request.requestId);
  }
};
var _batchRequestCollection = {};
var _responseParseParams = {};
var _nameExceptions = [
  "$metadata",
  "EntityDefinitions",
  "RelationshipDefinitions",
  "GlobalOptionSetDefinitions",
  "ManagedPropertyDefinitions",
  "query",
  "suggest",
  "autocomplete"
];
var _isEntityNameException = (entityName) => {
  return _nameExceptions.indexOf(entityName) > -1;
};
var _getCollectionNames = async (entityName, config) => {
  if (!isNull(entityNames)) {
    return findCollectionName(entityName) || entityName;
  }
  const request = compose(
    {
      method: "GET",
      collection: "EntityDefinitions",
      select: ["EntitySetName", "LogicalName"],
      noCache: true,
      functionName: "retrieveMultiple"
    },
    config
  );
  const result = await _runRequest(request, config);
  setEntityNames({});
  for (let i = 0; i < result.data.value.length; i++) {
    entityNames[result.data.value[i].LogicalName] = result.data.value[i].EntitySetName;
  }
  return findCollectionName(entityName) || entityName;
};
var _checkCollectionName = async (entityName, config) => {
  if (!entityName || _isEntityNameException(entityName)) {
    return entityName;
  }
  entityName = entityName.toLowerCase();
  if (!config.useEntityNames) {
    return entityName;
  }
  try {
    return await _getCollectionNames(entityName, config);
  } catch (error) {
    throw new Error("Unable to fetch Collection Names. Error: " + error.message);
  }
};
var sendRequest = async (request, config) => {
  var _a2;
  request.headers = request.headers || {};
  request.responseParameters = request.responseParameters || {};
  request.requestId = request.requestId || generateUUID();
  _addResponseParams(request.requestId, request.responseParameters);
  let processedData = null;
  const isBatchConverted = (_a2 = request.responseParameters) == null ? void 0 : _a2.convertedToBatch;
  if (request.path === "$batch" && !isBatchConverted) {
    const batchRequest = _batchRequestCollection[request.requestId];
    if (!batchRequest) throw ErrorHelper.batchIsEmpty();
    const batchResult = convertToBatch(batchRequest, config, request);
    processedData = batchResult.body;
    request.headers = { ...batchResult.headers, ...request.headers };
    delete _batchRequestCollection[request.requestId];
  } else {
    processedData = !isBatchConverted ? processData(request.data, config) : request.data;
    if (!isBatchConverted) request.headers = setStandardHeaders(request.headers);
  }
  if (config.impersonate && !request.headers["MSCRMCallerID"]) {
    request.headers["MSCRMCallerID"] = config.impersonate;
  }
  if (config.impersonateAAD && !request.headers["CallerObjectId"]) {
    request.headers["CallerObjectId"] = config.impersonateAAD;
  }
  let token = null;
  if (config.onTokenRefresh && (!request.headers || request.headers && !request.headers["Authorization"])) {
    token = await config.onTokenRefresh();
    if (!token) throw new Error("Token is empty. Request is aborted.");
  }
  if (token) {
    request.headers["Authorization"] = "Bearer " + (token.hasOwnProperty("accessToken") ? token.accessToken : token);
  }
  if (isRunningWithinPortals()) {
    request.headers["__RequestVerificationToken"] = await global.window.shell.getTokenDeferred();
  }
  const url = request.apiConfig ? request.apiConfig.url : config.dataApi.url;
  return await executeRequest2({
    method: request.method,
    uri: url.toString() + request.path,
    data: processedData,
    proxy: config.proxy,
    isAsync: request.async,
    headers: request.headers,
    requestId: request.requestId,
    abortSignal: request.signal,
    responseParams: _responseParseParams,
    timeout: request.timeout || config.timeout
  });
};
var makeRequest = async (request, config) => {
  request.responseParameters = request.responseParameters || {};
  request.userHeaders = request.headers;
  delete request.headers;
  if (!request.isBatch) {
    const collectionName = await _checkCollectionName(request.collection, config);
    request.collection = collectionName;
    compose(request, config);
    request.responseParameters.convertedToBatch = false;
    if (request.path.length > 2e3) {
      const batchRequest = convertToBatch([request], config);
      if (request.headers["Authorization"]) {
        batchRequest.headers["Authorization"] = request.headers["Authorization"];
      }
      request.method = "POST";
      request.path = "$batch";
      request.data = batchRequest.body;
      request.headers = { ...batchRequest.headers, ...request.userHeaders };
      request.responseParameters.convertedToBatch = true;
    }
    return _runRequest(request, config);
  }
  compose(request, config);
  _addResponseParams(request.requestId, request.responseParameters);
  _addRequestToBatchCollection(request.requestId, request);
};
var getCollectionName = (entityName) => {
  return findCollectionName(entityName);
};

// src/requests/associate.ts
init_ErrorHelper();
init_Utility();

// src/requests/constants.ts
var LIBRARY_NAME = "DynamicsWebApi";

// src/requests/associate.ts
var FUNCTION_NAME = "associate";
var REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME}`;
var associate = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
  let internalRequest = copyRequest(request);
  internalRequest.method = "POST";
  internalRequest.functionName = FUNCTION_NAME;
  ErrorHelper.stringParameterCheck(request.relatedCollection, REQUEST_NAME, "request.relatedcollection");
  ErrorHelper.stringParameterCheck(request.relationshipName, REQUEST_NAME, "request.relationshipName");
  const primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, REQUEST_NAME, "request.primaryKey");
  const relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, REQUEST_NAME, "request.relatedKey");
  internalRequest.navigationProperty = request.relationshipName + "/$ref";
  internalRequest.key = primaryKey;
  internalRequest.data = { "@odata.id": `${request.relatedCollection}(${relatedKey})` };
  await client.makeRequest(internalRequest);
};

// src/requests/associateSingleValued.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME2 = "associateSingleValued";
var REQUEST_NAME2 = `${LIBRARY_NAME}.${FUNCTION_NAME2}`;
var associateSingleValued = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME2, "request");
  let internalRequest = copyRequest(request);
  internalRequest.method = "PUT";
  internalRequest.functionName = FUNCTION_NAME2;
  const primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, REQUEST_NAME2, "request.primaryKey");
  const relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, REQUEST_NAME2, "request.relatedKey");
  ErrorHelper.stringParameterCheck(request.navigationProperty, REQUEST_NAME2, "request.navigationProperty");
  ErrorHelper.stringParameterCheck(request.relatedCollection, REQUEST_NAME2, "request.relatedcollection");
  internalRequest.navigationProperty += "/$ref";
  internalRequest.key = primaryKey;
  internalRequest.data = { "@odata.id": `${request.relatedCollection}(${relatedKey})` };
  await client.makeRequest(internalRequest);
};

// src/requests/callAction.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME3 = "callAction";
var REQUEST_NAME3 = `${LIBRARY_NAME}.${FUNCTION_NAME3}`;
var callAction = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME3, "request");
  ErrorHelper.stringParameterCheck(request.actionName, REQUEST_NAME3, "request.actionName");
  const internalRequest = copyRequest(request, ["action"]);
  internalRequest.method = "POST";
  internalRequest.functionName = FUNCTION_NAME3;
  internalRequest.addPath = request.actionName;
  internalRequest._isUnboundRequest = !internalRequest.collection;
  internalRequest.data = request.action;
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
};

// src/requests/callFunction.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME4 = "callFunction";
var REQUEST_NAME4 = `${LIBRARY_NAME}.${FUNCTION_NAME4}`;
var callFunction = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME4, "request");
  const getFunctionName = (request2) => request2.name || request2.functionName;
  const isObject2 = typeof request !== "string";
  const functionName = isObject2 ? getFunctionName(request) : request;
  const parameterName = isObject2 ? "request.name" : "name";
  const internalRequest = isObject2 ? copyObject(request, ["name"]) : { functionName };
  ErrorHelper.stringParameterCheck(functionName, REQUEST_NAME4, parameterName);
  const functionParameters = buildFunctionParameters(internalRequest.parameters);
  internalRequest.method = "GET";
  internalRequest.addPath = functionName + functionParameters.key;
  internalRequest.queryParams = functionParameters.queryParams;
  internalRequest._isUnboundRequest = !internalRequest.collection;
  internalRequest.functionName = FUNCTION_NAME4;
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
};

// src/requests/create.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME5 = "create";
var REQUEST_NAME5 = `${LIBRARY_NAME}.${FUNCTION_NAME5}`;
var create = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME5, "request");
  let internalRequest;
  if (!request.functionName) {
    internalRequest = copyRequest(request);
    internalRequest.functionName = FUNCTION_NAME5;
  } else internalRequest = request;
  internalRequest.method = "POST";
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
};

// src/requests/count.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME6 = "count";
var REQUEST_NAME6 = `${LIBRARY_NAME}.${FUNCTION_NAME6}`;
var count = async (request, client) => {
  var _a2;
  ErrorHelper.parameterCheck(request, REQUEST_NAME6, "request");
  const internalRequest = copyRequest(request);
  internalRequest.method = "GET";
  internalRequest.functionName = FUNCTION_NAME6;
  if ((_a2 = internalRequest.filter) == null ? void 0 : _a2.length) {
    internalRequest.count = true;
  } else {
    internalRequest.navigationProperty = "$count";
  }
  internalRequest.responseParameters = { toCount: internalRequest.count };
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
};

// src/requests/countAll.ts
init_ErrorHelper();

// src/requests/retrieveAll.ts
init_ErrorHelper();

// src/requests/retrieveMultiple.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME7 = "retrieveMultiple";
var REQUEST_NAME7 = `${LIBRARY_NAME}.${FUNCTION_NAME7}`;
var retrieveMultiple = async (request, client, nextPageLink) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME7, "request");
  let internalRequest;
  if (!request.functionName) {
    internalRequest = copyRequest(request);
    internalRequest.functionName = FUNCTION_NAME7;
  } else internalRequest = request;
  internalRequest.method = "GET";
  if (nextPageLink) {
    ErrorHelper.stringParameterCheck(nextPageLink, REQUEST_NAME7, "nextPageLink");
    internalRequest.url = nextPageLink;
  }
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
};

// src/requests/retrieveAll.ts
var FUNCTION_NAME8 = "retrieveAll";
var REQUEST_NAME8 = `${LIBRARY_NAME}.${FUNCTION_NAME8}`;
var retrieveAllRequest = async (request, client, nextPageLink, records = []) => {
  const response = await retrieveMultiple(request, client, nextPageLink);
  records = records.concat(response.value);
  const pageLink = response.oDataNextLink;
  if (pageLink) {
    return retrieveAllRequest(request, client, pageLink, records);
  }
  const result = { value: records };
  if (response.oDataDeltaLink) {
    result["@odata.deltaLink"] = response.oDataDeltaLink;
    result.oDataDeltaLink = response.oDataDeltaLink;
  }
  return result;
};
var retrieveAll = (request, client) => {
  ErrorHelper.throwBatchIncompatible(REQUEST_NAME8, client.isBatch);
  return retrieveAllRequest(request, client);
};

// src/requests/countAll.ts
var FUNCTION_NAME9 = "countAll";
var REQUEST_NAME9 = `${LIBRARY_NAME}.${FUNCTION_NAME9}`;
var countAll = async (request, client) => {
  ErrorHelper.throwBatchIncompatible(REQUEST_NAME9, client.isBatch);
  ErrorHelper.parameterCheck(request, REQUEST_NAME9, "request");
  const response = await retrieveAllRequest(request, client);
  return response ? response.value ? response.value.length : 0 : 0;
};

// src/requests/disassociate.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME10 = "disassociate";
var REQUEST_NAME10 = `${LIBRARY_NAME}.${FUNCTION_NAME10}`;
var disassociate = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME10, "request");
  let internalRequest = copyRequest(request);
  internalRequest.method = "DELETE";
  internalRequest.functionName = FUNCTION_NAME10;
  ErrorHelper.stringParameterCheck(request.relationshipName, REQUEST_NAME10, "request.relationshipName");
  const primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, REQUEST_NAME10, "request.primaryKey");
  const relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, REQUEST_NAME10, "request.relatedId");
  internalRequest.key = primaryKey;
  internalRequest.navigationProperty = `${request.relationshipName}(${relatedKey})/$ref`;
  await client.makeRequest(internalRequest);
};

// src/requests/disassociateSingleValued.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME11 = "disassociateSingleValued";
var REQUEST_NAME11 = `${LIBRARY_NAME}.${FUNCTION_NAME11}`;
var disassociateSingleValued = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME11, "request");
  let internalRequest = copyRequest(request);
  internalRequest.method = "DELETE";
  internalRequest.functionName = FUNCTION_NAME11;
  ErrorHelper.stringParameterCheck(request.navigationProperty, REQUEST_NAME11, "request.navigationProperty");
  const primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, REQUEST_NAME11, "request.primaryKey");
  internalRequest.navigationProperty += "/$ref";
  internalRequest.key = primaryKey;
  await client.makeRequest(internalRequest);
};

// src/requests/retrieve.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME12 = "retrieve";
var REQUEST_NAME12 = `${LIBRARY_NAME}.${FUNCTION_NAME12}`;
var retrieve = async (request, client) => {
  var _a2;
  ErrorHelper.parameterCheck(request, REQUEST_NAME12, "request");
  let internalRequest;
  if (!request.functionName) {
    internalRequest = copyRequest(request);
    internalRequest.functionName = FUNCTION_NAME12;
  } else internalRequest = request;
  internalRequest.method = "GET";
  internalRequest.responseParameters = {
    isRef: ((_a2 = internalRequest.select) == null ? void 0 : _a2.length) === 1 && internalRequest.select[0].endsWith("/$ref")
  };
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
};

// src/requests/fetchXml.ts
init_ErrorHelper();
init_Regex();
init_Utility();
var FUNCTION_NAME13 = "fetch";
var REQUEST_NAME13 = `${LIBRARY_NAME}.${FUNCTION_NAME13}`;
var fetchXml = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME13, "request");
  const internalRequest = copyRequest(request);
  internalRequest.method = "GET";
  internalRequest.functionName = FUNCTION_NAME13;
  ErrorHelper.stringParameterCheck(internalRequest.fetchXml, REQUEST_NAME13, "request.fetchXml");
  if (internalRequest.fetchXml && !FETCH_XML_TOP_REGEX.test(internalRequest.fetchXml)) {
    let replacementString = "";
    if (!FETCH_XML_PAGE_REGEX.test(internalRequest.fetchXml)) {
      internalRequest.pageNumber = internalRequest.pageNumber || 1;
      ErrorHelper.numberParameterCheck(internalRequest.pageNumber, REQUEST_NAME13, "request.pageNumber");
      replacementString = `$1 page="${internalRequest.pageNumber}"`;
    }
    if (internalRequest.pagingCookie != null) {
      ErrorHelper.stringParameterCheck(internalRequest.pagingCookie, REQUEST_NAME13, "request.pagingCookie");
      replacementString += ` paging-cookie="${internalRequest.pagingCookie}"`;
    }
    if (replacementString) internalRequest.fetchXml = internalRequest.fetchXml.replace(FETCH_XML_REPLACE_REGEX, replacementString);
  }
  internalRequest.responseParameters = { pageNumber: internalRequest.pageNumber };
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
};

// src/requests/fetchXmlAll.ts
init_ErrorHelper();
var FUNCTION_NAME14 = "fetchAll";
var REQUEST_NAME14 = `${LIBRARY_NAME}.${FUNCTION_NAME14}`;
var executeFetchXmlAll = async (request, client, records = []) => {
  const response = await fetchXml(request, client);
  records = records.concat(response.value);
  if (response.PagingInfo) {
    request.pageNumber = response.PagingInfo.nextPage;
    request.pagingCookie = response.PagingInfo.cookie;
    return executeFetchXmlAll(request, client, records);
  }
  return { value: records };
};
var fetchXmlAll = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME14, "request");
  ErrorHelper.throwBatchIncompatible(REQUEST_NAME14, client.isBatch);
  return executeFetchXmlAll(request, client);
};

// src/requests/update.ts
init_ErrorHelper();
init_Regex();
init_Utility();
var FUNCTION_NAME15 = "update";
var REQUEST_NAME15 = `${LIBRARY_NAME}.${FUNCTION_NAME15}`;
var update = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME15, "request");
  let internalRequest;
  if (!request.functionName) {
    internalRequest = copyRequest(request);
    internalRequest.functionName = FUNCTION_NAME15;
  } else internalRequest = request;
  internalRequest.method ?? (internalRequest.method = getUpdateMethod(internalRequest.collection));
  internalRequest.responseParameters = { valueIfEmpty: true };
  internalRequest.ifmatch ?? (internalRequest.ifmatch = "*");
  const ifmatch = internalRequest.ifmatch;
  try {
    const response = await client.makeRequest(internalRequest);
    return response == null ? void 0 : response.data;
  } catch (error) {
    if (ifmatch && error.status === 412) {
      return false;
    }
    throw error;
  }
};

// src/requests/updateSingleProperty.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME16 = "updateSingleProperty";
var REQUEST_NAME16 = `${LIBRARY_NAME}.${FUNCTION_NAME16}`;
var updateSingleProperty = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME16, "request");
  ErrorHelper.parameterCheck(request.fieldValuePair, REQUEST_NAME16, "request.fieldValuePair");
  var field = Object.keys(request.fieldValuePair)[0];
  var fieldValue = request.fieldValuePair[field];
  const internalRequest = copyRequest(request);
  internalRequest.navigationProperty = field;
  internalRequest.data = { value: fieldValue };
  internalRequest.functionName = FUNCTION_NAME16;
  internalRequest.method = "PUT";
  delete internalRequest["fieldValuePair"];
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
};

// src/requests/upsert.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME17 = "upsert";
var REQUEST_NAME17 = `${LIBRARY_NAME}.${FUNCTION_NAME17}`;
var upsert = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME17, "request");
  const internalRequest = copyRequest(request);
  internalRequest.method = "PATCH";
  internalRequest.functionName = FUNCTION_NAME17;
  const ifnonematch = internalRequest.ifnonematch;
  const ifmatch = internalRequest.ifmatch;
  try {
    const response = await client.makeRequest(internalRequest);
    return response == null ? void 0 : response.data;
  } catch (error) {
    if (ifnonematch && error.status === 412) {
      return null;
    } else if (ifmatch && error.status === 404) {
      return null;
    }
    throw error;
  }
};

// src/requests/delete.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME18 = "deleteRecord";
var REQUEST_NAME18 = `${LIBRARY_NAME}.${FUNCTION_NAME18}`;
var deleteRecord = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME18, "request");
  let internalRequest;
  if (!request.functionName) {
    internalRequest = copyRequest(request);
    internalRequest.functionName = FUNCTION_NAME18;
  } else internalRequest = request;
  internalRequest.method = "DELETE";
  internalRequest.responseParameters = { valueIfEmpty: true };
  const ifmatch = internalRequest.ifmatch;
  try {
    const response = await client.makeRequest(internalRequest);
    return response == null ? void 0 : response.data;
  } catch (error) {
    if (ifmatch && error.status === 412) {
      return false;
    }
    throw error;
  }
};

// src/requests/uploadFile.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME19 = "uploadFile";
var REQUEST_NAME19 = `${LIBRARY_NAME}.${FUNCTION_NAME19}`;
var _uploadFileChunk = async (request, client, fileBytes, chunkSize, offset = 0) => {
  setFileChunk(request, fileBytes, chunkSize, offset);
  await client.makeRequest(request);
  offset += chunkSize;
  if (offset <= fileBytes.length) {
    return _uploadFileChunk(request, client, fileBytes, chunkSize, offset);
  }
};
var uploadFile = async (request, client) => {
  ErrorHelper.throwBatchIncompatible(REQUEST_NAME19, client.isBatch);
  ErrorHelper.parameterCheck(request, REQUEST_NAME19, "request");
  const internalRequest = copyRequest(request, ["data"]);
  internalRequest.method = "PATCH";
  internalRequest.functionName = FUNCTION_NAME19;
  internalRequest.transferMode = "chunked";
  const response = await client.makeRequest(internalRequest);
  internalRequest.url = response == null ? void 0 : response.data.location;
  delete internalRequest.transferMode;
  delete internalRequest.fieldName;
  delete internalRequest.property;
  delete internalRequest.fileName;
  return _uploadFileChunk(internalRequest, client, request.data, response == null ? void 0 : response.data.chunkSize);
};

// src/requests/downloadFile.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME20 = "deleteRecord";
var REQUEST_NAME20 = `${LIBRARY_NAME}.${FUNCTION_NAME20}`;
var downloadFileChunk = async (request, client, bytesDownloaded = 0, data = "") => {
  request.range = "bytes=" + bytesDownloaded + "-" + (bytesDownloaded + downloadChunkSize - 1);
  request.downloadSize = "full";
  const response = await client.makeRequest(request);
  request.url = response == null ? void 0 : response.data.location;
  data += response == null ? void 0 : response.data.value;
  bytesDownloaded += downloadChunkSize;
  if (bytesDownloaded <= (response == null ? void 0 : response.data.fileSize)) {
    return downloadFileChunk(request, client, bytesDownloaded, data);
  }
  return {
    fileName: response == null ? void 0 : response.data.fileName,
    fileSize: response == null ? void 0 : response.data.fileSize,
    data: convertToFileBuffer(data)
  };
};
var downloadFile = (request, client) => {
  ErrorHelper.throwBatchIncompatible(REQUEST_NAME20, client.isBatch);
  ErrorHelper.parameterCheck(request, REQUEST_NAME20, "request");
  const internalRequest = copyRequest(request);
  internalRequest.method = "GET";
  internalRequest.functionName = FUNCTION_NAME20;
  internalRequest.responseParameters = { parse: true };
  return downloadFileChunk(internalRequest, client);
};

// src/requests/metadata/createEntity.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME21 = "createEntity";
var REQUEST_NAME21 = `${LIBRARY_NAME}.${FUNCTION_NAME21}`;
var createEntity = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME21, "request");
  ErrorHelper.parameterCheck(request.data, REQUEST_NAME21, "request.data");
  const internalRequest = copyRequest(request);
  internalRequest.collection = "EntityDefinitions";
  internalRequest.functionName = FUNCTION_NAME21;
  return create(internalRequest, client);
};

// src/requests/metadata/updateEntity.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME22 = "updateEntity";
var REQUEST_NAME22 = `${LIBRARY_NAME}.${FUNCTION_NAME22}`;
var updateEntity = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME22, "request");
  ErrorHelper.parameterCheck(request.data, REQUEST_NAME22, "request.data");
  const internalRequest = copyRequest(request);
  internalRequest.collection = "EntityDefinitions";
  internalRequest.functionName = FUNCTION_NAME22;
  internalRequest.key = internalRequest.data.MetadataId;
  internalRequest.method = "PUT";
  return await update(internalRequest, client);
};

// src/requests/metadata/retrieveEntity.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME23 = "retrieveEntity";
var REQUEST_NAME23 = `${LIBRARY_NAME}.${FUNCTION_NAME23}`;
var retrieveEntity = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME23, "request");
  ErrorHelper.keyParameterCheck(request.key, REQUEST_NAME23, "request.key");
  const internalRequest = copyRequest(request);
  internalRequest.collection = "EntityDefinitions";
  internalRequest.functionName = "retrieveEntity";
  return await retrieve(internalRequest, client);
};

// src/utils/Config.ts
init_Utility();
init_ErrorHelper();
var getApiUrl = (serverUrl, apiConfig) => {
  if (isRunningWithinPortals()) {
    return new URL("_api", global.window.location.origin).toString() + "/";
  } else {
    if (!serverUrl) serverUrl = getClientUrl();
    return new URL(`api/${apiConfig.path}/v${apiConfig.version}`, serverUrl).toString() + "/";
  }
};
var mergeApiConfigs = (apiConfig, apiType, internalConfig) => {
  const internalApiConfig = internalConfig[apiType];
  if (apiConfig == null ? void 0 : apiConfig.version) {
    ErrorHelper.stringParameterCheck(apiConfig.version, "DynamicsWebApi.setConfig", `config.${apiType}.version`);
    internalApiConfig.version = apiConfig.version;
  }
  if (apiConfig == null ? void 0 : apiConfig.path) {
    ErrorHelper.stringParameterCheck(apiConfig.path, "DynamicsWebApi.setConfig", `config.${apiType}.path`);
    internalApiConfig.path = apiConfig.path;
  }
  internalApiConfig.url = getApiUrl(internalConfig.serverUrl, internalApiConfig);
};
var ConfigurationUtility = class {
  static merge(internalConfig, config) {
    if (config == null ? void 0 : config.serverUrl) {
      ErrorHelper.stringParameterCheck(config.serverUrl, "DynamicsWebApi.setConfig", "config.serverUrl");
      internalConfig.serverUrl = config.serverUrl;
    }
    mergeApiConfigs(config == null ? void 0 : config.dataApi, "dataApi", internalConfig);
    mergeApiConfigs(config == null ? void 0 : config.searchApi, "searchApi", internalConfig);
    if (config == null ? void 0 : config.impersonate) {
      internalConfig.impersonate = ErrorHelper.guidParameterCheck(config.impersonate, "DynamicsWebApi.setConfig", "config.impersonate");
    }
    if (config == null ? void 0 : config.impersonateAAD) {
      internalConfig.impersonateAAD = ErrorHelper.guidParameterCheck(config.impersonateAAD, "DynamicsWebApi.setConfig", "config.impersonateAAD");
    }
    if (config == null ? void 0 : config.onTokenRefresh) {
      ErrorHelper.callbackParameterCheck(config.onTokenRefresh, "DynamicsWebApi.setConfig", "config.onTokenRefresh");
      internalConfig.onTokenRefresh = config.onTokenRefresh;
    }
    if (config == null ? void 0 : config.includeAnnotations) {
      ErrorHelper.stringParameterCheck(config.includeAnnotations, "DynamicsWebApi.setConfig", "config.includeAnnotations");
      internalConfig.includeAnnotations = config.includeAnnotations;
    }
    if (config == null ? void 0 : config.timeout) {
      ErrorHelper.numberParameterCheck(config.timeout, "DynamicsWebApi.setConfig", "config.timeout");
      internalConfig.timeout = config.timeout;
    }
    if (config == null ? void 0 : config.maxPageSize) {
      ErrorHelper.numberParameterCheck(config.maxPageSize, "DynamicsWebApi.setConfig", "config.maxPageSize");
      internalConfig.maxPageSize = config.maxPageSize;
    }
    if (config == null ? void 0 : config.returnRepresentation) {
      ErrorHelper.boolParameterCheck(config.returnRepresentation, "DynamicsWebApi.setConfig", "config.returnRepresentation");
      internalConfig.returnRepresentation = config.returnRepresentation;
    }
    if (config == null ? void 0 : config.useEntityNames) {
      ErrorHelper.boolParameterCheck(config.useEntityNames, "DynamicsWebApi.setConfig", "config.useEntityNames");
      internalConfig.useEntityNames = config.useEntityNames;
    }
    if (config == null ? void 0 : config.headers) {
      internalConfig.headers = config.headers;
    }
    if (config == null ? void 0 : config.proxy) {
      ErrorHelper.parameterCheck(config.proxy, "DynamicsWebApi.setConfig", "config.proxy");
      if (config.proxy.url) {
        ErrorHelper.stringParameterCheck(config.proxy.url, "DynamicsWebApi.setConfig", "config.proxy.url");
        if (config.proxy.auth) {
          ErrorHelper.parameterCheck(config.proxy.auth, "DynamicsWebApi.setConfig", "config.proxy.auth");
          ErrorHelper.stringParameterCheck(config.proxy.auth.username, "DynamicsWebApi.setConfig", "config.proxy.auth.username");
          ErrorHelper.stringParameterCheck(config.proxy.auth.password, "DynamicsWebApi.setConfig", "config.proxy.auth.password");
        }
      }
      internalConfig.proxy = config.proxy;
    }
  }
  static default() {
    return {
      serverUrl: null,
      impersonate: null,
      impersonateAAD: null,
      onTokenRefresh: null,
      includeAnnotations: null,
      maxPageSize: null,
      returnRepresentation: null,
      proxy: null,
      dataApi: {
        path: "data",
        version: "9.2",
        url: ""
      },
      searchApi: {
        path: "search",
        version: "1.0",
        url: ""
      }
    };
  }
};
ConfigurationUtility.mergeApiConfigs = mergeApiConfigs;

// src/client/dataverse.ts
var _config, _isBatch, _batchRequestId;
var DataverseClient = class {
  constructor(config) {
    __privateAdd(this, _config, ConfigurationUtility.default());
    __privateAdd(this, _isBatch, false);
    __privateAdd(this, _batchRequestId, null);
    this.setConfig = (config) => ConfigurationUtility.merge(__privateGet(this, _config), config);
    this.makeRequest = (request) => {
      request.isBatch = __privateGet(this, _isBatch);
      if (__privateGet(this, _batchRequestId)) request.requestId = __privateGet(this, _batchRequestId);
      return makeRequest(request, __privateGet(this, _config));
    };
    ConfigurationUtility.merge(__privateGet(this, _config), config);
  }
  get batchRequestId() {
    return __privateGet(this, _batchRequestId);
  }
  set batchRequestId(value) {
    __privateSet(this, _batchRequestId, value);
  }
  get config() {
    return __privateGet(this, _config);
  }
  get isBatch() {
    return __privateGet(this, _isBatch);
  }
  set isBatch(value) {
    __privateSet(this, _isBatch, value);
  }
};
_config = new WeakMap();
_isBatch = new WeakMap();
_batchRequestId = new WeakMap();

// src/dynamics-web-api.ts
var _client;
var _DynamicsWebApi = class _DynamicsWebApi {
  /**
   * Initializes a new instance of DynamicsWebApi
   * @param config - Configuration object
   */
  constructor(config) {
    __privateAdd(this, _client);
    /**
    * Merges provided configuration properties with an existing one.
    *
    * @param {DynamicsWebApi.Config} config - Configuration
    * @example
      dynamicsWebApi.setConfig({ serverUrl: 'https://contoso.api.crm.dynamics.com/' });
    */
    this.setConfig = (config) => __privateGet(this, _client).setConfig(config);
    /**
     * Sends an asynchronous request to create a new record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     * @example
     *const lead = {
     *    subject: "Test WebAPI",
     *    firstname: "Test",
     *    lastname: "WebAPI",
     *    jobtitle: "Title"
     *};
     *
     *const request = {
     *    data: lead,
     *    collection: "leads",
     *    returnRepresentation: true
     *}
     *
     *const response = await dynamicsWebApi.create(request);
     *
     */
    this.create = async (request) => create(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to retrieve a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     * @example
     *const request = {
     *    key: '7d577253-3ef0-4a0a-bb7f-8335c2596e70',
     *    collection: "leads",
     *    select: ["fullname", "subject"],
     *    ifnonematch: 'W/"468026"',
     *    includeAnnotations: "OData.Community.Display.V1.FormattedValue"
     *};
     *
     *const response = await dynamicsWebApi.retrieve(request);
     */
    this.retrieve = async (request) => retrieve(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.update = async (request) => update(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.updateSingleProperty = async (request) => updateSingleProperty(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.deleteRecord = async (request) => deleteRecord(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.upsert = async (request) => upsert(request, __privateGet(this, _client));
    /**
     * Upload file to a File Attribute
     *
     * @param request - An object that represents all possible options for a current request.
     */
    this.uploadFile = async (request) => uploadFile(request, __privateGet(this, _client));
    /**
     * Download a file from a File Attribute
     * @param request - An object that represents all possible options for a current request.
     */
    this.downloadFile = (request) => downloadFile(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param request - An object that represents all possible options for a current request.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveMultiple = async (request, nextPageLink) => retrieveMultiple(request, __privateGet(this, _client), nextPageLink);
    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveAll = (request) => retrieveAll(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.count = async (request) => count(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to count records. Returns: Number
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.countAll = async (request) => countAll(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.fetch = async (request) => fetchXml(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.fetchAll = async (request) => fetchXmlAll(request, __privateGet(this, _client));
    /**
     * Associate for a collection-valued navigation property. (1:N or N:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.associate = async (request) => associate(request, __privateGet(this, _client));
    /**
     * Disassociate for a collection-valued navigation property.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.disassociate = async (request) => disassociate(request, __privateGet(this, _client));
    /**
     * Associate for a single-valued navigation property. (1:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.associateSingleValued = async (request) => associateSingleValued(request, __privateGet(this, _client));
    /**
     * Removes a reference to an entity for a single-valued navigation property. (1:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.disassociateSingleValued = async (request) => disassociateSingleValued(request, __privateGet(this, _client));
    /**
     * Calls a Web API function
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.callFunction = async (request) => callFunction(request, __privateGet(this, _client));
    /**
     * Calls a Web API action
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.callAction = async (request) => callAction(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to create an entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.createEntity = (request) => createEntity(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to update an entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.updateEntity = (request) => updateEntity(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to retrieve a specific entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveEntity = (request) => retrieveEntity(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to retrieve entity definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveEntities = (request) => {
      const internalRequest = !request ? {} : copyRequest(request);
      internalRequest.collection = "EntityDefinitions";
      internalRequest.functionName = "retrieveEntities";
      return this.retrieveMultiple(internalRequest);
    };
    /**
     * Sends an asynchronous request to create an attribute.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.createAttribute = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.createAttribute", "request");
      ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createAttribute", "request.data");
      ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.createAttribute", "request.entityKey");
      const internalRequest = copyRequest(request);
      internalRequest.collection = "EntityDefinitions";
      internalRequest.functionName = "retrieveEntity";
      internalRequest.navigationProperty = "Attributes";
      internalRequest.key = request.entityKey;
      return this.create(internalRequest);
    };
    /**
     * Sends an asynchronous request to update an attribute.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.updateAttribute = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateAttribute", "request");
      ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateAttribute", "request.data");
      ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.updateAttribute", "request.entityKey");
      ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateAttribute", "request.data.MetadataId");
      if (request.castType) {
        ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateAttribute", "request.castType");
      }
      const internalRequest = copyRequest(request);
      internalRequest.collection = "EntityDefinitions";
      internalRequest.navigationProperty = "Attributes";
      internalRequest.navigationPropertyKey = request.data.MetadataId;
      internalRequest.metadataAttributeType = request.castType;
      internalRequest.key = request.entityKey;
      internalRequest.functionName = "updateAttribute";
      internalRequest.method = "PUT";
      return this.update(internalRequest);
    };
    /**
     * Sends an asynchronous request to retrieve attribute metadata for a specified entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveAttributes = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveAttributes", "request");
      ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.retrieveAttributes", "request.entityKey");
      if (request.castType) {
        ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveAttributes", "request.castType");
      }
      const internalRequest = copyRequest(request);
      internalRequest.collection = "EntityDefinitions";
      internalRequest.navigationProperty = "Attributes";
      internalRequest.metadataAttributeType = request.castType;
      internalRequest.key = request.entityKey;
      internalRequest.functionName = "retrieveAttributes";
      return this.retrieveMultiple(internalRequest);
    };
    /**
     * Sends an asynchronous request to retrieve a specific attribute metadata for a specified entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveAttribute = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveAttributes", "request");
      ErrorHelper.keyParameterCheck(request.entityKey, "DynamicsWebApi.retrieveAttribute", "request.entityKey");
      ErrorHelper.keyParameterCheck(request.attributeKey, "DynamicsWebApi.retrieveAttribute", "request.attributeKey");
      if (request.castType) {
        ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveAttribute", "request.castType");
      }
      const internalRequest = copyRequest(request);
      internalRequest.collection = "EntityDefinitions";
      internalRequest.navigationProperty = "Attributes";
      internalRequest.navigationPropertyKey = request.attributeKey;
      internalRequest.metadataAttributeType = request.castType;
      internalRequest.key = request.entityKey;
      internalRequest.functionName = "retrieveAttribute";
      return this.retrieve(internalRequest);
    };
    /**
     * Sends an asynchronous request to create a relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.createRelationship = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.createRelationship", "request");
      ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createRelationship", "request.data");
      const internalRequest = copyRequest(request);
      internalRequest.collection = "RelationshipDefinitions";
      internalRequest.functionName = "createRelationship";
      return this.create(internalRequest);
    };
    /**
     * Sends an asynchronous request to update a relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.updateRelationship = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateRelationship", "request");
      ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateRelationship", "request.data");
      ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateRelationship", "request.data.MetadataId");
      if (request.castType) {
        ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateRelationship", "request.castType");
      }
      const internalRequest = copyRequest(request);
      internalRequest.collection = "RelationshipDefinitions";
      internalRequest.key = request.data.MetadataId;
      internalRequest.navigationProperty = request.castType;
      internalRequest.functionName = "updateRelationship";
      internalRequest.method = "PUT";
      return this.update(internalRequest);
    };
    /**
     * Sends an asynchronous request to delete a relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.deleteRelationship = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteRelationship", "request");
      ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.deleteRelationship", "request.key");
      const internalRequest = copyRequest(request);
      internalRequest.collection = "RelationshipDefinitions";
      internalRequest.functionName = "deleteRelationship";
      return this.deleteRecord(internalRequest);
    };
    /**
     * Sends an asynchronous request to retrieve relationship definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveRelationships = (request) => {
      const internalRequest = !request ? {} : copyRequest(request);
      internalRequest.collection = "RelationshipDefinitions";
      internalRequest.functionName = "retrieveRelationships";
      if (request) {
        if (request.castType) {
          ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveRelationships", "request.castType");
          internalRequest.navigationProperty = request.castType;
        }
      }
      return this.retrieveMultiple(internalRequest);
    };
    /**
     * Sends an asynchronous request to retrieve a specific relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveRelationship = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveRelationship", "request");
      ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.retrieveRelationship", "request.key");
      if (request.castType) {
        ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveRelationship", "request.castType");
      }
      const internalRequest = copyRequest(request);
      internalRequest.collection = "RelationshipDefinitions";
      internalRequest.navigationProperty = request.castType;
      internalRequest.functionName = "retrieveRelationship";
      return this.retrieve(internalRequest);
    };
    /**
     * Sends an asynchronous request to create a Global Option Set definition
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.createGlobalOptionSet = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.createGlobalOptionSet", "request");
      ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createGlobalOptionSet", "request.data");
      const internalRequest = copyRequest(request);
      internalRequest.collection = "GlobalOptionSetDefinitions";
      internalRequest.functionName = "createGlobalOptionSet";
      return this.create(internalRequest);
    };
    /**
     * Sends an asynchronous request to update a Global Option Set.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.updateGlobalOptionSet = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateGlobalOptionSet", "request");
      ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateGlobalOptionSet", "request.data");
      ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateGlobalOptionSet", "request.data.MetadataId");
      if (request.castType) {
        ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.updateGlobalOptionSet", "request.castType");
      }
      const internalRequest = copyRequest(request);
      internalRequest.collection = "GlobalOptionSetDefinitions";
      internalRequest.key = request.data.MetadataId;
      internalRequest.functionName = "updateGlobalOptionSet";
      internalRequest.method = "PUT";
      return this.update(internalRequest);
    };
    /**
     * Sends an asynchronous request to delete a Global Option Set.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.deleteGlobalOptionSet = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteGlobalOptionSet", "request");
      const internalRequest = copyRequest(request);
      internalRequest.collection = "GlobalOptionSetDefinitions";
      internalRequest.functionName = "deleteGlobalOptionSet";
      return this.deleteRecord(internalRequest);
    };
    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveGlobalOptionSet = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveGlobalOptionSet", "request");
      if (request.castType) {
        ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveGlobalOptionSet", "request.castType");
      }
      const internalRequest = copyRequest(request);
      internalRequest.collection = "GlobalOptionSetDefinitions";
      internalRequest.navigationProperty = request.castType;
      internalRequest.functionName = "retrieveGlobalOptionSet";
      return this.retrieve(internalRequest);
    };
    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveGlobalOptionSets = (request) => {
      const internalRequest = !request ? {} : copyRequest(request);
      internalRequest.collection = "GlobalOptionSetDefinitions";
      internalRequest.functionName = "retrieveGlobalOptionSets";
      if (request == null ? void 0 : request.castType) {
        ErrorHelper.stringParameterCheck(request.castType, "DynamicsWebApi.retrieveGlobalOptionSets", "request.castType");
        internalRequest.navigationProperty = request.castType;
      }
      return this.retrieveMultiple(internalRequest);
    };
    /**
     * Retrieves a CSDL Document Metadata
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<string>} A raw CSDL $metadata document.
     */
    this.retrieveCsdlMetadata = async (request) => {
      const internalRequest = !request ? {} : copyRequest(request);
      internalRequest.collection = "$metadata";
      internalRequest.functionName = "retrieveCsdlMetadata";
      if (request == null ? void 0 : request.addAnnotations) {
        ErrorHelper.boolParameterCheck(request.addAnnotations, "DynamicsWebApi.retrieveCsdlMetadata", "request.addAnnotations");
        internalRequest.includeAnnotations = "*";
      }
      const response = await __privateGet(this, _client).makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Provides a search results page.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<SearchResponse<TValue>>} Search result
     */
    this.search = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.search", "request");
      const _isObject = isObject(request);
      const parameterName = _isObject ? "request.query.search" : "term";
      const internalRequest = _isObject ? copyObject(request) : { query: { search: request } };
      ErrorHelper.parameterCheck(internalRequest.query, "DynamicsWebApi.search", "request.query");
      ErrorHelper.stringParameterCheck(internalRequest.query.search, "DynamicsWebApi.search", parameterName);
      ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, "DynamicsWebApi.search", parameterName, 100);
      internalRequest.collection = "query";
      internalRequest.functionName = "search";
      internalRequest.method = "POST";
      internalRequest.data = internalRequest.query;
      internalRequest.apiConfig = __privateGet(this, _client).config.searchApi;
      delete internalRequest.query;
      const response = await __privateGet(this, _client).makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Provides suggestions as the user enters text into a form field.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<SuggestResponse<TValueDocument>>} Suggestions result
     */
    this.suggest = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.suggest", "request");
      const _isObject = isObject(request);
      const parameterName = _isObject ? "request.query.search" : "term";
      const internalRequest = _isObject ? copyObject(request) : { query: { search: request } };
      ErrorHelper.parameterCheck(internalRequest.query, "DynamicsWebApi.suggest", "request.query");
      ErrorHelper.stringParameterCheck(internalRequest.query.search, "DynamicsWebApi.suggest", parameterName);
      ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, "DynamicsWebApi.suggest", parameterName, 100);
      internalRequest.functionName = internalRequest.collection = "suggest";
      internalRequest.method = "POST";
      internalRequest.data = internalRequest.query;
      internalRequest.apiConfig = __privateGet(this, _client).config.searchApi;
      delete internalRequest.query;
      const response = await __privateGet(this, _client).makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Provides autocompletion of input as the user enters text into a form field.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<AutocompleteResponse>} Result of autocomplete
     */
    this.autocomplete = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.autocomplete", "request");
      const _isObject = isObject(request);
      const parameterName = _isObject ? "request.query.search" : "term";
      const internalRequest = _isObject ? copyObject(request) : { query: { search: request } };
      if (_isObject) ErrorHelper.parameterCheck(internalRequest.query, "DynamicsWebApi.autocomplete", "request.query");
      ErrorHelper.stringParameterCheck(internalRequest.query.search, `DynamicsWebApi.autocomplete`, parameterName);
      ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, "DynamicsWebApi.autocomplete", parameterName, 100);
      internalRequest.functionName = internalRequest.collection = "autocomplete";
      internalRequest.method = "POST";
      internalRequest.data = internalRequest.query;
      internalRequest.apiConfig = __privateGet(this, _client).config.searchApi;
      delete internalRequest.query;
      const response = await __privateGet(this, _client).makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Starts/executes a batch request.
     */
    this.startBatch = () => {
      __privateGet(this, _client).isBatch = true;
      __privateGet(this, _client).batchRequestId = generateUUID();
    };
    /**
     * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.executeBatch = async (request) => {
      ErrorHelper.throwBatchNotStarted(__privateGet(this, _client).isBatch);
      const internalRequest = !request ? {} : copyRequest(request);
      internalRequest.collection = "$batch";
      internalRequest.method = "POST";
      internalRequest.functionName = "executeBatch";
      internalRequest.requestId = __privateGet(this, _client).batchRequestId;
      __privateGet(this, _client).batchRequestId = null;
      __privateGet(this, _client).isBatch = false;
      const response = await __privateGet(this, _client).makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Creates a new instance of DynamicsWebApi. If config is not provided, it is copied from a current instance.
     *
     * @param {Config} config configuration object.
     * @returns {DynamicsWebApi} A new instance of DynamicsWebApi
     */
    this.initializeInstance = (config) => new _DynamicsWebApi(config || __privateGet(this, _client).config);
    this.Utility = {
      /**
       * Searches for a collection name by provided entity name in a cached entity metadata.
       * The returned collection name can be null.
       *
       * @param {string} entityName entity name
       * @returns {string | null} collection name
       */
      getCollectionName: (entityName) => getCollectionName(entityName)
    };
    __privateSet(this, _client, new DataverseClient(config));
  }
};
_client = new WeakMap();
var DynamicsWebApi = _DynamicsWebApi;
export {
  DynamicsWebApi
};
//# sourceMappingURL=dynamics-web-api.mjs.map
