declare global {
  namespace Express {
    interface Request {
      pag_option: PaginationOptions;
    }
  }
}