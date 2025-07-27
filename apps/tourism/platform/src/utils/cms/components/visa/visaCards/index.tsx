import Image from 'next/image';
import Button from 'components/button';
import { ChevronLeftIcon } from 'assets/icons';
import styles from '../styles/visaLanding.module.scss';
import { useRouter } from 'next/router';
import { VisaTracking } from 'utils/ecommerce/application/mappers/visa/events';
import { IVisa } from 'utils/ecommerce/application/mappers/visa/types';
import { FC } from 'react';
import { VisaCardProps } from '../visaLandingHero/types';

const VisaCards: FC<VisaCardProps> = ({ title, flag, background, link }) => {
  const { push } = useRouter();
  const visatracking = new VisaTracking();
  const visaObject: IVisa = { visaTitle: title, brand: link };
  return (
    <div
      className={styles['visa-container__visa-section']}
      style={{
        backgroundImage: `url(${background?.url})`,
        backgroundPosition: 'center',
        backgroundPositionY: -240,
      }}
    >
      <div className={styles['visa-container__visa-section__content']}>
        <div className={styles['visa-container__visa-section__content__title']}>
          <Image className="rounded-2" src={flag?.url} alt="visa" width={80} height={50} />
          <span>{title}</span>
        </div>
        <div>
          <Button
            className={styles['visa-container__visa-section__button']}
            onClick={() => {
              visatracking.selectItem(visaObject);
              push(link);
            }}
          >
            درخواست ویزا
            <ChevronLeftIcon className={styles['visa-container__visa-section__button__svg']} />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default VisaCards;
