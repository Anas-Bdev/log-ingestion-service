import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
const databaseUrl = process.env.DATABASE_URL!;

const client = postgres(databaseUrl);

export const db = drizzle(client);