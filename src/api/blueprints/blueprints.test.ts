import { afterAll, describe, expect, it } from 'bun:test';
import { StatusCodes } from 'http-status-codes';
import { mkdtemp, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { createTestClient, createTestStore } from '@fixtures';

import type { Blueprints } from '.';

describe('Blueprints handler tests', async () => {
  const tmp = await mkdtemp(path.join(tmpdir(), 'decomposer-test'));
  const store = createTestStore(tmp);
  const { client } = createTestClient(store);

  afterAll(async () => {
    await rmdir(tmp, { recursive: true });
  });

  describe('get blueprints test', () => {
    it('should initially have no blueprints', async () => {
      const res = await client.blueprints.$get();
      expect(res.status).toBe(StatusCodes.OK);
      const body = (await res.json()) as Blueprints;
      expect(body).not.toBeUndefined();
      expect(body.meta.count).toBe(0);
      expect(body.data).not.toBeUndefined();
      expect(body.data.length).toBe(0);
    });
  });
});
