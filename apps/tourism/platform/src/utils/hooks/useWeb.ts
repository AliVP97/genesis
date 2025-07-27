import { useEffect, useState } from 'react';
import { useWebView } from './useWebView';
import { useIsSuperApp } from './useIsSuperApp';

// isSuperapp : When tourism services are available through a PWA
// isWebview : When tourism services are available through a Application (android/ios)

export const useWeb = () => {
  const isSuperApp = useIsSuperApp();
  const isWebView = useWebView();
  const [isWeb, setIsWeb] = useState<boolean>(true);
  useEffect(() => {
    if (isSuperApp || isWebView) {
      setIsWeb(false);
    }
  }, [isSuperApp, isWebView]);
  return isWeb;
};
