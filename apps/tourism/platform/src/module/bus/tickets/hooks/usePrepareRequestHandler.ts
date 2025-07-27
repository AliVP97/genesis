import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import jmoment from 'moment-jalaali';

import { prepareBus } from 'services/bus/order';
import { BusPrepareRequest } from 'services/bus/order/interface';
import { queryToLocation } from 'module/bus/search/utils';
import { TQueryObject } from 'module/bus/search/types';
import { useAppDispatch } from 'store/hook/storeHook';
import { notFoundRedirectUrlChanged } from 'store/slices/app/app';
import URLS from 'utils/routes/web';

export const usePrepareRequestHandler = (isLoginCall: boolean) => {
  const { query, replace } = useRouter();
  const dispatch = useAppDispatch();

  const {
    mutate: mutatePreparBus,
    data: requestIdData,
    isLoading: loadingPrepare,
  } = useMutation({
    mutationFn: async (payload: BusPrepareRequest) => {
      return prepareBus(payload);
    },
  });

  const prepareRequestHandler = async () => {
    try {
      const { origin, destination } = await queryToLocation(query as TQueryObject);

      const payload = {
        queries: {
          originStationCode: origin.stationCode,
          destinationStationCode: destination.stationCode,
          departureDate:
            new Date(
              jmoment(query.departureDate as string, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'),
            ).getTime() /
              1000 +
            '',
        },
      };
      if (isLoginCall) mutatePreparBus(payload.queries);
    } catch (error) {
      dispatch(notFoundRedirectUrlChanged(URLS.BUS));
      replace('/404');
    }
  };
  return {
    prepareRequestHandler,
    requestIdData,
    loadingPrepare,
  };
};
