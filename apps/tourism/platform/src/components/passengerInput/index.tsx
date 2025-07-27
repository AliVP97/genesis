import { PassengerIcon } from 'assets/icons';
import LocationInput from 'components/originDestination/locationInput';
import FlightPassengerCount from 'module/flights/passengers/passengerPicker';
import TrainPassengerCount from 'module/train/passengers/passengerPicker';
import { Passengers } from 'module/flights/tickets/ticket/searchTicket/interface';
import { Passengers as TTrainPassengers } from 'module/flights/tickets/ticket/searchTicket/interface';
import React, { FC, useEffect, useRef } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import styles from './passenger-input.module.scss';
import { InternationalFlightPassengerPicker } from 'module/internationalFlight/passengerPicker';
import { TCoupeType } from './types';
import HotelPassengerPicker from 'module/hotel/passengerPicker';
import { HotelPassengers } from 'module/hotel/ticketsSearchBox/interface';
import cn from 'classnames';
import { TourPassengerPicker } from 'module/tour';
import { TTourPassenger } from '../../module/tour/passengerPicker/types';

interface Props {
  passengers?: Passengers;
  setPassengers?: (
    passengers: (prevState: Passengers) => {
      adult: number;
      infant: number;
      child: number;
    },
  ) => void;
  trainPassenger?: TTrainPassengers;
  setTrainPassenger?: (passengers: (prevState: TTrainPassengers) => TTrainPassengers) => void;
  hotelPassengers?: Array<HotelPassengers>;
  tourPassengers?: TTourPassenger;
  setHotelPassengers?: React.Dispatch<React.SetStateAction<HotelPassengers[]>>;
  setTourPassengers?: React.Dispatch<React.SetStateAction<TTourPassenger>>;
  showPassenger: boolean;
  setShowPassenger: (value: boolean) => void;
  coupeType?: TCoupeType;
  setCoupeType?: React.Dispatch<React.SetStateAction<TCoupeType>>;
  defaultStyle?: boolean;
  // update passengers input value on submit only:
  updateOnSubmit?: boolean;
  onSubmit?: () => void;
  hotelInputValue?: Array<HotelPassengers>;
}

