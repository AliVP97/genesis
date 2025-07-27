import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useQueryClient } from 'react-query';

import PassengersList, { AddLeaderCallBack } from 'components/passenger/components/passengersList';
import { QUERIES, useAddPassengers, useOrder } from 'module/bus/hooks';
import SelectedTicket from 'module/bus/tickets/components/selectedTicket';
import { useResponsive } from 'utils/hooks/useResponsive';
import WEB from 'utils/routes/web';

const Passengers = () => {
  const { isDesktop } = useResponsive();
  const { query, push } = useRouter();
  const { data } = useOrder(query.id as string);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useAddPassengers(query.id as string, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERIES.getOrder(query.id as string));

      push({ pathname: `${WEB.BUS}checkout/${query.id}` }, undefined, {
        shallow: false,
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  const addLeaderCallback: AddLeaderCallBack = (passengerLeader, selectedPassengers) => {
    mutate({
      leaderUserId: passengerLeader.selectedLeader?.id,
      passengerIds: selectedPassengers.map(({ id }) => id) as string[],
    });
  };

  return (
    <>
      {isDesktop && <SelectedTicket />}
      <PassengersList
        maxSelectable={data?.seats?.length}
        isConfirmButton
        selectLeader
        serviceName={data?.busInfo?.isInternational ? 'international-bus' : 'domestic-bus'}
        addLeaderCallBack={addLeaderCallback}
        addLeaderCallBackLoading={isLoading}
      />
    </>
  );
};

export default Passengers;
