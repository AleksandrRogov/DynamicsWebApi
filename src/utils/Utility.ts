import { Core } from "../types";

declare var GetGlobalContext: any;
declare var Xrm: any;

function isNodeEnv(): boolean {
	// tslint:disable:strict-type-predicates
	return Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
}

function getGlobalObject<T>(): T {
	return (isNodeEnv() ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}) as T;
}

/// #if node
const nCrypto = require("crypto");
/// #endif

function getCrypto() {
	/// #if node
	if (typeof window === "undefined") {
		return nCrypto;
	} else {
		/// #endif
		return window.crypto;
		/// #if node
	}
	/// #endif
}

function generateRandomBytes() {
	const uCrypto = getCrypto();
	/// #if node
	if (typeof uCrypto.getRandomValues !== "undefined") {
		/// #endif
		return uCrypto.getRandomValues(new Uint8Array(1));
		/// #if node
	}

	return uCrypto.randomBytes(1);
	/// #endif
}

const downloadChunkSize = 4194304;

export class Utility {
	/**
	 * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
	 *
	 * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
	 * @returns {string}
	 */
	static buildFunctionParameters(parameters?: any): string {
		if (parameters) {
			const parameterNames = Object.keys(parameters);
			let functionParameters = "";
			let urlQuery = "";

			for (var i = 1; i <= parameterNames.length; i++) {
				const parameterName = parameterNames[i - 1];
				let value = parameters[parameterName];

				if (value === null) continue;

				if (typeof value === "string" && !value.startsWith("Microsoft.Dynamics.CRM")) {
					value = "'" + value + "'";
				} else if (typeof value === "object") {
					value = JSON.stringify(value);
				}

				if (i > 1) {
					functionParameters += ",";
					urlQuery += "&";
				}

				functionParameters += parameterName + "=@p" + i;
				urlQuery += "@p" + i + "=" + value;
			}

			return "(" + functionParameters + ")?" + urlQuery;
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
	static getFetchXmlPagingCookie(pageCookies: string = "", currentPageNumber: number = 1): Core.FetchXmlCookie {
		//get the page cokies
		pageCookies = decodeURIComponent(decodeURIComponent(pageCookies));

		const info = /pagingcookie="(<cookie page="(\d+)".+<\/cookie>)/.exec(pageCookies);

		if (info != null) {
			let page = parseInt(info[2]);
			return {
				cookie: info[1]
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/\"/g, "'")
					.replace(/\'/g, "&" + "quot;"),
				page: page,
				nextPage: page + 1,
			};
		} else {
			//http://stackoverflow.com/questions/41262772/execution-of-fetch-xml-using-web-api-dynamics-365 workaround
			return {
				cookie: "",
				page: currentPageNumber,
				nextPage: currentPageNumber + 1,
			};
		}
	}

	static isNodeEnv = isNodeEnv;

	static downloadChunkSize = downloadChunkSize;

	/**
	 * Converts a response to a reference object
	 *
	 * @param {Object} responseData - Response object
	 * @returns {ReferenceObject}
	 */
	static convertToReferenceObject(responseData: any): Core.ReferenceObject {
		const result = /\/(\w+)\(([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})/i.exec(responseData["@odata.id"]);
		return { id: result![2], collection: result![1], oDataContext: responseData["@odata.context"] };
	}

	/**
	 * Checks whether the value is JS Null.
	 * @param {Object} value
	 * @returns {boolean}
	 */
	static isNull(value: any): boolean {
		return typeof value === "undefined" || value == null;
	}

	/** Generates UUID */
	static generateUUID(): string {
		return (<any>[1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (generateRandomBytes()[0] & (15 >> (c / 4)))).toString(16));
	}

	static getXrmContext(): any {
		if (typeof GetGlobalContext !== "undefined") {
			return GetGlobalContext();
		} else {
			if (typeof Xrm !== "undefined") {
				//d365 v.9.0
				if (!Utility.isNull(Xrm.Utility) && !Utility.isNull(Xrm.Utility.getGlobalContext)) {
					return Xrm.Utility.getGlobalContext();
				} else if (!Utility.isNull(Xrm.Page) && !Utility.isNull(Xrm.Page.context)) {
					return Xrm.Page.context;
				}
			}
		}

		throw new Error(
			"Xrm Context is not available. In most cases, it can be resolved by adding a reference to a ClientGlobalContext.js.aspx. Please refer to MSDN documentation for more details."
		);
	}

	static getXrmUtility(): any {
		return typeof Xrm !== "undefined" ? Xrm.Utility : null;
	}

	static getClientUrl(): string {
		const context = Utility.getXrmContext();

		let clientUrl = context.getClientUrl();

		if (clientUrl.match(/\/$/)) {
			clientUrl = clientUrl.substring(0, clientUrl.length - 1);
		}
		return clientUrl;
	}

	static isObject(obj: any): boolean {
		const type = typeof obj;
		return type === "object" && !!obj;
	}

	static copyObject<T = any>(src: any, excludeProps: string[] = []): T {
		let target = {};
		for (let prop in src) {
			if (src.hasOwnProperty(prop) && !excludeProps.includes(prop)) {
				// if the value is a nested object, recursively copy all its properties
				if (Utility.isObject(src[prop]) && Object.prototype.toString.call(src[prop]) !== "[object Date]") {
					if (!Array.isArray(src[prop])) {
						target[prop] = Utility.copyObject(src[prop]);
					} else {
						target[prop] = src[prop].slice();
					}
				} else {
					target[prop] = src[prop];
				}
			}
		}
		return <T>target;
	}

	static setFileChunk(request: Core.InternalRequest, fileBuffer: Uint8Array | Buffer, chunkSize: number, offset: number): void {
		offset = offset || 0;

		const count = offset + chunkSize > fileBuffer.length ? fileBuffer.length % chunkSize : chunkSize;

		let content;

		/// #if node
		if (typeof window === "undefined") {
			content = fileBuffer.slice(offset, offset + count);
		} else {
			/// #endif
			content = new Uint8Array(count);
			for (let i = 0; i < count; i++) {
				content[i] = fileBuffer[offset + i];
			}
			/// #if node
		}
		/// #endif

		request.data = content;
		request.contentRange = "bytes " + offset + "-" + (offset + count - 1) + "/" + fileBuffer.length;
	}

	static convertToFileBuffer(binaryString: string): Uint8Array | Buffer {
		/// #if node
		if (typeof window === "undefined") {
			return Buffer.from(binaryString, "binary");
		} else {
			/// #endif
			const bytes = new Uint8Array(binaryString.length);
			for (var i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}
			return bytes;
			/// #if node
		}
		/// #endif
	}
}
