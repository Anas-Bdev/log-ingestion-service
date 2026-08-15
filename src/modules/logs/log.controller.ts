import { Request, Response } from "express";
import { aggregateLogsQuerySchema, getLogsQuerySchema, ingestLogsRequestSchema } from "./log.validation.js";
import { aggregateLogs, getLogs, ingestLogs } from "./log.service.js";
export const ingestLogsController=async (req : Request, res: Response) => {
    const requestResult=ingestLogsRequestSchema.safeParse(req.body);

    if(!requestResult.success){
        return res.status(400).json({
        error: requestResult.error.issues[0].message

        })
    }

    const result=await ingestLogs(requestResult.data.logs);
    if(result.accepted===0){
        return res.status(400).json(result);
    }

    return res.json(result);

}

export const getLogsController=async (req:Request,res:Response) => {
    const requestResult=getLogsQuerySchema.safeParse(req.query);

    if(!requestResult.success){
        return res.status(400).json({
        error: requestResult.error.issues[0].message

        });
    }
    const attributes:Record<string,string>={};
    for(const [key,value] of Object.entries(req.query)){
        if (key.startsWith("attr.") && typeof value === "string") {
        attributes[key.substring(5)] = value;
    }
    
    }
    const input={
        ...requestResult.data,
        attributes
    };

    const result=await getLogs(input);

    return res.json(result);



}

export const aggregateLogsController=async(req : Request,res : Response) => {
    const requestResult=aggregateLogsQuerySchema.safeParse(req.query);

    if(!requestResult.success){
        return res.status(400).json({
            error:requestResult.error.issues[0].message
        });
    }

    const attributes:Record<string,string>={};
    for(const [key,value] of Object.entries(req.query)){
        if (key.startsWith("attr.") && typeof value === "string") {
        attributes[key.substring(5)] = value;
    }
    }

    const input={
        ...requestResult.data,
        attributes
    }

    var result=await aggregateLogs(input);

    return res.json({buckets:result});


}