import { StatusCodes } from "http-status-codes";

export class Exception extends Error {
    status: number;
    data?: any;
    message: string;
    error: any;
    validation_error?: string[];

    constructor(
        status: number,
        message: string,
        error: string,
        validation_error?: string[],
        data?: any
    ) {
        super();

        this.status = status;
        this.data = data;
        this.message = message;
        this.error = error;
        this.validation_error = validation_error;
    }
}

export class InvalidRequestBodyExc extends Exception {
    constructor(error: string) {
        super(StatusCodes.BAD_REQUEST, "Invalid request content", error);
    }
}

export class ValidationExc extends Exception {
    constructor(error: any) {
        super(StatusCodes.BAD_REQUEST, "Wrong request content!", "");

        this.validation_error = [];
        for (let detail of error.details) {
            this.validation_error.push(detail.message);
        }
    }
}

export class UnauthExc extends Exception {
    constructor(error?: any) {
        let err: string = error || "Unauthorized";
        super(StatusCodes.UNAUTHORIZED, "Unauthorized", err);
    }
}

export class APIRequestExc extends Exception {
    constructor(error?: any) {
        let err: string = error || "Parameters are incorrect";
        super(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Request to external service is not successful",
            err
        );
    }
}

export class WordNotFoundExc extends Exception {
    constructor(error?: any) {
        let err: string = error || "Word not found";
        super(
            StatusCodes.NOT_FOUND,
            "The word you are looking for does not exist!",
            err
        );
    }
}

export class NoPermissionExc extends Exception {
    constructor(error?: any) {
        let err: string = error || "No permission";
        super(StatusCodes.UNAUTHORIZED, "Unauthorized", err);
    }
}

export class ConfigNotLoadedExc extends Exception {
    constructor(error?: any) {
        let err: string = error || "Configs not loaded";
        super(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Configs are not loaded properly",
            err
        );
    }
}
