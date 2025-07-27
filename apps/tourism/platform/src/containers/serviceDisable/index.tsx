import React from 'react';
import styles from './service-disable.module.scss';

import { disableServiceAnimation } from 'assets/animations';
import dynamic from 'next/dynamic';
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
);

const index = ({ device }: { device: string }) => {
  return (
    <div className={styles['service-disable']}>
      <div className={styles['service-disable__lottie-wrapper']}>
        {device === 'mobile' && (
          <Player src={disableServiceAnimation} className="player" loop autoplay />
        )}
      </div>
      <p className="text-3 text-center color-red mt-2" dir="rtl">
        این سرویس در حال حاضر فعال نمی باشد.
      </p>
    </div>
  );
};

export default index;
