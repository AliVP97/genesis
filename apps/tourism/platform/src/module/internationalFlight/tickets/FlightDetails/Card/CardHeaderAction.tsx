import { ArrowUpIcon, ArrowDownIcon } from 'assets/icons';
import styles from './CardHeaderAction.module.scss';

type CardHeaderActionProps = {
  isExpand: boolean;
};

const CardHeaderAction = ({ isExpand }: CardHeaderActionProps) => (
  <div className={styles['expand-icon']}>{isExpand ? <ArrowUpIcon /> : <ArrowDownIcon />}</div>
);

export default CardHeaderAction;
