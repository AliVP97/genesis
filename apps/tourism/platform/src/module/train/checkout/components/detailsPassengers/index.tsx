import { PriceDetail } from 'services/train/tickets/priceDetail/interface';

type TicketDetailPassengerProps = {
  price: PriceDetail;
};

const CheckoutDetailsPassengers = ({ price }: TicketDetailPassengerProps) => {
  return (
    <>
      {price.tariff == 'TARIFF_ADULT' && (
        <div className="d-flex justify-content-between  align-items-center my-2">
          <div className="color-grey-1" dir="rtl">
            <span className="text-3">بزرگسال </span>
            <span className="text-2 m-1">( ۱۲ سال به بالا ) </span>
          </div>

          <div dir="rtl" className="d-flex align-items-center">
            <span className="color-tertiary text-weight-bold text-3 ms-1 ">x {price.count}</span>
            <span className="color-grey-1">
              {Number(price.price).toLocaleString()} <span className="text-2">ریال </span>
            </span>
          </div>
        </div>
      )}
      {price.tariff == 'TARIFF_ADULT_FOREIGN' && (
        <div className="d-flex justify-content-between  align-items-center my-2">
          <div className="color-grey-1" dir="rtl">
            <span className="text-3">غیر ایرانی</span>
          </div>

          <div dir="rtl" className="d-flex align-items-center">
            <span className="color-tertiary text-weight-bold text-3 ms-1 ">x {price.count}</span>
            <span className="color-grey-1">
              {Number(price.price).toLocaleString()} <span className="text-2">ریال </span>
            </span>
          </div>
        </div>
      )}
      {price.tariff == 'TARIFF_CHILD' && (
        <div className="d-flex justify-content-between  align-items-center my-2">
          <div className="color-grey-1" dir="rtl">
            <span className="text-3">کودک </span>
            <span className="text-2 m-1">( ۲ تا ۱۲ سال ) </span>
          </div>

          <div dir="rtl" className="d-flex align-items-center">
            <span className="color-tertiary text-weight-bold text-3 ms-1">x {price.count}</span>
            <span className="color-grey-1">
              {Number(price.price).toLocaleString()} <span className="text-2">ریال </span>
            </span>
          </div>
        </div>
      )}
      {price.tariff == 'TARIFF_INFANT' && (
        <div className="d-flex justify-content-between  align-items-center my-2">
          <div className="color-grey-1" dir="rtl">
            <span className="text-3">نوزاد </span>
            <span className="text-2 m-1">(10 روز تا 2 سال ) </span>
          </div>

          <div dir="rtl" className="d-flex align-items-center">
            <span className="color-tertiary text-weight-bold text-3 ms-1">x {price.count}</span>
            <span className="color-grey-1">
              {Number(price.price).toLocaleString()} <span className="text-2">ریال </span>
            </span>
          </div>
        </div>
      )}
      {price.tariff == 'TARIFF_EMPTY' && (
        <div className="d-flex justify-content-between \ align-items-center my-2">
          <div className="color-grey-1" dir="rtl">
            <span className="text-3">کوپه دربست</span>
            <span className="text-2 m-1">(صندلی خالی)</span>
          </div>

          <div dir="rtl" className="d-flex align-items-center">
            <span className="color-tertiary text-weight-bold text-3 ms-1">x {price.count}</span>
            <span className="color-grey-1">
              {Number(price.price).toLocaleString()} <span className="text-2">ریال </span>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutDetailsPassengers;
