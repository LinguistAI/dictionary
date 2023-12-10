import moment from "moment-timezone";
export class ResponseSuccess {
    data?: any;
    message: string;
    timestamp: string;

    constructor(msg: string, data?: any) {
        this.data = data;
        this.message = msg;
        this.timestamp = moment().tz("Europe/Istanbul").format();
    }
}
