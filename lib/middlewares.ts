import { createHandler } from "./handler.ts";
import type {
  ConditionalHandler,
  Handler,
  MaybePromise,
  Middleware,
} from "./types.ts";
import { globToRegExp } from "@std/path/posix/glob-to-regexp";

/**
 * Creates a middleware that matches the request path against the given predicate.
 * If there's a match, the provided middleware is invoked; otherwise, it falls through.
 */
export function match(
  predicate: (req: Request) => MaybePromise<boolean>,
  middleware: Middleware,
): Middleware {
  return async (req, next) => {
    if (await predicate(req)) {
      return middleware(req, next);
    }
    return next(req);
  };
}

/**
 * Creates a middleware that matches the request path against the given method (case insensitive).
 * If there's a match, the provided middleware is invoked; otherwise, it falls through.
 */
export function matchMethod(
  method: string,
  middleware: Middleware,
): Middleware {
  return match(
    (req) => req.method.toUpperCase() === method.toUpperCase(),
    middleware,
  );
}

/**
 * Creates a middleware that matches the request path against the given method (case insensitive).
 * If there's a match, the provided handler is invoked; otherwise, it falls through.
 */
export function method(method: string, handler: Handler): Middleware {
  return matchMethod(method, (req) => handler(req));
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
 * If there's a match, the provided middleware is invoked; otherwise, it falls through.
 */
export function matchPath(
  glob: string,
  middleware: Middleware,
): Middleware {
  const patternRegex = globToRegExp(glob);
  return match(
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
  return matchPath(glob, (req) => handler(req));
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
