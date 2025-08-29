import { Hono } from 'hono';
import { pinoLogger } from 'hono-pino';
import { prettyJSON } from 'hono/pretty-json';

import { notFound, onError } from '@app/errors';
import { logger } from '@app/logger';

const middleware = new Hono()
  .notFound(notFound)
  .use(prettyJSON())
  .use(pinoLogger({ pino: logger }));

export const app = new Hono()
  // we need to catch the errors either at the router
  // level or the app level, otherwise the errors go
  // uncaught
  .onError(onError)
  .route('*', middleware)
  .get('/health', (c) => c.json({ message: 'OK', ok: true }, 200));
