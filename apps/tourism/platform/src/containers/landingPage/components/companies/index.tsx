import { ICompany } from 'containers/landingPage/types';
import React from 'react';
import styles from './companies.module.scss';
import Company from './company';
type CompaniesPropsType = {
  title: string;
  companies: Array<ICompany>;
};

function Companies({ title, companies }: CompaniesPropsType) {
  return (
    <>
      <div className={styles['companies']}>
        <h5>{title}</h5>
        <div className="d-flex justify-content-center flex-wrap">
          {companies.map((item, index) => (
            <Company key={index.toString() + item.title} company={item} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Companies;
