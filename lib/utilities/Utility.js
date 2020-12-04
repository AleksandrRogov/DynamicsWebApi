/* develblock:start */
var nCrypto = require("crypto");
/* develblock:end */

function getCrypto() {
	/* develblock:start */
	if (typeof window === "undefined") {
		return nCrypto;
	}
	else
		/* develblock:end */
		return window.crypto;
}

function isNull(value) {
	return typeof value === "undefined" || value == null;
}

function generateRandomBytes() {
	var uCrypto = getCrypto();
	/* develblock:start */
	if (typeof uCrypto.getRandomValues !== "undefined") {
		/* develblock:end */
		return uCrypto.getRandomValues(new Uint8Array(1));
		/* develblock:start */
	}

	return uCrypto.randomBytes(1);
	/* develblock:end */
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

function setFileChunk(request, fileBuffer, chunkSize, offset) {
	offset = offset || 0;

	var count = (offset + chunkSize) > fileBuffer.length
		? fileBuffer.length % chunkSize
		: chunkSize;

	var content;

	/* develblock:start */
	if (typeof window === "undefined") {
		content = fileBuffer.slice(offset, offset + count);
	}
	else {
		/* develblock:end */
		content = new Uint8Array(count);
		for (var i = 0; i < count; i++) {
			content[i] = fileBuffer[offset + i];
		}
		/* develblock:start */
	}
	/* develblock:end */

	request.data = content;
	request.contentRange = "bytes " + offset + "-" + (offset + count - 1) + "/" + fileBuffer.length;
}

function convertToFileBuffer(binaryString) {
	/* develblock:start */
	if (typeof window === "undefined") {
		return Buffer.from(binaryString, "binary");
	}
	else {
		/* develblock:end */
		var bytes = new Uint8Array(binaryString.length);
		for (var i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
		/* develblock:start */
	}
	/* develblock:end */
}

var downloadChunkSize = 4194304;

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

	copyObject: copyObject,

	setFileChunk: setFileChunk,

	convertToFileBuffer: convertToFileBuffer,

	downloadChunkSize: downloadChunkSize
};

module.exports = Utility;