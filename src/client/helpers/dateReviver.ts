import { DATE_FORMAT_REGEX } from "../../helpers/Regex";

export function dateReviver(key: string, value: any): Date {
    if (typeof value === "string") {
        const a = DATE_FORMAT_REGEX.exec(value);
        if (a) {
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
        }
    }
    return value;
}
