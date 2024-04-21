import { Exception } from "../common/exception";
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../common/error";
import moment from "moment-timezone";

function error_middleware(
    error: Exception,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const status: number = error.status || 500;
    const err_res: ErrorResponse = {
        error: error.validation_error || error.error || "error",
        msg: error.message || "something went wrong",
        timestamp: moment().tz("Europe/Istanbul").format(),
        status: status 
    };

    res.status(status).send(err_res);
}

export default error_middleware;
