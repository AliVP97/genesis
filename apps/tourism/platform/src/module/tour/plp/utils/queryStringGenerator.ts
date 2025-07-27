import { TransformedDataType } from '../components/FilterTour/interface';

export const formatQueryObject = (
  filters: TransformedDataType,
): Record<string, string[] | string> => {
  const queryObject: Record<string, string[] | string> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      if (key === 'availableMonths') {
        // Transform availableMonths into ["startFrom-startTo", "startFrom-startTo"]
        queryObject[key] = (value as { startFrom: string; startTo: string }[]).map(
          (month) => `${month.startFrom}_${month.startTo}`,
        );
      } else {
        // Keep other arrays as they are
        queryObject[key] = value.map(String);
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (key === 'priceRange') {
        const { min, max } = value as { min: number; max: number };
        // Convert priceRange into ["min", "max"]
        queryObject[key] = [`${min}`, `${max}`];
      }
    }
  }

  return queryObject;
};
