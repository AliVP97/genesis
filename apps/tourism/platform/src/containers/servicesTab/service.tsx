import {
  BusMainIcon,
  DomesticFlightIcon,
  GlobalFlightIcon,
  // GlobalHotelIcon,
  LocalHotelIcon,
  TourServiceIcon,
  TrainMainIcon,
} from 'assets/icons';
import cn from 'classnames';
import React, { useEffect, useRef } from 'react';
import router, { useRouter } from 'next/router';
import styles from './servicesTab.module.scss';
import WEB from 'utils/routes/web';

const Service = ({ device }: { device?: string }) => {
  const { pathname } = useRouter();
  const isServiceActive = () => {
    const service = pathname.split('/')?.[1];
    if (!service) return 'flights';
    else return service;
  };
  const options = [
    {
      label: 'پرواز داخلی',
      service: 'flights',
      image: <DomesticFlightIcon />,
      link: WEB.DOMESTIC,
    },
    {
      label: 'پرواز خارجی',
      service: 'international',
      image: <GlobalFlightIcon />,
      link: WEB.INTERNATIONAL,
    },
    {
      label: 'قطار',
      service: 'train',
      image: <TrainMainIcon />,
      link: WEB.TRAIN,
    },
    {
      label: 'اتوبوس',
      service: 'bus',
      image: <BusMainIcon />,
      link: WEB.BUS,
    },
    // {
    //   label: "هتل خارجی",
    //   service: 'international-hotel',
    //   image: <GlobalHotelIcon />,
    //   link: WEB.INTERNATIONAL_HOTEL,
    // },
    {
      label: 'هتل',
      service: 'hotel',
      image: <LocalHotelIcon />,
      link: WEB.HOTEL,
    },
    {
      label: 'تور',
      service: 'tour',
      image: <TourServiceIcon />,
      link: WEB.TOUR,
    },
  ];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeService = isServiceActive();
    activeService == 'hotel' && ref.current && ref.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return device === 'mobile' ? (
    <div className={styles.mobileServices}>
      {options.map((item) => (
        <div
          ref={ref}
          className={cn(
            styles.mobileServices__tab,
            isServiceActive() === item.service && styles['mobileServices__tab--active'],
          )}
          onClick={() => {
            router.push(item.link);
          }}
          key={item.link}
        >
          {item.image}
          <span className={styles['mobileServices__tab--title']}>{item.label}</span>
        </div>
      ))}
      {/* <div className={styles['mobileServices__line']} /> */}
    </div>
  ) : (
    <div id="desktop__services" className={styles.services}>
      {options.map((item) => (
        <div
          className={cn(
            styles.services__tab,
            isServiceActive() === item.service && styles['services__tab--active'],
          )}
          onClick={() => router.push(item.link)}
          key={item.link + item.service + item.label}
        >
          <div className={styles.services__tab__item}>
            {item.image}
            <span className="me-3">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Service;
