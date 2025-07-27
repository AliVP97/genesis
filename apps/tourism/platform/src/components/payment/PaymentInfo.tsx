import Divider from 'components/divider';

type PayementInfoProps = {
  price?: string;
  reason?: string;
  route?: string;
  totalPrice?: string;
  discount?: string;
};
const PayementInfo = ({ price, reason, route, totalPrice, discount }: PayementInfoProps) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center py-3 px-2 ">
        <span className="fs-3 color-gray-2">بابت: </span>
        <div>
          <span className="fs-3">{reason}</span>
        </div>
      </div>
      <Divider type="horizontal" className="border-color-gray-3" style="dashed" />
      {route ? (
        <div className="d-flex justify-content-between align-items-center py-3 px-2 ">
          <span className="fs-3 color-gray-2">مسیر: </span>
          <div>
            <span className="fs-3">{route}</span>
          </div>
        </div>
      ) : null}
      <Divider type="horizontal" className="border-color-gray-3" style="dashed" />
      <div className="d-flex justify-content-between align-items-center py-3 px-2">
        <span className="fs-3 color-gray-2">مبلغ:</span>
        <div>
          <span className={`fs-5 ${discount && +discount <= 0 && 'color-primary'} fw-bold`}>
            {Number(price ?? 0).toLocaleString()}
          </span>
          <span className={`fs-3 me-1 ${discount && +discount <= 0 && 'color-primary'}`}>ریال</span>
        </div>
      </div>
      {discount && +discount > 0 && (
        <>
          <Divider type="horizontal" className="border-color-gray-3" style="dashed" />
          <div className="d-flex justify-content-between align-items-center py-3 px-2">
            <span className="fs-3 color-gray-2">تخفیف:</span>
            <div>
              <span className="fs-5 fw-bold">{Number(discount ?? 0).toLocaleString()}</span>
              <span className="fs-3 me-1">ریال</span>
            </div>
          </div>
          <Divider type="horizontal" className="border-color-gray-3" style="dashed" />
          <div className="d-flex justify-content-between align-items-center py-3 px-2">
            <span className="fs-3 color-gray-2">مبلغ نهایی:</span>
            <div>
              <span className="fs-5 color-primary fw-bold">
                {Number(totalPrice ?? 0).toLocaleString()}
              </span>
              <span className="fs-3 me-1 color-primary">ریال</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PayementInfo;
