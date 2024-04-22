import type { Middleware, Processor } from "./types.ts";

export abstract class WrappedRequest extends Request {
  constructor(readonly raw: Request) {
    super(raw);
  }

  static unwrap(req: Request): Request {
    if (req instanceof WrappedRequest) {
      return WrappedRequest.unwrap(req.raw);
    }
    return req;
  }
}

export class ErroredRequest extends WrappedRequest {
  constructor(req: Request, readonly error: Error) {
    super(req);
  }
}

export function preprocess(processor: Processor<Request>): Middleware {
  return async (req, next) => next(await processor(req));
}
