export const addtionalServiceCount = (count?: number) => {
  if (!count) {
    return 0;
  }
  return +count % 2 === 0 || +count === 1 ? 0 : 1;
};
