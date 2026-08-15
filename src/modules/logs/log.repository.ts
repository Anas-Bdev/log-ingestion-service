import { and, desc, eq, gte, ilike, lt, or, sql, SQL } from "drizzle-orm";
import { db } from "../../db/client.js";
import { logs as logsTable } from "../../db/schema.js";
import { GetLogsRequest } from "./log.types.js";
import { object } from "zod";
import { decodeCursor } from "./log.cursor.js";
export const insertLogs=(logs : typeof logsTable.$inferInsert[]) => {
    return db.insert(logsTable).values(logs);
}

export const getLogsFromDatabase=async(input : GetLogsRequest) => {
    const conditions =[];

    if(input.service)
        conditions.push(eq(logsTable.service,input.service));

    if(input.level)
        conditions.push(eq(logsTable.level,input.level));

     if(input.since)
        conditions.push(gte(logsTable.timestamp,new Date(input.since)));

     if(input.until)
        conditions.push(lt(logsTable.timestamp,new Date(input.until)));

     if(input.q)
        conditions.push(ilike(logsTable.message,`%${input.q}%`));

     for (const [key, value] of Object.entries(input.attributes)) {
    conditions.push(
        sql`${logsTable.attributes}->>${key} = ${value}`
    );
}

     if(input.cursor){
        const cursor=decodeCursor(input.cursor);
        conditions.push(
         or(
            lt(logsTable.timestamp,new Date(cursor.timestamp)),
            and(
                eq(logsTable.timestamp,new Date(cursor.timestamp)),
                lt(logsTable.id,cursor.id)
            )
         )
        )
     }
     return db
            .select()
            .from(logsTable)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(
                desc(logsTable.timestamp),
                desc(logsTable.id)
            )
            .limit(input.limit+1);
    
}