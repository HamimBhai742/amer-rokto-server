import { Server } from "http";
import { app } from "./app";
import config from "./config";

let server:Server;

const main =()=>{
    try {
        server=app.listen(config.port,()=>{
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