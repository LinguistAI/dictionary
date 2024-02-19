import { APIRequestExc, WordNotFoundExc } from "../common/exception";
import config from "../config/config";
import axios from "axios";
import { DictionaryResponse } from "../model/dictionary-response";
import { DictionaryWordGroup, WordDef } from "../model/dictionary-word-group";
import { create_audio_url } from "../utils/dictionary/audio-file-utils";
import { APIConfig } from "../utils/dictionary/api-config";
import { MarriemWebsterConfig } from "../utils/dictionary/config-merriam-webster";
import { FreeDictConfig } from "../utils/dictionary/config-free-dict";

export class DictionaryService {
    search_word(wordList: string[]): Promise<any> {
        const promises = wordList.map((word: string) => {
            return new Promise<DictionaryResponse>((resolve, reject) => {
                const apiConfig = this.select_api();

                axios(apiConfig.axiosConfig(word))
                    .then((res) => {
                        apiConfig.handleErrors(res);
                        const edgeCaseResult: DictionaryResponse | null =
                            apiConfig.handleEdgeCases(res, word);

                        if (edgeCaseResult) {
                            resolve(edgeCaseResult);
                        } else {
                            const dictResponse = JSON.parse(
                                JSON.stringify(res.data)
                            );
                            const wordGroup: DictionaryWordGroup[] =
                                apiConfig.extractDictData(word, dictResponse);

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

        // reshape response by removing array structure
        return Promise.all(promises).then((data) => {
            return data.reduce((wordObj: Record<string, any>, item: any) => {
                const key = Object.keys(item)[0];
                wordObj[key] = item[key];
                return wordObj;
            }, {});
        });
    }

    private select_api(): APIConfig {
        let selectedAPI: APIConfig;

        selectedAPI = MarriemWebsterConfig;
        return selectedAPI;
    }
}
