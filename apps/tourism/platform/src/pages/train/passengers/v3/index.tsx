import { ReactElement, useEffect, useMemo, useState } from 'react';

import dynamic from 'next/dynamic';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import HeaderHoc from 'components/headerHoc';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { TimeComparator } from 'utils/helpers/expireTimer';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import PassengerDesktopTickets from 'module/train/passengers/components/passengerDesktopTicket';
import PassengerConvertor from 'utils/helpers/passengerConvertor';
import { trainTicketPassengerValidate } from 'utils/helpers/validations';
import { notify } from 'utils/notification';
import {
  AddOrderPassengerPayload,
  CreateOrderPayload,
  SetPassengersOptionalService,
} from 'services/train/orders/interface';
import { TrainTicket } from 'module/train/tickets/interface';
import {
  addOrderPassenger,
  setPassengerOptionalService,
  createOrder as trainOrder,
} from 'services/train/orders';
import { ErrorResponse } from 'services/bus/tickets/interface';
import { TOptionalsData } from 'module/train/passengers/components/list';
import { useGetTicketOptions } from 'module/train/tickets/hooks/useGetTicketOptions';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useRouteChange } from 'utils/hooks/useRouteChange';
import WEB from 'utils/routes/web';
import PassengerOptionals from 'module/train/passengers/optionals';
import { PassengerModel } from 'components/passenger/hooks/usePassenger';
import Footer from 'module/train/passengers/components/list/footer';

// import {getTotalTrainTicketPassenger} from 'module/train/passengers/list/helper';
// import {useIsSuperApp} from 'utils/hooks/useIsSuperApp';
const PassengersList = dynamic(
  () => import('components/passenger/components/passengersList/index'),
  {
    ssr: false,
  },
);

const PassengerPage = () => {
  const { checkExpiry } = useExpireContext();
  const service = ServiceDetector();
  // const [total, setTotal] = useState<Array<ITrainEmptyPassenger>>(
  //   getTotalTrainTicketPassenger(),
  // );

  // const setPassenger = (passenger: TPassengerV2) => {
  //   if (!selectedPassengers.some(x => x.id === passenger.id))
  //     setSelected(prev => [...prev, passenger]);
  //   else setSelected(prev => prev.filter(x => x.id !== passenger.id));
  // };
  const [showOptionalModal, setShowOptionalModal] = useState(false);
  const { isMobile } = useDeviceDetect();
  // const [filter, setFilter] = useState<string>('');
  const { push } = useRouter();
  const [trainOrderId, setTrainOrderId] = useState<string>('');

  // const filteredPassengers = useMemo(
  //   () =>
  //     passengers
  //       ?.sort(function (a, b) {
  //         return selectedPassengers.indexOf(b) - selectedPassengers.indexOf(a);
  //       })
  //       .filter(
  //         x =>
  //           x.englishFamily?.includes(filter) ||
  //           x.englishName?.includes(filter) ||
  //           x.persianName?.includes(filter) ||
  //           x.persianFamily?.includes(filter),
  //       ),
  //   [filter, passengers],
  // );

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
  const [selectedPassengers, setSelectedPassengers] = useState<PassengerModel[]>([]);
  // const addPassenger = (passengers: PassengerModel[]) => {
  //   setSelectedPassengers(passengers);
  //   // createOrder();
  // };
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
  // const isSuperapp = useIsSuperApp();

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
  useEffect(() => {
    const timeout = setTimeout(
      () => checkExpiry({ type: 'uuid', expired: true }),
      TimeComparator('uuid-expiry', service),
    );
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const passengersForOptionalServices = selectedPassengers.filter(
    ({ ageType }) => ageType !== 'AGE_TYPE_INFANT',
  );
  const allowSubmit = !!passengersForOptionalServices.length;

  return (
    <>
      <HeaderHoc>
        <span className="text-3 text-weight-500">افزودن مسافر</span>
      </HeaderHoc>
      <div className="d-none d-md-block">
        <PassengerDesktopTickets />
      </div>
      <PassengersList
        serviceName="rajatrain"
        addSelectedPassengers={setSelectedPassengers}
        isConfirmButton={isMobile ? true : false}
        isConfirmButtonLoading={
          isLoadingOptionalServices ||
          isOrderPassengerLoading ||
          searchButtonClicked ||
          routeChangeStarted
        }
        addPassengers={() => handleContinueButton()}
        OptionComponent={
          passengersForOptionalServices.length > 0 &&
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
          )
        }
      />
    </>
  );
};

PassengerPage.getLayout = function getLayout(page: ReactElement) {
  const { device } = page.props;
  return device == 'desktop' ? (
    <Layout {...page.props}>{page}</Layout>
  ) : (
    <MobileLayout {...page.props}>{page}</MobileLayout>
  );
};

export default PassengerPage;
