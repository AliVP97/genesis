import React from 'react';
import styles from './style.module.scss';
import { SuppliersProps } from './types';
import Supplier from './supplier';

function Suppliers({ title, items }: SuppliersProps) {
  return (
    <div dir="rtl" className="my-4">
      <div className={styles.companies}>
        <h5>{title}</h5>
        <div className="d-flex justify-content-center flex-wrap">
          {items?.map((item, index) => (
            <Supplier key={index.toString() + item.title} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Suppliers;
