import { FilterParams } from "./base-params";

export class WordSearchParams extends FilterParams {
    word!: string;

    constructor(params: any) {
        super(params);

        if (this.params.word) {
            this.word = this.params.word;
        }

        delete this.params;
    }
}
