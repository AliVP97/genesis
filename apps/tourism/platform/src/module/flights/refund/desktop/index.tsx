import { ITripDomesticFlight, TTrip } from 'module/flights/travels/interface';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { calcRefund, refund } from 'services/domestic/refund';
import { notify } from 'utils/notification';
import { TRefundReason, TSealectdIata, TSteps } from './types';
import Divider from 'components/divider';
import styles from '../refund.module.scss';
import cn from 'classnames';
import { DetailsStep, FinalMessage, PathStep, TicketStep } from './components';
import RefundResaonStep from './components/reasonStep';
import RefundFooter from './components/refundFooter';
import RefundHeader from './components/refundHeader';
import RefundExpireModal from './components/refundExpireModal';

type TRefundodalProps = {
  onClose: () => void;
  order: TTrip;
};

enum RefundMessage {
  BY_CRCN = 'درخواست استرداد شما با موفقیت انجام شد.',
  DEFAULT = 'استرداد شما با موفقیت ثبت شد، کارشناسان ما در حال بررسی درخواست شما می باشند.',
}

export const RefundDesktop: React.FunctionComponent<TRefundodalProps> = ({ order, onClose }) => {
  const selectedTicketOnWhichWay = useRef<boolean>(false);
  const [step, setStep] = useState<TSteps>('path');
  const [selectedReason, setSelectedReason] = useState<TRefundReason>('REFUNDREASON_BY_CRCN');

  const [selectedDepartureIata, setSelectedDepartureIata] = useState<TSealectdIata>({
    farsi: '',
    iata: '',
    isReturn: false,
  });

  const [selectedTickets, setSelectedTickets] = useState<Array<string>>([]);

  const [finalResultMessage, setFinalResultMessage] = useState<RefundMessage>(
    RefundMessage.DEFAULT,
  );

  //when the radio button of departure or returning changes selected tickets will be reset
  if (selectedTicketOnWhichWay.current !== selectedDepartureIata.isReturn) {
    setSelectedTickets([]);
    selectedTicketOnWhichWay.current = selectedDepartureIata.isReturn;
  }

  useEffect(() => {
    if (order && !order.hasReturn) {
      setStep('reason');
      setSelectedDepartureIata({
        farsi: order.departureCity!,
        iata: (order.details as ITripDomesticFlight)?.departureIata ?? '',
        isReturn: false,
      });
    }
  }, [order]);

  const showErrorNotification = (message: string) => {
    notify({
      type: 'error',
      message,
    });
  };

  const {
    isLoading: calcRefundLoading,
    data: calcRefundData,
    mutate: calcRefundMutate,
  } = useMutation({
    mutationFn: calcRefund,
    onSuccess: () => {
      setStep('detail');
    },
    onError: () => {
      showErrorNotification('درخواست شما قابل پردازش نیست');
    },
  });

  const calcRefundHandler = () => {
    if (selectedReason === 'REFUNDREASON_BY_CRCN') {
      setFinalResultMessage(RefundMessage.BY_CRCN);
      calcRefundMutate({
        orderId: order.orderId!,
        refundReason: selectedReason,
        ticketIds: [...selectedTickets],
      });
    } else {
      refundMutate({
        orderId: order.orderId!,
        refundReason: selectedReason,
        ticketIds: [...selectedTickets],
      });
    }
  };
  const { isLoading: refundIsLoading, mutate: refundMutate } = useMutation({
    mutationFn: refund,
    onSuccess: () => {
      setFinalResultMessage(RefundMessage.BY_CRCN);
      setStep('finalMessage');
    },
    onError: () => {
      showErrorNotification('درخواست شما قابل پردازش نیست');
    },
  });

  const nextSteps = {
    path: () => {
      if (!selectedDepartureIata.iata) {
        notify({
          type: 'error',
          message: 'لطفا مسیر پرواز را انتخاب کنید',
        });
        return false;
      }
      setStep('reason');
    },
    reason: () => {
      if (!selectedReason) {
        notify({
          type: 'error',
          message: 'لطفا دلیل استرداد را انتخاب کنید',
        });
        return false;
      }
      setStep('tickets');
    },
    tickets: () => {
      if (selectedTickets.length === 0) {
        notify({
          type: 'error',
          message: 'لطفا بلیط های خود را انتخاب نمایید',
        });
        return false;
      }
      calcRefundHandler();
    },
    detail: () => {
      refundMutate({
        orderId: order.orderId!,
        refundReason: selectedReason,
        ticketIds: [...selectedTickets],
      });
    },
    finalMessage: () => {
      return null;
    },
  };

  const backSteps = {
    path: () => {
      onClose();
    },
    reason: () => {
      order.hasReturn ? setStep('path') : onClose();
    },
    tickets: () => {
      setStep('reason');
    },
    detail: () => {
      setStep('tickets');
    },
    finalMessage: () => {
      return null;
    },
  };

  const pageRenderBasedOnStep = useMemo(() => {
    if (step === 'path') {
      return (
        <PathStep
          onClose={onClose}
          order={order}
          selectedDepartureIata={selectedDepartureIata}
          setSelectedDepartureIata={setSelectedDepartureIata}
          setStep={setStep}
        />
      );
    }
    if (step === 'reason') {
      return (
        <RefundResaonStep selectedReason={selectedReason} setSelectedReason={setSelectedReason} />
      );
    }
    if (step === 'tickets') {
      return (
        <TicketStep
          order={order}
          selectedDepartureIata={selectedDepartureIata}
          selectedTickets={selectedTickets}
          setSelectedTickets={setSelectedTickets}
        />
      );
    }
    if (step === 'detail') {
      return <DetailsStep calcRefundData={calcRefundData} order={order} />;
    }
    if (step === 'finalMessage') {
      return <FinalMessage onClose={onClose} message={finalResultMessage} />;
    }
    return null;
  }, [
    step,
    order,
    selectedDepartureIata,
    selectedReason,
    selectedTickets,
    calcRefundData,
    finalResultMessage,
    onClose,
    setSelectedDepartureIata,
    setSelectedReason,
    setSelectedTickets,
    setStep,
  ]);

  return (
    <>
      INTHENAMEOFGOD
      <div
        className={cn(
          styles['refund__modal'],
          step === 'finalMessage' ? styles['refund__modal--message'] : '',
          'bg-color-surface rounded-3',
        )}
      >
        <div className={step === 'finalMessage' ? 'd-none d-md-block' : 'd-block'}>
          <RefundHeader
            step={step}
            onClose={onClose}
            handleBackSteps={() => backSteps[`${step}`]()}
          />
        </div>

        <Divider type="horizontal" className="d-none d-md-block mt-0" />
        <div className="p-3 h-100 d-flex flex-column justify-content-between">
          {pageRenderBasedOnStep}

          {/* Footer */}
          {step !== 'finalMessage' && (
            <RefundFooter
              loading={calcRefundLoading || refundIsLoading}
              handleBackStep={() => backSteps[`${step}`]()}
              handleNextStep={() => nextSteps[`${step}`]()}
              onClose={onClose}
              selectedTickets={step === 'tickets' ? !!selectedTickets.length : true}
            />
          )}
        </div>
      </div>
      {/* Expire Modal */}
      <RefundExpireModal
        calcRefundData={calcRefundData}
        calcRefundHandler={calcRefundHandler}
        step={step}
        onClose={onClose}
      />
    </>
  );
};
