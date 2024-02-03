import { APIRequestExc } from "../../common/exception";
import config from "../../config/config";
import { DictionaryResponse } from "../../model/dictionary-response";
import {
    DictionaryWordGroup,
    WordDef,
} from "../../model/dictionary-word-group";
import { APIConfig } from "./api-config";
import { create_audio_url } from "./audio-file-utils";

export const MarriemWebsterConfig: APIConfig = {
    axiosConfig: (word: string) => {
        return {
            method: "get",
            url: config.DICTIONARY_API_URL + word,
            params: {
                key: config.DICTIONARY_API_KEY,
                format: "json",
                jscmd: "data",
            },
        };
    },
    extractDictData: (word: string, data: any) => {
        return extractDictData(word, data);
    },
    handleErrors: (res: any) => {
        return handleErrors(res);
    },
    handleEdgeCases: (res: any, word: string) => {
        return handleEdgeCases(res, word);
    },
};

function handleErrors(res: any): void {
    if (res.status !== 200 || typeof res.data === "string") {
        throw new APIRequestExc(res.data);
    }
}

function handleEdgeCases(res: any, word: string): DictionaryResponse | null {
    if (
        Object.keys(res.data).length === 0 ||
        (Array.isArray(res.data) &&
            !res.data.every((item: any) => typeof item === "object"))
    ) {
        const result: DictionaryResponse = {
            [word]: {},
        };
        return result;
    }
    return null;
}

function extractDictData(
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
    const definitionArray: WordDef[] = def?.[0]?.sseq?.map(extract_def);

    // extract meta id, audio file name, and functional label
    const result: DictionaryWordGroup = {
        id: meta.id,
        word: word,
        audio: hwi?.prs?.[0]?.sound?.audio
            ? create_audio_url(hwi?.prs?.[0]?.sound?.audio)
            : "",
        phonetic: hwi?.prs?.[0]?.mw || "",
        func_label: fl || "",
        meaning: definitionArray,
    };

    return result;
}

function extract_def(sseq: any): WordDef {
    const definitionObj: WordDef = {
        definition: sseq?.[0]?.[1]?.dt?.[0]?.[1] || "",
        examples:
            sseq[0]?.[1]?.dt?.[1]?.[1]?.map((def: { t: any }) => def.t) || [],
    };

    return definitionObj;
}
