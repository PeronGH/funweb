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

export const notFound: Handler = () =>
  new Response("Not Found", { status: 404 });
