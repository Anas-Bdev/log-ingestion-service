import type { ErrorRequestHandler } from "express";

export const errorHandler:ErrorRequestHandler=(
    err,
    req,
    res,
    next
) => {
    console.error(err);

     if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json({
            error: "Malformed JSON"
        });
        return;
    }

    res.status(500).json({
        error:"Internal server error"
    })
}
