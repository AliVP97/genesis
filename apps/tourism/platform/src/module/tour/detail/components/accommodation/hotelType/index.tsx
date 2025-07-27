import Image from 'next/image';
import cn from 'classnames';
import { ArrowDownIcon, Star } from 'assets/icons';
import Button from 'components/button';
import style from '../accommodation.module.scss';
import React, { useState } from 'react';
import { TTourPDPAccommodation } from 'services/tour/v2/detail/types';
import { TourDefaultBanner } from 'assets/images';
import router, { useRouter } from 'next/router';
import Slider from 'components/slider';

const HotelAccommodation = ({
  accommodationData,
  isMobile,
}: {
  accommodationData: TTourPDPAccommodation;
  isMobile: boolean | undefined;
}) => {
  const [showAll, setShowAll] = useState(false);
  const { query } = useRouter();

  const itemsToShow = showAll ? accommodationData?.data : accommodationData?.data?.slice(0, 4);

  const isShowAllHotel = accommodationData?.data && accommodationData?.data?.length > 4 && !showAll;

  const handleGoToCheckOut = (packageDateId: string) => {
    router.push(
      `/tour/checkout/${packageDateId}${query?.requestId ? `?requestId=${query?.requestId}` : ''}`,
    );
  };
  return (
    <div dir="rtl">
      {itemsToShow?.map((accommodation, index) => (
        <div className="card p-2 mb-3" key={index}>
          <div dir="rtl" className="row">
            {isMobile ? (
              <div className="col-3">
                <Image
                  className="rounded-bottom"
                  src={(accommodation?.image as string) || TourDefaultBanner}
                  alt="package"
                  width={400}
                  height={400}
                  layout="responsive"
                  objectFit="cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="col-3" key={index}>
                <Slider
                  startPos="ltr"
                  images={accommodation?.images as Array<string>}
                  title={''}
                  dots={false}
                />
              </div>
            )}

            <div className="col-9">
              <div className="col-12 d-flex flex-row justify-content-between">
                <div className="d-flex flex-column">
                  <div
                    className={cn(
                      'fs-4 text-weight-700 d-flex',
                      isMobile ? 'flex-column' : 'flex-row',
                    )}
                  >
                    <div className="ps-2">{accommodation?.name}</div>
                    <div>
                      {Array.from({ length: Number(accommodation?.star) }).map((x) => (
                        <Star key={x?.toString()} />
                      ))}
                    </div>
                  </div>
                  <div className="color-on-surface-var fs-3">{accommodation?.description}</div>
                </div>
                <div>
                  <Button
                    onClick={() => handleGoToCheckOut(accommodation?.packageDateId as string)}
                    className="btn btn-primary rounded-5"
                  >
                    <div className="px-3">انتخاب</div>
                  </Button>
                </div>
              </div>
              {!isMobile && (
                <div className="col-12">
                  <div className="d-flex flex-row">
                    {accommodation.pricing?.map((price, key) => (
                      <div
                        className={cn(
                          style['border-left'],
                          'd-flex flex-column p-3 color-on-surface-var',
                        )}
                        key={key}
                      >
                        <div>{price.title}</div>
                        <div>
                          <span className="text-4 text-weight-500">
                            {price.price ? Number(price.price).toLocaleString() : 0}
                          </span>
                          <small> ریال</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {isMobile && (
            <div className="col-12 pt-2">
              {accommodation.pricing?.map((price, indexPrice) => (
                <div
                  dir={'rtl'}
                  className="d-flex flex-row justify-content-between align-items-center color-on-surface-var"
                  key={indexPrice}
                >
                  <div>{price.title}</div>
                  <div>
                    <span className="text-4 text-weight-500">
                      {price.price ? Number(price.price).toLocaleString() : 0}
                    </span>
                    <small> ریال</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {isShowAllHotel && (
        <div className="text-center mt-3">
          <div onClick={() => setShowAll(!showAll)}>
            <div className="p-3 d-flex flex-row justify-content-center align-items-center">
              <div className="color-primary">مشاهده همه اقامتگاه</div>
              <ArrowDownIcon fill="#105FAE" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelAccommodation;
