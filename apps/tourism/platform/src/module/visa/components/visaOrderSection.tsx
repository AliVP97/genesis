import React from 'react';
import OrderVisaCard from '../containers/components/orderVisaCard';
import styles from 'utils/cms/components/visa/styles/visaPage.module.scss';
import { PhoneOutlined } from 'assets/icons';
import { HAFHASHTAD_TEL } from 'utils/static/global';

const VisaOrderSection = () => {
  return (
    <div dir="rtl" className="my-4">
      <OrderVisaCard />
      <div className={styles['visa-detail-container__support-card']}>
        <p className="fw-bold color-on-surface">تماس با مشاوران هف‌هشتاد</p>
        <div className={styles['visa-detail-container__divider']} />
        <div className="text-center mt-3">
          <span className="fw-bold fs-3 color-on-surface-var">
            خرید آسان با مشاوره تلفنی هف‌هشتاد
          </span>
          <p className="fs-3 mt-3 color-on-surface-var">شنبه تا چهارشنبه از ۹ الی ۱۷</p>
          <p className="fs-3 color-on-surface-var">پنجشنبه از ۹ تا ۱۳</p>
        </div>

        <div className="d-flex py-3 px-2 bg-color-surface-container color-primary justify-content-center align-items-center rounded-4 cursor-pointer">
          <PhoneOutlined className={styles['visa-detail-container__support-card__icon']} />
          <a
            className="fs-5 pe-1 text-decoration-none"
            href={`tel:${HAFHASHTAD_TEL}`}
            target="_blank"
            rel="noreferrer"
          >
            ۰۲۱-۴۷۸۰
          </a>
        </div>
      </div>
    </div>
  );
};

export default VisaOrderSection;
