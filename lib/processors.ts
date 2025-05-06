import type { Middleware, Processor } from "./types.ts";

export function preprocess(processor: Processor<Request>): Middleware {
  return async (req, next) => next(await processor(req));
}

export function postprocess(processor: Processor<Response>): Middleware {
  return async (req, next) => processor(await next(req));
}
