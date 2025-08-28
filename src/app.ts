import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import { notFound, onError } from '@app/errors';

const middleware = new Hono()
  .notFound(notFound)
  .use(prettyJSON())
  .use(logger());

export const app = new Hono()
  // we need to catch the errors either at the router
  // level or the app level, otherwise the errors go
  // uncaught
  .onError(onError)
  .route('*', middleware)
  .get('/health', (c) => c.json({ message: 'OK', ok: true }, 200));
