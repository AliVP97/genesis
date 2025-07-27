import { FC } from 'react';
import { VisaConditionsProps } from './types';
import styles from '../styles/visaLanding.module.scss';
import VisaConditionsItem from '../visaConditionsItem';
import cn from 'classnames';
import VisaConditionsInfo from '../visaConditionsInfo';

const VisaConditions: FC<VisaConditionsProps> = ({ title, description, items, info }) => {
  return (
    <div dir="rtl" className={cn(styles['visa-container__visa-policy'], 'my-4')}>
      <h2 className="tex-right fs-5 fw-500 color-on-surface">{title}</h2>
      {description && <p className="mt-4 color-on-surface">{description}</p>}
      <div className={styles['visa-container__visa-policy__divider']} />
      {items?.map((item) => (
        <div key={item.title} className={styles['visa-container__visa-policy__list']}>
          <VisaConditionsItem
            title={item?.title}
            description={item?.description}
            image={item?.image}
          />
        </div>
      ))}
      {info && <VisaConditionsInfo info={info} />}
    </div>
  );
};

export default VisaConditions;
