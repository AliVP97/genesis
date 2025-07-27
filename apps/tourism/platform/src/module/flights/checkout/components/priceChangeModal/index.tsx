import Modal from 'components/modal';
import { useRouter } from 'next/router';
import styles from './priceChangeModal.module.scss';
import WEB from 'utils/routes/web';
import queryString from 'query-string';
import dayjs from 'dayjs';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import cn from 'classnames';
import { InfoIcon } from 'assets/icons';
import Divider from 'components/divider';
import * as Sentry from '@sentry/nextjs';

type Props = {
  newPrice: string;
  resolveConfirmation: (confirmed: boolean) => void;
};
const PriceChangeModal = ({ newPrice, resolveConfirmation }: Props) => {
  const { push } = useRouter();
  const { isMobile } = useDeviceDetect();

  const resetAction = () => {
    try {
      const lastSearch = JSON.parse(localStorage?.getItem('last_search') as string)?.[0];

      if (!lastSearch) {
        throw new Error('No last search data found');
      }

      const queryObject: {
        departureDate: string;
        adult: number;
        child: number;
        infant: number;
        returningDate?: string;
      } = {
        ...lastSearch?.passenger,
        departureDate: dayjs(lastSearch?.departureDate).calendar('jalali').format('YYYY-MM-DD'),
        returningDate: lastSearch?.returningDate,
      };

      push(
        {
          pathname:
            WEB.DOMESTIC_SEARCH + lastSearch?.origin.value + '-' + lastSearch?.destination.value,
          query: queryString.stringify(queryObject),
        },
        undefined,
        { shallow: false },
      ).catch(() => {
        throw new Error('try it again');
      });
    } catch (error) {
      Sentry.captureException(error);
      push(WEB.DOMESTIC).catch(() => {
        console.error('Failed to redirect to home page');
      });
    }
  };

  return (
    <Modal
      className="d-flex justify-content-center align-items-center"
      onClose={() => null}
      backdropDisable={true}
      visible={true}
      transition={true}
    >
      <div className={cn(isMobile ? styles.modal : styles['desktop-modal'])}>
        <div className={styles.modal__text}>
          <div className="d-flex align-items-center">
            <span className={cn(isMobile ? ' text-2 ' : ' text-4', 'me-1')}>تغییر قیمت </span>{' '}
            <InfoIcon className="fill-grey-2" />
          </div>

          <span className={cn('pt-2 rtl text-end', isMobile ? ' text-2 ' : ' text-4')}>
            مبلغ بلیط به دلیل تغییرات قیمت از سمت تامین کننده افزایش داشته است در صورت تایید، بلیط
            با مبلغ جدید محاسبه میشود.{' '}
          </span>
        </div>{' '}
        <div className="color-primary align-items-center text-weight-500 py-3 d-flex w-100  rtl">
          <div className={cn(isMobile ? ' text-2 col-6 text-end ' : 'text-3 ps-2')}>مبلغ جدید:</div>
          <div className={cn(isMobile ? 'text-5 col-6 text-start' : 'text-5 ')}>
            {Number(newPrice).toLocaleString()}ریال
          </div>
        </div>
        {!isMobile ? <Divider type="horizontal" className="my-2" /> : <></>}
        <div
          className={cn(isMobile && 'justify-content-evenly', 'd-flex align-items-center', 'w-100')}
        >
          <button
            className={
              isMobile ? cn(styles.modal__btn, 'text-2 px-4') : styles['desktop-modal__btn']
            }
            onClick={() => resolveConfirmation(true)}
          >
            ادامه با مبلغ جدید{' '}
          </button>
          <div
            className={cn(
              isMobile ? ' text-center text-2' : 'col-3 text-center justify-content-center',
              !isMobile && styles['desktop-modal__return-btn'],
            )}
            onClick={() => {
              resolveConfirmation(false);
              resetAction();
            }}
          >
            بازگشت به صفحه نتایج{' '}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PriceChangeModal;
