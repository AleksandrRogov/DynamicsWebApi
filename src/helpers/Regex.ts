const uuid = "[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}";

export function isUuid(value: string): boolean {
    const match = new RegExp(uuid, "i").exec(value);
    return !!match;
}

export function extractUuid(value: string): string | null {
    const match = new RegExp("^{?(" + uuid + ")}?$", "i").exec(value);
    return match ? match[1] : null;
}

export function extractUuidFromUrl(url: string): string | null {
    const match = new RegExp("(" + uuid + ")\\)$", "i").exec(url);
    return match ? match[1] : null;
}
