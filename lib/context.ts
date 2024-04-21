import { WrappedRequest } from "./requests.ts";
import type { Context } from "./types.ts";

const contexts = new WeakMap<Request, Context>();

export function setCtx(req: Request, ctx: Context) {
  req = WrappedRequest.unwrap(req);
  contexts.set(req, ctx);
}

export function getCtx(req: Request): Context {
  req = WrappedRequest.unwrap(req);
  let ctx = contexts.get(req);
  if (!ctx) {
    ctx = {};
    contexts.set(req, ctx);
  }
  return ctx;
}
