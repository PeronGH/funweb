import { ErroredRequest } from "./requests.ts";
import type { Handler, Middleware } from "./types.ts";

export const methodNotAllowed: Handler = () =>
  new Response("Method Not Allowed", { status: 405 });

export const notFound: Handler = () =>
  new Response("Not Found", { status: 404 });

export const internalServerError: Handler = () =>
  new Response("Internal Server Error", { status: 500 });

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
