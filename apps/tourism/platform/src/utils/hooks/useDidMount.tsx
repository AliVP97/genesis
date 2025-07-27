import React from 'react';

// @ts-ignore
const useDidMountEffect = (effect, dependencies) => {
  const mounted = React.useRef(false);
  React.useEffect(() => {
    if (mounted.current) {
      const unmount = effect();
      return () => unmount && unmount();
    } else {
      mounted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // Reset on unmount for the next mount.
  // @ts-ignore
  React.useEffect(() => {
    return () => (mounted.current = false);
  }, []);
};

export default useDidMountEffect;
