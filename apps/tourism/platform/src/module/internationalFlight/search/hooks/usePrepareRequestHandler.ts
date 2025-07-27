import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import jmoment from 'moment-jalaali';
import { getPrepareRequestId } from 'services/internationalFlight/flight';
import {
  TInternationalPrepareRequest,
  TInternationalTripMode,
} from 'services/internationalFlight/flight/interface';
import { useEffect, useState } from 'react';
import { CabinType } from 'services/internationalFlight/flight/interface';

export const usePrepareRequestHandler = (isLoginCall: boolean) => {
  const { query } = useRouter();
  const signalController = new AbortController();
  const [signal, setSignal] = useState<AbortSignal>(signalController.signal);
  const {
    mutate: mutatePrepareFlight,
    data: requestIdData,
    isLoading: loadingPrepare,
  } = useMutation({
    mutationFn: async (payload: TInternationalPrepareRequest) => {
      return getPrepareRequestId(payload, signal);
    },
    mutationKey: 'getFlightIdRequest',
  });

  useEffect(() => {
    return () => {
      signalController.abort();
      setSignal(signalController?.signal);
    };
  }, []);

  const prepareRequestHandler = () => {
    const id = (query?.id as string)?.split('-');
    const payload = {
      cabinCriteria: {
        cabinType: Object.values(CabinType).indexOf(query?.cabinType as unknown as CabinType),
      },
      origin: {
        code: id[0],
        type: Number(query.originType),
      },
      destination: {
        code: id[1],
        type: Number(query.destinationType),
      },
      passengerCriteria: {
        adult: Number(query?.adult) ?? undefined,
        child: Number(query?.child) ?? undefined,
        infant: Number(query?.infant) ?? undefined,
      },
      tripMode: Number(query?.tripMode) as TInternationalTripMode,
      departureDate: jmoment(query.departureDate as string, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'),
      returnDate: query.returningDate
        ? jmoment(query.returningDate as string, 'jYYYY-jMM-jDD').format('YYYY-MM-DD')
        : '',
    };

    if (isLoginCall) {
      mutatePrepareFlight(payload);
    }
  };
  return { prepareRequestHandler, requestIdData, loadingPrepare };
};
