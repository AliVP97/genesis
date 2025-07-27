import { InfoIcon } from 'assets/icons';
import styles from './compartmentWarning.module.scss';
import cn from 'classnames';
interface IProps {
  content: string;
}

const CompartmentWarning = ({ content }: IProps) => {
  return (
    <>
      <div className={cn(styles['warning'], 'bg-color-white-2 d-flex flex-row py-3')}>
        <div>
          {' '}
          <InfoIcon className={styles['warning__icon']} />
        </div>
        <div className={cn(styles['warning__content'], 'pe-1')}>{content}</div>
      </div>
    </>
  );
};
export default CompartmentWarning;
