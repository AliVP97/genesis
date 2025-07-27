import { FactorIcon, Info } from 'assets/icons';
import styles from './tourOrderInvoice.module.scss';
import Table from 'components/table';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { TRowObject } from 'containers/landingPage/types';
import { generateAdultRow } from './components/tableRows/generateAdultRow';
import { generateChildRow } from './components/tableRows/generateChildRow';
import { generateKidRow } from './components/tableRows/generateKidRow';
import { generateAdditionalServiceRow } from './components/tableRows/generateAdditionalServiceRow';
import { useTourPrice } from '../../../../hooks/useTourPrice';
import { generateBabyRow } from './components/tableRows/generateBabyRow';
import { FieldValues, UseFormGetValues, UseFormWatch } from 'react-hook-form';
import { useRouter } from 'next/router';
import { TTourGetCheckoutResponse } from 'services/tour/v2/checkout/type';
import { invoiceHeading } from '../../../../hooks/constant';

type TTourOrderInvoice = {
  data: TTourGetCheckoutResponse;
  getValues: UseFormGetValues<FieldValues>;
  watch: UseFormWatch<FieldValues>;
};

const TourOrderInvoice = ({ data, getValues, watch }: TTourOrderInvoice) => {
  const { totalSum } = useTourPrice(data, getValues, 177);
  const { isMobile } = useDeviceDetect();
  // const sumDollarInfo = ``;

  const adultRow = generateAdultRow(getValues('adultNumber'), watch('adultNumber'), data);
  const childRow = generateChildRow(getValues('childNumber'), watch('childNumber'), data);
  const childWithoutBedRow = generateKidRow(
    getValues('childWithoutBedNumber'),
    watch('childWithoutBedNumber'),
    data,
  );
  const babyRow = generateBabyRow(getValues('infantNumber'), watch('infantNumber'), data);
  const additionalServiceRow = generateAdditionalServiceRow(
    getValues('adultNumber'),
    watch('adultNumber'),
    data,
  );

  const invoiceRows: TRowObject[] = [];

  [adultRow, childRow, childWithoutBedRow, babyRow, additionalServiceRow].forEach((row) => {
    if (Object.keys(row).length !== 0) {
      invoiceRows.push(row as TRowObject);
    }
  });
  const { query } = useRouter();

  // const showDollarPrice =
  //   query?.type === 'international' &&
  //   data?.adultSinglePriceUsd &&
  //   totalSumWithDollar !== 0;

  return (
    <div className={styles['tour-order-container__form']}>
      <div className={isMobile ? styles['tour-order-container__title'] : 'row mb-4'}>
        <div className={styles['tour-order-container__form__title']}>
          <span className={isMobile ? 'fw-500' : 'fw-bold'}>
            <FactorIcon />
            فاکتور
          </span>
        </div>
        <div className={styles['tour-detail-container__divider']} />
        <div className={isMobile ? 'p-0' : 'px-3'}>
          <p className={isMobile ? 'text-3 pt-3' : 'color-black-1 pt-3'}>
            مجموع مبلغ قابل پرداخت با احتساب ۱۰ درصد مالیات بر ارزش افروده محاسبه شده است
          </p>
          {query?.type === 'international' && (
            <div className="d-flex gap-2 align-items-center mb-3">
              <Info />
              <span className="fs-2 color-grey-1">
                لطفا از تاریخ انقضا پاسپورت بقیه همسفران اطمینان حاصل نمایید.
              </span>
            </div>
          )}
          {/*{showDollarPrice && (*/}
          {/*  <div className="d-flex gap-2 align-items-center mb-3">*/}
          {/*    <Info />*/}
          {/*    <span className="fs-2 color-grey-1">*/}
          {/*      مبلغ*/}
          {/*      <strong className="fs-3 text-black">{sumDollarInfo}</strong>*/}
          {/*      به صورت نقدی دریافت میگردد.*/}
          {/*    </span>*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
        <div className="w-100">
          <Table headers={invoiceHeading} rows={invoiceRows} />
          <div className="d-flex justify-content-end align-items-center bg-color-grey-5 rounded-3 mt-2 p-4 pe-5">
            <span className="fs-3 fw-500">مجموع مبلغ قابل پرداخت:</span>
            <span className="color-blue-light-6 px-2 fs-5 fw-700">
              {totalSum ? Number(totalSum)?.toLocaleString() : '0'}
              &nbsp;ریال
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourOrderInvoice;
