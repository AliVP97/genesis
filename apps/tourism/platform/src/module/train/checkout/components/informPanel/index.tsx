import { FC } from 'react';

import styles from './styles.module.scss';
import { Info } from 'assets/icons';

const InformPanel: FC = () => {
  return (
    <div className={styles.container}>
      <Info className={styles.icon} />
      <p>
        لطفا تا انتهای سفر تصویر دیجیتال و یا چاپ کاغذی بلیط و کارت شناسایی معتبر را به همراه داشته
        باشید و در هنگام ثبت مشخصات دقت لازم را به عمل بیاورید. از عبور مسافرین بدون بلیط{' '}
        <b>(تصویر دیجیتال و یا چاپ کاغذی)</b> و یا دارای بلیط غیر همنام در هنگام کنترل بلیط در
        ایستگاه ممانعت جدی به عمل خواهد آمد.
      </p>
    </div>
  );
};

export default InformPanel;
