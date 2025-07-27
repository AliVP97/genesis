import { useState, useEffect } from 'react';

export const useIsSuperApp = () => {
  const [isSuperApp, setIsSuperApp] = useState(false);
  useEffect(() => {
    sessionStorage.platform === 'superapp' && setIsSuperApp(true);
  }, []);
  return isSuperApp;
};
