import {z} from "zod";
export const ingestLogsRequestSchema = z.object({
  logs: z.array(z.unknown()),
});

export const logLevelSchema=z.enum([
    "debug",
    "info",
    "warn",
    "error"
]);

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