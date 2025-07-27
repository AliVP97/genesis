import { useMemo } from 'react';
import { GetOrder } from 'services/domestic/flight/interface';

export const useHasReturn = (order: GetOrder) => {
  const hasReturn = useMemo(() => {
    if (order?.passengers?.[0].tickets?.length == 2) return true;
    return false;
  }, []);
  return { hasReturn };
};
