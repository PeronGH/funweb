import {
  catchError,
  get,
  internalServerError,
  post,
  route,
  routes,
  verbs,
} from "./mod.ts";

const handler = routes(
  route(
    "/api/v1",
    verbs(
      get((req) => Response.json(Object.fromEntries(req.headers))),
      post((req) => new Response(req.body)),
    ),
  ),
  route(
    "/?(*.{html,htm})",
    (req) => new Response(new URL(req.url).pathname),
  ),
  route(
    "/**/error",
    () => {
      throw new Error("An error occurred");
    },
  ),
  catchError((req) => {
    console.error(req.error);
    return internalServerError(req);
  }),
);

Deno.serve(handler);
