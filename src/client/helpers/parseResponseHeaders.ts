export function parseResponseHeaders(headerStr: string): Record<string, string> {
	const headers: Record<string, string> = {};
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
