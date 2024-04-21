import { createHandler } from "./handler.ts";
import type { ConditionalHandler, Handler, Middleware } from "./types.ts";
import { globToRegExp } from "@std/path/posix/glob-to-regexp";

/**
 * Creates a middleware that matches the request path against the given method (case insensitive).
 * If there's a match, the provided handler is invoked; otherwise, it falls through.
 */
export function method(method: string, handler: Handler): Middleware {
  return (req, next) => {
    if (req.method.toUpperCase() === method.toUpperCase()) {
      return handler(req);
    }
    return next(req);
  };
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
 * Creates a middleware that matches the request path against the given glob pattern.
 * If there's a match, the provided handler is invoked; otherwise, it falls through.
 */
export function route(
  glob: string,
  handler: Handler,
): Middleware {
  const patternRegex = globToRegExp(glob);
  return (req, next) => {
    const { pathname } = new URL(req.url);
    if (patternRegex.test(pathname)) {
      return handler(req);
    }
    return next(req);
  };
}

/**
 * Creates a handler that invokes the provided middlewares in the FILO order.
 * If none of the middlewares handle the request, a "Method Not Allowed" response is sent.
 */
export function methods(
  ...middlewares: Middleware[]
): Handler {
  return createHandler(methodNotAllowed, ...middlewares);
}

/**
 * Creates a handler that invokes the provided middlewares in the FILO order.
 * If none of the middlewares handle the request, a "Not Found" response is sent.
 */
export function routes(
  ...middlewares: Middleware[]
): Handler {
  return createHandler(notFound, ...middlewares);
}

export const methodNotAllowed: Handler = () =>
  new Response("Method Not Allowed", { status: 405 });

export const notFound: Handler = () =>
  new Response("Not Found", { status: 404 });
