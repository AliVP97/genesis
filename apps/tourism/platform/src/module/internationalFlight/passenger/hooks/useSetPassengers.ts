import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

import { TSetPassengersPayload } from 'services/internationalFlight/addPassenger/interface';
import { setPassengers } from 'services/internationalFlight/addPassenger';
import { notify } from 'utils/notification';
import { ParsedUrlQueryInput } from 'querystring';

const useSetPassengers = () => {
  const router = useRouter();
  const { mutate: setInternationalFlightPassengers, isLoading: isLoading } = useMutation({
    mutationFn: (payload: TSetPassengersPayload) => {
      return setPassengers(payload);
    },
    onSuccess: (_, values) => {
      const pathname = '/international/checkout/' + values.orderId;
      const query: ParsedUrlQueryInput = { requestId: router.query.requestId };
      router.push({ pathname, query });
    },
    onError: (error: { response: { data: { message: string } } }) => {
      notify({
        message: error?.response?.data?.message,
        type: 'warning',
        config: { position: 'bottom-center' },
      });
    },
  });

  return { setInternationalFlightPassengers, isLoading };
};

export default useSetPassengers;
