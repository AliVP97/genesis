import { CSSProperties } from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import Skeleton from 'components/skeleton';
import { NextImage } from 'containers/landingPage/components/footer/components/main/components/nextImage';
import { usePromotionSlider } from 'services/tour/v2';
import { useResponsive } from 'utils/hooks/useResponsive';

import styles from './bannerSlider.module.scss';

export const PromotionSlider = () => {
  const { isMobile } = useResponsive();

  const { tourSliderData, isFetching, isLoading } = usePromotionSlider();

  if (isFetching || isLoading)
    return (
      <Skeleton
        className={styles.banner__swiper__loading}
        type="slider"
        uniqueKey="slider"
        width="100%"
        height="85%"
      />
    );

  return (
    <div className={styles.banner}>
      <Swiper
        style={
          {
            '--swiper-pagination-color': '#BD1A8D',
            '--swiper-pagination-bullet-inactive-color': '#ffffff',
            '--swiper-pagination-bullet-inactive-opacity': '.6',
            '--swiper-pagination-bullet-horizontal-gap': '3px',
          } as CSSProperties
        }
        id="banner-slider"
        spaceBetween={0}
        slidesPerView={1}
        className={styles.banner__swiper}
        pagination={{
          clickable: true,
          el: '.swiper-custom-pagination',
        }}
        modules={tourSliderData?.data?.length !== 1 ? [Pagination, Autoplay] : [Autoplay]}
        autoplay={tourSliderData?.data?.length !== 1 ? { delay: 4000 } : false}
        loop={tourSliderData?.data.length !== 1}
      >
        {tourSliderData?.data?.map((banner, index: number) => (
          <SwiperSlide key={index.toString() + banner.link}>
            <a href={banner?.link} className="cursor-pointer">
              <NextImage
                src={isMobile ? banner?.image : banner?.image}
                width={isMobile ? 336 : 1128}
                height={isMobile ? 160 : 350}
                alt={'swiper'}
                objectPosition="center"
                quality={100}
                priority
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        style={{ width: 'fit-content', marginInline: 'auto', marginTop: 8 }}
        className="swiper-custom-pagination"
      />
    </div>
  );
};
