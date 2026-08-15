import express from "express";
import router from "./modules/logs/log.routes.js";
 const app=express();
app.use(express.json());
app.use(router)
app.get("/health",(req,res) => {
    res.json({
        status:"ok"
    });
});
export default app;