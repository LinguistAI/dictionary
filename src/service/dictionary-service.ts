import { APIRequestExc, WordNotFoundExc } from "../common/exception";
import config from "../config/config";
import axios from "axios";
import { create_audio_url } from "../utils/audio-file-utils";
import { DictionaryResponse } from "../model/dictionary-response";
import { DictionaryWordGroup, WordDef } from "../model/dictionary-word-group";

export class DictionaryService {
    search_word(wordList: string[]): Promise<any> {
        const promises = wordList.map((word: string) => {
            return new Promise<DictionaryResponse>((resolve, reject) => {
                const axios_config = {
                    method: "get",
                    url: config.DICTIONARY_API_URL + word,
                    params: {
                        key: config.DICTIONARY_API_KEY,
                        format: "json",
                        jscmd: "data",
                    },
                };

                axios(axios_config)
                    .then((res) => {
                        if (res.status != 200 || typeof res.data === "string") {
                            reject(new APIRequestExc(res.data));
                        } else if (
                            Object.keys(res.data).length === 0 ||
                            (Array.isArray(res.data) &&
                                !res.data.every(
                                    (item) => typeof item === "object"
                                ))
                        ) {
                            const result: DictionaryResponse = {
                                [word]: {},
                            };
                            resolve(result);
                        } else {
                            console.log("status: ", res.status);
                            console.log("data: ", res.data);
                            const dict_response = JSON.parse(
                                JSON.stringify(res.data)
                            );
                            console.log("data: ", res.data);
                            const wordGroup: DictionaryWordGroup[] =
                                dict_response
                                    .map((entry: any) =>
                                        this.extract_dict_data(word, entry)
                                    )
                                    .filter(
                                        (result: DictionaryWordGroup | null) =>
                                            result != null
                                    );

                            const result: DictionaryResponse = {
                                [word]: { wordGroup },
                            };

                            resolve(result);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        });

        return Promise.all(promises).then((data) => {
            return data.reduce((wordObj: Record<string, any>, item: any) => {
                const key = Object.keys(item)[0];
                wordObj[key] = item[key];
                return wordObj;
            }, {});
        });
    }

    // public search_word_list(
    //     wordList: string[]
    // ): Promise<DictionaryResponse | DictionaryResponse[]> {
    //     const promises: Promise<DictionaryResponse | DictionaryResponse[]>[] =
    //         wordList.map((word: string) => {
    //             return this.search_word(word);
    //         });

    //     await Promise.all(promises)
    //         .then((results: (DictionaryResponse | DictionaryResponse[])[]) => {
    //             // Handle results here
    //             console.log(results);
    //         })
    //         .catch((error: any) => {
    //             // Handle errors
    //             console.error(error);
    //         });
    // }

    private extract_dict_data(
        word: string,
        jsonEntry: any
    ): DictionaryWordGroup | undefined {
        const { meta, def, hwi, fl } = jsonEntry;
        const idPattern: RegExp = new RegExp(`^[${word}:0-9]+$`);

        // if definitions are not of the exact search word, do not process them
        if (!(idPattern.test(meta.id) || word.trim() == meta.id)) {
            return undefined;
        }

        // extract the definitions and example usages
        const definitionArray: WordDef[] = def?.[0]?.sseq?.map(
            this.extract_def
        );

        console.log("audio: ", hwi?.prs?.[0]?.sound?.audio);

        // extract meta id, audio file name, and functional label
        const result: DictionaryWordGroup = {
            id: meta.id,
            word: word,
            audio: hwi?.prs?.[0]?.sound?.audio
                ? create_audio_url(hwi?.prs?.[0]?.sound?.audio)
                : "",
            func_label: fl || "",
            meaning: definitionArray,
        };

        return result;
    }

    private extract_def(sseq: any): WordDef {
        const definitionObj: WordDef = {
            definition: sseq?.[0]?.[1]?.dt?.[0]?.[1] || "",
            examples:
                sseq[0]?.[1]?.dt?.[1]?.[1]?.map((def: { t: any }) => def.t) ||
                [],
        };

        return definitionObj;
    }
}
