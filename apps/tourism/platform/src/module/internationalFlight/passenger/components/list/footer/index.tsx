import { useRouter } from 'next/router';

import Button from 'components/button';
import useSetPassengers from 'module/internationalFlight/passenger/hooks/useSetPassengers';
import { checkValidity } from 'module/internationalFlight/passenger/utilities/checkPassengerNumbersValidity';
import { setPassengerMapper } from 'module/internationalFlight/passenger/utilities/helper';
import { TPassengerV2 } from 'services/general/passenger/interface';
import {
  TInternationalPassengerPayload,
  TSetPassengersPayload,
} from 'services/internationalFlight/addPassenger/interface';
import { notify } from 'utils/notification';
import GetOrderResponseV2 from 'module/internationalFlight/checkout/types/GetOrderResponseV2';

import styles from './footer.module.scss';

type TFooterProps = {
  selectedPassengers: Array<TPassengerV2>;
  orderData: GetOrderResponseV2 | undefined;
  passengers: Array<TPassengerV2>;
};

const Footer = ({ selectedPassengers, orderData, passengers }: TFooterProps) => {
  const { isLoading, setInternationalFlightPassengers } = useSetPassengers();
  const router = useRouter();
  const { id } = router.query;
  const handleClick = () => {
    try {
      checkValidity(
        orderData,
        passengers.filter((ad) => selectedPassengers.some((fd) => fd.id === ad.id)),
      );
    } catch (error) {
      notify({
        message: <span className="text-weight-500 fa">{error as string}</span>,
        type: 'warning',
        config: { position: 'bottom-center' },
      });
      return;
    }
    const payload: TSetPassengersPayload = {
      orderId: id?.toString(),
      passengers: passengers
        .filter((ad) => selectedPassengers.some((fd) => fd.id === ad.id))
        .map((item): TInternationalPassengerPayload => {
          return setPassengerMapper(item);
        }),
    };
    setInternationalFlightPassengers(payload);
  };

  return (
    <>
      <div className={styles.footer}>
        <Button
          radius
          btnType="submit"
          className="btn btn-primary d-block px-5"
          onClick={handleClick}
          loading={isLoading}
        >
          تایید و ادامه
        </Button>
        <button
          className="btn btn-outline-secondary d-block px-5 rounded ms-3"
          onClick={() => {
            router.back();
          }}
        >
          بازگشت
        </button>
      </div>
    </>
  );
};

export default Footer;
