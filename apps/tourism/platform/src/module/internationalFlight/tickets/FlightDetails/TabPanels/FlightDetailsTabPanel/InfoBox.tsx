import { FilledInfoIcon } from 'assets/icons';
import styles from './InfoBox.module.scss';

type InfoBoxProps = {
  text: string;
};

const InfoBox = ({ text }: InfoBoxProps) => (
  <div>
    <FilledInfoIcon className={styles['icon']} />
    <span className={styles['text']}>{text}</span>
  </div>
);

export default InfoBox;
