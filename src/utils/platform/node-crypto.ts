import crypto from "crypto";

export function getCrypto() {
    return crypto;
}

export function generateRandomBytes() {
    const uCrypto = getCrypto();
    return uCrypto.randomBytes(1);
}
