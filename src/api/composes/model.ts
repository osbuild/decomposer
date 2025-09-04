import { Mutex } from 'async-mutex';
import { mkdir, rmdir } from 'node:fs/promises';
import path from 'node:path';
import type { Maybe } from 'true-myth/maybe';
import * as Task from 'true-myth/task';
import { v4 as uuid } from 'uuid';

import { Status } from '@app/constants';
import { normalizeError } from '@app/errors';
import type { ComposeDocument } from '@app/store';

import type { Compose, ComposeRequest, ComposeStore } from './types';
import * as validators from './validators';

export class Model {
  private store: ComposeStore;
  private mutex: Mutex;

  constructor(store: ComposeStore) {
    this.store = store;
    this.mutex = new Mutex();
  }

  async create(request: ComposeRequest) {
    return Task.tryOrElse(normalizeError, async () => {
      const id = uuid();
      await mkdir(path.join(this.store.path, id), { recursive: true });
      await this.store.composes.put({
        _id: id,
        created_at: new Date().toISOString(),
        status: Status.PENDING,
        request,
      });

      return { id };
    });
  }

  async findAll(blueprintId: Maybe<string>) {
    return Task.tryOrElse(normalizeError, async (): Promise<Compose[]> => {
      const docs = await this.store.composes.allDocs({
        include_docs: true,
      });

      return docs.rows
        .map((row) => row.doc!)
        .map(validators.composesResponse)
        .filter((compose) => {
          return blueprintId?.match({
            Just: (bp) => bp === compose.blueprintId,
            Nothing: () => true,
          });
        });
    });
  }

  async findById(id: string) {
    return Task.tryOrElse(normalizeError, () => this.store.composes.get(id));
  }

  async update(id: string, changes: Partial<ComposeDocument>) {
    return Task.tryOrElse(normalizeError, async () => {
      return this.mutex.runExclusive(async () => {
        const compose = await this.store.composes.get(id);
        await this.store.composes.put({
          ...compose,
          ...changes,
        });

        return { id };
      });
    });
  }

  async delete(id: string) {
    return Task.tryOrElse(normalizeError, async () => {
      await this.mutex.runExclusive(async () => {
        const compose = await this.store.composes.get(id);
        await this.store.composes.remove(compose);
        await rmdir(path.join(this.store.path, id), { recursive: true });
      });
    });
  }
}
