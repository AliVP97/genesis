import React from 'react';
import cn from 'classnames';
import styles from 'components/table/table.module.scss';
import { EmptyTourListIcon } from 'assets/icons';

type RowData = {
  [key: string]: string | JSX.Element;
};
interface TableProps {
  headers: string[];
  rows: RowData[];
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
          <EmptyTourListIcon />
          <span className={cn(styles['table_container__body__div__p'])}>
            هیچ برنامه فعالی برای این تور موجود نمیباشد
          </span>
        </div>
      ) : (
        <table className="table">
          <thead className=" fw-400 fs-2 align-content-center justify-content-center bg-color-blue-light-4 ">
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
                {headers.map((header, colIndex) => (
                  <td
                    className={action ? cn(styles['table_container__body__th-with-action']) : ''}
                    key={colIndex}
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default Table;
