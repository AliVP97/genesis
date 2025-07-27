import { useState, useEffect, MutableRefObject } from 'react';

const useOutsideRef = (ref: MutableRefObject<null | HTMLDivElement>) => {
  const [isOutside, setIsOutside] = useState(false);
  const clickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setIsOutside(true);
    } else setIsOutside(false);
  };
  useEffect(() => {
    document.addEventListener('mousedown', clickOutside);
    return () => {
      document.removeEventListener('mousedown', clickOutside);
    };
  }, [ref]);
  return isOutside;
};

export default useOutsideRef;
