# funweb

Functional Web Backend Framework

## Example

```typescript
import { createHandler, get, notFound, path, post, route } from "jsr:@pixel/funweb";

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
```
