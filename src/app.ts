import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

const middleware = new Hono()
  .notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))
  .use(prettyJSON())
  .use(logger());

export const app = new Hono()
  .route('*', middleware)
  .get('/health', (c) => c.json({ message: 'OK', ok: true }, 200));
