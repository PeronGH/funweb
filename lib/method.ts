import { methodNotAllowed } from "./errors.ts";
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
export function method(method: string, handler: Handler): Middleware {
  return whenMethod(method, (req) => handler(req));
}

function createMethodMiddleware(m: string) {
  return (handler: Handler) => method(m, handler);
}

export const get: ConditionalHandler = createMethodMiddleware("GET");
export const post: ConditionalHandler = createMethodMiddleware("POST");
export const put: ConditionalHandler = createMethodMiddleware("PUT");
export const del: ConditionalHandler = createMethodMiddleware("DELETE");
export const patch: ConditionalHandler = createMethodMiddleware("PATCH");
export const options: ConditionalHandler = createMethodMiddleware("OPTIONS");

/**
 * Creates a handler that invokes the provided middlewares in the FILO order.
 * If none of the middlewares handle the request, a "Method Not Allowed" response is sent.
 */
export function methods(
  ...middlewares: Middleware[]
): Handler {
  return match(methodNotAllowed, ...middlewares);
}
