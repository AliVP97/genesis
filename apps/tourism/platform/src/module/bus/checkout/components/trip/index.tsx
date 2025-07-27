import useTimeConvertor from 'utils/hooks/useTimeConvertor';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import { TBusOrder } from 'services/bus/order/interface';

export const TripItem = ({ type, data }: { type: string; data?: TBusOrder }) => {
  const departureDate = useTimeConvertor(data?.busInfo?.departureDate);

  return (
    <div>
      <span className="d-flex justify-content-center text-5 color-white text-weight-500">
        {data?.busInfo?.departureDateString} {departureDate.year}
        {type == 'toward' ? (
          <span className="ps-1">:رفت</span>
        ) : type == 'backward' ? (
          <span className="ps-1">:برگشت</span>
        ) : (
          ''
        )}
      </span>
      <div className="text-weight-500 text-8 color-white text-center text-weight-500">
        {data?.busInfo?.departureHourString}
      </div>
      <div className="d-flex">
        <div className="col d-flex flex-column text-align-center ps-5">
          <span className="text-3 d-block color-white text-start mb-1">
            {data?.busInfo?.destinationCity}
          </span>
          <span className="text-3 d-block color-white text-start">
            {data?.busInfo?.destinationStation}
          </span>
        </div>
        <div className="d-flex flex-column align-items-center justify-content-center col">
          <Image
            loader={customLoader}
            width={'48px'}
            height={'48px'}
            className="bg-color-white rounded-circle"
            quality={100}
            src={`${data?.busInfo?.logo}`}
            alt="bus"
            unoptimized
          />
        </div>

        <div className="d-flex flex-column text-align-end col pe-5">
          <span className="text-3 d-block color-white text-end mb-1">
            {data?.busInfo?.originCity}
          </span>
          <span className="text-3 d-block color-white text-end">
            {data?.busInfo?.originStation}
          </span>
        </div>
      </div>
      <div className="d-flex flex-column align-items-center mt-2">
        <span className="color-white text-2 mb-1">{data?.busInfo?.companyName}</span>
        <span className="color-white text-2">{data?.busInfo?.busType}</span>
      </div>
    </div>
  );
};
