import { Hono } from 'hono';

import { onError } from '@app/errors';
import type { AppContext } from '@app/types';

import { BlueprintService, blueprints } from './blueprints';
import { ComposeService, composes } from './composes';
import { meta } from './meta';

export const api = new Hono<AppContext>()
  // we need to catch the errors either at the router
  // level otherwise the errors go uncaught
  .onError(onError)
  .route('/', meta)
  .route('/', composes)
  .route('/', blueprints);

export const services = {
  Blueprint: BlueprintService,
  Compose: ComposeService,
};

export type * from './composes/types';
export type * from './blueprints/types';
