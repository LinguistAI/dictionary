import dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
    dotenv.config({ path: ".env.test" });
} else {
    dotenv.config();
}

class Config {
    // app port and status
    public PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
    public STAT: string = process.env.NODE_ENV || "development";

    // api links
    public OPENLIB_BASE_URL: string =
        process.env.OPENLIB_BASE_URL || "https://openlibrary.org";
    public OPENLIB_BOOK_URL: string =
        process.env.OPENLIB_BOOK_URL || "https://openlibrary.org/api/books";
    public OPENLIB_SEARCH_URL: string =
        process.env.OPENLIB_SEARCH_URL || "http://openlibrary.org/search.json";
    public OPENLIB_WORK_URL: string =
        process.env.OPENLIB_WORK_URL || "https://openlibrary.org/works/";

    constructor() {
        console.log("configs are loaded");
    }
}

const config = new Config();
export default config;
