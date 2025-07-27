import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { SearchQuery } from '../../../types/common';

export type IataCodes = {
  originIata?: string;
  destinationIata: string;
};

/**
 * Get the id from the router query this id can be defined in url params or in
 * the url search params.
 */
const useIataCodes = (): IataCodes => {
  const query = useRouter().query as SearchQuery & { id: string };

  return useMemo(() => {
    const { id } = query;
    const result = id.split('-');
    const originIata = result[1] ? result[0] : undefined;
    const destinationIata = result[1] ? result[1] : result[0];

    if (originIata) {
      return {
        originIata,
        destinationIata,
      };
    }

    return {
      destinationIata,
    };
  }, [query]);
};

export default useIataCodes;
