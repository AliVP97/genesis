import style from './style.module.scss';
import cn from 'classnames';

import { LocationsList } from './locationsList';
import { PlaceIcon, SwapIcon } from 'assets/icons';

import {
  ActiveInputNameType,
  DesktopOriginDestinationLocationType,
  DesktopOriginDestinationPropsType,
  Point,
} from './types';
import { useQuery } from 'react-query';
import {
  FocusEvent,
  FormEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cloneDeep } from 'lodash';
import {
  DesktopOriginDestinationStateType,
  LocationType,
  TAdditionalDataDefaultValue,
} from 'components/originDestination/interface';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import { useDebounce } from 'utils/hooks/useDebounce';

const DesktopOriginDestination = <T, D = TAdditionalDataDefaultValue>({
  state,
  defaultData,
  api,
  onSelect,
  history,
  onClearHistory,
  originOnly = false,
  showTransportServiceProviderTitle,
  showDescription,
  inputCharsLengthToSearch = 1,
  originPlaceHolder = 'مبدا',
  banEnglishInput = false,
  defaultQuery,
}: DesktopOriginDestinationPropsType<T, D>) => {
  const isMouseOut = useRef(true);
  const handleDocumentClick = () => {
    if (isMouseOut.current) {
      setActiveInputName(undefined);
    }
  };
  const handleMouseEnter = () => {
    isMouseOut.current = false;
  };
  const handleMouseLeave = () => {
    isMouseOut.current = true;
  };
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const originInputElement = useRef<HTMLInputElement>(null);
  const destinationInputElement = useRef<HTMLInputElement>(null);

  const shouldInputValueUpdate: MutableRefObject<boolean> = useRef(false);
  const [activeInputName, setActiveInputName] = useState<ActiveInputNameType>();
  const [originValue, setOriginValue] = useState('');
  const handleSetOriginValue = (value: string, shouldInputValueUpdateFlag: boolean) => {
    shouldInputValueUpdate.current = shouldInputValueUpdateFlag;
    setOriginValue(value);
  };
  const [destinationValue, setDestinationValue] = useState('');
  const handleSetDestinationValue = (value: string, shouldInputValueUpdateFlag: boolean) => {
    shouldInputValueUpdate.current = shouldInputValueUpdateFlag;
    setDestinationValue(value);
  };
  const [inputValue, setInputValue] = useState('');

  const debounceFunction = useDebounce(inputValue, 500);

  const setFullOriginValue = useCallback(() => {
    return (
      state?.origin?.title +
      (showTransportServiceProviderTitle
        ? state?.origin?.description
          ? ' - ' + state?.origin?.description
          : ''
        : '')
    );
  }, [showTransportServiceProviderTitle, state?.origin?.description, state?.origin?.title]);

  const setFullDestinationValue = useCallback(() => {
    return (
      state?.destination?.title +
      (showTransportServiceProviderTitle
        ? state?.destination?.description
          ? ' - ' + state?.destination?.description
          : ''
        : '')
    );
  }, [
    showTransportServiceProviderTitle,
    state?.destination?.description,
    state?.destination?.title,
  ]);

  useEffect(() => {
    handleSetOriginValue(setFullOriginValue(), false);
    handleSetDestinationValue(setFullDestinationValue(), false);
  }, [setFullDestinationValue, setFullOriginValue, state]);

  const { data: searchResult } = useQuery({
    queryKey: ['search', { query: debounceFunction.trim(), ...api.params }],
    queryFn: api.fetcher,
    enabled: !!debounceFunction && debounceFunction.length >= inputCharsLengthToSearch,
    ...defaultQuery?.(debounceFunction.trim()),
  });

  const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    setActiveInputName(e.currentTarget.name as ActiveInputNameType);
  };

  useEffect(() => {
    // on open:
    if (!!activeInputName) {
      if (activeInputName === 'origin') {
        handleSetDestinationValue(setFullDestinationValue(), false);
      } else {
        handleSetOriginValue(setFullOriginValue(), false);
      }
      setInputValue('');
    } else {
      handleSetOriginValue(setFullOriginValue(), false);
      handleSetDestinationValue(setFullDestinationValue(), false);
    }
  }, [activeInputName, setFullDestinationValue, setFullOriginValue]);

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const name = e.currentTarget.name;

    const valueIsEnglish = /^[A-Za-z0-9 ]*$/.test(value);
    valueIsEnglish && banEnglishInput
      ? name === 'origin'
        ? setOriginValue('')
        : setDestinationValue('')
      : name === 'origin'
        ? handleSetOriginValue(value, true)
        : handleSetDestinationValue(value, true);
  };

  useEffect(() => {
    shouldInputValueUpdate.current && setInputValue(originValue);
  }, [originValue]);

  useEffect(() => {
    shouldInputValueUpdate.current && setInputValue(destinationValue);
  }, [destinationValue]);

  const service = ServiceDetector();

  function swapInputs(
    currentPoint: Point,
    location: DesktopOriginDestinationLocationType<D>,
    oppositePoint: Point,
  ) {
    const newState = cloneDeep(state);
    newState[currentPoint] = location;
    newState[oppositePoint] = { id: '', title: '' };
    onSelect(newState);

    setTimeout(() => {
      if (currentPoint === 'origin') {
        destinationInputElement.current!.focus();
      } else {
        originInputElement.current!.focus();
      }

      isMouseOut.current = true;
    }, 10);
  }

  const handleLocationClickForInternational = (
    location: DesktopOriginDestinationLocationType<D>,
  ) => {
    if (!destinationInputElement.current || !originInputElement.current) {
      return;
    }

    const currentPoint = activeInputName as Point;
    const oppositePoint = currentPoint === 'origin' ? 'destination' : 'origin';
    const oppositeLocation = state[oppositePoint];
    const currentLocation = location;
    const currentTitle = currentLocation.title;
    const oppositeTitle = oppositeLocation.title;
    const currentId = currentLocation.id;
    const oppositeId = oppositeLocation.id;
    const oppositeCityTitle = (oppositeLocation.data as { cityTitle: string })?.cityTitle;
    const currentCityTitle = (currentLocation.data as { cityTitle: string })?.cityTitle;
    const isSameTitle =
      Boolean(currentTitle) && Boolean(oppositeTitle) && currentTitle === oppositeTitle;
    const isSameCityTitle =
      Boolean(currentCityTitle) &&
      Boolean(oppositeCityTitle) &&
      currentCityTitle === oppositeCityTitle;

    if (!isSameTitle && !isSameCityTitle) {
      if (currentId !== oppositeId) {
        const newState = cloneDeep(state);
        newState[currentPoint] = currentLocation;
        onSelect(newState);

        if (currentPoint === 'origin') {
          if (originOnly) {
            setActiveInputName(undefined);
          }

          setTimeout(() => {
            destinationInputElement?.current?.focus();
            isMouseOut.current = true;
          }, 10);
        } else {
          destinationInputElement?.current?.blur();
          setActiveInputName(undefined);
        }

        return;
      }
    }

    swapInputs(currentPoint, location, oppositePoint);
  };

  const handleLocationsListItemClick = (location: DesktopOriginDestinationLocationType<D>) => {
    if (service === 'international') {
      handleLocationClickForInternational(location);
      return;
    }

    const oppositInputName: keyof DesktopOriginDestinationStateType<D> =
      activeInputName === 'origin' ? 'destination' : 'origin';

    if (
      location.description && state[oppositInputName].description
        ? location.title !== state[oppositInputName].title
        : !!state?.['origin']?.title
    ) {
      if (location.id !== state[oppositInputName].id) {
        const newState = cloneDeep(state);
        newState[activeInputName as 'origin' | 'destination'] = {
          ...location,
          clicked: true,
        };
        onSelect(newState);

        if (activeInputName === 'origin') {
          if (originOnly) {
            setActiveInputName(undefined);
          }
          setTimeout(() => {
            destinationInputElement?.current?.focus();
          }, 10);
        } else {
          destinationInputElement?.current?.blur();
          setActiveInputName(undefined);
        }
      } else {
        const newState = cloneDeep(state);
        newState[activeInputName as 'origin' | 'destination'] = {
          ...location,
          clicked: true,
        };
        newState[oppositInputName] = {
          id: '',
          title: '',
          clicked: false,
        };
        onSelect(newState);
        setTimeout(() => {
          activeInputName === 'origin'
            ? destinationInputElement?.current?.focus()
            : originInputElement?.current?.focus();
          isMouseOut.current = true;
        }, 10);
      }
    } else {
      setActiveInputName(undefined);
      const newState = cloneDeep(state);
      newState[activeInputName as 'origin' | 'destination'] = {
        ...location,
        clicked: true,
      };
      newState[oppositInputName as 'origin' | 'destination'] = {
        id: '',
        title: '',
        clicked: false,
      };
      onSelect(newState);
      setTimeout(() => {
        activeInputName === 'origin'
          ? destinationInputElement?.current?.focus()
          : originInputElement?.current?.focus();
      }, 10);
    }
  };

  const handleSwapButtonClick = () => {
    const clone = cloneDeep(state);
    setActiveInputName(undefined);
    onSelect({
      origin: clone.destination,
      destination: clone.origin,
    });
  };

  function handleInputClick(e: React.MouseEvent<HTMLInputElement>) {
    if (service === 'international') {
      e.currentTarget.select();
    }
  }

  return (
    <div className={style['main']}>
      <div
        className={cn(
          style['input-box'],
          originOnly ? style['origin-box--origin-only'] : style['origin-box'],
        )}
      >
        <PlaceIcon
          className={cn(style['icon'], activeInputName === 'origin' ? style['pulse-fx'] : '')}
        />
        <input
          onClick={handleInputClick}
          name="origin"
          value={originValue}
          onFocus={handleInputFocus}
          onInput={handleInput}
          placeholder={originPlaceHolder}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={originInputElement}
          autoComplete="off"
          className={
            showDescription && state?.origin?.id && originValue === state.origin.title
              ? style['input-box__input-with-des']
              : ''
          }
        />
        {/* refactor: rename "showDescription" */}
        {showDescription && state?.origin?.id && originValue === state.origin.title && (
          <div className={style['input-box__description']}>
            <small>{state?.origin?.type?.title}</small>
          </div>
        )}
      </div>
      {!originOnly && (
        <div className={style['swap-button']} onClick={handleSwapButtonClick}>
          <SwapIcon />
        </div>
      )}
      {!originOnly && (
        <div className={cn(style['input-box'], style['destination-box'])}>
          {/* <PlaceIcon className={style['icon']} /> */}
          <PlaceIcon
            className={cn(
              style['icon'],
              activeInputName === 'destination' ? style['pulse-fx'] : '',
            )}
          />
          <input
            onClick={handleInputClick}
            name="destination"
            value={destinationValue}
            onFocus={handleInputFocus}
            onInput={handleInput}
            placeholder="مقصد"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={destinationInputElement}
            autoComplete="off"
            className={
              showDescription &&
              state?.destination?.id &&
              destinationValue === state.destination.title
                ? style['input-box__input-with-des']
                : ''
            }
          />

          {showDescription &&
            state?.destination?.id &&
            destinationValue === state.destination.title && (
              <div className={style['input-box__destination-description']}>
                <small>{state?.destination?.type?.title}</small>
              </div>
            )}
        </div>
      )}

      {!!activeInputName && (
        <div
          className={cn(style['locations-list'], style[activeInputName ? activeInputName : ''])}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <LocationsList
            activeInputName={activeInputName}
            originValue={originValue}
            destinationValue={destinationValue}
            inputValue={inputValue}
            data={api.dataMapper(searchResult)}
            defaultData={{ title: defaultData.title, value: defaultData.value }}
            onSelect={(e) => {
              handleLocationsListItemClick(e);
            }}
            history={history ? history[activeInputName] : []}
            onClearHistory={() => {
              onClearHistory?.(
                activeInputName === 'origin' ? LocationType.ORIGIN : LocationType.DESTINATION,
              );
            }}
            inputCharsLengthToSearch={inputCharsLengthToSearch}
          />
        </div>
      )}
    </div>
  );
};

export default DesktopOriginDestination;
