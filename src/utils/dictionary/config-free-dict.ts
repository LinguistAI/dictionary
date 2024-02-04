import { defaultFormat } from "moment";
import { APIRequestExc } from "../../common/exception";
import config from "../../config/config";
import { DictionaryResponse } from "../../model/dictionary-response";
import {
    DictionaryWordGroup,
    WordDef,
} from "../../model/dictionary-word-group";
import { APIConfig } from "./api-config";
import { create_audio_url } from "./audio-file-utils";

export const FreeDictConfig: APIConfig = {
    axiosConfig: (word: string) => {
        return {
            method: "get",
            url: config.FREE_DICTIONARY_API_URL + word,
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
        throw new APIRequestExc(res.data.title ? res.data.title : res.data);
    }
} // TODO handle jsondata length 0

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

function extractDictData(word: string, jsonData: any): DictionaryWordGroup[] {
    let id: number = 0; // Initialize the ID
    return jsonData
        .flatMap((entry: any) => {
            console.log("entry: ", entry);
            const result = extractDictDataEntry(word, entry, id);
            id = result?.id ? result.id : id;
            return result!.data;
        })
        .filter((result: DictionaryWordGroup | null) => result != null);
}

function extractDictDataEntry(
    requestedWord: string,
    jsonEntry: any,
    id: number
): { data: DictionaryWordGroup[]; id: number } | undefined {
    const { word, phonetic, phonetics, meanings } = jsonEntry;

    // if definitions are not of the exact search word, do not process them
    if (requestedWord.trim() != word) {
        return undefined;
    }

    const groupAudio: string =
        phonetics.find((obj: any) => obj.audio && obj.audio != "").audio ?? "";

    let dictGroup: DictionaryWordGroup[] = meanings.map((meaning: any) => {
        {
            console.log("id", id);
            const result = extractDictDataMeaningEntry(
                meaning,
                id,
                requestedWord,
                phonetic,
                groupAudio
            );
            id++;
            return result;
        }
    });

    if (dictGroup.length == 0) {
        return undefined;
    }
    console.log("data", dictGroup);

    return { data: dictGroup, id: id };
}

// meaning parameter is an entry of the meanings array
function extractDictDataMeaningEntry(
    meaning: any,
    id: number,
    word: string,
    phonetic: string,
    audio: string
): DictionaryWordGroup {
    // extract the definitions and example usages
    const definitionArray: WordDef[] = meaning.definitions?.map(extract_def);

    // extract meta id, audio file name, and functional label
    const result: DictionaryWordGroup = {
        id: `${word}:${id}`,
        word: word,
        audio: audio,
        phonetic: phonetic,
        func_label: meaning.partOfSpeech || "",
        meaning: definitionArray,
    };

    console.log("id: ", id);
    console.log("result: ", result);
    return result;
}

function extract_def(def: any): WordDef {
    const definitionObj: WordDef = {
        definition: def.definition || "",
        examples: def.example || [],
    };

    return definitionObj;
}
