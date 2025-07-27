import { useMutation } from 'react-query';
import { getTicketDetail } from 'services/internationalFlight/detail';
import { TTicketDetailPayload } from 'services/internationalFlight/detail/interface';

export const useGetTicketDetail = () => {
  const {
    data: ticketDetailData,
    mutate: ticketDetailMutate,
    isLoading: isTicketDetailLoading,
    isError: isTicketDetailError,
  } = useMutation({
    mutationFn: async (payload: TTicketDetailPayload) => {
      return getTicketDetail(payload);
    },
    mutationKey: 'ticketDetailMutate',
  });
  return {
    ticketDetailData,
    isTicketDetailLoading,
    isTicketDetailError,
    ticketDetailMutate,
  };
};
