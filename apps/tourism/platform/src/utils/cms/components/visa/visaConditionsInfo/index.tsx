import styles from '../styles/visaPage.module.scss';
import { Info } from 'assets/icons';
import parse from 'html-react-parser';
import { VisaConditionsProps } from '../visaConditions/types';

const VisaConditionsInfo = ({ info }: { info: VisaConditionsProps['info'] }) => {
  return (
    <div className={styles['visa-detail-container__documents__procedures']}>
      <Info />
      <span className="fw-bold">{info?.title}</span>
      {info?.content && parse(info?.content)}
    </div>
  );
};

export default VisaConditionsInfo;
