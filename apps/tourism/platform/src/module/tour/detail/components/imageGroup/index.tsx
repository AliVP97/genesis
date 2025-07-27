import styles from './imageGroup.module.scss';
import Image from 'next/image';
import React from 'react';
import { TourDefaultBanner } from 'assets/images';

interface IProps {
  images: Array<string>;
  setVisibleGalleryModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export const TourDetailGallery = (props: IProps) => {
  const { images, setVisibleGalleryModal } = props;
  const bigImageIndex = images && images?.length > 5 ? 4 : 0;
  return (
    <div className="row">
      <div className="col-3 pt-1 cursor-pointer" onClick={() => setVisibleGalleryModal(true)}>
        {images?.slice(0, 3)?.map((ele, index) => {
          return (
            <div key={index.toString() + ele} className={styles.item}>
              <Image
                className={styles['parent-big-image']}
                src={`${ele || TourDefaultBanner} `}
                // layout="fill"
                alt="no filter found"
                width="1140"
                height="618"
                unoptimized
              />
              {index == 2 && images?.length ? (
                <div className={styles.slideNext}>
                  <div className={styles['counter-image']}>{`+${images?.length}`}</div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="col-9 cursor-pointer " onClick={() => setVisibleGalleryModal(true)}>
        <div className="pt-1">
          {images?.length ? (
            <Image
              className={styles['parent-big-image']}
              // loader={() => hotel?.details?.images[0]}
              src={`${images[bigImageIndex]}`}
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
