import { useEffect, useState } from 'react';

export const useIsNajafBaghdad = () => {
  const [result, setResult] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const localStorageLastSearch = localStorage.getItem('last_search');

    if (localStorageLastSearch) {
      const lastSearch = JSON.parse(localStorageLastSearch)?.[0];

      const iatas = [lastSearch.origin.value, lastSearch.destination.value];

      const najafBaghdadIatas = ['njf', 'bgw'];

      setResult(iatas.some((iata) => najafBaghdadIatas.includes(iata.toLowerCase())));
    }
  }, []);

  return result;
};
