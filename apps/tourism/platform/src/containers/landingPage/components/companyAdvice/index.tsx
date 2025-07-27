import React, { useState } from 'react';
import styles from './companyAdvice.module.scss';
import { useRouter } from 'next/router';

type CompanyAdvicePropsType = {
  description: React.ReactNode | React.ReactNode[] | string;
  fullDescription: React.ReactNode | React.ReactNode[] | string;
};

export type TPath = {
  tourism: string;
  flights: string;
  train: string;
  bus: string;
  international: string;
  hotel: string;
};

export const ROUTE_NAME: TPath = {
  tourism: 'هواپیما',
  flights: 'هواپیما',
  train: 'قطار',
  bus: 'اتوبوس',
  international: 'هواپیما خارجی',
  hotel: 'هتل',
};

function CompanyAdvice({ description, fullDescription }: CompanyAdvicePropsType) {
  const [showMore, setShowMore] = useState<boolean>(false);
  const router = useRouter();
  const address = router.route.replace('/', '');
  const pathName = address === '' ? 'tourism' : address;

  return (
    <>
      <div className={styles['company-advice']}>
        <div className="container d-flex justify-content-center align-items-center flex-column">
          {pathName === 'hotel' ? (
            <h3 className="fs-6">{`توصیه‌های هف‌هشتادی برای رزرو ${
              ROUTE_NAME[pathName as keyof TPath]
            }`}</h3>
          ) : (
            <h3 className="fs-6">{`توصیه‌های هف‌هشتادی برای سفر با ${
              ROUTE_NAME[pathName.split('/')[0] as keyof TPath]
            }`}</h3>
          )}
          <div className="col-12 col-lg-10">
            <p className="pt-3">{showMore ? fullDescription : description}</p>
          </div>
          {!showMore && <button onClick={() => setShowMore(true)}>مشاهده تمام متن</button>}
        </div>
      </div>
    </>
  );
}

export default CompanyAdvice;
