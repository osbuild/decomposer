import { format, resolveConfig } from 'prettier';

import * as cloudapi from './configs/cloudapi';
import * as decomposer from './configs/decomposer';

const prettierrc = await resolveConfig('./.prettierrc.js');

[decomposer, cloudapi].forEach(
  async ({ input, output, generator, component }) => {
    const schema = await generator(input);

    console.log(`📄 Generating filtered openapi spec file for ${component}`);
    await Bun.write(
      output,
      await format(JSON.stringify(schema, null, 2), {
        ...prettierrc,
        filepath: output,
      }),
    );
  },
);
