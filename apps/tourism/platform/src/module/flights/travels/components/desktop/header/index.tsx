import { LuggageIcon } from 'assets/icons';
import styles from '../../../travels.module.scss';
const TripsReportHeader = () => {
  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center px-3 py-2 border-bottom border-blue-grey ">
        <div className="d-flex flex-row ">
          <LuggageIcon className={styles['travels-container__luggage-icon']} />
          <div className="me-1">
            <span className="color-on-surface text-weight-500">مدیریت سفرها</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripsReportHeader;
