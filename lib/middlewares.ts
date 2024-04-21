import { createHandler } from "./handler.ts";
import type { Handler, Middleware, MiddlewareWrapper } from "./types.ts";
import { globToRegExp } from "@std/path/posix/glob-to-regexp";

export function method(method: string, middleware: Middleware): Middleware {
  return (req, next) => {
    if (req.method.toUpperCase() === method.toUpperCase()) {
      return middleware(req, next);
    }
    return next(req);
  };
}

function createMethodMiddleware(m: string) {
  return (middleware: Middleware) => method(m, middleware);
}

export const get: MiddlewareWrapper = createMethodMiddleware("GET");
export const post: MiddlewareWrapper = createMethodMiddleware("POST");
export const put: MiddlewareWrapper = createMethodMiddleware("PUT");
export const del: MiddlewareWrapper = createMethodMiddleware("DELETE");
export const patch: MiddlewareWrapper = createMethodMiddleware("PATCH");
export const options: MiddlewareWrapper = createMethodMiddleware("OPTIONS");

/**
 * Creates a middleware that matches the request path against the given glob pattern.
 * If there's a match, the provided middleware is invoked; otherwise, it falls through.
 */
export function route(
  glob: string,
  middleware: Middleware,
): Middleware {
  const patternRegex = globToRegExp(glob);
  return (req, next) => {
    const { pathname } = new URL(req.url);
    if (patternRegex.test(pathname)) {
      return middleware(req, next);
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
