import cn from 'classnames';
import styles from './refund.module.scss';
import { TTrip } from 'services/domestic/orders/interface';
import { TSteps } from './types';
import { useEffect, useState } from 'react';
import RefundHeader from './components/refundHeader';
import UseOrderDetails from 'module/flights/travels/hooks/useOrderDetails';
import Spinner from 'components/spinner';
import RefundRooms from './components/rooms';
import RefundFooter from './components/refundFooter';
import { TTripsHotelRoom } from 'services/trips/types';
import RefundRules from './components/refundRules';
import Notification from './components/notification';
import {
  UseInternationalRefundHotel,
  UseRefundHotel,
} from './hooks/useHotelRefund';
import {BottomSheet} from 'react-spring-bottom-sheet';
import Button from 'components/button';
import UsePenaltyHotel from './hooks/useHotelPenalty';
import RefundDetails from './components/refundDetails';
import ConfirmRefund from './components/confirmRefuund';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

interface IHotelRefundProps {
  order?: TTrip;
  onClose: () => void;
}

const HotelRefund = ({ order, onClose }: IHotelRefundProps) => {
  const [step, setStep] = useState<TSteps>('rooms');
  const [open, setOpen] = useState<boolean>(false);

  const device = useDeviceDetect();

  const [selectedRooms, setSelectedRooms] = useState<Array<TTripsHotelRoom>>(
    [],
  );

  const { refundHotel, isLoading, isSuccess } = UseRefundHotel();

  const {penaltyHotel, penaltyData} = UsePenaltyHotel();

  const {
    internationalRefundHotel,
    internationalHotelRefundData,
    internationalHotelRefundLoading,
  } = UseInternationalRefundHotel();

  const handleClick = () => {
    const orderId = orderDetails?.hotelDetail?.orderId || '';
    const rooms =
      orderDetails?.hotelDetail?.room?.map(room => room.roomId) || [];

    penaltyHotel({orderId, rooms: rooms});
  };

  const {
    isLoading: detailsIsLoading,
    getOrderDetails,
    order: orderDetails,
  } = UseOrderDetails();

  useEffect(() => {
    getOrderDetails(order?.orderId, 'Hotel');
  }, []);

  useEffect(() => {
    if (isSuccess) setStep('notification');
  }, [isSuccess]);

  const hotelType = orderDetails?.hotelDetail?.hotelInfo?.type as
    | 'HOTEL'
    | 'INTERNATIONAL_HOTEL'
    | undefined;

  const handleRefundDetail = () => {
    if (hotelType === 'INTERNATIONAL_HOTEL') {
      setStep('confirmRefund');
    } else if (hotelType === 'HOTEL') {
      setStep('notification');
    }
  };

  const handleConfirmRefundClick = () => {
    const orderId = penaltyData?.orderId ?? '';
    const rooms = penaltyData?.rooms?.map(room => room.roomId) || [];

    internationalRefundHotel({orderId, rooms});
    setStep('notification');
  };
  const nextSteps = {
    rooms: () => {
      setStep('refundRules');
      handleClick();
    },
    refundRules: () => {
      if (hotelType === 'HOTEL') {
        refundHotel({
          orderId: order?.orderId || '',
          rooms: selectedRooms.map(x => x.roomId),
        });
      }
      setOpen(true);

      if (!device.isMobile) {
        setStep('refundDetails');
      }
    },
    refundDetails: () => {
      setOpen(false);
      if (!device.isMobile) {
        setStep('confirmRefund');
      }
    },
    notification: () => {
      return;
    },
  };
  const backSteps = {
    rooms: () => {
      onClose();
    },
    refundRules: () => {
      setStep('rooms');
    },
    refundDetails: () => {
      setStep('refundRules');
    },
    notification: () => {
      setStep('refundDetails');
    },
  };
  return (
    <>
      <div
        className={cn(
          styles['refund__modal'],
          step === 'notification' || step === 'confirmRefund'
            ? styles['refund__modal--message']
            : '',
          'bg-color-white rounded-3',
        )}
      >
        {step !== 'notification' && step !== 'confirmRefund' ? (
          <RefundHeader
            onClose={onClose}
            handleBackSteps={() => backSteps[`${step}`]()}
          />
        ) : (
          ''
        )}

        <div style={{marginBottom: '38px'}}>
          {detailsIsLoading && (
            <small>
              <Spinner />{' '}
            </small>
          )}
          {step === 'rooms' ? (
            <RefundRooms
              order={orderDetails}
              setSelectedRooms={setSelectedRooms}
              selectedRooms={selectedRooms}
            />
          ) : step === 'refundRules' ? (
            <>
              <RefundRules
                hotelType={orderDetails?.hotelDetail?.hotelInfo?.type}
                cancelationRules={
                  orderDetails?.hotelDetail?.hotelInfo?.about?.cancellationRules
                }
                penaltyData={penaltyData}
              />
            </>
          ) : step === 'refundDetails' ? (
            <RefundDetails penaltyData={penaltyData} />
          ) : step === 'notification' ? (
            <Notification
              onClose={onClose}
              internationalHotelRefundData={internationalHotelRefundData}
              hotelType={hotelType}
            />
          ) : step === 'confirmRefund' ? (
            <ConfirmRefund
              onClose={onClose}
              handleClick={handleConfirmRefundClick}
              internationalHotelRefundLoading={internationalHotelRefundLoading}
            />
          ) : (
            ''
          )}
        </div>

        <div className="px-3">
          {step != 'notification' && step !== 'confirmRefund' ? (
            <RefundFooter
              handleBackStep={() => backSteps[`${step}`]()}
              handleNextStep={() => nextSteps[`${step}`]()}
              onClose={onClose}
              disabled={step === 'refundRules' && selectedRooms.length === 0}
              loading={isLoading}
            />
          ) : (
            ''
          )}
        </div>
      </div>
      {device.isMobile && (
        <BottomSheet
          open={open}
          onDismiss={() => setOpen(false)}
          footer={
            <Button
              radius
              btnType="button"
              className="btn btn-primary d-block w-100"
              onClick={() => {
                handleRefundDetail();
                setOpen(false);
              }}
            >
              تایید و ادامه
            </Button>
          }
        >
          {orderDetails && (
            <>
              <RefundDetails penaltyData={penaltyData} />
            </>
          )}{' '}
        </BottomSheet>
      )}
    </>
  );
};

export default HotelRefund;
