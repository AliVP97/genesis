import React, { forwardRef, ForwardedRef } from 'react';
import styles from './sortTicket.module.scss';
import cn from 'classnames';
import { Device } from 'utils/interface';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import { options, OptionTypes } from '../../interface';
import * as Sentry from '@sentry/nextjs';

interface Props {
  device: Device;
}

const SortTicket = forwardRef(function SortTicket(props: Props, ref: ForwardedRef<HTMLDivElement>) {
  const { query, push } = useRouter();
  const handleSort = (id: string) => {
    if (query.sort === id) {
      return;
    } else {
      try {
        const array = JSON.parse(localStorage.getItem('international_flight_last_search')!);

        if (Array.isArray(array) && array.length > 0) {
          const first = array[0];
          first.sort = id;
          localStorage.setItem('international_flight_last_search', JSON.stringify(array));
        }
      } catch (e) {
        Sentry.captureException(
          `parse international_flight_last_search from localStorage failed: ${e}`,
        );
      }

      void push(
        {
          pathname: '/international/' + query?.id,
          query: queryString.stringify({ ...query, sort: id }, { arrayFormat: 'comma' }),
        },
        undefined,
        { shallow: true },
      );
    }
  };
  return (
    <div
      className={cn(styles['sort'], props.device === Device.mobile && styles['sort-mobile'])}
      ref={ref}
    >
      {props.device !== Device.mobile && (
        <span className={styles['sort__title']}>مرتب سازی بر اساس :</span>
      )}
      {options.map((item: OptionTypes) => (
        <div
          key={item.value}
          className={cn(
            props.device !== Device.mobile
              ? query.sort === item.value
                ? styles['sort__item--active']
                : styles['sort__item']
              : styles['sort__mobile__item'],
            query.sort === item.value ? styles['sort__mobile__item--active'] : '',
          )}
          onClick={() => handleSort(item.value)}
        >
          <span>{item.title} </span>
        </div>
      ))}
    </div>
  );
});

export default SortTicket;
