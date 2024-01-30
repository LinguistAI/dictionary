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

    // api configs
    public DICTIONARY_API_URL: string =
        process.env.DICTIONARY_API_URL ||
        "https://dictionaryapi.com/api/v3/references/collegiate/json/";
    public DICTIONARY_AUDIO_URL: string =
        process.env.DICTIONARY_AUDIO_URL || "https://media.merriam-webster.com";
    public DICTIONARY_API_KEY: string;

    constructor() {
        if (process.env.DICTIONARY_API_KEY == undefined) {
            throw new ConfigNotLoadedExc(
                "Dictionary API KEY is not found in the environment."
            );
        } else {
            this.DICTIONARY_API_KEY = process.env.DICTIONARY_API_KEY;
        }
        console.log("configs are loaded");
    }
}

const config = new Config();
export default config;
