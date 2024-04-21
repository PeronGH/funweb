export type MaybePromise<T> = T | Promise<T>;

export type Handler = (req: Request) => MaybePromise<Response>;

export type Middleware = (
  req: Request,
  next: Handler,
) => MaybePromise<Response>;
