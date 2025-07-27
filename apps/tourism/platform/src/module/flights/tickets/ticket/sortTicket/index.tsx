import React from 'react';
import { options, OptionTypes } from './sortItems';
import styles from './sortTicket.module.scss';
import cn from 'classnames';
import { Device } from 'utils/interface';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import { smoothScrollTo } from 'utils/helpers/smoothScroll';
interface Props {
  device: Device;
  width?: number;
}

const SortTicket = ({ device, width }: Props) => {
  const { query, push } = useRouter();
  const handleSort = (id: string) => {
    if (query.sort !== id) {
      push(
        {
          pathname: '/flights/' + query?.id,
          query: queryString.stringify(
            { ...query, sort: id, id: undefined },
            { arrayFormat: 'comma' },
          ),
        },
        undefined,
        { shallow: true },
      ).catch(() => {
        throw new Error('try it again');
      });
    }
  };

  const sort = (item: OptionTypes) => {
    handleSort(item.value);
    if (device == 'mobile') {
      const wrapper: HTMLElement | null = document?.querySelector('#mobile-layout');
      wrapper && smoothScrollTo(wrapper, 0);
    }
  };

  return (
    <div className={styles['sort']}>
      {device !== Device.mobile && !(width! <= 992 && width! >= 720) && (
        <span className={styles['sort__title']}>مرتب سازی بر اساس :</span>
      )}
      {options.map((item: OptionTypes) => {
        // Determine the base class based on the device type
        const baseClass =
          device !== Device.mobile
            ? query.sort === item.value
              ? styles['sort__item--active']
              : styles['sort__item']
            : styles['sort__mobile__item'];

        // Add active class for mobile if applicable
        const activeMobileClass =
          device === Device.mobile && query.sort === item.value
            ? styles['sort__mobile__item--active']
            : '';

        // Combine classes
        const itemClass = cn(baseClass, activeMobileClass);

        return (
          <div key={item.value} className={itemClass} onClick={() => sort(item)}>
            <span>{item.title}</span>
          </div>
        );
      })}
    </div>
  );
};

export default SortTicket;
