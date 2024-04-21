export type MaybePromise<T> = T | Promise<T>;

export interface Handler {
  (req: Request): MaybePromise<Response>;
}

export interface Middleware {
  (req: Request, next: Handler): MaybePromise<Response>;
}

export interface ConditionalHandler {
  (handler: Handler): Middleware;
}
