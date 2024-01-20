import { DictionaryResponse, WordDef } from "../model/dictionary-response";
import { AxiosExc, WordNotFoundExc } from "../common/exception";
import config from "../config/config";
import { WordSearchParams } from "../common/search-word-params";
import axios from "axios";

export class DictionaryService {
    // search_word(
    //     word: string
    // ): Promise<DictionaryResponse[] | DictionaryResponse> {
    //     return new Promise<DictionaryResponse[] | DictionaryResponse>(
    //         (resolve, reject) => {
    //             this.get_word_by_name(word)
    //                 .then((dict: DictionaryResponse[]) => {
    //                     resolve(dict);
    //                 })
    //                 .catch((err) => {
    //                     reject(err);
    //                 });
    //         }
    //     );
    // }

    // get_dummy(word: string): Promise<DictionaryResponse> {
    //     return new Promise<DictionaryResponse>((resolve, reject) => {
    //         if (word.charAt(0) === word.charAt(0).toUpperCase()) {
    //             reject(new WordNotFoundExc(`${word} starts with upper case!`));
    //         } else {
    //             const dictionary: DictionaryResponse = {
    //                 word: word,
    //                 meaning: "good word",
    //             };
    //             resolve(dictionary);
    //         }
    //     });
    // }

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

                            let results: DictionaryResponse[] = [];

                            console.log(dict_response);
                            for (
                                let i: number = 0;
                                i < dict_response.length;
                                i++
                            ) {
                                if (
                                    dict_response[i].meta.id !=
                                    `${word}:${i + 1}`
                                ) {
                                    break;
                                }

                                let meanings: WordDef[] = [];
                                for (
                                    let j: number = 0;
                                    j < dict_response[i].def.sseq.length;
                                    j++
                                ) {
                                    const def: WordDef = {
                                        definition:
                                            dict_response[i].def.sseq[j][0]
                                                .sense.dt[0][1],
                                        examples: dict_response[i].def.sseq[
                                            j
                                        ][0].sense.dt[1][1].map(
                                            (item: { t: any }) => item.t
                                        ),
                                    };

                                    meanings.push(def);
                                }

                                const result: DictionaryResponse = {
                                    id: dict_response[i].meta.id,
                                    word: word,
                                    audio: dict_response[i].hwi.prs[0]?.sound
                                        .audio,
                                    func_label: dict_response[i].fl,
                                    meaning: meanings,
                                };

                                results.push(result);
                            }
                            // const dictionary: DictionaryResponse = {
                            //     word: word,
                            //     meaning: dict_response.meaning, // TODO update accoridng to api
                            // };
                            resolve(results);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }
        );
    }
}
