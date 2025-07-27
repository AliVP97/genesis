import { InfoIcon } from 'assets/icons';
import Link from 'next/link';

function RefundPolicy() {
  return (
    <>
      <div className="flex-grow-1 d-flex  align-items-center">
        <div className="d-flex justify-content-center align-items-center mx-2">
          <InfoIcon />
        </div>
        <div className="flex-grow-1 d-flex flex-column align-items-center mx-2">
          <div className="w-100">
            <span className="fs-3">
              میزان جریمه با توجه به زمان درخواست استرداد وقوانین سازمان اتوبوسرانی متفاوت می‌باشد.
            </span>
          </div>
          <div className="w-100">
            <Link href={`${process.env.NEXT_PUBLIC_DOMAIN}page/tourism-terms`}>
              <a className="fs-3">مشاهده جدول درصد جریمه</a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default RefundPolicy;
