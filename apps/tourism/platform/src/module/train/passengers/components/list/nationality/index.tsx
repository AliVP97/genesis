import { InfoIcon } from 'assets/icons';
import Button from 'components/button';
import Divider from 'components/divider';
import { Dispatch, SetStateAction } from 'react';
import styles from '../list.module.scss';

type TCompleteInformationProps = {
  close: Dispatch<SetStateAction<boolean>>;
};
const Nationality = ({ close }: TCompleteInformationProps) => {
  return (
    <>
      <div className={styles['modal-info']}>
        <div className="mb-3">
          <div className="d-flex">
            <InfoIcon />
            <p className="pe-2">مسافر گرامی،</p>
          </div>

          <span className="pe-2">
            بنابر قوانین راه‌آهن جمهوری اسلامی، خرید بلیط برای مسافران با اتباع غیر ایرانی
            امکان‌پذیر نمی‌باشد.
          </span>
        </div>

        <Divider type="horizontal" />
        <div className="d-flex justify-content-end mt-2">
          <Button
            radius
            className="btn btn-primary me-2 px-3 px-md-5"
            btnType="button"
            onClick={() => close(false)}
          >
            متوجه شدم
          </Button>
        </div>
      </div>
    </>
  );
};

export default Nationality;
