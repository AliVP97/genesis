import cn from 'classnames';
import Spinner from 'components/spinner';
import styles from '../../travels.module.scss';
type TravelTicketFooterProps = {
  downloadLoading: boolean;
  downloadTicket: () => void;
  refundTicket: () => void;
  isLoading: boolean;
  orderType?: string;
};

const getDownloadLabel = (type: string | undefined): string =>
  type === 'Hotel' ? 'دانلود واچر' : 'دانلود بلیط';

const getActionLabel = (type: string | undefined): string =>
  type === 'Tour' ? 'تماس با پشتیبانی' : 'استرداد';

const TravelTicketFooter = ({
  downloadTicket,
  refundTicket,
  downloadLoading,
  isLoading,
  orderType,
}: TravelTicketFooterProps) => {
  return (
    <>
      <div className=" w-100 d-flex flex-row justify-content-center text-3 text-weight-500 pt-3">
        <div onClick={downloadTicket}>
          {downloadLoading ? (
            <div className="p-2">
              <Spinner />
            </div>
          ) : (
            <span>{getDownloadLabel(orderType)}</span>
          )}
        </div>
        <div className={cn(styles['travels__ticket__vertical'], 'bg-color-grey-3')}></div>
        <div>
          <span className="color-tertiary text-center" onClick={refundTicket}>
            {isLoading ? (
              <div className="p-2">
                <Spinner />
              </div>
            ) : (
              <span>{getActionLabel(orderType)}</span>
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default TravelTicketFooter;
