export default function uniqueObjectsArray<T>(
  allData: T[], // Generic array of objects
  checkItem: keyof T, // A key of the objects in the array
): T[] {
  return allData.reduce((acc, current) => {
    const result = acc.find((item) => item?.[checkItem] === current?.[checkItem]);
    if (!result) {
      acc.push(current);
    }
    return acc;
  }, [] as T[]);
}
