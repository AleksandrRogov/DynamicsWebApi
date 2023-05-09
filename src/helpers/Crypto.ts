let nCrypto;
if (!global.DWA_BROWSER) nCrypto = require("crypto");

export function getCrypto<T = any>(): T {
    return global.DWA_BROWSER ? global.window.crypto : nCrypto;
}

export function generateRandomBytes() {
    return global.DWA_BROWSER ? getCrypto().getRandomValues(new Uint8Array(1)) : getCrypto().randomBytes(1);
}
