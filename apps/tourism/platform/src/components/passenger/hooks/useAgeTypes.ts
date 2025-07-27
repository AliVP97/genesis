import { useMemo } from 'react';
import { AddPassengerResponse } from 'services/passenger/interface';
import { PassengerModel } from './usePassenger';
type useAgeTypesProps = {
  cachedPassengersData?: { passengers: AddPassengerResponse[] };
  selectedPassengers?: PassengerModel[];
  disabledPassengers?: string[];
};
const useAgeTypes = (props: useAgeTypesProps) => {
  const { cachedPassengersData, selectedPassengers, disabledPassengers } = props;

  const selectedPassengersAgeType = useMemo(() => {
    let adult = 0;
    let child = 0;
    let infant = 0;
    let text = '';
    const passengersHash: Record<string, string> = {};
    cachedPassengersData?.passengers.forEach((item) => {
      passengersHash[item.id as string] = item.ageType as string;
    });
    const selected = selectedPassengers?.filter((item) => {
      return !disabledPassengers?.includes(item?.id as string);
    });
    if (selected && cachedPassengersData) {
      for (const item of selected) {
        let skip = false;
        for (const passenger of cachedPassengersData.passengers) {
          if (passenger?.fields && passenger?.id === item?.id) {
            for (const field of passenger?.fields) {
              if (!field.isOptional && !field?.value) {
                skip = true;
              }
            }
            break;
          }
        }

        if (skip) {
          continue;
        }
        const ageType = passengersHash[item?.id as string];
        if (ageType === 'AGE_TYPE_ADULT') {
          adult++;
        } else if (ageType === 'AGE_TYPE_CHILD') {
          child++;
        } else if (ageType === 'AGE_TYPE_INFANT') {
          infant++;
        }
      }
    }
    if (adult > 0) {
      text += `${adult} بزرگسال`;
    }
    if (child) {
      if (text) {
        text += ` ، ${child} کودک`;
      } else {
        text += `${child} کودک`;
      }
    }
    if (infant) {
      if (text) {
        text += ` ، ${infant} نوزاد`;
      } else {
        text += `${infant} نوزاد`;
      }
    }

    return {
      text: text,
      passengerType: {
        adult,
        child,
        infant,
      },
    };
  }, [cachedPassengersData, selectedPassengers]);
  return selectedPassengersAgeType;
};

export default useAgeTypes;
