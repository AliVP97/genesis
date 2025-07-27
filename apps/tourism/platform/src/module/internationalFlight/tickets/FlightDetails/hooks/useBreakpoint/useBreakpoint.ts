import { useEffect, useMemo, useRef, useState } from 'react';
import { Breakpoint, BreakpointMatcherFactory, DeviceSize } from './types';
import { getSizeValue, getDeviceSize } from './utils';

const breakpoint: Breakpoint = {
  up: (size) => (width) => width >= getSizeValue(size),
  down: (size) => (width) => width < getSizeValue(size),
  between: (start, end) => (width) => getSizeValue(start) > width && width <= getSizeValue(end),
};

const useBreakpoint = (matcherFactory: BreakpointMatcherFactory) => {
  const [isMatched, setIsMatched] = useState(false);
  const preSize = useRef<DeviceSize>();

  const matcher = useMemo(() => matcherFactory(breakpoint), [matcherFactory]);

  useEffect(() => {
    const handleResize = () => {
      const { size, width } = getDeviceSize();

      if (preSize.current === size) {
        return;
      }

      setIsMatched(matcher(width));
      preSize.current = size;
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [matcher]);

  return isMatched;
};

export default useBreakpoint;
