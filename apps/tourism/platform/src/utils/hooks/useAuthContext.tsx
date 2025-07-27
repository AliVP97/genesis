import { useContext } from 'react';
import { AuthContext } from 'context/login';

export const useAuthContext = () => {
  return useContext(AuthContext);
};
