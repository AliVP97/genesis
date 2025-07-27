import { AirplaneTicket } from 'assets/icons';
import { useAppSelector } from 'store/hook/storeHook';
import { selectRefundItinerary } from 'store/slices/internationalFlight/selectors/refund';
import { RefundItinerary } from '../types/api';
import Card from './Card';
import styles from './FlightDetails.module.scss';
import classNames from 'classnames';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

const getText = (itinerary: RefundItinerary) =>
  `${itinerary.origin?.description ?? ''} - ${itinerary.destination?.description ?? ''}`;

const FlightDetails = () => {
  const itinerary = useAppSelector(selectRefundItinerary);
  const flightTitle = getText(itinerary);
  const airlineName = itinerary.airline?.name ?? '';
  const dateTime = itinerary.flightDateTime?.split(' ').join(' - ') ?? '';
  const { isMobile } = useDeviceDetect();

  return (
    <>
      {isMobile && (
        <Card title={flightTitle} avatar={<AirplaneTicket />}>
          <div className={styles['card-body']}>
            <div className="d-flex justify-content-between pt-2 pb-2">
              <span>شرکت هواپیمایی</span>
              <span>{airlineName}</span>
            </div>
            <div className="d-flex justify-content-between pt-2 pb-2">
              <span>تاریخ و ساعت حرکت</span>
              <span dir="auto">{dateTime}</span>
            </div>
          </div>
        </Card>
      )}
      {!isMobile && (
        <div className={classNames(styles['desktop-card'], 'd-flex justify-content-between')}>
          <div className="d-flex flex-column text-center w-100">
            <span className={classNames(styles['desktop-card-title'], 'fw-500')}>مسیر</span>
            <span className={styles['desktop-card-value']}>{flightTitle}</span>
          </div>
          <div className="d-flex flex-column text-center w-100">
            <span className={classNames(styles['desktop-card-title'], 'fw-500')}>
              شرکت هواپیمایی
            </span>
            <span className={styles['desktop-card-value']}>{airlineName}</span>
          </div>
          <div className="d-flex flex-column text-center w-100">
            <span className={classNames(styles['desktop-card-title'], 'fw-500')}>
              تاریخ و ساعت حرکت
            </span>
            <span className={styles['desktop-card-value']}>{dateTime}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default FlightDetails;
