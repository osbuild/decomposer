import * as Task from 'true-myth/task';
import { v4 as uuid } from 'uuid';

import { normalizeError } from '@app/errors';
import type { BlueprintDocument } from '@app/store';
import { maybeEmptyObject } from '@app/utilities';

import type {
  BlueprintBody,
  BlueprintMetadata,
  BlueprintRequest,
} from './types';
import * as validators from './validators';

export class Model {
  private store: PouchDB.Database<BlueprintDocument>;

  constructor(store: PouchDB.Database<BlueprintDocument>) {
    this.store = store;
  }

  async create(request: BlueprintRequest) {
    return Task.tryOrElse(normalizeError, async () => {
      const id = uuid();
      return this.store.put({
        _id: id,
        name: request.name,
        description: request.description,
        distribution: request.distribution,
        image_requests: request.image_requests,
        customizations: request.customizations,
        last_modified_at: new Date().toISOString(),
        version: 1,
      });
    });
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

  async findById(id: string, body?: BlueprintBody) {
    return Task.tryOrElse(normalizeError, async () => {
      const blueprint = await this.store.get(id);

      return maybeEmptyObject<BlueprintBody>(body).match({
        Nothing: () => blueprint,
        Just: (body) => {
          return {
            ...blueprint,
            image_requests: blueprint.image_requests.filter((ir) =>
              body.image_types?.includes(ir.image_type),
            ),
          };
        },
      }) as BlueprintDocument;
    });
  }

  async update(id: string, changes: BlueprintRequest) {
    return Task.tryOrElse(normalizeError, async () => {
      const blueprint = await this.store.get(id);

      await this.store.put({
        ...blueprint,
        ...changes,
      });

      return { id };
    });
  }

  async delete(id: string) {
    return Task.tryOrElse(normalizeError, async () => {
      const blueprint = await this.store.get(id);
      await this.store.remove(blueprint);
    });
  }
}
