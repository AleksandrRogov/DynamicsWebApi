var uCrypto = getCrypto();

function isNull(value) {
	return typeof value === "undefined" || value == null;
}

function getCrypto() {
	if (typeof process !== "undefined") {
		return require("crypto");
	}
	else if (typeof window !== "undefined")
		return window.crypto;

	return null;
}

function generateRandomBytes() {
	if (typeof uCrypto.getRandomValues !== "undefined") {
		return uCrypto.getRandomValues(new Uint8Array(1));
	}

	return uCrypto.randomBytes(1);
}

function generateUUID() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ generateRandomBytes()[0] & 15 >> c / 4).toString(16)
	);
}

function getXrmContext() {
	if (typeof GetGlobalContext !== 'undefined') {
		return GetGlobalContext();
	}
	else {
		if (typeof Xrm !== 'undefined') {
			//d365 v.9.0
			if (!isNull(Xrm.Utility) && !isNull(Xrm.Utility.getGlobalContext)) {
				return Xrm.Utility.getGlobalContext();
			}
			else if (!isNull(Xrm.Page) && !isNull(Xrm.Page.context)) {
				return Xrm.Page.context;
			}
		}
	}

	throw new Error('Xrm Context is not available. In most cases, it can be resolved by adding a reference to a ClientGlobalContext.js.aspx. Please refer to MSDN documentation for more details.');
}

function getClientUrl() {
	var context = getXrmContext();

	var clientUrl = context.getClientUrl();

	if (clientUrl.match(/\/$/)) {
		clientUrl = clientUrl.substring(0, clientUrl.length - 1);
	}
	return clientUrl;
}

function initWebApiUrl(version) {
	return getClientUrl() + '/api/data/v' + version + '/';
}

function getXrmInternal() {
	//todo: Xrm.Internal namespace is not supported
	return typeof Xrm !== "undefined" ? Xrm.Internal : null;
}

function getXrmUtility() {
	return typeof Xrm !== "undefined" ? Xrm.Utility : null;
}

function _isObject(obj) {
	var type = typeof obj;
	return type === 'object' && !!obj;
}

function copyObject(src) {
	var target = {};
	for (var prop in src) {
		if (src.hasOwnProperty(prop)) {
			// if the value is a nested object, recursively copy all its properties
			if (_isObject(src[prop]) && Object.prototype.toString.call(src[prop]) !== '[object Date]') {
				if (!Array.isArray(src[prop])) {
					target[prop] = copyObject(src[prop]);
				}
				else {
					target[prop] = src[prop].slice();
				}

			} else {
				target[prop] = src[prop];
			}
		}
	}
	return target;
}

var Utility = {
	/**
	 * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
	 *
	 * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
	 * @returns {string}
	 */
	buildFunctionParameters: require('./buildFunctionParameters'),

	/**
	 * Parses a paging cookie returned in response
	 *
	 * @param {string} pageCookies - Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.
	 * @param {number} currentPageNumber - A current page number. Fix empty paging-cookie for complex fetch xmls.
	 * @returns {{ cookie: "", number: 0, next: 1 }}
	 */
	getFetchXmlPagingCookie: require('./getFetchXmlPagingCookie'),

	/**
	 * Converts a response to a reference object
	 *
	 * @param {Object} responseData - Response object
	 * @returns {ReferenceObject}
	 */
	convertToReferenceObject: require('./convertToReferenceObject'),

	/**
	 * Checks whether the value is JS Null.
	 * @param {Object} value
	 * @returns {boolean}
	 */
	isNull: isNull,

	generateUUID: generateUUID,

	getXrmContext: getXrmContext,

	getXrmInternal: getXrmInternal,

	getXrmUtility: getXrmUtility,

	getClientUrl: getClientUrl,

	initWebApiUrl: initWebApiUrl,

	copyObject: copyObject
};

module.exports = Utility;