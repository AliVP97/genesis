import styles from './Loader.module.scss';
import classNames from 'classnames';
type CustomLoaderProps = {
  className?: string;
};

const Loader = ({ className }: CustomLoaderProps) => (
  <div className={classNames(styles['loader'], className)}></div>
);

export default Loader;
