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
