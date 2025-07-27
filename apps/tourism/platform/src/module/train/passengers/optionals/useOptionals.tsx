import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { useRouteChange } from 'utils/hooks/useRouteChange';
import { SetPassengersOptionalService } from 'services/train/orders/interface';
import { useFreeOptionalServices, useOptionalServices } from 'module/train/hooks';
import { TrainOptionPayload } from 'services/train/servicesAndCatering/interface';

export type TUseOptionalsProps = {
  handleSubmitOptions: (optionList: SetPassengersOptionalService) => void;
  handleSubmitPassengers: () => Promise<boolean>;
  isOrderPassengerSuccess: boolean;
  shouldRenderOptions?: boolean[];
  shouldRenderFreeOptions?: boolean[];
};

const mapToOption = (data?: TrainOptionPayload['optionalServices']) =>
  data?.map(({ id, price, name }) => ({
    label: name,
    value: id,
    price,
  }));

export const useOptionals = ({
  handleSubmitOptions,
  handleSubmitPassengers,
  isOrderPassengerSuccess,
  shouldRenderOptions,
  shouldRenderFreeOptions,
}: TUseOptionalsProps) => {
  const [options, setOptions] = useState<SetPassengersOptionalService>();
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);

  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();

  const trainIds: [string | undefined, string | undefined] = [
    JSON.parse(sessionStorage.getItem('train_selected_ticket') as string)?.[0]?.trainId,
    JSON.parse(sessionStorage.getItem('train_selected_ticket') as string)?.[1]?.trainId,
  ];

  const { data: departureOptionalOptionList } = useOptionalServices(trainIds?.[0], {
    enabled: shouldRenderOptions?.[0],
  });

  const { data: returnOptionalOptionList } = useOptionalServices(trainIds?.[1], {
    enabled: shouldRenderOptions?.[1],
  });

  const { data: departureFreeOptionalOptionList } = useFreeOptionalServices(trainIds?.[0], {
    enabled: shouldRenderFreeOptions?.[0],
  });

  const { data: returnFreeOptionalOptionList } = useFreeOptionalServices(trainIds?.[1], {
    enabled: shouldRenderFreeOptions?.[1],
  });

  const handleDesktopPassengers = debounce((data: SetPassengersOptionalService) => {
    setOptions(data);
    setSearchButtonClicked(true);

    handleSubmitPassengers().then((isSuccess) => {
      !isSuccess && setSearchButtonClicked(false);
    });
  }, 200);

  useEffect(() => {
    if (isOrderPassengerSuccess && options) {
      handleSubmitOptions(options);
    }
  }, [isOrderPassengerSuccess]);

  useEffect(() => {
    routeChangeCompleted && searchButtonClicked && setSearchButtonClicked(false);
  }, [routeChangeCompleted]);

  return {
    handleDesktopPassengers,
    searchButtonClicked,
    routeChangeStarted,
    optionalOptionList: [
      mapToOption(departureOptionalOptionList),
      mapToOption(returnOptionalOptionList),
    ],
    freeOptionalOptionList: [
      mapToOption(departureFreeOptionalOptionList),
      mapToOption(returnFreeOptionalOptionList),
    ],
    trainIds,
  };
};
