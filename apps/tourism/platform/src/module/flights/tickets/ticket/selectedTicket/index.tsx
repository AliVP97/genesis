import cn from 'classnames';
import styles from './selected-ticket.module.scss';
import { TicketType } from 'module/flights/tickets/ticket/interface';
import { FC, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import API from 'utils/routes/api';
import useTimeConvertor from 'utils/hooks/useTimeConvertor';
import { LeftArrowIcon } from 'assets/icons';
import SelectedTicketItem from 'module/flights/tickets/ticket/SelectedTicketItem';
import { customLoader } from 'utils/helpers/imageLoader';
import defaultImage from 'public/images/default-domestic-flight.png';

interface Props {
  selectedTicket: TicketType;
  handleChangeTowardTicket: () => void;
  onShowTicketDetails?: (showTicketDetail: boolean) => void;
  isMobile: boolean;
}
const SelectedTicket: FC<Props> = ({
  selectedTicket,
  handleChangeTowardTicket,
  onShowTicketDetails,
  isMobile,
}) => {
  const { departure, arrival, airline, isCharter, airplaneModel, flightClass } = selectedTicket;
  const departureDate = useTimeConvertor(departure?.date?.toString());
  const arrivalDate = useTimeConvertor(arrival?.date?.toString());

  const [showTicketDetail, setShowTicketDetail] = useState(true);

  // Scroll handler
  const handleScroll = useCallback(() => {
    const shouldShowDetails = window.scrollY <= 10;
    setShowTicketDetail(shouldShowDetails);

    if (isMobile && onShowTicketDetails) {
      onShowTicketDetails(shouldShowDetails);
    }
  }, [isMobile, onShowTicketDetails]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Render ticket details for mobile view
  const renderMobileTicketDetails = () => (
    <div className="row align-items-center">
      <div className="col-2 text-center px-2">
        <Image
          src={airline?.code ? `${API.IMAGE_DOMAIN}airplane/${airline?.code}.svg` : defaultImage}
          alt="airline logo"
          width="32px"
          loader={customLoader}
          height="32px"
          unoptimized
          quality={100}
          objectFit="contain"
          onError={(e) => {
            e.currentTarget.src = defaultImage.src;
          }}
        />
      </div>
      <div className="col-7">
        <span>{departureDate.time}</span>
        <LeftArrowIcon />
        <span>{arrivalDate.time}</span>
      </div>
      <div className="col-3 text-center color-grey-1">{isCharter ? 'چارتر' : 'سیستمی'}</div>
    </div>
  );

  // Render ticket info for mobile view
  const renderMobileTicketInfo = () => (
    <div className="row ">
      <div className="col-9 d-flex">
        <div className="col-2 text-center">{airline?.name}</div>
        <div className="col-5 color-grey-1 px-4">{airplaneModel}</div>
      </div>
      <div className="col-3 text-center">
        <span className={styles['selected-ticket__is-charter']}>
          {flightClass === 'ECONOMY' ? 'اکونومی' : 'بیزینسی'}
        </span>
      </div>
    </div>
  );

  // Mobile View
  if (isMobile) {
    return (
      <div
        className={cn(
          styles['selected-ticket'],
          'container bg-color-blue-grey text-2 px-4 text-weight-bold py-3',
        )}
      >
        <div className="row" style={{ height: '32px' }}>
          <div className="col-2 text-center">رفت</div>
          <div className="col-7 d-flex">
            <span>
              {`${departure?.airport?.city?.name?.farsi} به ${arrival?.airport?.city?.name?.farsi}`}
            </span>
            <span className="px-3">
              {departureDate.dayName} {departureDate.date} {departureDate.month}
            </span>
          </div>
          <div className="col-3 text-center">
            <span className="text-primary" onClick={handleChangeTowardTicket}>
              تغییر رفت
            </span>
          </div>
        </div>

        {showTicketDetail && (
          <>
            {renderMobileTicketDetails()}
            {renderMobileTicketInfo()}
          </>
        )}
      </div>
    );
  }

  // Desktop View
  return (
    <SelectedTicketItem ticket={selectedTicket} onChangeTowardTicket={handleChangeTowardTicket} />
  );
};

export default SelectedTicket;
