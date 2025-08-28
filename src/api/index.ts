import { Hono } from 'hono';

import { meta } from './meta';

export const api = new Hono().route('/', meta);
