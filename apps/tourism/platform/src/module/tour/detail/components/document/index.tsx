import { TRequirementDocuments } from 'services/tour/v2/detail/types';
import cn from 'classnames';
import React, { forwardRef } from 'react';
import Skeleton from '../../../../../components/skeleton';

const TourDocument = forwardRef<
  HTMLDivElement,
  {
    documentData: TRequirementDocuments;
    isMobile: boolean | undefined;
    isLoading: boolean;
  }
>(({ documentData, isMobile, isLoading }, ref) => {
  return (
    <div ref={ref} className={cn(isMobile ? 'card px-3' : '', 'pt-3  mt-3')}>
      <div dir="rtl" className="text-weight-700 fs-4">
        مدارک مورد نیاز تور
      </div>

      <div dir={'rtl'} className={cn(!isMobile ? 'card  px-3 pt-3 mt-3' : 'pt-2', '')}>
        <div className="row  pe-3">
          {documentData?.map((service: string, index: number) => {
            return (
              <ul key={index} className="col-lg-6 col-sm-6 d-flex align-items-center ">
                {isLoading ? (
                  <Skeleton
                    uniqueKey={'douc'}
                    type={'tourPdpTabBarItem'}
                    height={'15'}
                    width={100}
                  />
                ) : (
                  <li className=" text-weight-400 fs-3">{service}</li>
                )}
              </ul>
            );
          })}
        </div>
      </div>
    </div>
  );
});
TourDocument.displayName = 'TourDocument';

export default TourDocument;
