import type { Handler, MaybePromise, Middleware } from "./types.ts";

/**
 * Create a handler from a handler and a list of middlewares.
 * The middlewares are invoked in the FILO order.
 * The handler serves as the default handler if none of the middlewares handle the request.
 */
export function match(
  handler: Handler,
  ...middlewares: Middleware[]
): Handler {
  return (req) => {
    for (const middleware of middlewares) {
      handler = (req) => middleware(req, handler);
    }
    return handler(req);
  };
}

/**
 * Creates a middleware that matches the request path against the given predicate.
 * If there's a match, the provided middleware is invoked; otherwise, it falls through.
 */
export function when(
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
