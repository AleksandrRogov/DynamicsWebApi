import type { ReferenceObject } from "../types";

const UUID = "[0-9a-fA-F]{8}[-]?([0-9a-fA-F]{4}[-]?){3}[0-9a-fA-F]{12}";

export const UUID_REGEX = new RegExp(UUID, "i");
export const EXTRACT_UUID_REGEX = new RegExp("^{?(" + UUID + ")}?$", "i");
export const EXTRACT_UUID_FROM_URL_REGEX = new RegExp("(" + UUID + ")\\)$", "i");
//global here is fine because the state is reset inside string.replace function
export const REMOVE_BRACKETS_FROM_UUID_REGEX = new RegExp(`{(${UUID})}`, "g");
export const ENTITY_UUID_REGEX = new RegExp(`\\/(\\w+)\\((${UUID})`, "i");

export function isUuid(value: string): boolean {
    const match = UUID_REGEX.exec(value);
    return !!match;
}

export function extractUuid(value: string): string | null {
    const match = EXTRACT_UUID_REGEX.exec(value);
    return match ? match[1] : null;
}

export function extractUuidFromUrl(url?: string): string | null {
    if (!url) return null;
    const match = EXTRACT_UUID_FROM_URL_REGEX.exec(url);
    return match ? match[1] : null;
}

export function removeCurlyBracketsFromUuid(value: string): string {
    return value.replace(REMOVE_BRACKETS_FROM_UUID_REGEX, (_match, p1) => p1);
}

const QUOTATION_MARK_REGEX = /(["'].*?["'])/;

/**
 * Safely removes curly brackets from guids in a URL
 * @param url URL to remove curly brackets from
 * @returns URL with guid without curly brackets
 */
export function safelyRemoveCurlyBracketsFromUrl(url: string): string {
    //todo: in future I will need to replace this with a negative lookbehind and lookahead

    // Split the filter string by quotation marks
    const parts = url.split(QUOTATION_MARK_REGEX);
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

/**
 * Converts a response to a reference object
 * @param {Object} responseData - Response object
 * @returns {ReferenceObject}
 */
export function convertToReferenceObject(responseData: Record<string, any>): ReferenceObject {
    const result = ENTITY_UUID_REGEX.exec(responseData["@odata.id"]);
    return { id: result![2], collection: result![1], oDataContext: responseData["@odata.context"] };
}

export const PAGING_COOKIE_REGEX = /pagingcookie="(<cookie page="(\d+)".+<\/cookie>)/;
export const SPECIAL_CHARACTER_REGEX = /[<>"']/g;

/**
 * Parses a paging cookie
 * @param pagingCookie Paging cookie to parse
 * @returns
 */
export function parsePagingCookie(pagingCookie: string) {
    const info = PAGING_COOKIE_REGEX.exec(pagingCookie);

    if (!info) return null;

    const page = parseInt(info[2], 10);
    const sanitizedCookie = sanitizeCookie(info[1]);

    return { page, sanitizedCookie };
}

/**
 * Sanitizes a cookie
 * @param cookie Cookie to sanitize
 * @returns
 */
function sanitizeCookie(cookie: string): string {
    const characterMap: { [key: string]: string } = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;", // Use numeric reference for single quote to avoid confusion
    };

    return cookie.replace(SPECIAL_CHARACTER_REGEX, (char) => characterMap[char]);
}

const LEADING_SLASH_REGEX = /^\//;
export function removeLeadingSlash(value: string): string {
    return value.replace(LEADING_SLASH_REGEX, "");
}

const UNICODE_SYMBOLS_REGEX = /[\u007F-\uFFFF]/g;
export function escapeUnicodeSymbols(value: string): string {
    return value.replace(UNICODE_SYMBOLS_REGEX, (chr: string) => `\\u${("0000" + chr.charCodeAt(0).toString(16)).slice(-4)}`);
}

const DOUBLE_QUOTE_REGEX = /"/g;
export function removeDoubleQuotes(value: string): string {
    return value.replace(DOUBLE_QUOTE_REGEX, "");
}

export const BATCH_RESPONSE_HEADERS_REGEX = /^([^()<>@,;:\\"\/[\]?={} \t]+)\s?:\s?(.*)/;
export const HTTP_STATUS_REGEX = /HTTP\/?\s*[\d.]*\s+(\d{3})\s+([\w\s]*)$/m;
export const CONTENT_TYPE_PLAIN_REGEX = /Content-Type: text\/plain/i;
export const ODATA_ENTITYID_REGEX = /OData-EntityId.+/i;
export const TEXT_REGEX = /\w+$/g;
export const LINE_ENDING_REGEX = /\r?\n/;
export const SEARCH_FOR_ENTITY_NAME_REGEX = /(\w+)(\([\d\w-]+\))$/;
