import Button from 'components/button';
import React, { useState } from 'react';
import cn from 'classnames';
import { Phone } from 'assets/icons';
import { HAFHASHTAD_TEL } from 'utils/static/global';
import { useRouter } from 'next/router';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

const Consulting = () => {
  const { push } = useRouter();
  const { isMobile } = useDeviceDetect();

  const [isShowConsultingNumber, setIsShowConsultingNumber] = useState(false);
  return (
    <div className="card mt-3 p-3">
      <div dir={'rtl'} className=" text-weight-400 fs-3">
        برای کسب اطلاعات بیشتر با ما تماس بگیرید؛ کارشناسان ما آماده پاسخگویی به شما هستند.
      </div>
      <Button
        onClick={() => {
          if (isMobile) {
            push(`tel:${HAFHASHTAD_TEL}`);
          }
          setIsShowConsultingNumber(true);
        }}
        className={cn('mt-3', isShowConsultingNumber ? 'btn btn-primary' : 'btn')}
      >
        <div
          className={cn(
            'text-weight-500 fs-3',
            isShowConsultingNumber ? 'color-surface-container' : 'color-surface-tint',
          )}
        >
          <Phone fill={isShowConsultingNumber ? '#f2f2f2' : '#105FAE'} />
          <span dir="ltr" className="px-2">
            {isShowConsultingNumber ? '021 4780' : 'مشاوره رایگان'}
          </span>
        </div>
      </Button>
    </div>
  );
};
export default Consulting;
