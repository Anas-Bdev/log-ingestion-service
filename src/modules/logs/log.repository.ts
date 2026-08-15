import { and, asc, desc, eq, gte, ilike, lt, or, sql } from "drizzle-orm";
import { db } from "../../db/client.js";
import { logs as logsTable } from "../../db/schema.js";
import { AggregateLogsRequest, GetLogsRequest } from "./log.types.js";
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

export const aggregateLogsFromDatabase=(input: AggregateLogsRequest) => {
    const conditions=[];

    conditions.push(gte(logsTable.timestamp,new Date(input.since)));

    conditions.push(lt(logsTable.timestamp,new Date(input.until)));

    if(input.service)
    conditions.push(eq(logsTable.service,input.service));

    if(input.level)
    conditions.push(eq(logsTable.level,input.level));

    if(input.q)
    conditions.push(ilike(logsTable.message,`%${input.q}%`));

    for (const [key, value] of Object.entries(input.attributes)) {
        conditions.push(
            sql`${logsTable.attributes}->>${key} = ${value}`
        );
    }

    const bucketIntervals = {
    "1m": sql`INTERVAL '1 minute'`,
    "5m": sql`INTERVAL '5 minutes'`,
    "1h": sql`INTERVAL '1 hour'`,
    "1d": sql`INTERVAL '1 day'`
}
    
    const bucketInterval=bucketIntervals[input.bucket];

     const bucketStart = sql`
        date_bin(
            ${bucketInterval},
            ${logsTable.timestamp},
            TIMESTAMPTZ '1970-01-01'
        )`;

    if(!input.group_by){
        return db
               .select({
                start:bucketStart,
                group:sql<string|null>`NULL`,
                count:sql<number>`COUNT(*)::int`
               })
               .from(logsTable)
               .where(and(...conditions))
               .groupBy(bucketStart)
               .orderBy(asc(bucketStart));
    }

     if (input.group_by === "service") {
        return db
            .select({
                start: bucketStart,
                group: logsTable.service,
                count: sql<number>`COUNT(*)::int`
            })
            .from(logsTable)
            .where(and(...conditions))
            .groupBy(bucketStart, logsTable.service)
            .orderBy(asc(bucketStart));
    }

    return db
        .select({
            start: bucketStart,
            group: logsTable.level,
            count: sql<number>`COUNT(*)::int`
        })
        .from(logsTable)
        .where(and(...conditions))
        .groupBy(bucketStart, logsTable.level)
        .orderBy(asc(bucketStart));

}