import React from 'react';
import styles from './style.module.scss';
import { CompanyAdvicePropsType } from './types';
import parse from 'html-react-parser';

function CompanyAdvice(cmdData: CompanyAdvicePropsType) {
  const { title, body, summary } = cmdData || {};
  const parsedBodyContent = body && parse(body ?? '');
  const parsedSummaryContent = summary && parse(summary ?? '');

  return (
    <div className="my-4">
      <div className={styles['company-advice']}>
        <div className="container d-flex justify-content-center align-items-center flex-column">
          <h3 className="fs-6">{title}</h3>
          <div className="col-12 col-lg-10">
            {parsedSummaryContent && <p className="pt-3">{parsedSummaryContent}</p>}
            {parsedBodyContent && <p className="pt-3">{parsedBodyContent}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyAdvice;
