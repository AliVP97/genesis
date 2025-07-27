import { TTrip } from 'services/domestic/orders/interface';
import { getTicketInfo } from './utility';
import TicketContentItem from './ticketContentItem';

type TravelTicketContentProps = {
  order: TTrip;
};

const TravelTicketContent = ({ order }: TravelTicketContentProps) => {
  return (
    <>
      <div className="d-flex flex-column text-3 justify-content-between border-bottom border-color-light py-2">
        {getTicketInfo(order).map((item, index) => (
          <TicketContentItem
            title={item.title}
            value={item.value}
            key={index.toString() + item.title}
          />
        ))}
      </div>
    </>
  );
};

export default TravelTicketContent;
