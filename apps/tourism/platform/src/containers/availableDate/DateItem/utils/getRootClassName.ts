import DateType from '../../types/DateType';
import styles from '../../availableDate.module.scss';
import cn from 'classnames';

export default function getRootClassName(
  isMobile: boolean | undefined,
  activeDate: DateType,
  day: number | undefined,
  month: string | undefined,
) {
  let className = '';

  if (isMobile) {
    className = styles['resultDate_mobile-slide'];
  } else {
    className = styles['resultDate_slide'];
  }

  if (activeDate?.day === day && activeDate.month === month) {
    if (isMobile) {
      className += ` ${styles['resultDate_mobile-slide-active']}`;
    } else {
      className += ` ${styles['resultDate_slide-active']}`;
    }
  }

  return cn(className.trim());
}
