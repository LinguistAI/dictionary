import dotenv from "dotenv";
import { ConfigNotLoadedExc } from "../common/exception";

if (process.env.NODE_ENV === "test") {
    dotenv.config({ path: ".env.test" });
} else {
    dotenv.config();
}

class Config {
    // app port and status
    public PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
    public STAT: string = process.env.NODE_ENV || "development";

    // marriem webster api configs
    public MW_DICTIONARY_API_URL: string =
        process.env.MW_DICTIONARY_API_URL ||
        "https://dictionaryapi.com/api/v3/references/collegiate/json/";
    public DICTIONARY_AUDIO_URL: string =
        process.env.MW_DICTIONARY_AUDIO_URL ||
        "https://media.merriam-webster.com";
    public MW_DICTIONARY_API_KEY: string;

    // free dictionary configs
    public FREE_DICTIONARY_API_URL: string =
        process.env.FREE_DICTIONARY_API_URL ||
        "https://api.dictionaryapi.dev/api/v2/entries/en/";

    public BASE_PREFIX: string = process.env.BASE_PREFIX || "/api/v1";

    constructor() {
        if (process.env.MW_DICTIONARY_API_KEY == undefined) {
            throw new ConfigNotLoadedExc(
                "Dictionary API KEY is not found in the environment."
            );
        } else {
            this.MW_DICTIONARY_API_KEY = process.env.MW_DICTIONARY_API_KEY;
        }
        console.log("configs are loaded");
    }
}

const config = new Config();
export default config;
