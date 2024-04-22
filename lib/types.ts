export type MaybePromise<T> = T | Promise<T>;

export interface Handler<R extends Request = Request> {
  (req: R): MaybePromise<Response>;
}

export interface Middleware {
  (req: Request, next: Handler): MaybePromise<Response>;
}

export interface ConditionalHandler {
  (handler: Handler): Middleware;
}

// deno-lint-ignore no-explicit-any
export type Context<T extends Record<string, any> = object> =
  // deno-lint-ignore no-explicit-any
  & Record<string, any>
  & T;

export interface Processor<T> {
  (value: T): MaybePromise<T>;
}
