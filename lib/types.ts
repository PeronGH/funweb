export type MaybePromise<T> = T | Promise<T>;

export interface Handler<R = Request> {
  (req: R): MaybePromise<Response>;
}

export interface Middleware {
  (req: Request, next: Handler): MaybePromise<Response>;
}

export interface ConditionalHandler {
  (handler: Handler): Middleware;
}

export interface Processor<T> {
  (value: T): MaybePromise<T>;
}
