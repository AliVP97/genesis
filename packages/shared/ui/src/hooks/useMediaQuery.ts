'use client';

import { useMediaQuery as muiUseMediaQuery } from '@mui/material';

export const useMediaQuery = (query: string, options?: any) => {
  return muiUseMediaQuery(query, options);
};

export default useMediaQuery;
