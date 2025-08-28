import { generateZodClientFromOpenAPI } from 'openapi-zod-client';
import { resolveConfig } from 'prettier';

let input = './generated/decomposer/v2/api.json';
let output = './generated/decomposer/v2/zod.ts';
let template = './tools/openapi/zod.schemas.hbs';
let exists = await Bun.file(input).exists();

if (!exists) {
  console.warn(
    '❗ OpenAPI schema has not been created, please run `bun api:filter` first',
  );
  process.exit();
}

console.log('🤖 Generating zod schema for decomposer');
await generateZodClientFromOpenAPI({
  openApiDoc: await Bun.file(input).json(),
  prettierConfig: await resolveConfig('./.prettierrc.js'),
  distPath: output,
  templatePath: template,
});

input = './generated/cloudapi/v2/api.json';
output = './generated/cloudapi/v2/zod.ts';
template = './tools/openapi/zod.schemas.hbs';
exists = await Bun.file(input).exists();

if (!exists) {
  console.warn(
    '❗ OpenAPI schema has not been created, please run `bun api:filter` first',
  );
  process.exit();
}

console.log('⛅ Generating zod schema for cloudapi');
await generateZodClientFromOpenAPI({
  openApiDoc: await Bun.file(input).json(),
  prettierConfig: await resolveConfig('./.prettierrc.js'),
  distPath: output,
  templatePath: template,
});
