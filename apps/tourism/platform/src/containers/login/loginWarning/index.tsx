import { ArrowLeftIcon } from 'assets/icons';
import styles from 'module/flights/passengers/list/passengerList.module.scss';

const LoginWarning = ({ openLogin }: { openLogin: () => void }) => {
  return (
    <div className={styles['passengerList__warning']}>
      <div className={styles['passengerList__warning--title']}>
        <div>
          <ArrowLeftIcon />
        </div>
        <span>
          برای انتخاب مسافران از لیست ذخیره شده قبلی خود، لطفا به حساب کاربری خود وارد شوید.
        </span>
      </div>
      <div onClick={openLogin} className={styles['passengerList__warning--btn']}>
        <span>ورود به حساب کاربری</span>
        <ArrowLeftIcon />
      </div>
    </div>
  );
};

export default LoginWarning;
