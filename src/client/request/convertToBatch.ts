import { processData, setStandardHeaders } from ".";
import { InternalConfig } from "../../utils/Config";
import { generateUUID } from "../../utils/Utility";
import type { InternalBatchRequest, InternalRequest } from "../../types";

export const convertToBatch = (requests: InternalRequest[], config: InternalConfig, batchRequest?: InternalRequest): InternalBatchRequest => {
    const batchBoundary = `dwa_batch_${generateUUID()}`;

    const batchBody: string[] = [];
    let currentChangeSet: string | null = null;
    let contentId = 100000;

    const addHeaders = (headers: Record<string, string>, batchBody: string[]) => {
        for (const key in headers) {
            if (key === "Authorization" || key === "Content-ID") continue;
            batchBody.push(`${key}: ${headers[key]}`);
        }
    };

    requests.forEach((internalRequest) => {
        internalRequest.functionName = "executeBatch";
        if (batchRequest?.inChangeSet === false) internalRequest.inChangeSet = false;
        const inChangeSet = internalRequest.method === "GET" ? false : !!internalRequest.inChangeSet;

        if (!inChangeSet && currentChangeSet) {
            //end current change set
            batchBody.push(`\r\n--${currentChangeSet}--`);

            currentChangeSet = null;
            contentId = 100000;
        }

        if (!currentChangeSet) {
            batchBody.push(`\r\n--${batchBoundary}`);

            if (inChangeSet) {
                currentChangeSet = `changeset_${generateUUID()}`;
                batchBody.push("Content-Type: multipart/mixed;boundary=" + currentChangeSet);
            }
        }

        if (inChangeSet) {
            batchBody.push(`\r\n--${currentChangeSet}`);
        }

        batchBody.push("Content-Type: application/http");
        batchBody.push("Content-Transfer-Encoding: binary");

        if (inChangeSet) {
            const contentIdValue = internalRequest.headers!.hasOwnProperty("Content-ID") ? internalRequest.headers!["Content-ID"] : ++contentId;

            batchBody.push(`Content-ID: ${contentIdValue}`);
        }

        if (!internalRequest.path?.startsWith("$")) {
            batchBody.push(`\r\n${internalRequest.method} ${config.dataApi.url}${internalRequest.path} HTTP/1.1`);
        } else {
            batchBody.push(`\r\n${internalRequest.method} ${internalRequest.path} HTTP/1.1`);
        }

        if (internalRequest.method === "GET") {
            batchBody.push("Accept: application/json");
        } else {
            batchBody.push("Content-Type: application/json");
        }

        if (internalRequest.headers) {
            addHeaders(internalRequest.headers, batchBody);
        }

        if (internalRequest.data) {
            batchBody.push(`\r\n${processData(internalRequest.data, config)}`);
        }
    });

    if (currentChangeSet) {
        batchBody.push(`\r\n--${currentChangeSet}--`);
    }

    batchBody.push(`\r\n--${batchBoundary}--\r\n`);

    const headers = setStandardHeaders(batchRequest?.userHeaders, batchRequest?.data);
    headers["Content-Type"] = `multipart/mixed;boundary=${batchBoundary}`;

    return { headers: headers, body: batchBody.join("\r\n") };
};
