import { AddPassenger, UserIcon } from 'assets/icons';

import React, { Dispatch, SetStateAction } from 'react';

import { IPassenger } from 'services/general/passenger/interface';

import styles from './emptyPassengersAddForm.module.scss';
import Divider from 'components/divider';
import cn from 'classnames';
import EmptyAddForm from '../emptyAddForm';
import { addDomesticFlightPassengerMapper } from 'module/flights/passengers/utilities/helper';

import Button from 'components/button';
import { useRouter } from 'next/router';
import { IPassengersType } from 'module/flights/passengers/list/interface';
import { PassengerTypeConvertor } from 'module/flights/passengers/list/helper';
import { useIsNajafBaghdad } from 'utils/hooks/useIsNajafBaghdad';

type TEmptyPassengersAddFormProps = {
  getPassengers: () => void;
  isLoading: boolean;
  isLogin: boolean;
  passengers: Array<IPassenger>;
  setPassengers: Dispatch<SetStateAction<IPassenger[]>>;
  total: Array<IPassengersType>;
  setTotal: Dispatch<SetStateAction<IPassengersType[]>>;
};

const EmptyPassengersAddForm = ({
  setPassengers,
  total,
  setTotal,
}: TEmptyPassengersAddFormProps) => {
  const isPassport = useIsNajafBaghdad();
  const onSubmit = (data: Record<string, string | number | undefined>) => {
    setPassengers((prev) => [...prev, addDomesticFlightPassengerMapper(data, !!isPassport)]);
  };

  const { back } = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [elRefs, setElRefs] = React.useState<Array<React.RefObject<HTMLFormElement>>>([]);

  React.useEffect(() => {
    for (let i = 0; i < (total?.length || 0); i++) {
      setElRefs((prev) => [...prev, React.createRef<HTMLFormElement>()]);
    }
  }, [total]);

  const handelClick = () => {
    setPassengers([]);
    formRef.current?.requestSubmit();
    elRefs.forEach((item) => item.current?.requestSubmit());
  };

  return (
    <>
      <div className={cn(styles['add-multi-passengers'])}>
        <div className="d-flex justify-content-end p-2 px-4">
          <span>انتخاب مسافران</span>
          <UserIcon />
        </div>
        <Divider type="horizontal" />
        <div className="text-end rtl p-3 px-4">
          هیچ مسافری در لیست مسافران وجود ندارد. لطفا اطلاعات مسافران جدید را وارد کنید.
        </div>
        <div className="px-4">
          {React.Children.toArray(
            total?.map((item, index) => (
              <div key={item.id} className="rtl my-3 border-bottom">
                <div className="color-grey-1 mb-3 d-flex justify-content-between align-items-center">
                  <div>
                    <AddPassenger />
                    <span className="pe-2">{PassengerTypeConvertor[item.type]}</span>
                  </div>
                  <span
                    className={cn(styles['add-multi-passengers__remove'])}
                    onClick={() => setTotal(total?.filter((x) => x !== item))}
                  >
                    &#x2715;
                  </span>
                </div>
                <EmptyAddForm
                  ref={elRefs[index]}
                  index={index}
                  isLoading={false}
                  onSubmit={onSubmit}
                />
              </div>
            )),
          )}
        </div>
        <div
          onClick={() =>
            setTotal((prev) => [
              ...prev,
              {
                number: 1,
                type: 'new',
                id: Date.now().toString(36),
              },
            ])
          }
          className={cn(styles['add-multi-passengers__add-new'], 'text-center p-2')}
        >
          <small className="py-2 px-5 color-primary">افزودن مسافر جدید &#43; </small>
        </div>
      </div>
      <div className={cn(styles['add-multi-passengers'], 'mt-3 px-3 align-items-center pt-3')}>
        <Button
          radius
          className="btn btn-primary me-2 px-5 "
          btnType="button"
          onClick={handelClick}
        >
          تایید و ادامه
        </Button>

        <Button radius className={cn('px-5 color-black')} btnType="button" onClick={back}>
          بازگشت
        </Button>
      </div>
    </>
  );
};

export default EmptyPassengersAddForm;
