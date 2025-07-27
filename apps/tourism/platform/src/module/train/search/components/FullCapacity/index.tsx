import { TrainFullCapacity } from 'assets/images';
import { NotifyMe } from '../NotifyMe';

import styles from './style.module.scss';

export const FullCapacity = () => {
  return (
    <div className={styles.container}>
      <TrainFullCapacity />
      ظرفیت قطارها در این تاریخ تکمیل شده است.
      <NotifyMe />
    </div>
  );
};
