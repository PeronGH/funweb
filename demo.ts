import { createHandler, get, notFound, path, post, route } from "./mod.ts";

const handler = createHandler(
  notFound,
  route(
    "/api",
    get(() => new Response("Hello World!")),
    post((req) => new Response(req.body)),
  ),
  get(path("/hi", () => new Response("Hi!"))),
);

Deno.serve(handler);
