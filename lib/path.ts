import { globToRegExp } from "@std/path/posix/glob-to-regexp";
import type { Handler, Middleware } from "./types.ts";
import { match, when } from "./core.ts";
import { notFound } from "./errors.ts";

/**
 * Creates a middleware that matches the request path against the given glob pattern.
 * If there's a match, the provided middleware is invoked; otherwise, it falls through.
 */
export function whenPath(
  glob: string,
  middleware: Middleware,
): Middleware {
  const patternRegex = globToRegExp(glob);
  return when(
    (req) => {
      const { pathname } = new URL(req.url);
      return patternRegex.test(pathname);
    },
    middleware,
  );
}

/**
 * Creates a middleware that matches the request path against the given glob pattern.
 * If there's a match, the provided handler is invoked; otherwise, it falls through.
 */
export function route(
  glob: string,
  handler: Handler,
): Middleware {
  return whenPath(glob, (req) => handler(req));
}

/**
 * Creates a handler that invokes the provided middlewares in the FILO order.
 * If none of the middlewares handle the request, a "Not Found" response is sent.
 */
export function routes(
  ...middlewares: Middleware[]
): Handler {
  return match(notFound, ...middlewares);
}
