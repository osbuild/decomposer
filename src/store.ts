import path from 'path';
import pouchdb from 'pouchdb';

import type { BlueprintWithRequest, ComposeWithBuildStatus } from '@app/api';

type Document = {
  _id: string;
  _rev?: string;
};

export type ComposeDocument = Document & ComposeWithBuildStatus;

export type BlueprintDocument = Document & BlueprintWithRequest;

export type Store = {
  path: string;
  composes: PouchDB.Database<ComposeDocument>;
  blueprints: PouchDB.Database<BlueprintDocument>;
};

export const createStore = (store: string) => {
  const composesStore: PouchDB.Database<ComposeDocument> = new pouchdb(
    path.join(store, 'composes'),
  );

  const blueprintsStore: PouchDB.Database<BlueprintDocument> = new pouchdb(
    path.join(store, 'blueprints'),
  );

  return {
    path: store,
    composes: composesStore,
    blueprints: blueprintsStore,
  };
};
