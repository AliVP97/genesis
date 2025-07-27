import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { useDispatch } from 'react-redux';

import Button from 'components/button';
import Divider from 'components/divider';
import { useGetTicketOptions } from 'module/train/tickets/hooks/useGetTicketOptions';
import { TrainTicket } from 'module/train/tickets/interface';
import { TPassengerV2 } from 'services/general/passenger/interface';
import {
  addOrderPassenger,
  setPassengerOptionalService,
  createOrder as trainOrder,
} from 'services/train/orders';
import {
  AddOrderPassengerPayload,
  CreateOrderPayload,
  SetPassengersOptionalService,
} from 'services/train/orders/interface';
import { TrainOptionPayload } from 'services/train/servicesAndCatering/interface';
import { ErrorResponse } from 'services/train/tickets/TTicket';
import PassengerConvertor from 'utils/helpers/passengerConvertor';
import { trainTicketPassengerValidate } from 'utils/helpers/validations';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { notify } from 'utils/notification';
import WEB from 'utils/routes/web';
import { UserIcon } from 'assets/icons';
import { setTrainPassengersLength } from 'store/slices/ecommerce/ecomerceSlice';
import { useRouteChange } from '../../../../../utils/hooks/useRouteChange';
import PassengerOptionals from '../../optionals';
import AddForm from './addForm';
import Footer from './footer';
import PassengerList from './mobileView';
import PassengersSearchBox from './mobileView/serachBox';
import PassengerItem from './passengerItem';

import styles from './list.module.scss';

export type TOptionalsData = {
  optionalServices: TrainOptionPayload['optionalServices'] | undefined;
  freeOptionalServices: TrainOptionPayload['optionalServices'] | undefined;
}[];

type TPassengersListProps = {
  passengers: Array<TPassengerV2>;
  setSelected: Dispatch<SetStateAction<Array<TPassengerV2>> | []>;
  selectedPassengers: Array<TPassengerV2>;
  getPassengers: () => void;
  isLoading: boolean;
};

