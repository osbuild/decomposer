import { afterAll, describe, expect, it } from 'bun:test';
import { StatusCodes } from 'http-status-codes';
import { mkdtemp, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validate } from 'uuid';

import { blueprintRequest, createTestClient, createTestStore } from '@fixtures';

import type { BlueprintRequest, Blueprints } from '.';

describe('Blueprints handler tests', async () => {
  const tmp = await mkdtemp(path.join(tmpdir(), 'decomposer-test'));
  const store = createTestStore(tmp);
  const { client } = createTestClient(store);

  afterAll(async () => {
    await rmdir(tmp, { recursive: true });
  });

  let newBlueprint = '';

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

  describe('create blueprints tests', () => {
    it('should create a new blueprint', async () => {
      const res = await client.blueprints.$post({
        json: blueprintRequest as BlueprintRequest,
      });
      expect(res.status).toBe(StatusCodes.OK);
      const { id } = await res.json();
      newBlueprint = id;
      expect(validate(id)).toBeTrue();
    });

    it('should return 422 Response with bad input', async () => {
      const res = await client.blueprints.$post({
        json: {} as BlueprintRequest,
      });
      expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('should list one blueprint now', async () => {
      const res = await client.blueprints.$get();
      expect(res.status).toBe(StatusCodes.OK);
      const body = (await res.json()) as Blueprints;
      expect(body).not.toBeUndefined();
      expect(body.meta.count).toBe(1);
      expect(body.data).not.toBeUndefined();
      expect(body.data.length).toBe(1);
    });
  });

  describe('get blueprint tests', () => {
    it('should get a blueprint', async () => {
      await Bun.sleep(4);
      const res = await client.blueprints[':id'].$get({
        param: { id: newBlueprint },
      });
      expect(res.status).toBe(StatusCodes.OK);
      const body = (await res.json()) as Blueprints;
      expect(body.name).toBe(blueprintRequest.name);
      expect(body.description).toBe(blueprintRequest.description);
    });

    it('should return a 404 Response for a non-existing blueprint', async () => {
      await Bun.sleep(4);
      const res = await client.blueprints[':id'].$get({
        param: { id: '1234' },
      });
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
