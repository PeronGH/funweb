# funweb

Functional Web Backend Framework

## Example

```typescript
import { get, post, route, routes, verbs } from "jsr:@pixel/funweb";

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
);

Deno.serve(handler);

```
