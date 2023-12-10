export class FilterParams {
    params: any;

    constructor(params: any) {
        this.params = params;
        this.reduce();
    }

    private reduce(): void {
        for (let key of Object.keys(this.params)) {            
            if (this.params[key] === undefined) {
                delete this.params[key];
            }
        }
    }

    get_filter(): any {
        return this.params;
    }
}