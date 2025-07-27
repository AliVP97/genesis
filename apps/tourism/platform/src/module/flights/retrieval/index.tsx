import { Order, OrderPassengerList } from 'services/domestic/orders/interface';
import { BackArrowIcon } from 'assets/icons';
import classNames from 'classnames';
import { OrderType } from '../travels/interface';
import Button from 'components/button';
import Modal from 'components/modal';
import RadioElement from 'components/radio';
import { useMemo, useState } from 'react';
import useTimeConvertor from 'utils/hooks/useTimeConvertor';
import { RetrievalFlightGroup, RetrievalReson, RetrievalSteps, TTripType } from './interface';
import styles from './retrieval.module.scss';
import RetrievalPassengerList from './retrievalList';
import { BottomSheet } from 'react-spring-bottom-sheet';

interface IProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  order: Order;
  tripType: TTripType;
}

const Retrieval = ({ setVisible, visible, order, tripType }: IProps) => {
  const [retrievalReason, setRetrievalReason] = useState<RetrievalReson>(RetrievalReson.ONE);
  const [selectGroup, setSelectGroup] = useState<RetrievalFlightGroup>(RetrievalFlightGroup.ONEWAY);
  const [step, setStep] = useState<RetrievalSteps>(
    tripType === 'TRIPTYPE_DOMESTIC_FLIGHT'
      ? RetrievalSteps.CANCELATION
      : RetrievalSteps.SELECT_GROUP,
  );

  const orderInfo: OrderType = useMemo(() => {
    return (order?.passengers as OrderPassengerList).reduce(
      (acc: OrderType, cur, index) => {
        if (index === 0) {
          acc.departureCity = cur.tickets?.[0]?.flightInfo?.departure?.airport?.city?.name?.farsi;
          acc.arrivalCity = cur.tickets?.[0]?.flightInfo?.arrival?.airport?.city?.name?.farsi;
          acc.price = order?.payment?.totalPrice;
          acc.orderId = order?.orderId;
          acc.departureAirline = cur.tickets?.[0]?.flightInfo?.airline?.name;
          acc.departureTime = cur.tickets?.[0]?.flightInfo?.departure?.date;
          acc.issueDate = cur.tickets?.[0]?.issueDate;
          acc.pnr = cur.tickets?.[0]?.pnr;
          acc.return = cur.tickets!.length > 1;
          if (acc.return) {
            acc.arrivalAirline = cur.tickets![1]?.flightInfo?.airline?.name;
            acc.returningDepartureTime = cur.tickets![1]?.flightInfo?.departure?.date;
          }
        }
        acc.passengers.push({
          firstName: cur.passenger?.firstname?.farsi,
          lastName: cur.passenger?.lastname?.farsi,
          passengerType: cur.passenger?.passengerType,
          price: cur.tickets?.[0]?.payment?.price,
        });

        return acc;
      },
      { passengers: [] },
    );
  }, [order]);

  const handleNextStep = () => {
    if (tripType === 'TRIPTYPE_DOMESTIC_FLIGHT') {
      if (orderInfo.return && step === RetrievalSteps.CANCELATION) {
        setStep(RetrievalSteps.SELECT_GROUP);
        return;
      }
    }
    setStep(RetrievalSteps.SELECT_TICKET);
  };

  const departreDate = useTimeConvertor(orderInfo.departureTime);
  const returningDepartreDate = useTimeConvertor(orderInfo.returningDepartureTime);

  return (
    <Modal visible={visible} onClose={() => setVisible(false)}>
      <div className={styles['retrieval']}>
        <div className={styles['retrieval__header']}>
          <BackArrowIcon
            onClick={() => setVisible(false)}
            className={classNames(styles['retrieval__header--icon'], 'fill-tertiary')}
          />
          <span className="text-3 text-weight-500">استرداد </span>
        </div>
        <div className={styles['retrieval__content']}>
          {step === RetrievalSteps.CANCELATION && (
            <>
              <span className="d-inline-block pt-4 px-4 text-3">
                لطفا دلیل استرداد خود را انتخاب کنید{' '}
              </span>
              <div className="bg-white px-3 m-2 rounded">
                <RadioElement
                  value={RetrievalReson.ONE}
                  checked={retrievalReason === RetrievalReson.ONE}
                  onChange={(value: RetrievalReson) => setRetrievalReason(value)}
                  className={styles['retrieval__option']}
                  label="طبق قوانین کنسلی پرواز"
                />
              </div>

              <div className="bg-white px-3 m-2 rounded">
                <RadioElement
                  value={RetrievalReson.TWO}
                  checked={retrievalReason === RetrievalReson.TWO}
                  onChange={(value: RetrievalReson) => setRetrievalReason(value)}
                  className={styles['retrieval__option']}
                  label="ابطال از طرف ایرلاین"
                />
              </div>
              <div className="bg-white px-3 m-2 rounded">
                <RadioElement
                  value={RetrievalReson.THREE}
                  checked={retrievalReason === RetrievalReson.THREE}
                  onChange={(value: RetrievalReson) => setRetrievalReason(value)}
                  className={styles['retrieval__option']}
                  label="تاخیر و تعجیل بالای دو ساعت"
                />
              </div>
            </>
          )}
          {step === RetrievalSteps.SELECT_GROUP && (
            <>
              <span className="d-inline-block pt-4 px-4 text-3">
                لطفا مسیر سفر را برای استرداد انتخاب کنید{' '}
              </span>
              <RadioElement
                value={RetrievalFlightGroup.ONEWAY}
                checked={selectGroup === RetrievalFlightGroup.ONEWAY}
                onChange={(value: RetrievalFlightGroup) => setSelectGroup(value)}
                className={styles['retrieval__option']}
                label={`سفر رفت : ${orderInfo.departureCity} - ${orderInfo.arrivalCity}`}
              />
              <RadioElement
                value={RetrievalFlightGroup.ROUND_TRIP}
                checked={selectGroup === RetrievalFlightGroup.ROUND_TRIP}
                onChange={(value: RetrievalFlightGroup) => setSelectGroup(value)}
                className={styles['retrieval__option']}
                label={`سفر برگشت : ${orderInfo.arrivalCity} - ${orderInfo.departureCity}`}
              />
            </>
          )}
          {step === RetrievalSteps.SELECT_TICKET && (
            <>
              <div className={classNames(styles['retrieval__details'], 'mt-2')}>
                <div className={styles['retrieval__details--header']}>
                  <span className="color-grey-1">جزئیات سفر </span>
                </div>
                <div className={styles['retrieval__details--body']}>
                  <div className="d-flex justify-content-between w-100 text-3 p-3 color-grey-1">
                    <span>نوع سفارش</span>
                    <span>پرواز داخلی</span>
                  </div>
                  <div className="d-flex justify-content-between w-100 text-3 p-3 color-grey-1">
                    <span>مسیر</span>
                    {selectGroup === RetrievalFlightGroup.ONEWAY ? (
                      <span>
                        {orderInfo.departureCity} - {orderInfo.arrivalCity}
                      </span>
                    ) : (
                      <span>
                        {orderInfo.arrivalCity} - {orderInfo.departureCity}
                      </span>
                    )}
                  </div>
                  <div className="d-flex justify-content-between w-100 text-3 p-3 color-grey-1">
                    <span>شرکت هواپیمایی</span>
                    {selectGroup === RetrievalFlightGroup.ONEWAY ? (
                      <span>{orderInfo.departureAirline}</span>
                    ) : (
                      <span>{orderInfo.arrivalAirline}</span>
                    )}
                  </div>
                  <div className="d-flex justify-content-between w-100 text-3 p-3 color-grey-1">
                    <span>تاریخ و ساعت حرکت</span>
                    {selectGroup === RetrievalFlightGroup.ONEWAY ? (
                      <div>
                        <span>{`${departreDate.year}/${departreDate.monthIndex}/${departreDate.date}`}</span>
                        <span className="p-1">{`${departreDate.time}`}</span>
                      </div>
                    ) : (
                      <div>
                        <span>{`${returningDepartreDate.year}/${returningDepartreDate.monthIndex}/${returningDepartreDate.date}`}</span>
                        <span className="p-1">{`${returningDepartreDate.time}`}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <RetrievalPassengerList
                departureCity={orderInfo.departureCity as string}
                arrivalCity={orderInfo.arrivalCity}
                double={!!orderInfo.return}
                returning={selectGroup === RetrievalFlightGroup.ROUND_TRIP}
                list={orderInfo.passengers}
              />
            </>
          )}

          <BottomSheet open={false}>
            <>
              <div className={classNames(styles['retrieval__details'], 'mt-2')}>
                <div className={styles['retrieval__details--header']}>
                  <span className="color-grey-1">جزئیات سفر </span>
                </div>
                <div className={styles['retrieval__details--body']}>
                  <div className="d-flex justify-content-between w-100 text-3 p-3 color-grey-1">
                    <span>نوع سفارش</span>
                    <span>پرواز داخلی</span>
                  </div>
                  <div className="d-flex justify-content-between w-100 text-3 p-3 color-grey-1">
                    <span>مسیر</span>
                    {selectGroup === RetrievalFlightGroup.ONEWAY ? (
                      <span>
                        {orderInfo.departureCity} - {orderInfo.arrivalCity}
                      </span>
                    ) : (
                      <span>
                        {orderInfo.arrivalCity} - {orderInfo.departureCity}
                      </span>
                    )}
                  </div>
                  <div className="d-flex justify-content-between w-100 text-3 p-3 color-grey-1">
                    <span>شرکت هواپیمایی</span>
                    {selectGroup === RetrievalFlightGroup.ONEWAY ? (
                      <span>{orderInfo.departureAirline}</span>
                    ) : (
                      <span>{orderInfo.arrivalAirline}</span>
                    )}
                  </div>
                  <div className="d-flex justify-content-between w-100 text-3 p-3 color-grey-1">
                    <span>تاریخ و ساعت حرکت</span>
                    {selectGroup === RetrievalFlightGroup.ONEWAY ? (
                      <div>
                        <span>{`${departreDate.year}/${departreDate.monthIndex}/${departreDate.date}`}</span>
                        <span className="p-1">{`${departreDate.time}`}</span>
                      </div>
                    ) : (
                      <div>
                        <span>{`${returningDepartreDate.year}/${returningDepartreDate.monthIndex}/${returningDepartreDate.date}`}</span>
                        <span className="p-1">{`${returningDepartreDate.time}`}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <RetrievalPassengerList
                departureCity={orderInfo.departureCity as string}
                arrivalCity={orderInfo.arrivalCity}
                double={!!orderInfo.return}
                returning={selectGroup === RetrievalFlightGroup.ROUND_TRIP}
                list={orderInfo.passengers}
              />
            </>
          </BottomSheet>
          {step === RetrievalSteps.BUTTOM_SHEET && <></>}

          {step === RetrievalSteps.MODAL && <></>}

          <Button onClick={handleNextStep} className={styles['retrieval__button']}>
            مرحله بعد{' '}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Retrieval;
