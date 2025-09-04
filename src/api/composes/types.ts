import type { Status } from '@app/constants';
import type { ComposeDocument, Store } from '@app/store';
import type { Schemas } from '@gen/decomposer';

import type { ServiceTask as Task } from '../types';

export type ComposeBuildStatus = { status: Status };
export type Compose = Schemas['ComposesResponseItem'];
export type ComposeRequest = Schemas['ComposeRequest'];
export type Composes = Schemas['ComposesResponse'];
export type ComposeId = Schemas['ComposeResponse'];
export type ComposeStatus = Schemas['ComposeStatus'];

// omit the `id` since this will be used for a pouchdb
// document. pouchdb uses `_id` as the index
export type ComposeWithBuildStatus = Omit<Compose, 'id'> & ComposeBuildStatus;

export type ComposeStore = Pick<Store, 'path' | 'composes'>;

export type ComposeService = {
  all: (blueprintId?: string) => Task<Compose[]>;
  add: (request: ComposeRequest) => Task<ComposeId>;
  status: (id: string) => Task<ComposeStatus>;
  update: (id: string, changes: Partial<ComposeDocument>) => Task<ComposeId>;
  delete: (id: string) => Task<unknown>;
};
