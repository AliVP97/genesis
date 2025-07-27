import { FC } from 'react';
import styles from '../dubaiVisa.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

type TProps = {
  [key: string]: {
    single: Array<{
      title: string;
      td: string;
      td1: string;
      td2: string;
    }>;
    multi?: Array<{
      title: string;
      td: string;
      td1: string;
      td2: string;
    }>;
  };
};

const VisaPriceTableDubai: FC<TProps> = ({ price }) => {
  const { isMobile } = useDeviceDetect();

  return (
    <>
      {isMobile ? (
        <>
          {price.single.map((item) => (
            <div key={item.title} className="px-3 border-bottom">
              <div className="fs-4 fw-500 py-3">{item.title}</div>
              <div className="mt-2">
                <div className="d-flex justify-content-between">
                  <p className="fs-3 color-on-surface">ده روزه</p>
                  <p className="fs-3 color-on-surface-var">{item.td}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="fs-3 color-on-surface"> یک ماهه</p>
                  <p className="fs-3 color-on-surface-var">{item.td1}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="fs-3 color-on-surface"> دو ماهه</p>
                  <p className="fs-3 color-on-surface-var">{item.td2}</p>
                </div>
              </div>
            </div>
          ))}
          {price.multi?.map((item) => (
            <div key={item.title} className="px-3">
              <div className="fs-4 fw-500 py-3">{item.title}</div>
              <div className="mt-2">
                <div className="d-flex justify-content-between">
                  <p className="fs-3 color-on-surface">ده روزه</p>
                  <p className="fs-3 color-on-surface-var">{item.td}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="fs-3 color-on-surface"> یک ماهه</p>
                  <p className="fs-3 color-on-surface-var">{item.td1}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="fs-3 color-on-surface"> دو ماهه</p>
                  <p className="fs-3 color-on-surface-var">{item.td2}</p>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <table className={styles['visa-detail-container__price__table']}>
          <thead>
            <tr>
              <th scope="col" className="color-on-surface"></th>
              <th scope="col" className="color-on-surface"></th>
              <th scope="col" className="color-on-surface">
                ده روزه
              </th>
              <th scope="col" className="color-on-surface">
                یک ماهه
              </th>
              <th scope="col" className="color-on-surface">
                دو ماهه
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"></th>
              {price.single.map((item) => (
                <>
                  <td className="color-on-surface">{item.title}</td>
                  <td className="color-on-surface-var">{item.td}</td>
                  <td className="color-on-surface-var">{item.td1}</td>
                  <td className="color-on-surface-var">{item.td2}</td>
                </>
              ))}
            </tr>
            {price.multi && (
              <tr>
                <th scope="row"></th>
                {price.multi.map((item) => (
                  <>
                    <td className="color-on-surface">{item.title}</td>
                    <td className="color-on-surface-var">{item.td}</td>
                    <td className="color-on-surface-var">{item.td1}</td>
                    <td className="color-on-surface-var">{item.td2}</td>
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
export default VisaPriceTableDubai;
