import { describe, expect, it } from 'bun:test';
import { testClient } from 'hono/testing';
import { StatusCodes } from 'http-status-codes';

import { schema } from '@gen/decomposer';

import { meta } from '.';

describe('Meta handler tests', () => {
  const client = testClient(meta);
  describe('/ready endpoint tests', () => {
    it('should return a 200 Response', async () => {
      const res = await client.ready.$get();
      expect(res.status).toBe(StatusCodes.OK);
      expect(await res.json()).toEqual({
        readiness: 'ready',
      });
    });
  });

  describe('/openapi.json endpoint tests', () => {
    it('should return a 200 Response', async () => {
      const res = await client['openapi.json'].$get();
      expect(res.status).toBe(StatusCodes.OK);
      expect(await res.json()).toEqual(schema);
    });
  });
});
