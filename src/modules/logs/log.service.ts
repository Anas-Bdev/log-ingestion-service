import { logLevelSchema, logRequestSchema } from "./log.validation.js";
import { AggregateLogsRequest, GetLogsRequest, LogRequest } from "./log.types.js";
import { aggregateLogsFromDatabase, getLogsFromDatabase, insertLogs } from "./log.repository.js";
import { encodeCursor } from "./log.cursor.js";
import { string } from "zod";

export const ingestLogs=async (logs:unknown[]) => {
    const validLogs : LogRequest[]=[];
    const rejected=[];

    for(const [index,log] of logs.entries()){
       const result=logRequestSchema.safeParse(log);

       if(!result.success){
        rejected.push({index, reason: result.error.issues[0]?.message ?? "Invalid log"});

        continue;
       }
       validLogs.push(result.data);
       
    }

    if(validLogs.length > 0){
        const rows=validLogs.map(log => ({
            timestamp:new Date(log.timestamp),
            level:log.level,
            service:log.service,
            message:log.message,
            attributes:log.attributes,
            indexedAttributes:Object.fromEntries(
                Object.entries(log.attributes ?? {}).map(([key,value]) => [
                    key,
                    String(value)
                ])
            )
        }));

        await insertLogs(rows);
    }
    return {accepted: validLogs.length,rejected};
};

export const getLogs=async (input : GetLogsRequest) => {
    const logs=await getLogsFromDatabase(input);

    const hasMore=logs.length > input.limit;
    let nextCursor:string | null=null;

    if(hasMore){
        logs.pop();
        let lastLog=logs[logs.length-1];
        nextCursor=encodeCursor({
            timestamp:lastLog.timestamp.toISOString(),
            id:lastLog.id
        });

    }
    return {logs,next_cursor:nextCursor};

}

export const aggregateLogs=(input: AggregateLogsRequest) => {
    return aggregateLogsFromDatabase(input);
}