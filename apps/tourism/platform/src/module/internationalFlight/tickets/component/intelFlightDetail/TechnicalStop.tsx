import { InfoIcon } from 'assets/icons';
import cn from 'classnames';
import styles from './TechnicalStop.module.scss';

interface TechnicalStopProps {
  text: string | undefined;
}

const TechnicalStop = ({ text }: TechnicalStopProps) => {
  if (!text) {
    return null;
  }

  return (
    <div className={cn(styles.root, 'p-2 d-flex flex-row align-items-center mt-3')}>
      <InfoIcon className="ms-2 flex-shrink-0 align-self-start" />
      <p className={cn(styles.text, 'mb-0')}>{text}</p>
    </div>
  );
};

export default TechnicalStop;
