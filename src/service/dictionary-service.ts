import { DictionaryResponse, WordDef } from "../model/dictionary-response";
import { Router, Request, Response, NextFunction } from "express";
import { AxiosExc, WordNotFoundExc } from "../common/exception";
import config from "../config/config";
import { WordSearchParams } from "../common/search-word-params";
import axios from "axios";

export class DictionaryService {
    // this one does not work properly -> proposal: fe sends request to these url
    get_auido_file(filename: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const axios_config = {
                method: "get",
                url: "https://media.merriam-webster.com/audio/prons/en/us/mp3/p/pajama02.mp3",
            };

            axios(axios_config)
                .then((res) => {
                    if (res.status != 200) {
                        reject(new AxiosExc());
                    } else if (Object.keys(res.data).length === 0) {
                        reject(new WordNotFoundExc());
                    } else {
                        console.log("in the service");
                        resolve(Buffer.from(res.data, "binary"));
                    }
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    search_word(
        word: string
    ): Promise<DictionaryResponse | DictionaryResponse[]> {
        return new Promise<DictionaryResponse | DictionaryResponse[]>(
            (resolve, reject) => {
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
                        if (res.status != 200) {
                            reject(new AxiosExc());
                        } else if (Object.keys(res.data).length === 0) {
                            reject(new WordNotFoundExc());
                        } else {
                            const dict_response = JSON.parse(
                                JSON.stringify(res.data)
                            );
                            const results: DictionaryResponse[] = dict_response
                                .map((entry: any) =>
                                    this.extract_dict_data(word, entry)
                                )
                                .filter(
                                    (result: DictionaryResponse | null) =>
                                        result != null
                                );
                            resolve(results);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            }
        );
    }

    extract_dict_data(
        word: string,
        jsonEntry: any
    ): DictionaryResponse | undefined {
        const { meta, def, hwi, fl } = jsonEntry;
        const idPattern: RegExp = new RegExp(`^[${word}:0-9]+$`);

        // if definitions are not of the exact search word, do not process them
        if (!idPattern.test(meta.id)) {
            return undefined;
        }

        // extract the definitions and example usages
        const definitionArray: WordDef[] = def?.[0]?.sseq?.map(
            this.extract_def
        );

        // extract meta id, audio file name, and functional label
        const result: DictionaryResponse = {
            id: meta.id,
            word: word,
            audio: hwi?.prs?.[0]?.sound?.audio || "",
            func_label: fl || "",
            meaning: definitionArray,
        };

        return result;
    }

    extract_def(sseq: any): WordDef {
        const definitionObj: WordDef = {
            definition: sseq?.[0]?.[1]?.dt?.[0]?.[1] || "",
            examples:
                sseq[0]?.[1]?.dt?.[1]?.[1]?.map((def: { t: any }) => def.t) ||
                [],
        };

        return definitionObj;
    }
}
