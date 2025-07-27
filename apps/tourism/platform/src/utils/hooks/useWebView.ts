'use client';

import { useState, useEffect } from 'react';
// import jwt_decode from 'jwt-decode';

export const useWebView = () => {
  const [isWebView, setWebView] = useState(false);
  // useEffect(() => {
  //   const availableLocalStorage = localStorage.getItem('UATP');
  //   if (availableLocalStorage) {
  //     const decodedToken: {client: string} = jwt_decode(
  //       availableLocalStorage as string,
  //     );
  //     if (decodedToken.client !== 'web') {
  //       Sentry.captureMessage(
  //         `viewing page from application. client: ${decodedToken.client}`,
  //       );
  //       setWebView(true);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    const platform = sessionStorage.getItem('platform') ?? '';
    const platformRegex = /android|ios/i;

    if (platformRegex.test(platform)) {
      setWebView(true);
    }
  }, []);

  return isWebView;
};
