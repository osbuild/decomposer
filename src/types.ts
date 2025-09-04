import type { BlueprintService, ComposeService } from '@app/api';

export type { ComposeDocument, Store } from '@app/store';
export type { Job, JobResult, Worker } from '@app/worker';

export type AppContext = {
  Variables: {
    services: {
      blueprint: BlueprintService;
      compose: ComposeService;
    };
  };
};
