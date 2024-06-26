import { NextFunction, Request, Response, Router } from "express";
import { Exception, ValidationExc } from "../common/exception";
import { ResponseSuccess } from "../common/response-success";
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
    this.router.get("/ping", this.ping);
    this.router.head("/ping", this.ping);
    this.router.post("/ping", this.ping);
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
            log_service.log(LogStatus.Success, `search word: ${validated}`);
            return res.json(new ResponseSuccess("OK", 200, { dict: dict }));
          })
          .catch((err) => {
            log_service.log(LogStatus.Error, `search word: ${validated}`);
            next(err);
          });
      })
      .catch((err) => {
        log_service.log(LogStatus.Error, `search words: ${wordList}`);
        const exc: Exception = new ValidationExc(err);
        next(exc);
      });
  };

  private ping = (req: Request, res: Response, next: NextFunction) => {
    return res.json(
      new ResponseSuccess("OK", 200, { message: "Server is up" })
    );
  };
}

const dictionary_controller = new DictionaryController();
export default dictionary_controller.router;
