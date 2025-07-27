import Image from 'next/image';
import React, { forwardRef } from 'react';
import { TTourItinerary } from 'services/tour/v2/detail/types';
import cn from 'classnames';
import { TourDefaultBanner } from 'assets/images';
import Skeleton from 'components/skeleton';

const Itinerary = forwardRef<
  HTMLDivElement,
  {
    itineraryData: TTourItinerary;
    isMobile: boolean | undefined;
    isLoading: boolean;
  }
>(({ itineraryData, isMobile, isLoading }, ref) => {
  return (
    <>
      {isLoading ? (
        <Skeleton uniqueKey={'dcd'} type={'tourPdpService'} width="100%" className="pt-2" />
      ) : (
        <div ref={ref} dir="rtl" className={cn(isMobile && 'card p-3', 'mt-4')}>
          <div className="row">
            <div className="col-lg-6 col-sm-3">
              <div className="fs-4 text-weight-700 pb-2"> برنامه سفر</div>
              <div
                dangerouslySetInnerHTML={{ __html: itineraryData?.description as string }}
                className="ps-3 text-justify color-surface-fixed fs-3 text-weight-400 pb-3"
              />
            </div>
            <div className="col-lg-6 col-sm-9">
              <Image
                className="rounded-4"
                src={(itineraryData?.image as string) || TourDefaultBanner}
                alt="tourDefaultBanner"
                layout="responsive"
                objectFit="cover"
                width="470"
                height="200"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
});
Itinerary.displayName = 'Itinerary';
export default Itinerary;
