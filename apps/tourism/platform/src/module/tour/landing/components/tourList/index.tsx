import React, { forwardRef, HTMLAttributes, useRef } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { NavigationOptions } from 'swiper/types';

import TourCard from '../tourCard';
import { TTourList } from 'services/tour/v2/hotTours/types';
import { useResponsive } from 'utils/hooks/useResponsive';

import { ArrowLeftPrimaryColor } from 'assets/icons';
import styles from '../../swiper.module.scss';
import router from 'next/router';

interface TourListProps {
  list: TTourList;
}

const NextNavigationElement = forwardRef<HTMLDivElement>(function NextNavigationElement(
  props: HTMLAttributes<HTMLDivElement>,
  ref,
) {
  return (
    <div ref={ref} {...props} className={styles['swiper__navigate-next']}>
      <ArrowLeftPrimaryColor style={{ transform: 'scale(1.5)' }} />
    </div>
  );
});

export const TourList: React.FC<TourListProps> = ({ list }) => {
  const { isMobile } = useResponsive();
  const nextEl = useRef<HTMLDivElement>(null);
  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row justify-content-between align-items-center pb-4 pt-5">
        <div className="fs-6 text-weight-700">{list.title}</div>
        <div
          onClick={() => router.push(`/tour/-?type=${list?.type}`)}
          className="d-flex flex-row justify-content-center align-items-center cursor-pointer"
        >
          <div className="ps-2 fs-4 text-weight-700 color-primary-surface">مشاهده همه</div>
          <ArrowLeftPrimaryColor />
        </div>
      </div>

      <div className="position-relative mx-n3">
        {!isMobile && <NextNavigationElement ref={nextEl} />}
        <Swiper
          spaceBetween={10}
          slidesPerView={'auto'}
          watchOverflow={true}
          modules={[Pagination, Navigation]}
          onBeforeInit={(swiper) => {
            (swiper.params.navigation as NavigationOptions).nextEl = nextEl.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          navigation={{
            nextEl: nextEl.current,
            disabledClass: styles['swiper__navigate-next--disabled'],
          }}
        >
          {list?.trips?.map((trip, tripIndex) => (
            <SwiperSlide key={tripIndex} style={{ width: '280px' }}>
              <TourCard trip={trip} type={list.type as string} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