const PassengersList = ({
  passengers,
  setSelected,
  selectedPassengers,
  getPassengers,
}: TPassengersListProps) => {
  const setPassenger = (passenger: TPassengerV2) => {
    if (!selectedPassengers.some((x) => x.id === passenger.id))
      setSelected((prev) => [...prev, passenger]);
    else setSelected((prev) => prev.filter((x) => x.id !== passenger.id));
  };

  const passengersForOptionalServices = selectedPassengers.filter(
    ({ ageType }) => ageType !== 'AGE_TYPE_INFANT',
  );
  const allowSubmit = !!passengersForOptionalServices.length;

  const [showOptionalModal, setShowOptionalModal] = useState(false);
  const { isMobile } = useDeviceDetect();
  const [filter, setFilter] = useState<string>('');
  const { push } = useRouter();
  const [trainOrderId, setTrainOrderId] = useState<string>('');
  const dispatch = useDispatch();
  const filteredPassengers = useMemo(
    () =>
      passengers
        ?.sort(function (a, b) {
          return selectedPassengers.indexOf(b) - selectedPassengers.indexOf(a);
        })
        .filter(
          (x) =>
            x.englishFamily?.includes(filter) ||
            x.englishName?.includes(filter) ||
            x.persianName?.includes(filter) ||
            x.persianFamily?.includes(filter),
        ),
    [filter, passengers],
  );

  const trainIds: [string | undefined, string | undefined] = [
    JSON.parse(sessionStorage.getItem('train_selected_ticket') as string)?.[0]?.trainId,
    JSON.parse(sessionStorage.getItem('train_selected_ticket') as string)?.[1]?.trainId,
  ];

  const {
    optionalServices: departureOptionalServices,
    freeOptionalServices: departureFreeOptionalServices,
    isLoading: isLoadingDepartureOptionalServices,
  } = useGetTicketOptions(trainIds[0]);

  const {
    optionalServices: returnOptionalServices,
    freeOptionalServices: returnFreeOptionalServices,
    isLoading: isLoadingReturnOptionalServices,
  } = useGetTicketOptions(trainIds[1]);

  const isLoadingOptionalServices =
    isLoadingDepartureOptionalServices || isLoadingReturnOptionalServices;

  const optionalsData: TOptionalsData = [
    {
      optionalServices: departureOptionalServices,
      freeOptionalServices: departureFreeOptionalServices,
    },
    {
      optionalServices: returnOptionalServices,
      freeOptionalServices: returnFreeOptionalServices,
    },
  ];

  const shouldRenderOptions = useMemo(
    () =>
      optionalsData
        ? optionalsData?.map(({ optionalServices }) =>
            optionalServices ? optionalServices.length > 0 : false,
          )
        : [],
    [optionalsData],
  );

  const shouldRenderFreeOptions = useMemo(
    () =>
      optionalsData
        ? optionalsData?.map(({ freeOptionalServices }) =>
            freeOptionalServices ? freeOptionalServices.length > 0 : false,
          )
        : [],
    [optionalsData],
  );

  useEffect(() => {
    setSelected(
      selectedPassengers.filter((selected) =>
        passengers.find((passenger) => passenger.id === selected.id),
      ),
    );
  }, [passengers]);

  useEffect(() => {
    dispatch(setTrainPassengersLength({ data: selectedPassengers?.length }));
  }, [selectedPassengers?.length]);

  const submitOrderPassengers = async (trainOrderId: string) => {
    try {
      return await postOrderPassengerPromise(
        {
          payload: {
            passengerIds: selectedPassengers.map((el) => el.id as string),
          },
          orderId: trainOrderId,
        },
        {
          onSuccess: () => {
            if (isMobile) {
              setTimeout(() => {
                void push({ pathname: `${WEB.TRAIN}checkout/${trainOrderId}` }, undefined, {
                  shallow: false,
                });
              }, 3000);
            }
          },
          onError: (error) => {
            notify({
              type: 'error',
              message: (error as ErrorResponse)?.response?.data?.message,
            });
          },
        },
      );
    } catch (_) {
      //
    }
  };

  const {
    mutateAsync: postOrderPassengerPromise,
    isLoading: isOrderPassengerLoading,
    isSuccess: isOrderPassengerSuccess,
  } = useMutation({
    mutationFn: ({ payload, orderId }: { payload: AddOrderPassengerPayload; orderId: string }) => {
      return addOrderPassenger(payload, orderId);
    },
  });

  const { mutateAsync: setPassengerOptionalPromise, isLoading: isSetOptionalLoading } = useMutation(
    {
      mutationFn: ({
        payload,
        orderId,
      }: {
        payload: SetPassengersOptionalService;
        orderId: string;
      }) => {
        return setPassengerOptionalService(payload, orderId);
      },
    },
  );

  const [isWithin24Hours, setIsWithin24Hours] = useState(false);
  const selectedTickets = JSON.parse(
    sessionStorage.getItem('train_selected_ticket') as string,
  ) as TrainTicket[];

  useEffect(() => {
    const now = new Date();
    const departureDate = new Date(Number(selectedTickets[0]!.departureDate!) * 1000);
    const diff = Math.abs(Number(now) - Number(departureDate));
    const hoursDiff = Math.floor(diff / (1000 * 60 * 60));
    setIsWithin24Hours(hoursDiff < 24);
  }, [selectedTickets]);

  const handleSubmitServices = async (payload: SetPassengersOptionalService) => {
    try {
      if (!isWithin24Hours) {
        await setPassengerOptionalPromise(
          {
            payload,
            orderId: trainOrderId,
          },
          {
            onSuccess: () => {
              setTimeout(() => {
                void push({ pathname: `${WEB.TRAIN}checkout/${trainOrderId}` }, undefined, {
                  shallow: false,
                });
              }, 3000);
            },
            onError: (error) => {
              notify({
                type: 'error',
                message: (error as ErrorResponse)?.response?.data?.message,
              });
            },
          },
        );
      } else {
        void push({ pathname: `${WEB.TRAIN}checkout/${trainOrderId}` }, undefined, {
          shallow: false,
        });
      }
    } catch (err) {
      notify({ type: 'error', message: (err as Error).message });
    }
  };

  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();
  useEffect(() => {
    routeChangeCompleted && searchButtonClicked && setSearchButtonClicked(false);
  }, [routeChangeCompleted]);

  const handleCreateOrder = async () => {
    const command = JSON.parse(sessionStorage.getItem('train_command') || '') as CreateOrderPayload;

    const data = await trainOrder({
      requestedTrain: command?.requestedTrain?.map((item) => {
        return {
          trainId: item.trainId,
          wantCompartment: item.wantCompartment,
        };
      }),
      passenger: {
        adult: Number(command?.passenger.adult),
        child: Number(command?.passenger.child),
        infant: Number(command?.passenger.infant),
      },
      compartmentGenderType: command?.compartmentGenderType,
    });

    setTrainOrderId(data?.orderId);

    const res = await handleSubmitPassengers(data?.orderId);

    return !!res;
  };

  const handleSubmitPassengers = async (trainOrderId: string) => {
    try {
      if (selectedPassengers.length) {
        const passengers = PassengerConvertor(selectedPassengers);
        trainTicketPassengerValidate(passengers, selectedPassengers);
        return submitOrderPassengers(trainOrderId);
      }
    } catch (err) {
      notify({
        type: 'error',
        // message: (err as ErrorResponse)?.response?.data?.message,
        message: (err as Error).message,
      });
    }
  };
  const isSuperapp = useIsSuperApp();

  const handleContinueButton = () => {
    setSearchButtonClicked(true);
    if (isMobile) {
      shouldRenderOptions.some((value) => value === true) ||
      shouldRenderFreeOptions.some((value) => value === true)
        ? setShowOptionalModal(true)
        : handleCreateOrder();
    } else {
      handleCreateOrder();
    }
  };
  return (
    <>
      <div className="d-block d-md-none mt-3">
        <PassengerList
          getPassengers={getPassengers}
          passengers={passengers}
          setPassenger={setPassenger}
          selectedPassengers={selectedPassengers}
        />
        <div
          className={cn(
            styles['passenger-list__add-passenger'],
            isSuperapp ? styles['is-superapp'] : '',
          )}
        >
          <Button
            disabled={!allowSubmit}
            loading={
              isLoadingOptionalServices ||
              isOrderPassengerLoading ||
              searchButtonClicked ||
              routeChangeStarted
            }
            className={cn(styles['passenger-list__add-passenger__btn'], 'btn btn-primary w-100')}
            onClick={handleContinueButton}
            radius
          >
            تایید {selectedPassengers.length ? `( ${selectedPassengers.length} مسافر)` : ''}
          </Button>
        </div>
      </div>

      <div className="d-none d-md-block">
        <div className="my-4">
          <div className={styles['passenger-list']}>
            <div className="d-flex p-2 px-3">
              <UserIcon />
              <span>انتخاب مسافران</span>
            </div>
            <Divider type="horizontal" />
            <div dir="ltr">
              {passengers.length === 0 && (
                <div className="rtl p-3 px-4 pb-2">
                  هیچ مسافری در لیست مسافران وجود ندارد.لطفا اطلاعات مسافران جدید را وارد کنید .
                </div>
              )}
            </div>
            {passengers.length > 0 && (
              <div className="d-flex justify-content-between px-4 mt-3">
                <span>
                  لطفا مسافران این سفر را از لیست زیر انتخاب کنید و یا اطلاعات مسافران جدید را اضافه
                  کنید.
                </span>
                <div>
                  <PassengersSearchBox
                    placeholder="جستجو مسافران"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
                    title="جستجو مسافران"
                  />
                </div>
              </div>
            )}

            <div className="mt-3 px-4 mb-3">
              <table className={cn('w-100')}>
                <thead className={styles['passenger-list__header']}>
                  <tr>
                    <th></th>
                    <th>نام و نام خانوادگی </th>
                    <th>جنسیت</th>
                    <th>کدملی/شماره پاسپورت</th>
                    <th>تاریخ تولد</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody className={styles['passenger-list__body']}>
                  {React.Children.toArray(
                    filteredPassengers?.map((passenger) => {
                      return (
                        <PassengerItem
                          key={passenger.id}
                          passenger={passenger}
                          setPassenger={setPassenger}
                          selectedPassengers={selectedPassengers}
                          getPassengers={getPassengers}
                        />
                      );
                    }),
                  )}
                </tbody>
              </table>
            </div>
            <Divider type="horizontal" />
            <AddForm getPassengers={getPassengers} />
          </div>
        </div>
        {passengersForOptionalServices.length > 0 &&
        (shouldRenderOptions || shouldRenderFreeOptions) ? (
          <div className="rtl">
            <PassengerOptionals
              handleSubmitOptions={handleSubmitServices}
              visible={showOptionalModal}
              passengers={passengersForOptionalServices}
              isLoading={isSetOptionalLoading || isOrderPassengerLoading}
              onClose={() => setShowOptionalModal(false)}
              handleSubmitPassengers={handleCreateOrder}
              isOrderPassengerSuccess={isOrderPassengerSuccess}
              shouldRenderOptions={shouldRenderOptions}
              shouldRenderFreeOptions={shouldRenderFreeOptions}
            />
          </div>
        ) : (
          <Footer
            handleSubmitPassengers={handleCreateOrder}
            isOrderPassengerLoading={isOrderPassengerLoading}
            isLoadingOptionalServices={isLoadingOptionalServices}
            allowSubmit={allowSubmit}
          />
        )}
      </div>
    </>
  );
};

export default PassengersList;
