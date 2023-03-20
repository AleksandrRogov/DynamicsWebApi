"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResponseHeaders = void 0;
function parseResponseHeaders(headerStr) {
    const headers = {};
    if (!headerStr) {
        return headers;
    }
    const headerPairs = headerStr.split("\u000d\u000a");
    for (let i = 0, ilen = headerPairs.length; i < ilen; i++) {
        const headerPair = headerPairs[i];
        const index = headerPair.indexOf("\u003a\u0020");
        if (index > 0) {
            headers[headerPair.substring(0, index)] = headerPair.substring(index + 2);
        }
    }
    return headers;
}
exports.parseResponseHeaders = parseResponseHeaders;
//# sourceMappingURL=parseResponseHeaders.js.map