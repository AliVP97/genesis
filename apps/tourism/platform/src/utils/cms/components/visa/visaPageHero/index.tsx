import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import styles from '../styles/visaPage.module.scss';
import cn from 'classnames';
import Image from 'next/image';
import { FC } from 'react';
import { VisaPageHeroProps } from './types';
import VisaPageHeroItem from '../visaPageHeroItem';

const VisaPageHero: FC<VisaPageHeroProps> = ({ title, flag, cover, items }) => {
  const { isMobile } = useDeviceDetect();
  return (
    <div dir="rtl" className="mb-2">
      <div className={cn(isMobile && 'mx-n3')}>
        <Image width={1920} height={528} src={cover?.url ?? ''} alt="visa" />
      </div>
      <div className="container-lg">
        <div className={cn(styles['visa-detail-container'])}>
          <div className={styles['visa-detail-container__title']}>
            <Image
              className="rounded-2 border border-2 border-outline-var"
              src={flag?.url ?? ''}
              alt="flag"
              width={90}
              height={50}
            />
            <h1 className={cn(isMobile ? 'fs-4 fw-500' : 'fs-5 fw-500')}>{title}</h1>
          </div>
          <div className={styles['visa-detail-container__divider']} />
          <div className="row mt-3">
            {items?.map((item) => {
              return (
                <VisaPageHeroItem
                  key={item?.title}
                  title={item?.title}
                  description={item?.description}
                  image={item?.image}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaPageHero;
