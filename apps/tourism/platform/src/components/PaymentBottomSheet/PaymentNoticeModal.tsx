import cn from 'classnames';
import styles from './PaymentBottomSheet.module.scss';
import { InfoIcon } from 'assets/icons';
import Button from 'components/button';
import Modal from 'components/modal';
import React from 'react';
import Divider from 'components/divider';

type PaymentNoticeModalProps = {
  text?: string;
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const PaymentNoticeModal = ({
  open,
  loading,
  onClose,
  onConfirm,
  text,
}: PaymentNoticeModalProps) => {
  return (
    <Modal visible={open} onClose={onClose} backdropDisable={loading} transition={true}>
      <section
        className={cn(
          styles['modal-size'],
          'bg-white d-flex flex-column justify-content-center align-items-center rtl text-justify max-w-5xl rounded-5 p-3 pb-4',
        )}
      >
        <div className="d-flex mb-3">
          <div className="ps-2">
            <InfoIcon className="fill-grey-2" />
          </div>
          <span className={cn(styles['text-pre-line'], 'text-3 ')}>
            {text ??
              `  با پرداخت قسطی اسنپ‌پی، در صورتی که بعد از خرید نیاز به استرداد سفارش خود داشته باشید،
                مبلغ اعتبار به صورت کامل به حساب اسنپ‌پی شما باز میگردد و مبلغ ضمانت استرداد بدون جریمه
                به صورت نقدی توسط هف‌هشتاد از شما دریافت می‌شود.`}
          </span>
        </div>
        <Divider type="horizontal" className="d-none d-md-block w-100 h1" />
        <div className="rtl d-flex align-items-center justify-content-center  justify-content-md-end w-100">
          <Button
            className={cn(
              styles['min-width-btn'],
              'px-3 py-2 bg-white color-black text-4 rounded-5 ms-2 border-color-black',
            )}
            onTouchEnd={() => {
              if (loading) return;
              onClose();
            }}
            onClick={() => {
              if (loading) return;
              onClose();
            }}
          >
            انصراف
          </Button>
          <Button
            className={cn(
              styles['min-width-btn'],
              'px-3 py-2 bg-color-primary text-4 rounded-5 me-2',
            )}
            loading={loading}
            onTouchEnd={() => {
              if (loading) return;
              onConfirm();
            }}
            onClick={() => {
              if (loading) return;
              onConfirm();
            }}
          >
            <p className="text-4 mb-0 d-block d-md-none">تایید</p>
            <p className="text-4 mb-0 d-none d-md-block"> تایید و ادامه</p>
          </Button>
        </div>
      </section>
    </Modal>
  );
};
export default PaymentNoticeModal;
