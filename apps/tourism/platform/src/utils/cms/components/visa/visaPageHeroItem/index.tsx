import { FC } from 'react';
import styles from '../styles/visaPage.module.scss';
import cn from 'classnames';
import { VisaPageHeroItemsProps } from '../visaPageHero/types';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import Image from 'next/image';

const VisaPageHeroItem: FC<VisaPageHeroItemsProps> = ({ title, description, image }) => {
  const { isMobile } = useDeviceDetect();
  return (
    <div className="col-md-12 col-lg-6">
      <div className="bg-color-surface-container rounded-4 d-flex justify-content-lg-center justify-content-start align-items-center py-2 mb-2 pe-3 pe-lg-0">
        <div className={styles['visa-detail-container__icon']}>
          <Image src={image?.url ?? ''} alt="image image" width={49} height={49} />
        </div>
        <div className="d-flex flex-column align-items-start pe-2">
          <span className={cn('color-on-surface', isMobile ? 'fs-3' : 'fs-5 pb-1')}>{title}</span>
          <span className={cn('color-on-surface-var', isMobile ? 'fs-2' : 'fs-3')}>
            {description}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VisaPageHeroItem;
