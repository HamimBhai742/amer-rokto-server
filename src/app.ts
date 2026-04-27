import express, { Application } from "express";
import { router } from "./app/routes";
import notFound from "./app/utils/not.found";
import globalErrorHandler from "./app/middleware/global.error";



export const app:Application=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/v1",router)

app.get("/",(req,res)=>{
    res.send("Server is running........");
}); 


app.use(notFound)

app.use(globalErrorHandler)
