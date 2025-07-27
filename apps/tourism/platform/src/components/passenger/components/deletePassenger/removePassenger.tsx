import Button from 'components/button';
import Divider from 'components/divider';
import styles from './removePassenger.module.scss';
import useRemovePassenger from './useRemovePassenger';

type TRemovePassengerProps = {
  fullName: string;
  id: string;
  close: () => void;
};

const RemovePassenger = ({ fullName, id, close }: TRemovePassengerProps) => {
  const { isLoading, removePassenger } = useRemovePassenger(close);
  return (
    <>
      <div className={styles['container']}>
        <div className="text-3">{fullName}</div>

        <Divider type="horizontal" />
        <div>آیا از حذف این مسافر اطمینان دارید؟</div>
        <div className="d-flex justify-content-end mt-2">
          <Button className={styles['container__exitBtn']} btnType="button" onClick={close}>
            انصراف
          </Button>
          <Button
            className={styles['container__deleteBtn']}
            btnType="button"
            onClick={() => removePassenger({ id })}
            disabled={isLoading}
            loading={isLoading}
          >
            حذف
          </Button>
        </div>
      </div>
    </>
  );
};

export default RemovePassenger;
