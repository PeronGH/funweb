# funweb

Functional Web Backend Framework

## Example

```typescript
import { get, post, route, routes, verbs } from "jsr:@pixel/funweb";

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
```
