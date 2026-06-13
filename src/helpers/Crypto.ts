import { getCrypto as getCryptoFromNode } from "./crypto/node.js";

export function getCrypto<T = any>(): T {
    return global.DWA_BROWSER ? (global.window.crypto as T) : getCryptoFromNode() as T;
}
