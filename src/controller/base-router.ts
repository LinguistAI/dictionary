import express from "express";

interface BaseRouter {
  router: express.Router;
  init_controller(): any;
}

export default BaseRouter;