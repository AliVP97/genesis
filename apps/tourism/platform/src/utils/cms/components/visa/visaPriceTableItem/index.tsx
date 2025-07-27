import { FC } from 'react';
import { VisaPriceTableItemProps } from '../visaPriceTable/types';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import styles from '../styles/visaPage.module.scss';
import cn from 'classnames';

const VisaPriceTableItem: FC<VisaPriceTableItemProps> = ({ title, columns, rows }) => {
  const { isMobile } = useDeviceDetect();
  return (
    <div className={cn(isMobile && styles['visa-detail-container__price__card'])}>
      {title && (
        <div className={cn(isMobile && styles['visa-detail-container__price__card__title'])}>
          <span className={cn(!isMobile && 'fs-3 fw-bold py-3 pe-3 color-on-surface')}>
            {title}
          </span>
        </div>
      )}
      {isMobile ? (
        <>
          {rows?.map((row, rowIndex) => (
            <div key={row?.id} className={cn(rowIndex !== 0 && 'border-top', 'p-3')}>
              {columns?.map((col, colIndex) => {
                if (colIndex === 0) {
                  return (
                    <div key={col?.id} className="fs-4 fw-500 pb-3">
                      <span>{row[col.key]}</span>
                    </div>
                  );
                } else {
                  return (
                    <div key={col?.id} className="d-flex justify-content-between pb-2">
                      <span className="fs-3 color-on-surface">{col?.label}</span>
                      <span className="fs-3 color-on-surface-var">{row[col.key]}</span>
                    </div>
                  );
                }
              })}
            </div>
          ))}
        </>
      ) : (
        <div className={cn(isMobile && styles['visa-detail-container__price__card'])}>
          <table className={styles['visa-detail-container__price__table']}>
            <thead>
              <tr>
                {columns?.map((col) => {
                  return (
                    <th key={col.id} scope="col" className="color-on-surface">
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows?.map((row) => (
                <tr key={row.id}>
                  {columns?.map((col, index) => {
                    return (
                      <td
                        key={col.id}
                        className={index === 0 ? 'color-on-surface' : 'color-on-surface-var'}
                      >
                        {row[col.key]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VisaPriceTableItem;
