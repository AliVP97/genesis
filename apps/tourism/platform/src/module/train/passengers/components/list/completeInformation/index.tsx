import { InfoIcon } from 'assets/icons';
import cn from 'classnames';
import Button from 'components/button';
import Divider from 'components/divider';
import styles from '../list.module.scss';

type TCompleteInformationProps = {
  fullName: string;
  close: () => void;
  openEditFrom: (e: boolean) => void;
};
const CompleteInformation = ({ fullName, close, openEditFrom }: TCompleteInformationProps) => {
  const handleClick = () => {
    close();
    openEditFrom(true);
  };
  return (
    <>
      <div className={styles['modal-info']}>
        <div className="d-flex">
          <div>
            <InfoIcon />
          </div>

          <span className="pe-2">
            اطلاعات مسافر زیر کامل نمیباشد.لطفا برای انتخاب این مسافر، اطلاعات را ویرایش یا تکمیل
            نمایید.
          </span>
        </div>
        <div className="my-3">{fullName}</div>
        <Divider type="horizontal" />
        <div className="d-flex justify-content-end mt-2">
          <Button
            radius
            className={cn(styles['modal-info__cancel-btn'], 'px-2 px-md-5')}
            btnType="button"
            onClick={close}
          >
            انصراف
          </Button>
          <Button
            radius
            className="btn btn-primary me-2 px-3 px-md-5"
            btnType="button"
            onClick={handleClick}
          >
            ویرایش اطلاعات مسافر
          </Button>
        </div>
      </div>
    </>
  );
};

export default CompleteInformation;
