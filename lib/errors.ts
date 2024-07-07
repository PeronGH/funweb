import type { Handler, Middleware } from "./types.ts";

export function catchError(errorHandler: Handler<unknown>): Middleware {
  return async (req, next) => {
    try {
      return await next(req);
    } catch (error) {
      return errorHandler(error);
    }
  };
}
