import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
export const useRouteChange = () => {
  const router = useRouter();
  const [routeChangeStarted, setRouteChangeStarted] = useState(false);
  const [routeChangeCompleted, setRouteChangeCompleted] = useState(true);
  const handleChangeStart = () => {
    setRouteChangeStarted(true);
    setRouteChangeCompleted(false);
  };
  const handleChangeComplete = () => {
    setRouteChangeStarted(false);
    setRouteChangeCompleted(true);
  };
  useEffect(() => {
    router.events.on('routeChangeStart', handleChangeStart);
    router.events.on('routeChangeComplete', handleChangeComplete);
    router.events.on('routeChangeError', handleChangeComplete);
    return () => {
      router.events.on('routeChangeStart', handleChangeStart);
      router.events.off('routeChangeComplete', handleChangeComplete);
      router.events.off('routeChangeError', handleChangeComplete);
    };
  }, [router]);
  return {
    routeChangeStarted,
    routeChangeCompleted,
  };
};
