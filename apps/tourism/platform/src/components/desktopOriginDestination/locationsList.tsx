import { useRef, useEffect, useState, MutableRefObject, ReactNode } from 'react';
import style from './style.module.scss';
import {
  DesktopOriginDestinationLocationType,
  DesktopOriginDestinationLocationsType,
} from 'components/desktopOriginDestination/types';
import { LocationCard } from './locationCard';
import { HistoryIcon } from 'assets/icons';
import { ServiceDetector } from 'utils/helpers/serviceDetector';

const createList = <D,>(
  inputValue: string,
  data: DesktopOriginDestinationLocationsType<D>,
  dataCache: MutableRefObject<DesktopOriginDestinationLocationsType<D>>,
  defaultData: {
    title: string;
    value: DesktopOriginDestinationLocationsType<D>;
  },
  handleSelect: (e: DesktopOriginDestinationLocationType<D>) => void,
  history: DesktopOriginDestinationLocationsType<D>,
  onClearHistory: () => void,
  inputCharsLengthToSearch: number,
  focusedIndex: number,
  scrollHistoryRef: MutableRefObject<HTMLDivElement | null>,
) => {
  let finalData: {
    data: DesktopOriginDestinationLocationsType<D> | ReactNode;
    name?: string;
  };
  if (inputValue && inputValue.length >= inputCharsLengthToSearch) {
    if (data) {
      if (data?.length) {
        finalData = { data: data };
      } else {
        finalData = {
          data: <div className={style['location-card']}>موردی یافت نشد</div>,
        };
      }
    } else {
      if (dataCache.current) {
        if (dataCache.current?.length) {
          finalData = { data: dataCache.current };
        } else {
          finalData = {
            data: <div className={style['location-card']}>موردی یافت نشد</div>,
          };
        }
      } else {
        finalData = { name: 'empty', data: <div /> };
      }
    }
  } else {
    finalData = { name: 'busiest', data: defaultData.value };
  }

  let result;
  if (Array.isArray(finalData.data)) {
    result = finalData.data.map((item, i) => (
      // unxoun - WARNING: remove "+ i" later, it is for handling the server's mock response problems.
      <div className={style['locations-group']} key={item.id + i}>
        <LocationCard
          icon={item.icon}
          title={item.title as string}
          detail={item.description as string}
          description={item.subTitle}
          onClick={() => handleSelect(item)}
          sideContent={item.sideContent}
          elementName={item.elementName}
          isFocused={i === focusedIndex}
        />
        {item.children?.map((child: DesktopOriginDestinationLocationType<D>, j: number) => (
          <LocationCard
            key={child.id + j}
            icon={child.icon}
            title={child.title as string}
            detail={child.description as string}
            description={child.subTitle}
            onClick={() => handleSelect(child)}
            sideContent={child.sideContent}
            isFocused={i === focusedIndex}
          />
        ))}
      </div>
    ));
  } else result = finalData.data;

  if (finalData.name === 'busiest')
    result = (
      <>
        <div className={style['header']}>{defaultData.title}</div>
        {result}
      </>
    );
  if (history?.length && inputValue?.length < inputCharsLengthToSearch) {
    result = (
      <>
        <div className={style['history-header']}>
          <button className={style['clear-history']} onClick={onClearHistory}>
            پاک کردن
          </button>
        </div>
        <section ref={scrollHistoryRef}>
          {history.map((item) => (
            <LocationCard
              key={item.id}
              icon={<HistoryIcon />}
              title={item.title}
              detail={item.description as string}
              description={item.subTitle}
              onClick={() => handleSelect(item)}
              sideContent={item.sideContent}
              isFocused={false}
            />
          ))}
        </section>
        {result}
      </>
    );
  }
  return result;
};

type Props<D> = {
  activeInputName: string;
  originValue: string;
  destinationValue: string;
  inputValue: string;
  data: DesktopOriginDestinationLocationsType<D>;
  defaultData: {
    title: string;
    value: DesktopOriginDestinationLocationsType<D>;
  };
  onSelect: (e: DesktopOriginDestinationLocationType<D>) => void;
  history: DesktopOriginDestinationLocationsType<D>;
  onClearHistory: () => void;
  inputCharsLengthToSearch?: number;
};

