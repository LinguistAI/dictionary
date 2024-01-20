import { DictionaryResponse } from "../model/dictionary-response";
import { AxiosExc, WordNotFoundExc } from "../common/exception";
import config from "../config/config";
import { WordSearchParams } from "../common/search-word-params";
import axios from "axios";

export class DictionaryService {
    search_word(
        param: WordSearchParams
    ): Promise<DictionaryResponse[] | DictionaryResponse> {
        return new Promise<DictionaryResponse[] | DictionaryResponse>(
            (resolve, reject) => {
                this.get_dummy(param.word)
                    .then((dict: DictionaryResponse) => {
                        resolve(dict);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }
        );
    }

    get_dummy(word: string): Promise<DictionaryResponse> {
        return new Promise<DictionaryResponse>((resolve, reject) => {
            if (word.charAt(0) === word.charAt(0).toUpperCase()) {
                reject(new WordNotFoundExc(`${word} starts with upper case!`));
            } else {
                const dictionary: DictionaryResponse = {
                    word: word,
                    meaning: "good word",
                };
                resolve(dictionary);
            }
        });
    }

    get_word_by_name(word: string): Promise<DictionaryResponse> {
        return new Promise<DictionaryResponse>((resolve, reject) => {
            const axios_config = {
                method: "get",
                url: config.OPENLIB_BOOK_URL, // TODO: update this according to the api
                params: {
                    bibkeys: `ISBN:${word}`,
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
                        const dictionary: DictionaryResponse = {
                            word: word,
                            meaning: dict_response.meaning, // TODO update accoridng to api
                        };
                        resolve(dictionary);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}
