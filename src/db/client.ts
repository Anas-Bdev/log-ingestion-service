import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
const databaseUrl = process.env.DATABASE_URL!;

const writeClient=postgres(databaseUrl,{
    max:3
});

const readClient=postgres(databaseUrl,{
    max:5
});

export const dbWrite = drizzle(writeClient);
export const dbRead=drizzle(readClient);