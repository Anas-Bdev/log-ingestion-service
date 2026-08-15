import {date, z} from "zod";
import { decodeCursor } from "./log.cursor.js";
export const ingestLogsRequestSchema = z.object({
  logs: z.array(z.unknown()),
});

const cursorSchema = z.string().refine(
    (cursor) => {
        try {
            decodeCursor(cursor);
            return true;
        } catch {
            return false;
        }
    },
    {
        message: "Invalid or malformed cursor"
    }
);

export const logLevelSchema=z.enum([
    "debug",
    "info",
    "warn",
    "error"
]);

export const bucketSchema=z.enum(["1m","5m","1h","1d"]);
export const groupBySchema=z.enum(["service","level"]);

export const aggregateLogsQuerySchema=z.object({
    service:z.string().optional(),
    level:logLevelSchema.optional(),
    since:z.iso.datetime({offset:true}),
    until:z.iso.datetime({offset:true}),
    bucket:bucketSchema,
    group_by:groupBySchema.optional(),
    q:z.string().optional()
}).refine(
    data => new Date(data.until) >= new Date(data.since),
    {
        message: "until must not be earlier than since",
        path:["until"]
    }
);

export const getLogsQuerySchema=z.object({
    service: z.string().optional(),
    level:logLevelSchema.optional(),
    since:z.iso.datetime({offset:true}).optional(),
    until:z.iso.datetime({offset:true}).optional(),
    q:z.string().optional(),
    limit:z.coerce.number().int().min(1).max(1000).default(100),
    cursor:cursorSchema.optional()
}).refine(
    data => {
        if (!data.since || !data.until) {
            return true;
        }

        return new Date(data.until) >= new Date(data.since);
    },
    {
        message: "until must not be earlier than since",
        path: ["until"]
    }
);

export const logRequestSchema=z.object({
    timestamp : z.iso.datetime({offset:true}).refine(
        (value) => {
            const timestamp=new Date(value);
            const fiveMinutesFromNow=Date.now() + 5 *60 *1000;
            return timestamp.getTime() <= fiveMinutesFromNow;
        },
        {
            message:"Timestamp must not be more than five minutes in the future",
        }
    ),
    level:logLevelSchema,
    service:z.string().min(1),
    message:z.string().min(1),
    attributes:z.record(z.string(), z.union([z.string(), z.number(),z.boolean()])).optional()

})
