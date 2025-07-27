import { ICompany } from 'containers/landingPage/types';
import styles from '../companies.module.scss';

type CompanyPropsType = {
  company: ICompany;
};

function Company({ company }: CompanyPropsType) {
  return (
    <>
      {company?.path === undefined ? (
        <div>
          <div className={styles['companies__item']}>
            {company.icon}
            <div>
              <span>{company.title}</span>
            </div>
          </div>
        </div>
      ) : (
        <a href={`${company?.path}`} className="text-decoration-none color-on-surface">
          <div className={styles['companies__item']}>
            {company.icon}
            <div>
              <span>{company.title}</span>
            </div>
          </div>
        </a>
      )}
    </>
  );
}

export default Company;
