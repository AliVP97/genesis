import { InfoIcon } from 'assets/icons';

const DesktopRefundInfo = () => {
  return (
    <div className="flex-grow-1 d-flex  align-items-center">
      <div className="d-flex justify-content-center align-items-center mx-2">
        <InfoIcon />
      </div>
      <div className="flex-grow-1 d-flex flex-column align-items-center mx-2">
        <div className="w-100">
          <span className="fs-3">
            میزان جریمه با توجه به زمان استرداد و شرکت هواپیمایی متفاوت می باشد.
          </span>
        </div>
        <div className="w-100">
          <a className="fs-3" href={`${process.env.NEXT_PUBLIC_DOMAIN}page/tourism-terms`}>
            مشاهده جدول درصد جریمه های پرواز های سیستمی
          </a>
        </div>
      </div>
    </div>
  );
};

export default DesktopRefundInfo;
