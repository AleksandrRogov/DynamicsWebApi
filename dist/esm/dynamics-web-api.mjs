/*! dynamics-web-api v2.1.0 (c) 2023 Aleksandr Rogov */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
function generateRandomBytes() {
  return false ? getCrypto2().getRandomValues(new Uint8Array(1)) : getCrypto2().randomBytes(1);
}
var init_Crypto = __esm({
  "src/helpers/Crypto.ts"() {
    "use strict";
  }
});

// src/helpers/Regex.ts
function isUuid(value) {
  const match = new RegExp(uuid, "i").exec(value);
  return !!match;
}
function extractUuid(value) {
  const match = new RegExp("^{?(" + uuid + ")}?$", "i").exec(value);
  return match ? match[1] : null;
}
function extractUuidFromUrl(url2) {
  const match = new RegExp("(" + uuid + ")\\)$", "i").exec(url2);
  return match ? match[1] : null;
}
var uuid;
var init_Regex = __esm({
  "src/helpers/Regex.ts"() {
    "use strict";
    uuid = "[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}";
  }
});

// src/utils/Utility.ts
var downloadChunkSize, _Utility, Utility;
var init_Utility = __esm({
  "src/utils/Utility.ts"() {
    "use strict";
    init_Crypto();
    init_Regex();
    downloadChunkSize = 4194304;
    _Utility = class _Utility {
      /**
       * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
       *
       * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
       * @returns {string}
       */
      static buildFunctionParameters(parameters) {
        if (parameters) {
          const parameterNames = Object.keys(parameters);
          let functionParameters = "";
          let urlQuery = "";
          for (var i = 1; i <= parameterNames.length; i++) {
            const parameterName = parameterNames[i - 1];
            let value = parameters[parameterName];
            if (value == null)
              continue;
            if (typeof value === "string" && !value.startsWith("Microsoft.Dynamics.CRM") && !isUuid(value)) {
              value = "'" + value + "'";
            } else if (typeof value === "object") {
              value = JSON.stringify(value);
            }
            if (i > 1) {
              functionParameters += ",";
              urlQuery += "&";
            }
            functionParameters += parameterName + "=@p" + i;
            urlQuery += "@p" + i + "=" + (extractUuid(value) || value);
          }
          if (urlQuery)
            urlQuery = "?" + urlQuery;
          return "(" + functionParameters + ")" + urlQuery;
        } else {
          return "()";
        }
      }
      /**
       * Parses a paging cookie returned in response
       *
       * @param {string} pageCookies - Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.
       * @param {number} currentPageNumber - A current page number. Fix empty paging-cookie for complex fetch xmls.
       * @returns {{cookie: "", number: 0, next: 1}}
       */
      static getFetchXmlPagingCookie(pageCookies = "", currentPageNumber = 1) {
        pageCookies = decodeURIComponent(decodeURIComponent(pageCookies));
        const info = /pagingcookie="(<cookie page="(\d+)".+<\/cookie>)/.exec(pageCookies);
        if (info != null) {
          let page = parseInt(info[2]);
          return {
            cookie: info[1].replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "'").replace(/\'/g, "&quot;"),
            page,
            nextPage: page + 1
          };
        } else {
          return {
            cookie: "",
            page: currentPageNumber,
            nextPage: currentPageNumber + 1
          };
        }
      }
      /**
       * Converts a response to a reference object
       *
       * @param {Object} responseData - Response object
       * @returns {ReferenceObject}
       */
      static convertToReferenceObject(responseData) {
        const result = /\/(\w+)\(([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})/i.exec(responseData["@odata.id"]);
        return { id: result[2], collection: result[1], oDataContext: responseData["@odata.context"] };
      }
      /**
       * Checks whether the value is JS Null.
       * @param {Object} value
       * @returns {boolean}
       */
      static isNull(value) {
        return typeof value === "undefined" || value == null;
      }
      /** Generates UUID */
      static generateUUID() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ generateRandomBytes()[0] & 15 >> c / 4).toString(16));
      }
      static getXrmContext() {
        if (typeof GetGlobalContext !== "undefined") {
          return GetGlobalContext();
        } else {
          if (typeof Xrm !== "undefined") {
            if (!_Utility.isNull(Xrm.Utility) && !_Utility.isNull(Xrm.Utility.getGlobalContext)) {
              return Xrm.Utility.getGlobalContext();
            } else if (!_Utility.isNull(Xrm.Page) && !_Utility.isNull(Xrm.Page.context)) {
              return Xrm.Page.context;
            }
          }
        }
        throw new Error(
          "Xrm Context is not available. In most cases, it can be resolved by adding a reference to a ClientGlobalContext.js.aspx. Please refer to MSDN documentation for more details."
        );
      }
      // static getXrmUtility(): any {
      //     return typeof Xrm !== "undefined" ? Xrm.Utility : null;
      // }
      static getClientUrl() {
        const context = _Utility.getXrmContext();
        let clientUrl = context.getClientUrl();
        if (clientUrl.match(/\/$/)) {
          clientUrl = clientUrl.substring(0, clientUrl.length - 1);
        }
        return clientUrl;
      }
      /**
       * Checks whether the app is currently running in a Dynamics Portals Environment.
       *
       * In that case we switch to the Web API for Dynamics Portals.
       * @returns {boolean}
       */
      static isRunningWithinPortals() {
        return false ? !!global.window.shell : false;
      }
      static isObject(obj) {
        return typeof obj === "object" && !!obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== "[object Date]";
      }
      static copyObject(src, excludeProps) {
        let target = {};
        for (let prop in src) {
          if (src.hasOwnProperty(prop) && !(excludeProps == null ? void 0 : excludeProps.includes(prop))) {
            if (_Utility.isObject(src[prop])) {
              target[prop] = _Utility.copyObject(src[prop]);
            } else if (Array.isArray(src[prop])) {
              target[prop] = src[prop].slice();
            } else {
              target[prop] = src[prop];
            }
          }
        }
        return target;
      }
      static copyRequest(src, excludeProps = []) {
        if (!excludeProps.includes("signal"))
          excludeProps.push("signal");
        const result = _Utility.copyObject(src, excludeProps);
        result.signal = src.signal;
        return result;
      }
      static setFileChunk(request, fileBuffer, chunkSize, offset) {
        offset = offset || 0;
        const count = offset + chunkSize > fileBuffer.length ? fileBuffer.length % chunkSize : chunkSize;
        let content;
        if (false) {
          content = new Uint8Array(count);
          for (let i = 0; i < count; i++) {
            content[i] = fileBuffer[offset + i];
          }
        } else {
          content = fileBuffer.slice(offset, offset + count);
        }
        request.data = content;
        request.contentRange = "bytes " + offset + "-" + (offset + count - 1) + "/" + fileBuffer.length;
      }
      static convertToFileBuffer(binaryString) {
        if (true)
          return Buffer.from(binaryString, "binary");
        const bytes = new Uint8Array(binaryString.length);
        for (var i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      }
    };
    // static isNodeEnv = isNodeEnv;
    _Utility.downloadChunkSize = downloadChunkSize;
    Utility = _Utility;
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
        if (!parameter)
          return;
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
        if (!match)
          throwParameterError(functionName, parameterName, "GUID String");
        return match;
      }
      static keyParameterCheck(parameter, functionName, parameterName) {
        try {
          _ErrorHelper.stringParameterCheck(parameter, functionName, parameterName);
          const match = extractUuid(parameter);
          if (match)
            return match;
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
    const a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:Z|[-+]\d{2}:\d{2})$/.exec(value);
    if (a) {
      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
    }
  }
  return value;
}
var init_dateReviver = __esm({
  "src/client/helpers/dateReviver.ts"() {
    "use strict";
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
      return Utility.convertToReferenceObject(object);
    }
    if (parseParams.toCount) {
      return getFormattedKeyValue("@odata.count", object["@odata.count"])[1] || 0;
    }
  }
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];
    if (object[currentKey] != null) {
      if (object[currentKey].constructor === Array) {
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
      object.PagingInfo = Utility.getFetchXmlPagingCookie(object["@" + DWA.Prefer.Annotations.FetchXmlPagingCookie], parseParams.pageNumber);
    }
  }
  return object;
}
function parseBatchHeaders(text) {
  const ctx = { position: 0 };
  const headers = {};
  let parts;
  let line;
  let pos;
  do {
    pos = ctx.position;
    line = readLine(text, ctx);
    parts = responseHeaderRegex.exec(line);
    if (parts !== null) {
      headers[parts[1].toLowerCase()] = parts[2];
    } else {
      ctx.position = pos;
    }
  } while (line && parts);
  return headers;
}
function readLine(text, ctx) {
  return readTo(text, ctx, "\r\n");
}
function readTo(text, ctx, str) {
  const start = ctx.position || 0;
  let end = text.length;
  if (str) {
    end = text.indexOf(str, start);
    if (end === -1) {
      return null;
    }
    ctx.position = end + str.length;
  } else {
    ctx.position = end;
  }
  return text.substring(start, end);
}
function parseBatchResponse(response, parseParams, requestNumber = 0) {
  const delimiter = response.substr(0, response.indexOf("\r\n"));
  const batchResponseParts = response.split(delimiter);
  batchResponseParts.shift();
  batchResponseParts.pop();
  let result = [];
  for (let i = 0; i < batchResponseParts.length; i++) {
    let batchResponse = batchResponseParts[i];
    if (batchResponse.indexOf("--changesetresponse_") > -1) {
      batchResponse = batchResponse.trim();
      const batchToProcess = batchResponse.substring(batchResponse.indexOf("\r\n") + 1).trim();
      result = result.concat(parseBatchResponse(batchToProcess, parseParams, requestNumber));
    } else {
      const httpStatusReg = /HTTP\/?\s*[\d.]*\s+(\d{3})\s+([\w\s]*)$/gm.exec(batchResponse);
      const httpStatus = parseInt(httpStatusReg[1]);
      const httpStatusMessage = httpStatusReg[2].trim();
      const responseData = batchResponse.substring(batchResponse.indexOf("{"), batchResponse.lastIndexOf("}") + 1);
      if (!responseData) {
        if (/Content-Type: text\/plain/i.test(batchResponse)) {
          const plainContentReg = /\w+$/gi.exec(batchResponse.trim());
          const plainContent = plainContentReg && plainContentReg.length ? plainContentReg[0] : void 0;
          result.push(isNaN(Number(plainContent)) ? plainContent : Number(plainContent));
        } else {
          if (parseParams.length && parseParams[requestNumber] && parseParams[requestNumber].hasOwnProperty("valueIfEmpty")) {
            result.push(parseParams[requestNumber].valueIfEmpty);
          } else {
            const entityUrl = /OData-EntityId.+/i.exec(batchResponse);
            if (entityUrl && entityUrl.length) {
              const guidResult = extractUuidFromUrl(entityUrl[0]);
              result.push(guidResult ? guidResult : void 0);
            } else {
              result.push(void 0);
            }
          }
        }
      } else {
        const parsedResponse = parseData(JSON.parse(responseData, dateReviver), parseParams[requestNumber]);
        if (httpStatus >= 400) {
          const responseHeaders = parseBatchHeaders(
            //todo: add error handler for httpStatusReg; remove "!" operator
            batchResponse.substring(batchResponse.indexOf(httpStatusReg[0]) + httpStatusReg[0].length + 1, batchResponse.indexOf("{"))
          );
          result.push(
            ErrorHelper.handleHttpError(parsedResponse, {
              status: httpStatus,
              statusText: httpStatusMessage,
              statusMessage: httpStatusMessage,
              headers: responseHeaders
            })
          );
        } else {
          result.push(parsedResponse);
        }
      }
    }
    requestNumber++;
  }
  return result;
}
function base64ToString(base64) {
  return false ? global.window.atob(base64) : Buffer.from(base64, "base64").toString("binary");
}
function parseFileResponse(response, responseHeaders, parseParams) {
  let data = response;
  if (parseParams.hasOwnProperty("parse")) {
    data = JSON.parse(data).value;
    data = base64ToString(data);
  }
  var parseResult = {
    value: data
  };
  if (responseHeaders["x-ms-file-name"])
    parseResult.fileName = responseHeaders["x-ms-file-name"];
  if (responseHeaders["x-ms-file-size"])
    parseResult.fileSize = parseInt(responseHeaders["x-ms-file-size"]);
  if (hasHeader(responseHeaders, "Location"))
    parseResult.location = getHeader(responseHeaders, "Location");
  return parseResult;
}
function hasHeader(headers, name) {
  return headers.hasOwnProperty(name) || headers.hasOwnProperty(name.toLowerCase());
}
function getHeader(headers, name) {
  if (headers[name])
    return headers[name];
  return headers[name.toLowerCase()];
}
function parseResponse(response, responseHeaders, parseParams) {
  let parseResult = void 0;
  if (response.length) {
    if (response.indexOf("--batchresponse_") > -1) {
      const batch = parseBatchResponse(response, parseParams);
      parseResult = parseParams.length === 1 && parseParams[0].convertedToBatch ? batch[0] : batch;
    } else {
      if (hasHeader(responseHeaders, "Content-Disposition")) {
        parseResult = parseFileResponse(response, responseHeaders, parseParams[0]);
      } else {
        const contentType = getHeader(responseHeaders, "Content-Type");
        if (contentType.startsWith("application/json")) {
          parseResult = parseData(JSON.parse(response, dateReviver), parseParams[0]);
        } else {
          parseResult = isNaN(Number(response)) ? response : Number(response);
        }
      }
    }
  } else {
    if (parseParams.length && parseParams[0].hasOwnProperty("valueIfEmpty")) {
      parseResult = parseParams[0].valueIfEmpty;
    } else if (hasHeader(responseHeaders, "OData-EntityId")) {
      const entityUrl = getHeader(responseHeaders, "OData-EntityId");
      const guidResult = extractUuidFromUrl(entityUrl);
      if (guidResult) {
        parseResult = guidResult;
      }
    } else if (hasHeader(responseHeaders, "Location")) {
      parseResult = {
        location: getHeader(responseHeaders, "Location")
      };
      if (responseHeaders["x-ms-chunk-size"])
        parseResult.chunkSize = parseInt(responseHeaders["x-ms-chunk-size"]);
    }
  }
  return parseResult;
}
var responseHeaderRegex;
var init_parseResponse = __esm({
  "src/client/helpers/parseResponse.ts"() {
    "use strict";
    init_dwa();
    init_Utility();
    init_ErrorHelper();
    init_dateReviver();
    init_Regex();
    responseHeaderRegex = /^([^()<>@,;:\\"\/[\]?={} \t]+)\s?:\s?(.*)/;
  }
});

// src/client/http.ts
var http_exports = {};
__export(http_exports, {
  executeRequest: () => executeRequest
});
import * as http from "http";
import * as https from "https";
import * as url from "url";
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
  const additionalHeaders = options.additionalHeaders;
  const responseParams = options.responseParams;
  const signal = options.abortSignal;
  const headers = {};
  if (data) {
    headers["Content-Type"] = additionalHeaders["Content-Type"];
    headers["Content-Length"] = data.length;
    delete additionalHeaders["Content-Type"];
  }
  for (let key in additionalHeaders) {
    headers[key] = additionalHeaders[key];
  }
  const parsedUrl = url.parse(options.uri);
  const protocol = ((_a2 = parsedUrl.protocol) == null ? void 0 : _a2.slice(0, -1)) || "https";
  const protocolInterface = protocol === "http" ? http : https;
  const internalOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.path,
    method: options.method,
    timeout: options.timeout || 0,
    headers,
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
    if (hostHeader)
      headers.host = hostHeader;
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
        case 201:
        case 204:
        case 206:
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
          if (proxy.auth)
            proxyOptions.auth = proxy.auth.username + ":" + proxy.auth.password;
          else if (parsedProxyUrl.username && parsedProxyUrl.password)
            proxyOptions.auth = `${parsedProxyUrl.username}:${parsedProxyUrl.password}`;
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

// src/utils/Config.ts
init_Utility();
init_ErrorHelper();
var getApiUrl = (serverUrl, apiConfig) => {
  if (Utility.isRunningWithinPortals()) {
    return `${global.window.location.origin}/_api/`;
  } else {
    if (!serverUrl)
      serverUrl = Utility.getClientUrl();
    return `${serverUrl}/api/${apiConfig.path}/v${apiConfig.version}/`;
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

// src/dynamics-web-api.ts
init_Utility();
init_ErrorHelper();

// src/client/RequestClient.ts
init_Utility();

// src/utils/Request.ts
init_Utility();
init_ErrorHelper();
var _RequestUtility = class _RequestUtility {
  /**
   * Converts a request object to URL link
   *
   * @param {Object} request - Request object
   * @param {Object} [config] - DynamicsWebApi config
   * @returns {ConvertedRequest} Converted request
   */
  static compose(request, config) {
    request.path = request.path || "";
    request.functionName = request.functionName || "";
    if (!request.url) {
      if (!request._isUnboundRequest && !request.collection) {
        ErrorHelper.parameterCheck(request.collection, `DynamicsWebApi.${request.functionName}`, "request.collection");
      }
      if (request.collection != null) {
        ErrorHelper.stringParameterCheck(request.collection, `DynamicsWebApi.${request.functionName}`, "request.collection");
        request.path = request.collection;
        if (request.contentId) {
          ErrorHelper.stringParameterCheck(request.contentId, `DynamicsWebApi.${request.functionName}`, "request.contentId");
          if (request.contentId.startsWith("$")) {
            request.path = `${request.contentId}/${request.path}`;
          }
        }
        if (request.key) {
          request.key = ErrorHelper.keyParameterCheck(request.key, `DynamicsWebApi.${request.functionName}`, "request.key");
          request.path += `(${request.key})`;
        }
      }
      if (request._additionalUrl) {
        if (request.path) {
          request.path += "/";
        }
        request.path += request._additionalUrl;
      }
      request.path = _RequestUtility.composeUrl(request, config, request.path);
      if (request.fetchXml) {
        ErrorHelper.stringParameterCheck(request.fetchXml, `DynamicsWebApi.${request.functionName}`, "request.fetchXml");
        let join = request.path.indexOf("?") === -1 ? "?" : "&";
        request.path += `${join}fetchXml=${encodeURIComponent(request.fetchXml)}`;
      }
    } else {
      ErrorHelper.stringParameterCheck(request.url, `DynamicsWebApi.${request.functionName}`, "request.url");
      request.path = request.url.replace(config.dataApi.url, "");
      request.path = _RequestUtility.composeUrl(request, config, request.path);
    }
    if (request.hasOwnProperty("async") && request.async != null) {
      ErrorHelper.boolParameterCheck(request.async, `DynamicsWebApi.${request.functionName}`, "request.async");
    } else {
      request.async = true;
    }
    request.headers = _RequestUtility.composeHeaders(request, config);
    return request;
  }
  /**
   * Converts optional parameters of the request to URL. If expand parameter exists this function is called recursively.
   *
   * @param {Object} request - Request object
   * @param {string} request.functionName - Name of the function that converts a request (for Error Handling)
   * @param {string} url - URL beginning (with required parameters)
   * @param {string} [joinSymbol] - URL beginning (with required parameters)
   * @param {Object} [config] - DynamicsWebApi config
   * @returns {ConvertedRequestOptions} Additional options in request
   */
  static composeUrl(request, config, url2 = "", joinSymbol = "&") {
    var _a2, _b2, _c;
    const queryArray = [];
    if (request) {
      if (request.navigationProperty) {
        ErrorHelper.stringParameterCheck(request.navigationProperty, `DynamicsWebApi.${request.functionName}`, "request.navigationProperty");
        url2 += "/" + request.navigationProperty;
        if (request.navigationPropertyKey) {
          let navigationKey = ErrorHelper.keyParameterCheck(
            request.navigationPropertyKey,
            `DynamicsWebApi.${request.functionName}`,
            "request.navigationPropertyKey"
          );
          url2 += "(" + navigationKey + ")";
        }
        if (request.navigationProperty === "Attributes") {
          if (request.metadataAttributeType) {
            ErrorHelper.stringParameterCheck(
              request.metadataAttributeType,
              `DynamicsWebApi.${request.functionName}`,
              "request.metadataAttributeType"
            );
            url2 += "/" + request.metadataAttributeType;
          }
        }
      }
      if ((_a2 = request.select) == null ? void 0 : _a2.length) {
        ErrorHelper.arrayParameterCheck(request.select, `DynamicsWebApi.${request.functionName}`, "request.select");
        if (request.functionName == "retrieve" && request.select.length == 1 && request.select[0].endsWith("/$ref")) {
          url2 += "/" + request.select[0];
        } else {
          if (request.select[0].startsWith("/") && request.functionName == "retrieve") {
            if (request.navigationProperty == null) {
              url2 += request.select.shift();
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
        const removeBracketsFromGuidReg = /[^"']{([\w\d]{8}[-]?(?:[\w\d]{4}[-]?){3}[\w\d]{12})}(?:[^"']|$)/g;
        let filterResult = request.filter;
        let m = null;
        while ((m = removeBracketsFromGuidReg.exec(filterResult)) !== null) {
          if (m.index === removeBracketsFromGuidReg.lastIndex) {
            removeBracketsFromGuidReg.lastIndex++;
          }
          let replacement = m[0].endsWith(")") ? ")" : " ";
          filterResult = filterResult.replace(m[0], " " + m[1] + replacement);
        }
        queryArray.push("$filter=" + encodeURIComponent(filterResult));
      }
      if (request.fieldName) {
        ErrorHelper.stringParameterCheck(request.fieldName, `DynamicsWebApi.${request.functionName}`, "request.fieldName");
        url2 += "/" + request.fieldName;
      }
      if (request.savedQuery) {
        queryArray.push(
          "savedQuery=" + ErrorHelper.guidParameterCheck(request.savedQuery, `DynamicsWebApi.${request.functionName}`, "request.savedQuery")
        );
      }
      if (request.userQuery) {
        queryArray.push(
          "userQuery=" + ErrorHelper.guidParameterCheck(request.userQuery, `DynamicsWebApi.${request.functionName}`, "request.userQuery")
        );
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
      if (!Utility.isNull(request.inChangeSet)) {
        ErrorHelper.boolParameterCheck(request.inChangeSet, `DynamicsWebApi.${request.functionName}`, "request.inChangeSet");
      }
      if (request.isBatch && Utility.isNull(request.inChangeSet))
        request.inChangeSet = true;
      if (request.timeout) {
        ErrorHelper.numberParameterCheck(request.timeout, `DynamicsWebApi.${request.functionName}`, "request.timeout");
      }
      if ((_c = request.expand) == null ? void 0 : _c.length) {
        ErrorHelper.stringOrArrayParameterCheck(request.expand, `DynamicsWebApi.${request.functionName}`, "request.expand");
        if (typeof request.expand === "string") {
          queryArray.push("$expand=" + request.expand);
        } else {
          const expandQueryArray = [];
          for (let i = 0; i < request.expand.length; i++) {
            if (request.expand[i].property) {
              const expand = request.expand[i];
              expand.functionName = `${request.functionName} $expand`;
              let expandConverted = _RequestUtility.composeUrl(expand, config, "", ";");
              if (expandConverted) {
                expandConverted = `(${expandConverted.substr(1)})`;
              }
              expandQueryArray.push(request.expand[i].property + expandConverted);
            }
          }
          if (expandQueryArray.length) {
            queryArray.push("$expand=" + expandQueryArray.join(","));
          }
        }
      }
    }
    return !queryArray.length ? url2 : url2 + "?" + queryArray.join(joinSymbol);
  }
  static composeHeaders(request, config) {
    const headers = { ...config.headers, ...request.userHeaders };
    const prefer = _RequestUtility.composePreferHeader(request, config);
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
      headers["CallerObjectId"] = ErrorHelper.guidParameterCheck(
        request.impersonateAAD,
        `DynamicsWebApi.${request.functionName}`,
        "request.impersonateAAD"
      );
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
      ErrorHelper.boolParameterCheck(
        request.bypassCustomPluginExecution,
        `DynamicsWebApi.${request.functionName}`,
        "request.bypassCustomPluginExecution"
      );
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
  }
  static composePreferHeader(request, config) {
    let returnRepresentation = request.returnRepresentation;
    let includeAnnotations = request.includeAnnotations;
    let maxPageSize = request.maxPageSize;
    let trackChanges = request.trackChanges;
    let continueOnError = request.continueOnError;
    let prefer = [];
    if (request.prefer && request.prefer.length) {
      ErrorHelper.stringOrArrayParameterCheck(request.prefer, `DynamicsWebApi.${request.functionName}`, "request.prefer");
      if (typeof request.prefer === "string") {
        prefer = request.prefer.split(",");
      }
      for (let i in prefer) {
        let item = prefer[i].trim();
        if (item === "return=representation") {
          returnRepresentation = true;
        } else if (item.includes("odata.include-annotations=")) {
          includeAnnotations = item.replace("odata.include-annotations=", "").replace(/"/g, "");
        } else if (item.startsWith("odata.maxpagesize=")) {
          maxPageSize = Number(item.replace("odata.maxpagesize=", "").replace(/"/g, "")) || 0;
        } else if (item.includes("odata.track-changes")) {
          trackChanges = true;
        } else if (item.includes("odata.continue-on-error")) {
          continueOnError = true;
        }
      }
    }
    prefer = [];
    if (config) {
      if (returnRepresentation == null) {
        returnRepresentation = config.returnRepresentation;
      }
      includeAnnotations = includeAnnotations ? includeAnnotations : config.includeAnnotations;
      maxPageSize = maxPageSize ? maxPageSize : config.maxPageSize;
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
  }
  static convertToBatch(requests, config, batchRequest) {
    const batchBoundary = `dwa_batch_${Utility.generateUUID()}`;
    const batchBody = [];
    let currentChangeSet = null;
    let contentId = 1e5;
    requests.forEach((internalRequest) => {
      var _a2;
      internalRequest.functionName = "executeBatch";
      if ((batchRequest == null ? void 0 : batchRequest.inChangeSet) === false)
        internalRequest.inChangeSet = false;
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
          currentChangeSet = `changeset_${Utility.generateUUID()}`;
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
      for (let key in internalRequest.headers) {
        if (key === "Authorization" || key === "Content-ID")
          continue;
        batchBody.push(`${key}: ${internalRequest.headers[key]}`);
      }
      if (internalRequest.data) {
        batchBody.push(`
${_RequestUtility.processData(internalRequest.data, config)}`);
      }
    });
    if (currentChangeSet) {
      batchBody.push(`
--${currentChangeSet}--`);
    }
    batchBody.push(`
--${batchBoundary}--`);
    const headers = _RequestUtility.setStandardHeaders(batchRequest == null ? void 0 : batchRequest.userHeaders);
    headers["Content-Type"] = `multipart/mixed;boundary=${batchBoundary}`;
    return { headers, body: batchBody.join("\n") };
  }
  static findCollectionName(entityName) {
    let collectionName = null;
    if (!Utility.isNull(_RequestUtility.entityNames)) {
      collectionName = _RequestUtility.entityNames[entityName];
      if (Utility.isNull(collectionName)) {
        for (let key in _RequestUtility.entityNames) {
          if (_RequestUtility.entityNames[key] === entityName) {
            return entityName;
          }
        }
      }
    }
    return collectionName;
  }
  static processData(data, config) {
    let stringifiedData = null;
    if (data) {
      if (data instanceof Uint8Array || data instanceof Uint16Array || data instanceof Uint32Array)
        return data;
      stringifiedData = JSON.stringify(data, (key, value) => {
        if (key.endsWith("@odata.bind") || key.endsWith("@odata.id")) {
          if (typeof value === "string" && !value.startsWith("$")) {
            if (/\(\{[\w\d-]+\}\)/g.test(value)) {
              value = value.replace(/(.+)\(\{([\w\d-]+)\}\)/g, "$1($2)");
            }
            if (config.useEntityNames) {
              const regularExpression = /([\w_]+)(\([\d\w-]+\))$/;
              const valueParts = regularExpression.exec(value);
              if (valueParts && valueParts.length > 2) {
                const collectionName = _RequestUtility.findCollectionName(valueParts[1]);
                if (!Utility.isNull(collectionName)) {
                  value = value.replace(regularExpression, collectionName + "$2");
                }
              }
            }
            if (!value.startsWith(config.dataApi.url)) {
              if (key.endsWith("@odata.bind")) {
                if (!value.startsWith("/")) {
                  value = "/" + value;
                }
              } else {
                value = config.dataApi.url + value.replace(/^\//, "");
              }
            }
          }
        } else if (key.startsWith("oData") || key.endsWith("_Formatted") || key.endsWith("_NavigationProperty") || key.endsWith("_LogicalName")) {
          value = void 0;
        }
        return value;
      });
      stringifiedData = stringifiedData.replace(/[\u007F-\uFFFF]/g, function(chr) {
        return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).slice(-4);
      });
    }
    return stringifiedData;
  }
  static setStandardHeaders(headers = {}) {
    if (!headers["Accept"])
      headers["Accept"] = "application/json";
    if (!headers["OData-MaxVersion"])
      headers["OData-MaxVersion"] = "4.0";
    if (!headers["OData-Version"])
      headers["OData-Version"] = "4.0";
    if (headers["Content-Range"])
      headers["Content-Type"] = "application/octet-stream";
    else if (!headers["Content-Type"])
      headers["Content-Type"] = "application/json; charset=utf-8";
    return headers;
  }
};
_RequestUtility.entityNames = null;
var RequestUtility = _RequestUtility;

// src/client/RequestClient.ts
init_ErrorHelper();

// src/client/helpers/executeRequest.ts
async function executeRequest2(options) {
  return false ? null.executeRequest(options) : (init_http(), __toCommonJS(http_exports)).executeRequest(options);
}

// src/client/RequestClient.ts
var _addResponseParams = (requestId, responseParams) => {
  if (_responseParseParams[requestId])
    _responseParseParams[requestId].push(responseParams);
  else
    _responseParseParams[requestId] = [responseParams];
};
var _addRequestToBatchCollection = (requestId, request) => {
  if (_batchRequestCollection[requestId])
    _batchRequestCollection[requestId].push(request);
  else
    _batchRequestCollection[requestId] = [request];
};
var _clearRequestData = (requestId) => {
  delete _responseParseParams[requestId];
  if (Object.hasOwn(_batchRequestCollection, requestId))
    delete _batchRequestCollection[requestId];
};
var _runRequest = async (request, config) => {
  try {
    const result = await RequestClient.sendRequest(request, config);
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
var RequestClient = class _RequestClient {
  /**
   * Sends a request to given URL with given parameters
   *
   * @param {InternalRequest} request - Composed request to D365 Web Api
   * @param {InternalConfig} config - DynamicsWebApi config.
   */
  static async sendRequest(request, config) {
    var _a2;
    request.headers = request.headers || {};
    request.responseParameters = request.responseParameters || {};
    request.requestId = request.requestId || Utility.generateUUID();
    _addResponseParams(request.requestId, request.responseParameters);
    let processedData = null;
    const isBatchConverted = (_a2 = request.responseParameters) == null ? void 0 : _a2.convertedToBatch;
    if (request.path === "$batch" && !isBatchConverted) {
      const batchRequest = _batchRequestCollection[request.requestId];
      if (!batchRequest)
        throw ErrorHelper.batchIsEmpty();
      const batchResult = RequestUtility.convertToBatch(batchRequest, config, request);
      processedData = batchResult.body;
      request.headers = { ...batchResult.headers, ...request.headers };
      delete _batchRequestCollection[request.requestId];
    } else {
      processedData = !isBatchConverted ? RequestUtility.processData(request.data, config) : request.data;
      if (!isBatchConverted)
        request.headers = RequestUtility.setStandardHeaders(request.headers);
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
      if (!token)
        throw new Error("Token is empty. Request is aborted.");
    }
    if (token) {
      request.headers["Authorization"] = "Bearer " + (token.hasOwnProperty("accessToken") ? token.accessToken : token);
    }
    if (Utility.isRunningWithinPortals()) {
      request.headers["__RequestVerificationToken"] = await global.window.shell.getTokenDeferred();
    }
    const url2 = request.apiConfig ? request.apiConfig.url : config.dataApi.url;
    return await executeRequest2({
      method: request.method,
      uri: url2 + request.path,
      data: processedData,
      additionalHeaders: request.headers,
      responseParams: _responseParseParams,
      isAsync: request.async,
      timeout: request.timeout || config.timeout,
      proxy: config.proxy,
      requestId: request.requestId,
      abortSignal: request.signal
    });
  }
  static async _getCollectionNames(entityName, config) {
    if (!Utility.isNull(RequestUtility.entityNames)) {
      return RequestUtility.findCollectionName(entityName) || entityName;
    }
    const request = RequestUtility.compose(
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
    RequestUtility.entityNames = {};
    for (let i = 0; i < result.data.value.length; i++) {
      RequestUtility.entityNames[result.data.value[i].LogicalName] = result.data.value[i].EntitySetName;
    }
    return RequestUtility.findCollectionName(entityName) || entityName;
  }
  static _isEntityNameException(entityName) {
    const exceptions = [
      "$metadata",
      "EntityDefinitions",
      "RelationshipDefinitions",
      "GlobalOptionSetDefinitions",
      "ManagedPropertyDefinitions",
      "query",
      "suggest",
      "autocomplete"
    ];
    return exceptions.indexOf(entityName) > -1;
  }
  static async _checkCollectionName(entityName, config) {
    if (!entityName || _RequestClient._isEntityNameException(entityName)) {
      return entityName;
    }
    entityName = entityName.toLowerCase();
    if (!config.useEntityNames) {
      return entityName;
    }
    try {
      return await _RequestClient._getCollectionNames(entityName, config);
    } catch (error) {
      throw new Error("Unable to fetch Collection Names. Error: " + error.message);
    }
  }
  static async makeRequest(request, config) {
    request.responseParameters = request.responseParameters || {};
    request.userHeaders = request.headers;
    delete request.headers;
    if (!request.isBatch) {
      const collectionName = await _RequestClient._checkCollectionName(request.collection, config);
      request.collection = collectionName;
      RequestUtility.compose(request, config);
      request.responseParameters.convertedToBatch = false;
      if (request.path.length > 2e3) {
        const batchRequest = RequestUtility.convertToBatch([request], config);
        request.method = "POST";
        request.path = "$batch";
        request.data = batchRequest.body;
        request.headers = { ...batchRequest.headers, ...request.userHeaders };
        request.responseParameters.convertedToBatch = true;
      }
      return _runRequest(request, config);
    }
    RequestUtility.compose(request, config);
    _addResponseParams(request.requestId, request.responseParameters);
    _addRequestToBatchCollection(request.requestId, request);
  }
  static _clearTestData() {
    RequestUtility.entityNames = null;
    _responseParseParams = {};
    _batchRequestCollection = {};
  }
  static getCollectionName(entityName) {
    return RequestUtility.findCollectionName(entityName);
  }
};

// src/dynamics-web-api.ts
var DynamicsWebApi = class _DynamicsWebApi {
  /**
   * Initializes a new instance of DynamicsWebApi
   * @param config - Configuration object
   */
  constructor(config) {
    this._config = ConfigurationUtility.default();
    this._isBatch = false;
    this._batchRequestId = null;
    /**
    * Merges provided configuration properties with an existing one.
    *
    * @param {DynamicsWebApi.Config} config - Configuration
    * @example
      dynamicsWebApi.setConfig({ serverUrl: 'https://contoso.api.crm.dynamics.com/' });
    */
    this.setConfig = (config) => ConfigurationUtility.merge(this._config, config);
    this._makeRequest = async (request) => {
      request.isBatch = this._isBatch;
      if (this._batchRequestId)
        request.requestId = this._batchRequestId;
      return RequestClient.makeRequest(request, this._config);
    };
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
    this.create = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.create", "request");
      let internalRequest;
      if (!request.functionName) {
        internalRequest = Utility.copyRequest(request);
        internalRequest.functionName = "create";
      } else
        internalRequest = request;
      internalRequest.method = "POST";
      const response = await this._makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
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
    this.retrieve = async (request) => {
      var _a2;
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieve", "request");
      let internalRequest;
      if (!request.functionName) {
        internalRequest = Utility.copyRequest(request);
        internalRequest.functionName = "retrieve";
      } else
        internalRequest = request;
      internalRequest.method = "GET";
      internalRequest.responseParameters = {
        isRef: ((_a2 = internalRequest.select) == null ? void 0 : _a2.length) === 1 && internalRequest.select[0].endsWith("/$ref")
      };
      const response = await this._makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Sends an asynchronous request to update a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.update = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.update", "request");
      let internalRequest;
      if (!request.functionName) {
        internalRequest = Utility.copyRequest(request);
        internalRequest.functionName = "update";
      } else
        internalRequest = request;
      if (!internalRequest.method)
        internalRequest.method = /EntityDefinitions|RelationshipDefinitions|GlobalOptionSetDefinitions/.test(internalRequest.collection || "") ? "PUT" : "PATCH";
      internalRequest.responseParameters = { valueIfEmpty: true };
      if (internalRequest.ifmatch == null) {
        internalRequest.ifmatch = "*";
      }
      const ifmatch = internalRequest.ifmatch;
      try {
        const response = await this._makeRequest(internalRequest);
        return response == null ? void 0 : response.data;
      } catch (error) {
        if (ifmatch && error.status === 412) {
          return false;
        }
        throw error;
      }
    };
    /**
     * Sends an asynchronous request to update a single value in the record.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.updateSingleProperty = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateSingleProperty", "request");
      ErrorHelper.parameterCheck(request.fieldValuePair, "DynamicsWebApi.updateSingleProperty", "request.fieldValuePair");
      var field = Object.keys(request.fieldValuePair)[0];
      var fieldValue = request.fieldValuePair[field];
      const internalRequest = Utility.copyRequest(request);
      internalRequest.navigationProperty = field;
      internalRequest.data = { value: fieldValue };
      internalRequest.functionName = "updateSingleProperty";
      internalRequest.method = "PUT";
      delete internalRequest["fieldValuePair"];
      const response = await this._makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Sends an asynchronous request to delete a record.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.deleteRecord = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.deleteRecord", "request");
      let internalRequest;
      if (!request.functionName) {
        internalRequest = Utility.copyRequest(request);
        internalRequest.functionName = "deleteRecord";
      } else
        internalRequest = request;
      internalRequest.method = "DELETE";
      internalRequest.responseParameters = { valueIfEmpty: true };
      const ifmatch = internalRequest.ifmatch;
      try {
        const response = await this._makeRequest(internalRequest);
        return response == null ? void 0 : response.data;
      } catch (error) {
        if (ifmatch && error.status === 412) {
          return false;
        }
        throw error;
      }
    };
    /**
     * Sends an asynchronous request to upsert a record.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.upsert = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.upsert", "request");
      const internalRequest = Utility.copyRequest(request);
      internalRequest.method = "PATCH";
      internalRequest.functionName = "upsert";
      const ifnonematch = internalRequest.ifnonematch;
      const ifmatch = internalRequest.ifmatch;
      try {
        const response = await this._makeRequest(internalRequest);
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
    this._uploadFileChunk = async (request, fileBytes, chunkSize, offset = 0) => {
      Utility.setFileChunk(request, fileBytes, chunkSize, offset);
      await this._makeRequest(request);
      offset += chunkSize;
      if (offset <= fileBytes.length) {
        return this._uploadFileChunk(request, fileBytes, chunkSize, offset);
      }
    };
    /**
     * Upload file to a File Attribute
     *
     * @param request - An object that represents all possible options for a current request.
     */
    this.uploadFile = async (request) => {
      ErrorHelper.throwBatchIncompatible("DynamicsWebApi.uploadFile", this._isBatch);
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.uploadFile", "request");
      const internalRequest = Utility.copyRequest(request, ["data"]);
      internalRequest.method = "PATCH";
      internalRequest.functionName = "uploadFile";
      internalRequest.transferMode = "chunked";
      const response = await this._makeRequest(internalRequest);
      internalRequest.url = response == null ? void 0 : response.data.location;
      delete internalRequest.transferMode;
      delete internalRequest.fieldName;
      delete internalRequest.fileName;
      return this._uploadFileChunk(internalRequest, request.data, response == null ? void 0 : response.data.chunkSize);
    };
    this._downloadFileChunk = async (request, bytesDownloaded = 0, data = "") => {
      request.range = "bytes=" + bytesDownloaded + "-" + (bytesDownloaded + Utility.downloadChunkSize - 1);
      request.downloadSize = "full";
      const response = await this._makeRequest(request);
      request.url = response == null ? void 0 : response.data.location;
      data += response == null ? void 0 : response.data.value;
      bytesDownloaded += Utility.downloadChunkSize;
      if (bytesDownloaded <= (response == null ? void 0 : response.data.fileSize)) {
        return this._downloadFileChunk(request, bytesDownloaded, data);
      }
      return {
        fileName: response == null ? void 0 : response.data.fileName,
        fileSize: response == null ? void 0 : response.data.fileSize,
        data: Utility.convertToFileBuffer(data)
      };
    };
    /**
     * Download a file from a File Attribute
     * @param request - An object that represents all possible options for a current request.
     */
    this.downloadFile = (request) => {
      ErrorHelper.throwBatchIncompatible("DynamicsWebApi.downloadFile", this._isBatch);
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.downloadFile", "request");
      const internalRequest = Utility.copyRequest(request);
      internalRequest.method = "GET";
      internalRequest.functionName = "downloadFile";
      internalRequest.responseParameters = { parse: true };
      return this._downloadFileChunk(internalRequest);
    };
    /**
     * Sends an asynchronous request to retrieve records.
     *
     * @param request - An object that represents all possible options for a current request.
     * @param {string} [nextPageLink] - Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveMultiple = async (request, nextPageLink) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveMultiple", "request");
      let internalRequest;
      if (!request.functionName) {
        internalRequest = Utility.copyRequest(request);
        internalRequest.functionName = "retrieveMultiple";
      } else
        internalRequest = request;
      internalRequest.method = "GET";
      if (nextPageLink) {
        ErrorHelper.stringParameterCheck(nextPageLink, "DynamicsWebApi.retrieveMultiple", "nextPageLink");
        internalRequest.url = nextPageLink;
      }
      const response = await this._makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    this._retrieveAllRequest = async (request, nextPageLink, records = []) => {
      const response = await this.retrieveMultiple(request, nextPageLink);
      records = records.concat(response.value);
      const pageLink = response.oDataNextLink;
      if (pageLink) {
        return this._retrieveAllRequest(request, pageLink, records);
      }
      const result = { value: records };
      if (response.oDataDeltaLink) {
        result["@odata.deltaLink"] = response.oDataDeltaLink;
        result.oDataDeltaLink = response.oDataDeltaLink;
      }
      return result;
    };
    /**
     * Sends an asynchronous request to retrieve all records.
     *
     * @param {DWARequest} request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveAll = (request) => {
      ErrorHelper.throwBatchIncompatible("DynamicsWebApi.retrieveAll", this._isBatch);
      return this._retrieveAllRequest(request);
    };
    /**
     * Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.count = async (request) => {
      var _a2;
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.count", "request");
      const internalRequest = Utility.copyRequest(request);
      internalRequest.method = "GET";
      internalRequest.functionName = "count";
      if ((_a2 = internalRequest.filter) == null ? void 0 : _a2.length) {
        internalRequest.count = true;
      } else {
        internalRequest.navigationProperty = "$count";
      }
      internalRequest.responseParameters = { toCount: internalRequest.count };
      const response = await this._makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Sends an asynchronous request to count records. Returns: Number
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.countAll = async (request) => {
      ErrorHelper.throwBatchIncompatible("DynamicsWebApi.countAll", this._isBatch);
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.countAll", "request");
      const response = await this._retrieveAllRequest(request);
      return response ? response.value ? response.value.length : 0 : 0;
    };
    /**
     * Sends an asynchronous request to execute FetchXml to retrieve records. Returns: DWA.Types.FetchXmlResponse
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.fetch = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.fetch", "request");
      const internalRequest = Utility.copyRequest(request);
      internalRequest.method = "GET";
      internalRequest.functionName = "fetch";
      ErrorHelper.stringParameterCheck(internalRequest.fetchXml, "DynamicsWebApi.fetch", "request.fetchXml");
      if (internalRequest.fetchXml && !/^<fetch.+top=/.test(internalRequest.fetchXml)) {
        let replacementString = "";
        if (!/^<fetch.+page=/.test(internalRequest.fetchXml)) {
          internalRequest.pageNumber = internalRequest.pageNumber || 1;
          ErrorHelper.numberParameterCheck(internalRequest.pageNumber, "DynamicsWebApi.fetch", "request.pageNumber");
          replacementString = `$1 page="${internalRequest.pageNumber}"`;
        }
        if (internalRequest.pagingCookie != null) {
          ErrorHelper.stringParameterCheck(internalRequest.pagingCookie, "DynamicsWebApi.fetch", "request.pagingCookie");
          replacementString += ` paging-cookie="${internalRequest.pagingCookie}"`;
        }
        if (replacementString)
          internalRequest.fetchXml = internalRequest.fetchXml.replace(/^(<fetch)/, replacementString);
      }
      internalRequest.responseParameters = { pageNumber: internalRequest.pageNumber };
      const response = await this._makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Sends an asynchronous request to execute FetchXml to retrieve all records.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.fetchAll = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.fetchAll", "request");
      const _executeFetchXmlAll = async (request2, records = []) => {
        const response = await this.fetch(request2);
        records = records.concat(response.value);
        if (response.PagingInfo) {
          request2.pageNumber = response.PagingInfo.nextPage;
          request2.pagingCookie = response.PagingInfo.cookie;
          return _executeFetchXmlAll(request2, records);
        }
        return { value: records };
      };
      ErrorHelper.throwBatchIncompatible("DynamicsWebApi.fetchAll", this._isBatch);
      return _executeFetchXmlAll(request);
    };
    /**
     * Associate for a collection-valued navigation property. (1:N or N:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.associate = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.associate", "request");
      const internalRequest = Utility.copyRequest(request);
      internalRequest.method = "POST";
      internalRequest.functionName = "associate";
      ErrorHelper.stringParameterCheck(request.relatedCollection, "DynamicsWebApi.associate", "request.relatedcollection");
      ErrorHelper.stringParameterCheck(request.relationshipName, "DynamicsWebApi.associate", "request.relationshipName");
      const primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.associate", "request.primaryKey");
      const relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.associate", "request.relatedKey");
      internalRequest.navigationProperty = request.relationshipName + "/$ref";
      internalRequest.key = primaryKey;
      internalRequest.data = { "@odata.id": `${request.relatedCollection}(${relatedKey})` };
      await this._makeRequest(internalRequest);
    };
    /**
     * Disassociate for a collection-valued navigation property.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.disassociate = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.disassociate", "request");
      const internalRequest = Utility.copyRequest(request);
      internalRequest.method = "DELETE";
      internalRequest.functionName = "disassociate";
      ErrorHelper.stringParameterCheck(request.relationshipName, "DynamicsWebApi.disassociate", "request.relationshipName");
      const primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.disassociate", "request.primaryKey");
      const relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.disassociate", "request.relatedId");
      internalRequest.key = primaryKey;
      internalRequest.navigationProperty = `${request.relationshipName}(${relatedKey})/$ref`;
      await this._makeRequest(internalRequest);
    };
    /**
     * Associate for a single-valued navigation property. (1:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.associateSingleValued = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.associateSingleValued", "request");
      const internalRequest = Utility.copyRequest(request);
      internalRequest.method = "PUT";
      internalRequest.functionName = "associateSingleValued";
      const primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.associateSingleValued", "request.primaryKey");
      const relatedKey = ErrorHelper.keyParameterCheck(request.relatedKey, "DynamicsWebApi.associateSingleValued", "request.relatedKey");
      ErrorHelper.stringParameterCheck(request.navigationProperty, "DynamicsWebApi.associateSingleValued", "request.navigationProperty");
      ErrorHelper.stringParameterCheck(request.relatedCollection, "DynamicsWebApi.associateSingleValued", "request.relatedcollection");
      internalRequest.navigationProperty += "/$ref";
      internalRequest.key = primaryKey;
      internalRequest.data = { "@odata.id": `${request.relatedCollection}(${relatedKey})` };
      await this._makeRequest(internalRequest);
    };
    /**
     * Removes a reference to an entity for a single-valued navigation property. (1:N)
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.disassociateSingleValued = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.disassociateSingleValued", "request");
      const internalRequest = Utility.copyRequest(request);
      internalRequest.method = "DELETE";
      internalRequest.functionName = "disassociateSingleValued";
      const primaryKey = ErrorHelper.keyParameterCheck(request.primaryKey, "DynamicsWebApi.disassociateSingleValued", "request.primaryKey");
      ErrorHelper.stringParameterCheck(request.navigationProperty, "DynamicsWebApi.disassociateSingleValued", "request.navigationProperty");
      internalRequest.navigationProperty += "/$ref";
      internalRequest.key = primaryKey;
      await this._makeRequest(internalRequest);
    };
    /**
     * Calls a Web API function
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.callFunction = async (request) => {
      ErrorHelper.parameterCheck(request, `DynamicsWebApi.callFunction`, "request");
      const isObject = Utility.isObject(request);
      const parameterName = isObject ? "request.functionName" : "name";
      const internalRequest = isObject ? Utility.copyObject(request) : { functionName: request };
      ErrorHelper.stringParameterCheck(internalRequest.functionName, `DynamicsWebApi.callFunction`, parameterName);
      internalRequest.method = "GET";
      internalRequest._additionalUrl = internalRequest.functionName + Utility.buildFunctionParameters(internalRequest.parameters);
      internalRequest._isUnboundRequest = !internalRequest.collection;
      internalRequest.functionName = "callFunction";
      const response = await this._makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Calls a Web API action
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.callAction = async (request) => {
      ErrorHelper.parameterCheck(request, `DynamicsWebApi.callAction`, "request");
      ErrorHelper.stringParameterCheck(request.actionName, `DynamicsWebApi.callAction`, "request.actionName");
      const internalRequest = Utility.copyRequest(request, ["action"]);
      internalRequest.method = "POST";
      internalRequest.functionName = "callAction";
      internalRequest._additionalUrl = request.actionName;
      internalRequest._isUnboundRequest = !internalRequest.collection;
      internalRequest.data = request.action;
      const response = await this._makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Sends an asynchronous request to create an entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.createEntity = (request) => {
      ErrorHelper.parameterCheck(request, `DynamicsWebApi.createEntity`, "request");
      ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.createEntity", "request.data");
      const internalRequest = Utility.copyRequest(request);
      internalRequest.collection = "EntityDefinitions";
      internalRequest.functionName = "createEntity";
      return this.create(internalRequest);
    };
    /**
     * Sends an asynchronous request to update an entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.updateEntity = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.updateEntity", "request");
      ErrorHelper.parameterCheck(request.data, "DynamicsWebApi.updateEntity", "request.data");
      ErrorHelper.guidParameterCheck(request.data.MetadataId, "DynamicsWebApi.updateEntity", "request.data.MetadataId");
      const internalRequest = Utility.copyRequest(request);
      internalRequest.collection = "EntityDefinitions";
      internalRequest.key = internalRequest.data.MetadataId;
      internalRequest.functionName = "updateEntity";
      internalRequest.method = "PUT";
      return this.update(internalRequest);
    };
    /**
     * Sends an asynchronous request to retrieve a specific entity definition.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveEntity = (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.retrieveEntity", "request");
      ErrorHelper.keyParameterCheck(request.key, "DynamicsWebApi.retrieveEntity", "request.key");
      const internalRequest = Utility.copyRequest(request);
      internalRequest.collection = "EntityDefinitions";
      internalRequest.functionName = "retrieveEntity";
      return this.retrieve(internalRequest);
    };
    /**
     * Sends an asynchronous request to retrieve entity definitions.
     *
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.retrieveEntities = (request) => {
      const internalRequest = !request ? {} : Utility.copyRequest(request);
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
      const internalRequest = Utility.copyRequest(request);
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
      const internalRequest = Utility.copyRequest(request);
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
      const internalRequest = Utility.copyRequest(request);
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
      const internalRequest = Utility.copyRequest(request);
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
      const internalRequest = Utility.copyRequest(request);
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
      const internalRequest = Utility.copyRequest(request);
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
      const internalRequest = Utility.copyRequest(request);
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
      const internalRequest = !request ? {} : Utility.copyRequest(request);
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
      const internalRequest = Utility.copyRequest(request);
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
      const internalRequest = Utility.copyRequest(request);
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
      const internalRequest = Utility.copyRequest(request);
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
      const internalRequest = Utility.copyRequest(request);
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
      const internalRequest = Utility.copyRequest(request);
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
      const internalRequest = !request ? {} : Utility.copyRequest(request);
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
      const internalRequest = !request ? {} : Utility.copyRequest(request);
      internalRequest.collection = "$metadata";
      internalRequest.functionName = "retrieveCsdlMetadata";
      if (request == null ? void 0 : request.addAnnotations) {
        ErrorHelper.boolParameterCheck(request.addAnnotations, "DynamicsWebApi.retrieveCsdlMetadata", "request.addAnnotations");
        internalRequest.includeAnnotations = "*";
      }
      const response = await this._makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Provides a search results page.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<SearchResponse<TValue>>} Search result
     */
    this.search = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.search", "request");
      const isObject = Utility.isObject(request);
      const parameterName = isObject ? "request.query.search" : "term";
      const internalRequest = isObject ? Utility.copyObject(request) : { query: { search: request } };
      ErrorHelper.parameterCheck(internalRequest.query, "DynamicsWebApi.search", "request.query");
      ErrorHelper.stringParameterCheck(internalRequest.query.search, "DynamicsWebApi.search", parameterName);
      ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, "DynamicsWebApi.search", parameterName, 100);
      internalRequest.collection = "query";
      internalRequest.functionName = "search";
      internalRequest.method = "POST";
      internalRequest.data = internalRequest.query;
      internalRequest.apiConfig = this._config.searchApi;
      delete internalRequest.query;
      const response = await this._makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Provides suggestions as the user enters text into a form field.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<SuggestResponse<TValueDocument>>} Suggestions result
     */
    this.suggest = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.suggest", "request");
      const isObject = Utility.isObject(request);
      const parameterName = isObject ? "request.query.search" : "term";
      const internalRequest = isObject ? Utility.copyObject(request) : { query: { search: request } };
      ErrorHelper.parameterCheck(internalRequest.query, "DynamicsWebApi.suggest", "request.query");
      ErrorHelper.stringParameterCheck(internalRequest.query.search, "DynamicsWebApi.suggest", parameterName);
      ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, "DynamicsWebApi.suggest", parameterName, 100);
      internalRequest.functionName = internalRequest.collection = "suggest";
      internalRequest.method = "POST";
      internalRequest.data = internalRequest.query;
      internalRequest.apiConfig = this._config.searchApi;
      delete internalRequest.query;
      const response = await this._makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Provides autocompletion of input as the user enters text into a form field.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise<AutocompleteResponse>} Result of autocomplete
     */
    this.autocomplete = async (request) => {
      ErrorHelper.parameterCheck(request, "DynamicsWebApi.autocomplete", "request");
      const isObject = Utility.isObject(request);
      const parameterName = isObject ? "request.query.search" : "term";
      const internalRequest = isObject ? Utility.copyObject(request) : { query: { search: request } };
      if (isObject)
        ErrorHelper.parameterCheck(internalRequest.query, "DynamicsWebApi.autocomplete", "request.query");
      ErrorHelper.stringParameterCheck(internalRequest.query.search, `DynamicsWebApi.autocomplete`, parameterName);
      ErrorHelper.maxLengthStringParameterCheck(internalRequest.query.search, "DynamicsWebApi.autocomplete", parameterName, 100);
      internalRequest.functionName = internalRequest.collection = "autocomplete";
      internalRequest.method = "POST";
      internalRequest.data = internalRequest.query;
      internalRequest.apiConfig = this._config.searchApi;
      delete internalRequest.query;
      const response = await this._makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Starts/executes a batch request.
     */
    this.startBatch = () => {
      this._isBatch = true;
      this._batchRequestId = Utility.generateUUID();
    };
    /**
     * Executes a batch request. Please call DynamicsWebApi.startBatch() first to start a batch request.
     * @param request - An object that represents all possible options for a current request.
     * @returns {Promise} D365 Web Api Response
     */
    this.executeBatch = async (request) => {
      ErrorHelper.throwBatchNotStarted(this._isBatch);
      const internalRequest = !request ? {} : Utility.copyRequest(request);
      internalRequest.collection = "$batch";
      internalRequest.method = "POST";
      internalRequest.functionName = "executeBatch";
      internalRequest.requestId = this._batchRequestId;
      this._batchRequestId = null;
      this._isBatch = false;
      const response = await this._makeRequest(internalRequest);
      return response == null ? void 0 : response.data;
    };
    /**
     * Creates a new instance of DynamicsWebApi. If the config is not provided, it is copied from the current instance.
     *
     * @param {Config} config - configuration object.
     * @returns {DynamicsWebApi} The new instance of a DynamicsWebApi
     */
    this.initializeInstance = (config) => new _DynamicsWebApi(config || this._config);
    this.Utility = {
      /**
       * Searches for a collection name by provided entity name in a cached entity metadata.
       * The returned collection name can be null.
       *
       * @param {string} entityName - entity name
       * @returns {string | null} a collection name
       */
      getCollectionName: (entityName) => RequestClient.getCollectionName(entityName)
    };
    ConfigurationUtility.merge(this._config, config);
  }
};
export {
  DynamicsWebApi
};
//# sourceMappingURL=dynamics-web-api.mjs.map
