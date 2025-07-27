import { EmptyDelete } from 'assets/icons';
import cn from 'classnames';
import Button from 'components/button';
import Divider from 'components/divider';
import UseRemovePassenger from 'module/internationalFlight/passenger/hooks/useRemovePassenger';
import styles from '../list.module.scss';

type TRemovePassengerProps = {
  fullName: string;
  id: string;
  close: () => void;
  getPassengers: () => void;
};

const RemovePassenger = ({ fullName, id, getPassengers, close }: TRemovePassengerProps) => {
  const { isLoading, removePassenger } = UseRemovePassenger(getPassengers, close);
  return (
    <>
      <div className={styles['modal-info']}>
        <div className="d-flex">
          <EmptyDelete />
          <span className="pe-2">آیا مسافر زیر حذف شود ؟</span>
        </div>
        <div className="my-3">{fullName}</div>
        <Divider type="horizontal" />
        <div className="d-flex justify-content-end mt-2">
          <Button
            radius
            className={cn(styles['modal-info__cancel-btn'], 'px-4 px-md-5')}
            btnType="button"
            onClick={close}
          >
            انصراف
          </Button>
          <Button
            radius
            className="btn btn-primary me-2 px-4 px-md-5"
            btnType="button"
            onClick={() => removePassenger(id)}
            disabled={isLoading}
            loading={isLoading}
          >
            حذف شود
          </Button>
        </div>
      </div>
    </>
  );
};

export default RemovePassenger;
