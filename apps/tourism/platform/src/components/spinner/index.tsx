import cn from 'classnames';

import styles from './spinner.module.scss';

const Spinner = ({ fontSize = '5px', className = '' }) => {
  return <div style={{ fontSize }} className={cn(styles.loader, className)} />;
};

export default Spinner;
