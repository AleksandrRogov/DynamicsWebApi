//had to move getCrypto for node to a different local module,
//because esbuild does not support external require in esm format
import nCrypto from "node:crypto";

export function getCrypto () {
    return nCrypto;
}