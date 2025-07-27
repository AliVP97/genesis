import { BusEmptyState } from 'assets/images';
import { NotifyMe } from '../NotifyMe';

import styles from './style.module.scss';

export const FullCapacity = ({ hasTickets }: { hasTickets: boolean }) => {
  return (
    <div className={styles.container}>
      <BusEmptyState />
      {hasTickets ? (
        'ظرفیت اتوبوس‌ها در این تاریخ تکمیل شده است.'
      ) : (
        <>
          <div>در حال حاضر برای این مسیر سرویس اتوبوس فعال نیست.</div>
          <div>لطفاً بعداً دوباره بررسی کنید.</div>
        </>
      )}
      <NotifyMe />
    </div>
  );
};
