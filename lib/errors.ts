import { ErroredRequest } from "./requests.ts";
import type { Handler, Middleware } from "./types.ts";


export function catchError(errorHandler: Handler<ErroredRequest>): Middleware {
  return async (req, next) => {
    try {
      return await next(req);
    } catch (error) {
      const errReq = new ErroredRequest(req, error);
      return errorHandler(errReq);
    }
  };
}
