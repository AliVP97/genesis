import { useEffect, useState } from 'react';

type Subscriber = () => void;

const subscribers = new Set<Subscriber>();

type ResponsiveConfig = Record<string, [number, number]>;
type ResponsiveInfo = Record<string, boolean>;

let info: ResponsiveInfo;

let responsiveConfig: ResponsiveConfig = {
  isMobile: [0, 768],
  isDesktop: [768, Infinity],
};

function handleResize() {
  const oldInfo = info;
  calculate();
  if (oldInfo === info) return;
  subscribers.forEach((subscriber) => {
    subscriber();
  });
}

let listening = false;

function calculate() {
  const width = typeof window !== 'undefined' ? window.innerWidth : 0;
  const newInfo = {} as ResponsiveInfo;
  let shouldUpdate = false;
  for (const key of Object.keys(responsiveConfig)) {
    newInfo[key] = width >= responsiveConfig[key][0] && width < responsiveConfig[key][1];
    if (newInfo[key] !== info[key]) {
      shouldUpdate = true;
    }
  }
  if (shouldUpdate) {
    info = newInfo;
  }
}

export function configResponsive(config: ResponsiveConfig) {
  responsiveConfig = config;
  if (info) calculate();
}

/**
 * @see https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useResponsive/index.ts
 */

export function useResponsive() {
  if (!listening) {
    info = {};
    calculate();
    typeof window !== 'undefined' && window.addEventListener('resize', handleResize);
    listening = true;
  }
  const [state, setState] = useState<ResponsiveInfo>(info);

  useEffect(() => {
    // In React 18's StrictMode, useEffect perform twice, resize listener is remove, so handleResize is never perform.
    // https://github.com/alibaba/hooks/issues/1910
    if (!listening) {
      typeof window !== 'undefined' && window.addEventListener('resize', handleResize);
    }

    const subscriber = () => {
      setState(info);
    };

    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        typeof window !== 'undefined' && window.removeEventListener('resize', handleResize);
        listening = false;
      }
    };
  }, []);

  return state;
}
