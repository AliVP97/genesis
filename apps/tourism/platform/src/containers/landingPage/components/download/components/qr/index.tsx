import { CloseIcon } from 'assets/icons';
import { QrBarcode } from 'assets/images';
import Image from 'next/image';
import styles from './qr.module.scss';

type QrType = {
  close: () => void;
};
const Qr = ({ close }: QrType) => {
  return (
    <>
      <div className={styles['qr']}>
        <div className={styles['qr__hedear']}>
          <div className={styles['qr__hedear__title']}>
            <CloseIcon onClick={close} />
            <span>دریافت QR Code</span>
          </div>
          <div className={styles['qr__hedear__description']}>
            <p>
              برای دریافت لینک دانلود می توانید کد زیر را اسکن کنید و یا شماره موبایل خود را برای
              ارسال لینک وارد کنید.
            </p>
          </div>
          <div className={styles['qr__hedear__barcode']}>
            <Image src={QrBarcode} alt="دانلود 780 به وسیله qr" width="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Qr;
