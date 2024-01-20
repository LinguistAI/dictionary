import { Router, Request, Response, NextFunction } from "express";
import { Exception, ValidationExc } from "../common/exception";
import { ResponseSuccess } from "../common/response-success";
import { WordSearchParams } from "../common/search-word-params";
import { LogStatus } from "../enums/log-status";
import { DictionaryService } from "../service/dictionary-service";
import log_service from "../service/log-service";
import library_validation from "../validation/library-validation";
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
        this.router.get("/", this.search_word);
        this.router.get("/audio", this.get_audio);
    }

    private get_audio = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const requested_word: string = req.query.filename as string;
        console.log(requested_word);
        library_validation.search_schema
            .validateAsync(requested_word)
            .then((validated_word) => {
                console.log(validated_word);
                this.dictionaryService
                    .get_auido_file(validated_word)
                    .then((audioData) => {
                        log_service.log(
                            LogStatus.Success,
                            `search word: ${validated_word}`
                        );

                        res.setHeader("Content-Type", "audio/mpeg");
                        res.send(audioData);
                    })
                    .catch((err) => {
                        log_service.log(
                            LogStatus.Error,
                            `search word: ${validated_word}`
                        );
                        next(err);
                    });
            })
            .catch((err) => {
                log_service.log(
                    LogStatus.Error,
                    `search word: ${requested_word}`
                );
                const exc: Exception = new ValidationExc(err);
                next(exc);
            });
    };

    private search_word = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const requested_word: string = req.query.word as string;
        console.log(requested_word);
        library_validation.search_schema
            .validateAsync(requested_word)
            .then((validated_word) => {
                console.log(validated_word);
                res.setHeader;
                this.dictionaryService
                    .search_word(validated_word)
                    .then((dict) => {
                        log_service.log(
                            LogStatus.Success,
                            `search word: ${validated_word}`
                        );
                        return res.json(
                            new ResponseSuccess("ok", { dict: dict })
                        );
                    })
                    .catch((err) => {
                        log_service.log(
                            LogStatus.Error,
                            `search word: ${validated_word}`
                        );
                        next(err);
                    });
            })
            .catch((err) => {
                log_service.log(
                    LogStatus.Error,
                    `search word: ${requested_word}`
                );
                const exc: Exception = new ValidationExc(err);
                next(exc);
            });
    };
}

const dictionary_controller = new DictionaryController();
export default dictionary_controller.router;
