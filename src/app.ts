import bodyparser from "body-parser";
import express, { Application } from "express";
import config from "./config/config";
import dictionary_controller from "./controller/dictionary-controller";
import error_middleware from "./middleware/error-middleware";

class App {
  private app: Application;
  private appRouter: express.Router;

  constructor() {
    this.app = express();
    this.appRouter = express.Router();
  }

  init() {
    return new Promise((resolve, reject) => {
      try {
        this.load_config();
        this.load_router();
      } catch (error) {
        console.log(error);
        reject(false);
      } finally {
        this.app.use(error_middleware);
        resolve(true);
      }
    });
  }

  load_config() {
    this.app.use(bodyparser.json());
    this.app.use(bodyparser.urlencoded({ extended: false }));
  }

  load_router() {
    this.app.use(config.BASE_PREFIX, this.appRouter);
    this.appRouter.use("/dictionary", dictionary_controller);
  }

  listen(): void {
    this.app
      .listen(config.PORT, () => {
        console.log(
          `Server is running in ${config.STAT} mode and listening on port ${config.PORT}...`
        );
      })
      .on("error", (err) => {
        console.log(err);
        process.exit(2);
      });
  }
}

const app = new App();
export default app;
