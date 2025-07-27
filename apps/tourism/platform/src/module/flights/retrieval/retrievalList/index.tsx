import classNames from 'classnames';
import Checkbox from 'components/checkbox';
import styles from './retrieval-list.module.scss';

interface Props {
  list: {
    firstName?: string;
    lastName?: string;
    passengerType?: string;
    price?: string;
  }[];
  returning: boolean;
  double: boolean;
  departureCity: string;
  arrivalCity?: string;
}

const RetrievalList = ({
  list,
  returning = false,
  double = false,
  arrivalCity,
  departureCity,
}: Props) => {
  return (
    <div className={styles['list']}>
      <div className={styles['list__header']}>
        <span>مسافران</span>
      </div>
      {list.map((el, idx) =>
        !double ? (
          <div key={idx} className={styles['list__block']}>
            <span className="text-3 p-2">{`${el.firstName} ${el.lastName}`}</span>
            <div className="p-2 d-flex align-items-center">
              <Checkbox checked={false} />
              <span className="color-grey-1">
                رفت: {departureCity} - {arrivalCity}
              </span>
              <span className="color-green-1 d-inline-block me-auto">استرداد شده</span>
            </div>
            <div className="p-2 d-flex justify-content-between">
              <span className="color-grey-1">مبلغ بلیط </span>
              <span className="color-grey-1">{el.price}</span>
            </div>
            <div className="p-2 d-flex justify-content-between">
              <span className="color-grey-1">مبلغ جریمه </span>
              <span className="color-grey-1">0</span>
            </div>
          </div>
        ) : (
          <>
            <div className={styles['list__block']} style={{ borderBottom: '1px dashed black' }}>
              <span className="text-3 p-2">{`${el.firstName} ${el.lastName}`}</span>
              <div className="p-2 d-flex align-items-center">
                {!returning && <Checkbox checked={false} />}
                <span className="color-grey-1">
                  رفت: {departureCity} - {arrivalCity}
                </span>
                <span className="color-green-1 d-inline-block me-auto">استرداد شده</span>
              </div>
              <div className="p-2 d-flex justify-content-between">
                <span className="color-grey-1">مبلغ بلیط </span>
                <span className="color-grey-1">{el.price}</span>
              </div>
              <div className="p-2 d-flex justify-content-between">
                <span className="color-grey-1">مبلغ جریمه </span>
                <span className="color-grey-1">0</span>
              </div>
            </div>
            <div className={classNames(styles['list__block'], styles['list__block--returning'])}>
              <div className="p-2 d-flex align-items-center">
                {returning && <Checkbox checked={false} />}
                <span className="color-grey-1">
                  برگشت: {departureCity} - {arrivalCity}
                </span>
                <span className="color-green-1 d-inline-block me-auto">استرداد شده</span>
              </div>
              <div className="p-2 d-flex justify-content-between">
                <span className="color-grey-1">مبلغ بلیط </span>
                <span className="color-grey-1">{el.price}</span>
              </div>
              <div className="p-2 d-flex justify-content-between">
                <span className="color-grey-1">مبلغ جریمه </span>
                <span className="color-grey-1">0</span>
              </div>
            </div>
          </>
        ),
      )}
    </div>
  );
};

export default RetrievalList;
