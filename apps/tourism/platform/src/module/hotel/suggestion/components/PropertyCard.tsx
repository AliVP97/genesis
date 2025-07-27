import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { TPropertyCardProps } from '../type';
import styles from '../suggestion.module.scss';
import cn from 'classnames';
import Image from 'next/image';
import { HotelSuggestionCircle, LeftChevron } from 'assets/images';
import { useRouter } from 'next/router';

export const SuggestionPropertyCard: React.FC<TPropertyCardProps> = ({
  image,
  title,
  price,
  priceAfterDiscount,
  tag,
  star,
  reviewCount,
  totalRate,
  requestId,
  uuid,
  hotelId,
  discountPercent,
}) => {
  const { push, query } = useRouter();
  const [imgSrc, setImgSrc] = useState(image);

  const handleImageError = () => {
    setImgSrc('https://website-cms.780.ir/uploads/780_Banner_f70d8ae32f.png');
  };
  return (
    <div
      onClick={() => {
        push({
          pathname: `/hotel/${query.id}/${uuid}`,
          query: { hotelId: hotelId, rooms: query?.rooms, requestId: requestId },
        });
      }}
      className={cn(styles['suggestion-card'], 'card border')}
    >
      <div>
        <span
          dir="ltr"
          className="fs-2 p-1 position-absolute"
          style={{
            position: 'absolute',
            top: '0.5rem',
            left: '0',
            backgroundColor: '#E9DDFF',
            color: '#23005C',
            borderEndEndRadius: '12px',
            borderStartEndRadius: '12px',
          }}
        >
          {tag}
        </span>
        <img
          onError={handleImageError}
          src={imgSrc}
          alt={title}
          className="card-img-top img-fluid"
          style={{
            height: '9rem',
            objectFit: 'cover',
            borderTopRightRadius: '0.7rem',
            borderTopLeftRadius: '0.7rem',
          }}
        />
      </div>
      <div className="px-2 py-2 ">
        <div dir="ltr" className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            {Number(totalRate) !== 0 && (
              <>
                <span className="text-warning">★</span>
                <span className=" small">{totalRate}</span>
                <span style={{ fontSize: 10 }} className="text-muted ml-2">
                  ({reviewCount})
                </span>
              </>
            )}
          </div>
          <div className="d-flex flex-column align-items-end">
            <h5 className=" text-end small fw-semibold text-dark">{title}</h5>
          </div>
        </div>
        <span className="float-end relative text-muted fs-1">{star} ستاره</span>

        <div dir="ltr" className="d-flex justify-content-between mt-4 align-items-center">
          <div className="d-flex flex-column ">
            <div className="d-flex align-items-center">
              {discountPercent != '0' && (
                <span dir="rtl" className="text-muted fs-2 text-decoration-line-through">
                  {Number(price ?? 0).toLocaleString()} ریال
                </span>
              )}

              {/* <p
                className="rounded-5 text-white m-1 fs-2 px-1 py-1"
                style={{ backgroundColor: '#B20784' }}
              >
                {discount} %
              </p> */}
            </div>
            <span className=" fs-3 text-right float-end ">
              {Number(priceAfterDiscount ?? 0).toLocaleString()} ریال
            </span>
          </div>
          <p className="text-muted relative fs-1 mt-4 small">قیمت هر شب</p>
        </div>
      </div>
    </div>
  );
};

type PropertyCarouselProps = {
  title: string;
  caption: string;
  properties: TPropertyCardProps[];
  isDesktop: boolean;
};

export const PropertyCarousel: React.FC<PropertyCarouselProps> = ({
  properties,
  title,
  caption,
  isDesktop,
}) => {
  return (
    <div className={cn(styles['suggestion-section'], '  ')}>
      {isDesktop ? (
        <div className="d-flex justify-content-between align-items-center">
          <Image
            width={500}
            height={100}
            style={{ position: 'relative' }}
            src={HotelSuggestionCircle}
          />
          <div className="d-flex flex-column align-items-end mx-4">
            <h5 className="fw-bold text-dark mt-3 text-end">{title}</h5>
            <p className="text-muted text-end">{caption}</p>
          </div>
        </div>
      ) : (
        <div style={{ marginRight: 29 }} className="d-flex justify-content-end">
          <div className="d-flex flex-column align-items-end">
            <h5 className="fw-bold text-dark mt-3 text-end">{title}</h5>
            <p className="text-muted text-end">{caption}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-5 p-2 mx-2">
        {isDesktop && (
          <div>
            <div
              className={cn(
                styles['hotel-suggestion-swiper-next-button'],
                'hotel-suggestion-swiper-next-button',
              )}
            >
              <LeftChevron />
            </div>
            <button
              className={cn(
                styles['hotel-suggestion-swiper-prev-button'],
                'hotel-suggestion-swiper-prev-button',
              )}
            >
              <LeftChevron style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        )}
        <Swiper
          style={{
            marginRight: 16,
            marginLeft: 16,
          }}
          dir="rtl"
          modules={[Navigation]}
          loop={false}
          draggable={true}
          breakpoints={{
            320: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: isDesktop ? 90 : -30 },
            576: { slidesPerView: 1.5, slidesPerGroup: 1, spaceBetween: isDesktop ? 90 : -45 },
            768: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: isDesktop ? 90 : -85 },
            992: { slidesPerView: 3, slidesPerGroup: 2, spaceBetween: isDesktop ? 90 : -45 },
            1200: { slidesPerView: 4, slidesPerGroup: 1, spaceBetween: isDesktop ? 90 : -45 },
            1400: { slidesPerView: 4, slidesPerGroup: 1, spaceBetween: isDesktop ? 90 : -45 },
            1920: { slidesPerView: 4, slidesPerGroup: 1, spaceBetween: isDesktop ? 90 : -45 },
          }}
          navigation={{
            nextEl: '.hotel-suggestion-swiper-next-button',
            prevEl: '.hotel-suggestion-swiper-prev-button',
            enabled: isDesktop ? true : false,
          }}
          pagination={false}
        >
          {properties.map((property, index) => (
            <SwiperSlide key={index}>
              <SuggestionPropertyCard {...property} />
            </SwiperSlide>
          ))}
          {isDesktop && <SwiperSlide />}
        </Swiper>
      </div>
    </div>
  );
};
