import { Hono } from 'hono';
import Maybe from 'true-myth/maybe';

import type { AppContext } from '@app/types';

import type { Compose, ComposeId, Composes } from '../composes';
import { paginate } from '../pagination';
import type {
  Blueprint,
  BlueprintId,
  BlueprintMetadata,
  Blueprints,
} from './types';
import * as validators from './validators';

export const blueprints = new Hono<AppContext>()

  /**
   * List blueprints
   *
   * @rest index
   */
  .get('/blueprints', async (ctx) => {
    const { limit, offset } = ctx.req.query();
    const { blueprint: service } = ctx.get('services');
    const result = await service.all();

    return result.match({
      Ok: (blueprints) => {
        return ctx.json<Blueprints>(
          paginate<BlueprintMetadata>(
            blueprints,
            Maybe.of(limit),
            Maybe.of(offset),
          ),
        );
      },
      Err: (error) => {
        const { body, code } = error.response();
        return ctx.json(body, code);
      },
    });
  })

  /**
   * Create blueprint
   *
   * @rest create
   * @example src/__fixtures__/blueprint-request.json
   */
  .post('/blueprints', validators.createBlueprint, async (ctx) => {
    const { blueprint: service } = ctx.get('services');
    const result = await service.add(ctx.req.valid('json'));

    return result.match({
      Ok: ({ id }) => {
        return ctx.json<BlueprintId>({ id });
      },
      Err: (error) => {
        const { body, code } = error.response();
        return ctx.json(body, code);
      },
    });
  })

  /**
   * Get blueprint
   *
   * @rest show
   */
  .get('/blueprints/:id', async (ctx) => {
    const id = ctx.req.param('id');
    const { blueprint: service } = ctx.get('services');
    const result = await service.get(id);

    return result.match({
      Ok: (blueprint) => {
        return ctx.json<Blueprint>(blueprint);
      },
      Err: (error) => {
        const { body, code } = error.response();
        return ctx.json(body, code);
      },
    });
  })

  /**
   * Edit blueprint
   *
   * @rest update
   * @example src/__fixtures__/blueprint-request.json
   */
  .put('/blueprints/:id', validators.createBlueprint, async (ctx) => {
    const id = ctx.req.param('id');
    const { blueprint: service } = ctx.get('services');
    const result = await service.update(id, ctx.req.valid('json'));

    return result.match({
      Ok: ({ id }) => {
        return ctx.json<BlueprintId>({ id });
      },
      Err: (error) => {
        const { body, code } = error.response();
        return ctx.json(body, code);
      },
    });
  })

  /**
   * Delete blueprint
   *
   * @rest delete
   */
  .delete('/blueprints/:id', async (ctx) => {
    const id = ctx.req.param('id');
    const { blueprint: service } = ctx.get('services');
    const result = await service.delete(id);

    return result.match({
      Ok: () => ctx.json({ message: 'OK' }),
      Err: (error) => {
        const { body, code } = error.response();
        return ctx.json(body, code);
      },
    });
  })

  /**
   * List blueprint composes
   *
   * @rest blueprint.composes
   */
  .get('/blueprints/:id/composes', async (ctx) => {
    const id = ctx.req.param('id');
    const { limit, offset } = ctx.req.query();
    const { compose: service } = ctx.get('services');
    const result = await service.all(id);

    // TODO: look at filters
    // - ignoreImageTypes
    // - blueprint_version
    //   - this may not be possible since we only store the latest
    return result.match({
      Ok: (composes) => {
        return ctx.json<Composes>(
          paginate<Compose>(composes, Maybe.of(limit), Maybe.of(offset)),
        );
      },
      Err: (error) => {
        const { body, code } = error.response();
        return ctx.json(body, code);
      },
    });
  })

  /**
   * List blueprint composes
   *
   * @rest compose.blueprint
   * @example src/__fixtures__/image-types.json
   */
  .post('/blueprints/:id/compose', validators.composeBlueprint, async (ctx) => {
    const id = ctx.req.param('id');
    const body = ctx.req.valid('json');
    const { blueprint: service } = ctx.get('services');
    const result = await service.compose(id, body);

    return result.match({
      Ok: ({ id }) => ctx.json<ComposeId>({ id }),
      Err: (error) => {
        const { body, code } = error.response();
        return ctx.json(body, code);
      },
    });
  });

export type * from './types';
export { BlueprintService } from './service';
