import { DictionaryWordGroup } from "./dictionary-word-group";

export interface DictionaryResponse {
    [id: string]: { wordGroup: DictionaryWordGroup[] } | {}; // api response -> meta -> id
}
