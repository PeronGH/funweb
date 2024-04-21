import { createHandler, get, notFound, path, post } from "./mod.ts";

const handler = createHandler(
  notFound,
  get(() => new Response("Hello World!")),
  post((req) => new Response(req.body)),
  get(path("/hi", () => new Response("Hi!"))),
);

Deno.serve(handler);
