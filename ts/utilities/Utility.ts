import { Core } from "../types";

declare let GetGlobalContext: any;
declare let Xrm: any;

const INITIAL_TIME = Date.now();
let prevNow = 0;

/**
 * Cross platform compatible partial performance implementation
 */
//partially taken from https://github.com/getsentry/sentry-javascript/blob/master/packages/utils/src/misc.ts
interface CrossPlatformPerformance {
	/**
	 * Returns the current timestamp in ms
	 */
	now(): number;
	timeOrigin: number;
}

const performanceFallback: CrossPlatformPerformance = {
	now(): number {
		let now = Date.now() - INITIAL_TIME;
		if (now < prevNow) {
			now = prevNow;
		}
		prevNow = now;
		return now;
	},
	timeOrigin: INITIAL_TIME
};

function isNodeEnv(): boolean {
	// tslint:disable:strict-type-predicates
	return Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
}

function getGlobalObject<T>(): T {
	return (isNodeEnv()
		? global
		: typeof window !== "undefined"
			? window
			: typeof self !== "undefined"
				? self
				: {}) as T;
}

function getPerformance(): CrossPlatformPerformance {
	if (isNodeEnv()) {
		try {
			const perfHooks = require("perf_hooks");
			return perfHooks.performance;
		} catch (_) {
			return performanceFallback;
		}
	}

	let window = getGlobalObject<Window>();

	if (window.performance) {
		// Polyfill for performance.timeOrigin.
		// tslint:disable-next-line:strict-type-predicates
		if (typeof window.performance.timeOrigin === "undefined") {
			// @ts-ignore
			// tslint:disable-next-line:deprecation
			window.performance.timeOrigin = (window.performance.timing && window.performance.timing.navigationStart) || INITIAL_TIME;
		}
	}

	return window.performance || performanceFallback
}

export class Utility {
    /**
     * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
     *
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @returns {string}
     */
    static buildFunctionParameters(parameters?: any): string {
        if (parameters) {
            var parameterNames = Object.keys(parameters);
            var functionParameters = "";
            var urlQuery = "";

            for (var i = 1; i <= parameterNames.length; i++) {
                var parameterName = parameterNames[i - 1];
                var value = parameters[parameterName];

                if (value === null)
                    continue;

                if (typeof value === "string" && !value.startsWith("Microsoft.Dynamics.CRM")) {
                    value = "'" + value + "'";
                }
                //fix #45
                else if (typeof value === "object") {
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
        }
        else {
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
        pageCookies = unescape(unescape(pageCookies));

        var info = /pagingcookie="(<cookie page="(\d+)".+<\/cookie>)/.exec(pageCookies);

        if (info != null) {
            var page = parseInt(info[2]);
            return {
                cookie: info[1].replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '\'').replace(/\'/g, '&' + 'quot;'),
                page: page,
                nextPage: page + 1
            };
        } else {
            //http://stackoverflow.com/questions/41262772/execution-of-fetch-xml-using-web-api-dynamics-365 workaround
            return {
                cookie: "",
                page: currentPageNumber,
                nextPage: currentPageNumber + 1
            };
        }
	}

	static isNodeEnv = isNodeEnv;

    /**
     * Converts a response to a reference object
     *
     * @param {Object} responseData - Response object
     * @returns {ReferenceObject}
     */
    static convertToReferenceObject(responseData: any): Core.ReferenceObject {
        var result = /\/(\w+)\(([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})/i.exec(responseData["@odata.id"]);
        return { id: result[2], collection: result[1], oDataContext: responseData["@odata.context"] };
    }

    /**
     * Checks whether the value is JS Null.
     * @param {Object} value
     * @returns {boolean}
     */
    static isNull(value: any): boolean {
        return typeof value === "undefined" || value == null;
    }

    static generateUUID(): string { // Public Domain/MIT
		var d = new Date().getTime();

		const performance = getPerformance();

		if (performance && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    static getXrmContext(): any {
        if (typeof GetGlobalContext !== 'undefined') {
            return GetGlobalContext();
        }
        else {
            if (typeof Xrm !== 'undefined') {
                //d365 v.9.0
                if (!Utility.isNull(Xrm.Utility) && !Utility.isNull(Xrm.Utility.getGlobalContext)) {
                    return Xrm.Utility.getGlobalContext();
                }
                else if (!Utility.isNull(Xrm.Page) && !Utility.isNull(Xrm.Page.context)) {
                    return Xrm.Page.context;
                }
            }
        }

        throw new Error('Xrm Context is not available. In most cases, it can be resolved by adding a reference to a ClientGlobalContext.js.aspx. Please refer to MSDN documentation for more details.');
    }

    static getXrmUtility(): any {
        return typeof Xrm !== "undefined" ? Xrm.Utility : null;
    }

    static getClientUrl(): string {
        var context = Utility.getXrmContext();

        var clientUrl = context.getClientUrl();

        if (clientUrl.match(/\/$/)) {
            clientUrl = clientUrl.substring(0, clientUrl.length - 1);
        }
        return clientUrl;
    }

    static initWebApiUrl(version: string): string {
        return `${Utility.getClientUrl()}/api/data/v${version}/`;
	}

	static isObject(obj: any) : boolean {
		const type = typeof obj;
		return type === 'object' && !!obj;
	}

	static copyObject<T = any>(src: any): T {
		let target = {};
		for (var prop in src) {
			if (src.hasOwnProperty(prop)) {
				// if the value is a nested object, recursively copy all its properties
				if (Utility.isObject(src[prop]) && Object.prototype.toString.call(src[prop]) !== "[object Date]") {
					if (!Array.isArray(src[prop])) {
						target[prop] = Utility.copyObject(src[prop]);
					}
					else {
						target[prop] = src[prop].slice();
					}

				} else {
					target[prop] = src[prop];
				}
			}
		}
		return <T>target;
	}
}