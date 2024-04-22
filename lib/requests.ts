import type { Middleware, Processor } from "./types.ts";

export class WrappedRequest extends Request {
  constructor(readonly raw: Request, init: RequestInit = {}) {
    super(raw, init);
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

export function cloneReq(req: Request, init: RequestInit = {}): Request {
  return new WrappedRequest(req, init);
}
