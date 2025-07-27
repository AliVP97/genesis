import { InfoIcon } from 'assets/icons';

const RefundImpossibleWarning = () => {
  return (
    <>
      <div className="rtl bg-color-white-2 p-3 d-flex mb-3 d-md-block">
        <div>
          <InfoIcon />
        </div>
        <div className="pe-2">
          <p className="mb-0">مسافر گرامی، </p>
          <div className="float-end">طبق</div>
          <a className="px-2" href={`${process.env.NEXT_PUBLIC_DOMAIN}page/tourism-terms`}>
            قوانین و مقررات استرداد
          </a>
          ، درخواست استرداد بلیط امکان پذیر نمیباشد
        </div>
      </div>
    </>
  );
};

export default RefundImpossibleWarning;
