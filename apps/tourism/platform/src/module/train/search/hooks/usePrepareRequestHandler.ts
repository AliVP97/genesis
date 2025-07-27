import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import jmoment from 'moment-jalaali';

import { getTrainTicketList } from 'services/train/tickets';
import { TrainTicketRequest } from 'services/train/tickets/interface';
import { trainUpdateLastSearchStorage } from 'utils/helpers/localstorageHelper';
import { queryToState } from 'module/train/utils';
import { trainSearchUrlSchema } from '../utils';

export const usePrepareRequestHandler = (isLoginCall: boolean) => {
  const { query } = useRouter();

  const {
    mutate: mutateGetTicketList,
    data: ticketsData,
    isLoading: getTicketsLoading,
    error: getTrainListError,
    isIdle: isIdleGetTicketList,
  } = useMutation({
    mutationFn: (payload: TrainTicketRequest) => {
      return getTrainTicketList(payload);
    },
  });

  const prepareRequestHandler = async () => {
    const safeQuery = trainSearchUrlSchema.parse(query);

    const {
      origin,
      destination,
      departureDate,
      returningDate,
      adult,
      child,
      infant,
      wantCompartment,
      compartmentGenderType,
    } = await queryToState(safeQuery);

    const passengerCount = {
      adult,
      child,
      infant,
    };

    const toDate = (date?: string) =>
      date
        ? new Date(jmoment(date, 'jYYYY-jMM-jDD').format('YYYY-MM-DD')).getTime() / 1000 + ''
        : undefined;

    const payload = {
      queries: [
        {
          originCode: origin?.code,
          destinationCode: destination?.code,
          passengerCount,
          departureDate: toDate(departureDate),
          wantCompartment,
          compartmentGenderType,
        },
      ],
    };
    if (safeQuery.returningDate) {
      // reverse order of origin & destination for return
      payload.queries.push({
        originCode: destination?.code,
        destinationCode: origin?.code,
        passengerCount,
        departureDate: toDate(returningDate),
        wantCompartment,
        compartmentGenderType,
      });
    }

    if (isLoginCall) {
      mutateGetTicketList(payload);
      if (origin && destination) {
        trainUpdateLastSearchStorage({
          origin,
          destination,
          passenger: passengerCount,
          departureDate: jmoment(safeQuery.departureDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD'),
          returningDate: safeQuery.returningDate
            ? jmoment(safeQuery.returningDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD')
            : undefined,
          wantCompartment,
          genderCompartment: compartmentGenderType,
          calendarSystem: 'JALALI',
        });
      }
    }
  };
  return {
    isIdleGetTicketList,
    prepareRequestHandler,
    ticketsData,
    getTicketsLoading,
    getTrainListError,
  };
};
