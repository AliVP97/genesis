import { useState, useEffect } from 'react';
export enum BreakPoint {
  ExtraSmall = 'ExtraSmall',
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
  ExtraLarge = 'ExtraLarge',
  ExtraExtraLarge = 'ExtraExtraLarge',
}

const useDetectBreakPoint = () => {
  const [breakPoint, setBreakPoint] = useState<BreakPoint | null>(null);
  useEffect(() => {
    const width = window.innerWidth;
    switch (!!width) {
      case width < 576:
        return setBreakPoint(BreakPoint.ExtraSmall);
      case width < 768 && width >= 576:
        return setBreakPoint(BreakPoint.Small);
      case width < 992 && width >= 768:
        return setBreakPoint(BreakPoint.Medium);
      case width < 1200 && width >= 992:
        return setBreakPoint(BreakPoint.Large);
      case width < 1400 && width >= 1200:
        return setBreakPoint(BreakPoint.ExtraLarge);
      case width >= 1400:
        return setBreakPoint(BreakPoint.ExtraExtraLarge);
    }
  }, []);
  return { breakPoint };
};

export default useDetectBreakPoint;
