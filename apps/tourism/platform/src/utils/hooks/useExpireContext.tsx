import { useContext } from 'react';
import { ExpireContext } from 'context/expire';

export const useExpireContext = () => {
  return useContext(ExpireContext);
};
