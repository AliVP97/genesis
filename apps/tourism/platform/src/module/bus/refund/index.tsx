import cn from 'classnames';
import Divider from 'components/divider';
import { useState } from 'react';
import { TBusOrder } from 'services/bus/order/interface';
import { TBusRefundReasonType } from 'services/bus/refund/interface';
import { notify } from 'utils/notification';
import Details from './components/details';
import FinalMessage from './components/finalMessage';
import Footer from './components/footer';
import Header from './components/header';
import Reason from './components/reason/indes';
import Ticket from './components/ticket';
import UseBusRefund from './hook/useBusRefund';

import styles from './refund.module.scss';
import { BusRefundMessage, TSteps } from './types';

type TBusRefundProps = {
  onClose: () => void;
  order: TBusOrder;
  orderId: string;
};
const BusRefund = ({ onClose, order, orderId }: TBusRefundProps) => {
  const [step, setStep] = useState<TSteps>('reason');
  const [selectedReason, setSelectedReason] =
    useState<TBusRefundReasonType>('REFUNDREASON_BY_CRCN');

  const [finalResultMessage, setFinalResultMessage] = useState<BusRefundMessage>(
    BusRefundMessage.ERROR,
  );

  const { refundHandler, refundLoading } = UseBusRefund(setStep, setFinalResultMessage);

  const nextSteps = {
    reason: () => {
      if (!selectedReason) {
        notify({
          type: 'error',
          message: 'لطفا دلیل استرداد را انتخاب کنید',
        });
        return false;
      }
      setStep('ticket');
    },
    ticket: () => {
      setStep('detail');
    },
    detail: () => {
      refundHandler(orderId, selectedReason);
    },
    finalMessage: () => {
      return null;
    },
  };

  const backSteps = {
    reason: () => {
      onClose();
    },
    ticket: () => {
      setStep('reason');
    },
    detail: () => {
      setStep('ticket');
    },
    finalMessage: () => {
      return null;
    },
  };

  return (
    <>
      <div className={cn(styles['refund__modal'], 'bg-white')}>
        <div>
          <Header onClose={onClose} handleBackSteps={() => backSteps[`${step}`]()} step={step} />
        </div>
        <Divider type="horizontal" className="d-none d-md-block mt-0" />
        <div className="p-3 h-100 d-flex flex-column justify-content-between">
          {step === 'reason' ? (
            <>
              <Reason
                orderId={orderId}
                selectedReason={selectedReason}
                setSelectedReason={setSelectedReason}
              />
            </>
          ) : step === 'ticket' ? (
            <>
              <Ticket order={order} />
            </>
          ) : step === 'detail' ? (
            <Details orderId={orderId} refundReason={selectedReason} />
          ) : (
            <>
              <FinalMessage message={finalResultMessage} />
            </>
          )}
          {step !== 'finalMessage' && (
            <Footer
              loading={refundLoading}
              handleBackStep={() => backSteps[`${step}`]()}
              handleNextStep={() => nextSteps[`${step}`]()}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BusRefund;
