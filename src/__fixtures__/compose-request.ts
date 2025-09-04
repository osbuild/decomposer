import type z from 'zod';

import type { ComposeRequest } from '@gen/decomposer/zod';

export const composeRequest: z.infer<typeof ComposeRequest> = {
  distribution: 'centos-9',
  client_id: 'api',
  image_requests: [
    {
      image_type: 'guest-image',
      architecture: 'x86_64',
      upload_request: {
        type: 'aws.s3',
        options: {},
      },
    },
  ],
};
