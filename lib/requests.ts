export abstract class WrappedRequest extends Request {
  #raw: Request;

  constructor(req: Request) {
    super(req);
    this.#raw = req;
  }

  get raw(): Request {
    return WrappedRequest.unwrap(this.#raw);
  }

  static unwrap(req: Request): Request {
    if (req instanceof WrappedRequest) {
      return WrappedRequest.unwrap(req.#raw);
    }
    return req;
  }
}

export class ErroredRequest extends WrappedRequest {
  constructor(req: Request, readonly error: Error) {
    super(req);
  }
}
