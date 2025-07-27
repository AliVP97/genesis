import cn from 'classnames';
import { DescriptionType } from 'containers/landingPage/types';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import { customLoader } from 'utils/helpers/imageLoader';
import styles from './tripDescription.module.scss';

type TripDecriptionProps = {
  image: StaticImageData;
  description: string;
  dir: DescriptionType;
};

const TripDecription = ({ image, description, dir }: TripDecriptionProps) => {
  return (
    <>
      <div
        className={cn(
          styles['trip-landingDetails'],
          dir === 'ltr' && styles['trip-landingDetails--left'],
        )}
      >
        <div className={cn(styles['trip-description__image'])}>
          <Image
            loader={customLoader}
            src={image}
            alt={description}
            layout="fill"
            objectFit="cover"
            width=""
            unoptimized
          />
        </div>
        <div className={cn(styles['trip-description__text'])}>
          <span> {description}</span>
        </div>
      </div>
    </>
  );
};

export default TripDecription;
