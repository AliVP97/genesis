import Image from 'next/image';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { TrainBackup, ErrorImage } from 'assets/images';
import { customLoader } from 'utils/helpers/imageLoader';
import { ErrorResponse } from 'services/train/tickets/TTicket';
import { useGetImages } from 'module/general/config/hooks/useGetImages';

import styles from './emptyResult.module.scss';

declare type TypeProps =
  | 'passenger'
  | 'filter'
  | 'hotel-filter'
  | 'search'
  | 'trainError'
  | 'bus-search'
  | 'busError'
  | 'hotel search result - empty'
  | 'hotel search result - connection error'
  | undefined;

interface Props {
  type?: TypeProps;
  isMobile?: boolean;
  error?: ErrorResponse;
  handleClick?: () => void;
  className?: string;
  message?: string;
  hideButton?: boolean;
}

const EmptyResult = ({
  type,
  isMobile,
  handleClick,
  className,
  error,
  message,
  hideButton,
}: Props) => {
  const { query, push, pathname } = useRouter();
  const { noPassengers, connectionError, noResultBySearch, noResultByFilter, rajaDown } =
    useGetImages();
  switch (type) {
    case 'filter':
      return (
        <div className={cn(styles.emptyResult, className)}>
          <div className={styles['emptyResult__filter--logo']}>
            <Image
              loader={customLoader}
              src={noResultByFilter}
              alt="no filter found"
              width="240"
              height="180"
              unoptimized
            />
          </div>
          <div className={styles['emptyResult__filter--title']}>
            <span>{message || 'بلیطی با فیلتر اعمال شده پیدا نشد.'}</span>
            <span> لطفا مقادیر فیلتر خود را تغییر دهید.</span>
          </div>
          <div className={styles['emptyResult__filter--btn']}>
            <button onClick={handleClick}>حذف همه‌ی فیلتر‌ها</button>
          </div>
        </div>
      );
    case 'hotel-filter':
      return (
        <div className={cn(styles.emptyResult, className)}>
          <div className={styles['emptyResult__filter--logo']}>
            <Image
              loader={customLoader}
              src={noResultByFilter}
              alt="no filter found"
              width="240"
              height="180"
              unoptimized
            />
          </div>
          <div className={styles['emptyResult__filter--title']}>
            <span>{message || 'هتلی با فیلتر اعمال شده پیدا نشد.'}</span>
            <span> لطفا مقادیر فیلتر خود را تغییر دهید.</span>
          </div>
          <div className={styles['emptyResult__filter--btn']}>
            <button onClick={handleClick}>حذف همه‌ی فیلتر‌ها</button>
          </div>
        </div>
      );
    case 'search':
      return (
        <div className={cn(styles.emptyResult, className)}>
          <div className={styles['emptyResult__search--logo']}>
            <Image
              loader={customLoader}
              src={noResultBySearch}
              alt="no search found"
              width="700"
              height="350"
              unoptimized
            />
          </div>
          <div className={styles['emptyResult__search--title']}>
            <span>متاسفانه بلیطی برای جستجوی شما یافت نشد.</span>
            <span>لطفا مقادیر جستجوی خود را تغییر دهید</span>
          </div>
          {!pathname.includes('international') && (
            <div className={styles['emptyResult__search--btn']}>
              <button onClick={handleClick}>{isMobile ? 'بازگشت' : 'جستجوی مجدد'}</button>
            </div>
          )}
        </div>
      );
    case 'bus-search':
      return (
        <div className={cn(styles.emptyResult, className)}>
          <div className={styles['emptyResult__search--logo']}>
            <Image
              loader={customLoader}
              src={noResultBySearch}
              alt="no search found"
              width="700"
              height="350"
              unoptimized
            />
          </div>
          <div className={cn(styles['emptyResult__search--title'], ' text-3')}>
            <span>متاسفانه برای مسیر مورد نظر شما هنوز اتوبوسی وجود ندارد.</span>
            <span>لطفا تاریخ سفر خود را تغییر دهید</span>
            <span> یا در زمان دیگری مراجعه نمایید</span>
          </div>
          <div className={styles['emptyResult__search--btn']}>
            <button onClick={handleClick}>{isMobile ? 'بازگشت' : 'جستجوی مجدد'}</button>
          </div>
        </div>
      );
    case 'trainError':
      return (
        <div className="d-flex justify-content-center mt-5 flex-column align-items-center">
          <div className="rtl">
            {error?.response?.data?.code === 100 ? (
              <Image
                loader={customLoader}
                src={rajaDown}
                alt="raja down"
                width="240"
                height="180"
                unoptimized
              />
            ) : error?.response?.data?.code === 101 ? (
              <TrainBackup />
            ) : (
              <div
                className={cn(
                  styles.emptyResult,
                  className,
                  'text-center d-flex flex-column align-items-center',
                )}
              >
                <div className={cn(styles['emptyResult__search--logo'])}>
                  <Image
                    loader={customLoader}
                    src={noResultBySearch}
                    alt="no search found"
                    width="700"
                    height="350"
                    unoptimized
                  />
                </div>
                <div className={styles['emptyResult__search--title']}>
                  <span>متاسفانه برای مسیر مورد نظر شما هنوز بلیط قطاری وجود ندارد.</span>
                </div>
              </div>
            )}
          </div>
          {error?.response?.data?.message && (
            <div
              className="rtl text-center mt-3 text-3 mb-2"
              style={{ whiteSpace: 'pre-line', lineHeight: '32px' }}
            >
              {error?.response?.data?.message}
            </div>
          )}

          <div className={styles['emptyResult__search--btn']}>
            {error?.response?.data?.code === 100 ? (
              <button onClick={handleClick}>تلاش مجدد</button>
            ) : error?.response?.data?.code === 101 ? (
              <button onClick={() => push('/train')}>بازگشت</button>
            ) : (
              <button onClick={() => push('/train')}>بازگشت</button>
            )}
          </div>
        </div>
      );
    case 'busError':
      return (
        <div className="d-flex justify-content-center mt-5 flex-column align-items-center">
          <div className={styles['emptyResult__search--logo']}>
            <ErrorImage />
          </div>
          <div className="text-center mt-3 text-4 mb-2 rtl">
            مسافر گرامی ،<br /> متاسفانه در حال حاضر به دلیل مشکلات فنی ،امکان سرویس دهی وجود ندارد.
          </div>
          <div className={styles['emptyResult__search--btn']}>
            {error?.response?.data?.code === 100 ? (
              <button onClick={() => push(query)}>تلاش مجدد</button>
            ) : (
              <button onClick={() => push('/bus')}>بازگشت</button>
            )}
          </div>
        </div>
      );
    case 'hotel search result - empty':
      return (
        <div className={cn(styles.emptyResult, className)}>
          <div className={styles['emptyResult__search--logo']}>
            <Image
              loader={customLoader}
              src={noResultBySearch}
              alt="no search found"
              width="700"
              height="350"
              unoptimized
            />
          </div>
          <div className={styles['emptyResult__search--title']}>
            <span>متاسفانه ظرفیت مورد نظر شما در تاریخ جستجو شده یافت نشد</span>
          </div>
          {/*<div className={styles['emptyResult__search--btn']}>*/}
          {/*  <button onClick={handleClick}>بازگشت</button>*/}
          {/*</div>*/}
        </div>
      );
    case 'hotel search result - connection error':
      return (
        <div className={cn(styles.emptyResult, className)}>
          <div className={styles['emptyResult__search--logo']}>
            <Image
              loader={customLoader}
              src={connectionError}
              alt="no search found"
              width="240"
              height="180"
              unoptimized
            />
          </div>
          <div className={styles['emptyResult__search--title']}>
            <span>متاسفانه نتیجه ای برای شما یافت نشد</span>
          </div>
          <div className={styles['emptyResult__search--btn']}>
            <button onClick={handleClick}>بازگشت</button>
          </div>
        </div>
      );

    default:
      return (
        <div className={cn(styles.emptyResult, className)}>
          <div className={styles['emptyResult__passenger--logo']}>
            <Image
              loader={customLoader}
              src={noPassengers}
              alt="no passenger found"
              width="240"
              height="180"
              unoptimized
            />
          </div>
          <div className={styles['emptyResult__passenger--title']}>
            <span>هیچ مسافری در لیست مسافران وجود ندارد.</span>
            <span> لطفا مسافران این سفر را اضافه کنید</span>
          </div>
          {!hideButton && (
            <div className={styles['emptyResult__passenger--btn']}>
              <button onClick={handleClick}>افزودن مسافر</button>
            </div>
          )}
        </div>
      );
  }
};

EmptyResult.defaultProps = {
  type: 'passenger',
};

export default EmptyResult;
