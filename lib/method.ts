import { methodNotAllowed } from "./responses.ts";
import { match, when } from "./core.ts";
import type { ConditionalHandler, Handler, Middleware } from "./types.ts";

/**
 * Creates a middleware that matches the request path against the given method (case insensitive).
 * If there's a match, the provided middleware is invoked; otherwise, it falls through.
 */
export function whenMethod(
  method: string,
  middleware: Middleware,
): Middleware {
  return when(
    (req) => req.method.toUpperCase() === method.toUpperCase(),
    middleware,
  );
}

/**
 * Creates a middleware that matches the request path against the given method (case insensitive).
 * If there's a match, the provided handler is invoked; otherwise, it falls through.
 */
export function verb(method: string, handler: Handler): Middleware {
  return whenMethod(method, (req) => handler(req));
}

function createVerbMiddleware(m: string) {
  return (handler: Handler) => verb(m, handler);
}

export const head: ConditionalHandler = createVerbMiddleware("HEAD");
export const get: ConditionalHandler = createVerbMiddleware("GET");
export const post: ConditionalHandler = createVerbMiddleware("POST");
export const put: ConditionalHandler = createVerbMiddleware("PUT");
export const del: ConditionalHandler = createVerbMiddleware("DELETE");
export const patch: ConditionalHandler = createVerbMiddleware("PATCH");
export const options: ConditionalHandler = createVerbMiddleware("OPTIONS");
export const trace: ConditionalHandler = createVerbMiddleware("TRACE");

/**
 * Creates a handler that invokes the provided middlewares in the FILO order.
 * If none of the middlewares handle the request, a "Method Not Allowed" response is sent.
 */
export function verbs(
  ...middlewares: Middleware[]
): Handler {
  return match(methodNotAllowed, ...middlewares);
}
