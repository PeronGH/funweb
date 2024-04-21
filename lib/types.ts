import type { ErroredRequest } from "./requests.ts";

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

// deno-lint-ignore no-explicit-any
export type Context = Record<string, any>;

export interface ErrorHandler {
  (req: ErroredRequest): MaybePromise<Response>;
}
