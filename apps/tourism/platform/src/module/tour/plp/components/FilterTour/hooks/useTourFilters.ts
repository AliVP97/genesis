import { useEffect, useState } from 'react';
import { TourFiltersType } from '../interface';
import { useRouter } from 'next/router';

// Make the hook generic to accept any filter type
const useTourFilters = (
  initialQuery: Record<string, string | string[] | undefined>,
  validKeys: (keyof TourFiltersType)[],
  priceRange: number[] | undefined,
) => {
  const { pathname, query } = useRouter();
  const wholePriceRange = `${priceRange?.[0]},${priceRange?.[1]}`;
  // Function to filter the query object based on valid keys
  const getValidFilters = (
    query: Record<string, string | string[] | undefined>,
    validKeys: (keyof TourFiltersType)[],
  ): TourFiltersType => {
    const filteredQuery: TourFiltersType = {};
    validKeys.forEach((key) => {
      const queryKey = key as string;
      if (query[queryKey]) {
        filteredQuery[key] = (query[queryKey] as string).split(',');
      }
    });
    return filteredQuery;
  };

  // Initialize filters using getValidFilters
  const [filters, setFilters] = useState<TourFiltersType>(getValidFilters(initialQuery, validKeys));

  useEffect(() => {
    setFilters({ ...getValidFilters(initialQuery, validKeys) });
  }, [pathname, query]);

  // Function to handle filter updates
  const handleFilter = (val: string, key: keyof TourFiltersType) => {
    setFilters((prevFilters) => {
      const currentFilter = prevFilters[key] as string[] | undefined;

      // Handle priceRange separately
      if (key === 'priceRange') {
        const updatedFilter = val.includes(',') ? val.split(',') : wholePriceRange.split(',');

        // Reset the filter if it matches the default price range
        if (updatedFilter.join(',') === wholePriceRange) {
          const { [key]: _, ...rest } = prevFilters; // Remove the key from filters
          void _;
          return rest as TourFiltersType;
        }

        return { ...prevFilters, [key]: updatedFilter };
      }

      // Handle other filters
      let updatedFilter: string[];
      if (currentFilter) {
        updatedFilter = currentFilter.includes(val)
          ? currentFilter.filter((item) => item !== val) // Remove the value if it exists
          : [...currentFilter, val]; // Add the value if it doesn't exist
      } else {
        updatedFilter = [val]; // Initialize with the new value
      }

      // Reset the filter if it's empty
      if (!updatedFilter.length) {
        const { [key]: _, ...rest } = prevFilters; // Remove the key from filters
        void _;
        return rest as TourFiltersType;
      }

      // Return updated filters
      return { ...prevFilters, [key]: updatedFilter };
    });
  };

  // Function to reset all filters
  const resetFilters = () => {
    setFilters({});
  };

  return { filters, handleFilter, resetFilters };
};

export default useTourFilters;
