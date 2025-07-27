export const versionGenerator = () => {
  const version = (process.env.NEXT_PUBLIC_VERSION as string).split('.');
  return +version[0] * 10000 + +version[1] * 100 + +version[2];
};
