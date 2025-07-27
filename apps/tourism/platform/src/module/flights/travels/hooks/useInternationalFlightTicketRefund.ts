import { useMutation } from 'react-query';
import { notify } from 'utils/notification';
import { refund } from 'services/internationalFlight/order';

const useInternationalFlightTicketRefund = () =>
  useMutation({
    mutationFn: (payload: { orderId: string }) => {
      return refund(payload);
    },
    onError: (err) => {
      notify({
        type: 'error',
        message: (err as Error).message,
      });
    },
  });

export default useInternationalFlightTicketRefund;
