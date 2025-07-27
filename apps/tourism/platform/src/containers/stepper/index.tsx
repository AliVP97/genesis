import { useEffect, useState } from 'react';
import Step from 'components/stepper/index';
import { useRouter } from 'next/router';
import cn from 'classnames';
import styles from 'components/stepper/stepper.module.scss';
import { MainServiceDetector } from 'utils/helpers/serviceDetector';

const commonData = [
  { title: 'انتخاب بلیط', value: 'ticket', checked: false },
  { title: 'افزودن مسافران', value: 'passengers', checked: false },
  { title: 'پرداخت', value: 'checkout', checked: false },
  { title: 'صدور بلیط', value: 'issuance', checked: false },
  { title: 'مشاهده بلیط', value: 'review', checked: false },
];

const hotelData = [
  { title: 'انتخاب هتل', value: 'ticket', checked: false },
  { title: 'انتخاب اتاق', value: 'detail', checked: false },
  { title: 'افزودن مسافر', value: 'passengers', checked: false },
  { title: 'بررسی نهایی', value: 'checkout', checked: false },
  { title: 'پرداخت', value: 'issuance', checked: false },
  { title: 'صدور واچر', value: 'review', checked: false },
];

const Stepper = () => {
  const router = useRouter();
  const [data, setData] = useState<{ title: string; value: string; checked: boolean }[]>();
  const serviceName = MainServiceDetector();

  useEffect(() => {
    if (serviceName !== 'hotel') {
      const serviceData = commonData;
      const newData = serviceData.map((item) => {
        if (router.pathname.includes(item.value)) return { ...item, checked: true };
        return { ...item, checked: false };
      });
      setData(newData);
    }
  }, [router.pathname, serviceName]);
  useEffect(() => {
    if (serviceName === 'hotel') {
      const serviceData = [...hotelData];
      serviceData.forEach((item, idx) => {
        if (router.pathname.split('/')[2] === 'issuance' && idx === serviceData.length - 1) {
          if (router.query.hotelPaymentStatus === 'success') {
            serviceData[idx].checked = true;
            serviceData[idx - 1].checked = false;
          }
        }
        if (router.pathname.includes(item.value)) {
          serviceData[idx].checked = true;
          if (idx !== 0) {
            serviceData[idx - 1].checked = false;
          }
        }
      });
      setData([...hotelData]);
    }
  }, [router.pathname, serviceName, router.query]);
  return (
    <>
      <div className={cn(styles['stepper'], 'rtl w-100')}>
        {data?.map((item, index) => {
          const currentIndex = data.findIndex((value) => value.checked);
          return (
            <Step
              key={index.toString() + 'stepper' + item.title}
              title={item.title}
              checked={index < currentIndex}
              current={index === currentIndex}
            />
          );
        })}
      </div>
    </>
  );
};

export default Stepper;
