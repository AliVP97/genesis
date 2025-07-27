import { useMemo } from 'react';

import { TrainTrips } from 'services/train/orders/interface';

export const PassengerTypes = ({ data }: { data: TrainTrips['tickets'] }) => {
  const passengerTypes = useMemo(() => {
    const mappedPassengerTypes = {
      TARIFF_ADULT: 0,
      TARIFF_ADULT_FOREIGN: 0,
      TARIFF_CHILD: 0,
      TARIFF_CHILD_FOREIGN: 0,
      TARIFF_INFANT: 0,
      TARIFF_INFANT_FOREIGN: 0,
      TARIFF_EMPTY: 0,
      TARIFF_UNSPECIFIED: 0,
    };

    data?.forEach(({ tariff }) => {
      if (tariff) {
        if (mappedPassengerTypes[tariff]) {
          mappedPassengerTypes[tariff]++;
        } else {
          mappedPassengerTypes[tariff] = 1;
        }
      }
    });

    return mappedPassengerTypes;
  }, [data]);

  return (
    <span>
      {[
        `${passengerTypes?.TARIFF_ADULT + passengerTypes?.TARIFF_ADULT_FOREIGN} بزرگسال`,
        (passengerTypes?.TARIFF_CHILD || passengerTypes?.TARIFF_CHILD_FOREIGN) &&
          `${passengerTypes?.TARIFF_CHILD + passengerTypes?.TARIFF_CHILD_FOREIGN} کودک`,
        (passengerTypes?.TARIFF_INFANT || passengerTypes?.TARIFF_INFANT_FOREIGN) &&
          `${passengerTypes?.TARIFF_INFANT + passengerTypes?.TARIFF_INFANT_FOREIGN} نوزاد`,
      ]
        .filter((x) => x)
        .join('، ')}
    </span>
  );
};
