import path from 'path';
import { Maybe, Result } from 'true-myth';
import * as Task from 'true-myth/task';

import type { ComposeRequest } from '@app/api/composes';

import { saveBlueprint } from './save-blueprint';
import type { Job, WorkerArgs } from './types';

export const workerError = (error: unknown) => {
  if (error instanceof Error) {
    return new Error(error.message);
  }

  return error;
};

export const buildImage = ({
  store,
  executable = 'image-builder',
}: WorkerArgs) => {
  return async ({ request, id }: Job<ComposeRequest>) => {
    const outputDir = path.join(store, id);
    const bpResult = await saveBlueprint(outputDir, id, request.customizations);
    if (bpResult.isErr) {
      return Result.err(bpResult.error);
    }

    const bpPath = bpResult.value;

    const imageRequest = Maybe.of(request.image_requests[0]);
    if (imageRequest.isNothing) {
      // this really shouldn't happen since we validate the image request at
      // the api handler level, but it is an additional runtime check, so it's ok
      return Result.err(new Error('Image request is empty'));
    }

    return await Task.tryOrElse(workerError, async () => {
      const proc = Bun.spawn(
        [
          executable,
          'build',
          '--blueprint',
          bpPath,
          '--output-dir',
          outputDir,
          '--with-manifest',
          '--distro',
          request.distribution,
          imageRequest.value.image_type,
        ],
        {
          stdout: Bun.file(path.join(outputDir, 'build.log')),
          stderr: Bun.file(path.join(outputDir, 'build.log')),
        },
      );

      await proc.exited;

      if (proc.exitCode !== 0) {
        throw new Error('Image builder exited with a non-zero exit code');
      }

      return 'OK';
    });
  };
};
