export function getCrypto() {
    return window.crypto;
}

export function generateRandomBytes() {
    const uCrypto = getCrypto();
    return uCrypto.getRandomValues(new Uint8Array(1));
}
