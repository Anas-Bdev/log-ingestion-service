import app from "./app.js";
import { initializeDatabase } from "./db/migrate.js";

const port = 8080;

const start = async () => {
    try {
        await initializeDatabase();

        app.listen(port, () => {
            console.log(`Server listens on port ${port}`);
        });
    } catch (error) {
        console.error(
            "Failed to initialize application:",
            error
        );

        process.exit(1);
    }
};

start();