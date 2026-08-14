import express from "express";
import router from "./modules/logs/log.routes.js";
 const app=express();
app.use(express.json());
app.use(router)
export default app;