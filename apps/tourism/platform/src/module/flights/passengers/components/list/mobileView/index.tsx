import React, { ChangeEvent, useEffect, useState } from 'react';

import { CircleAddPassengerIcon } from 'assets/icons';
import Button from 'components/button';
import UseCheckout from 'module/flights/passengers/hooks/useCheckout';
import { TicketType } from 'module/flights/tickets/interface';
import { TPassengerV2 } from 'services/general/passenger/interface';
import { domesticFlightTicketPassengerValidate } from 'utils/helpers/validations';
import { notify } from 'utils/notification';
import useFlightCreateOrder from 'module/flights/search/hooks/useFlightCreateOrder';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { useRouteChange } from 'utils/hooks/useRouteChange';
import AddBtn from './addBtn';
import PassengerItem from './item';
import PassengersSearchBox from './serachBox';

type TPassengerListProps = {
  passengers: Array<TPassengerV2>;
  selectedPassengers: Array<TPassengerV2>;
  getPassengers: () => void;
  setPassenger: (e: TPassengerV2) => void;
};
const PassengerList = ({
  passengers,
  selectedPassengers,
  getPassengers,
  setPassenger,
}: TPassengerListProps) => {
  const [filter, setFilter] = useState<string>('');
  const isSuperApp = useIsSuperApp();
  const { mutateGetCheckout } = UseCheckout();
  const tickets = JSON.parse(localStorage.getItem('selected_ticket') as string) as TicketType[];
  const { createOrderMutate, isSuccess, createOrderData } = useFlightCreateOrder();

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('reserve_expiry', JSON.stringify(createOrderData?.expireDate));
      localStorage.setItem('order_id', createOrderData?.orderId || '');
    }
  }, [isSuccess]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();
  useEffect(() => {
    if (routeChangeCompleted && searchButtonClicked) {
      setSearchButtonClicked(false);
    }
  }, [routeChangeCompleted]);
  const createOrder = () => {
    createOrderMutate({
      flightIds: tickets.map((ticket) => ticket.flightID || ''),
      flightSource: tickets?.map((ticket) => ticket?.flightSource || 'FLIGHT_SOURCE_UNDEFINED'),
    });
  };

  const handleClick = async () => {
    try {
      domesticFlightTicketPassengerValidate(selectedPassengers, tickets);

      if (createOrderData?.orderId) {
        mutateGetCheckout({
          orderId: createOrderData?.orderId,
          passengerIds: selectedPassengers.map((el) => el.id) as string[],
        });
      }
    } catch (error) {
      notify({
        message: <span className="text-weight-500 fa">{(error as Error)?.message}</span>,
        type: 'warning',
        config: { position: 'bottom-center' },
      });
      return;
    } finally {
      setSearchButtonClicked(false);
    }
  };

  useEffect(() => {
    if (createOrderData) {
      handleClick().catch(() => {
        throw new Error('try it again');
      });
    }
  }, [createOrderData]);

  return (
    <>
      <div className="mt-2">
        <PassengersSearchBox
          title="جستجو"
          placeholder="جستجو..."
          value={filter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
        />
      </div>
      <div className="py-3">
        <AddBtn getPassengers={getPassengers}>
          افزودن مسافر جدید <CircleAddPassengerIcon />
        </AddBtn>
      </div>
      <div className="mb-5 pb-4">
        {React.Children.toArray(
          passengers
            .filter(
              (x) =>
                x.englishFamily?.includes(filter) ||
                x.englishName?.includes(filter) ||
                x.persianName?.includes(filter) ||
                x.persianFamily?.includes(filter),
            )
            .map((item) => (
              <>
                <PassengerItem
                  getPassengers={getPassengers}
                  passenger={item}
                  checked={!!selectedPassengers?.find((x) => x.id === item.id)}
                  setPassenger={setPassenger}
                />
              </>
            )),
        )}
      </div>

      <div
        style={{ bottom: isSuperApp ? '75px' : '0' }}
        className="position-fixed start-50 translate-middle-x w-100 px-3 pb-3 bg-color-white pt-3"
      >
        <Button
          radius
          className="btn btn-primary d-block w-100"
          btnType="button"
          onClick={() => {
            setSearchButtonClicked(true);
            createOrder();
          }}
          disabled={Object.keys(selectedPassengers)?.length == 0}
          loading={searchButtonClicked || routeChangeStarted}
        >
          {Object.keys(selectedPassengers)?.length == 0 ? (
            'تایید'
          ) : (
            <> تایید ({selectedPassengers?.length} مسافر)</>
          )}
        </Button>
      </div>
    </>
  );
};

export default PassengerList;
