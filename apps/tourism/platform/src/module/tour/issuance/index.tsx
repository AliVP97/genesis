import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import cn from 'classnames';

import Button from 'components/button';
import HeaderHoc from 'components/headerHoc';
import { useGetImages } from 'module/general/config/hooks/useGetImages';
import { customLoader } from 'utils/helpers/imageLoader';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';

import styles from './tourIssuance.module.scss';
import style from 'components/stepper/stepper.module.scss';
import Step from 'components/stepper';
import useTourTicketDownload from '../../flights/travels/hooks/useTourTicketDownload';
const commonData = [
  { title: 'انتخاب تور', value: 'ticket', checked: false },
  { title: 'افزودن مسافران', value: 'passengers', checked: false },
  { title: 'بررسی نهایی', value: 'checkout', checked: false },
  { title: 'تایید آژانس', value: 'issuance', checked: false },
  { title: 'پرداخت', value: 'issuance', checked: false },
  { title: 'بارگذاری مدارک', value: 'issuance', checked: false },
  { title: 'صدور واچر', value: 'review', checked: false },
];
const TourIssuance = () => {
  const { getTourTicket } = useTourTicketDownload();

  const router = useRouter();
  const { push } = useRouter();
  const { isMobile } = useDeviceDetect();

  const { ticketOk } = useGetImages();

  const isSupperapp = useIsSuperApp();

  const ticketDownload = () => {
    getTourTicket(router?.query?.id as string);
  };

  return (
    <div className={cn(styles['issuing'], !isMobile && styles['issuing__desktop'], 'mt-4')}>
      <HeaderHoc>صدور بلیط </HeaderHoc>
      {!isMobile && (
        <div className={cn(style['stepper'], 'rtl w-100 mb-5')}>
          {commonData.map((step, index) => {
            return (
              <Step
                key={index.toString() + 'stepper' + step.title}
                title={step.title}
                checked={true}
                current={index === 6}
              />
            );
          })}
        </div>
      )}

      <div className={cn(isMobile && 'pt-5')}>
        <Image
          loader={customLoader}
          src={ticketOk}
          alt="success"
          width="344"
          height="172"
          unoptimized
        />
      </div>

      <span className={styles['issuing__description--done']}></span>
      <div className="mt-3 pb-2">بلیط شما با موفقیت صادر شد</div>

      <div
        className={cn(
          styles['issuing__footer'],
          isSupperapp && styles['issuing__footer__isSupperapp'],
          'mt-2',
        )}
      >
        <Button onClick={ticketDownload} className={styles['issuing__footer__btn']}>
          دانلود بلیط{''}
        </Button>{' '}
        {isMobile && (
          <button
            onClick={() => void push('/tour')}
            className={cn(styles['issuing__footer__btn__return'], 'm-0 mt-1 mb-5')}
          >
            بازگشت به صفحه اصلی
          </button>
        )}
      </div>
    </div>
  );
};

export default TourIssuance;
