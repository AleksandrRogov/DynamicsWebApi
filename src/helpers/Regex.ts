const uuid = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";

const uuidRegExp = new RegExp(uuid, "i");
const extractUuidRegExp = new RegExp("^{?(" + uuid + ")}?$", "i");
const extractUuidFromUrlRegExp = new RegExp("(" + uuid + ")\\)$", "i");
//global here is fine because the state is reset inside string.replace function
const removeBracketsFromGuidReg = new RegExp(`{(${uuid})}`, "g");

export function isUuid(value: string): boolean {
    const match = uuidRegExp.exec(value);
    return !!match;
}

export function extractUuid(value: string): string | null {
    const match = extractUuidRegExp.exec(value);
    return match ? match[1] : null;
}

export function extractUuidFromUrl(url: string): string | null {
    const match = extractUuidFromUrlRegExp.exec(url);
    return match ? match[1] : null;
}

export function removeCurlyBracketsFromUuid(value: string): string {
    return value.replace(removeBracketsFromGuidReg, (_match, p1) => p1);
}

export function safelyRemoveCurlyBracketsFromUrl(url: string): string {
    //todo: in future I will need to replace this with a negative lookbehind and lookahead

    // Split the filter string by quotation marks
    const parts = url.split(/(["'].*?["'])/);
    return parts
        .map((part, index) => {
            // Only process parts that are not within quotes
            if (index % 2 === 0) {
                return removeCurlyBracketsFromUuid(part);
            }
            return part;
        })
        .join("");
}
