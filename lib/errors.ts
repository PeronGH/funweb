import type { Handler } from "./types.ts";

export const methodNotAllowed: Handler = () =>
  new Response("Method Not Allowed", { status: 405 });

export const notFound: Handler = () =>
  new Response("Not Found", { status: 404 });
