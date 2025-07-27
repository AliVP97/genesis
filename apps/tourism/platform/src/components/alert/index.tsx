import React from 'react';
import styles from './alert.module.scss';
import cn from 'classnames';
import { HealthIcon, CovidIcon, MaskIcon, VaccineIcon, ArrowDownIcon } from 'assets/icons';

export const Alert = () => {
  const alertContent = [
    { icon: <MaskIcon />, title: 'استفاده الزامی از ماسک' },
    { icon: <CovidIcon />, title: 'تست کرونا در آزمایشگا‌های معتبر ایرلاین' },
    { icon: <VaccineIcon />, title: 'واکسینه شدن به طور کامل قبل از پرواز' },
  ];
  return (
    <div className={cn(styles['alert'], 'mt-3 d-flex flex-row-reverse ')}>
      <div className={cn(styles['alert__title'], 'd-flex align-items-center')}>
        <span>الزامات سفر در شرایط کرونا</span>
        <HealthIcon className={styles['alert__svgIcon']} />
      </div>
      <div className={cn(styles['alert__content'], 'd-flex')}>
        {alertContent.map((item, index) => (
          <div
            key={index.toString() + item.title}
            className={cn(styles['alert__contentItems'], 'd-flex')}
          >
            <span>{item.title}</span>
            <span className={styles['alert__icons']}>{item.icon}</span>
          </div>
        ))}
      </div>
      <div className={cn(styles['alert__rules'], 'd-flex align-items-center')}>
        <ArrowDownIcon />
        <span>مشاهده قوانین متفاوت هر ایرلاین</span>
      </div>
    </div>
  );
};
