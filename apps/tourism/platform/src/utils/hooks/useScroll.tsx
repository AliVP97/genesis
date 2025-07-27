import React, { useEffect, useState } from 'react';
import { smoothScrollTo } from 'utils/helpers/smoothScroll';

export const useScroll = () => {
  const [isScroll, setIsScroll] = useState(false);

  const handleScroll = (e: React.ChangeEvent) => {
    if (e?.target?.scrollTop > 60) setIsScroll(true);
    else setIsScroll(false);
  };
  useEffect(() => {
    const wrapper: HTMLElement | null = document?.querySelector('body');
    wrapper && smoothScrollTo(wrapper, 0);
    wrapper?.addEventListener('scroll', (e) => handleScroll(e as unknown as React.ChangeEvent));

    return () => {
      wrapper?.removeEventListener('scroll', (e) =>
        handleScroll(e as unknown as React.ChangeEvent),
      );
    };
  }, []);

  return isScroll;
};
