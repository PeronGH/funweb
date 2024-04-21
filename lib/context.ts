import { WrappedRequest } from "./requests.ts";
import type { Context } from "./types.ts";

const contexts = new WeakMap<Request, Context>();

export function setCtx(req: Request, ctx: Context) {
  req = WrappedRequest.unwrap(req);
  contexts.set(req, ctx);
}

// deno-lint-ignore no-explicit-any
export function getCtx<T extends Record<string, any> = object>(
  req: Request,
): Context<T> {
  req = WrappedRequest.unwrap(req);
  let ctx = contexts.get(req);
  if (!ctx) {
    ctx = {};
    contexts.set(req, ctx);
  }
  return { ...ctx } as Context<T>;
}
