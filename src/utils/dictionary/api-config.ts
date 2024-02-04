import config from "../../config/config";
import { DictionaryResponse } from "../../model/dictionary-response";
import { DictionaryWordGroup } from "../../model/dictionary-word-group";

export interface APIConfig {
    axiosConfig: (word: string) => any;
    extractDictData: (word: string, data: any) => DictionaryWordGroup[];
    handleErrors: (res: any) => any;
    handleEdgeCases: (res: any, word: string) => DictionaryResponse | null;
}
