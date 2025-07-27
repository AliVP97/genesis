import { useEffect, useRef, type MutableRefObject } from 'react';
import { Device } from 'utils/interface';
import { useAppSelector } from 'store/hook/storeHook';

const useFiltersBoxSticky = (filtersBox: MutableRefObject<HTMLDivElement | null>) => {
  const scrollStatus = useAppSelector((state) => {
    return state.domesticFlightsReducer.mainPageScrollPlace.status;
  });
  const filtersBoxParent = filtersBox.current?.parentElement;
  let initialFiltersBoxDistanceFromTop = filtersBoxParent?.offsetTop;
  const filtersBoxElement = filtersBox.current;
  const top = useRef<number>(0);

  useEffect(() => {
    if (!Device.desktop || !filtersBoxParent || !filtersBox || filtersBox.current === null) {
      return;
    }
    const screenHeight = window.innerHeight;
    const filtersBoxHeight = filtersBoxElement!.clientHeight;
    const boxHeightDifference = filtersBoxHeight - screenHeight;
    const filtersBoxParentHeight = filtersBoxParent.offsetHeight;
    const filtersBoxParentHeightDifference = filtersBoxParentHeight - screenHeight;
    let lastScroll = window.scrollY;
    if (boxHeightDifference < 0) {
      // when the main search button gets clicked the following condition will be run
      if (!scrollStatus) {
        return;
      }
      window.scrollTo({
        top: initialFiltersBoxDistanceFromTop!,
        left: 0,
        behavior: 'smooth',
      });
      top.current = 0;
      filtersBoxElement!.style.top = '0px';
      filtersBoxElement!.style.position = 'sticky';
    } else if (boxHeightDifference > 0 && filtersBoxParentHeight > filtersBoxHeight) {
      if (filtersBoxParentHeight < filtersBoxHeight + top.current) {
        filtersBoxElement!.style.position = 'sticky';
        filtersBoxElement!.style.top = `${-boxHeightDifference}px`;
        top.current = filtersBoxElement!.offsetTop;
        window.scrollTo({
          top: initialFiltersBoxDistanceFromTop! + filtersBoxParentHeightDifference,
          left: 0,
          behavior: 'smooth',
        });
      }
      const shouldScroll = (currentScroll: number) => {
        initialFiltersBoxDistanceFromTop = filtersBoxParent?.offsetTop;
        return filtersBoxParentHeightDifference + initialFiltersBoxDistanceFromTop! > currentScroll;
      };

      const onScrollDown = (currentScroll: number) => {
        if (currentScroll > initialFiltersBoxDistanceFromTop! + top.current) {
          filtersBoxElement!.style.position = 'relative';
          filtersBoxElement!.style.top = `${top.current}px`;
          if (
            currentScroll >
            initialFiltersBoxDistanceFromTop! + boxHeightDifference + top.current
          ) {
            filtersBoxElement!.style.position = 'sticky';
            filtersBoxElement!.style.top = `${-boxHeightDifference}px`;
            top.current = currentScroll - (initialFiltersBoxDistanceFromTop! + boxHeightDifference);
          }
        }
      };

      const onScrollUp = (currentScroll: number) => {
        filtersBoxElement!.style.position = 'relative';
        filtersBoxElement!.style.top = `${top.current}px`;
        if (
          currentScroll < initialFiltersBoxDistanceFromTop! + top.current &&
          currentScroll > initialFiltersBoxDistanceFromTop!
        ) {
          filtersBoxElement!.style.position = 'sticky';
          filtersBoxElement!.style.top = '0px';
          top.current = currentScroll - initialFiltersBoxDistanceFromTop!;
        }
      };

      const handleScroll = () => {
        const currentScroll = window.scrollY;
        if (shouldScroll(currentScroll)) {
          if (currentScroll > lastScroll) {
            onScrollDown(currentScroll);
          } else {
            onScrollUp(currentScroll);
          }
        }

        lastScroll = currentScroll; // Update last scroll position
      };

      window.addEventListener('scroll', handleScroll);

      // Cleanup on component unmount
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      // when the main search button gets clicked the following condition will be run
      if (!scrollStatus) {
        return;
      }
      window.scrollTo({
        top: initialFiltersBoxDistanceFromTop!,
        left: 0,
        behavior: 'smooth',
      });
      top.current = 0;
      filtersBoxElement!.style.top = '0px';
      filtersBoxElement!.style.position = 'relative';
    }
  }, [filtersBoxParent?.offsetHeight, filtersBox, filtersBoxElement?.clientHeight]);
};

export default useFiltersBoxSticky;
