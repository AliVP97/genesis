import styles from 'module/hotel/detail/details.module.scss';
import Image from 'next/image';
import React from 'react';
import { THotelInfo } from 'services/hotel/hotelsAndCities/interface';

interface IProps {
  hotel: THotelInfo;
  setVisibleGalleryModal: () => void;
}
export const HotelDetailGallery = (props: IProps) => {
  const { hotel, setVisibleGalleryModal } = props;
  const bigImageIndex = hotel?.details?.images && hotel?.details?.images?.length > 5 ? 4 : 0;
  return (
    <div className="row">
      <div className="col-3 pt-3 cursor-pointer" onClick={() => setVisibleGalleryModal()}>
        {hotel?.details?.images?.slice(0, 3)?.map((ele, index) => {
          return (
            <div key={index.toString() + ele} className={styles['item']}>
              <Image
                className={styles['parent-big-image']}
                // loader={() => hotel?.details?.images[0]}
                src={`${ele}`}
                // layout="fill"
                alt="no filter found"
                width="1140"
                height="611"
                unoptimized
              />
              {index == 2 && hotel?.details?.images?.length ? (
                <div className={styles['slideNext']}>
                  <div className={styles['counter-image']}>
                    {`+${hotel?.details?.images?.length}`}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="col-9 cursor-pointer " onClick={() => setVisibleGalleryModal()}>
        <div className="pt-3">
          {hotel?.details?.images?.length ? (
            <Image
              className={styles['parent-big-image']}
              // loader={() => hotel?.details?.images[0]}
              src={`${hotel?.details?.images[bigImageIndex]}`}
              // layout="fill"
              alt="no filter found"
              width="1140"
              height="611"
              unoptimized
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
