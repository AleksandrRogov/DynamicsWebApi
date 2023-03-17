import { Utility } from "./Utility";
import { DynamicsWebApi } from "../dynamics-web-api";
import { ErrorHelper } from "../helpers/ErrorHelper";
import { Core } from "../types";

/**
 * @typedef {Object} ConvertedRequestOptions
 * @property {string} url URL (without query)
 * @property {string} query Query String
 * @property {Object} headers Heades object (always an Object; can be empty: {})
 */

/**
 * @typedef {Object} ConvertedRequest
 * @property {string} url URL (including Query String)
 * @property {Object} headers Heades object (always an Object; can be empty: {})
 * @property {boolean} async
 */

export class RequestUtility {
	/**
	 * Converts a request object to URL link
	 *
	 * @param {Object} request - Request object
	 * @param {Object} [config] - DynamicsWebApi config
	 * @returns {ConvertedRequest} Converted request
	 */
	static compose(request: Core.InternalRequest, config: DynamicsWebApi.Config): Core.InternalRequest {
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

				//add alternate key feature
				if (request.key) {
					request.key = ErrorHelper.keyParameterCheck(request.key, `DynamicsWebApi.${request.functionName}`, "request.key");
				} else if (request.id) {
					request.key = ErrorHelper.guidParameterCheck(request.id, `DynamicsWebApi.${request.functionName}`, "request.id");
				}

				if (request.key) {
					request.path += `(${request.key})`;
				}
			}

			if (request._additionalUrl) {
				if (request.path) {
					request.path += "/";
				}
				request.path += request._additionalUrl;
			}

			request.path = RequestUtility.composeUrl(request, config, request.path);

