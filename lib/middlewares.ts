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
export function path(
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
 * Creates a middleware that routes requests matching the given glob pattern.
 * If there's a match, the provided middlewares are invoked in the FILO order.
 * If none of the middlewares handle the request, a "Method Not Allowed" response is sent.
 * If there's no match, the middleware falls through to the next one in the chain.
 */
export function route(
  glob: string,
  ...middlewares: Middleware[]
): Middleware {
  const patternRegex = globToRegExp(glob);
  const handler = createHandler(methodNotAllowed, ...middlewares);
  return (req, next) => {
    const { pathname } = new URL(req.url);
    if (patternRegex.test(pathname)) {
      return handler(req);
    }
    return next(req);
  };
}

export const notFound: Handler = () =>
  new Response("Not Found", { status: 404 });

export const methodNotAllowed: Handler = () =>
  new Response("Method Not Allowed", { status: 405 });
