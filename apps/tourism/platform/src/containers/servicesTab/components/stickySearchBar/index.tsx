import classNames from 'classnames';
import style from './style.module.scss';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getSearchBarData, getServiceIcon, shouldRender } from './helpers';
import { TSearchBarData } from './types';
import { CalendarIcon2 as CalendarIcon, SearchIcon } from 'assets/icons';
import dayjs from 'dayjs';
import { DATE_UTILS } from 'utils/helpers/dateUtils';
import { getServiceName } from 'utils/helpers/serviceDetector';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

type TProps = {
  visible: boolean;
  onClick: () => void;
};

export const StickySearchBar = (props: TProps) => {
  const { isMobile } = useDeviceDetect();
  const { query, pathname } = useRouter();

  const [searchBarData, setSearchBarData] = useState<TSearchBarData>();

  useEffect(() => {
    getSearchBarData(pathname).then((data) => {
      setSearchBarData(data);
    });
  }, [query, pathname]);

  return (
    shouldRender(pathname, isMobile) && (
      <div
        className={classNames(style['main'], props.visible && style['visible'])}
        onClick={props.onClick}
      >
        <div className={classNames('container', style['container'])}>
          {' '}
          <div className={style['location']}>
            <div className={style['icon']}>{getServiceIcon(pathname)}</div>
            <div className={style['title']}>
              {/^(hotel)$/.test(getServiceName(pathname)) ? (
                ` هتل ${searchBarData?.departure.title}`
              ) : (
                <>
                  {searchBarData?.return.date
                    ? 'بلیط رفت و برگشت '
                    : /^bus$/.test(getServiceName(pathname))
                      ? 'بلیط '
                      : 'بلیط یک‌طرفه '}
                  {getServiceName(pathname) !== 'international'
                    ? searchBarData?.departure.title
                    : ''}{' '}
                  {searchBarData?.return.title && ` به ${searchBarData?.return.title}`}
                </>
              )}
            </div>
          </div>
          <div
            className={classNames(
              style['date'],
              searchBarData?.calendarSystem !== 'JALALI' && style['latin'],
            )}
          >
            <div className={style['icon']}>
              <CalendarIcon />
            </div>
            <div className={style['content']}>
              <div className={style['label']}>
                {/^hotel$/.test(getServiceName(pathname))
                  ? 'ورود:'
                  : /^bus$/.test(getServiceName(pathname))
                    ? 'حرکت:'
                    : /^flights$/.test(getServiceName(pathname)) && !searchBarData?.return.date
                      ? ''
                      : 'رفت:'}
              </div>
              <div
                className={`${style['value']} ${
                  /^flights$/.test(getServiceName(pathname)) && !searchBarData?.return.date && 'm-0'
                }`}
              >
                {DATE_UTILS.formatDate(+dayjs(searchBarData?.departure.date), {
                  lang: searchBarData?.calendarSystem === 'JALALI' ? 'fa' : 'en',
                  showYear: false,
                })}
              </div>
            </div>
            {searchBarData?.return.date && (
              <div className={style['return']}>
                <div className={style['content']}>
                  <div className={style['label']}>
                    {/^hotel$/.test(getServiceName(pathname)) ? 'خروج' : 'برگشت'}:
                  </div>
                  <div className={style['value']}>
                    {DATE_UTILS.formatDate(+dayjs(searchBarData?.return.date), {
                      lang: searchBarData?.calendarSystem === 'JALALI' ? 'fa' : 'en',
                      showYear: false,
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          {searchBarData?.passengersNumber && (
            <div className={style['passenger']}>{searchBarData?.passengersNumber} مسافر</div>
          )}
          <div className={style['search-button']}>
            <div className={style['search-icon']}>
              <SearchIcon className="fill-primary" />
            </div>
          </div>
        </div>
      </div>
    )
  );
};
