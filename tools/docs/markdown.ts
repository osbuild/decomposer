import { parse } from 'comment-parser';
import hbs from 'handlebars';
import type { RouterRoute } from 'hono/types';
import path from 'path';

import { meta } from '@app/api/meta';
import { args } from '@app/args';
import { API_ENDPOINT, SOCKET_PATH } from '@app/constants';

const CURL_DIR = path.join('generated', 'examples', 'curl');
const HTTP_DIR = path.join('generated', 'examples', 'http');

const loadTemplate = async (input: string) => {
  const source = await Bun.file(
    path.join(__dirname, 'templates', input),
  ).text();

  return hbs.compile(source);
};

const templates = {
  markdown: await loadTemplate('markdown.hbs'),
  bash: await loadTemplate('shell.hbs'),
  http: await loadTemplate('http.hbs'),
};

const common = {
  api: API_ENDPOINT,
  socket: args.socket,
};

const createTemplate = async (
  type: keyof typeof templates,
  filename: string,
  route: RouterRoute,
) => {
  const template = templates[type]({
    ...common,
    ...route,
    default_socket: SOCKET_PATH,
  });
  const ext = type === 'bash' ? '.sh' : '.http';
  const dir = type === 'bash' ? CURL_DIR : HTTP_DIR;
  await Bun.file(path.join(dir, 'meta', filename + ext)).write(template);
  return template.trim();
};

const filterUnique = () => {
  const seen = new Set<string>();
  return (route: RouterRoute) => {
    const key = `${route.method}:${route.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  };
};

const mapTemplates = (tsDocs: string[]) => {
  return async (route: RouterRoute, index: number) => {
    const filename = route.path.split('/')[1]!.split('.')[0];
    const bash = await createTemplate('bash', filename!, route);
    const http = await createTemplate('http', filename!, route);
    return {
      ...route,
      description: tsDocs[index],
      bash,
      http,
    };
  };
};

const metaDocs = parse(
  await Bun.file(path.join('src', 'api', 'meta', 'index.ts')).text(),
).map((b) => b.description);
const metaRoutes = meta.routes
  .filter(filterUnique())
  .map(mapTemplates(metaDocs));

const data = {
  ...common,
  endpoint: [
    {
      title: 'Meta Endpoints',
      routes: await Promise.all(metaRoutes),
    },
  ],
};

console.log('📄 Generating API Docs');
const markdown = templates.markdown(data).trim() + '\n';

console.log('✅ All docs generated');
await Bun.file(path.join('src', 'api', 'README.md')).write(markdown);
