import Divider from 'components/divider';
import { TPaymentOrder } from '../../interface';

type PaymentInfoProps = {
  paymentOrder?: TPaymentOrder;
  reason?: string;
};
const PaymentInfo = ({ paymentOrder, reason }: PaymentInfoProps) => {
  const basePrice = paymentOrder?.basePrice ?? 0;
  const discountAmount = paymentOrder?.discount?.amount ?? 0;
  const totalPrice = paymentOrder?.totalPrice ?? 0;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center py-3 px-2 ">
        <span className="fs-3 color-gray-2">بابت: </span>
        <div>
          <span className="fs-3">{reason}</span>
        </div>
      </div>
      <Divider type="horizontal" className="border-color-gray-3" style="dashed" />
      {discountAmount !== 0 && (
        <>
          <div className="d-flex justify-content-between align-items-center py-3 px-2">
            <span className="fs-3 color-gray-2">مبلغ:</span>
            <div>
              <span className="fs-4 color-primary fw-bold">
                {Number(basePrice).toLocaleString()}
              </span>
              <span className="fs-3 me-1 color-primary">ریال</span>
            </div>
          </div>
          <Divider type="horizontal" className="border-color-gray-3" style="dashed" />
          <div className="d-flex justify-content-between align-items-center py-3 px-2">
            <span className="fs-3 color-gray-2">تخفیف:</span>
            <div>
              <span className="fs-4 color-primary fw-bold">
                {Number(discountAmount).toLocaleString()}
              </span>
              <span className="fs-3 me-1 color-primary">ریال</span>
            </div>
          </div>
          <Divider type="horizontal" className="border-color-gray-3" style="dashed" />
        </>
      )}
      <div className="d-flex justify-content-between align-items-center py-3 px-2">
        <span className="fs-3 color-gray-2">مبلغ نهایی:</span>
        <div>
          <span className="fs-4 color-primary fw-bold">{Number(totalPrice).toLocaleString()}</span>
          <span className="fs-3 me-1 color-primary">ریال</span>
        </div>
      </div>
      <Divider type="horizontal" className="border-color-gray-3" style="dashed" />
    </>
  );
};

export default PaymentInfo;
