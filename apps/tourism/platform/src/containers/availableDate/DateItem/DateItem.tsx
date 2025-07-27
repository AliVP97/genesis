import moment from 'moment-jalaali';
import cn from 'classnames';
import styles from '../availableDate.module.scss';
import DateType from '../types/DateType';
import getRootClassName from './utils/getRootClassName';
import isTomorrow from './utils/isTomorrow';
import { memo } from 'react';

interface DateItemProps {
  date: DateType;
  device: { isMobile: boolean | undefined };
  activeDate: DateType;
  onClick: () => void;
}

function getProps(item: DateType, device: { isMobile: boolean | undefined }, activeDate: DateType) {
  const monthAndDay = moment(item.date, 'jYYYY-jMM-jDD').format('jM/jD');
  const rootId = `day-${item.date}`;
  const rootClassName = getRootClassName(device.isMobile, activeDate, item.day, item.month);
  const isTomorrowDate = isTomorrow(item.date);
  const title = item.week + ' ' + monthAndDay;
  const subtitle = item.content?.secondary || '';

  return { monthAndDay, rootId, rootClassName, isTomorrowDate, title, subtitle };
}

const DateItem = ({ date, device, activeDate, onClick }: DateItemProps) => {
  const { title, rootId, rootClassName, isTomorrowDate, subtitle } = getProps(
    date,
    device,
    activeDate,
  );

  return (
    <div id={rootId} className={rootClassName}>
      <div
        className={cn(
          styles['resultDate_slide--content'],
          !device.isMobile && 'pb-0',
          isTomorrowDate && styles.date,
        )}
        onClick={onClick}
      >
        <div
          className={
            device.isMobile
              ? styles['resultDate_mobile-slide-date']
              : styles['resultDate_slide-date']
          }
        >
          {title}
          <div dangerouslySetInnerHTML={{ __html: subtitle }} />
        </div>
      </div>
    </div>
  );
};

const MemoizedDateItem = memo(DateItem);
MemoizedDateItem.displayName = 'DateItem';

export default MemoizedDateItem;
