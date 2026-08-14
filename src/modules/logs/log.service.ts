import { serial } from "drizzle-orm/mysql-core";
import { logLevelSchema, logRequestSchema } from "./log.validation.js";
import { LogRequest } from "./log.types.js";
import { insertLogs } from "./log.repository.js";

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
            id:crypto.randomUUID(),
            timestamp:new Date(log.timestamp),
            level:log.level,
            serviceName:log.service,
            message:log.message,
            attributes:log.attributes
        }));

        await insertLogs(rows);
    }
    return {accepted: validLogs.length,rejected};
};