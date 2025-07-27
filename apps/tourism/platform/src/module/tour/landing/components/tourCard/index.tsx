import React from 'react';
import Image from 'next/image';

import { customLoader } from 'utils/helpers/imageLoader';
import { TTourTripList } from 'services/tour/v2/hotTours/types';

import { ArrowLeftPrimaryColor } from 'assets/icons';
import router from 'next/router';

interface TourCardProps {
  trip: TTourTripList;
  type: string;
}

const TourCard: React.FC<TourCardProps> = ({ trip, type }) => {
  return (
    <div className="d-flex flex-column card mx-2 rounded-4">
      <Image
        className="rounded-top"
        loader={customLoader}
        src={trip?.image as string}
        alt="trip cover"
        width={250}
        height={147}
        quality={100}
        unoptimized
      />
      <div
        className="px-3 pt-2 cursor-pointer"
        onClick={() =>
          router.replace({
            pathname: `/tour/${trip?.location?.englishName}`,
            query: { type: type, destinationName: trip.location?.persianName },
          })
        }
      >
        <div className="d-flex flex-row justify-content-between fs-2 pb-2">
          <div className="fs-4 fw-500">{trip?.title}</div>
        </div>
        <div className="d-flex flex-row justify-content-between py-2">
          <div className="d-flex flex-column">
            <div className="color-grey-1 pb-2 fw-500 fs-2">شروع قیمت از</div>
            <div className="fw-500">{Number(trip?.basePrice).toLocaleString()} ریال</div>
          </div>
          <div className="d-flex justify-content-center align-items-end color-blue-light-6 fs-3">
            <div className="d-flex flex-row justify-content-center align-items-center">
              <div className="ps-2">جزئیات</div>
              <ArrowLeftPrimaryColor />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
