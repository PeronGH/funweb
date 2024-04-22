import type { Handler, Middleware, Processor } from "./types.ts";

export const methodNotAllowed: Handler = () =>
  new Response("Method Not Allowed", { status: 405 });

export const notFound: Handler = () =>
  new Response("Not Found", { status: 404 });

export const internalServerError: Handler = () =>
  new Response("Internal Server Error", { status: 500 });

export function postprocess(processor: Processor<Response>): Middleware {
  return async (req, next) => processor(await next(req));
}
