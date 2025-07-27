import cn from 'classnames';
import styles from './selected-ticket.module.scss';
import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { LeftArrowIcon } from 'assets/icons';
import SelectedTicketItem from 'module/train/tickets/components/SelectedTicketItem';
import { customLoader } from 'utils/helpers/imageLoader';
import { TicketType } from '../../interface';
import { TrainOrder } from 'services/train/orders/interface';

interface Props {
  selectedTicket: TicketType;
  handleChangeTowardTicket: () => void;
  scroll?: boolean;
  isMobile: boolean;
  isReturn?: boolean;
  order?: TrainOrder;
}

const SelectedTicket: FC<Props> = ({
  selectedTicket,
  handleChangeTowardTicket,
  isMobile,
  order,
  isReturn,
}) => {
  const [showTicketDetail, setShowTicketDetail] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShowTicketDetail(false);
      } else {
        setShowTicketDetail(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return isMobile ? (
    <div
      className={cn(
        styles['selected-ticket'],
        'container bg-color-blue-grey text-3 px-4 py-3 text-weight-bold',
      )}
    >
      <div className="row " style={{ height: '32px' }}>
        <div className="col-2">رفت</div>
        <div className="col-7">
          {`${selectedTicket.originName} به ${selectedTicket.destinationName} `}
          <span className="px-1">{selectedTicket.departureDateString}</span>
        </div>
        <div className="col-3 text-start">
          <span className="text-primary" onClick={handleChangeTowardTicket}>
            تغییر رفت
          </span>
        </div>
      </div>
      {showTicketDetail ? (
        <>
          <div className="row align-items-center">
            <div className="col-2 text-end px-2">
              <Image
                loader={customLoader}
                src={`${selectedTicket.logoUrl}`}
                alt="airline logo"
                width="32px"
                height="32px"
                quality={100}
                unoptimized
              />
            </div>
            <div className="col-7">
              <span>{selectedTicket?.departureDateHourString}</span>
              <LeftArrowIcon />
              <span>{selectedTicket.arrivalDateHourString}</span>
            </div>
          </div>
          <div className="row ">
            <div className="col-2">قطار</div>
            <div className="col-7 color-grey-1 text-2">{selectedTicket.wagonName}</div>
          </div>
        </>
      ) : null}
    </div>
  ) : (
    <SelectedTicketItem
      ticket={selectedTicket}
      onChangeTowardTicket={handleChangeTowardTicket}
      isReturn={isReturn}
      order={order}
    />
  );
};

export default SelectedTicket;
