import { CustomOrderPassenger } from 'services/domestic/orders/interface';
import { DownloadIcon } from 'assets/icons';
import cn from 'classnames';
import Divider from 'components/divider';
import styles from '../reviewTicket.module.scss';
import ViewReceiptDesktop from './viewReceiptDesktop';
import Spinner from 'components/spinner';

interface Props {
  order: CustomOrderPassenger;
  downloadTicket: () => void;
  isLoading: boolean;
}

const ReviewTicketDesktop = ({ order, downloadTicket, isLoading }: Props) => {
  return (
    <div className={styles['reviewTicket--desktop']}>
      <div className="container ltr">
        <div className="d-flex justify-content-between align-items-center">
          <div className={cn(styles['reviewTicket--desktop__title'], 'text-center col-12')}>
            <div className="d-flex justify-content-end">
              <h5>
                {order?.[0].tickets?.[0].flightInfo?.departure?.airport?.city?.name?.farsi} -{' '}
                {order?.[0].tickets?.[0].flightInfo?.arrival?.airport?.city?.name?.farsi}
              </h5>
            </div>
          </div>
        </div>
        <Divider className={styles['reviewTicket--desktop__divider']} type="horizontal" />
      </div>
      {order?.map((item, index) => {
        return (
          <div key={index.toString() + item?.passenger?.firstname?.farsi} className="rtl">
            <div className={cn('d-flex m-0 px-3 pt-2 pb-3')}>
              <div
                className={cn(styles['reviewTicket--desktop__content__title'], 'col-9 text-end')}
              >
                <span>
                  {item?.passenger?.firstname?.farsi} {item?.passenger?.lastname?.farsi}
                </span>
              </div>
              <div className="col-3 text-start d-flex justify-content-end align-items-center">
                {/*<div>*/}
                {/*  <ShareIcon*/}
                {/*    className={cn(*/}
                {/*      styles['reviewTicket--desktop__content__share-icon'],*/}
                {/*      'ms-2',*/}
                {/*    )}*/}
                {/*  />*/}
                {/*  ارسال برای دیگران*/}
                {/*</div>*/}
                <div
                  onClick={downloadTicket}
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <>
                      <DownloadIcon
                        className={cn(
                          styles['reviewTicket--desktop__content__download-icon'],
                          'ms-2',
                        )}
                      />
                      دانلود بلیط
                    </>
                  )}
                </div>
              </div>
            </div>
            {item.tickets?.map((el, i) => (
              <ViewReceiptDesktop
                key={i}
                passenger={item.passenger!}
                detail={el}
                // returnFlag={item.return}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewTicketDesktop;
