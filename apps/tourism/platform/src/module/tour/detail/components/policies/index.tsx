import cn from 'classnames';
import { TTourPDPCancellationPolicy } from 'services/tour/v2/detail/types';
import parse from 'html-react-parser';
import React from 'react';
import Skeleton from 'components/skeleton';

type TProps = {
  isMobile: boolean | undefined;
  policiesData: TTourPDPCancellationPolicy;
  isLoading: boolean;
};

const TourPolicies = React.forwardRef<HTMLDivElement, TProps>(
  ({ isMobile, policiesData, isLoading }, ref) => {
    if (isLoading) {
      return (
        <div ref={ref} className={cn(isMobile ? 'card px-3' : '', 'pt-3 mt-3')}>
          <Skeleton
            type="tourPdpService"
            uniqueKey="policies"
            height={isMobile ? '400px' : '600px'}
            width="100%"
          />
        </div>
      );
    }

    return (
      <div ref={ref} className={cn(isMobile ? 'card px-3' : '', 'pt-3 mt-3')}>
        <div dir="rtl" className="text-weight-700 fs-4">
          نکات و قوانین تور
        </div>
        <div dir={'rtl'} className={cn(!isMobile ? 'card px-3 pt-3 mt-3' : 'pt-2', '')}>
          <div className="row pe-3">
            <div className="col-6">
              {policiesData?.policies?.map((policy, index) => {
                return (
                  <div key={index} className={cn('p-3 border-bottom border-blue-grey')}>
                    <div className="color-on-surface text-weight-700 fs-3">{policy.title}</div>
                    <div className="color-on-surface text-weight-400 fs-3">{policy.subtitle}</div>
                  </div>
                );
              })}
            </div>
            <div className="col-lg-6 pt-3">
              <div
                dir={'rtl'}
                className="ps-3 text-justify color-surface-fixed fs-3 text-weight-400 pb-3"
              >
                {parse(String(policiesData?.description))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

TourPolicies.displayName = 'TourPolicies';

export default TourPolicies;
