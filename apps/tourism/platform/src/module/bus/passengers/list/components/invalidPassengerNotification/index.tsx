import { InfoIcon } from 'assets/icons';
import cn from 'classnames';
import Button from 'components/button';
import Divider from 'components/divider';
import styles from './style.module.scss';

type TProps = {
  onClose: () => void;
  onConfirm: () => void;
};
const InvalidPassengerNotification = (props: TProps) => {
  return (
    <>
      <div className={styles['modal-info']}>
        <div className="d-flex">
          <div>
            <InfoIcon />
          </div>

          <span className="pe-2">
            اطلاعات مسافر انتخاب شده کامل نمی‌باشد. برای انتخاب این مسافر ، لطفا اطلاعات را ویرایش
            یا تکمیل نمایید.
          </span>
        </div>
        <Divider type="horizontal" />
        <div className="d-flex justify-content-end mt-2">
          <Button
            radius
            className={cn(styles['modal-info__cancel-btn'], 'px-2 px-md-5')}
            btnType="button"
            onClick={props.onClose}
          >
            انصراف
          </Button>
          <Button
            radius
            className="btn btn-primary me-2 px-3 px-md-5"
            btnType="button"
            onClick={props.onConfirm}
          >
            ویرایش اطلاعات مسافر
          </Button>
        </div>
      </div>
    </>
  );
};

export { InvalidPassengerNotification };
