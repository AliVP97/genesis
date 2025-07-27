import useTimeConvertor from 'utils/hooks/useTimeConvertor';
import Image from 'next/image';
import API from 'utils/routes/api';
import { customLoader } from 'utils/helpers/imageLoader';
import { OrderTicket } from 'services/domestic/flight/interface';
import defaultImage from 'public/images/default-domestic-flight.png';

const directionLabel = (type: string) => {
  switch (type) {
    case 'toward':
      return ':رفت';
    case 'backward':
      return ':برگشت';
    default:
      return null;
  }
};

const getFlightClassLabel = (ageType: string | undefined) => {
  switch (ageType) {
    case 'ECONOMY':
      return 'اکونومی';
    case 'BUSINESS':
      return 'بیزینس';
    default:
      return '';
  }
};

export const DetailItem = ({ type, data }: { type: string; data?: OrderTicket }) => {
  const departureDate = useTimeConvertor(data?.flightInfo?.departure?.date);

  return (
    <div>
      <span className="d-flex justify-content-center text-4 color-white text-weight-500">
        {data?.flightInfo?.departure?.dateString}
        {departureDate.year}
        {type && <span className="ps-1">{directionLabel(type)}</span>}
      </span>
      <div className="d-flex align-items-center justify-content-evenly ">
        <div>
          <span className="text-3 d-block color-white">
            {data?.flightInfo?.arrival?.airport?.city?.name?.farsi}
          </span>
          <span className="text-weight-500 text-6 color-white">
            {data?.flightInfo?.arrival?.dateHourString}
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
              src={
                data?.flightInfo?.airline?.code
                  ? API.IMAGE_DOMAIN + `airplane/${data?.flightInfo?.airline?.code}.svg`
                  : defaultImage
              }
              alt="airline"
              unoptimized
              objectFit="contain"
              onError={(e) => {
                e.currentTarget.src = defaultImage.src;
              }}
            />
          </div>
        </div>
        <div className="d-flex flex-column text-align-end">
          <span className="text-3 d-block color-white text-end">
            {data?.flightInfo?.departure?.airport?.city?.name?.farsi}
          </span>
          <span className="text-weight-500 text-6 color-white">
            {data?.flightInfo?.departure?.dateHourString}
          </span>
        </div>
      </div>
      <div className="d-flex flex-column align-items-center">
        <span className="color-white text-2">{data?.flightInfo?.airline?.name} </span>
        <span className="text-2 color-white d-block">
          {getFlightClassLabel(data?.flightInfo?.flightClass)}
          {data?.flightInfo?.airplaneModel && data?.flightInfo?.flightClass != 'UNDEFINED' && '-'}
          <span className="en">{data?.flightInfo?.airplaneModel}</span>
        </span>
      </div>
    </div>
  );
};
