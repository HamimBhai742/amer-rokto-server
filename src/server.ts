import { Server } from "http";
import { app } from "./app";
import config from "./config";
import { seedAdmin } from "./app/utils/seedAdmin";

let server:Server;

const main = async () => {
    try {
        // Seed Super Admin Core immediately on bootstrap sequences
        await seedAdmin();

        server = app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Server failed to start", error.message);
        }
        process.exit(1);  


    }   
}

main();