export interface DictionaryWordGroup {
    id: string; // api response -> meta -> id
    word: string;
    audio: string; // 2.6 PRONUNCIATIONS: PRS in documentation
    func_label: string; // verb, noun, adjective, etc.
    meaning: WordDef[];
}

export interface WordDef {
    definition: string;
    examples?: string[];
}
