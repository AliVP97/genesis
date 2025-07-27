import { InfoIcon } from 'assets/icons';
import Button from 'components/button';
import Divider from 'components/divider';
import styles from './style.module.scss';

type TProps = {
  onConfirm: () => void;
};
const NationalityNotification = (props: TProps) => {
  return (
    <>
      <div className={styles['modal-info']}>
        <div className="mb-3">
          <div className="d-flex">
            <InfoIcon />
            <p className="pe-2">مسافر گرامی،</p>
          </div>

          <span className="pe-2">
            بنابر قوانین جمهوری اسلامی، خرید بلیط برای مسافران با اتباع غیر ایرانی امکان‌پذیر
            نمی‌باشد.
          </span>
        </div>

        <Divider type="horizontal" />
        <div className="d-flex justify-content-end mt-2">
          <Button
            radius
            className="btn btn-primary me-2 px-3 px-md-5"
            btnType="button"
            onClick={props.onConfirm}
          >
            متوجه شدم
          </Button>
        </div>
      </div>
    </>
  );
};

export { NationalityNotification };
