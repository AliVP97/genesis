import { useMutation } from 'react-query';
import { prepareFlight } from 'services/domestic/flight';
import { GetSearchIDRequest } from 'services/domestic/flight/interface';
import { useRouter } from 'next/router';
import jmoment from 'moment-jalaali';

export const usePrepareRequestHandler = (isLoginCall: boolean) => {
  const { query } = useRouter();

  const {
    mutate: mutatePrepareFlight,
    data: requestIdData,
    isLoading: loadingPrepare,
  } = useMutation({
    mutationFn: async (payload: GetSearchIDRequest) => {
      return prepareFlight(payload);
    },
    mutationKey: 'getFlightIdRequest',
  });

  const prepareRequestHandler = (retry?: boolean) => {
    const id = (query?.id as string)?.split('-');

    const payload = {
      query: [
        {
          originIATA: id[0],
          destinationIATA: id[1],
          passenger: {
            adultCount: Number(query?.adult) ?? undefined,
            childCount: Number(query?.child) ?? undefined,
            infantCount: Number(query?.infant) ?? undefined,
          },
          departureDate: jmoment(query.departureDate as string, 'jYYYY-jMM-jDD').format(
            'YYYY-MM-DD',
          ),
        },
      ],
    };
    if (query.returningDate) {
      payload.query.push({
        originIATA: id[1],
        destinationIATA: id[0],
        passenger: {
          adultCount: Number(query?.adult) ?? undefined,
          childCount: Number(query?.child) ?? undefined,
          infantCount: Number(query?.infant) ?? undefined,
        },
        departureDate: jmoment(query.returningDate as string, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'),
      });
    }
    if (isLoginCall || retry) {
      mutatePrepareFlight(payload);
    }
  };
  return { prepareRequestHandler, requestIdData, loadingPrepare };
};
