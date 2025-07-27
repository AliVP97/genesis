import React from 'react';
import cn from 'classnames';
import styles from './table.module.scss';

interface TableProps {
  headers: string[];
  rows: any[]; // Adjust the type according to your data structure
  action?: boolean;
  tooltip?: string;
}

const Table: React.FC<TableProps> = ({ headers, rows, action, tooltip }) => {
  return (
    <div className={cn(styles['table_container'], 'table-responsive')}>
      {rows?.length === 0 &&
      tooltip ===
        ` *قیمت معادل هر نفر بزرگسال در اتاق دوتخته.
              *قیمت ها بر اساس ریال است.` ? (
        <div className={cn(styles['table_container__body__div'])}>
          <span className={cn(styles['table_container__body__div__p'])}>
            هیچ برنامه فعالی برای این تور موجود نمیباشد
          </span>
        </div>
      ) : (
        <table className="table">
          <thead className="fw-400 fs-2 align-content-center justify-content-center bg-color-blue-light-4">
            <tr>
              {headers?.map((header, index) => (
                <th
                  key={index.toString() + header}
                  title={tooltip}
                  className={
                    action
                      ? cn(styles['table_container__header__th-with-action'])
                      : cn(styles['table_container__header__th'])
                  }
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows?.map((row, rowIndex) => (
              <tr className={cn(styles['table_container__body__tr'])} key={rowIndex}>
                {headers.map((header, colIndex) => {
                  let cellValue = '';
                  switch (header) {
                    case 'نام هتل':
                      cellValue = row.accommodation?.name || '';
                      break;
                    case 'تاریخ رفت':
                      cellValue = row.startDate || '';
                      break;
                    case 'تاریخ برگشت':
                      cellValue = row.endDate || '';
                      break;
                    case 'تعداد شب':
                      cellValue = row.nightNo || '';
                      break;
                    case 'نوع سفر':
                      cellValue = row.transport?.name || '';
                      break;
                    case 'بزرگسال در اتاق دو تخته':
                      cellValue = row.adultPriceDouble || '';
                      break;
                    case 'بزرگسال در اتاق تک تخته':
                      cellValue = row.adultPriceSingle || '';
                      break;
                    case 'سرویس اضافه':
                      cellValue = row.additionalServicePrice || '';
                      break;
                    case 'کودک با تخت':
                      cellValue = row.childPriceWithBed || '';
                      break;
                    case 'کودک بدون تخت':
                      cellValue = row.childPriceWithoutBed || '';
                      break;
                    case 'نوزاد':
                      cellValue = row.infantPrice || '';
                      break;
                    default:
                      cellValue = '';
                  }
                  return (
                    <td
                      className={action ? cn(styles['table_container__body__th-with-action']) : ''}
                      key={colIndex}
                    >
                      {cellValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
