import styles from '../dubaiVisa.module.scss';
import { useRouter } from 'next/router';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

const VisaOrderTable = ({ data }: { data: string[] }) => {
  const { query, pathname } = useRouter();
  const { isMobile } = useDeviceDetect();
  const passengers =
    Number(query?.numberAdults) + Number(query?.numberMinors) + Number(query?.numberBabies);

  return (
    <>
      {isMobile && pathname.includes('order') ? (
        <div>
          <div className="d-flex justify-content-between">
            <p className="fs-3 color-on-surface-var">تعداد مسافر</p>
            <p className="fs-3 color-on-surface">{passengers} مسافر</p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="fs-3 color-on-surface-var">حداکثر اقامت</p>
            <p className="fs-3 color-on-surface">{data[1]} روز</p>
          </div>
          {query.visaName == 'dubai' && (
            <div className="d-flex justify-content-between">
              <p className="fs-3 color-on-surface-var"> تعداد ورودی</p>
              <p className="fs-3 color-on-surface">
                {data[0] === 'multi' ? 'چند ورودی' : 'تک ورودی'}
              </p>
            </div>
          )}
          <div className="d-flex justify-content-between">
            <p className="fs-3 color-on-surface-var">اعتبار ویزا</p>
            <p className="fs-3 color-on-surface">
              {query.visaName == 'dubai' ? '۵۸ روز پس از صدور' : '۲۹ روز پس از صدور'}
            </p>
          </div>
          {query.visaName == 'dubai' && (
            <div className="d-flex justify-content-between">
              <p className="fs-3 color-on-surface-var">الزامات گذرنامه</p>
              <p className="fs-3 color-on-surface">۱۸۶ روز اعتبار (بعد از ورود)</p>
            </div>
          )}
        </div>
      ) : (
        <table className={styles['visa-detail-container__price__table']}>
          <thead>
            <tr>
              <th></th>
              <th scope="col" className="color-on-surface-var">
                تعداد مسافر
              </th>
              <th scope="col" className="color-on-surface-var">
                حداکثر اقامت
              </th>
              {query.visaName == 'dubai' && (
                <th scope="col" className="color-on-surface-var">
                  تعداد ورودی
                </th>
              )}
              <th scope="col" className="color-on-surface-var">
                اعتبار ویزا
              </th>
              {query.visaName == 'dubai' && (
                <th scope="col" className="color-on-surface-var">
                  الزامات گذرنامه
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"></th>
              <td className="color-on-surface">{passengers} مسافر</td>
              <td className="color-on-surface">{data[1]} روز</td>
              {query.visaName == 'dubai' && (
                <td className="color-on-surface">
                  {data[0] === 'multi' ? 'چند ورودی' : 'تک ورودی'}
                </td>
              )}
              <td className="color-on-surface">
                {query.visaName == 'dubai' ? '۵۸ روز پس از صدور' : '۲۹ روز پس از صدور'}
              </td>
              {query.visaName == 'dubai' && (
                <td className="color-on-surface">۱۸۶ روز اعتبار (بعد از ورود)</td>
              )}
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};
export default VisaOrderTable;
