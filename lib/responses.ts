import type { Provider } from "./types.ts";

export const methodNotAllowed: Provider = () =>
  new Response("Method Not Allowed", { status: 405 });

export const notFound: Provider = () =>
  new Response("Not Found", { status: 404 });

export const internalServerError: Provider = () =>
  new Response("Internal Server Error", { status: 500 });

