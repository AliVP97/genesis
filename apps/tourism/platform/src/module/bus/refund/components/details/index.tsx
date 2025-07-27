import cn from 'classnames';
import Spinner from 'components/spinner';
import { useEffect } from 'react';
import { TBusRefundReasonType } from 'services/bus/refund/interface';
import UseBusRefundCalculate from '../../hook/UseBusRefundCalculate';

type TDetailProps = {
  orderId: string;
  refundReason: TBusRefundReasonType;
};
function Details({ refundReason, orderId }: TDetailProps) {
  const {
    calcRefundData,
    calcRefundIsSuccess,
    calcRefundLoading,
    calcRefundHandler,
    calcRefundError,
  } = UseBusRefundCalculate();

  useEffect(() => {
    calcRefundHandler(orderId, refundReason);
  }, []);

  return (
    <>
      {calcRefundError ? (
        <div className={'rtl'}>
          {(calcRefundError as { response: { data: { message?: string } } })?.response.data.message}
        </div>
      ) : (
        <div className="d-md-none w-100 card border-0 shadow-sm rtl">
          <div
            className={cn(
              'bg-color-surface-container color-on-surface w-100 py-3 rounded-top text-end px-3',
            )}
          >
            <b className="pe-2"> جزئیات استرداد</b>
          </div>
          <div className="py-2">
            {calcRefundLoading ? (
              <Spinner />
            ) : (
              <>
                {calcRefundIsSuccess && (
                  <>
                    <div className="d-flex justify-content-between py-2 p-3 color-on-surface">
                      <small> مبلغ بلیط </small>

                      <small>{Number(calcRefundData?.ticketPrice).toLocaleString()} ریال</small>
                    </div>
                    <div className="d-flex justify-content-between py-2 p-3 color-on-surface">
                      <small>مبلغ کل</small>
                      <small>{Number(calcRefundData?.totalPrice).toLocaleString()} ریال</small>
                    </div>

                    <div className="d-flex justify-content-between py-2 p-3 color-on-surface">
                      <small>مبلغ جریمه ({calcRefundData?.refundData?.penaltyPercent} درصد) </small>
                      <small>
                        {Number(calcRefundData?.refundData?.refundPenalty).toLocaleString()} ریال
                      </small>
                    </div>

                    <div className="d-flex justify-content-between py-2 p-3 color-on-surface">
                      <small className="color-primary">
                        <b>مبلغ قابل استرداد</b>
                      </small>
                      <small className="color-primary">
                        <b>{Number(calcRefundData?.refundData?.refundAmount).toLocaleString()} </b>
                        ریال
                      </small>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Details;
