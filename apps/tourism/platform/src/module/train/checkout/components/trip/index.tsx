import useTimeConvertor from 'utils/hooks/useTimeConvertor';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import { TrainTrips } from 'services/train/orders/interface';
import { PersianWagonType } from 'module/train/tickets/interface';

export const TripItem = ({ type, data }: { type: string; data?: TrainTrips }) => {
  const departureDate = useTimeConvertor(data?.trainInfo?.departureDate);
  return (
    <div>
      <span className="d-flex justify-content-center text-4 color-white text-weight-500">
        {data?.trainInfo?.departureDateString}
        {departureDate.year}
        {type == 'toward' ? (
          <span className="ps-1">:رفت</span>
        ) : type == 'backward' ? (
          <span className="ps-1">:برگشت</span>
        ) : (
          ''
        )}
      </span>
      <div className="d-flex align-items-center justify-content-evenly ">
        <div className="d-flex flex-column align-items-center">
          <span className="text-3 d-block color-white">{data?.trainInfo?.destinationName}</span>
          <span className="text-weight-500 text-6 color-white">
            {data?.trainInfo?.arrivalDateHourString}
          </span>
        </div>
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex align-items-center">
            <Image
              loader={customLoader}
              width={'48px'}
              height={'48px'}
              className="bg-color-white rounded-circle"
              quality={100}
              src={`${data?.trainInfo?.logoUrl}`}
              alt="train"
              unoptimized
            />
          </div>
        </div>
        <div className="d-flex flex-column align-items-center">
          <span className="text-3 d-block color-white text-end">{data?.trainInfo?.originName}</span>
          <span className="text-weight-500 text-6 color-white">
            {data?.trainInfo?.departureDateHourString}
          </span>
        </div>
      </div>
      <div className="d-flex flex-column align-items-center">
        <span className="color-white text-2">{data?.trainInfo?.wagonName} </span>
        <span className="text-2 color-white d-block">
          {data?.trainInfo?.wagonType && PersianWagonType[data?.trainInfo?.wagonType]}
        </span>
      </div>
    </div>
  );
};
