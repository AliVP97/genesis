import React from 'react';
import styles from './sortTicket.module.scss';
import cn from 'classnames';
import { Device } from 'utils/interface';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import { options, OptionTypes } from '../../interface';
interface Props {
  device: Device;
}

const SortTicket = ({ device }: Props) => {
  const { query, push } = useRouter();
  const handleSort = (id: string) => {
    if (query.sort === id) {
      void push(
        {
          pathname: '/bus/' + query?.id,
          query: queryString.stringify(
            { ...query, sort: undefined, id: undefined },
            { arrayFormat: 'comma' },
          ),
        },
        undefined,
        { shallow: true },
      );
    } else {
      void push(
        {
          pathname: '/bus/' + query?.id,
          query: queryString.stringify(
            { ...query, sort: id, id: undefined },
            { arrayFormat: 'comma' },
          ),
        },
        undefined,
        { shallow: true },
      );
    }
  };
  return (
    <div className={styles['sort']}>
      {device !== Device.mobile && (
        <span className={styles['sort__title']}>مرتب سازی بر اساس :</span>
      )}
      {options.map((item: OptionTypes) => (
        <div
          key={item.value + 'sortTicket'}
          className={cn(
            device !== Device.mobile
              ? query.sort === item.value
                ? styles['sort__item--active']
                : styles['sort__item']
              : styles['sort__mobile__item'],
            query.sort === item.value ? styles['sort__mobile__item--active'] : '',
          )}
          onClick={() => handleSort(item.value)}
        >
          <span>{item.title}</span>
        </div>
      ))}
    </div>
  );
};

export default SortTicket;
