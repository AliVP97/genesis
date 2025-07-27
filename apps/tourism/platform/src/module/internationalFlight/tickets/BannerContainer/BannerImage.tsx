import Image from 'next/image';
import cn from 'classnames';
import styles from './BannerImage.module.scss';
import { forwardRef } from 'react';

type BannerImageProps = {
  src: string;
  alt: string;
  height: number;
  width: number;
};

const BannerImage = forwardRef<HTMLDivElement, BannerImageProps>(
  ({ src, alt, height, width }, ref) => (
    <div className={cn('mb-3 overflow-hidden d-flex', styles.root)} ref={ref}>
      <Image
        src={src}
        alt={alt}
        height={height}
        width={width}
        layout="fixed"
        objectFit="cover"
        objectPosition={'center'}
        quality={100}
      />
    </div>
  ),
);

BannerImage.displayName = 'BannerImage';

export default BannerImage;
