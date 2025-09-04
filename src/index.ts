import chalk from 'chalk';
import { chmod } from 'node:fs/promises';

import { app } from '@app/app';
import { args } from '@app/args';
import { API_ENDPOINT } from '@app/constants';
import { removeSocket } from '@app/utilities';

import { version } from '../package.json';

// we need to make sure that the socket doesn't
// already exist, otherwise we run into issues
// where the server can't run
await removeSocket(args.socket);

const server = {
  fetch: app.fetch,
  unix: args.socket,
};

Bun.serve(server);

// we need to change this so that we can
// ping the socket as a non-privileged user
await chmod(args.socket, 0o660);

const shutdown = async (signal: string) => {
  console.log(` Received ${signal}`);
  await removeSocket(args.socket);
  console.log(chalk.green('✓'), 'Server shutdown gracefully');
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

console.log(`
  🚀 ${chalk.magenta(chalk.bold('Decomposer', version))}
  → socket: ${args.socket}
  → endpoint: ${API_ENDPOINT}
  → pid: ${process.pid}

${chalk.green('✓')} Server running...
`);
