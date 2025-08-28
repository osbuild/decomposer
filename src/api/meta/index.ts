import type { Context } from 'hono';
import { Hono } from 'hono';

// load the openapi spec once on app startup
import { schema } from '@gen/decomposer';

export const meta = new Hono()
  /**
   * Health check endpoint
   */
  .get('/ready', (ctx: Context) => {
    // TODO: maybe we can check here if `ibcli`
    // is installed and error out if it isn't
    return ctx.json({ readiness: 'ready' });
  })

  /**
   * OpenAPI specification
   */
  .get('/openapi.json', async (ctx: Context) => {
    return ctx.json(schema);
  });
