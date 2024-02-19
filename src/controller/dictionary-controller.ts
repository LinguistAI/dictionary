import { Router, Request, Response, NextFunction } from "express";
import { Exception, ValidationExc } from "../common/exception";
import { ResponseSuccess } from "../common/response-success";
import { WordSearchParams } from "../common/search-word-params";
import { LogStatus } from "../enums/log-status";
import { DictionaryService } from "../service/dictionary-service";
import log_service from "../service/log-service";
import wordValidation from "../validation/library-validation";
import BaseRouter from "./base-router";

class DictionaryController implements BaseRouter {
    router: Router;
    dictionaryService: DictionaryService;

    constructor() {
        this.dictionaryService = new DictionaryService();
        this.router = Router();
        this.init_controller();
    }

    init_controller() {
        this.router.post("/", this.search_word);
    }

    private search_word = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const wordList = req.body.wordList;

        wordValidation.searchSchema
            .validateAsync(wordList)
            .then((validated) => {
                this.dictionaryService
                    .search_word(validated)
                    .then((dict) => {
                        log_service.log(
                            LogStatus.Success,
                            `search word: ${validated}`
                        );
                        return res.json(
                            new ResponseSuccess("ok", { dict: dict })
                        );
                    })
                    .catch((err) => {
                        log_service.log(
                            LogStatus.Error,
                            `search word: ${validated}`
                        );
                        next(err);
                    });
            })
            .catch((err) => {
                log_service.log(LogStatus.Error, `search words: ${wordList}`);
                const exc: Exception = new ValidationExc(err);
                next(exc);
            });
    };
}

const dictionary_controller = new DictionaryController();
export default dictionary_controller.router;
