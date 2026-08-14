import { db } from "../../db/client.js";
import { logs as logsTable } from "../../db/schema.js";
export const insertLogs=(logs : typeof logsTable.$inferInsert[]) => {
    return db.insert(logsTable).values(logs);
}