import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    
    if (err?.type === "entity.parse.failed") {
        res.status(400).json({
            error: "Malformed JSON"
        });
        return;
    }

    res.status(500).json({
        error: "Internal server error"
    });
};
