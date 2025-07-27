import { MutableRefObject, useEffect, useRef, useState } from 'react';

/**
 * A hook to determine the width of an element and provide a ref to the element.
 * @return {elementWidth: number, elementRef: MutableRefObject<null>}
 */
export default function useElementWidth(): {
  elementWidth: number;
  elementRef: MutableRefObject<null>;
} {
  const [elementWidth, setElementWidth] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        setElementWidth(entries[0].contentRect.width);
      }
    });

    if (element) {
      resizeObserver.observe(element);
    }

    return () => {
      if (element) {
        resizeObserver.unobserve(element);
      }
    };
  }, []);

  return { elementWidth, elementRef };
}
