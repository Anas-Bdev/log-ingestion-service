import { Request, Response } from "express";
import { ingestLogsRequestSchema } from "./log.validation.js";
import { ingestLogs } from "./log.service.js";
export const ingestLogsController=async (req : Request, res: Response) => {
    const requestResult=ingestLogsRequestSchema.safeParse(req.body);

    if(!requestResult.success){
        return res.status(400).json({
            error:"Invalid request body"
        })
    }

    const result=await ingestLogs(requestResult.data.logs);
    if(result.accepted===0){
        return res.status(400).json(result);
    }

    return res.json(result);

}