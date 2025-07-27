import { TTrip } from 'services/trips/types';
import TravelTrainInfo from '../../info/train';
import TicketDetailsItem from '../ticketItem';
import style from '../../../travels.module.scss';

type TrainTicketProps = {
  details: TTrip;
};

const TrainTicket = ({ details }: TrainTicketProps) => {
  const trainReturn = details?.trainDetails!.trips!.length > 1;
  const trainDetails = details?.trainDetails?.trips![0];
  const trainReturnDetails = details?.trainDetails?.trips![1];
  return (
    <>
      <>
        <TicketDetailsItem
          title={`${trainDetails?.trainInfo?.originName} - ${trainDetails?.trainInfo?.destinationName}`}
          details={details}
          passengersCount={trainDetails?.tickets ? trainDetails?.tickets.length : 0}
        >
          <TravelTrainInfo
            info={{
              line: `${trainDetails?.trainInfo?.originName} - ${trainDetails?.trainInfo?.destinationName}`,
              company: `${trainDetails?.trainInfo?.companyName}`,
              date: `${trainDetails?.trainInfo?.departureFullDateString}`,
              serialNumber: `${trainDetails?.trainInfo?.trackingId || '--'}`,
              trainNo: `${trainDetails?.trainInfo?.trainNumber}`,
              return: false,
            }}
          />
        </TicketDetailsItem>
        <div className={style['price']}>
          <span className="col-6">{trainReturn ? 'مجموع قیمت رفت' : 'مجموع قیمت'}</span>
          <span className="col-6 text-4 color-primary text-start">
            {Number(trainDetails?.tickets![0].price).toLocaleString()} تومان
          </span>
        </div>
        {trainReturn && (
          <>
            <TicketDetailsItem
              title={`${trainReturnDetails?.trainInfo?.originName} - ${trainReturnDetails?.trainInfo?.destinationName}`}
              details={details}
              passengersCount={trainReturnDetails?.tickets ? trainReturnDetails?.tickets.length : 0}
            >
              <TravelTrainInfo
                info={{
                  line: `${trainReturnDetails?.trainInfo?.originName} - ${trainReturnDetails?.trainInfo?.destinationName}`,
                  company: `${trainReturnDetails?.trainInfo?.companyName}`,
                  date: `${trainReturnDetails?.trainInfo?.departureDateHourString}`,
                  trainNo: `${trainReturnDetails?.trainInfo?.trainNumber}`,
                  serialNumber: `${trainReturnDetails?.trainInfo?.trackingId || '--'}`,
                  return: true,
                }}
              />
            </TicketDetailsItem>
            <div className={style['price']}>
              <span className="col-6">مجموع قیمت برگشت </span>
              <span className="col-6 text-4 color-primary text-start">
                {Number(trainReturnDetails?.tickets![0].price).toLocaleString()} تومان
              </span>
            </div>
          </>
        )}
      </>
    </>
  );
};

export default TrainTicket;
