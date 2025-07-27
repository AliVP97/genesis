import styles from '../styles/visaPage.module.scss';
import cn from 'classnames';
import { FC } from 'react';
import { VisaPriceTableProps } from './types';
import VisaPriceTableItem from '../visaPriceTableItem';

const VisaPriceTable: FC<VisaPriceTableProps> = ({ title, items }) => {
  return (
    <div dir="rtl" className={cn(styles['visa-detail-container__price'], 'my-4')}>
      <span className="fw-bold fs-4 py-1 color-on-surface">{title}</span>
      <div className={cn(styles['visa-detail-container__divider'], 'my-3')} />
      {items?.map((item, index) => {
        return (
          <VisaPriceTableItem
            key={index}
            title={item?.title}
            columns={item?.columns}
            rows={item?.rows}
          />
        );
      })}
    </div>
  );
};

export default VisaPriceTable;
