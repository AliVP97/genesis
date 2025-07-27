import Image from 'next/image';
import cn from 'classnames';
import styles from '../styles/visaLanding.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { VisaLandingHeroProps } from './types';
import { FC } from 'react';
import VisaCards from '../visaCards';

const VisaLandingHero: FC<VisaLandingHeroProps> = ({ title, cover, visaCards }) => {
  const { isMobile } = useDeviceDetect();
  return (
    <div dir="rtl" className="mb-2">
      <div className={cn(isMobile && 'mx-n3')}>
        {cover?.url && (
          <Image
            width={1920}
            height={528}
            className={styles['visa-container__banner']}
            src={cover?.url}
            alt="visa banner"
          />
        )}
      </div>
      <div className="container-lg">
        <div className={styles['visa-container__card']}>
          <h1 className={styles['visa-container__card__title']}>{title}</h1>
        </div>
        <div className="d-flex flex-column gap-4">
          {visaCards?.map((item) => {
            return (
              <VisaCards
                key={item?.id}
                title={item?.title}
                flag={item?.flag}
                link={item?.link}
                background={item?.background}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VisaLandingHero;
