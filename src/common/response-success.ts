import moment from "moment-timezone";
export class ResponseSuccess {
    data?: any;
    msg: string;
    timestamp: string;
    status: number;

    constructor(msg: string, status: number, data?: any) {
        this.data = data;
        this.msg = msg;
        this.timestamp = moment().tz("Europe/Istanbul").format();
        this.status = status;
    }
}
