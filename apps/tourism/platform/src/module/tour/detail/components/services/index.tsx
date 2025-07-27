import { TTourServices } from 'services/tour/v2/detail/types';
import Image from 'next/image';
import React, { forwardRef } from 'react';
import cn from 'classnames';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import Skeleton from 'components/skeleton';

const Services = forwardRef<HTMLDivElement, { serviceData: TTourServices; isLoading: boolean }>(
  ({ serviceData, isLoading }, ref) => {
    const { isMobile } = useDeviceDetect();

    return (
      <>
        {isLoading ? (
          <Skeleton uniqueKey={'dcd'} type={'tourPdpService'} width="100%" />
        ) : (
          <div
            ref={ref}
            dir={'rtl'}
            className={cn('card p-3', !isMobile && 'bg-color-on-surface-fixed')}
          >
            <div>
              <div className="text-weight-700 fs-4">خدمات تور</div>
              <div className="row pt-3">
                {serviceData?.map((service, index) => {
                  return (
                    <div key={index} className="col-lg-6 col-sm-6 pt-2">
                      <div className="d-flex flex-row">
                        <div>
                          <Image
                            className="rounded-bottom"
                            src={service.icon as string}
                            alt="success"
                            width={24}
                            height={24}
                            unoptimized
                          />
                        </div>
                        <div className="px-3 text-weight-400 fs-3">{service.name}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);
Services.displayName = 'Services';

export default Services;
