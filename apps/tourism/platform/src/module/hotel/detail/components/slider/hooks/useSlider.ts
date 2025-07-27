import { TouchEvent, useLayoutEffect, useState } from 'react';
import { startPos } from '..';
const UseSlider = (slideCount: number, start: startPos = 'ltr') => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number>();
  const [touchEnd, setTouchEnd] = useState<number>();
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(0); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };
  useLayoutEffect(() => {
    if (start === 'rtl') {
      setCurrentIndex(slideCount);
    }
  }, [start]);
  const minSwipeDistance = 50;

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe)
      isLeftSwipe
        ? setCurrentIndex((prev) => (prev === slideCount ? 0 : prev + 1))
        : setCurrentIndex((prev) => (prev === 0 ? slideCount : prev - 1));

    // add your conditional logic here
  };

  const setCurrentIndexNext = () => {
    setCurrentIndex((prev) => (prev === slideCount ? 0 : prev + 1));
  };

  const setCurrentIndexPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slideCount : prev - 1));
  };
  return {
    currentIndex,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    setCurrentIndex,
    setCurrentIndexNext,
    setCurrentIndexPrev,
  };
};

export default UseSlider;
