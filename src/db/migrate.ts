import "dotenv/config";

import postgres from "postgres";

import {
    migrate,
} from "drizzle-orm/postgres-js/migrator";

import {
    drizzle,
} from "drizzle-orm/postgres-js";



const databaseUrl =
    process.env.DATABASE_URL!;


export const initializeDatabase =
    async () => {

        const client =
            postgres(databaseUrl);

        const db =
            drizzle(client);


        await migrate(db, {
            migrationsFolder:
                "./drizzle/migrations",
        });
        

        await client.end();
    };
