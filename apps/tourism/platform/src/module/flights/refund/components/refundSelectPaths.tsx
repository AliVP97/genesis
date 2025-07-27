import React from 'react';
import cn from 'classnames';
import styles from '../refund.module.scss';
import RadioElement from 'components/radio';
import Button from 'components/button';
import { TRefundFlowStates } from 'containers/refund';

export const RefundSelectPath = ({
  arival,
  departure,
  isReturn,
  returnTicketId,
  next,
  setForDeparture,
  setForReturning,
  selectedTrip,
  isLoading,
}: {
  arival: string;
  departure: string;
  isReturn: boolean;
  returnTicketId?: string;
  next: () => void;
  selectedTrip: TRefundFlowStates;
  setForDeparture: CallableFunction;
  setForReturning: CallableFunction;
  isLoading?: boolean;
}) => {
  return (
    <div className="my-3">
      <div className="flex-grow-1 w-100 text-end">
        <p>لطفا مسیر سفر را برای استرداد انتخاب کنید</p>

        <div dir="rtl" className={cn(styles['refund__ticket-box'], 'mx-1 px-2')}>
          <RadioElement
            value={departure}
            checked={selectedTrip.isDeparture!}
            // onChange={value => setSelectedPath(value)}
            onChange={() => setForDeparture()}
            className={''}
            label={'رفت:' + ` ${departure} ` + ` ${arival} `}
          />
        </div>

        {/* <div>{arival}</div>
          <div>{departure}</div> */}

        {isReturn && returnTicketId && (
          <div dir="rtl" className={cn(styles['refund__ticket-box'], 'mx-1 px-2')}>
            <RadioElement
              value={arival}
              checked={!selectedTrip.isDeparture!}
              // onChange={value => setSelectedPath(value)}
              onChange={() => setForReturning()}
              className={''}
              label={`برگشت: ${departure} - ${arival}`}
            />
          </div>
        )}
      </div>
      <div
        className="m-3"
        style={{
          position: 'absolute',
          bottom: '0',
          left: 0,
          right: 0,
        }}
      >
        <Button className="w-100 btn-primary" radius onClick={() => next()} loading={isLoading}>
          ادامه
        </Button>
      </div>
    </div>
  );
};
