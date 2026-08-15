import { json } from "zod";

export type LogCursor={
    timestamp:string;
    id:string;
}

export const encodeCursor=(cursor: LogCursor) => {
    return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

export const decodeCursor=(cursor:string) => {
    const decoded=Buffer.from(cursor,"base64url").toString("utf8");
    const parsed=JSON.parse(decoded);

    if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("timestamp" in parsed) ||
        !("id" in parsed) ||
        typeof parsed.timestamp !== "string" ||
        typeof parsed.id !== "string"
    ) {
        throw new Error("Invalid cursor");
    }

    return {
        timestamp: parsed.timestamp,
        id: parsed.id,
    };
}