const PassengerInput: FC<Props> = ({
  passengers,
  setPassengers,
  trainPassenger,
  setTrainPassenger,
  showPassenger,
  setShowPassenger,
  hotelPassengers,
  setHotelPassengers,
  tourPassengers,
  setTourPassengers,
  coupeType,
  setCoupeType,
  defaultStyle,
  updateOnSubmit,
  onSubmit,
  hotelInputValue,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useDeviceDetect();
  const serviceName = ServiceDetector();

  const mapType: {
    [key in TCoupeType]: string;
  } = {
    COMPARTMENT_GENDER_FAMILY: 'مسافرین عادی',
    COMPARTMENT_GENDER_MEN_ONLY: 'ویژه برادران',
    COMPARTMENT_GENDER_WOMEN_ONLY: 'ویژه خواهران',
    COMPARTMENT_GENDER_UNDEFINED: 'مسافرین عادی',
    CABIN_TYPE_UNDEFINED: 'اکونومی',
    CABIN_TYPE_ECONOMY: 'اکونومی',
    CABIN_TYPE_PREMIUM: 'پرمیوم',
    CABIN_TYPE_BUSINESS: 'بیزینس ',
    CABIN_TYPE_FIRST: 'فرست',
  };

  const handlePassengerInput = (event: MouseEvent) => {
    if (!isMobile && divRef.current && !divRef.current.contains(event.target as Node)) {
      setShowPassenger(false);
    }
  };

  useEffect(() => {
    if (isMobile) return;
    document.addEventListener('mousedown', handlePassengerInput);
    return () => {
      document.removeEventListener('mousedown', handlePassengerInput);
    };
  }, []);

  const hotelTitleGenerator = () => {
    if (serviceName.split('/').includes('train')) {
      return trainPassenger!.adult + trainPassenger!.child + trainPassenger!.infant + 'مسافر';
    }
    if (serviceName.split('/').includes('hotel')) {
      const passengers = updateOnSubmit ? hotelInputValue : hotelPassengers;
      return `${
        passengers
          ? passengers.reduce(
              (acc, curr) => acc + curr.adult + curr.child.length,

              0,
            )
          : 0
      } مسافر ، ${passengers?.length} اتاق`;
    }

    if (serviceName.split('/').includes('tour') && tourPassengers) {
      return (
        `${tourPassengers?.adult} بزرگسال` +
        `${tourPassengers?.child ? ' , ' : ''}` +
        `${tourPassengers?.child ? +tourPassengers?.child + ' کودک ' : ''} `
      );
    }

    return passengers!.adult + passengers!.child + passengers!.infant + 'مسافر';
  };
  return (
    <div className={styles['passenger-input']}>
      <div onClick={() => setShowPassenger(true)}>
        <LocationInput
          name="passenger"
          icon={!defaultStyle && true}
          placeholder="مسافر"
          readOnly
          customIcon={<PassengerIcon />}
          maskClass={cn(
            defaultStyle ? 'd-flex align-items-center pe-3' : 'd-flex align-items-center',
          )}
          className={cn(styles['passenger-input__desktop--input'])}
        >
          <div className={cn(defaultStyle ? 'fs-2' : 'text-3 text-weight-bold')}>
            <span className="color-on-surface">
              {hotelTitleGenerator()}

              {serviceName === 'train' && coupeType && (
                <span className="d-md-none d-xl-inline">{` - ${mapType[coupeType]}`}</span>
              )}
              {serviceName === 'international' && coupeType && (
                <span className="d-md-none d-xl-inline">{` - ${mapType[coupeType]}`}</span>
              )}
            </span>
          </div>
        </LocationInput>
      </div>
      {isMobile ? (
        <BottomSheet
          className={styles['bottom-sheet']}
          onDismiss={() => setShowPassenger(false)}
          open={showPassenger}
          header={<span className="text-3">مسافران</span>}
          {...(serviceName === 'hotel' && {
            snapPoints: ({ maxHeight }) => maxHeight * 0.98,
          })}
        >
          {serviceName === 'flights' || serviceName === 'visa' || serviceName === 'visa/[name]' ? (
            <FlightPassengerCount
              passengers={passengers!}
              submitForm={() => setShowPassenger(false)}
              setPassengers={setPassengers!}
            />
          ) : serviceName === 'train' ? (
            <TrainPassengerCount
              passengers={trainPassenger!}
              submitForm={() => setShowPassenger(false)}
              setPassengers={setTrainPassenger!}
              setType={(type: string) => setCoupeType?.(type as TCoupeType)}
              type={coupeType!}
            />
          ) : serviceName === 'international' ? (
            <InternationalFlightPassengerPicker
              passengers={passengers!}
              submitForm={() => setShowPassenger(false)}
              setPassengers={setPassengers!}
              setType={(type: string) => setCoupeType?.(type as TCoupeType)}
              type={coupeType}
            />
          ) : serviceName === 'hotel' ? (
            <HotelPassengerPicker
              passengers={hotelPassengers!}
              setPassengers={setHotelPassengers!}
              onSubmit={() => {
                onSubmit?.();
                setShowPassenger(false);
              }}
            />
          ) : serviceName === 'tour' || serviceName === 'tour/[id]' ? (
            <TourPassengerPicker
              passengers={tourPassengers}
              setPassengers={setTourPassengers!}
              onSubmit={() => {
                setShowPassenger(false);
              }}
            />
          ) : (
            <></>
          )}
        </BottomSheet>
      ) : (
        showPassenger && (
          <div
            className={cn(
              defaultStyle
                ? styles['passenger-input__desktop-custom']
                : styles['passenger-input__desktop'],
            )}
            ref={divRef}
          >
            {serviceName === 'flights' ||
            serviceName === 'flights/[id]' ||
            serviceName === 'visa' ||
            serviceName === 'visa/[name]' ? (
              <FlightPassengerCount
                passengers={passengers!}
                submitForm={() => setShowPassenger(false)}
                setPassengers={setPassengers!}
              />
            ) : serviceName === 'train' || serviceName === 'train/[id]' ? (
              <TrainPassengerCount
                passengers={trainPassenger!}
                submitForm={() => setShowPassenger(false)}
                setPassengers={setTrainPassenger!}
                setType={(type: string) => setCoupeType?.(type as TCoupeType)}
                type={coupeType!}
              />
            ) : serviceName === 'international' || serviceName === 'international/[id]' ? (
              <InternationalFlightPassengerPicker
                passengers={passengers!}
                submitForm={() => setShowPassenger(false)}
                setPassengers={setPassengers!}
                setType={(type: string) => setCoupeType?.(type as TCoupeType)}
                type={coupeType}
              />
            ) : serviceName === 'hotel' ? (
              <HotelPassengerPicker
                passengers={hotelPassengers!}
                setPassengers={setHotelPassengers!}
                onSubmit={() => {
                  onSubmit?.();
                  setShowPassenger(false);
                }}
              />
            ) : serviceName === 'tour' ? (
              <TourPassengerPicker
                passengers={tourPassengers!}
                setPassengers={setTourPassengers!}
                onSubmit={() => {
                  setShowPassenger(false);
                }}
              />
            ) : (
              <></>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default PassengerInput;
