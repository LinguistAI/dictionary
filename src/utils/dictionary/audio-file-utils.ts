import config from "../../config/config";

const SUBDIR_BIX: string = "bix";
const SUBDIR_GG: string = "gg";
const SUBDIR_NUMBER: string = "number";
const NUM_PUCT_PATTERN: RegExp = new RegExp(
    `^[0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]+`
);

export function create_audio_url(filename: string): string {
    const format: string = "mp3";

    let subdir: string = "";
    if (filename.startsWith(SUBDIR_BIX)) {
        subdir = SUBDIR_BIX;
    } else if (filename.startsWith(SUBDIR_GG)) {
        subdir = SUBDIR_GG;
    } else if (NUM_PUCT_PATTERN.test(filename)) {
        subdir = SUBDIR_NUMBER;
    } else {
        subdir = filename.charAt(0);
    }

    const url: string = `${config.DICTIONARY_AUDIO_URL}/audio/prons/en/us/${format}/${subdir}/${filename}.${format}`;
    return url;
}
