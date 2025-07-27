import { TTourPDPAccommodation } from 'services/tour/v2/detail/types';
import React, { forwardRef } from 'react';
import HotelAccommodation from './hotelType';
import CampAccommodation from './campType';
import Skeleton from 'components/skeleton';
const Accommodation = forwardRef<
  HTMLDivElement,
  {
    accommodationData: TTourPDPAccommodation;
    isMobile: boolean | undefined;
    isLoading?: boolean;
  }
>(({ accommodationData, isMobile, isLoading }, ref) => {
  const witchType = () => {
    if (isLoading) {
      return (
        <>
          {[1, 2, 3].map((_, i) => {
            return (
              <Skeleton
                type="tourTickets"
                key={i + 'tourSearch'}
                rtl
                className={'p-2'}
                uniqueKey="0"
                height="150"
                width="100%"
              />
            );
          })}
        </>
      );
    } else {
      switch (accommodationData?.type) {
        case 'HOTEL':
          return (
            <div ref={ref}>
              <HotelAccommodation accommodationData={accommodationData} isMobile={isMobile} />
            </div>
          );
        case 'CAMP':
          return (
            <div ref={ref}>
              <CampAccommodation accommodationData={accommodationData} isMobile={isMobile} />
            </div>
          );
        default:
          return null;
      }
    }
  };
  return <div dir="rtl">{witchType()}</div>;
});
Accommodation.displayName = 'Accommodation';

export default Accommodation;
