import { MutableRefObject, useEffect } from 'react';

export const useClickOutside = (
  ref: MutableRefObject<null | HTMLDivElement>,
  handler: (e: unknown) => void,
) => {
  useEffect(() => {
    const subscriber = (e: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el || el.contains(e?.target as Node)) {
        return;
      }
      handler(e);
    };
    document.addEventListener('mousedown', subscriber);
    document.addEventListener('touchstart', subscriber);
    return () => {
      document.removeEventListener('mousedown', subscriber);
      document.removeEventListener('touchstart', subscriber);
    };
  }, [ref, handler]);
};
