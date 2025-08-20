/*! dynamics-web-api v2.3.1 (c) 2025 Aleksandr Rogov. License: MIT */
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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
function getCrypto() {
  return import_node_crypto.default;
}
var import_node_crypto;
var init_node = __esm({
  "src/helpers/crypto/node.ts"() {
    "use strict";
    import_node_crypto = __toESM(require("crypto"));
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
function escapeSearchSpecialCharacters(value) {
  return value.replace(SEARCH_SPECIAL_CHARACTERS_REGEX, "\\$&");
}
function extractPreferCallbackUrl(value) {
  const match = PREFER_CALLBACK_URL_REGEX.exec(value);
  return match ? match[1] : null;
}
var UUID, UUID_REGEX, EXTRACT_UUID_REGEX, EXTRACT_UUID_FROM_URL_REGEX, REMOVE_BRACKETS_FROM_UUID_REGEX, ENTITY_UUID_REGEX, QUOTATION_MARK_REGEX, PAGING_COOKIE_REGEX, SPECIAL_CHARACTER_REGEX, LEADING_SLASH_REGEX, UNICODE_SYMBOLS_REGEX, DOUBLE_QUOTE_REGEX, BATCH_RESPONSE_HEADERS_REGEX, HTTP_STATUS_REGEX, CONTENT_TYPE_PLAIN_REGEX, ODATA_ENTITYID_REGEX, TEXT_REGEX, LINE_ENDING_REGEX, SEARCH_FOR_ENTITY_NAME_REGEX, SPECIAL_COLLECTION_FOR_UPDATE_REGEX, FETCH_XML_TOP_REGEX, FETCH_XML_PAGE_REGEX, FETCH_XML_REPLACE_REGEX, DATE_FORMAT_REGEX, SEARCH_SPECIAL_CHARACTERS_REGEX, PREFER_CALLBACK_URL_REGEX;
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
    SEARCH_SPECIAL_CHARACTERS_REGEX = /[+\-&|!(){}[\]^"~*?:\\\/]/g;
    PREFER_CALLBACK_URL_REGEX = /^odata\.callback;\s*url=["']?(.+?)["']?$/;
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
    if (responseHeaders["x-ms-dyn-backgroundoperationid"]) {
      result.backgroundOperationId = responseHeaders["x-ms-dyn-backgroundoperationid"];
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
      if (res.statusCode && (res.statusCode >= 200 && res.statusCode < 300 || res.statusCode === 304)) {
        let responseData = parseResponse(rawData, res.headers, responseParams[options.requestId]);
        let response = {
          data: responseData,
          headers: res.headers,
          status: res.statusCode
        };
        successCallback(response);
      } else {
        let crmError;
        try {
          var errorParsed = parseResponse(rawData, res.headers, responseParams[options.requestId]);
          if (Array.isArray(errorParsed)) {
            errorCallback(errorParsed);
            return;
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
var http, https, import_http_proxy_agent, import_https_proxy_agent, agents, getAgent;
var init_http = __esm({
  "src/client/http.ts"() {
    "use strict";
    http = __toESM(require("http"));
    https = __toESM(require("https"));
    import_http_proxy_agent = __toESM(require("http-proxy-agent"));
    import_https_proxy_agent = __toESM(require("https-proxy-agent"));
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
          const proxyAgent = isHttp ? import_http_proxy_agent.default.HttpProxyAgent : import_https_proxy_agent.default.HttpsProxyAgent;
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
var dynamics_web_api_exports = {};
__export(dynamics_web_api_exports, {
  DynamicsWebApi: () => DynamicsWebApi
});
module.exports = __toCommonJS(dynamics_web_api_exports);

// src/utils/Config.ts
init_Utility();
init_ErrorHelper();

// src/requests/constants.ts
var LIBRARY_NAME = "DynamicsWebApi";

// src/utils/Config.ts
var FUNCTION_NAME = `${LIBRARY_NAME}.setConfig`;
var apiConfigs = ["dataApi", "searchApi", "serviceApi"];
var getApiUrl = (serverUrl, apiConfig) => {
  if (isRunningWithinPortals()) {
    return new URL("_api", global.window.location.origin).toString() + "/";
  } else {
    if (!serverUrl) serverUrl = getClientUrl();
    let url = "api";
    if (apiConfig.path) {
      url += `/${apiConfig.path}`;
    }
    if (apiConfig.version) {
      url += `/v${apiConfig.version}`;
    }
    return new URL(url, serverUrl).toString() + "/";
  }
};
var mergeSearchApiOptions = (internalApiConfig, options) => {
  if (!options) return;
  if (options.escapeSpecialCharacters != null) {
    ErrorHelper.boolParameterCheck(options.escapeSpecialCharacters, FUNCTION_NAME, `config.searchApi.options.escapeSpecialCharacters`);
    internalApiConfig.escapeSpecialCharacters = options.escapeSpecialCharacters;
  }
  if (options.enableResponseCompatibility != null) {
    ErrorHelper.boolParameterCheck(options.enableResponseCompatibility, FUNCTION_NAME, `config.searchApi.options.enableResponseCompatibility`);
    internalApiConfig.enableSearchApiResponseCompatibility = options.enableResponseCompatibility;
  }
};
var mergeApiConfig = (internalConfig, apiType, config) => {
  const internalApiConfig = internalConfig[apiType];
  const apiConfig = config == null ? void 0 : config[apiType];
  if (apiConfig == null ? void 0 : apiConfig.version) {
    ErrorHelper.stringParameterCheck(apiConfig.version, FUNCTION_NAME, `config.${apiType}.version`);
    internalApiConfig.version = apiConfig.version;
  }
  if (apiConfig == null ? void 0 : apiConfig.path) {
    ErrorHelper.stringParameterCheck(apiConfig.path, FUNCTION_NAME, `config.${apiType}.path`);
    internalApiConfig.path = apiConfig.path;
  }
  if (apiType === "searchApi") {
    mergeSearchApiOptions(internalApiConfig, apiConfig == null ? void 0 : apiConfig.options);
  }
  internalApiConfig.url = getApiUrl(internalConfig.serverUrl, internalApiConfig);
};
function mergeConfig(internalConfig, config) {
  if (config == null ? void 0 : config.serverUrl) {
    ErrorHelper.stringParameterCheck(config.serverUrl, FUNCTION_NAME, "config.serverUrl");
    internalConfig.serverUrl = config.serverUrl;
  }
  apiConfigs.forEach((apiType) => {
    mergeApiConfig(internalConfig, apiType, config);
  });
  if (config == null ? void 0 : config.impersonate) {
    internalConfig.impersonate = ErrorHelper.guidParameterCheck(config.impersonate, FUNCTION_NAME, "config.impersonate");
  }
  if (config == null ? void 0 : config.impersonateAAD) {
    internalConfig.impersonateAAD = ErrorHelper.guidParameterCheck(config.impersonateAAD, FUNCTION_NAME, "config.impersonateAAD");
  }
  if (config == null ? void 0 : config.onTokenRefresh) {
    ErrorHelper.callbackParameterCheck(config.onTokenRefresh, FUNCTION_NAME, "config.onTokenRefresh");
    internalConfig.onTokenRefresh = config.onTokenRefresh;
  }
  if (config == null ? void 0 : config.includeAnnotations) {
    ErrorHelper.stringParameterCheck(config.includeAnnotations, FUNCTION_NAME, "config.includeAnnotations");
    internalConfig.includeAnnotations = config.includeAnnotations;
  }
  if (config == null ? void 0 : config.timeout) {
    ErrorHelper.numberParameterCheck(config.timeout, FUNCTION_NAME, "config.timeout");
    internalConfig.timeout = config.timeout;
  }
  if (config == null ? void 0 : config.maxPageSize) {
    ErrorHelper.numberParameterCheck(config.maxPageSize, FUNCTION_NAME, "config.maxPageSize");
    internalConfig.maxPageSize = config.maxPageSize;
  }
  if ((config == null ? void 0 : config.returnRepresentation) != null) {
    ErrorHelper.boolParameterCheck(config.returnRepresentation, FUNCTION_NAME, "config.returnRepresentation");
    internalConfig.returnRepresentation = config.returnRepresentation;
  }
  if ((config == null ? void 0 : config.useEntityNames) != null) {
    ErrorHelper.boolParameterCheck(config.useEntityNames, FUNCTION_NAME, "config.useEntityNames");
    internalConfig.useEntityNames = config.useEntityNames;
  }
  if (config == null ? void 0 : config.headers) {
    internalConfig.headers = config.headers;
  }
  if (config == null ? void 0 : config.proxy) {
    ErrorHelper.parameterCheck(config.proxy, FUNCTION_NAME, "config.proxy");
    if (config.proxy.url) {
      ErrorHelper.stringParameterCheck(config.proxy.url, FUNCTION_NAME, "config.proxy.url");
      if (config.proxy.auth) {
        ErrorHelper.parameterCheck(config.proxy.auth, FUNCTION_NAME, "config.proxy.auth");
        ErrorHelper.stringParameterCheck(config.proxy.auth.username, FUNCTION_NAME, "config.proxy.auth.username");
        ErrorHelper.stringParameterCheck(config.proxy.auth.password, FUNCTION_NAME, "config.proxy.auth.password");
      }
    }
    internalConfig.proxy = config.proxy;
  }
}
function defaultConfig() {
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
    },
    serviceApi: {
      url: ""
    }
  };
}

// src/client/RequestClient.ts
init_Utility();

// src/client/helpers/entityNameMapper.ts
init_Utility();
var entityNames = null;
var setEntityNames = (newEntityNames) => {
  entityNames = newEntityNames;
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

// src/client/helpers/executeRequest.ts
async function executeRequest2(options) {
  return false ? null.executeRequest(options) : (init_http(), __toCommonJS(http_exports)).executeRequest(options);
}

// src/client/RequestClient.ts
init_ErrorHelper();

// src/client/request/composers/url.ts
init_ErrorHelper();
init_Regex();
init_Utility();
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
    if (request.tag) {
      ErrorHelper.stringParameterCheck(request.tag, `DynamicsWebApi.${request.functionName}`, "request.tag");
      queryArray.push("tag=" + encodeURIComponent(request.tag));
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
    if (request.fetchXml) {
      ErrorHelper.stringParameterCheck(request.fetchXml, `DynamicsWebApi.${request.functionName}`, "request.fetchXml");
      queryArray.push("fetchXml=" + encodeURIComponent(request.fetchXml));
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
            expandConverted = `(${expandConverted})`;
          }
          expandQueryArray.push(property + expandConverted);
        }
        if (expandQueryArray.length) {
          queryArray.push("$expand=" + expandQueryArray.join(","));
        }
      }
    }
  }
  if (!queryArray.length) {
    return url;
  }
  if (joinSymbol === "&") {
    url += "?";
  }
  return url + queryArray.join(joinSymbol);
};

// src/client/request/composers/headers.ts
init_ErrorHelper();

// src/client/request/composers/preferHeader.ts
init_ErrorHelper();
init_Regex();
var composePreferHeader = (request, config) => {
  var _a2, _b2;
  const functionName = `DynamicsWebApi.${request.functionName}`;
  const options = {
    respondAsync: request.respondAsync,
    backgroundOperationCallbackUrl: request.backgroundOperationCallbackUrl ?? (config == null ? void 0 : config.backgroundOperationCallbackUrl),
    returnRepresentation: request.returnRepresentation ?? (config == null ? void 0 : config.returnRepresentation),
    includeAnnotations: request.includeAnnotations ?? (config == null ? void 0 : config.includeAnnotations),
    maxPageSize: request.maxPageSize ?? (config == null ? void 0 : config.maxPageSize),
    trackChanges: request.trackChanges,
    continueOnError: request.continueOnError
  };
  const prefer = /* @__PURE__ */ new Set();
  if ((_a2 = request.prefer) == null ? void 0 : _a2.length) {
    ErrorHelper.stringOrArrayParameterCheck(request.prefer, functionName, "request.prefer");
    const preferArray = typeof request.prefer === "string" ? request.prefer.split(",") : request.prefer;
    for (const item of preferArray) {
      const trimmedItem = item.trim();
      if (trimmedItem.includes("respond-async")) {
        options.respondAsync = true;
      } else if (trimmedItem.startsWith("odata.callback")) {
        options.backgroundOperationCallbackUrl = extractPreferCallbackUrl(trimmedItem);
      } else if (trimmedItem === "return=representation") {
        options.returnRepresentation = true;
      } else if (trimmedItem.includes("odata.include-annotations=")) {
        options.includeAnnotations = removeDoubleQuotes(trimmedItem.replace("odata.include-annotations=", ""));
      } else if (trimmedItem.startsWith("odata.maxpagesize=")) {
        options.maxPageSize = Number(removeDoubleQuotes(trimmedItem.replace("odata.maxpagesize=", ""))) || 0;
      } else if (trimmedItem.includes("odata.track-changes")) {
        options.trackChanges = true;
      } else if (trimmedItem.includes("odata.continue-on-error")) {
        options.continueOnError = true;
      } else {
        prefer.add(trimmedItem);
      }
    }
  }
  for (const key in options) {
    const optionFactory = preferOptionsFactory[key];
    if (optionFactory && options[key]) {
      (_b2 = optionFactory.validator) == null ? void 0 : _b2.call(optionFactory, options[key], functionName, `request.${key}`);
      if (optionFactory.condition(options[key], options)) {
        prefer.add(optionFactory.formatter(options[key], options));
      }
    }
  }
  return Array.from(prefer).join(",");
};
var preferOptionsFactory = {
  respondAsync: {
    validator: ErrorHelper.boolParameterCheck,
    condition: (value) => !!value,
    formatter: () => "respond-async"
  },
  backgroundOperationCallbackUrl: {
    validator: ErrorHelper.stringParameterCheck,
    condition: (value, options) => value && options.respondAsync,
    formatter: (url) => `odata.callback;url="${url}"`
  },
  returnRepresentation: {
    validator: ErrorHelper.boolParameterCheck,
    condition: (value) => !!value,
    formatter: () => "return=representation"
  },
  includeAnnotations: {
    validator: ErrorHelper.stringParameterCheck,
    condition: (value) => !!value,
    formatter: (annotations) => `odata.include-annotations="${annotations}"`
  },
  maxPageSize: {
    validator: (value, functionName) => value > 0 ? ErrorHelper.numberParameterCheck(value, functionName, "request.maxPageSize") : void 0,
    condition: (value) => value > 0,
    formatter: (size) => `odata.maxpagesize=${size}`
  },
  trackChanges: {
    validator: ErrorHelper.boolParameterCheck,
    condition: (value) => !!value,
    formatter: () => "odata.track-changes"
  },
  continueOnError: {
    validator: ErrorHelper.boolParameterCheck,
    condition: (value) => !!value,
    formatter: () => "odata.continue-on-error"
  }
};

// src/client/request/composers/headers.ts
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

// src/client/request/composers/request.ts
init_ErrorHelper();
var composeRequest = (request, config) => {
  request.path = "";
  request.functionName = request.functionName || "";
  if (!request.url) {
    if (!request._isUnboundRequest && !request.contentId && !request.collection) {
      ErrorHelper.parameterCheck(request.collection, `DynamicsWebApi.${request.functionName}`, "request.collection");
    }
    if (request.contentId) {
      ErrorHelper.stringParameterCheck(request.contentId, `DynamicsWebApi.${request.functionName}`, "request.contentId");
      if (request.contentId.startsWith("$")) {
        request.path = request.contentId;
      }
    }
    if (request.collection != null) {
      ErrorHelper.stringParameterCheck(request.collection, `DynamicsWebApi.${request.functionName}`, "request.collection");
      request.path += request.path ? `/${request.collection}` : request.collection;
      if (request.key) {
        request.key = ErrorHelper.keyParameterCheck(request.key, `DynamicsWebApi.${request.functionName}`, "request.key");
        request.path += `(${request.key})`;
      }
    }
    if (request.addPath) {
      if (request.path) {
        request.path += "/";
      }
      request.path += request.addPath;
    }
    request.path = composeUrl(request, config, request.path);
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

// src/client/request/processData.ts
init_Regex();
init_Utility();

// src/client/helpers/index.ts
init_dateReviver();
init_parseBatchResponse();
init_parseResponse();

// src/client/request/processData.ts
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

// src/client/request/setStandardHeaders.ts
var setStandardHeaders = (headers = {}, data) => {
  if (!headers["Accept"]) headers["Accept"] = "application/json";
  if (!headers["OData-MaxVersion"]) headers["OData-MaxVersion"] = "4.0";
  if (!headers["OData-Version"]) headers["OData-Version"] = "4.0";
  if (headers["Content-Range"]) headers["Content-Type"] = "application/octet-stream";
  else if (!headers["Content-Type"] && data) headers["Content-Type"] = "application/json; charset=utf-8";
  return headers;
};

// src/client/request/convertToBatch.ts
init_Utility();
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
      batchBody.push(`\r
--${currentChangeSet}--`);
      currentChangeSet = null;
      contentId = 1e5;
    }
    if (!currentChangeSet) {
      batchBody.push(`\r
--${batchBoundary}`);
      if (inChangeSet) {
        currentChangeSet = `changeset_${generateUUID()}`;
        batchBody.push("Content-Type: multipart/mixed;boundary=" + currentChangeSet);
      }
    }
    if (inChangeSet) {
      batchBody.push(`\r
--${currentChangeSet}`);
    }
    batchBody.push("Content-Type: application/http");
    batchBody.push("Content-Transfer-Encoding: binary");
    if (inChangeSet) {
      const contentIdValue = internalRequest.headers.hasOwnProperty("Content-ID") ? internalRequest.headers["Content-ID"] : ++contentId;
      batchBody.push(`Content-ID: ${contentIdValue}`);
    }
    if (!((_a2 = internalRequest.path) == null ? void 0 : _a2.startsWith("$"))) {
      batchBody.push(`\r
${internalRequest.method} ${config.dataApi.url}${internalRequest.path} HTTP/1.1`);
    } else {
      batchBody.push(`\r
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
      batchBody.push(`\r
${processData(internalRequest.data, config)}`);
    }
  });
  if (currentChangeSet) {
    batchBody.push(`\r
--${currentChangeSet}--`);
  }
  batchBody.push(`\r
--${batchBoundary}--\r
`);
  const headers = setStandardHeaders(batchRequest == null ? void 0 : batchRequest.userHeaders, batchRequest == null ? void 0 : batchRequest.data);
  headers["Content-Type"] = `multipart/mixed;boundary=${batchBoundary}`;
  return { headers, body: batchBody.join("\r\n") };
};

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
  const request = composeRequest(
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
    if (!isBatchConverted && request.includeDefaultDataverseHeaders !== false) {
      request.headers = setStandardHeaders(request.headers, request.data);
    }
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
    composeRequest(request, config);
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
  composeRequest(request, config);
  _addResponseParams(request.requestId, request.responseParameters);
  _addRequestToBatchCollection(request.requestId, request);
};
var getCollectionName = (entityName) => {
  return findCollectionName(entityName);
};

// src/client/dataverse.ts
var _config, _isBatch, _batchRequestId;
var DataverseClient = class {
  constructor(config) {
    __privateAdd(this, _config, defaultConfig());
    __privateAdd(this, _isBatch, false);
    __privateAdd(this, _batchRequestId, null);
    this.setConfig = (config) => mergeConfig(__privateGet(this, _config), config);
    this.makeRequest = (request) => {
      request.isBatch = __privateGet(this, _isBatch);
      if (__privateGet(this, _batchRequestId)) request.requestId = __privateGet(this, _batchRequestId);
      return makeRequest(request, __privateGet(this, _config));
    };
    mergeConfig(__privateGet(this, _config), config);
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

// src/requests/associate.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME2 = "associate";
var REQUEST_NAME = `${LIBRARY_NAME}.${FUNCTION_NAME2}`;
var associate = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME, "request");
  ErrorHelper.parameterCheck(request.relatedKey, REQUEST_NAME, "request.relatedKey");
  ErrorHelper.stringParameterCheck(request.relationshipName, REQUEST_NAME, "request.relationshipName");
  let relatedKey = request.relatedKey;
  let odataId = request.relatedKey;
  if (!client.isBatch || client.isBatch && !request.relatedKey.startsWith("$")) {
    ErrorHelper.stringParameterCheck(request.relatedCollection, REQUEST_NAME, "request.relatedCollection");
    relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, REQUEST_NAME, "request.relatedKey");
    odataId = `${request.relatedCollection}(${relatedKey})`;
  }
  let internalRequest = copyRequest(request, ["primaryKey"]);
  internalRequest.method = "POST";
  internalRequest.functionName = FUNCTION_NAME2;
  internalRequest.navigationProperty = request.relationshipName + "/$ref";
  internalRequest.key = request.primaryKey;
  internalRequest.data = { "@odata.id": odataId };
  await client.makeRequest(internalRequest);
};

// src/requests/associateSingleValued.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME3 = "associateSingleValued";
var REQUEST_NAME2 = `${LIBRARY_NAME}.${FUNCTION_NAME3}`;
var associateSingleValued = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME2, "request");
  ErrorHelper.parameterCheck(request.relatedKey, REQUEST_NAME2, "request.relatedKey");
  ErrorHelper.stringParameterCheck(request.navigationProperty, REQUEST_NAME2, "request.navigationProperty");
  let relatedKey = request.relatedKey;
  let odataId = request.relatedKey;
  if (!client.isBatch || client.isBatch && !request.relatedKey.startsWith("$")) {
    ErrorHelper.stringParameterCheck(request.relatedCollection, REQUEST_NAME2, "request.relatedCollection");
    relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, REQUEST_NAME2, "request.relatedKey");
    odataId = `${request.relatedCollection}(${relatedKey})`;
  }
  let internalRequest = copyRequest(request, ["primaryKey"]);
  internalRequest.method = "PUT";
  internalRequest.functionName = FUNCTION_NAME3;
  internalRequest.navigationProperty += "/$ref";
  internalRequest.key = request.primaryKey;
  internalRequest.data = { "@odata.id": odataId };
  await client.makeRequest(internalRequest);
};

// src/requests/callAction.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME4 = "callAction";
var REQUEST_NAME3 = `${LIBRARY_NAME}.${FUNCTION_NAME4}`;
var callAction = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME3, "request");
  ErrorHelper.stringParameterCheck(request.actionName, REQUEST_NAME3, "request.actionName");
  const internalRequest = copyRequest(request, ["action"]);
  internalRequest.method = "POST";
  internalRequest.functionName = FUNCTION_NAME4;
  internalRequest.addPath = request.actionName;
  internalRequest._isUnboundRequest = !internalRequest.collection;
  internalRequest.data = request.action;
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
};

// src/requests/callFunction.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME5 = "callFunction";
var REQUEST_NAME4 = `${LIBRARY_NAME}.${FUNCTION_NAME5}`;
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
  internalRequest.functionName = FUNCTION_NAME5;
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
};

// src/requests/create.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME6 = "create";
var REQUEST_NAME5 = `${LIBRARY_NAME}.${FUNCTION_NAME6}`;
var create = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME5, "request");
  let internalRequest;
  if (!request.functionName) {
    internalRequest = copyRequest(request);
    internalRequest.functionName = FUNCTION_NAME6;
  } else internalRequest = request;
  internalRequest.method = "POST";
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
};

// src/requests/count.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME7 = "count";
var REQUEST_NAME6 = `${LIBRARY_NAME}.${FUNCTION_NAME7}`;
var count = async (request, client) => {
  var _a2;
  ErrorHelper.parameterCheck(request, REQUEST_NAME6, "request");
  const internalRequest = copyRequest(request);
  internalRequest.method = "GET";
  internalRequest.functionName = FUNCTION_NAME7;
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
var FUNCTION_NAME8 = "retrieveMultiple";
var REQUEST_NAME7 = `${LIBRARY_NAME}.${FUNCTION_NAME8}`;
var retrieveMultiple = async (request, client, nextPageLink) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME7, "request");
  let internalRequest;
  if (!request.functionName) {
    internalRequest = copyRequest(request);
    internalRequest.functionName = FUNCTION_NAME8;
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
var FUNCTION_NAME9 = "retrieveAll";
var REQUEST_NAME8 = `${LIBRARY_NAME}.${FUNCTION_NAME9}`;
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
var FUNCTION_NAME10 = "countAll";
var REQUEST_NAME9 = `${LIBRARY_NAME}.${FUNCTION_NAME10}`;
var countAll = async (request, client) => {
  ErrorHelper.throwBatchIncompatible(REQUEST_NAME9, client.isBatch);
  ErrorHelper.parameterCheck(request, REQUEST_NAME9, "request");
  const response = await retrieveAllRequest(request, client);
  return response.value.length;
};

// src/requests/disassociate.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME11 = "disassociate";
var REQUEST_NAME10 = `${LIBRARY_NAME}.${FUNCTION_NAME11}`;
var disassociate = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME10, "request");
  let internalRequest = copyRequest(request);
  internalRequest.method = "DELETE";
  internalRequest.functionName = FUNCTION_NAME11;
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
var FUNCTION_NAME12 = "disassociateSingleValued";
var REQUEST_NAME11 = `${LIBRARY_NAME}.${FUNCTION_NAME12}`;
var disassociateSingleValued = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME11, "request");
  let internalRequest = copyRequest(request);
  internalRequest.method = "DELETE";
  internalRequest.functionName = FUNCTION_NAME12;
  ErrorHelper.stringParameterCheck(request.navigationProperty, REQUEST_NAME11, "request.navigationProperty");
  const primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, REQUEST_NAME11, "request.primaryKey");
  internalRequest.navigationProperty += "/$ref";
  internalRequest.key = primaryKey;
  await client.makeRequest(internalRequest);
};

// src/requests/retrieve.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME13 = "retrieve";
var REQUEST_NAME12 = `${LIBRARY_NAME}.${FUNCTION_NAME13}`;
var retrieve = async (request, client) => {
  var _a2;
  ErrorHelper.parameterCheck(request, REQUEST_NAME12, "request");
  let internalRequest;
  if (!request.functionName) {
    internalRequest = copyRequest(request);
    internalRequest.functionName = FUNCTION_NAME13;
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
var FUNCTION_NAME14 = "fetch";
var REQUEST_NAME13 = `${LIBRARY_NAME}.${FUNCTION_NAME14}`;
var fetchXml = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME13, "request");
  const internalRequest = copyRequest(request);
  internalRequest.method = "GET";
  internalRequest.functionName = FUNCTION_NAME14;
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
var FUNCTION_NAME15 = "fetchAll";
var REQUEST_NAME14 = `${LIBRARY_NAME}.${FUNCTION_NAME15}`;
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
var FUNCTION_NAME16 = "update";
var REQUEST_NAME15 = `${LIBRARY_NAME}.${FUNCTION_NAME16}`;
var update = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME15, "request");
  let internalRequest;
  if (!request.functionName) {
    internalRequest = copyRequest(request);
    internalRequest.functionName = FUNCTION_NAME16;
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
var FUNCTION_NAME17 = "updateSingleProperty";
var REQUEST_NAME16 = `${LIBRARY_NAME}.${FUNCTION_NAME17}`;
var updateSingleProperty = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME16, "request");
  ErrorHelper.parameterCheck(request.fieldValuePair, REQUEST_NAME16, "request.fieldValuePair");
  var field = Object.keys(request.fieldValuePair)[0];
  var fieldValue = request.fieldValuePair[field];
  const internalRequest = copyRequest(request);
  internalRequest.navigationProperty = field;
  internalRequest.data = { value: fieldValue };
  internalRequest.functionName = FUNCTION_NAME17;
  internalRequest.method = "PUT";
  delete internalRequest["fieldValuePair"];
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
};

// src/requests/upsert.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME18 = "upsert";
var REQUEST_NAME17 = `${LIBRARY_NAME}.${FUNCTION_NAME18}`;
var upsert = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME17, "request");
  const internalRequest = copyRequest(request);
  internalRequest.method = "PATCH";
  internalRequest.functionName = FUNCTION_NAME18;
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
var FUNCTION_NAME19 = "deleteRecord";
var REQUEST_NAME18 = `${LIBRARY_NAME}.${FUNCTION_NAME19}`;
var deleteRecord = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME18, "request");
  let internalRequest;
  if (!request.functionName) {
    internalRequest = copyRequest(request);
    internalRequest.functionName = FUNCTION_NAME19;
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
var FUNCTION_NAME20 = "uploadFile";
var REQUEST_NAME19 = `${LIBRARY_NAME}.${FUNCTION_NAME20}`;
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
  internalRequest.functionName = FUNCTION_NAME20;
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
var FUNCTION_NAME21 = "downloadFile";
var REQUEST_NAME20 = `${LIBRARY_NAME}.${FUNCTION_NAME21}`;
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
  internalRequest.functionName = FUNCTION_NAME21;
  internalRequest.responseParameters = { parse: true };
  return downloadFileChunk(internalRequest, client);
};

// src/requests/executeBatch.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME22 = "executeBatch";
var REQUEST_NAME21 = `${LIBRARY_NAME}.${FUNCTION_NAME22}`;
async function executeBatch(request, client) {
  ErrorHelper.throwBatchNotStarted(client.isBatch);
  const internalRequest = !request ? {} : copyRequest(request);
  internalRequest.collection = "$batch";
  internalRequest.method = "POST";
  internalRequest.functionName = REQUEST_NAME21;
  internalRequest.requestId = client.batchRequestId;
  client.batchRequestId = null;
  client.isBatch = false;
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
}
function startBatch(client) {
  client.isBatch = true;
  client.batchRequestId = generateUUID();
}

// src/requests/metadata/createEntity.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME23 = "createEntity";
var REQUEST_NAME22 = `${LIBRARY_NAME}.${FUNCTION_NAME23}`;
var createEntity = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME22, "request");
  ErrorHelper.parameterCheck(request.data, REQUEST_NAME22, "request.data");
  const internalRequest = copyRequest(request);
  internalRequest.collection = "EntityDefinitions";
  internalRequest.functionName = FUNCTION_NAME23;
  return create(internalRequest, client);
};

// src/requests/metadata/updateEntity.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME24 = "updateEntity";
var REQUEST_NAME23 = `${LIBRARY_NAME}.${FUNCTION_NAME24}`;
var updateEntity = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME23, "request");
  ErrorHelper.parameterCheck(request.data, REQUEST_NAME23, "request.data");
  const internalRequest = copyRequest(request);
  internalRequest.collection = "EntityDefinitions";
  internalRequest.functionName = FUNCTION_NAME24;
  internalRequest.key = internalRequest.data.MetadataId;
  internalRequest.method = "PUT";
  return await update(internalRequest, client);
};

// src/requests/metadata/retrieveEntity.ts
init_ErrorHelper();
init_Utility();
var FUNCTION_NAME25 = "retrieveEntity";
var REQUEST_NAME24 = `${LIBRARY_NAME}.${FUNCTION_NAME25}`;
var retrieveEntity = async (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME24, "request");
  ErrorHelper.keyParameterCheck(request.key, REQUEST_NAME24, "request.key");
  const internalRequest = copyRequest(request);
  internalRequest.collection = "EntityDefinitions";
  internalRequest.functionName = "retrieveEntity";
  return await retrieve(internalRequest, client);
};

// src/requests/metadata/retrieveEntities.ts
init_Utility();
var FUNCTION_NAME26 = "retrieveEntities";
var retrieveEntities = (client, request) => {
  const internalRequest = !request ? {} : copyRequest(request);
  internalRequest.collection = "EntityDefinitions";
  internalRequest.functionName = FUNCTION_NAME26;
  return retrieveMultiple(internalRequest, client);
};

// src/requests/metadata/createAttribute.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME27 = "createAttribute";
var REQUEST_NAME25 = `${LIBRARY_NAME}.${FUNCTION_NAME27}`;
var createAttribute = (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME25, "request");
  ErrorHelper.parameterCheck(request.data, REQUEST_NAME25, "request.data");
  ErrorHelper.keyParameterCheck(request.entityKey, REQUEST_NAME25, "request.entityKey");
  const internalRequest = copyRequest(request);
  internalRequest.collection = "EntityDefinitions";
  internalRequest.functionName = FUNCTION_NAME27;
  internalRequest.navigationProperty = "Attributes";
  internalRequest.key = request.entityKey;
  return create(internalRequest, client);
};

// src/requests/metadata/updateAttribute.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME28 = "updateAttribute";
var REQUEST_NAME26 = `${LIBRARY_NAME}.${FUNCTION_NAME28}`;
var updateAttribute = (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME26, "request");
  ErrorHelper.parameterCheck(request.data, REQUEST_NAME26, "request.data");
  ErrorHelper.keyParameterCheck(request.entityKey, REQUEST_NAME26, "request.entityKey");
  ErrorHelper.guidParameterCheck(request.data.MetadataId, REQUEST_NAME26, "request.data.MetadataId");
  const internalRequest = copyRequest(request);
  internalRequest.collection = "EntityDefinitions";
  internalRequest.functionName = FUNCTION_NAME28;
  internalRequest.navigationProperty = "Attributes";
  internalRequest.navigationPropertyKey = request.data.MetadataId;
  internalRequest.metadataAttributeType = request.castType;
  internalRequest.key = request.entityKey;
  internalRequest.method = "PUT";
  return update(internalRequest, client);
};

// src/requests/metadata/retrieveAttributes.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME29 = "retrieveAttributes";
var REQUEST_NAME27 = `${LIBRARY_NAME}.${FUNCTION_NAME29}`;
var retrieveAttributes = (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME27, "request");
  ErrorHelper.keyParameterCheck(request.entityKey, REQUEST_NAME27, "request.entityKey");
  if (request.castType) {
    ErrorHelper.stringParameterCheck(request.castType, REQUEST_NAME27, "request.castType");
  }
  const internalRequest = copyRequest(request);
  internalRequest.collection = "EntityDefinitions";
  internalRequest.functionName = FUNCTION_NAME29;
  internalRequest.navigationProperty = "Attributes";
  internalRequest.key = request.entityKey;
  internalRequest.metadataAttributeType = request.castType;
  return retrieveMultiple(internalRequest, client);
};

// src/requests/metadata/retrieveAttribute.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME30 = "retrieveAttributes";
var REQUEST_NAME28 = `${LIBRARY_NAME}.${FUNCTION_NAME30}`;
var retrieveAttribute = (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME28, "request");
  ErrorHelper.keyParameterCheck(request.entityKey, REQUEST_NAME28, "request.entityKey");
  ErrorHelper.keyParameterCheck(request.attributeKey, REQUEST_NAME28, "request.attributeKey");
  if (request.castType) {
    ErrorHelper.stringParameterCheck(request.castType, REQUEST_NAME28, "request.castType");
  }
  const internalRequest = copyRequest(request);
  internalRequest.collection = "EntityDefinitions";
  internalRequest.navigationProperty = "Attributes";
  internalRequest.navigationPropertyKey = request.attributeKey;
  internalRequest.metadataAttributeType = request.castType;
  internalRequest.key = request.entityKey;
  internalRequest.functionName = FUNCTION_NAME30;
  return retrieve(internalRequest, client);
};

// src/requests/metadata/createRelationship.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME31 = "createRelationship";
var REQUEST_NAME29 = `${LIBRARY_NAME}.${FUNCTION_NAME31}`;
var createRelationship = (request, client) => {
  ErrorHelper.parameterCheck(request, REQUEST_NAME29, "request");
  ErrorHelper.parameterCheck(request.data, REQUEST_NAME29, "request.data");
  const internalRequest = copyRequest(request);
  internalRequest.collection = "RelationshipDefinitions";
  internalRequest.functionName = FUNCTION_NAME31;
  return create(internalRequest, client);
};

// src/requests/metadata/updateRelationship.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME32 = "updateRelationship";
var REQUEST_NAME30 = `${LIBRARY_NAME}.${FUNCTION_NAME32}`;
function updateRelationship(request, client) {
  ErrorHelper.parameterCheck(request, REQUEST_NAME30, "request");
  ErrorHelper.parameterCheck(request.data, REQUEST_NAME30, "request.data");
  ErrorHelper.guidParameterCheck(request.data.MetadataId, REQUEST_NAME30, "request.data.MetadataId");
  if (request.castType) {
    ErrorHelper.stringParameterCheck(request.castType, REQUEST_NAME30, "request.castType");
  }
  const internalRequest = copyRequest(request);
  internalRequest.collection = "RelationshipDefinitions";
  internalRequest.key = request.data.MetadataId;
  internalRequest.navigationProperty = request.castType;
  internalRequest.functionName = FUNCTION_NAME32;
  internalRequest.method = "PUT";
  return update(internalRequest, client);
}

// src/requests/metadata/deleteRelationship.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME33 = "deleteRelationship";
var REQUEST_NAME31 = `${LIBRARY_NAME}.${FUNCTION_NAME33}`;
async function deleteRelationship(request, client) {
  ErrorHelper.parameterCheck(request, REQUEST_NAME31, "request");
  ErrorHelper.keyParameterCheck(request.key, REQUEST_NAME31, "request.key");
  const internalRequest = copyRequest(request);
  internalRequest.collection = "RelationshipDefinitions";
  internalRequest.functionName = FUNCTION_NAME33;
  return deleteRecord(internalRequest, client);
}

// src/requests/metadata/retrieveRelationships.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME34 = "retrieveRelationships";
var REQUEST_NAME32 = `DynamicsWebApi.${FUNCTION_NAME34}`;
async function retrieveRelationships(request, client) {
  const internalRequest = !request ? {} : copyRequest(request);
  internalRequest.collection = "RelationshipDefinitions";
  internalRequest.functionName = FUNCTION_NAME34;
  if (request) {
    if (request.castType) {
      ErrorHelper.stringParameterCheck(request.castType, REQUEST_NAME32, "request.castType");
      internalRequest.navigationProperty = request.castType;
    }
  }
  return retrieveMultiple(internalRequest, client);
}

// src/requests/metadata/retrieveRelationship.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME35 = "retrieveRelationship";
var REQUEST_NAME33 = `DynamicsWebApi.${FUNCTION_NAME35}`;
async function retrieveRelationship(request, client) {
  ErrorHelper.parameterCheck(request, REQUEST_NAME33, "request");
  ErrorHelper.keyParameterCheck(request.key, REQUEST_NAME33, "request.key");
  if (request.castType) {
    ErrorHelper.stringParameterCheck(request.castType, REQUEST_NAME33, "request.castType");
  }
  const internalRequest = copyRequest(request);
  internalRequest.collection = "RelationshipDefinitions";
  internalRequest.navigationProperty = request.castType;
  internalRequest.functionName = FUNCTION_NAME35;
  return retrieve(internalRequest, client);
}

// src/requests/metadata/createGlobalOptionSet.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME36 = "createGlobalOptionSet";
var REQUEST_NAME34 = `DynamicsWebApi.${FUNCTION_NAME36}`;
async function createGlobalOptionSet(request, client) {
  ErrorHelper.parameterCheck(request, REQUEST_NAME34, "request");
  ErrorHelper.parameterCheck(request.data, REQUEST_NAME34, "request.data");
  const internalRequest = copyRequest(request);
  internalRequest.collection = "GlobalOptionSetDefinitions";
  internalRequest.functionName = FUNCTION_NAME36;
  return create(internalRequest, client);
}

// src/requests/metadata/updateGlobalOptionSet.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME37 = "updateGlobalOptionSet";
var REQUEST_NAME35 = `DynamicsWebApi.${FUNCTION_NAME37}`;
async function updateGlobalOptionSet(request, client) {
  ErrorHelper.parameterCheck(request, REQUEST_NAME35, "request");
  ErrorHelper.parameterCheck(request.data, REQUEST_NAME35, "request.data");
  ErrorHelper.guidParameterCheck(request.data.MetadataId, REQUEST_NAME35, "request.data.MetadataId");
  if (request.castType) {
    ErrorHelper.stringParameterCheck(request.castType, REQUEST_NAME35, "request.castType");
  }
  const internalRequest = copyRequest(request);
  internalRequest.collection = "GlobalOptionSetDefinitions";
  internalRequest.key = request.data.MetadataId;
  internalRequest.functionName = FUNCTION_NAME37;
  internalRequest.method = "PUT";
  return update(internalRequest, client);
}

// src/requests/metadata/deleteGlobalOptionSet.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME38 = "deleteGlobalOptionSet";
var REQUEST_NAME36 = `DynamicsWebApi.${FUNCTION_NAME38}`;
async function deleteGlobalOptionSet(request, client) {
  ErrorHelper.parameterCheck(request, REQUEST_NAME36, "request");
  const internalRequest = copyRequest(request);
  internalRequest.collection = "GlobalOptionSetDefinitions";
  internalRequest.functionName = FUNCTION_NAME38;
  return deleteRecord(internalRequest, client);
}

// src/requests/metadata/retrieveGlobalOptionSet.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME39 = "retrieveGlobalOptionSet";
var REQUEST_NAME37 = `DynamicsWebApi.${FUNCTION_NAME39}`;
async function retrieveGlobalOptionSet(request, client) {
  ErrorHelper.parameterCheck(request, REQUEST_NAME37, "request");
  if (request.castType) {
    ErrorHelper.stringParameterCheck(request.castType, REQUEST_NAME37, "request.castType");
  }
  const internalRequest = copyRequest(request);
  internalRequest.collection = "GlobalOptionSetDefinitions";
  internalRequest.navigationProperty = request.castType;
  internalRequest.functionName = FUNCTION_NAME39;
  return retrieve(internalRequest, client);
}

// src/requests/metadata/retrieveGlobalOptionSets.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME40 = "retrieveGlobalOptionSets";
var REQUEST_NAME38 = `DynamicsWebApi.${FUNCTION_NAME40}`;
async function retrieveGlobalOptionSets(request, client) {
  const internalRequest = !request ? {} : copyRequest(request);
  internalRequest.collection = "GlobalOptionSetDefinitions";
  internalRequest.functionName = FUNCTION_NAME40;
  if (request == null ? void 0 : request.castType) {
    ErrorHelper.stringParameterCheck(request.castType, REQUEST_NAME38, "request.castType");
    internalRequest.navigationProperty = request.castType;
  }
  return retrieveMultiple(internalRequest, client);
}

// src/requests/metadata/retrieveCsdlMetadata.ts
init_Utility();
init_ErrorHelper();
var FUNCTION_NAME41 = "retrieveCsdlMetadata";
var REQUEST_NAME39 = `DynamicsWebApi.${FUNCTION_NAME41}`;
async function retrieveCsdlMetadata(request, client) {
  const internalRequest = !request ? {} : copyRequest(request);
  internalRequest.collection = "$metadata";
  internalRequest.functionName = FUNCTION_NAME41;
  if (request == null ? void 0 : request.addAnnotations) {
    ErrorHelper.boolParameterCheck(request.addAnnotations, REQUEST_NAME39, "request.addAnnotations");
    internalRequest.includeAnnotations = "*";
  }
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
}

// src/requests/search/query.ts
init_Utility();
init_ErrorHelper();

// src/requests/search/convertSearchQuery.ts
init_Regex();
function convertSearchQuery(query2, functionName, config) {
  var _a2;
  if (!query2) return query2;
  if ((config == null ? void 0 : config.escapeSpecialCharacters) === true) {
    query2.search = escapeSearchSpecialCharacters(query2.search);
  }
  if ((_a2 = query2.entities) == null ? void 0 : _a2.length) {
    query2.entities = convertEntitiesProperty(query2.entities, config == null ? void 0 : config.version);
  }
  switch (functionName) {
    case "query":
      convertQuery(query2, config == null ? void 0 : config.version);
      break;
    default:
      convertSuggestOrAutocompleteQuery(query2, config == null ? void 0 : config.version);
      break;
  }
  return query2;
}
function convertEntitiesProperty(entities, version = "1.0") {
  if (!entities) return entities;
  if (typeof entities === "string") {
    if (version !== "1.0") return entities;
    try {
      entities = JSON.parse(entities);
    } catch {
      throw new Error("The 'query.entities' property must be a valid JSON string.");
    }
    if (!Array.isArray(entities)) {
      throw new Error("The 'query.entities' property must be an array of strings or objects.");
    }
  }
  const toStringArray = (entity) => {
    if (typeof entity === "string") return entity;
    return entity.name;
  };
  const toSearchEntity = (entity) => {
    if (typeof entity === "string") return { name: entity };
    return entity;
  };
  const toReturn = entities.map((entity) => version === "1.0" ? toStringArray(entity) : toSearchEntity(entity));
  if (version !== "1.0") return JSON.stringify(toReturn);
  return toReturn;
}
function convertQuery(query2, version = "1.0") {
  const toV1 = (query3) => {
    if (query3.count != null) {
      if (query3.returnTotalRecordCount == null) {
        query3.returnTotalRecordCount = query3.count;
      }
      delete query3.count;
    }
    if (query3.options) {
      if (typeof query3.options === "string") {
        try {
          query3.options = JSON.parse(query3.options, searchOptionsReviver);
        } catch {
          throw new Error("The 'query.options' property must be a valid JSON string.");
        }
      }
      if (!query3.searchMode) {
        query3.searchMode = query3.options.searchMode;
      }
      if (!query3.searchType) {
        query3.searchType = query3.options.queryType === "lucene" ? "full" : query3.options.queryType;
      }
      delete query3.options;
    }
    for (const prop of specialProperties) {
      if (query3[prop] && typeof query3[prop] === "string") {
        try {
          query3[prop] = JSON.parse(query3[prop]);
        } catch {
          throw new Error(`The 'query.${prop}' property must be a valid JSON string.`);
        }
      }
    }
  };
  const toV2 = (query3) => {
    if (query3.returnTotalRecordCount != null) {
      if (query3.count == null) {
        query3.count = query3.returnTotalRecordCount;
      }
      delete query3.returnTotalRecordCount;
    }
    if (query3.searchMode || query3.searchType) {
      if (typeof query3.options !== "string") {
        if (!query3.options) query3.options = {};
        if (!query3.options.searchMode) {
          query3.options.searchMode = query3.searchMode;
        }
        if (!query3.options.queryType) {
          query3.options.queryType = query3.searchType === "full" ? "lucene" : query3.searchType;
        }
      }
      delete query3.searchMode;
      delete query3.searchType;
    }
    if (query3.orderBy && typeof query3.orderBy !== "string") {
      query3.orderby = JSON.stringify(query3.orderBy);
      delete query3.orderBy;
    }
    if (query3.facets && typeof query3.facets !== "string") {
      query3.facets = JSON.stringify(query3.facets);
    }
    if (query3.options && typeof query3.options !== "string") {
      query3.options = JSON.stringify(convertOptionKeysToLowerCase(query3.options));
    }
  };
  version === "1.0" ? toV1(query2) : toV2(query2);
}
function convertSuggestOrAutocompleteQuery(query2, version = "1.0") {
  const toV1 = (query3) => {
    if (query3.fuzzy != null) {
      if (query3.useFuzzy == null) {
        query3.useFuzzy = query3.fuzzy;
      }
      delete query3.fuzzy;
    }
    delete query3.options;
    if (query3.orderBy && typeof query3.orderBy === "string") {
      try {
        query3.orderBy = JSON.parse(query3.orderBy);
      } catch {
        throw new Error(`The 'query.orderBy' property must be a valid JSON string.`);
      }
    }
  };
  const toV2 = (query3) => {
    if (query3.useFuzzy != null) {
      if (query3.fuzzy == null) {
        query3.fuzzy = query3.useFuzzy;
      }
      delete query3.useFuzzy;
    }
    if (query3.orderBy && typeof query3.orderBy !== "string") {
      query3.orderby = JSON.stringify(query3.orderBy);
      delete query3.orderBy;
    }
    if (query3.options && typeof query3.options !== "string") {
      query3.options = JSON.stringify(convertOptionKeysToLowerCase(query3.options));
    }
  };
  version === "1.0" ? toV1(query2) : toV2(query2);
}
function convertOptionKeysToLowerCase(options) {
  const newOptions = {};
  for (const key in options) {
    newOptions[key.toLowerCase()] = options[key];
  }
  return newOptions;
}
function searchOptionsReviver(key, value) {
  switch (key) {
    case "searchmode":
      this.searchMode = value;
      break;
    case "querytype":
      this.queryType = value;
      break;
    default:
      return value;
  }
}
var specialProperties = ["orderBy", "facets"];

// src/requests/search/responseParsers/parseQueryResponse.ts
function parseQueryResponse(queryResponse, config) {
  if (!queryResponse) return queryResponse;
  const toV1 = () => {
    const responseValue = JSON.parse(queryResponse.response, dateReviver);
    const toReturn = {
      ...queryResponse,
      response: responseValue
    };
    if (config.enableSearchApiResponseCompatibility) {
      toReturn.value = responseValue.Value;
      toReturn.facets = responseValue.Facets;
      toReturn.totalrecordcount = responseValue.Count;
      toReturn.querycontext = responseValue.QueryContext;
    }
    return toReturn;
  };
  const toV2 = () => {
    const toReturn = {
      ...queryResponse
    };
    if (config.enableSearchApiResponseCompatibility) {
      toReturn.response = {
        Count: queryResponse.totalrecordcount,
        Value: queryResponse.value,
        Facets: queryResponse.facets,
        QueryContext: queryResponse.querycontext,
        Error: null
      };
    }
    return toReturn;
  };
  return (config == null ? void 0 : config.version) === "2.0" ? toV1() : toV2();
}

// src/requests/search/query.ts
var FUNCTION_NAME42 = "query";
var REQUEST_NAME40 = `${LIBRARY_NAME}.${FUNCTION_NAME42}`;
async function query(request, client) {
  ErrorHelper.parameterCheck(request, REQUEST_NAME40, "request");
  const _isObject = typeof request !== "string";
  const parameterName = _isObject ? "request.query.search" : "term";
  const internalRequest = _isObject ? copyObject(request) : { query: { search: request } };
  ErrorHelper.parameterCheck(internalRequest.query, REQUEST_NAME40, "request.query");
  ErrorHelper.stringParameterCheck(internalRequest.query.search, REQUEST_NAME40, parameterName);
  ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, REQUEST_NAME40, parameterName, 100);
  internalRequest.collection = "query";
  internalRequest.functionName = FUNCTION_NAME42;
  internalRequest.method = "POST";
  internalRequest.data = convertSearchQuery(internalRequest.query, FUNCTION_NAME42, client.config.searchApi);
  internalRequest.apiConfig = client.config.searchApi;
  delete internalRequest.query;
  const response = await client.makeRequest(internalRequest);
  return parseQueryResponse(response.data, client.config.searchApi);
}

// src/requests/search/suggest.ts
init_Utility();
init_ErrorHelper();

// src/requests/search/responseParsers/parseSuggestResponse.ts
function parseSuggestResponse(queryResponse, config) {
  if (!queryResponse) return queryResponse;
  const toV1 = () => {
    var _a2;
    const responseValue = JSON.parse(queryResponse.response, dateReviver);
    if (config.enableSearchApiResponseCompatibility) {
      (_a2 = responseValue.Value) == null ? void 0 : _a2.forEach((item) => {
        item.document = item.Document;
        item.text = item.Text;
      });
    }
    const toReturn = {
      ...queryResponse,
      response: responseValue
    };
    if (config.enableSearchApiResponseCompatibility) {
      toReturn.value = responseValue.Value;
      toReturn.querycontext = responseValue.QueryContext;
    }
    return toReturn;
  };
  const toV2 = () => {
    var _a2;
    if (config.enableSearchApiResponseCompatibility) {
      (_a2 = queryResponse.value) == null ? void 0 : _a2.forEach((item) => {
        item.Document = item.document;
        item.Text = item.text;
      });
    }
    const toReturn = {
      ...queryResponse
    };
    if (config.enableSearchApiResponseCompatibility) {
      toReturn.response = {
        Value: queryResponse.value,
        QueryContext: queryResponse.querycontext,
        Error: null
      };
    }
    return toReturn;
  };
  return (config == null ? void 0 : config.version) === "2.0" ? toV1() : toV2();
}

// src/requests/search/suggest.ts
var FUNCTION_NAME43 = "suggest";
var REQUEST_NAME41 = `${LIBRARY_NAME}.${FUNCTION_NAME43}`;
async function suggest(request, client) {
  ErrorHelper.parameterCheck(request, REQUEST_NAME41, "request");
  const _isObject = typeof request !== "string";
  const parameterName = _isObject ? "request.query.search" : "term";
  const internalRequest = _isObject ? copyObject(request) : { query: { search: request } };
  ErrorHelper.parameterCheck(internalRequest.query, REQUEST_NAME41, "request.query");
  ErrorHelper.stringParameterCheck(internalRequest.query.search, REQUEST_NAME41, parameterName);
  ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, REQUEST_NAME41, parameterName, 100);
  internalRequest.functionName = internalRequest.collection = FUNCTION_NAME43;
  internalRequest.method = "POST";
  internalRequest.data = convertSearchQuery(internalRequest.query, FUNCTION_NAME43, client.config.searchApi);
  internalRequest.apiConfig = client.config.searchApi;
  delete internalRequest.query;
  const response = await client.makeRequest(internalRequest);
  return parseSuggestResponse(response.data, client.config.searchApi);
}

// src/requests/search/autocomplete.ts
init_Utility();
init_ErrorHelper();

// src/requests/search/responseParsers/parseAutocompleteResponse.ts
function parseAutocompleteResponse(queryResponse, config) {
  if (!queryResponse) return queryResponse;
  const toV1 = () => {
    const responseValue = JSON.parse(queryResponse.response, dateReviver);
    const toReturn = {
      ...queryResponse,
      response: responseValue
    };
    if (config.enableSearchApiResponseCompatibility) {
      toReturn.value = responseValue.Value;
      toReturn.querycontext = responseValue.QueryContext;
    }
    return toReturn;
  };
  const toV2 = () => {
    const toReturn = {
      ...queryResponse
    };
    if (config.enableSearchApiResponseCompatibility) {
      toReturn.response = {
        Value: queryResponse.value,
        QueryContext: queryResponse.querycontext,
        Error: null
      };
    }
    return toReturn;
  };
  return (config == null ? void 0 : config.version) === "2.0" ? toV1() : toV2();
}

// src/requests/search/autocomplete.ts
var FUNCTION_NAME44 = "autocomplete";
var REQUEST_NAME42 = `${LIBRARY_NAME}.${FUNCTION_NAME44}`;
async function autocomplete(request, client) {
  ErrorHelper.parameterCheck(request, REQUEST_NAME42, "request");
  const _isObject = typeof request !== "string";
  const parameterName = _isObject ? "request.query.search" : "term";
  const internalRequest = _isObject ? copyObject(request) : { query: { search: request } };
  if (_isObject) ErrorHelper.parameterCheck(internalRequest.query, REQUEST_NAME42, "request.query");
  ErrorHelper.stringParameterCheck(internalRequest.query.search, REQUEST_NAME42, parameterName);
  ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, REQUEST_NAME42, parameterName, 100);
  internalRequest.functionName = internalRequest.collection = FUNCTION_NAME44;
  internalRequest.method = "POST";
  internalRequest.data = convertSearchQuery(internalRequest.query, FUNCTION_NAME44, client.config.searchApi);
  internalRequest.apiConfig = client.config.searchApi;
  delete internalRequest.query;
  const response = await client.makeRequest(internalRequest);
  return parseAutocompleteResponse(response.data, client.config.searchApi);
}

// src/requests/backgroundOperation/getStatus.ts
init_ErrorHelper();
var FUNCTION_NAME45 = "getBackgroundOperationStatus";
var REQUEST_NAME43 = `${LIBRARY_NAME}.${FUNCTION_NAME45}`;
async function getBackgroundOperationStatus(backgroundOperationId, client) {
  ErrorHelper.throwBatchIncompatible(REQUEST_NAME43, client.isBatch);
  ErrorHelper.keyParameterCheck(backgroundOperationId, REQUEST_NAME43, "backgroundOperationId");
  const internalRequest = {
    method: "GET",
    addPath: `backgroundoperation/${backgroundOperationId}`,
    functionName: FUNCTION_NAME45,
    apiConfig: client.config.serviceApi,
    includeDefaultDataverseHeaders: false,
    headers: {
      "Content-Type": "application/json"
    },
    //todo: need to get rid of this parameter somehow
    _isUnboundRequest: true
  };
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
}

// src/requests/backgroundOperation/cancel.ts
init_ErrorHelper();
var FUNCTION_NAME46 = "cancelBackgroundOperation";
var REQUEST_NAME44 = `${LIBRARY_NAME}.${FUNCTION_NAME46}`;
async function cancelBackgroundOperation(backgroundOperationId, client) {
  ErrorHelper.throwBatchIncompatible(REQUEST_NAME44, client.isBatch);
  ErrorHelper.keyParameterCheck(backgroundOperationId, REQUEST_NAME44, "backgroundOperationId");
  const internalRequest = {
    method: "DELETE",
    addPath: `backgroundoperation/${backgroundOperationId}`,
    functionName: FUNCTION_NAME46,
    apiConfig: client.config.serviceApi,
    includeDefaultDataverseHeaders: false,
    headers: {
      "Content-Type": "application/json"
    },
    _isUnboundRequest: true
  };
  const response = await client.makeRequest(internalRequest);
  return response == null ? void 0 : response.data;
}

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
     * @template TData - Type of the data to be created.
     * @template TResponse - Type of the response to be returned.
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
     * @template TResponse - Type of the response to be returned.
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
     * @template TData - Type of the data to be created.
     * @template TResponse - Type of the response to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.update = async (request) => update(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the response to be returned.
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
     * @template TData - Type of the data to be created.
     * @template TResponse - Type of the response to be returned.
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
     * @template TValue - Type of the item returned in the "value" array.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveMultiple = async (request, nextPageLink) => retrieveMultiple(request, __privateGet(this, _client), nextPageLink);
    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveAll = (request) => retrieveAll(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system.
     * It is limited by the maximum number of entities that can be returned. Returns: Number
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
     * @template TValue - Type of the item returned in the "value" array.
     * @returns {Promise} D365 Web Api Response
     */
    this.fetch = async (request) => fetchXml(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
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
     * @template TResponse - Type of the response to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.callFunction = async (request) => callFunction(request, __privateGet(this, _client));
    /**
     * Calls a Web API action
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the response to be returned.
     * @template TAction - Type of the action to be executed.
     * @returns {Promise} D365 Web Api Response
     */
    this.callAction = async (request) => callAction(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to create an entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.createEntity = (request) => createEntity(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to update an entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.updateEntity = (request) => updateEntity(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to retrieve a specific entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveEntity = (request) => retrieveEntity(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to retrieve entity definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveEntities = (request) => retrieveEntities(__privateGet(this, _client), request);
    /**
     * Sends an asynchronous request to create an attribute.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.createAttribute = (request) => createAttribute(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to update an attribute.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.updateAttribute = (request) => updateAttribute(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to retrieve attribute metadata for a specified entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveAttributes = (request) => retrieveAttributes(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to retrieve a specific attribute metadata for a specified entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveAttribute = (request) => retrieveAttribute(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to create a relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.createRelationship = (request) => createRelationship(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to update a relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.updateRelationship = (request) => updateRelationship(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to delete a relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.deleteRelationship = (request) => deleteRelationship(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to retrieve relationship definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveRelationships = (request) => retrieveRelationships(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to retrieve a specific relationship definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveRelationship = (request) => retrieveRelationship(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to create a Global Option Set definition
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.createGlobalOptionSet = (request) => createGlobalOptionSet(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to update a Global Option Set.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.updateGlobalOptionSet = (request) => updateGlobalOptionSet(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to delete a Global Option Set.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.deleteGlobalOptionSet = (request) => deleteGlobalOptionSet(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TResponse - Type of the metadata to be returned.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveGlobalOptionSet = (request) => retrieveGlobalOptionSet(request, __privateGet(this, _client));
    /**
     * Sends an asynchronous request to retrieve Global Option Set definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @template TValue - Type of the item returned in the "value" array.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveGlobalOptionSets = (request) => retrieveGlobalOptionSets(request, __privateGet(this, _client));
    /**
     * Retrieves a CSDL Document Metadata
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<string>} A raw CSDL $metadata document.
     */
    this.retrieveCsdlMetadata = async (request) => retrieveCsdlMetadata(request, __privateGet(this, _client));
    /**
     * @deprecated Use "query" instead.
     * Provides a search results page.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<SearchResponse<TValue>>} Search result.
     */
    this.search = async (request) => (
      //@ts-ignore Ignoring the type error issue, because SearchFunction is deprecated and it will return what needs to return with a conversion.
      query(request, __privateGet(this, _client))
    );
    /**
     * The query operation returns search results based on a search term.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<QueryResponse>} Query result.
     */
    this.query = async (request) => query(request, __privateGet(this, _client));
    /**
     * Provides suggestions as the user enters text into a form field.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<SuggestResponse<TValueDocument>>} Suggestions result.
     */
    this.suggest = async (request) => suggest(request, __privateGet(this, _client));
    /**
     * Provides autocompletion of input as the user enters text into a form field.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<AutocompleteResponse>} Result of an autocomplete.
     */
    this.autocomplete = async (request) => autocomplete(request, __privateGet(this, _client));
    /**
     * Sends a request to the status monitor resource.
     * @param backgroundOperationId - The ID of the background operation.
     * @returns {Promise<BackgroundOperationStatusResponse>} Background operation status.
     */
    this.getBackgroundOperationStatus = async (backgroundOperationId) => getBackgroundOperationStatus(backgroundOperationId, __privateGet(this, _client));
    /**
     * Cancels a background operation via the status monitor resource.
     * @param backgroundOperationId - The ID of the background operation.
     * @returns {Promise<BackgroundOperationStatusResponse>} Background operation status.
     */
    this.cancelBackgroundOperation = async (backgroundOperationId) => cancelBackgroundOperation(backgroundOperationId, __privateGet(this, _client));
    /**
     * Starts a batch request.
     */
    this.startBatch = () => startBatch(__privateGet(this, _client));
    /**
     * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.executeBatch = async (request) => executeBatch(request, __privateGet(this, _client));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DynamicsWebApi
});
//# sourceMappingURL=dynamics-web-api.js.map
