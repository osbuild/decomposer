import { afterAll, describe, expect, it } from 'bun:test';
import { StatusCodes } from 'http-status-codes';
import { mkdtemp, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validate } from 'uuid';

import { blueprintRequest, createTestClient, createTestStore } from '@fixtures';

import type { BlueprintRequest, Blueprints } from '.';
import type { Composes } from '../composes';

describe('Blueprints handler tests', async () => {
  const tmp = await mkdtemp(path.join(tmpdir(), 'decomposer-test'));
  const store = createTestStore(tmp);
  const { client } = createTestClient(store);

  afterAll(async () => {
    // clean up the compose so it doesn't
    // pollute other tests.
    await client.composes[':id'].$delete({
      param: { id: newCompose },
    });
    await Bun.sleep(4);
    await rmdir(tmp, { recursive: true });
  });

  let newCompose = '';
  let newBlueprint = '';
  const updatedName = 'New Name';

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

  describe('blueprint update tests ', () => {
    it('should update the blueprint and return 200', async () => {
      const res = await client.blueprints[':id'].$put({
        param: {
          id: newBlueprint,
        },
        json: {
          ...(blueprintRequest as BlueprintRequest),
          name: updatedName,
        },
      });
      expect(res.status).toBe(StatusCodes.OK);
    });

    it('should get the blueprint with updates', async () => {
      await Bun.sleep(4);
      const res = await client.blueprints[':id'].$get({
        param: { id: newBlueprint },
      });
      expect(res.status).toBe(StatusCodes.OK);
      const body = (await res.json()) as Blueprints;
      expect(body.name).toBe(updatedName);
    });

    it('should return a 404 Response for a non-existing blueprint', async () => {
      const res = await client.blueprints[':id'].$put({
        param: {
          id: '123',
        },
        json: blueprintRequest as BlueprintRequest,
      });
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('should return 422 Response with bad input', async () => {
      const res = await client.blueprints[':id'].$put({
        param: {
          id: '123',
        },
        json: {} as BlueprintRequest,
      });
      expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });
  });

  describe('blueprint composes tests', () => {
    it('should initially have no composes', async () => {
      const res = await client.blueprints[':id'].composes.$get({
        param: { id: newBlueprint },
      });
      expect(res.status).toBe(StatusCodes.OK);
      const body = (await res.json()) as Composes;
      expect(body).not.toBeUndefined();
      expect(body.meta.count).toBe(0);
      expect(body.data).not.toBeUndefined();
      expect(body.data.length).toBe(0);
    });

    it('should queue a compose for the blueprint', async () => {
      const res = await client.blueprints[':id'].compose.$post({
        param: { id: newBlueprint },
        json: {},
      });
      expect(res.status).toBe(StatusCodes.OK);
      const { id } = await res.json();
      newCompose = id;
      expect(validate(id)).toBeTrue();
    });

    it('should now return one compose', async () => {
      const res = await client.blueprints[':id'].composes.$get({
        param: { id: newBlueprint },
      });
      expect(res.status).toBe(StatusCodes.OK);
      const body = (await res.json()) as Composes;
      expect(body).not.toBeUndefined();
      expect(body.meta.count).toBe(1);
      expect(body.data).not.toBeUndefined();
      expect(body.data.length).toBe(1);
    });

    it('should return 422 Response with bad input', async () => {
      const res = await client.blueprints[':id'].compose.$post({
        param: { id: newBlueprint },
        // @ts-expect-error we're testing for this
        json: { image_types: ['hello'] },
      });
      expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('it should delete a blueprint compose', async () => {
      await Bun.sleep(4);
      const res = await client.composes[':id'].$delete({
        param: { id: newCompose },
      });
      expect(res.status).toBe(StatusCodes.OK);
    });
  });

  describe('blueprint delete tests', () => {
    it('should delete a blueprint', async () => {
      await Bun.sleep(4);
      const res = await client.blueprints[':id'].$delete({
        param: { id: newBlueprint },
      });
      expect(res.status).toBe(StatusCodes.OK);
    });

    it('should have no blueprints again', async () => {
      const res = await client.blueprints.$get();
      expect(res.status).toBe(StatusCodes.OK);
      const body = (await res.json()) as Blueprints;
      expect(body).not.toBeUndefined();
      expect(body.meta.count).toBe(0);
      expect(body.data).not.toBeUndefined();
      expect(body.data.length).toBe(0);
    });

    it('should return a 404 Response for a non-existing blueprint', async () => {
      const res = await client.blueprints[':id'].$delete({
        param: { id: '123' },
      });
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
