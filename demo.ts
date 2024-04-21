import { get, methods, post, route, routes } from "./mod.ts";

const handler = routes(
  route(
    "/api",
    methods(
      get(() => new Response("Hello World!")),
      post((req) => new Response(req.body)),
    ),
  ),
  route("/hi", get(() => new Response("Hi!"))),
);

Deno.serve(handler);
