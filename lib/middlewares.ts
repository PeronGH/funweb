import { Middleware } from "./types.ts";
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

export const get = createMethodMiddleware("GET");
export const post = createMethodMiddleware("POST");
export const put = createMethodMiddleware("PUT");
export const del = createMethodMiddleware("DELETE");
export const patch = createMethodMiddleware("PATCH");
export const options = createMethodMiddleware("OPTIONS");

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

export const notFound = () => new Response("Not Found", { status: 404 });
