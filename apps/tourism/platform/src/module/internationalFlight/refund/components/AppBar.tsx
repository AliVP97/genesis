import { BackArrowIcon, CloseIcon, AssignmentReturnIcon } from 'assets/icons';
import styles from './AppBar.module.scss';
import classNames from 'classnames';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

type AppBarProps = {
  onClose: () => void;
};

const AppBar = ({ onClose }: AppBarProps) => {
  const { isMobile } = useDeviceDetect();

  return (
    <div className={styles['app-bar']}>
      {isMobile && <BackArrowIcon className={styles.icon} onClick={onClose} />}
      {!isMobile && <AssignmentReturnIcon className={styles.icon} />}
      <span className={classNames('ms-auto', isMobile && 'me-auto', styles.title)}>استرداد</span>
      {!isMobile && <CloseIcon onClick={onClose} className={styles.icon} />}
    </div>
  );
};

export default AppBar;
