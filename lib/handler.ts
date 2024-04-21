import type { Handler, Middleware } from "./types.ts";

/**
 * Create a handler from a handler and a list of middlewares.
 * The order of the middlewares is FILO.
 */
export function createHandler(
  handler: Handler,
  ...middlewares: Middleware[]
): Handler {
  return (req) => {
    while (middlewares.length) {
      const nextMiddleware = middlewares.shift()!;
      const nextHandler = handler;
      handler = (req) => nextMiddleware(req, nextHandler);
    }
    return handler(req);
  };
}
