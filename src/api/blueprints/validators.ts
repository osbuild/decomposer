import { zValidator } from '@hono/zod-validator';
import { parserFor } from 'true-myth-zod';

import { DatabaseError, ValidationError } from '@app/errors';
import type { BlueprintDocument } from '@app/store';
import { BlueprintItem, CreateBlueprintRequest } from '@gen/decomposer/zod';

export const createBlueprint = zValidator(
  'json',
  CreateBlueprintRequest,
  (result) => {
    if (!result.success) {
      throw new ValidationError(result.error);
    }
  },
);

export const blueprintResponse = (blueprint: BlueprintDocument) => {
  const parser = parserFor(BlueprintItem);

  const result = parser({ id: blueprint._id, ...blueprint });
  if (result.isErr) {
    throw new DatabaseError({
      message: 'Stored database value is invalid',
      details: result.error.issues,
    });
  }

  return result.value;
};