			if (request.fetchXml) {
				ErrorHelper.stringParameterCheck(request.fetchXml, `DynamicsWebApi.${request.functionName}`, "request.fetchXml");
				let join = request.path.indexOf("?") === -1 ? "?" : "&";
				request.path += `${join}fetchXml=${encodeURIComponent(request.fetchXml)}`;
			}
		} else {
			ErrorHelper.stringParameterCheck(request.url, `DynamicsWebApi.${request.functionName}`, "request.url");
			request.path = request.url.replace(config.webApiUrl!, "");
			request.path = RequestUtility.composeUrl(request, config, request.path);
		}

		if (request.hasOwnProperty("async") && request.async != null) {
			ErrorHelper.boolParameterCheck(request.async, `DynamicsWebApi.${request.functionName}`, "request.async");
		} else {
			request.async = true;
		}

		request.headers = RequestUtility.composeHeaders(request, config);

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
	static composeUrl(request: Core.InternalRequest, config: DynamicsWebApi.Config, url: string = "", joinSymbol: string = "&"): string {
		const queryArray: string[] = [];

		// joinSymbol = joinSymbol || "&";
		// url = url || "";

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
						ErrorHelper.stringParameterCheck(
							request.metadataAttributeType,
							`DynamicsWebApi.${request.functionName}`,
							"request.metadataAttributeType"
						);
						url += "/" + request.metadataAttributeType;
					}
				}
			}

			if (request.select?.length) {
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

					//check if anything left in the array
					if (request.select.length) {
						queryArray.push("$select=" + request.select.join(","));
					}
				}
			}

			if (request.filter) {
				ErrorHelper.stringParameterCheck(request.filter, `DynamicsWebApi.${request.functionName}`, "request.filter");
				const removeBracketsFromGuidReg = /[^"']{([\w\d]{8}[-]?(?:[\w\d]{4}[-]?){3}[\w\d]{12})}(?:[^"']|$)/g;
				let filterResult = request.filter;

				//fix bug 2018-06-11
				let m: RegExpExecArray | null = null;
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
				url += "/" + request.fieldName;
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

			if (request.queryParams?.length) {
				ErrorHelper.arrayParameterCheck(request.queryParams, `DynamicsWebApi.${request.functionName}`, "request.queryParams");
				queryArray.push(request.queryParams.join("&"));
			}

			if (request.fileName) {
				ErrorHelper.stringParameterCheck(request.fileName, `DynamicsWebApi.${request.functionName}`, "request.fileName");
				queryArray.push("x-ms-file-name=" + request.fileName);
			}

			if (request.entity) {
				ErrorHelper.parameterCheck(request.entity, `DynamicsWebApi.${request.functionName}`, "request.entity");
			}

			if (request.data) {
				ErrorHelper.parameterCheck(request.data, `DynamicsWebApi.${request.functionName}`, "request.data");
			}

			if (request.isBatch) {
				ErrorHelper.boolParameterCheck(request.isBatch, `DynamicsWebApi.${request.functionName}`, "request.isBatch");
			}

			if (request.timeout) {
				ErrorHelper.numberParameterCheck(request.timeout, `DynamicsWebApi.${request.functionName}`, "request.timeout");
			}

			if (request.expand?.length) {
				ErrorHelper.stringOrArrayParameterCheck(request.expand, `DynamicsWebApi.${request.functionName}`, "request.expand");
				if (typeof request.expand === "string") {
					queryArray.push("$expand=" + request.expand);
				} else {
					const expandQueryArray: string[] = [];
					for (let i = 0; i < request.expand.length; i++) {
						if (request.expand[i].property) {
							const expand = <Core.InternalRequest>request.expand[i];
							expand.functionName = `${request.functionName} $expand`;
							let expandConverted = RequestUtility.composeUrl(expand, config, "", ";");
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

		return !queryArray.length ? url : url + "?" + queryArray.join(joinSymbol);
	}

	static composeHeaders(request: Core.InternalRequest, config: DynamicsWebApi.Config): any {
		let headers: any = {};

		let prefer = RequestUtility.composePreferHeader(request, config);

		if (prefer.length) {
			headers["Prefer"] = prefer;
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

	static composePreferHeader(request: Core.InternalRequest, config: DynamicsWebApi.Config): string {
		let returnRepresentation: boolean | null | undefined = request.returnRepresentation;
		let includeAnnotations: string | null | undefined = request.includeAnnotations;
		let maxPageSize: number | null | undefined = request.maxPageSize;
		let trackChanges: boolean | null | undefined = request.trackChanges;

		let prefer: string[] = [];

		if (request.prefer && request.prefer.length) {
			ErrorHelper.stringOrArrayParameterCheck(request.prefer, `DynamicsWebApi.${request.functionName}`, "request.prefer");
			if (typeof request.prefer === "string") {
				prefer = request.prefer.split(",");
			}
			for (let i in prefer) {
				let item = prefer[i].trim();
				if (item === "return=representation") {
					returnRepresentation = true;
				} else if (item.indexOf("odata.include-annotations=") > -1) {
					includeAnnotations = item.replace("odata.include-annotations=", "").replace(/"/g, "");
				} else if (item.startsWith("odata.maxpagesize=")) {
					maxPageSize = Number(item.replace("odata.maxpagesize=", "").replace(/"/g, "")) || 0;
				} else if (item.indexOf("odata.track-changes") > -1) {
					trackChanges = true;
				}
			}
		}

		//clear array
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

		return prefer.join(",");
	}

	static convertToBatch(requests: Core.InternalRequest[], config: DynamicsWebApi.Config): Core.InternalBatchRequest {
		let batchBoundary = `dwa_batch_${Utility.generateUUID()}`;

		const batchBody: string[] = [];
		let currentChangeSet: string | null = null;
		let contentId = 100000;

		requests.forEach((internalRequest) => {
			internalRequest.functionName = "executeBatch";
			const isGet = internalRequest.method === "GET";

			if (isGet && currentChangeSet) {
				//end current change set
				batchBody.push(`\n--${currentChangeSet}--`);

				currentChangeSet = null;
				contentId = 100000;
			}

			if (!currentChangeSet) {
				batchBody.push(`\n--${batchBoundary}`);

				if (!isGet) {
					currentChangeSet = `changeset_${Utility.generateUUID()}`;
					batchBody.push("Content-Type: multipart/mixed;boundary=" + currentChangeSet);
				}
			}

			if (!isGet) {
				batchBody.push(`\n--${currentChangeSet}`);
			}

			batchBody.push("Content-Type: application/http");
			batchBody.push("Content-Transfer-Encoding: binary");

			if (!isGet) {
				let contentIdValue = internalRequest.headers.hasOwnProperty("Content-ID") ? internalRequest.headers["Content-ID"] : ++contentId;

				batchBody.push(`Content-ID: ${contentIdValue}`);
			}

			if (!internalRequest.path?.startsWith("$")) {
				batchBody.push(`\n${internalRequest.method} ${config.webApiUrl}${internalRequest.path} HTTP/1.1`);
			} else {
				batchBody.push(`\n${internalRequest.method} ${internalRequest.path} HTTP/1.1`);
			}

			if (isGet) {
				batchBody.push("Accept: application/json");
			} else {
				batchBody.push("Content-Type: application/json");
			}

			for (let key in internalRequest.headers) {
				if (key === "Authorization" || key === "Content-ID") continue;

				batchBody.push(`${key}: ${internalRequest.headers[key]}`);
			}

			const data = internalRequest.data || internalRequest.entity;

			if (!isGet && data) {
				batchBody.push(`\n${RequestUtility.processData(data, config)}`);
			}
		});

		if (currentChangeSet) {
			batchBody.push(`\n--${currentChangeSet}--`);
		}

		batchBody.push(`\n--${batchBoundary}--`);

		let headers = RequestUtility.setStandardHeaders();
		headers["Content-Type"] = `multipart/mixed;boundary=${batchBoundary}`;

		return { headers: headers, body: batchBody.join("\n") };
	}

	static entityNames: any = null;

	static findCollectionName(entityName: string): string | null {
		let collectionName = null;

		if (!Utility.isNull(RequestUtility.entityNames)) {
			collectionName = RequestUtility.entityNames[entityName];
			if (Utility.isNull(collectionName)) {
				for (let key in RequestUtility.entityNames) {
					if (RequestUtility.entityNames[key] === entityName) {
						return entityName;
					}
				}
			}
		}

		return collectionName;
	}

	static processData(data: any, config: DynamicsWebApi.Config): any {
		let stringifiedData;
		if (data) {
			if (data instanceof Uint8Array || data instanceof Uint16Array || data instanceof Uint32Array) return data;

			stringifiedData = JSON.stringify(data, (key, value) => {
				if (key.endsWith("@odata.bind") || key.endsWith("@odata.id")) {
					if (typeof value === "string" && !value.startsWith("$")) {
						//remove brackets in guid
						if (/\(\{[\w\d-]+\}\)/g.test(value)) {
							value = value.replace(/(.+)\(\{([\w\d-]+)\}\)/g, "$1($2)");
						}

						if (config.useEntityNames) {
							//replace entity name with collection name
							const regularExpression = /([\w_]+)(\([\d\w-]+\))$/;
							const valueParts = regularExpression.exec(value);
							if (valueParts && valueParts.length > 2) {
								const collectionName = RequestUtility.findCollectionName(valueParts[1]);

								if (!Utility.isNull(collectionName)) {
									value = value.replace(regularExpression, collectionName + "$2");
								}
							}
						}

						if (!value.startsWith(config.webApiUrl)) {
							//add full web api url if it's not set
							if (key.endsWith("@odata.bind")) {
								if (!value.startsWith("/")) {
									value = "/" + value;
								}
							} else {
								value = config.webApiUrl + value.replace(/^\//, "");
							}
						}
					}
				} else if (key.startsWith("oData") || key.endsWith("_Formatted") || key.endsWith("_NavigationProperty") || key.endsWith("_LogicalName")) {
					value = undefined;
				}

				return value;
			});

			stringifiedData = stringifiedData.replace(/[\u007F-\uFFFF]/g, function (chr) {
				return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
			});
		}

		return stringifiedData;
	}

	static setStandardHeaders(headers: any = {}): any {
		headers = headers || {};
		headers["Accept"] = "application/json";
		headers["OData-MaxVersion"] = "4.0";
		headers["OData-Version"] = "4.0";
		headers["Content-Type"] = headers["Content-Range"] ? "application/octet-stream" : "application/json; charset=utf-8";

		return headers;
	}
}
