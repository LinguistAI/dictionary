declare global {
    namespace NodeJS {
        interface ProcessEnv {
            STATUS?: "development" | "production",
            PORT: string,

            //postgres
            PG_HOST: string,
            PG_PORT: string,
            PG_USER: string,
            PG_PASS: string,
            PG_DB: string            
        }
    }
}

export {};