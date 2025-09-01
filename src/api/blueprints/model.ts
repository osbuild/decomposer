import * as Task from 'true-myth/task';

import { normalizeError } from '@app/errors';
import type { BlueprintDocument } from '@app/store';

import type { BlueprintMetadata } from './types';
import * as validators from './validators';

export class Model {
  private store: PouchDB.Database<BlueprintDocument>;

  constructor(store: PouchDB.Database<BlueprintDocument>) {
    this.store = store;
  }

  async findAll() {
    return Task.tryOrElse(
      normalizeError,
      async (): Promise<BlueprintMetadata[]> => {
        const docs = await this.store.allDocs({
          include_docs: true,
        });

        return docs.rows
          .map((row) => row.doc!)
          .map(validators.blueprintResponse);
      },
    );
  }
}
