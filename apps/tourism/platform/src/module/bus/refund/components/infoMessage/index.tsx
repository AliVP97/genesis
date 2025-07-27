import { InfoIcon } from 'assets/icons';

const RefundInfo = () => {
  return (
    <div className="flex-grow-1 d-flex  align-items-center bg-color-blue-light px-2 py-3">
      <div className="d-flex justify-content-center align-items-center mx-2">
        <InfoIcon />
      </div>
      <div className="flex-grow-1 d-flex flex-column align-items-center mx-2">
        <div className="w-100">
          <span className="fs-3">
            در صورتی که سفر شما توسط تعاونی لغو شده است، لطفا از ادامه فرایند ثبت استرداد خودداری
            کرده و با پشتیبانی تماس بگیرید.
          </span>
        </div>
      </div>
    </div>
  );
};

export default RefundInfo;
