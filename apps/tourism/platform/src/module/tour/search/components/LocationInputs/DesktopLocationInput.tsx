import Style from './style.module.scss';
import cn from 'classnames';
import { PlaceIcon } from 'assets/icons';
import { FocusEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { ActiveInputNameType } from 'components/desktopOriginDestination/types';
import { useLocationInputs } from './useLocationInputs';
import { mapToLocationStateDestination, mapToLocationStateOrigin } from '../../utils';
import { useLocationSearch } from 'services/tour/v2';
import {
  IDefaultData,
  IDestination,
  IElementCity,
  ILocationResults,
  IOrigin,
  TLocationType,
} from '../../types';
import DesktopSuggestion from './DesktopSuggestion';
import { useRouter } from 'next/router';

interface Props {
  tourType: string;
  onSubmit: (state: TLocationType) => void;
}
const DesktopLocationInput = ({ tourType, onSubmit }: Props) => {
  const { query } = useRouter();
  const originInputElement = useRef<HTMLInputElement>(null);
  const destinationInputElement = useRef<HTMLInputElement>(null);
  const [activeInputName, setActiveInputName] = useState<ActiveInputNameType>();
  const [originValue, setOriginValue] = useState('');
  const [destinationValue, setDestinationValue] = useState('');
  const { defaultDataDestination, defaultDataOrigin } = useLocationInputs({
    tourType,
  });

  const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    setActiveInputName(e.currentTarget.name as ActiveInputNameType);
  };

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const name = e.currentTarget.name;
    onSubmit({ [name]: { value: '', city: '' } });
    if (name === 'origin') {
      setOriginValue(value);
    } else {
      setDestinationValue(value);
    }
  };
  const { data: originResults } = useLocationSearch(tourType, 'ORIGIN', originValue);
  const { data: destinationResults } = useLocationSearch(tourType, 'DESTINATION', destinationValue);
  const { id, originName, destinationName } = query;
  useEffect(() => {
    if (typeof id === 'string') {
      const hasSeparator = id.includes('-');

      if (!hasSeparator) {
        const destination = id;

        if (defaultDataDestination.value) {
          const destinationCity = defaultDataDestination.value.find(
            (city) =>
              city?.description && city?.description.toLowerCase() === destination.toLowerCase(),
          );
          if (destinationCity) {
            const safeDestinationCity = {
              title: destinationCity?.title ?? '',
              subTitle: destinationCity?.subTitle ?? '',
              description: destinationCity?.description ?? '',
            };
            onSubmit(mapToLocationStateDestination(safeDestinationCity) as IDestination);
            setDestinationValue(destinationCity?.title as string);
          } else {
            const mappedDestinationCity = {
              title: destination ?? '',
              subTitle: destination ?? '',
              description: destination ?? '',
            };
            setDestinationValue(destinationName as string);
            onSubmit(mapToLocationStateDestination(mappedDestinationCity) as IDestination);
          }
        }
      } else {
        const [origin, destination] = id.split('-');

        if (defaultDataOrigin.value) {
          const originCity = defaultDataOrigin.value.find(
            (city) =>
              city?.description && city?.description.toLowerCase() === origin?.toLowerCase(),
          );
          if (originCity) {
            const safeOriginCity = {
              subTitle: originCity?.subTitle ?? '',
              title: originCity?.title ?? '',
              description: originCity?.description ?? '',
            };
            onSubmit(mapToLocationStateOrigin(safeOriginCity) as IOrigin);
            setOriginValue(originCity?.title as string);
          } else {
            setOriginValue(originName as string);
          }
        }

        if (defaultDataDestination.value) {
          const destinationCity = defaultDataDestination.value.find(
            (city) =>
              city?.description && city?.description.toLowerCase() === destination?.toLowerCase(),
          );
          if (destinationCity) {
            const safeDestinationCity = {
              title: destinationCity?.title ?? '',
              subTitle: destinationCity?.subTitle ?? '',
              description: destinationCity?.description ?? '',
            };
            onSubmit(mapToLocationStateDestination(safeDestinationCity) as IDestination);
            setDestinationValue(destinationCity?.title as string);
          } else {
            const mappedDestinationCity = {
              title: destination ?? '',
              subTitle: destination ?? '',
              description: destination ?? '',
            };
            onSubmit(mapToLocationStateDestination(mappedDestinationCity) as IDestination);
            setDestinationValue(destinationName as string);
          }
        }
      }
    }
  }, [defaultDataDestination, defaultDataOrigin, destinationName]);

  const isMouseOut = useRef(true);

  useEffect(() => {
    if (!id) {
      setDestinationValue('');
      setOriginValue('');
    }
  }, [id]);
  const handleOnSelectFrequency = (data: IElementCity, type: string) => {
    if (type === 'origin') {
      setOriginValue(data?.title);
      onSubmit(mapToLocationStateOrigin(data) as IOrigin);
    } else if (type === 'destination') {
      setDestinationValue(data?.title);
      onSubmit(mapToLocationStateDestination(data) as IDestination);
      setActiveInputName(undefined);
    }
    setTimeout(() => {
      if (type === 'origin') {
        destinationInputElement?.current?.focus();
        isMouseOut.current = true;
      }
    }, 10);
  };

  useEffect(() => {
    if (query.type != tourType) {
      setOriginValue('');
      setDestinationValue('');
      onSubmit(
        mapToLocationStateDestination({
          title: '',
          subTitle: '',
          description: '',
        }) as IDestination,
      );
    }
  }, [tourType]);

  let mappedOriginResults;
  if (originResults?.origin === undefined) {
    mappedOriginResults = defaultDataOrigin?.value;
  } else if (originResults?.origin.length === 0) {
    mappedOriginResults = 'empty list';
  } else {
    mappedOriginResults = originResults?.origin?.map((item) => ({
      title: item.persianName,
      subTitle: item.isoCode,
      description: item.englishName,
    }));
  }

  let mappedDestinationResults;
  if (destinationResults?.destination === undefined) {
    mappedDestinationResults = defaultDataDestination?.value;
  } else if (destinationResults?.destination.length === 0) {
    mappedDestinationResults = 'empty list';
  } else {
    mappedDestinationResults = destinationResults.destination.map((item) => ({
      title: item.persianName,
      subTitle: item.isoCode,
      description: item.englishName,
    }));
  }

  const handleMouseEnter = () => {
    isMouseOut.current = false;
  };
  const handleMouseLeave = () => {
    isMouseOut.current = true;
  };
  const handleDocumentClick = () => {
    if (isMouseOut.current) {
      setActiveInputName(undefined);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);
  return (
    <div className={Style.main}>
      <div className={cn(Style['input-box'], Style['origin-box'])}>
        <PlaceIcon
          className={cn(Style.icon, activeInputName === 'origin' ? Style['pulse-fx'] : '')}
        />
        <input
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          name="origin"
          value={originValue}
          onFocus={handleInputFocus}
          onInput={handleInput}
          placeholder={'مبدا'}
          ref={originInputElement}
          autoComplete="off"
        />
        <DesktopSuggestion
          zone={'origin'}
          activeInputName={activeInputName}
          mappedResults={mappedOriginResults as IElementCity[] | 'empty list'}
          defaultData={defaultDataOrigin as IDefaultData}
          handleOnSelectFrequency={handleOnSelectFrequency}
          results={originResults as ILocationResults}
        />
      </div>
      <div className={cn(Style['input-box'], Style['destination-box'])}>
        <PlaceIcon
          className={cn(Style.icon, activeInputName === 'destination' ? Style['pulse-fx'] : '')}
        />
        <input
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          name="destination"
          value={destinationValue}
          onFocus={handleInputFocus}
          onInput={handleInput}
          placeholder="مقصد"
          ref={destinationInputElement}
          autoComplete="off"
        />
        <DesktopSuggestion
          zone={'destination'}
          activeInputName={activeInputName}
          mappedResults={mappedDestinationResults as IElementCity[] | 'empty list'}
          defaultData={defaultDataDestination as IDefaultData}
          handleOnSelectFrequency={handleOnSelectFrequency}
          results={destinationResults as ILocationResults}
        />
      </div>
    </div>
  );
};

export default DesktopLocationInput;
