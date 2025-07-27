import { useEffect } from 'react';

import Router from 'next/router';

import Button from 'components/button';
import UseCheckout from 'module/flights/passengers/hooks/useCheckout';
import useFlightCreateOrder from 'module/flights/search/hooks/useFlightCreateOrder';
import { TicketType } from 'module/flights/tickets/interface';
import { TPassengerV2 } from 'services/general/passenger/interface';
import { domesticFlightTicketPassengerValidate } from 'utils/helpers/validations';
import { notify } from 'utils/notification';

import styles from './footer.module.scss';

type TFooterProps = {
  selectedPassengers: Array<TPassengerV2>;
};

const Footer = ({ selectedPassengers }: TFooterProps) => {
  const { mutateGetCheckout } = UseCheckout();

  const { createOrderMutate, isSuccess, createOrderData, isLoading } = useFlightCreateOrder();

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('reserve_expiry', JSON.stringify(createOrderData?.expireDate));
      localStorage.setItem('order_id', createOrderData?.orderId || '');
    }
  }, [isSuccess]);

  const tickets = JSON.parse(localStorage.getItem('selected_ticket') as string) as TicketType[];

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
        message: (
          <>
            <span className={`${styles.notify} text-weight-500 fa`}>
              {(error as Error)?.message}
            </span>{' '}
          </>
        ),
        type: 'warning',
        config: { position: 'bottom-center' },
      });
      return;
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
      <div className={styles.footer}>
        <Button
          radius
          btnType="submit"
          className="btn btn-primary d-block px-5"
          onClick={createOrder}
          disabled={Object.keys(selectedPassengers)?.length == 0}
          loading={isLoading}
        >
          تایید و ادامه
        </Button>
        <button
          className="btn btn-outline-secondary d-block px-5 rounded ms-3"
          onClick={() => Router.back()}
        >
          بازگشت
        </button>
      </div>
    </>
  );
};

export default Footer;
