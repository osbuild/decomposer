import { StatusCodes } from 'http-status-codes';
import { Maybe } from 'true-myth/maybe';
import { Result } from 'true-myth/result';

import { AppError } from '@app/errors';
import type { JobQueue } from '@app/queue';
import type { ComposeDocument, JobResult, Store } from '@app/types';

import { Model } from './model';
import type { ComposeRequest, ComposeService as Service } from './types';

export class ComposeService implements Service {
  private model: Model;
  private queue: JobQueue<ComposeRequest>;

  constructor(queue: JobQueue<ComposeRequest>, store: Store) {
    this.queue = queue;
    this.model = new Model({
      path: store.path,
      composes: store.composes,
    });
    this.queue.events.on('message', async ({ data }: JobResult) => {
      await this.update(data.id, { status: data.result });
    });
  }

  public async all(blueprintId?: string) {
    return this.model.findAll(Maybe.of(blueprintId));
  }

  public async status(id: string) {
    const result = await this.model.findById(id);

    return result.map((compose) => {
      return {
        request: compose.request as ComposeRequest,
        image_status: {
          status: compose.status,
        },
      };
    });
  }

  public async add(request: ComposeRequest, blueprintId?: string) {
    const result = await this.model.create(request, Maybe.of(blueprintId));

    return result.map(({ id }) => {
      this.queue.enqueue({ id, request });
      return { id };
    });
  }

  public async update(id: string, changes: Partial<ComposeDocument>) {
    return this.model.update(id, changes);
  }

  public async delete(id: string) {
    if (this.queue.isCurrent(id)) {
      return Result.err(
        new AppError({
          code: StatusCodes.FORBIDDEN,
          message: 'Job is in progress, it cannot be deleted.',
        }),
      );
    }
    this.queue.remove(id);
    return this.model.delete(id);
  }
}
