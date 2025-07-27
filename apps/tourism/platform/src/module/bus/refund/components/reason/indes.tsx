import cn from 'classnames';
import RadioElement from 'components/radio';
import Spinner from 'components/spinner';
import React from 'react';
import { TBusRefundReasonType } from 'services/bus/refund/interface';
import UseBusRefundReason from '../../hook/useBusRefundReason';
import RefundInfo from '../infoMessage';

type RefundReasonStepProps = {
  selectedReason: TBusRefundReasonType;
  setSelectedReason: React.Dispatch<React.SetStateAction<TBusRefundReasonType>>;
  orderId: string;
};

function Reason({ selectedReason, setSelectedReason, orderId }: RefundReasonStepProps) {
  const { isLoading, busRefundReasons } = UseBusRefundReason(orderId);
  return (
    <>
      <div className="rtl d-flex flex-column h-100">
        <p>لطفا دلیل استرداد خود را انتخاب نمایید</p>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="px-md-3">
            <div className="bg-color-surface rounded-pill px-4 py-2 mb-3">
              {React.Children.toArray(
                busRefundReasons?.refundReasonItems?.map((item, index) => (
                  <RadioElement
                    key={index.toString() + item?.title}
                    label={item?.title ?? ''}
                    checked={selectedReason === item.refundReason}
                    onChange={() => setSelectedReason(item?.refundReason ?? 'REFUNDREASON_BY_CRCN')}
                    value={item.refundReason ?? ''}
                    className={cn('p-1')}
                  />
                )),
              )}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <RefundInfo />
        </div>
      </div>
    </>
  );
}

export default Reason;