export const LocationsList = <D,>({
  activeInputName,
  originValue,
  destinationValue,
  inputValue,
  data,
  defaultData,
  onSelect,
  history,
  onClearHistory,
  inputCharsLengthToSearch = 1,
}: Props<D>) => {
  const dataCache: MutableRefObject<DesktopOriginDestinationLocationsType<D>> = useRef(data);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollHistoryRef = useRef<HTMLDivElement>(null);
  const [historyHeight, setHistoryHeight] = useState<number>(0);
  const service = ServiceDetector();

  // set the max height of locations list
  useEffect(() => {
    if (service === 'flights') {
      const defaultMaxHeight = 312;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.maxHeight = `${historyHeight + defaultMaxHeight}px`;
      }
    }
  }, [historyHeight]);

  // change scroll by pressing the up/down button on keyboard
  useEffect(() => {
    if (scrollContainerRef.current) {
      if (focusedIndex === 0) {
        scrollContainerRef.current.scrollTop = 0;
      } else {
        const perItemHeight = 53;
        const moveAfterPerItems = 4;
        const selectedItemScrollTop = perItemHeight * (focusedIndex - 4);
        const difference = selectedItemScrollTop - scrollContainerRef.current.scrollTop;
        if (difference > 0) {
          scrollContainerRef.current.scrollTop = selectedItemScrollTop;
        }
        if (difference < -perItemHeight * moveAfterPerItems) {
          scrollContainerRef.current.scrollTop = focusedIndex * perItemHeight;
        }
      }
    }
  }, [focusedIndex]);

  // to check if the locations list are along with history items, the height of history items will be added to the maxHeight of its box
  const clearButtonHeight = 38;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollHistoryRef.current) {
        setHistoryHeight(scrollHistoryRef.current.clientHeight + clearButtonHeight);
      } else {
        setHistoryHeight(0);
      }
    }, 100); // Delay of 100ms to allow DOM updates
    return () => clearTimeout(timer);
  }, [activeInputName, scrollHistoryRef.current]);

  // if the inputs gets empty, the history height will be added to the scroll items height
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollHistoryRef.current) {
        if (activeInputName === 'origin' && originValue === '')
          setHistoryHeight(scrollHistoryRef.current.clientHeight + clearButtonHeight);
        if (activeInputName === 'destination' && destinationValue === '')
          setHistoryHeight(scrollHistoryRef.current.clientHeight + clearButtonHeight);
      }
    }, 100); // Delay of 100ms to allow DOM updates
    return () => clearTimeout(timer);
  }, [originValue, destinationValue]);

  // check if the input is the same as one of the list items, the item gets highlighted and will be able to go up and down by keyboard. or else, the first item will be highlighted.
  useEffect(() => {
    let index = 0;
    const handler = setTimeout(() => {
      const finalData = inputValue && data ? data : defaultData?.value;
      finalData?.forEach((item, i) => {
        if (item.title === (activeInputName === 'origin' ? originValue : destinationValue)) {
          index = i;
        }
      });
      setFocusedIndex(index);
      if (data) {
        dataCache.current = data;
      }
    }, 100);

    return () => {
      clearTimeout(handler);
    };
  }, [data, activeInputName]);

  // Activating the up/down buttons on the keyboard when any item appears through the list
  useEffect(() => {
    if (service === 'hotel') {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (data || defaultData.value) {
        if (e.key === 'ArrowDown') {
          setFocusedIndex((prevIndex) => {
            const newIndex = prevIndex + 1;
            const list = data?.length ? data : defaultData.value;
            return list.length > newIndex ? newIndex : 0;
          });
        } else if (e.key === 'ArrowUp') {
          setFocusedIndex((prevIndex) => {
            const listLength = data?.length || defaultData.value.length;
            return prevIndex > 0 ? prevIndex - 1 : listLength - 1;
          });
        } else if (e.key === 'Enter' && focusedIndex !== -1) {
          let selectedItem = defaultData.value[focusedIndex];
          if (data?.length > 0) {
            selectedItem = data[focusedIndex];
          }
          onSelect(selectedItem);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [data, focusedIndex, onSelect]);

  const handleSelect = (e: DesktopOriginDestinationLocationType<D>) => {
    onSelect(e);
  };

  return (
    <section ref={scrollContainerRef} className={style['list-height-limitation']}>
      {createList(
        inputValue,
        data,
        dataCache,
        defaultData,
        handleSelect,
        history,
        onClearHistory,
        inputCharsLengthToSearch,
        focusedIndex,
        scrollHistoryRef,
      )}
    </section>
  );
};
