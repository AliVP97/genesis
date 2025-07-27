import React, { ChangeEvent, useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import classNames from 'classnames';

import { CircleAddPassengerIcon } from 'assets/icons';
import Button from 'components/button';
import useSetPassengers from 'module/internationalFlight/passenger/hooks/useSetPassengers';
import {
  checkValidity,
  getPassengersNumbers,
} from 'module/internationalFlight/passenger/utilities/checkPassengerNumbersValidity';
import { setPassengerMapper } from 'module/internationalFlight/passenger/utilities/helper';
import { TPassengerV2 } from 'services/general/passenger/interface';
import {
  TInternationalPassengerPayload,
  TSetPassengersPayload,
} from 'services/internationalFlight/addPassenger/interface';
import { notify } from 'utils/notification';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { EmptyPassengerFlight } from 'assets/images';
import GetOrderResponseV2 from 'module/internationalFlight/checkout/types/GetOrderResponseV2';
import SelectedPassengerNumberWarning from '../selectedPassengerNumberWarning';
import AddBtn from './addBtn';
import PassengerItem from './item';
import PassengersSearchBox from './serachBox';

import styles from '../list.module.scss';

type TPassengerListProps = {
  passengers: Array<TPassengerV2>;
  selectedPassengers: Array<TPassengerV2>;
  getPassengers: () => void;
  setPassenger: (e: TPassengerV2) => void;
  orderData: GetOrderResponseV2 | undefined;
};

const PassengerList = ({
  passengers,
  selectedPassengers,
  getPassengers,
  setPassenger,
  orderData,
}: TPassengerListProps) => {
  const [filter, setFilter] = useState<string>('');
  const { adult, child, infant } = getPassengersNumbers(orderData);
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
  const isSuperApp = useIsSuperApp();
  const filtredPassengers = useMemo(() => {
    return passengers?.filter(
      (x) =>
        x.englishFamily?.toUpperCase().includes(filter) ||
        x.englishName?.toUpperCase().includes(filter) ||
        x.persianName?.toUpperCase().includes(filter) ||
        x.persianFamily?.toUpperCase().includes(filter),
    );
  }, [passengers, filter]);
  return (
    <>
      <SelectedPassengerNumberWarning adult={adult} child={child} infant={infant} />
      <div className="mt-2">
        <PassengersSearchBox
          title="جستجو"
          placeholder="جستجوی مسافران"
          value={filter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value?.toUpperCase())}
          onClear={() => setFilter('')}
        />
      </div>
      <div className="py-3">
        <AddBtn getPassengers={getPassengers}>
          افزودن مسافر جدید <CircleAddPassengerIcon />
        </AddBtn>
      </div>
      <div className={classNames('mb-5 ', styles['passengers-list-wrap'])}>
        {filtredPassengers.length ? (
          filtredPassengers?.map((item) => (
            <>
              <PassengerItem
                getPassengers={getPassengers}
                passenger={item}
                checked={!!selectedPassengers?.find((x) => x.id === item.id)}
                setPassenger={setPassenger}
              />
            </>
          ))
        ) : (
          <div className="d-flex flex-column gap-3 h-100 justify-content-center align-items-center mt-5">
            {' '}
            <EmptyPassengerFlight /> <div>!مسافری با اطلاعات وارد شده یافت نشد </div>
          </div>
        )}
      </div>

      <div
        className={classNames(
          'position-fixed start-50 translate-middle-x w-100 px-3 pb-3 bg-color-white pt-3',
        )}
        style={{ bottom: isSuperApp ? '75px' : '0' }}
      >
        <Button
          radius
          className="btn btn-primary d-block w-100"
          btnType="button"
          onClick={handleClick}
          loading={isLoading}
          disabled={!selectedPassengers?.length}
        >
          تایید {!!selectedPassengers?.length && `(${selectedPassengers?.length} مسافر)`}
        </Button>
      </div>
    </>
  );
};

export default PassengerList;
