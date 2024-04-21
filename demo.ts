import { get, post, route, routes, verbs } from "./mod.ts";

const handler = routes(
  route(
    "/api",
    verbs(
      get(() => new Response("Hello World!")),
      post((req) => new Response(req.body)),
    ),
  ),
  route("/hi", verbs(get(() => new Response("Hi!")))),
);

Deno.serve(handler);
