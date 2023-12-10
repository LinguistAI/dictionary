export class ResponseSuccess {
    data?: any;
    message: string;

    constructor(msg: string, data?: any) {
        this.data = data;
        this.message = msg;
    }
}