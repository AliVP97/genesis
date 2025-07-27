import { FC } from 'react';
import styles from '../dubaiVisa.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

type TProps = {
  [key: string]: {
    normal: Array<{
      title: string;
      td: string;
      td1: string;
    }>;
    instant: Array<{
      title: string;
      td: string;
      td1: string;
    }>;
    electronic: Array<{
      title: string;
      td: string;
      td1: string;
    }>;
  };
};

const VisaPriceTableRussia: FC<TProps> = ({ price }) => {
  const { isMobile } = useDeviceDetect();

  return (
    <>
      {isMobile ? (
        <>
          {price.normal.map((item) => (
            <div key={item.title} className="px-3 border-bottom">
              <div className="fs-4 fw-500 py-3 color-on-surface">{item.title}</div>
              <div className="mt-2">
                <div className="d-flex justify-content-between">
                  <p className="fs-3 color-on-surface">نرخ ویزا‍</p>
                  <p className="fs-3 color-on-surface-var">{item.td}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="fs-3 color-on-surface">زمان پردازش</p>
                  <p className="fs-3 color-on-surface-var">{item.td1}</p>
                </div>
              </div>
            </div>
          ))}
          {price.instant?.map((item) => (
            <div key={item.title} className="px-3 border-bottom">
              <div className="fs-4 fw-500 py-3 color-on-surface">{item.title}</div>
              <div className="mt-2">
                <div className="d-flex justify-content-between">
                  <p className="fs-3 color-on-surface">نرخ ویزا‍</p>
                  <p className="fs-3 color-on-surface-var">{item.td}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="fs-3 color-on-surface"> زمان پردازش</p>
                  <p className="fs-3 color-on-surface-var">{item.td1}</p>
                </div>
              </div>
            </div>
          ))}
          {price.electronic?.map((item) => (
            <div key={item.title} className="px-3">
              <div className="fs-4 fw-500 py-3 color-on-surface">{item.title}</div>
              <div className="mt-2">
                <div className="d-flex justify-content-between">
                  <p className="fs-3 color-on-surface">نرخ ویزا‍</p>
                  <p className="fs-3 color-on-surface-var">{item.td}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="fs-3 color-on-surface"> زمان پردازش</p>
                  <p className="fs-3 color-on-surface-var">{item.td1}</p>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <table className={styles['visa-detail-container__price__table']}>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col" className="color-on-surface">
                نوع ویزا
              </th>
              <th scope="col" className="color-on-surface">
                نرخ ویزا‍
              </th>
              <th scope="col" className="color-on-surface">
                زمان پردازش
              </th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"></th>
              {price.normal.map((item) => (
                <>
                  <td className="color-on-surface">{item.title}</td>
                  <td className="color-on-surface-var">{item.td}</td>
                  <td className="color-on-surface-var">{item.td1}</td>
                </>
              ))}
            </tr>
            {price.instant && (
              <tr>
                <th scope="row"></th>
                {price.instant.map((item) => (
                  <>
                    <td className="color-on-surface">{item.title}</td>
                    <td className="color-on-surface-var">{item.td}</td>
                    <td className="color-on-surface-var">{item.td1}</td>
                  </>
                ))}
              </tr>
            )}
            {price.electronic && (
              <tr>
                <th scope="row"></th>
                {price.electronic.map((item) => (
                  <>
                    <td className="color-on-surface">{item.title}</td>
                    <td className="color-on-surface-var">{item.td}</td>
                    <td className="color-on-surface-var">{item.td1}</td>
                  </>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
};
export default VisaPriceTableRussia;
