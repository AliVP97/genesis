import React from 'react';
import type { STEPS } from '../index';
import cn from 'classnames';
import styles from '../refund.module.scss';
import RadioElement from 'components/radio';
import Button from 'components/button';
import { TRefundReasonResponse } from 'services/domestic/refund/interface';
import { TRefundFlowStates } from 'containers/refund';

export const RefundSelectReason = ({
  selectedTrip,
  setSelectedTrip,
  reasons,
  setStep,
}: {
  setSelectedTrip: React.Dispatch<React.SetStateAction<TRefundFlowStates>>;
  reasons: TRefundReasonResponse['refundReasonItems'];
  selectedTrip: TRefundFlowStates;
  setStep: React.Dispatch<React.SetStateAction<STEPS>>;
}) => {
  return (
    <>
      <p className="text-end mt-4">لطفا دلیل استرداد خود را انتخاب نمایید</p>

      {reasons?.map((reason) => {
        return (
          <div
            key={reason.title}
            dir="rtl"
            className={cn(styles['refund__ticket-box'], 'mx-1 px-2')}
          >
            <RadioElement
              value={reason.refundReason!}
              checked={selectedTrip.refundReason?.refundReason === reason.refundReason}
              onChange={() => setSelectedTrip((old) => ({ ...old, refundReason: reason }))}
              className={''}
              label={reason.title!}
            />
          </div>
        );
      })}

      <div
        className="m-3"
        style={{
          position: 'absolute',
          bottom: '0',
          left: 0,
          right: 0,
        }}
      >
        <Button
          className="w-100 btn-primary"
          radius
          disabled={!selectedTrip.refundReason?.refundReason}
          onClick={() => {
            setStep('selectTicket');
          }}
        >
          ادامه
        </Button>
      </div>
    </>
  );
};
