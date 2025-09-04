import { arch } from 'node:os';

export const removeSocket = async (socket: string) => {
  try {
    await Bun.file(socket).unlink();
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // the socket file may not exist, if it doesn't just ignore the error.
      // see https://github.com/osbuild/decomposer/pull/1#discussion_r2321112364
      return;
    }
    console.error(error);
  }
};

export const getHostArch = () => {
  const hostArch = arch();
  if (['arm', 'arm64'].includes(hostArch)) {
    return 'aarch64';
  }

  if (['x64'].includes(hostArch)) {
    return 'x86_64';
  }

  throw Error('Unknown host arch');
};
