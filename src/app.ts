import express from "express";
import router from "./modules/logs/log.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
 const app=express();
app.use(express.json());
app.use(router)
app.get("/health",(req,res) => {
    res.json({
        status:"ok"
    });
});

app.use(errorHandler);
export default app;