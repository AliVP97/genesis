import styles from './sortList.module.scss';
import cn from 'classnames';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

type SortItems = {
  title?: string;
  sortBy?: string;
};

type SortListProps = {
  sortItems: SortItems[] | undefined;
  clickedSortItem: () => void;
};

const SortList = ({ sortItems, clickedSortItem }: SortListProps) => {
  const { isMobile } = useDeviceDetect();

  const { query, push, pathname } = useRouter();

  useEffect(() => {
    if (query.sort && sortItems) {
      const sortData = sortItems.some((item) => item.sortBy === query.sort);
      if (!sortData) {
        push(
          {
            pathname: pathname,
            query: { ...query, sort: sortItems[0].sortBy },
          },
          undefined,
          { scroll: false },
        ).catch(() => new Error());
      }
    }
    if (!query.sort && sortItems) {
      push(
        {
          pathname: pathname,
          query: {
            ...query,
            sort: sortItems
              .sort((a, b) => (a.sortBy || '').localeCompare(b.sortBy || ''))
              .reverse()[0].sortBy,
          },
        },
        undefined,
        { scroll: false },
      ).catch(() => new Error());
    }
  }, [pathname, query]);

  const handleSort = (sortBy: string) => {
    if (query.sort === sortBy) return;
    clickedSortItem();

    push(
      {
        pathname: pathname,
        query: { ...query, sort: sortBy },
      },
      undefined,
      { scroll: false },
    ).catch(() => new Error());
  };
  return (
    <div className={styles['sort']}>
      {!isMobile && <span className={styles['sort__title']}>مرتب سازی بر اساس :</span>}
      {sortItems &&
        [...sortItems]
          .sort((a, b) => (a.sortBy || '').localeCompare(b.sortBy || ''))
          .reverse()
          .map((item) => {
            const isActive = query.sort === item.sortBy;
            const className = cn(
              !isMobile
                ? isActive
                  ? styles['sort__item--active']
                  : styles['sort__item']
                : styles['sort__mobile__item'],
              isActive ? styles['sort__mobile__item--active'] : '',
            );
            return (
              <>
                {item.sortBy && (
                  <div
                    key={item.title + 'sortTicketHotel'}
                    className={className}
                    onClick={() => {
                      handleSort(item.sortBy!);
                    }}
                  >
                    <span>{item.title}</span>
                  </div>
                )}
              </>
            );
          })}
    </div>
  );
};

export default SortList;
